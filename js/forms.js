/* =============================================================================
   PENTIUM CHAMBERS — forms.js
   Accessible client-side validation + submission layer.
   -----------------------------------------------------------------------------
   BACKEND-READY: when window.PENTIUM.api.enabled === true, valid submissions are
   POSTed as JSON to the endpoint named in each form's data-endpoint attribute
   (mapped through PENTIUM.api). Until then, a safe local demo handler runs and
   shows success/error UI without sending anything.
   ========================================================================== */
(function () {
  "use strict";

  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const P = window.PENTIUM || { api: { enabled: false } };

  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    phone: /^[+()\-\s\d]{7,20}$/
  };

  const ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const ICON_ERR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>';

  function validateField(field) {
    const input = field.querySelector(".control, input[type=checkbox]");
    if (!input) return true;
    const val = (input.value || "").trim();
    const required = input.hasAttribute("required");
    let ok = true, msg = "";

    if (input.type === "checkbox") {
      ok = !required || input.checked;
      msg = "Please confirm to continue.";
    } else if (required && !val) {
      ok = false; msg = "This field is required.";
    } else if (val && input.type === "email" && !patterns.email.test(val)) {
      ok = false; msg = "Enter a valid email address.";
    } else if (val && input.getAttribute("inputmode") === "tel" && !patterns.phone.test(val)) {
      ok = false; msg = "Enter a valid phone number.";
    } else if (val && input.hasAttribute("minlength") && val.length < +input.getAttribute("minlength")) {
      ok = false; msg = "Please provide a little more detail.";
    }

    field.setAttribute("data-invalid", String(!ok));
    field.setAttribute("data-valid", String(ok && !!val));
    const errEl = field.querySelector(".field-error");
    if (errEl && !ok) errEl.textContent = msg;
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  }

  function setStatus(form, type, text) {
    const box = form.querySelector(".form-status");
    if (!box) return;
    box.setAttribute("data-type", type);
    box.innerHTML = (type === "success" ? ICON_OK : ICON_ERR) + "<span>" + text + "</span>";
    box.setAttribute("role", "status");
  }

  function toast(type, text) {
    let region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("data-type", type);
    el.innerHTML = (type === "success" ? ICON_OK : ICON_ERR) + "<span>" + text + "</span>";
    region.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateY(12px)"; }, 4200);
    setTimeout(() => el.remove(), 4800);
  }

  async function submit(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    const endpointKey = form.getAttribute("data-endpoint");
    const btn = form.querySelector("[type=submit]");
    const original = btn ? btn.innerHTML : "";

    if (btn) { btn.disabled = true; btn.innerHTML = "Sending&hellip;"; }

    try {
      if (P.api && P.api.enabled && endpointKey && P.api[endpointKey]) {
        // --- Real backend path -------------------------------------------
        const res = await fetch(P.api[endpointKey], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Request failed");
      } else {
        // --- Local demo path (no network) --------------------------------
        await new Promise((r) => setTimeout(r, 900));
        // eslint-disable-next-line no-console
        console.info("[Pentium] Form captured locally (backend disabled):", data);
      }
      const msg = form.getAttribute("data-success") ||
        "Thank you. Your message has been received — our team will respond shortly.";
      setStatus(form, "success", msg);
      toast("success", "Message sent successfully.");
      form.reset();
      $$(".field", form).forEach((f) => { f.removeAttribute("data-valid"); f.removeAttribute("data-invalid"); });
    } catch (err) {
      setStatus(form, "error", "Something went wrong. Please try again, or email " + (P.firm ? P.firm.email : "us") + ".");
      toast("error", "Submission failed. Please retry.");
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = original; }
    }
  }

  function initForm(form) {
    form.setAttribute("novalidate", "novalidate");
    const fields = $$(".field", form);

    fields.forEach((field) => {
      const input = field.querySelector(".control, input[type=checkbox]");
      if (!input) return;
      input.addEventListener("blur", () => validateField(field));
      input.addEventListener("input", () => {
        if (field.getAttribute("data-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      fields.forEach((f) => { if (!validateField(f)) ok = false; });
      if (!ok) {
        setStatus(form, "error", "Please review the highlighted fields.");
        const firstBad = form.querySelector('.field[data-invalid="true"] .control');
        if (firstBad) firstBad.focus();
        return;
      }
      submit(form);
    });
  }

  function init() {
    $$("form[data-form]").forEach(initForm);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
