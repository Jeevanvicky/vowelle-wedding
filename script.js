/* =========================================================
   PREMIUM WEDDING DEMO V2
   Lightweight interaction layer.
   ========================================================= */

(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const heroImage = document.querySelector(".hero-image");

  // Page entrance
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      document.getElementById("pageLoader")?.classList.add("loaded");
    }, 350);
  });

  // Mobile navigation
  menuButton?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Header state + one lightweight hero parallax.
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;

        header?.classList.toggle("scrolled", y > 30);

        if (heroImage && !prefersReduced && y < window.innerHeight) {
          heroImage.style.transform =
            `translate3d(0, ${Math.min(y * 0.10, 55)}px, 0) scale(1.05)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scroll reveals: no scroll polling, no perpetual animation loop.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Countdown
  const target = new Date("2026-08-30T10:00:00+05:30").getTime();
  const fields = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  function pad(value) {
    return String(Math.max(0, value)).padStart(2, "0");
  }

  function updateCountdown() {
    const diff = Math.max(0, target - Date.now());
    const totalSeconds = Math.floor(diff / 1000);

    fields.days.textContent = pad(Math.floor(totalSeconds / 86400));
    fields.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    fields.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    fields.seconds.textContent = pad(totalSeconds % 60);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Demo RSVP feedback
  const message = document.getElementById("rsvpMessage");

  document.getElementById("acceptRsvp")?.addEventListener("click", () => {
    message.textContent = "Wonderful — your RSVP has been noted for this demo.";
  });

  document.getElementById("maybeRsvp")?.addEventListener("click", () => {
    message.textContent = "No problem — we'll keep a place open for you.";
  });
})();
