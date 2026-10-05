# Norman's research profile

Personal academic website for Nguyễn Khắc Trung Kiên (Norman), published at
<https://knn-07.github.io/>.

## Design and content

An original, responsive static design inspired by the readable academic layout of
[Trung Dang's profile](https://kuroni.github.io/) and its
[al-folio source](https://github.com/kuroni/kuroni.github.io). No theme code,
photograph, biography, or publication entries are copied from that site.

The profile consolidates the biography, research interests, three education
entries, four experience entries, ten honors, four projects, OpenPrism Labs
article, contact channels, and downloadable CV from `norman-profile`. The newer
profile takes precedence over old GitHub Pages content for dates and social
handles. The degree name follows the supplied CV PDF: Bachelor of Computing
(Hons) in Data Science and Artificial Intelligence. Publication and talk lists
remain explicitly empty; the previous commented-out sample papers are removed.

All profile content is in HTML, not fetched at runtime. Native section anchors
and expandable project/article details work without JavaScript. JavaScript only
adds a persistent light/dark preference and the navigation's current-section
indicator. The design includes keyboard focus styles, a skip link, reduced-motion
support, small-screen layouts, and print styling. There are no third-party fonts,
icon libraries, runtime packages, analytics, or build dependencies.

## Edit

- `index.html`: biography, research, projects, education, experience, honors,
  writing, and contact links. Keep section IDs stable to preserve shared links.
- `css/style.css`: layout, colors, responsive breakpoints, and print styles.
- `js/theme.js`: initial theme preference, applied before rendering.
- `js/site.js`: theme button and current-section navigation indicator.
- `favicon.svg`: monogram icon.
- `cv.pdf`: downloadable CV, copied from
  `norman-profile/public/documents/cvnorman.pdf`. Replace this file when updating
  the CV; editing HTML does not regenerate the PDF.

`cv_ats.tex` and `extracted_site_content.md` are retained historical source
material from the previous website. They do not generate or populate the current
site or its PDF. Do not treat their older dates or sample publications as current.

## Preview

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173/>. No installation or build is required.

Before publishing, check desktop and mobile layouts, section links (including
opening `/#cv` directly), both themes and persistence on reload, expandable
project details and writing, the contact links, and the downloadable PDF. Core
content and disclosures must also work with JavaScript disabled.

## Deploy

GitHub Pages publishes the **root directory of `main`** using its existing
branch-based deployment. Push the site files to `main`; no Actions workflow or
framework migration is required. Check the repository's Pages deployment before
expecting the public URL to update. Assets use relative paths and the existing
`cv.pdf` URL and `#about`, `#cv`, `#openprism`, and `#projects` anchors are preserved.
