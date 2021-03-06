#!/usr/local/bin/python3.10
import os
import sys
import requests
import cgi
import cgitb
import json

cgitb.enable()


def main():
    print("Content-Type: json/application")
    print()
    form = cgi.FieldStorage()
    if "dir" not in form:
        print(json.dumps(
            {"status": "error", "description": "url not specified"}
        ))
        return
    url = form['dir'].value
    if url is None:
        print(json.dumps(
            {"status": "error", "description": "No url provided", "dir": url}
        ))
        return
    if not os.path.isdir(url):
        print(json.dumps(
            {"status": "error", "description": "Not a directory", "dir": url}
        ))
        return
    else:
        dirs = [i for i in os.listdir(
            url) if os.path.isdir(os.path.join(url, i))]
        files = [i for i in os.listdir(
            url) if os.path.isfile(os.path.join(url, i))]
        dirs.sort()
        files.sort()
        dirs = [f"D:{i}" for i in dirs]
        files = [f"F:{i}" for i in files]
        fs = dirs + files
        print(json.dumps(
            {"status": "success", "description": "Geted.", "files": fs, "dir": url}
        ))
        return


if __name__ == "__main__":
    main()
