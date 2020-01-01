from datetime import date
import json
import os
import codecs

import click
from PIL import Image
from jinja2 import Environment, FileSystemLoader
from jinja2.exceptions import TemplateNotFound, TemplateError


today = date.today()
date_string = "{}-{}-{}".format(today.year, today.month, today.day)


def get_date(row):
    return row["date"]


def update_entries(row, rows):
    replaced = False
    for idx, r in enumerate(rows):
        if r["date"] == row["date"]:
            rows[idx] = row
            replaced = True
    if not replaced:
        rows.append(row)

    rows.sort(key=get_date)

    return rows


def render(tplfile, data, outfile):
    env = Environment(loader=FileSystemLoader(os.path.abspath("src/")))
    tpl = env.get_template("motd/{}".format(tplfile))
    try:
        print("render {} {}".format(tplfile, data))
        html = tpl.render(data)
        destfile = codecs.open(outfile, "w", "utf-8")
        destfile.write(html)
        destfile.close()
    except TemplateError as err:
        print("Could not parse template: %s" % err)


@click.command()
@click.argument("image", type=click.Path(exists=True))
@click.option(
    "--date", prompt="Date", help="The date to add", default=date_string,
)
@click.option(
    "--title", prompt="Title", help="The title for the picture",
)
def motd(image, date, title):
    # resize and copy image
    try:
        os.mkdir("src/images/motd")
    except OSError:
        pass

    im = Image.open(image)

    im.thumbnail((730, 730), Image.ANTIALIAS)

    thumb_filename = "{}.jpg".format(date)
    thumb_path = os.path.join("src", "images", "motd", thumb_filename)
    rgb_im = im.convert("RGB")
    rgb_im.save(thumb_path, "jpeg", quality=90)

    # add new row to file
    try:
        with open("motd.json") as json_file:
            rows = json.load(json_file)
    except FileNotFoundError:
        rows = []

    row = {"date": date, "image": thumb_filename, "title": title}

    rows = update_entries(row, rows)
    with open("motd.json", "w") as json_file:
        json.dump(rows, json_file)

    render("_date.html.j2", row, "build/motd/{}.html".format(date))
    render("_date.html.j2", row, "build/motd/today.html")
    render("_list.html.j2", {"rows": rows[::-1]}, "build/motd/index.html")


#   - date.html
#   - tiles.html
#   - today.html
#   - latest.html

if __name__ == "__main__":
    motd()
