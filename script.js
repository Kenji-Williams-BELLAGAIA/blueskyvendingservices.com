(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.style.display === "flex";
      nav.style.display = isOpen ? "none" : "flex";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    // Close on link click (mobile)
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 720px)").matches) {
          nav.style.display = "none";
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  // FAQ accordion
  const acc = document.querySelector("[data-accordion]");
  if (acc) {
    const items = Array.from(acc.querySelectorAll(".acc-item"));
    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        // close all
        items.forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          const panel = b.nextElementSibling;
          if (panel && panel.classList.contains("acc-panel")) panel.style.display = "none";
          const icon = b.querySelector(".acc-icon");
          if (icon) icon.textContent = "+";
        });
        // open current if it was closed
        if (!expanded) {
          btn.setAttribute("aria-expanded", "true");
          const panel = btn.nextElementSibling;
          if (panel && panel.classList.contains("acc-panel")) panel.style.display = "block";
          const icon = btn.querySelector(".acc-icon");
          if (icon) icon.textContent = "–";
        }
      });
    });
  }

  // Lead form (front-end only placeholder)
  const form = document.getElementById("leadForm");
  const status = document.getElementById("formStatus");

  function setStatus(message, ok = true) {
    if (!status) return;
    status.className = "form__status " + (ok ? "status--ok" : "status--bad");
    status.textContent = message;
  }

  function validate(formEl) {
    const required = formEl.querySelectorAll("[required]");
    for (const el of required) {
      if (!el.value || !String(el.value).trim()) {
        el.focus();
        return { ok: false, msg: `Please fill out: ${labelFor(el)}` };
      }
      if (el.minLength && String(el.value).trim().length < el.minLength) {
        el.focus();
        return { ok: false, msg: `Please enter a longer value for: ${labelFor(el)}` };
      }
      if (el.type === "email") {
        const v = String(el.value).trim();
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        if (!validEmail) {
          el.focus();
          return { ok: false, msg: "Please enter a valid email address." };
        }
      }
    }
    return { ok: true, msg: "" };
  }

  function labelFor(el) {
    const label = el.closest("label");
    if (!label) return "this field";
    const text = label.childNodes[0]?.textContent || "this field";
    return text.replace(/\s+/g, " ").trim();
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      setStatus("");
      const result = validate(form);
      if (!result.ok) {
        setStatus(result.msg, false);
        return;
      }

      // Demo-only: you can connect to email/CRM later
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Submitting...";
      }

      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Request placement";
        }
        form.reset();
        setStatus("Thanks! Your request was received. We’ll follow up shortly.", true);
      }, 650);
    });
  }
})();