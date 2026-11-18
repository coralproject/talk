#!/usr/bin/env bash
# Serve a minimal third-party "CMS article" page on its own origin that embeds
# Coral with the public embed snippet. Runs in the foreground.
#
#   host-page.sh [port]     # default 8000 -> http://localhost:8000/?story=demo-1
#
# The page origin must be in the site's allowedOrigins (seed-install.sh adds
# http://localhost:8000); use another port to exercise the rejection path.
set -euo pipefail

PORT="${1:-${TALK_HOST_PAGE_PORT:-8000}}"
CORAL_URL="${CORAL_URL:-http://localhost:3000}"
# The webpack dev server (8080) serves the live, watched embed bundle; fall
# back to CORAL_URL when only the server is running.
EMBED_SCRIPT_URL="${TALK_EMBED_SCRIPT_URL:-http://localhost:8080/assets/js/embed.js}"

dir="$(mktemp -d "${TMPDIR:-/tmp}/talk-host-page.XXXXXX")"
trap 'rm -rf "$dir"' EXIT

cat >"$dir/index.html" <<HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Host page (third-party embed test)</title>
  </head>
  <body style="max-width: 720px; margin: 0 auto; font-family: sans-serif">
    <h1 id="headline">Host page article</h1>
    <p>Origin: <code id="origin"></code>, story: <code id="story"></code></p>
    <div id="coral_thread"></div>
    <script>
      var params = new URLSearchParams(location.search);
      var storyID = params.get("story") || "demo-1";
      document.getElementById("origin").textContent = location.origin;
      document.getElementById("story").textContent = storyID;
      (function () {
        var d = document, s = d.createElement("script");
        s.src = "${EMBED_SCRIPT_URL}";
        s.async = false;
        s.defer = true;
        s.onload = function () {
          window.CoralStreamEmbed = Coral.createStreamEmbed({
            id: "coral_thread",
            autoRender: true,
            rootURL: "${CORAL_URL}",
            storyID: storyID,
            storyURL: location.origin + "/?story=" + storyID,
          });
        };
        (d.head || d.body).appendChild(s);
      })();
    </script>
  </body>
</html>
HTML

echo "serving host page at http://localhost:${PORT}/?story=demo-1 (Coral: ${CORAL_URL})"
cd "$dir"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
