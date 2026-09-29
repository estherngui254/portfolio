/* =========================================================
   Esther Syombua — Portfolio interactions
   Mobile menu · live clock · scroll-spy · reveal on scroll
   ========================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!hamburger || !navLinks) return;
    hamburger.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
  }

  function toggleMenu() {
    var isOpen = navLinks.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", toggleMenu);

    // Close after choosing a section
    navLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    // Reset when returning to desktop width
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Live clock (Africa/Nairobi) ---------- */
  var clockEl = document.getElementById("liveClock");

  function updateClock() {
    if (!clockEl) return;
    try {
      clockEl.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Nairobi",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(new Date());
    } catch (error) {
      // Fallback for browsers without Intl time-zone support
      clockEl.textContent = new Date().toLocaleTimeString();
    }
  }

  if (clockEl) {
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky nav shadow ---------- */
  var navWrap = document.querySelector(".nav-wrap");

  function onScrollNav() {
    if (!navWrap) return;
    navWrap.classList.toggle("is-stuck", window.scrollY > 8);
  }

  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll(".reveal")
  );

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Scroll-spy: highlight active nav link ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var menuAnchors = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a[href^='#']")
  );

  function setActiveLink(id) {
    menuAnchors.forEach(function (anchor) {
      var isActive = anchor.getAttribute("href") === "#" + id;
      anchor.classList.toggle("is-active", isActive);
      if (isActive) {
        anchor.setAttribute("aria-current", "true");
      } else {
        anchor.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }
})();
