import sys
import os
import codecs
import re
import shutil
import datetime

from jinja2 import Environment, FileSystemLoader
from jinja2.exceptions import TemplateNotFound, TemplateError
import markupsafe

from PIL import Image

import yaml
import mistune
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter


def print_error(msg):
    print(" \033[91m !!~\033[00m {}".format(msg))


def build_dirs():
    dir_list = ["build"]
    file_list = []
    for subdir, dirs, files in os.walk("src"):
        if subdir.find(os.path.join("", "_")) == -1:
            build_dir = subdir.replace("src", "build", 1)
            for dir in dirs:
                if dir.find("_") != 0:
                    dir_list.append(os.path.join(build_dir, dir))
            for file in files:
                if file.find("_") != 0:
                    file_list.append(
                        (os.path.join(subdir, file), os.path.join(build_dir, file))
                    )

    for dir in dir_list:
        try:
            print("Creating %s" % dir)
            os.mkdir(dir)
        except OSError:
            pass

    for src, dest in file_list:
        try:
            shutil.copyfile(src, dest)
        except shutil.SameFileError:
            print("Could not copy %s to %s, another file exists!" % (src, dest))
        except OSError:
            print(
                "Could not copy %s to %s, do we have write permissions?" % (src, dest)
            )


def should_process_dir(subdir):
    ignore_dirs = [
        "{}_".format(os.path.sep),  # ignore dirs that start with _
        ".git",
        "node_modules",
    ]

    if any(ignore_dir in subdir for ignore_dir in ignore_dirs):
        return False
    return True


def template_generate_preview(value, size=None):
    thumb_dir = os.path.join("build", "images", "thumbs")
    try:
        os.mkdir(thumb_dir)
    except OSError:
        pass

    image_path = os.path.join("src", value)
    if os.path.isfile(image_path):
        im = Image.open(image_path)

        if size == "full":
            thumb_filename = "{}-full.jpg".format(
                os.path.splitext(os.path.basename(image_path))[0]
            )
            thumb_path = os.path.join("build", "images", "thumbs", thumb_filename)
            thumb_web_path = "/".join(["/images", "thumbs", thumb_filename])
            rgb_im = im.convert("RGB")
            rgb_im.save(thumb_path, "jpeg", quality=85)
            print("Exported %s" % thumb_path)

            return thumb_web_path
        else:
            im.thumbnail((730, 730), Image.Resampling.LANCZOS)
            thumb_filename = "{}.jpg".format(
                os.path.splitext(os.path.basename(image_path))[0]
            )
            if im.has_transparency_data:
                thumb_filename = "{}.png".format(
                    os.path.splitext(os.path.basename(image_path))[0]
                )

            thumb_path = os.path.join("build", "images", "thumbs", thumb_filename)
            thumb_web_path = "/".join(["/images", "thumbs", thumb_filename])
            rgb_im = im.convert("RGBA" if im.has_transparency_data else "RGB")
            if im.has_transparency_data:
                rgb_im.save(thumb_path, "png")
            else:
                rgb_im.save(thumb_path, "jpeg", quality=85)
            print("Exported %s" % thumb_path)

            return thumb_web_path

    else:
        print_error("Could not find %s to create preview" % image_path)
        return "missing.png"


def tpls():
    tpls = []
    for subdir, dirs, files in os.walk("src"):
        build_dir = subdir.replace("src", "build", 1)
        if should_process_dir(subdir):
            for file in files:
                if file.find("_") != 0 and os.path.splitext(file)[1] == ".j2":
                    tpls.append(
                        (
                            os.path.join(subdir, file),
                            os.path.join(build_dir, os.path.splitext(file)[0]),
                        )
                    )

    post_vars = posts_details()
    print(post_vars)
    env = Environment(loader=FileSystemLoader(os.path.abspath("src")))
    env.filters["preview"] = template_generate_preview
    for src, dest in tpls:

        print("Generating %s" % dest)
        template = env.get_template(src.replace("src/", ""))
        try:
            html = template.render(
                {
                    "posts": post_vars,
                    "generated_date": datetime.datetime.now(datetime.UTC).isoformat()
                    + "Z",
                }
            )

            destfile = codecs.open(dest, "w", "utf-8")
            destfile.write(html)
            destfile.close()
        except TemplateError as err:
            print_error("could not parse template: %s" % err)


def strip_yaml(file_content):
    regex = re.compile("^---\n", re.MULTILINE)

    # if a yaml delimiter is the very first thing in the file grab it an
    # strip it out
    yaml_delimiters = regex.finditer(file_content)
    yaml_start = -1
    yaml_end = -1
    for d in yaml_delimiters:
        if yaml_start == -1:
            if d.start() == 0:
                yaml_start = 0
            else:
                break
        else:
            yaml_end = d.end()
            break

    if yaml_start != -1 and yaml_end != -1:
        yaml_src = file_content[yaml_start:yaml_end]
        yamls = yaml.safe_load_all(yaml_src)
        template_vars = next(yamls)

        file_content = file_content.replace(yaml_src, "")
    else:
        template_vars = {}

    return file_content, template_vars


def posts_details():
    posts = []
    for subdir, dirs, files in os.walk("src"):
        build_dir = subdir.replace("src", "build", 1)
        if subdir == os.path.join("src", "posts"):
            for file in files:
                file_parts = os.path.splitext(file)
                if file.find("_") != 0 and file_parts[1] == ".md":
                    posts.append(
                        (
                            os.path.join(subdir, file),
                            os.path.join(build_dir, "%s.html" % file_parts[0]),
                        )
                    )

    post_vars = []
    for src, dest in posts:
        print("Generating %s" % dest)
        with open(src, "r") as content_file:

            content, template_vars = strip_yaml(content_file.read())
            if template_vars.setdefault("published", True):
                post_vars.append(
                    {
                        "date": template_vars.setdefault("date", None),
                        "title": template_vars.setdefault("title", "No title"),
                        "tags": template_vars.setdefault("tags", "tags"),
                        "orignal_values": template_vars,
                        "path": dest.replace("build", ""),
                        "content": get_html(content),
                    }
                )

    post_vars = sorted(post_vars, key=lambda post: post["date"], reverse=True)
    return post_vars


def get_html(post_content):
    md = mistune.Markdown(renderer=Renderer(escape=False))

    return md(post_content)


def md():
    tpls = []
    for subdir, dirs, files in os.walk("src"):
        build_dir = subdir.replace("src", "build", 1)
        if subdir.find(os.path.join("", "_")) == -1:
            for file in files:
                file_parts = os.path.splitext(file)
                if file.find("_") != 0 and file_parts[1] == ".md":
                    tpls.append(
                        (
                            os.path.join(subdir, file),
                            os.path.join(build_dir, "%s.html" % file_parts[0]),
                        )
                    )

    md = mistune.Markdown(renderer=Renderer(escape=False))
    env = Environment(loader=FileSystemLoader(os.path.abspath("src")))

    try:
        template = env.get_template("_tpls/post.html.j2")
    except TemplateNotFound:
        print("Could not find src/_tpls/post.html.j2, has it been created?")
        return

    for src, dest in tpls:
        print("Generating %s" % dest)
        with open(src, "r") as content_file:
            content, template_vars = strip_yaml(content_file.read())

            if "published" in template_vars and not template_vars["published"]:
                print(f"Skipping {src}, not published")
            else:
                markdown_html = md(content)
                template_vars["markdown"] = markupsafe.Markup(markdown_html)

                html = template.render(template_vars)

                destfile = codecs.open(dest, "w", "utf-8")
                destfile.write(html)
                destfile.close()


class Renderer(mistune.HTMLRenderer):
    def block_code(self, code, info=None):
        if not info:
            return "\n<pre><code>%s</code></pre>\n" % mistune.escape(code)
        else:
            lang, *parts = info.split("::")

            lexer = get_lexer_by_name(lang, stripall=True)
            formatter = HtmlFormatter(linenos=True)
            highlighted_code = highlight(code, lexer, formatter)

            if len(parts):
                name, *links = parts
                link_tags = []
                for link in links:
                    print(link)
                    title, href = link.split(";;")
                    link_tags.append('<a href="{}">{}</a>'.format(href, title))

                header = '<div class="code-header">{} {}</div>'.format(
                    name, " ".join(link_tags)
                )
                return header + highlighted_code

            return highlighted_code


action = sys.argv[1]

if action == "dirs":
    build_dirs()
elif action == "tpls":
    tpls()
elif action == "md":
    md()
