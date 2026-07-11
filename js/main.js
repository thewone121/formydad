/* =============================================================================
   PENTIUM CHAMBERS — main.js
   UI behaviour. Vanilla JS, no dependencies. Each concern is an isolated module
   initialised on DOMContentLoaded so features fail independently and safely.
   ========================================================================== */
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx) => (ctx || doc).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || doc).querySelectorAll(sel));

  /* ------------------------------------------------------------------ THEME */
  const Theme = {
    key: "pentium-theme",
    init() {
      const saved = this.get();
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      this.apply(saved || system, false);
      $$("[data-theme-toggle]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
          this.apply(next, true);
        })
      );
    },
    get() { try { return localStorage.getItem(this.key); } catch (e) { return null; } },
    apply(mode, persist) {
      root.setAttribute("data-theme", mode);
      $$("[data-theme-toggle]").forEach((b) =>
        b.setAttribute("aria-label", mode === "dark" ? "Switch to light theme" : "Switch to dark theme")
      );
      if (persist) { try { localStorage.setItem(this.key, mode); } catch (e) {} }
    }
  };

  /* ----------------------------------------------------------------- HEADER */
  const Header = {
    init() {
      const el = $(".site-header");
      if (!el) return;
      let last = window.scrollY;
      let ticking = false;
      const update = () => {
        const y = window.scrollY;
        el.setAttribute("data-state", y > 24 ? "scrolled" : "top");
        // Hide on scroll-down (past hero), reveal on scroll-up.
        if (y > 480 && y > last + 4) el.setAttribute("data-hidden", "true");
        else if (y < last - 4 || y < 480) el.setAttribute("data-hidden", "false");
        last = y;
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
      update();
    }
  };

  /* -------------------------------------------------------- SCROLL PROGRESS */
  const Progress = {
    init() {
      const bar = $(".scroll-progress");
      if (!bar) return;
      let ticking = false;
      const update = () => {
        const h = doc.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? window.scrollY / h : 0;
        bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
      update();
    }
  };

  /* ------------------------------------------------------------ BACK TO TOP */
  const BackToTop = {
    init() {
      const btn = $(".back-to-top");
      if (!btn) return;
      const toggle = () => btn.setAttribute("data-visible", window.scrollY > 700 ? "true" : "false");
      window.addEventListener("scroll", toggle, { passive: true });
      btn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
      );
      toggle();
    }
  };

  /* --------------------------------------------------------- MOBILE NAV -- */
  const MobileNav = {
    init() {
      const toggle = $(".nav-toggle");
      const drawer = $(".mobile-nav");
      const backdrop = $(".nav-backdrop");
      const closeBtn = $(".mobile-nav .nav-close");
      if (!toggle || !drawer) return;
      const open = () => {
        body.setAttribute("data-menu", "open");
        toggle.setAttribute("aria-expanded", "true");
        const first = drawer.querySelector("a, button");
        if (first) first.focus();
      };
      const close = () => {
        body.removeAttribute("data-menu");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      };
      toggle.addEventListener("click", () =>
        body.getAttribute("data-menu") === "open" ? close() : open()
      );
      if (closeBtn) closeBtn.addEventListener("click", close);
      if (backdrop) backdrop.addEventListener("click", close);
      $$(".mobile-nav a").forEach((a) => a.addEventListener("click", close));
      doc.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && body.getAttribute("data-menu") === "open") close();
      });
    }
  };

  /* --------------------------------------------------------------- REVEAL */
  const Reveal = {
    init() {
      const items = $$("[data-reveal]");
      if (!items.length) return;
      if (prefersReduced || !("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-in"));
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      items.forEach((el) => io.observe(el));
    }
  };

  /* ------------------------------------------------------------- COUNTERS */
  const Counters = {
    init() {
      const nums = $$("[data-count]");
      if (!nums.length) return;
      const run = (el) => {
        const target = parseFloat(el.getAttribute("data-count"));
        const decimals = (el.getAttribute("data-decimals") | 0);
        const dur = prefersReduced ? 0 : 1500;
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        const tick = (now) => {
          const p = dur === 0 ? 1 : Math.min(1, (now - start) / dur);
          const val = target * ease(p);
          el.textContent = val.toLocaleString("en-US", {
            minimumFractionDigits: decimals, maximumFractionDigits: decimals
          });
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      nums.forEach((el) => io.observe(el));
    }
  };

  /* ------------------------------------------------------------- TIMELINE */
  const Timeline = {
    init() {
      const tl = $(".timeline");
      if (!tl) return;
      const progress = $(".timeline-progress", tl);
      const items = $$(".tl-item", tl);
      const update = () => {
        const rect = tl.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height;
        const scrolled = Math.min(total, Math.max(0, vh * 0.5 - rect.top));
        if (progress) progress.style.height = (scrolled / total) * 100 + "%";
        items.forEach((it) => {
          const r = it.getBoundingClientRect();
          it.classList.toggle("is-active", r.top < vh * 0.6);
        });
      };
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    }
  };

  /* ------------------------------------------------------------ ACCORDION */
  const Accordion = {
    init() {
      $$(".accordion").forEach((acc) => {
        const single = acc.hasAttribute("data-single");
        const triggers = $$(".acc-trigger", acc);
        triggers.forEach((trigger) => {
          const panel = doc.getElementById(trigger.getAttribute("aria-controls"));
          if (!panel) return;
          trigger.addEventListener("click", () => {
            const isOpen = trigger.getAttribute("aria-expanded") === "true";
            if (single) {
              triggers.forEach((t) => {
                if (t !== trigger) {
                  t.setAttribute("aria-expanded", "false");
                  const p = doc.getElementById(t.getAttribute("aria-controls"));
                  if (p) p.style.height = "0px";
                  const item = t.closest(".acc-item");
                  if (item) item.setAttribute("data-open", "false");
                }
              });
            }
            trigger.setAttribute("aria-expanded", String(!isOpen));
            panel.style.height = isOpen ? "0px" : panel.scrollHeight + "px";
            const parent = trigger.closest(".acc-item");
            if (parent) parent.setAttribute("data-open", String(!isOpen));
          });
          // keep height correct on resize when open
          window.addEventListener("resize", () => {
            if (trigger.getAttribute("aria-expanded") === "true")
              panel.style.height = panel.scrollHeight + "px";
          });
        });
      });
      this.openFromHash();
      window.addEventListener("hashchange", () => this.openFromHash());
    },
    openFromHash() {
      const id = decodeURIComponent(location.hash.replace("#", ""));
      if (!id) return;
      const item = document.getElementById(id);
      if (!item || !item.classList.contains("acc-item")) return;
      const trigger = item.querySelector(".acc-trigger");
      if (trigger && trigger.getAttribute("aria-expanded") !== "true") {
        trigger.click();
        setTimeout(() => item.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" }), 60);
      }
    }
  };

  /* --------------------------------------------------------------- MODAL */
  const Modal = {
    lastFocus: null,
    init() {
      $$("[data-modal-open]").forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          const modal = doc.getElementById(trigger.getAttribute("data-modal-open"));
          if (modal) this.open(modal);
        });
      });
      $$(".modal").forEach((modal) => {
        $$("[data-modal-close], .modal-backdrop", modal).forEach((el) =>
          el.addEventListener("click", () => this.close(modal))
        );
      });
      doc.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const open = $('.modal[data-open="true"]');
          if (open) this.close(open);
        }
        if (e.key === "Tab") this.trap(e);
      });
    },
    open(modal) {
      this.lastFocus = doc.activeElement;
      modal.setAttribute("data-open", "true");
      body.style.overflow = "hidden";
      const focusable = this.focusables(modal);
      if (focusable.length) focusable[0].focus();
    },
    close(modal) {
      modal.setAttribute("data-open", "false");
      body.style.overflow = "";
      if (this.lastFocus) this.lastFocus.focus();
    },
    focusables(modal) {
      return $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', modal)
        .filter((el) => el.offsetParent !== null);
    },
    trap(e) {
      const modal = $('.modal[data-open="true"]');
      if (!modal) return;
      const f = this.focusables(modal);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  /* ------------------------------------------------------- COOKIE CONSENT */
  const Cookie = {
    key: "pentium-cookie-consent",
    init() {
      const banner = $(".cookie-banner");
      if (!banner) return;
      let decided = null;
      try { decided = localStorage.getItem(this.key); } catch (e) {}
      if (!decided) setTimeout(() => banner.setAttribute("data-open", "true"), 1200);
      const decide = (val) => {
        try { localStorage.setItem(this.key, val); } catch (e) {}
        banner.setAttribute("data-open", "false");
      };
      const accept = $("[data-cookie-accept]", banner);
      const decline = $("[data-cookie-decline]", banner);
      if (accept) accept.addEventListener("click", () => decide("accepted"));
      if (decline) decline.addEventListener("click", () => decide("declined"));
    }
  };

  /* --------------------------------------------------------- ACTIVE NAV */
  const NavState = {
    init() {
      let page = location.pathname.split("/").pop() || "index.html";
      if (page === "") page = "index.html";
      $$(".nav-link, .m-nav-link, .footer-col a").forEach((a) => {
        const href = (a.getAttribute("href") || "").split("#")[0];
        if (href && href === page) a.setAttribute("aria-current", "page");
      });
    }
  };

  /* ----------------------------------------------------- DYNAMIC FIRM DATA */
  const FirmData = {
    init() {
      const P = window.PENTIUM;
      if (!P) return;
      // Live year & years-of-practice tokens
      $$("[data-firm='year']").forEach((el) => (el.textContent = new Date().getFullYear()));
      $$("[data-firm='years']").forEach((el) => (el.textContent = P.stats.years));
      $$("[data-count='__years__']").forEach((el) => el.setAttribute("data-count", P.stats.years));
    }
  };

  /* -------------------------------------------------------------- INIT ALL */
  function init() {
    Theme.init();
    Header.init();
    Progress.init();
    BackToTop.init();
    MobileNav.init();
    NavState.init();
    FirmData.init();
    Reveal.init();
    Counters.init();
    Timeline.init();
    Accordion.init();
    Modal.init();
    Cookie.init();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();

  // Hero reveal on load (fires immediately — no preloader)
  window.addEventListener("load", () => {
    const hero = $(".hero");
    if (hero) requestAnimationFrame(() => hero.classList.add("is-ready"));
  });
  // Fallback so the hero is never stuck hidden if 'load' already fired
  const heroEl = $(".hero");
  if (heroEl) setTimeout(() => heroEl.classList.add("is-ready"), 60);

  window.PENTIUM_UI = { Modal, Theme };
})();
