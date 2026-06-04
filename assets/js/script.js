const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navPanel = document.getElementById("navPanel");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");
const miniGallery = document.getElementById("miniGallery");
const galleryButtons = document.querySelectorAll("[data-lightbox]");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

const syncHeader = () => {
  const hasScrolled = window.scrollY > 18;
  header.classList.toggle("scrolled", hasScrolled);
  backToTop.classList.toggle("show", window.scrollY > 640);
};

const closeMenu = () => {
  navPanel.classList.remove("open");
  navToggle.classList.remove("is-open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Buka menu");
};

navToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  navToggle.classList.toggle("is-open", isOpen);
  header.classList.toggle("menu-active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    closeMenu();

    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    smoothScrollTo(target);
  });
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

const watchedSections = document.querySelectorAll(".section-watch");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── Animated Stat Counters ───
const statNumbers = document.querySelectorAll(".stat-number[data-count]");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const max = parseInt(target.dataset.count, 10);
        if (isNaN(max)) return;

        let current = 0;
        const duration = 1800;
        const stepTime = Math.max(16, duration / max);

        const countUp = () => {
          current++;
          target.textContent = current;
          if (current < max) {
            setTimeout(countUp, stepTime);
          }
        };

        countUp();
        observer.unobserve(target);
      });
    },
    { rootMargin: "0px 0px -20% 0px", threshold: 0 }
  );

  statNumbers.forEach((el) => countObserver.observe(el));
} else {
  statNumbers.forEach((el) => {
    el.textContent = el.dataset.count || "0";
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    {
      rootMargin: "-38% 0px -48% 0px",
      threshold: 0,
    }
  );

  watchedSections.forEach((section) => sectionObserver.observe(section));
}

const revealSelectors = [
  ".about-label",
  ".about-story-text",
  ".about-story-media",
  ".about-value-card",
  ".about-mission",
  ".about-cta",
  ".image-cards > .tiny-label",
  ".mini-gallery article",
  ".landscape-band",
  ".amenity-card",
  ".editorial-cell",
  ".editorial-copy",
  ".rooms-label",
  ".rooms-header h2",
  ".rooms-header p",
  ".room-card",
  ".gallery-board > .tiny-label",
  ".gallery-board h2",
  ".board-grid .gallery-trigger",
  ".rules-panel",
  ".location-panel",
  ".kontak-label",
  ".kontak-info h2",
  ".kontak-intro",
  ".kontak-card",
  ".kontak-cta-panel",
  ".footer-image",
  ".footer-brand-block",
  ".footer-nav a",
  ".footer-bottom",
  ".site-footer h2",
];

const revealItems = [...document.querySelectorAll(revealSelectors.join(","))];

revealItems.forEach((item, index) => {
  item.classList.add("reveal");

  if (item.matches(".gallery-trigger, .footer-image, .mini-gallery article, .editorial-cell, .editorial-copy")) {
    item.classList.add("reveal--image");
  }

  if (item.matches(".rules-panel")) {
    item.classList.add("reveal--left");
  }

  if (item.matches(".location-panel")) {
    item.classList.add("reveal--right");
  }

  const delay = Math.min((index % 4) * 80, 240);
  item.style.setProperty("--reveal-delay", `${delay}ms`);
});

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Gallery shift buttons removed — mini-gallery uses natural grid layout

let lastFocusedTrigger = null;

const openLightbox = (src, caption) => {
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("open");
  lightbox.removeAttribute("aria-hidden");
  lightbox.setAttribute("aria-modal", "true");
  document.body.classList.add("lightbox-open");
  lastFocusedTrigger = document.activeElement;
  lightboxClose.focus();
};

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.removeAttribute("aria-modal");
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  // Return focus to the trigger button
  if (lastFocusedTrigger && lastFocusedTrigger !== document.body) {
    lastFocusedTrigger.focus();
  }
  lastFocusedTrigger = null;
};

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openLightbox(button.dataset.lightbox, button.dataset.caption || "Foto Homestay Salsabila");
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (lightbox.classList.contains("open")) {
    closeLightbox();
  }

  if (navPanel.classList.contains("open")) {
    closeMenu();
  }
});

backToTop.addEventListener("click", () => {
  smoothScrollTo(document.querySelector("#home") || document.body);
});

// ─── Smooth Scroll with Premium Easing ───
const smoothScrollTo = (() => {
  const transitionOverlay = document.createElement("div");
  transitionOverlay.className = "scroll-overlay";
  document.body.appendChild(transitionOverlay);

  // Custom cubic-bezier easing: ease-out-expo
  const easeOutExpo = (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  return (target) => {
    if (!target || prefersReducedMotion) {
      target.scrollIntoView({ behavior: "instant" });
      return;
    }

    const headerHeight = 62; // --nav-height
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    const startY = window.scrollY;
    const distance = targetTop - startY;
    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, 400), 1000);
    const startTime = performance.now();

    // Show transition overlay briefly
    transitionOverlay.classList.add("active");

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Hide overlay after scroll completes
        setTimeout(() => {
          transitionOverlay.classList.remove("active");
        }, 200);
      }
    };

    requestAnimationFrame(step);
  };
})();

// ─── Visitor Counter (Backend-driven) ───
(function initVisitorCounter() {
  const todayEl = document.getElementById("visitorToday");
  const totalEl = document.getElementById("visitorTotal");
  if (!todayEl || !totalEl) return;

  const apiUrl = "api/visitor.php";

  // Animate counter up
  const animateNumber = (el, target) => {
    if (target <= 0) {
      el.textContent = "0";
      return;
    }
    const duration = 1000;
    const step = Math.max(16, Math.floor(duration / target));
    let current = 0;
    const go = () => {
      current++;
      el.textContent = current;
      if (current < target) setTimeout(go, step);
    };
    go();
  };

  // Fetch current counts, then POST to increment
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      // Set initial values before animation
      todayEl.textContent = data.today || "0";
      totalEl.textContent = data.total || "0";

      // POST to increment counter
      return fetch(apiUrl, { method: "POST" });
    })
    .then((res) => res.json())
    .then((data) => {
      // Animate to new values after a short delay
      setTimeout(() => {
        animateNumber(todayEl, data.today);
        animateNumber(totalEl, data.total);
      }, 600);
    })
    .catch(() => {
      // Fallback: show dashes if API is unavailable
      todayEl.textContent = "—";
      totalEl.textContent = "—";
    });
})();

// ─── Parallax Scrolling ───
(function initParallax() {
  if (prefersReducedMotion) return;

  const parallaxElements = [
    { el: document.querySelector(".hero-image"), speed: 0.06 },
    { el: document.querySelector(".landscape-band img"), speed: 0.16 },
    { el: document.querySelector(".footer-image img"), speed: 0.14 },
  ].filter((item) => item.el !== null);

  if (parallaxElements.length === 0) return;

  let ticking = false;
  let lastScrollY = 0;

  const applyParallax = () => {
    const scrollY = window.scrollY;
    if (Math.abs(scrollY - lastScrollY) < 2) {
      ticking = false;
      return;
    }
    lastScrollY = scrollY;

    const viewportHeight = window.innerHeight;

    parallaxElements.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const offset = (elementCenter - viewportCenter) * speed;
      el.style.transform = `translateY(${offset.toFixed(1)}px)`;
    });

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });

  // Run once on load to set initial position
  applyParallax();
})();

// ─── Loading Screen ───
(function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add("hidden");
  };

  if (prefersReducedMotion) {
    // Hide immediately for reduced motion preference
    hideLoader();
    return;
  }

  // Check if the page was loaded from bfcache (back/forward navigation)
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      hideLoader();
    }
  });

  // Hide after everything is loaded + a brief delay for the show
  if (document.readyState === "complete") {
    setTimeout(hideLoader, 1600);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hideLoader, 1600);
    });
  }
})();

// ─── Error / Offline Handler ───
(function initErrorHandler() {
  const errorOverlay = document.createElement("div");
  errorOverlay.className = "error-overlay";
  errorOverlay.innerHTML = `
    <div class="error-overlay-content">
      <div class="error-overlay-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <h3>Koneksi Terputus</h3>
      <p>Sepertinya ada masalah dengan koneksi internet Anda. Silakan periksa jaringan dan coba lagi.</p>
      <button class="error-overlay-btn" onclick="location.reload()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Muat Ulang
      </button>
    </div>
  `;
  document.body.appendChild(errorOverlay);

  // Show when offline
  const showError = () => {
    errorOverlay.classList.add("active");
  };

  const hideError = () => {
    errorOverlay.classList.remove("active");
  };

  window.addEventListener("offline", showError);
  window.addEventListener("online", hideError);

  // If already offline on load
  if (!navigator.onLine) {
    showError();
  }
})();

if (window.lucide) {
  window.lucide.createIcons();
}
