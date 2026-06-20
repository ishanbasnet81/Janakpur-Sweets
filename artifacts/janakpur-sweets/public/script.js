/* ══════════════════════════════════════════════════════════
   script.js — Janakpur Sweets
   Vanilla JS only. No jQuery. No frameworks.
   ══════════════════════════════════════════════════════════ */

function toggleMenuGrid(btn) {
  const wrap = btn.closest(".see-all-wrap");
  const grid = wrap.previousElementSibling;
  if (!grid || !grid.classList.contains("menu-grid")) return;

  const wasExpanded = grid.classList.contains("expanded");

  if (wasExpanded) {
    const title = grid.previousElementSibling;
    if (title) {
      const navH = 80;
      const scrollTarget =
        title.getBoundingClientRect().top + window.scrollY - navH;
      grid.classList.remove("expanded");
      btn.classList.remove("expanded");
      window.scrollTo({ top: scrollTarget, behavior: "instant" });
    }
    return;
  }

  grid.classList.add("expanded");
  btn.classList.add("expanded");
}

/* ════════════════════════════════════════════
   NAVBAR — Hamburger + Sticky + Active Links
   ════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!navbar || !hamburger || !navLinks) return;

  /* Hamburger toggle */
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  /* Close menu when a link is clicked */
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* Sticky: add .scrolled on scroll */
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveLink();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* Active link highlight based on visible section */
  function updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;
    let current = "";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });

    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }
})();

/* ════════════════════════════════════════════
   SMOOTH SCROLL for all anchor links
   ════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-h",
          ),
        ) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ════════════════════════════════════════════
   INTERSECTION OBSERVER — fade-in on scroll
   ════════════════════════════════════════════ */
(function initFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
})();

/* ════════════════════════════════════════════
   TYPEWRITER EFFECT — hero tagline
   ════════════════════════════════════════════ */
(function initTypewriter() {
  const target = document.getElementById("heroTagline");
  const cursor = document.getElementById("typeCursor");
  if (!target || !cursor) return;

  const text = "Taste of Mithila, Heart of Kathmandu";
  let index = 0;

  cursor.classList.add("cursor");

  function type() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(type, 60);
    } else {
      /* blinking cursor stays after typing */
    }
  }

  /* Start after a short delay so page settles */
  setTimeout(type, 600);
})();

/* ════════════════════════════════════════════
   ANIMATED RATING COUNTER
   ════════════════════════════════════════════ */
(function initRatingCounter() {
  const el = document.getElementById("ratingNumber");
  if (!el) return;

  const target = 4.1;
  const duration = 1500;
  let startTime = null;

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuad(progress);
    const current = (eased * target).toFixed(1);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      el.textContent = "4.1";
      const badge = document.getElementById("ratingBadge");
      if (badge) {
        badge.classList.add("rating-pop");
        badge.addEventListener(
          "animationend",
          () => badge.classList.remove("rating-pop"),
          { once: true },
        );
      }
    }
  }

  /* Trigger once hero is visible (after a short delay) */
  setTimeout(() => requestAnimationFrame(animate), 800);
})();

/* ════════════════════════════════════════════
   REVIEWS — data + carousel
   ════════════════════════════════════════════ */
const REVIEWS = [
  {
    name: "Tekraj Shrestha",
    initials: "TS",
    stars: 5,
    badge: "Local Guide",
    text: "A nice place for tasty samosas, snacks, and sweets.",
  },
  {
    name: "Rinu Shah",
    initials: "RS",
    stars: 4,
    badge: "Local Guide",
    text: "Good food, especially Samosa, kachori and chaats. Great variety of sweets, fresh and delicious.",
  },
  {
    name: "chhabi Bhandari",
    initials: "CB",
    stars: 5,
    badge: "Local Guide",
    text: "Best samosa in town. Good place for Veggies. Sweets are also fresh.",
  },
  {
    name: "Siddhant S. Sainthwar",
    initials: "SS",
    stars: 5,
    badge: "Local Guide",
    text: "My favourite is Samosa and Mitha Chutney. Delicious stuffs and co-operative staffs and the owner. Really loved it.",
  },
  {
    name: "Sam Dhi",
    initials: "SD",
    stars: 5,
    badge: "Local Guide",
    text: "Bomb samosa, easily best samosa in town. Good chutney as well.",
  },
  {
    name: "Ashish Jha",
    initials: "AJ",
    stars: 5,
    badge: "Local Guide",
    text: "Best Sweets & Snacks like Samosa, Kachori, Mithai and many more. Mithila Taste ❤️",
  },
  {
    name: "Shashwat Neupane",
    initials: "SN",
    stars: 5,
    badge: "Local Guide",
    text: "Rasmalai and samosa are extraordinarily good.",
  },
  {
    name: "ritesh joshi",
    initials: "RJ",
    stars: 5,
    badge: "Local Guide",
    text: "Best for samosa jalebi and samosa tarkari.",
  },
  {
    name: "Bee Namra",
    initials: "BN",
    stars: 4,
    badge: "Regular",
    text: "Regular here. Price got hiked lately but taste is still good.",
  },
  {
    name: "Sumit Yadav (Mr. SKY)",
    initials: "SY",
    stars: 5,
    badge: "Verified",
    text: "In taste the best 😎",
  },
];

(function initCarousel() {
  const track = document.getElementById("reviewTrack");
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const wrapper = document.getElementById("reviewCarouselWrapper");

  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  let current = 0;
  let autoTimer = null;

  /* Build cards */
  REVIEWS.forEach((r) => {
    const stars =
      "⭐".repeat(r.stars) + (r.stars < 5 ? "☆".repeat(5 - r.stars) : "");
    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <div class="review-stars">${stars}</div>
      <p class="review-text">${escapeHTML(r.text)}</p>
      <div class="review-author">
        <div class="review-avatar">${r.initials}</div>
        <div>
          <div class="review-name">${escapeHTML(r.name)}</div>
          <div class="review-badge">${escapeHTML(r.badge)}</div>
        </div>
      </div>`;
    track.appendChild(card);
  });

  /* Size all cards to wrapper width (pixel-based for correct translateX) */
  function sizeCards() {
    const w = wrapper.offsetWidth;
    track.querySelectorAll(".review-card").forEach((c) => {
      c.style.width = w + "px";
    });
  }
  sizeCards();
  window.addEventListener("resize", () => {
    sizeCards();
    goTo(current);
  });

  /* Build dots */
  REVIEWS.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Review ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  /* goTo uses pixel offset so exactly one card advances per step */
  function goTo(index) {
    current = (index + REVIEWS.length) % REVIEWS.length;
    const cardW = wrapper.offsetWidth;
    track.style.transform = `translateX(${-current * cardW}px)`;
    dotsWrap.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  nextBtn.addEventListener("click", () => {
    next();
    resetAuto();
  });
  prevBtn.addEventListener("click", () => {
    prev();
    resetAuto();
  });

  function startAuto() {
    autoTimer = setInterval(next, 6000);
  }
  function stopAuto() {
    clearInterval(autoTimer);
  }
  function resetAuto() {
    stopAuto();
    startAuto();
  }

  if (wrapper) {
    wrapper.addEventListener("mouseenter", stopAuto);
    wrapper.addEventListener("mouseleave", startAuto);
  }

  startAuto();
})();

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
