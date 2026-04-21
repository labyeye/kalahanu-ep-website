(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || "0", 10);

        setTimeout(() => {
          el.classList.add("revealed");
        }, delay);

        observer.unobserve(el);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -55px 0px",
    },
  );

  revealEls.forEach((el) => observer.observe(el));
})();

(function initHeroCounters() {
  const heroNums = document.querySelectorAll(".hero-stat-number");
  if (!heroNums.length) return;

  function countUp(el) {
    const target = parseInt(el.dataset.target || "0", 10);
    const duration = 2200;
    const fps = 60;
    const increment = target / (duration / (1000 / fps));
    let current = 0;

    function tick() {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    tick();
  }

  setTimeout(() => {
    heroNums.forEach(countUp);
  }, 1800);
})();

(function initClientCounters() {
  const statRow = document.querySelector(".clients-stat-row");
  if (!statRow) return;

  const csNums = statRow.querySelectorAll(".cs-num");
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || animated) return;
        animated = true;

        csNums.forEach((el) => {
          const target = parseInt(el.dataset.target || "0", 10);
          const duration = 2000;
          const increment = target / (duration / (1000 / 60));
          let current = 0;

          function tick() {
            current += increment;
            if (current < target) {
              el.textContent = Math.floor(current);
              requestAnimationFrame(tick);
            } else {
              el.textContent = target;
            }
          }

          tick();
        });

        observer.disconnect();
      });
    },
    { threshold: 0.4 },
  );

  observer.observe(statRow);
})();

(function initAboutReveal() {
  const targets = [
    document.querySelector(".about-image-wrap"),
    document.querySelector(".gold-divider"),
  ].filter(Boolean);

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.25 },
  );

  targets.forEach((el) => observer.observe(el));
})();

(function initFooterGoldLine() {
  const goldLine = document.querySelector(".footer-gold-line");
  if (!goldLine) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        goldLine.classList.add("revealed");
        observer.disconnect();
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(goldLine);
})();

(function initFounderReveal() {
  const section = document.querySelector(".founder-section");
  if (!section) return;

  const paragraphs = section.querySelectorAll(".founder-message");
  if (!paragraphs.length) return;

  paragraphs.forEach((p) => {
    p.style.opacity = "0";
    p.style.transform = "translateY(18px)";
    p.style.transition = "opacity 0.65s ease, transform 0.65s ease";
  });

  let triggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || triggered) return;
        triggered = true;

        paragraphs.forEach((p, i) => {
          setTimeout(() => {
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
          }, i * 280);
        });

        observer.disconnect();
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(section);
})();

(function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("a.nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", isMatch);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-80px 0px 0px 0px",
    },
  );

  sections.forEach((s) => observer.observe(s));
})();

(function initChecklistStagger() {
  const checklists = document.querySelectorAll(".about-checklist");
  checklists.forEach((list) => {
    const items = list.querySelectorAll("li");
    items.forEach((li, i) => {
      li.style.transitionDelay = `${i * 80}ms`;
    });
  });
})();

console.log(
  "%cKalahanu Bothra Group",
  "font-size: 16px; font-weight: 800; color: #d49d35; text-shadow: 0 1px 2px rgba(0,0,0,0.5);",
);
console.log(
  "%cPremium Corporate Website — Powered by Pixelate Nest",
  "font-size: 11px; color: #b78347;",
);
