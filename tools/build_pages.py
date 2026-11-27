#!/usr/bin/env python3
"""Build every activity page from the shared engine.

The app lives in three files:
  engine/page.html   the page shell (head, the HTML of the page), with two markers
  engine/styles.css  the app's styles
  engine/app.js      the app's code
  engine/build.html  the assignment builder page (teacher/build/), with the bank files at <!--BANK_JS-->
  bank/*.js          the question bank: one file per question, loaded before the engine
Every activity folder's index.html (and the root index.html) is written from them,
loading the styles and the code from engine/ with a version stamp, so a browser
fetches the new files after each change.

  python3 tools/build_pages.py            write every page
  python3 tools/build_pages.py --check    exit 1 if any page is out of date
  python3 tools/build_pages.py --split    one time only: make engine/ from 2-4a/index.html
"""
import hashlib, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COPIES = ("1-1a 1-1b 1-1c 1-2a 1-2b 1-2c 1-3a 1-3b 1-4a 1-4b 1-4c 1-4d 2-1a 2-1b 2-2a 2-2b 2-2c "
          "2-4a 2-4b 3-1a 3-1b 3-1c 3-1d 3-1e 3-1f 3-1g 3-3a 3-3b 3-4a 3-4b "
          "a playdata playgraph playsolve q revq2 revt1").split()
CSS_MARK, JS_MARK = "<!--ENGINE_CSS-->", "<!--ENGINE_JS-->"


def rd(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()


def wr(p, s):
    full = os.path.join(ROOT, p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8", newline="") as f:
        f.write(s)


def split():
    s = rd("2-4a/index.html")
    # the main stylesheet: the <style> right after the font block (the font block, id="fontcss", stays in the page: Show work reads it)
    a = s.index("</style>\n<style>\n", s.index('<style id="fontcss">')) + len("</style>\n")
    b = s.index("</style>\n</head>", a) + len("</style>")
    css = s[a + len("<style>"):b - len("</style>")]
    s = s[:a] + CSS_MARK + s[b:]
    # the main script: the last <script> in the body, to the closing tag before </body>
    c = s.index("\n<script>\n", s.index("<body>")) + 1
    d = s.rindex("</script>\n</body>") + len("</script>")
    js = s[c + len("<script>"):d - len("</script>")]
    s = s[:c] + JS_MARK + s[d:]
    wr("engine/styles.css", css)
    wr("engine/app.js", js)
    wr("engine/page.html", s)
    print("engine/ made: page.html %d, styles.css %d, app.js %d characters" % (len(s), len(css), len(js)))


def pages():
    shell, css, js = rd("engine/page.html"), rd("engine/styles.css"), rd("engine/app.js")
    bank = sorted(f for f in os.listdir(os.path.join(ROOT, "bank")) if f.endswith(".js")) if os.path.isdir(os.path.join(ROOT, "bank")) else []
    bankSrc = "".join(rd("bank/" + f) for f in bank)
    assert shell.count(CSS_MARK) == 1 and shell.count(JS_MARK) == 1, "engine/page.html must hold each marker once"
    v = hashlib.sha1((css + "\0" + js + "\0" + bankSrc).encode("utf-8")).hexdigest()[:10]
    out = {}
    for pre, name in (("../", None), ("", "index.html")):
        p = shell.replace(CSS_MARK, '<link rel="stylesheet" href="%sengine/styles.css?v=%s">' % (pre, v)).replace(JS_MARK, "".join('<script src="%sbank/%s?v=%s"></script>' % (pre, f, v) for f in bank) + '<script src="%sengine/app.js?v=%s"></script>' % (pre, v))
        if name:   # the root page: its icons sit beside it (no ../)
            p = re.sub(r'href="\.\./(favicon|icon-192|apple-touch)', r'href="\1', p)
            out[name] = p
        else:
            for d in COPIES:
                out[d + "/index.html"] = p
    # the assignment builder (teacher/build/): its own page, with every bank file (step 6)
    if os.path.exists(os.path.join(ROOT, "engine/build.html")):
        out["teacher/build/index.html"] = rd("engine/build.html").replace("<!--BANK_JS-->", "".join('<script src="../../bank/%s?v=%s"></script>' % (f, v) for f in bank))
    return out


def main():
    if "--split" in sys.argv:
        split()
    stale = [p for p, s in pages().items() if not os.path.exists(os.path.join(ROOT, p)) or rd(p) != s]
    if "--check" in sys.argv:
        if stale:
            print("out of date: " + ", ".join(stale)); sys.exit(1)
        print("all %d pages up to date" % len(pages())); return
    for p, s in pages().items():
        wr(p, s)
    print("wrote %d pages (%d changed)" % (len(pages()), len(stale)))


if __name__ == "__main__":
    main()
