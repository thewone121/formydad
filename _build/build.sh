#!/usr/bin/env bash
# Assembles a full HTML page from shared partials + per-page meta/main.
set -e
cd "$(dirname "$0")/.."
build() {
  slug=$1
  {
    echo '<!DOCTYPE html>'
    echo '<html lang="en" data-theme="light">'
    echo '<head>'
    cat _build/head-top.html
    cat _build/${slug}.meta.html
    cat _build/head-assets.html
    echo '</head>'
    echo '<body>'
    cat _build/header.html
    echo '  <main id="main">'
    cat _build/${slug}.main.html
    echo '  </main>'
    cat _build/footer.html
    cat _build/scripts.html
  } > ${slug}.html
  # strip any stray zero-width chars
  perl -CSD -i -pe 's/\x{200B}|\x{200C}|\x{200D}|\x{FEFF}//g' ${slug}.html
  echo "built ${slug}.html ($(wc -l < ${slug}.html) lines)"
}
for s in "$@"; do build "$s"; done
