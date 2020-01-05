from datetime import date, datetime, timedelta
import json
import os
import codecs

import click
from PIL import Image
from jinja2 import Environment, FileSystemLoader
from jinja2.exceptions import TemplateNotFound, TemplateError
from werkzeug.contrib.atom import AtomFeed


def get_rows():
    rows = []
    try:
        with open("motd.json") as json_file:
            rows = json.load(json_file)
    except FileNotFoundError:
        pass

    return rows


def get_date_string():
    rows = get_rows()

    if len(rows):
        last_date = datetime.strptime(rows[-1]["date"], "%Y-%m-%d")
        next_date = last_date + timedelta(days=1)
    else:
        next_date = date.today()

    return f"{next_date.year}-{next_date.month:02}-{next_date.day:02}"


date_string = get_date_string()


def get_date(row):
    return row["date"]


def update_entries(row, rows):
    replaced = False
    for idx, r in enumerate(rows):
        if r["date"] == row["date"]:
            print("\nFound existing row:")
            print(f" - Date: {r['date']}")
            print(f" - Title: {r['title']}")
            print(f" - Image: {r['image']}")
            click.confirm("Replace existing row?", abort=True)
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
        html = tpl.render(data)
        destfile = codecs.open(outfile, "w", "utf-8")
        destfile.write(html)
        destfile.close()
    except TemplateError as err:
        print("Could not parse template: %s" % err)


def render_list(rows):
    print("  - Rendering index.html...", end="")
    render("_list.html.j2", {"rows": rows[::-1]}, "build/motd/index.html")
    print("done.")


def render_day(row, is_today=False):
    print("  - Rendering {}.html...".format(row["date"]), end="")
    render("_date.html.j2", row, "build/motd/{}.html".format(row["date"]))
    print("done.")
    if is_today:
        print("  - Rendering today.html...", end="")
        render("_date.html.j2", row, "build/motd/today.html")
        print("done.")


def get_rss_html(row):
    env = Environment(loader=FileSystemLoader(os.path.abspath("src/")))
    tpl = env.get_template("motd/{}".format("_rss_entry.html.j2"))
    try:
        return tpl.render(row)
    except TemplateError as err:
        print("Could not parse template: %s" % err)
    return None


@click.group()
def motd():
    pass


@motd.command()
@click.argument("image", type=click.Path(exists=True))
@click.option(
    "--day", prompt="Date", help="The day to add", default=date_string,
)
@click.option(
    "--title", prompt="Title", help="The title for the picture",
)
def add(image, day, title):

    # validate day
    if day == "today":
        next_date = date.today()
        day = f"{next_date.year}-{next_date.month:02}-{next_date.day:02}"
    elif day == "tomorrow":
        next_date = date.today() + timedelta(days=1)
        day = f"{next_date.year}-{next_date.month:02}-{next_date.day:02}"
    else:
        try:
            user_date = datetime.strptime(day, "%Y-%m-%d")
            day = f"{user_date.year}-{user_date.month:02}-{user_date.day:02}"
        except ValueError:
            print("Cannot parse date {}, please use YYYY-MM-DD".format(day))
            return

    # resize and copy image
    try:
        os.mkdir("src/images/motd")
    except OSError:
        pass

    im = Image.open(image)

    im.thumbnail((1460, 1460), Image.ANTIALIAS)

    thumb_filename = "{}.jpg".format(day)
    thumb_path = os.path.join("src", "images", "motd", thumb_filename)
    rgb_im = im.convert("RGB")
    rgb_im.save(thumb_path, "jpeg", quality=90)

    # add new row to file
    row = {"date": day, "image": thumb_filename, "title": title}
    rows = update_entries(row, get_rows())
    with open("motd.json", "w") as json_file:
        json.dump(rows, json_file, indent=2)

    # link list windows to individual pages
    # maybe add rsync step?
    # render_update(rows)
    # tiles
    # rss feed


def is_today_or_earlier(row):
    last_date = datetime.strptime(row["date"], "%Y-%m-%d")
    if last_date <= datetime.today():
        return True
    return False


@motd.command()
@click.option("--all/--only-latest", default=False)
def build(all):
    rows = get_rows()
    earlier_rows = [row for row in rows if is_today_or_earlier(row)]
    print("Rendering most recent:")
    render_list(earlier_rows)
    render_day(earlier_rows[-1], True)

    if all:
        print("Rendering previous days:")
        for row in earlier_rows[:-1]:
            render_day(row)

    print("Rendering atom feed:")
    feed = AtomFeed(
        "motd",
        feed_url="https://goodrobot.net/motd/atom.xml",
        url="https://goodrobot.net/motd/",
        subtitle="Mango of the day",
    )
    for row in earlier_rows[-10:]:
        row_datetime = datetime.strptime(row["date"], "%Y-%m-%d")
        feed.add(
            row["title"],
            get_rss_html(row),
            url="https://goodrobot.net/motd/{}.html".format(row["date"]),
            content_type="html",
            updated=row_datetime,
            published=row_datetime,
            author="jd",
            title_type="text",
        )

    with open("build/motd/atom.xml", "wb") as atom_file:
        atom_file.write(feed.get_response().data)
        print("Done!")


if __name__ == "__main__":
    motd()
