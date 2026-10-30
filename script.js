// 홍현아 포트폴리오 - 인터랙션

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ----- 푸터 연도 -----
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ----- 다크 모드 (저장된 설정 > 시스템 설정) -----
  const themeBtn = document.getElementById("theme-toggle");
  const getSaved = () => {
    try { return localStorage.getItem("theme"); } catch { return null; }
  };
  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#171a17" : "#f6f3ea");
  };
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(getSaved() || (systemDark ? "dark" : "light"));

  themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch { /* 저장 불가 시 무시 */ }
  });

  // ----- 내비게이션: 스크롤 배경 + 모바일 메뉴 -----
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "메뉴 열기");
  };
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // ----- 현재 섹션 메뉴 강조 -----
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle("is-current", a.getAttribute("href") === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // ----- 스크롤 등장 애니메이션 + 스킬 바 -----
  const fillBars = (el) =>
    el.querySelectorAll(".bar i").forEach((bar) => {
      bar.style.width = `${bar.dataset.level}%`;
    });

  const targets = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => { el.classList.add("is-visible"); fillBars(el); });
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          fillBars(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
  }

  // ----- 프로젝트 필터 -----
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.filter;
      filters.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      projects.forEach((p) => {
        const show = key === "all" || p.dataset.category === key;
        p.classList.toggle("is-hidden", !show);
        if (show) p.classList.add("is-visible");
      });
    });
  });
});
