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

  /* ---------- language toggle (EN / Traditional Chinese) ---------- */

  var LANG_KEY = "site-lang";
  var htmlEl = document.documentElement;
  var titleEl = document.querySelector("title");
  var descEl = document.querySelector('meta[name="description"]');
  var titleEn = titleEl ? titleEl.textContent : null;
  var descEn = descEl ? descEl.getAttribute("content") : null;

  var applyLangMeta = function (lang) {
    if (titleEl) {
      var zhTitle = titleEl.getAttribute("data-zh");
      titleEl.textContent = lang === "zh" && zhTitle ? zhTitle : titleEn;
    }
    if (descEl) {
      var zhDesc = descEl.getAttribute("data-zh");
      descEl.setAttribute("content", lang === "zh" && zhDesc ? zhDesc : descEn);
    }
  };

  var setLang = function (lang, persist) {
    htmlEl.setAttribute("data-lang", lang);
    applyLangMeta(lang);
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.setAttribute("aria-pressed", lang === "zh" ? "true" : "false");
    });
    if (persist) {
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode, ignore */ }
    }
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  };

  var getLangText = function (el) {
    var lang = htmlEl.getAttribute("data-lang") === "zh" ? "zh" : "en";
    var match = el.querySelector(".i18n-" + lang);
    return match ? match.textContent : el.textContent;
  };

  // sync meta tags + button state with whatever the anti-flicker inline script already applied
  setLang(htmlEl.getAttribute("data-lang") === "zh" ? "zh" : "en", false);

  document.querySelectorAll(".lang-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(htmlEl.getAttribute("data-lang") === "zh" ? "en" : "zh", true);
    });
  });

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

  /* ---------- hide site nav while the hero is in view (lang toggle stays visible) ---------- */

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
          var enHeading = h2.querySelector(".i18n-en");
          h2.id = slugify(enHeading ? enHeading.textContent : h2.textContent);
        }
        var link = document.createElement("a");
        link.href = "#" + h2.id;
        link.textContent = getLangText(h2);
        sideNav.appendChild(link);
        sections.push({ link: link, heading: h2 });
      });

      document.addEventListener("langchange", function () {
        sections.forEach(function (section) {
          section.link.textContent = getLangText(section.heading);
        });
      });

      document.body.appendChild(sideNav);

      var pastCover = false;
      var beforeCaseNav = true;
      var updateSideNavVisibility = function () {
        sideNav.classList.toggle("is-visible", pastCover && beforeCaseNav);
      };

      var coverObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            pastCover = !entry.isIntersecting;
            updateSideNavVisibility();
          });
        },
        { threshold: 0 }
      );
      coverObserver.observe(caseCover);

      var caseNavEl = document.querySelector(".case-nav");
      if (caseNavEl) {
        var caseNavObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              beforeCaseNav = !entry.isIntersecting;
              updateSideNavVisibility();
            });
          },
          { threshold: 0 }
        );
        caseNavObserver.observe(caseNavEl);
      }

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

  /* ---------- photo gallery lightbox ---------- */

  var photoItems = document.querySelectorAll(".photo-gallery .photo-item");

  if (photoItems.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Photo viewer");
    lightbox.innerHTML =
      '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close photo viewer">&#10005;</button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous photo">&#8592;</button>' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next photo">&#8594;</button>' +
      '<figure><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""><figcaption><span class="lightbox-name"></span><span class="lightbox-year"></span></figcaption></figure>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector("img");
    var lbName = lightbox.querySelector(".lightbox-name");
    var lbYear = lightbox.querySelector(".lightbox-year");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lbPrev = lightbox.querySelector(".lightbox-prev");
    var lbNext = lightbox.querySelector(".lightbox-next");
    var currentPhoto = -1;
    var lastFocused = null;

    var showPhoto = function (index) {
      currentPhoto = (index + photoItems.length) % photoItems.length;
      var item = photoItems[currentPhoto];
      var img = item.querySelector("img");
      var name = item.querySelector(".photo-name");
      var year = item.querySelector(".photo-year");
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbName.textContent = name ? name.textContent : "";
      lbYear.textContent = year ? year.textContent : "";
    };

    var openLightbox = function (index) {
      lastFocused = document.activeElement;
      showPhoto(index);
      lightbox.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      lbClose.focus();
    };

    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    photoItems.forEach(function (item, index) {
      var frame = item.querySelector(".photo-frame");
      if (!frame) return;
      var name = item.querySelector(".photo-name");
      frame.setAttribute("role", "button");
      frame.setAttribute("tabindex", "0");
      frame.setAttribute("aria-label", "View larger" + (name ? " — " + name.textContent : ""));
      frame.addEventListener("click", function () { openLightbox(index); });
      frame.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { showPhoto(currentPhoto - 1); });
    lbNext.addEventListener("click", function () { showPhoto(currentPhoto + 1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPhoto(currentPhoto - 1);
      else if (e.key === "ArrowRight") showPhoto(currentPhoto + 1);
    });
  }
})();
