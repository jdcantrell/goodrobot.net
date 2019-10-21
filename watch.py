#!/usr/bin/env python
import glob

from livereload import Server, shell, watcher


class RecursiveWatcher(watcher.Watcher):
    def is_glob_changed(self, path, ignore=None):
        for f in glob.glob(path, recursive=True):
            if self.is_file_changed(f, ignore):
                return True
        return False


server = Server(watcher=RecursiveWatcher())
server.watch("./**/*.j2", shell("./go.sh generate_site", cwd="./"))
server.watch("./**/*.sass", shell("./go.sh css", cwd="./"))
server.serve(root="./build/")
