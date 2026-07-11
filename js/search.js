/* =============================================================================
   PENTIUM CHAMBERS — search.js
   Lightweight client-side site search over window.PENTIUM.searchIndex.
   Opens a full-screen overlay; keyboard accessible (⌘/Ctrl-K, Esc, arrows).
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const body = document.body;
  const overlay = $(".search-overlay");
  if (!overlay) return;

  const input = $(".search-input", overlay);
  const results = $(".search-results", overlay);
  const index = (window.PENTIUM && window.PENTIUM.searchIndex) || [];
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    body.setAttribute("data-search", "open");
    setTimeout(() => input && input.focus(), 60);
    render("");
  }
  function close() {
    body.removeAttribute("data-search");
    if (input) input.value = "";
    if (lastFocus) lastFocus.focus();
  }

  function score(item, q) {
    const hay = (item.title + " " + item.kind + " " + item.text).toLowerCase();
    if (!q) return 0;
    if (item.title.toLowerCase().startsWith(q)) return 3;
    if (item.title.toLowerCase().includes(q)) return 2;
    if (hay.includes(q)) return 1;
    return 0;
  }

  function render(q) {
    const query = q.trim().toLowerCase();
    if (!query) {
      results.innerHTML =
        '<p class="search-hint">Try “litigation”, “banking”, “data protection”, or a practice area.</p>';
      return;
    }
    const matched = index
      .map((item) => ({ item, s: score(item, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8);

    if (!matched.length) {
      results.innerHTML =
        '<p class="search-empty">No results for “' + escapeHtml(q) + '”. Try a broader term, or ' +
        '<a href="contact.html">contact our team</a>.</p>';
      return;
    }
    results.innerHTML = matched
      .map(({ item }) =>
        '<a class="search-result" href="' + item.url + '">' +
        '<span class="sr-kind">' + item.kind + '</span>' +
        "<strong>" + item.title + "</strong>" +
        "<span>" + item.text + "</span></a>"
      )
      .join("");
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Wire up open triggers, close, keyboard.
  Array.from(document.querySelectorAll("[data-search-open]")).forEach((b) =>
    b.addEventListener("click", (e) => { e.preventDefault(); open(); })
  );
  Array.from(overlay.querySelectorAll("[data-search-close]")).forEach((b) =>
    b.addEventListener("click", close)
  );
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  if (input) input.addEventListener("input", () => render(input.value));

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
    if (e.key === "Escape" && body.getAttribute("data-search") === "open") close();
    // Enter on the input jumps to the first result
    if (e.key === "Enter" && body.getAttribute("data-search") === "open") {
      const first = results.querySelector("a.search-result");
      if (first && document.activeElement === input) first.click();
    }
  });
})();
