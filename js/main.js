/* Enn-wen portfolio — scroll reveals, parallax */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- shared footer (fetched from /footer.html so it's edited in one place) ---------- */

  var footerMount = document.getElementById("footer-mount");

  if (footerMount) {
    fetch("/footer.html")
      .then(function (res) { return res.text(); })
      .then(function (html) { footerMount.outerHTML = html; })
      .catch(function () { /* footer just stays empty if the fetch fails */ });
  }

  /* ---------- scroll reveals ---------- */

  var revealTargets = document.querySelectorAll(
    "[data-reveal], .case-body figure, .case-body h2, .meta, .callout, .feature-row"
  );

  if (!reducedMotion && "IntersectionObserver" in window && revealTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        var delay = 0;
        entries.forEach(function (entry) {
          var repeats = entry.target.hasAttribute("data-reveal-repeat");
          if (!entry.isIntersecting) {
            if (repeats) entry.target.classList.remove("revealed");
            return;
          }
          entry.target.style.setProperty("--reveal-delay", delay + "ms");
          entry.target.classList.add("revealed");
          if (!repeats) observer.unobserve(entry.target);
          delay += 90;
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealTargets.forEach(function (el) {
      // Only hide elements below the fold; content stays visible without JS.
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.classList.add("will-reveal");
      }
      observer.observe(el);
    });
  }

  /* ---------- about statement: lines activate in order scrolling down, deactivate in reverse scrolling up ---------- */

  var statementLines = document.querySelectorAll(".statement-text p");

  if (statementLines.length) {
    var updateStatementLines = function () {
      var triggerY = window.innerHeight * 0.55;
      statementLines.forEach(function (p) {
        p.classList.toggle("is-active", p.getBoundingClientRect().top < triggerY);
      });
    };

    var statementTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!statementTicking) {
          statementTicking = true;
          window.requestAnimationFrame(function () {
            updateStatementLines();
            statementTicking = false;
          });
        }
      },
      { passive: true }
    );

    updateStatementLines();
  }

  /* ---------- hero name flip (cycles through the name-flip-img slides) ---------- */

  var nameFlipImgs = document.querySelectorAll(".name-flip-img");

  if (!reducedMotion && nameFlipImgs.length > 1) {
    var nameFlipIndex = 0;
    Array.prototype.forEach.call(nameFlipImgs, function (img, i) {
      img.classList.toggle("is-active", i === 0);
    });

    setInterval(function () {
      var current = nameFlipImgs[nameFlipIndex];
      var nextIndex = (nameFlipIndex + 1) % nameFlipImgs.length;
      var next = nameFlipImgs[nextIndex];

      current.classList.remove("is-active");
      current.classList.add("is-leaving");

      next.classList.add("is-active");

      setTimeout(function () {
        current.classList.remove("is-leaving");
      }, 500);

      nameFlipIndex = nextIndex;
    }, 2600);
  }

  /* ---------- parallax on tile imagery and case cover ---------- */

  var parallaxImgs = [];
  document.querySelectorAll(".tile-media img, .case-cover img").forEach(function (img) {
    parallaxImgs.push(img);
  });

  if (!reducedMotion && parallaxImgs.length) {
    var ticking = false;

    var applyParallax = function () {
      var vhCenter = window.innerHeight / 2;
      parallaxImgs.forEach(function (img) {
        var rect = img.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        var offset = ((rect.top + rect.height / 2 - vhCenter) / vhCenter) * -10;
        img.style.setProperty("--py", offset.toFixed(2) + "px");
        img.style.translate = "0 " + offset.toFixed(2) + "px";
      });
      ticking = false;
    };

    var onScroll = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(applyParallax);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    applyParallax();
  }

  /* ---------- hide site nav while the hero is in view ---------- */

  var heroPanel = document.querySelector(".page-home .hero-panel");
  var siteNav = document.querySelector(".site-nav");
  var siteHeader = document.querySelector(".site-header");

  if (heroPanel && siteNav && "IntersectionObserver" in window) {
    var setNavHidden = function (hidden) {
      siteNav.classList.toggle("nav-hero-hidden", hidden);
      if (hidden) {
        siteNav.setAttribute("aria-hidden", "true");
      } else {
        siteNav.removeAttribute("aria-hidden");
      }
      siteNav.querySelectorAll("a, summary").forEach(function (el) {
        if (hidden) {
          el.setAttribute("tabindex", "-1");
        } else {
          el.removeAttribute("tabindex");
        }
      });
      if (hidden) {
        siteNav.querySelectorAll(".nav-dropdown[open]").forEach(function (d) {
          d.removeAttribute("open");
        });
      }
    };

    setNavHidden(true);

    var headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          setNavHidden(entry.isIntersecting);
        });
      },
      { rootMargin: "-" + headerHeight + "px 0px 0px 0px", threshold: 0 }
    );

    navObserver.observe(heroPanel);
  }

  /* ---------- nav dropdown: close on outside click / Escape ---------- */

  var navDropdowns = document.querySelectorAll(".nav-dropdown");

  if (navDropdowns.length) {
    document.addEventListener("click", function (e) {
      navDropdowns.forEach(function (d) {
        if (d.hasAttribute("open") && !d.contains(e.target)) {
          d.removeAttribute("open");
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        navDropdowns.forEach(function (d) { d.removeAttribute("open"); });
      }
    });
  }

  /* ---------- case study sticky side nav ---------- */

  var caseCover = document.querySelector(".case-cover");
  var caseBody = document.querySelector(".case-body");

  if (caseCover && caseBody) {
    var sectionHeadings = caseBody.querySelectorAll("h2");

    if (sectionHeadings.length && "IntersectionObserver" in window) {
      var usedIds = {};
      var slugify = function (text) {
        var base = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        var slug = base;
        var i = 2;
        while (usedIds[slug]) {
          slug = base + "-" + i;
          i += 1;
        }
        usedIds[slug] = true;
        return slug;
      };

      var sideNav = document.createElement("nav");
      sideNav.className = "case-side-nav";
      sideNav.setAttribute("aria-label", "Sections on this page");

      var sections = [];

      sectionHeadings.forEach(function (h2) {
        if (h2.id) {
          usedIds[h2.id] = true;
        } else {
          h2.id = slugify(h2.textContent);
        }
        var link = document.createElement("a");
        link.href = "#" + h2.id;
        link.textContent = h2.textContent;
        sideNav.appendChild(link);
        sections.push({ link: link, heading: h2 });
      });

      document.body.appendChild(sideNav);

      var coverObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            sideNav.classList.toggle("is-visible", !entry.isIntersecting);
          });
        },
        { threshold: 0 }
      );
      coverObserver.observe(caseCover);

      var headerHeightForSpy = siteHeader ? siteHeader.offsetHeight : 0;
      var spyObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            sections.forEach(function (section) {
              section.link.classList.toggle("is-active", section.heading === entry.target);
            });
          });
        },
        { rootMargin: "-" + (headerHeightForSpy + 20) + "px 0px -70% 0px", threshold: 0 }
      );
      sections.forEach(function (section) { spyObserver.observe(section.heading); });
    }
  }
})();
