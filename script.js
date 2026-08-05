(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  const projectMedia = [
    ["Marshall 1962", "images/work/project-17.webp", "landscape"],
    ["Vinery", "images/work/project-19.webp", "landscape"],
    ["Aru", "images/work/project-18.webp", "landscape"],
    ["Craft Work 01", "images/work/P20250912_142421000_947D8358-CEBB-4300-811D-732A6A5E4DB4.webp", "portrait"],
    ["Craft Work 02", "images/work/V20250911_165336000_0BE644DC-2C4B-4185-9FA7-C80B34C57ACC.MP4", "portrait"],
    ["Craft Work 03", "images/work/P20250918_175701000_D40DA5A7-34B8-4B68-A363-1F54AD2D95FA.webp", "portrait"],
    ["Editorial Work 01", "images/work/project-01.webp", "portrait"],
    ["Editorial Work 02", "images/work/project-02.webp", "square"],
    ["Editorial Work 03", "images/work/project-03.webp", "landscape"],
    ["Editorial Work 04", "images/work/project-04.webp", "square"],
    ["Editorial Work 05", "images/work/project-05.webp", "portrait"],
    ["Editorial Work 06", "images/work/project-06.webp", "landscape"],
    ["Editorial Work 07", "images/work/project-07.webp", "landscape"],
    ["Editorial Work 08", "images/work/project-08.webp", "landscape"],
    ["Editorial Work 09", "images/work/project-09.webp", "portrait"],
    ["Editorial Work 10", "images/work/project-10.webp", "portrait"],
    ["Editorial Work 11", "images/work/project-11.webp", "portrait"],
    ["Editorial Work 12", "images/work/project-12.webp", "portrait"],
    ["Editorial Work 13", "images/work/project-13.webp", "portrait"],
    ["Editorial Work 14", "images/work/project-14.webp", "portrait"],
    ["Editorial Work 15", "images/work/project-15.webp", "square"],
    ["Editorial Work 16", "images/work/project-16.webp", "square"]
  ];

  function buildStaticContent() {
    const bits = "1000011101110111010011011111101001110111011001011011111010011011100011101011";
    const divider = " / / / / / / / / / ";
    $$(".binary span").forEach((node) => { node.textContent = bits + divider + bits + divider + bits; });

    $$(".hero-word").forEach((word, wordIndex) => {
      const value = word.dataset.word || "";
      word.innerHTML = Array.from(value).map((letter, index) =>
        `<span class="hero-char hero-char-${letter.toLowerCase()}" style="--char-index:${wordIndex * 8 + index}"><span class="hero-char-inner" data-letter="${letter.toUpperCase()}">${letter}</span></span>`
      ).join("");
    });

    const letterCopies = [14, 18, 18, 17];
    const letters = ["W", "O", "R", "K"];
    const letterLayer = $(".work-letter-layer");
    letterLayer.innerHTML = letters.map((letter, row) => {
      const letterY = ((row + 1) / 5 - .5) * 2;
      const top = `calc(50% + .1em + ${(row - 1.5) * .85}em)`;
      const before = letterCopies.slice(0, row).reduce((sum, count) => sum + count, 0);
      const copies = Array.from({ length: letterCopies[row] }, (_, slot) => {
        const foreground = (row === 0 || row === 3) && (before + slot) % 5 === 1;
        return `<span${foreground ? ' class="is-foreground"' : ""} data-letter="${letter}" data-row="${row}" data-slot="${slot}">${letter}</span>`;
      }).join("");
      return `<div class="work-letter-row" style="--letter-y:${letterY};--letter-top:${top}">${copies}</div>`;
    }).join("");

    const projectScene = $(".work-project-scene");
    const stackDefinitions = [
      { id: "triple-craft", indexes: [3, 4, 5] },
      { id: "pair-4-11", indexes: [13, 6] },
      { id: "pair-9-10", indexes: [11, 12] },
      { id: "triple-12-14", indexes: [14, 15, 16] },
      { id: "grid-remaining", indexes: [7, 8, 9, 10, 17, 18, 19, 20, 21] }
    ];
    const stackHoverIndexes = new Set([5, 6, 10, 12, 16]);
    projectScene.innerHTML = projectMedia.map(([title, src, shape], index) => {
      const stackDefinition = stackDefinitions.find(({ indexes }) => indexes.includes(index));
      const stackIndex = stackDefinition ? stackDefinition.indexes.indexOf(index) : -1;
      const stackCount = stackDefinition?.indexes.length || 0;
      const size = index < 3 ? .87 : stackCount === 9 ? 1 : stackIndex >= 0 ? .78 : .5 + ((index * 37) % 50) / 100;
      const y = stackIndex >= 0 ? 0 : (.5 + ((index * 53) % 50) / 100) * (index % 2 ? -1 : 1);
      const hash = (index * 7919 % 1679616).toString(36).padStart(4, "0").slice(0, 4);
      const hoverable = index < 3 || stackHoverIndexes.has(index);
      const featured = index < 3 ? " work-project-featured" : hoverable ? " work-project-hoverable" : "";
      const stacked = stackIndex >= 0 ? " work-project-stack" : "";
      const gridStack = stackCount === 9 ? " work-project-stack-grid" : "";
      const stackRest = stackCount === 9 ? Array.from({ length: 9 }, (_, position) => {
        const displayOrder = [3, 4, 0, 5, 1, 6, 2, 7, 8];
        const displayPosition = displayOrder.indexOf(position);
        const angles = [-6, -3, 3, 5, -2, 2, -5, 4, 0];
        return {
          x: `${(position - 4) * 1.5}%`,
          y: `${((position % 2) * 2 - 1) * 1.5}%`,
          angle: `${angles[position]}deg`,
          z: 20 - displayPosition,
          openX: `${displayPosition * 32}vw`,
          openXMobile: `${displayPosition * 42}vw`,
          openY: "0lvh",
          openYMobile: "0lvh",
          openAngle: "0deg"
        };
      }) : stackCount === 2 ? [
        { x: "-7%", y: "2%", angle: "-5deg", openX: "32vw", openXMobile: "42vw", openY: "0lvh", openYMobile: "0lvh", openAngle: "0deg" },
        { x: "7%", y: "-1%", angle: "4deg", openX: "0vw", openXMobile: "0vw", openY: "0lvh", openYMobile: "0lvh", openAngle: "0deg" }
      ] : [
        { x: "-11%", y: "3%", angle: "-6deg", openX: "64vw", openXMobile: "84vw", openY: "0lvh", openYMobile: "0lvh", openAngle: "0deg" },
        { x: "-1%", y: "-6%", angle: "6deg", openX: "32vw", openXMobile: "42vw", openY: "0lvh", openYMobile: "0lvh", openAngle: "0deg" },
        { x: "11%", y: "2%", angle: "0deg", openX: "0vw", openXMobile: "0vw", openY: "0lvh", openYMobile: "0lvh", openAngle: "0deg" }
      ];
      const stack = stackIndex >= 0 ? stackRest[stackIndex] : null;
      const stackStyle = stack ? `;--stack-index:${stackIndex};--stack-z:${stack.z ?? stackIndex};--stack-x:${stack.x};--stack-y:${stack.y};--stack-angle:${stack.angle};--stack-open-x:${stack.openX};--stack-open-x-mobile:${stack.openXMobile};--stack-open-y:${stack.openY};--stack-open-y-mobile:${stack.openYMobile};--stack-open-angle:${stack.openAngle}` : "";
      const loading = stack ? "eager" : "lazy";
      const priority = stack ? ' fetchpriority="high"' : "";
      const stackData = stackDefinition ? ` data-stack-group="${stackDefinition.id}"` : "";
      const isVideo = /\.mp4$/i.test(src);
      const image = isVideo
        ? `<video src="${src}" aria-label="${title}" autoplay muted loop playsinline preload="metadata"></video>`
        : `<img src="${src}" alt="${title}" loading="${loading}"${priority} decoding="async">`;
      const hoverDetails = index === 0 ? {
        name: "Mashall",
        type: "팀 프로젝트",
        description: "기존의 제품 중심 구조를 브랜드 중심으로 전환하고, 브랜드의 탄생부터 현재까지의<br>이야기를 하나의 스크롤 서사로 구성했습니다. 이를 통해 사용자가 제품을 탐색하는 것을<br>넘어 마샬의 철학과 헤리티지를 직접 경험하도록 기획했습니다.",
        web: "https://marshall-rebrand.vercel.app/",
        linkLabel: "웹 바로가기",
        plan: "https://www.figma.com/proto/dP1TrvrWnnpwVg8Mz5LjqS/%EC%9D%B4%EB%AF%BC%EC%98%81?node-id=1305-1253&viewport=577%2C758%2C0.03&t=qrJfcm8gQVISKFM5-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1305%3A1253&page-id=1305%3A642"
      } : index === 1 ? {
        name: "Viner",
        type: "팀 프로젝트",
        description: "와인을 어렵게 느끼는 사용자가 자신의 취향에 맞는 와인을 보다 쉽게 발견하고,<br>다양한 와인 정보를 직관적으로 탐색할 수 있도록 구성했습니다. 취향을 기록하고<br>추천받는 흐름을 통해 와인을 편안하게 경험하도록 기획했습니다.",
        web: "https://wine-app-eight-wine.vercel.app/",
        linkLabel: "앱 바로가기",
        plan: "https://www.figma.com/proto/dP1TrvrWnnpwVg8Mz5LjqS/%EC%9D%B4%EB%AF%BC%EC%98%81?node-id=1305-2063&viewport=668%2C1790%2C0.04&t=P7pbNsF3l3vinHmz-1&scaling=scale-down-width&content-scaling=fixed&page-id=1305%3A2025"
      } : index === 2 ? {
        name: "Aru",
        type: "개인 프로젝트",
        description: "사용자가 필요한 정보를 자연스럽게 탐색하고 서비스의 핵심 기능에 빠르게 도달할 수 있도록<br>직관적인 화면 구조와 일관된 사용자 흐름을 구성했습니다. 복잡한 과정을 단순하게 정리해<br>처음 사용하는 순간부터 편안하게 경험할 수 있도록 기획했습니다.",
        web: "https://aru-react.vercel.app/onboarding",
        linkLabel: "앱 바로가기",
        plan: "https://www.figma.com/proto/dP1TrvrWnnpwVg8Mz5LjqS/%EC%9D%B4%EB%AF%BC%EC%98%81?node-id=967-5866&viewport=34%2C154%2C0.04&t=19PNm5J5SINDkVwP-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=967%3A2243&page-id=967%3A2242"
      } : stackHoverIndexes.has(index) ? {
        name: `Project ${String(index + 1).padStart(2, "0")}`,
        type: "개인 프로젝트",
        description: "프로젝트의 핵심 아이디어와<br>디자인 과정을 담았습니다."
      } : null;
      const planLink = hoverDetails?.plan ? `<a href="${hoverDetails.plan}" target="_blank" rel="noopener noreferrer">기획서 바로가기</a>` : "";
      const projectLinks = hoverDetails?.web ? `<div class="work-project-links"><a href="${hoverDetails.web}" target="_blank" rel="noopener noreferrer">${hoverDetails.linkLabel}</a>${planLink}</div>` : "";
      const featuredHover = hoverDetails ? `<div class="work-project-media">${image}<div class="work-project-hover"><div class="work-project-hover-copy"><h3>${hoverDetails.name}</h3><p class="work-project-type">[ ${hoverDetails.type} ]</p><p class="work-project-description">${hoverDetails.description}</p>${projectLinks}</div></div></div>` : image;
      return `<article class="work-project work-project-${shape}${featured}${stacked}${gridStack}"${stackData} style="--card-size:${size};--card-y:${y}${stackStyle}"><div class="work-project-inner">${featuredHover}<footer><span>${title}</span><span>#${hash} - ${String(index + 1).padStart(4, "0")}/${String(projectMedia.length).padStart(2, "0")}</span></footer></div></article>`;
    }).join("");
    const workHoldVh = 60;
    $(".work-showcase").style.height = `calc(${projectMedia.length * 65}lvh + ${workHoldVh}lvh)`;
    $(".work-showcase").style.setProperty("--work-hold-vh", String(workHoldVh));

    const maskLines = $(".work-mask-lines");
    maskLines.innerHTML = Array.from({ length: 13 }, (_, index) => `<path d="M ${index * 100} 0 V 1000"></path>`).join("") +
      Array.from({ length: 11 }, (_, index) => `<path d="M 0 ${index * 100} H 1200"></path>`).join("");

    const historyObjects = $(".history-objects");
    const ruler = $(".history-ruler", historyObjects);
    historyObjects.innerHTML = Array.from({ length: 10 }, () => '<div class="history-object history-star"><i></i><i></i><i></i><i></i></div>').join("");
    historyObjects.appendChild(ruler);
    const portraitPhotoNumbers = new Set([3, 5, 7, 8, 10, 12, 13, 14, 15]);
    const landscapePhotoNumbers = new Set([1, 2, 6, 9, 11]);
    const historyTitles = new Map([[1, "JAPAN<br>EXHIBITION"], [2, "GRADUATION<br>EXHIBITION"], [3, "CERTIFICATE"]]);
    const historyEntries = [];
    Array.from({ length: 15 }, (_, index) => index + 1).filter((number) => number !== 4).forEach((number, photoOrder) => {
      if (historyTitles.has(number)) historyEntries.push(`<div class="history-photo history-caption" data-entry-kind="caption">${historyTitles.get(number)}</div>`);
      historyEntries.push(`<figure class="history-photo${portraitPhotoNumbers.has(number) ? " is-portrait" : ""}${landscapePhotoNumbers.has(number) ? " is-landscape" : ""}" data-entry-kind="photo" data-photo-order="${photoOrder}"><img src="images/my-${String(number).padStart(2, "0")}.webp" alt="MY archive ${String(number).padStart(2, "0")}" loading="lazy" decoding="async"></figure>`);
      if (number === 3) historyEntries.push('<div class="history-photo history-caption" data-entry-kind="caption">COLLEGE<br>LIFE</div>');
    });
    $(".history-photos").innerHTML = historyEntries.join("");
  }

  function initHeader() {
    const main = $("main");
    const menuButton = $(".menu-button");
    const nav = $(".topbar nav");
    const contrast = $(".contrast");
    if (contrast) contrast.addEventListener("click", () => main.classList.toggle("theme-dark"));
    if (!menuButton || !nav) return;
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  function initSmoothScroll() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return {
        lock() {},
        unlock() {},
        isLocked() { return false; },
        position() { return { current: scrollY, target: scrollY }; },
        setWheelInterceptor() {},
        moveTo(position, onComplete) {
          scrollTo(0, clamp(position, 0, Math.max(0, document.documentElement.scrollHeight - innerHeight)));
          if (onComplete) requestAnimationFrame(onComplete);
        }
      };
    }
    const root = document.documentElement;
    root.classList.add("lenis", "lenis-smooth");
    let current = scrollY;
    let target = current;
    let raf = 0;
    let previousTime = 0;
    let programmatic = false;
    let locked = false;
    let settleCallback = null;
    let wheelInterceptor = null;
    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const easing = (value) => value < .5 ? 16 * value ** 5 : 1 + 16 * (--value) * value ** 4;

    const tick = (time) => {
      const elapsed = previousTime ? Math.min(34, time - previousTime) : 16.7;
      previousTime = time;
      const response = 1 - Math.exp(-elapsed / 110);
      current += (target - current) * response;
      if (Math.abs(target - current) < .1) current = target;
      programmatic = true;
      scrollTo(0, current);
      programmatic = false;
      if (current !== target) raf = requestAnimationFrame(tick);
      else {
        raf = 0;
        previousTime = 0;
        const callback = settleCallback;
        settleCallback = null;
        if (callback) callback();
      }
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    window.addEventListener("wheel", (event) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      const delta = clamp(event.deltaY * unit, -240, 240);
      if (wheelInterceptor && wheelInterceptor(delta)) return;
      if (locked) return;
      target = clamp(target + delta, 0, maxScroll());
      start();
    }, { passive: false });

    window.addEventListener("scroll", () => {
      if (!programmatic && !raf) target = current = scrollY;
    }, { passive: true });

    $$('a[href^="#"]').forEach((anchor) => anchor.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = anchor.getAttribute("href");
      const node = href === "#" ? null : $(href);
      if (!node && href !== "#") return;
      event.preventDefault();
      const startPosition = current;
      const destination = href === "#" ? 0 : clamp(node.getBoundingClientRect().top + current, 0, maxScroll());
      const startTime = performance.now();
      const move = (time) => {
        const progress = clamp((time - startTime) / 1050);
        target = startPosition + (destination - startPosition) * easing(progress);
        start();
        if (progress < 1) requestAnimationFrame(move);
      };
      requestAnimationFrame(move);
    }));

    return {
      lock() {
        locked = true;
      },
      isLocked() {
        return locked;
      },
      position() {
        return { current, target };
      },
      setWheelInterceptor(interceptor) {
        wheelInterceptor = interceptor;
      },
      unlock() {
        locked = false;
        current = target = scrollY;
      },
      moveTo(position, onComplete) {
        target = clamp(position, 0, maxScroll());
        settleCallback = onComplete || null;
        start();
      }
    };
  }

  class Perlin2D {
    constructor(seed = Math.random() * 1e9) {
      let state = seed >>> 0;
      const random = () => { state = (state + 0x6d2b79f5) | 0; let t = Math.imul(state ^ state >>> 15, 1 | state); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
      const p = Array.from({ length: 256 }, (_, index) => index);
      for (let index = 255; index > 0; index--) { const other = Math.floor(random() * (index + 1)); [p[index], p[other]] = [p[other], p[index]]; }
      this.perm = new Uint8Array(512);
      for (let index = 0; index < 512; index++) this.perm[index] = p[index & 255];
    }
    noise(x, y) {
      const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255, xf = x - Math.floor(x), yf = y - Math.floor(y);
      const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10), lerp = (a, b, t) => a + (b - a) * t;
      const grad = (hash, gx, gy) => { switch (hash & 3) { case 0: return gx + gy; case 1: return -gx + gy; case 2: return gx - gy; default: return -gx - gy; } };
      const u = fade(xf), v = fade(yf), aa = this.perm[this.perm[xi] + yi], ab = this.perm[this.perm[xi] + yi + 1], ba = this.perm[this.perm[xi + 1] + yi], bb = this.perm[this.perm[xi + 1] + yi + 1];
      return lerp(lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u), lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u), v);
    }
  }

  function initLineField() {
    const holder = $(".line-field"), svg = $("svg", holder);
    const noise = new Perlin2D(), lines = [], paths = [];
    const mouse = { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, vs: 0, angle: 0, set: false };
    let raf = 0, active = false;
    const moved = (point, cursor = true) => ({ x: Math.round(point.x * 10) / 10, y: Math.round((point.y + point.waveY + (cursor ? point.cursorY : 0)) * 10) / 10 });
    const draw = () => lines.forEach((line, index) => {
      const anchor = moved(line[0], false);
      let d = `M 0 ${anchor.y}`;
      line.forEach((point, pointIndex) => {
        const position = moved(point, pointIndex !== line.length - 1);
        if (pointIndex === 0) position.x = 0;
        if (pointIndex === line.length - 1) position.x = holder.clientWidth;
        d += ` L ${position.x} ${position.y}`;
      });
      paths[index].setAttribute("d", d);
    });
    const setLines = () => {
      lines.splice(0); paths.splice(0); svg.replaceChildren();
      const width = holder.clientWidth, height = holder.clientHeight;
      const columns = innerWidth > 767 ? 72 : 36, rows = innerWidth > 767 ? 38 : 24;
      const xGap = width / columns, yGap = height / Math.max(1, rows - 1);
      for (let y = 0; y < rows; y++) {
        const line = [];
        for (let x = 0; x <= columns; x++) line.push({ x: xGap * x, y: yGap * y, waveY: 0, cursorY: 0, vy: 0 });
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("class", "wave-line"); svg.appendChild(path); paths.push(path); lines.push(line);
      }
      draw();
    };
    const resize = () => { const rect = holder.getBoundingClientRect(); svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`); setLines(); };
    const pointer = (event) => { const rect = holder.getBoundingClientRect(); mouse.x = event.clientX - rect.left; mouse.y = event.clientY - rect.top; if (!mouse.set) { mouse.sx = mouse.lx = mouse.x; mouse.sy = mouse.ly = mouse.y; mouse.set = true; } };
    const tick = (time) => {
      raf = 0; if (!active || document.hidden) return;
      mouse.sx += (mouse.x - mouse.sx) * .1; mouse.sy += (mouse.y - mouse.sy) * .1;
      const dx = mouse.x - mouse.lx, dy = mouse.y - mouse.ly, speed = Math.hypot(dx, dy); mouse.vs += (speed - mouse.vs) * .1; mouse.vs = Math.min(100, mouse.vs); mouse.lx = mouse.x; mouse.ly = mouse.y; mouse.angle = Math.atan2(dy, dx);
      holder.style.setProperty("--x", `${mouse.sx}px`); holder.style.setProperty("--y", `${mouse.sy}px`);
      lines.forEach((line) => line.forEach((point, pointIndex) => {
        const n = noise.noise((point.x + time * .01) * .0016, (point.y + time * .004) * .002); point.waveY = n * 2.2;
        const endpoint = pointIndex === 0 || pointIndex === line.length - 1;
        if (endpoint) { point.waveY = 0; point.cursorY = 0; point.vy = 0; }
        const px = point.x - mouse.sx, py = point.y - mouse.sy, distance = Math.hypot(px, py), radius = Math.max(175, mouse.vs);
        if (!endpoint && distance < radius) {
          const force = (1 - distance / radius) ** 2;
          const direction = Math.abs(py) < 1 ? (point.y < holder.clientHeight / 2 ? -1 : 1) : Math.sign(py);
          point.vy += direction * force * (1.2 + mouse.vs * .035);
        }
        point.vy += -point.cursorY * .018;
        point.vy *= .88;
        point.cursorY = clamp(point.cursorY + point.vy, -64, 64);
      }));
      draw(); raf = requestAnimationFrame(tick);
    };
    const start = () => { if (active && !document.hidden && !raf) raf = requestAnimationFrame(tick); };
    new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) start(); else { cancelAnimationFrame(raf); raf = 0; } }, { rootMargin: "80px" }).observe(holder);
    resize(); addEventListener("resize", resize); addEventListener("pointermove", pointer, { passive: true }); document.addEventListener("visibilitychange", start);
  }

  function initHeroTitle() {
    const root = $(".hero-title"), chars = $$(".hero-char", root), directions = ["to-bottom", "to-left", "to-top", "to-right"];
    let active = true;
    new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }).observe(root);
    const tick = () => {
      if (active && !document.hidden && Math.random() <= .01) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        if (!directions.some((name) => char.classList.contains(name))) { const name = directions[Math.floor(Math.random() * directions.length)]; char.classList.add(name); setTimeout(() => char.classList.remove(name), 2000); }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function initBinaryObservers() {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle("is-running", entry.isIntersecting)), { rootMargin: "80px" });
    $$(".binary").forEach((node) => observer.observe(node));
  }

  function initWarningTyping(scrollController) {
    const copy = $(".warning-copy");
    if (!copy) return;
    const typingEnabled = false;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accessibleText = copy.innerText.replace(/\n+/g, " ").trim();
    let characterIndex = 0;
    const wrapText = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();
          Array.from(child.textContent).forEach((character) => {
            const span = document.createElement("span");
            span.className = "typing-character";
            span.style.setProperty("--type-index", characterIndex++);
            span.textContent = character === " " ? "\u00a0" : character;
            fragment.appendChild(span);
          });
          child.replaceWith(fragment);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          if (child.tagName === "MARK") child.style.setProperty("--mark-index", characterIndex);
          wrapText(child);
        }
      });
    };
    if (typingEnabled) wrapText(copy);
    copy.setAttribute("aria-label", accessibleText);
    const characters = $$(".typing-character", copy);
    const flashImages = $$(".warning-flash-images img", copy);
    copy.classList.remove("is-flashing");
    flashImages.forEach((image, index) => image.classList.toggle("is-visible", index === 0));
    let triggered = false;
    let previousCenter = copy.getBoundingClientRect().top + copy.offsetHeight / 2;
    let lastScrollY = scrollY;
    let checkRaf = 0;
    let warningTyped = false;
    let awaitingFirstFlash = false;
    let lastWheelInputAt = performance.now();
    let flashActive = false;
    let flashCompleted = false;
    let flashLocking = false;
    let flashLockPosition = 0;
    let flashStep = 0;
    let wheelGestureOpen = false;
    let wheelGestureDirection = 0;
    let wheelGestureTimer = 0;
    let touchStartY = 0;

    const blockedKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
    const waitForFirstFlash = () => {
      awaitingFirstFlash = true;
      lastWheelInputAt = performance.now();
    };
    const paintFlash = () => {
      flashImages.forEach((image, index) => image.classList.toggle("is-visible", index === flashStep));
    };
    const finishFlash = (completed) => {
      flashActive = false;
      flashCompleted = completed;
      if (!completed) {
        flashStep = -1;
        copy.classList.remove("is-flashing");
        paintFlash();
      }
      scrollController.unlock();
      releaseNativeInput();
    };
    const advanceFlash = (direction) => {
      if (!flashActive) return;
      const nextStep = flashStep + direction;
      if (nextStep < 0) { finishFlash(false); return; }
      if (nextStep >= flashImages.length) { finishFlash(true); return; }
      flashStep = nextStep;
      paintFlash();
    };
    const preventWheel = (event) => {
      event.preventDefault();
      const now = performance.now();
      const wheelGap = now - lastWheelInputAt;
      lastWheelInputAt = now;
      if (awaitingFirstFlash) {
        if (wheelGap >= 120 && event.deltaY > 0) {
          awaitingFirstFlash = false;
          wheelGestureOpen = true;
          wheelGestureDirection = 1;
          clearTimeout(wheelGestureTimer);
          wheelGestureTimer = setTimeout(() => { wheelGestureOpen = false; }, 180);
          startFlash();
        }
        return;
      }
      if (!flashActive || event.deltaY === 0) return;
      const direction = Math.sign(event.deltaY);
      clearTimeout(wheelGestureTimer);
      if (direction !== wheelGestureDirection) wheelGestureOpen = false;
      if (!wheelGestureOpen) {
        wheelGestureOpen = true;
        wheelGestureDirection = direction;
        advanceFlash(direction);
      }
      wheelGestureTimer = setTimeout(() => { wheelGestureOpen = false; }, 180);
    };
    const preventTouch = (event) => event.preventDefault();
    const rememberTouch = (event) => { touchStartY = event.touches[0]?.clientY || 0; };
    const finishTouch = (event) => {
      const endY = event.changedTouches[0]?.clientY || touchStartY;
      const distance = touchStartY - endY;
      if (awaitingFirstFlash && distance > 30) {
        awaitingFirstFlash = false;
        startFlash();
        return;
      }
      if (flashActive && Math.abs(distance) > 30) advanceFlash(Math.sign(distance));
    };
    const preventKey = (event) => {
      if (!blockedKeys.has(event.key)) return;
      event.preventDefault();
      if (event.repeat) return;
      if (awaitingFirstFlash && ["ArrowDown", "PageDown", "End", " "].includes(event.key)) {
        awaitingFirstFlash = false;
        startFlash();
        return;
      }
      if (!flashActive) return;
      if (["ArrowDown", "PageDown", "End", " "].includes(event.key)) advanceFlash(1);
      else if (["ArrowUp", "PageUp", "Home"].includes(event.key)) advanceFlash(-1);
    };
    const blockNativeInput = () => {
      addEventListener("wheel", preventWheel, { passive: false });
      addEventListener("touchstart", rememberTouch, { passive: true });
      addEventListener("touchmove", preventTouch, { passive: false });
      addEventListener("touchend", finishTouch, { passive: true });
      addEventListener("keydown", preventKey, { passive: false });
    };
    const releaseNativeInput = () => {
      removeEventListener("wheel", preventWheel);
      removeEventListener("touchstart", rememberTouch);
      removeEventListener("touchmove", preventTouch);
      removeEventListener("touchend", finishTouch);
      removeEventListener("keydown", preventKey);
    };

    const revealAll = () => {
      characters.forEach((character) => character.classList.add("is-typed"));
      $$("mark", copy).forEach((mark) => mark.classList.add("is-typed"));
    };
    const startFlash = (direction = 1) => {
      if (!warningTyped) {
        warningTyped = true;
        flashLockPosition = scrollY;
      }
      copy.classList.add("is-flashing");
      flashActive = true;
      flashCompleted = false;
      flashStep = direction > 0 ? 0 : flashImages.length - 1;
      paintFlash();
    };
    const resumeFlash = (direction) => {
      if (flashActive || flashLocking) return;
      flashLocking = true;
      scrollController.lock();
      blockNativeInput();
      scrollController.moveTo(flashLockPosition, () => {
        flashLocking = false;
        if (direction > 0) {
          waitForFirstFlash();
        }
        else startFlash(direction);
      });
    };
    const type = () => {
      if (!typingEnabled) {
        flashLockPosition = scrollY;
        waitForFirstFlash();
        return;
      }
      if (reducedMotion) {
        revealAll();
        startFlash();
        return;
      }
      characters.forEach((character, index) => {
        setTimeout(() => {
          character.classList.add("is-typed");
          const mark = character.closest("mark");
          if (mark) mark.classList.add("is-typed");
          if (index === characters.length - 1) {
            startFlash();
          }
        }, index * 35);
      });
    };

    const centerAndType = (frame = 0) => {
      const rect = copy.getBoundingClientRect();
      const error = rect.top + rect.height / 2 - innerHeight / 2;
      if (Math.abs(error) <= 2 || frame >= 90) {
        type();
        return;
      }
      scrollController.moveTo(scrollY + error);
      requestAnimationFrame(() => centerAndType(frame + 1));
    };

    const trigger = () => {
      triggered = true;
      scrollController.lock();
      blockNativeInput();
      centerAndType();
    };

    const check = () => {
      checkRaf = 0;
      const rect = copy.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const scrollingDown = scrollY >= lastScrollY;
      if (!triggered && scrollingDown && previousCenter > innerHeight / 2 && center <= innerHeight / 2) trigger();
      else if (triggered && flashCompleted && !flashActive && !scrollingDown && previousCenter <= innerHeight / 2 && center >= innerHeight / 2) resumeFlash(-1);
      else if (triggered && warningTyped && !flashCompleted && !flashActive && scrollingDown && previousCenter >= innerHeight / 2 && center <= innerHeight / 2) resumeFlash(1);
      previousCenter = center;
      lastScrollY = scrollY;
    };
    const requestCheck = () => {
      if (!checkRaf) checkRaf = requestAnimationFrame(check);
    };
    addEventListener("scroll", requestCheck, { passive: true });
    addEventListener("resize", requestCheck);
  }

  function initPerspectiveRails(scrollController) {
    const section = $(".story"), center = $(".story-center"), svg = $(".room-grid", section), path = $("path", svg);
    let raf = 0, targetProgress = 0, smoothProgress = 0, visible = false, forced = true;

    const line = (lines, x1, y1, x2, y2) => lines.push(`M ${x1} ${y1} L ${x2} ${y2}`);
    const interpolate = (from, to, depth) => ({
      x: from.x + (to.x - from.x) * depth,
      y: from.y + (to.y - from.y) * depth
    });

    const draw = (offsetY) => {
      const width = innerWidth, height = section.clientHeight;
      const centerWidth = center.offsetWidth, centerHeight = center.offsetHeight;
      const innerLeft = (width - centerWidth) / 2, innerTop = (height - centerHeight) / 2 + offsetY;
      const columns = width > 767 ? 12 : 8, depthSteps = 4;
      const outerColumn = width / columns, outerRow = height / columns;
      const innerColumn = centerWidth / columns, innerRow = centerHeight / columns;
      const outer = { left: 0, right: width, top: 0, bottom: height };
      const inner = { left: innerLeft, right: innerLeft + centerWidth, top: innerTop, bottom: innerTop + centerHeight };
      const corners = {
        topLeft: [{ x: outer.left, y: outer.top }, { x: inner.left, y: inner.top }],
        topRight: [{ x: outer.right, y: outer.top }, { x: inner.right, y: inner.top }],
        bottomLeft: [{ x: outer.left, y: outer.bottom }, { x: inner.left, y: inner.bottom }],
        bottomRight: [{ x: outer.right, y: outer.bottom }, { x: inner.right, y: inner.bottom }]
      };
      const lines = [];

      for (let index = 1; index < columns; index++) {
        line(lines, outerColumn * index, outer.top, inner.left + innerColumn * index, inner.top);
        line(lines, outerColumn * index, outer.bottom, inner.left + innerColumn * index, inner.bottom);
      }

      for (let index = 1; index < depthSteps; index++) {
        const depth = 1 - (1 - index / depthSteps) ** 2;
        const left = interpolate(corners.topLeft[0], corners.topLeft[1], depth);
        const right = interpolate(corners.topRight[0], corners.topRight[1], depth);
        line(lines, left.x, left.y, right.x, right.y);
        const bottomLeft = interpolate(corners.bottomLeft[0], corners.bottomLeft[1], depth);
        const bottomRight = interpolate(corners.bottomRight[0], corners.bottomRight[1], depth);
        line(lines, bottomLeft.x, bottomLeft.y, bottomRight.x, bottomRight.y);
      }

      for (let index = 0; index <= columns; index++) {
        line(lines, outer.left, outerRow * index, inner.left, inner.top + innerRow * index);
        line(lines, outer.right, outerRow * index, inner.right, inner.top + innerRow * index);
      }

      for (let index = 1; index < depthSteps; index++) {
        const depth = 1 - (1 - index / depthSteps) ** 2;
        const topRight = interpolate(corners.topRight[0], corners.topRight[1], depth);
        const bottomRight = interpolate(corners.bottomRight[0], corners.bottomRight[1], depth);
        line(lines, topRight.x, topRight.y, bottomRight.x, bottomRight.y);
        const topLeft = interpolate(corners.topLeft[0], corners.topLeft[1], depth);
        const bottomLeft = interpolate(corners.bottomLeft[0], corners.bottomLeft[1], depth);
        line(lines, topLeft.x, topLeft.y, bottomLeft.x, bottomLeft.y);
      }

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      path.setAttribute("d", lines.join(" "));
    };

    const updateTarget = () => {
      if (scrollController.isLocked()) return;
      const rect = section.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < innerHeight;
      section.classList.toggle("is-active", visible);
      svg.style.display = visible ? "block" : "none";
      targetProgress = clamp((innerHeight - rect.top) / (rect.height + innerHeight));
      forced = true;
      requestTick();
    };

    const tick = () => {
      raf = 0;
      smoothProgress += (targetProgress - smoothProgress) * .2;
      const amplitude = innerWidth > 767 ? innerWidth * (400 / 1920) : innerWidth * (200 / 767);
      const offset = amplitude * (smoothProgress * 2 - 1);
      center.style.transform = visible ? `translate3d(0,${offset}px,0)` : "none";
      if (visible && (forced || Math.abs(targetProgress - smoothProgress) > .0005)) draw(offset);
      forced = false;
      if (visible && Math.abs(targetProgress - smoothProgress) > .0005) raf = requestAnimationFrame(tick);
    };

    const requestTick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener("resize", updateTarget);
    addEventListener("scroll", updateTarget, { passive: true });
    updateTarget();
  }

  function initSmileyTrail() {
    const grid = $(".award-grid"), root = $(".smiley-trail"), awards = [...$$(".award", grid), ...$$(".value-reveal")];
    root.remove();
    awards.forEach((award) => {
      const inner = document.createElement("div");
      inner.className = "award-reveal-inner";
      while (award.firstChild) inner.appendChild(award.firstChild);
      award.appendChild(inner);
    });

    let revealRaf = 0;
    const revealAwards = () => {
      revealRaf = 0;
      const ordered = awards
        .filter((award) => !award.classList.contains("is-revealed"))
        .map((award) => ({ award, rect: award.getBoundingClientRect() }))
        .sort((a, b) => Math.abs(a.rect.top - b.rect.top) < 2 ? a.rect.left - b.rect.left : a.rect.top - b.rect.top);
      ordered.forEach(({ award, rect }, index) => {
        const triggerLine = innerHeight * .82 - Math.min(index, 3) * 22;
        if (rect.top <= triggerLine && rect.bottom >= 0) award.classList.add("is-revealed");
      });
    };
    const requestReveal = () => { if (!revealRaf) revealRaf = requestAnimationFrame(revealAwards); };
    addEventListener("scroll", requestReveal, { passive: true });
    addEventListener("resize", requestReveal);
    requestReveal();

  }

  function initWorkSection() {
    const section = $(".work-showcase"), stage = $(".work-stage"), cards = $$(".work-project"), letterCopies = [14, 18, 18, 17];
    const stackGroupMap = new Map();
    const stackTimelineOrder = new Map([
      ["triple-craft", -1],
      ["pair-4-11", 0],
      ["pair-9-10", 1],
      ["triple-12-14", 2],
      ["grid-remaining", 3]
    ]);
    const cardGroups = cards.reduce((groups, card, index) => {
      const stackGroup = card.dataset.stackGroup;
      if (stackGroup) {
        if (!stackGroupMap.has(stackGroup)) {
          const group = [];
          stackGroupMap.set(stackGroup, group);
          groups.push(group);
        }
        stackGroupMap.get(stackGroup).push(index);
      } else {
        groups.push([index]);
      }
      return groups;
    }, []).sort((groupA, groupB) => {
      const rank = (group) => {
        const firstCard = cards[group[0]];
        const stackGroup = firstCard.dataset.stackGroup;
        if (group[0] < 6) return group[0];
        if (stackGroup) return 6 + stackTimelineOrder.get(stackGroup);
        return 100 + group[0];
      };
      return rank(groupA) - rank(groupB);
    });
    const maskInner = $(".work-mask-inner"), maskOuter = $(".work-mask-outer"), maskGridClip = $(".work-mask-grid-clip"), rowFrequencies = [1, 1.18, .93, 1.12];
    const glyphs = $$("[data-letter]", stage).map((element) => ({ element, row: Number(element.dataset.row || 0), slot: Number(element.dataset.slot || 0) }));
    const visibleCards = new Set(); let raf = 0, openStackGroup = "", horizontalStackExpanded = false, lastWorkProgress = 0;
    const setOpenStackGroup = (nextGroup) => {
      if (nextGroup === openStackGroup) return;
      (stackGroupMap.get(openStackGroup) || []).forEach((index) => cards[index].classList.remove("is-stack-open"));
      (stackGroupMap.get(nextGroup) || []).forEach((index) => cards[index].classList.add("is-stack-open"));
      openStackGroup = nextGroup;
    };
    const easeIn = (value) => value ** 5;
    const update = () => {
      raf = 0; const rect = section.getBoundingClientRect(), viewport = innerHeight, inView = rect.bottom > 0 && rect.top < viewport; stage.classList.toggle("is-active", inView);
      if (!inView) { visibleCards.forEach((index) => { cards[index].style.opacity = "0"; cards[index].style.visibility = "hidden"; }); visibleCards.clear(); setOpenStackGroup(""); return; }
      const holdDistance = viewport * (Number(section.style.getPropertyValue("--work-hold-vh")) || 0) / 100;
      const progress = clamp((viewport * .25 - rect.top) / Math.max(1, rect.height - viewport * .5 - holdDistance));
      const workDirection = progress - lastWorkProgress;
      const intro = clamp(progress / .075), outro = clamp((progress - .95) / .05);
      const open = easeIn(intro) * (1 - easeIn(outro)), state = open;
      const sceneOpen = intro ** 4 * (1 - outro ** 4);
      const stageTop = stage.getBoundingClientRect().top;
      const letterPinY = -stageTop * (1 - sceneOpen);
      stage.classList.toggle("mask-open", open > .999); stage.style.setProperty("--work-progress", String(progress)); stage.style.setProperty("--work-state", String(state)); stage.style.setProperty("--mask-open", String(open)); stage.style.setProperty("--scene-open", String(sceneOpen)); stage.style.setProperty("--letter-pin-y", `${letterPinY}px`);
      const timelineTime = progress * 10.25, letterTween = clamp((timelineTime - .75) / 9.5), letterEased = 1 - (1 - letterTween) ** 2, diagonalSpeed = Math.hypot(innerWidth, viewport) * 4, animationProgress = letterEased * 10000;
      glyphs.forEach(({ element, row, slot }) => { const cycle = diagonalSpeed * rowFrequencies[row], phase = ((animationProgress % cycle) / cycle + slot / letterCopies[row]) % 1; element.style.setProperty("--letter-progress", String(phase / .7 - .15)); });
      const stageWidth = stage.clientWidth || innerWidth, outerWidth = stageWidth > 987 ? Math.min(stageWidth / 6, 314) : stageWidth / (stageWidth <= 576 ? 2 : 3);
      const outerWidthSvg = outerWidth / stageWidth * 1200, outerLeft = (1200 - outerWidthSvg) / 2, outerRight = outerLeft + outerWidthSvg;
      const outerTop = 100, outerBottom = 900, outerRadiusX = outerWidthSvg / 2;
      const outerRadiusY = outerRadiusX * (stageWidth / 1200) / (viewport / 1000);
      const insetX = (stageWidth > 767 ? 16 : 8) / stageWidth * 1200, insetY = (stageWidth > 767 ? 16 : 8) / viewport * 1000;
      const rectangle = "M -1 0 L 1201 0 L 1201 1000 L -1 1000 Z";
      const capsule = (left, right, top, bottom, radiusX, radiusY) => `M ${left} ${top + radiusY} A ${radiusX} ${radiusY} 0 0 1 ${right} ${top + radiusY} L ${right} ${bottom - radiusY} A ${radiusX} ${radiusY} 0 0 1 ${left} ${bottom - radiusY} Z`;
      const outerCapsule = capsule(outerLeft, outerRight, outerTop, outerBottom, outerRadiusX, outerRadiusY);
      const innerCapsule = capsule(outerLeft + insetX, outerRight - insetX, outerTop + insetY, outerBottom - insetY, Math.max(1, outerRadiusX - insetX), Math.max(1, outerRadiusY - insetY));
      const outerPath = `${rectangle} ${outerCapsule}`, innerPath = `${rectangle} ${innerCapsule}`;
      maskOuter.setAttribute("d", outerPath); maskInner.setAttribute("d", innerPath); maskGridClip.setAttribute("d", outerPath);
      const maxScale = stageWidth / Math.max(1, outerWidth / 2), maskScale = 1 + (maxScale - 1) * open;
      stage.style.setProperty("--mask-scale", String(maskScale));
      const galleryStart = .085, galleryEnd = .95, regularEnd = .64, regularGroupCount = Math.max(1, cardGroups.length - 1);
      const groupTimings = cardGroups.map((group, groupIndex) => {
        const horizontal = cards[group[0]].dataset.stackGroup === "grid-remaining";
        return horizontal
          ? { centre: .76, halfTravel: .16 }
          : { centre: galleryStart + (groupIndex + .5) / regularGroupCount * (regularEnd - galleryStart), halfTravel: (regularEnd - galleryStart) / regularGroupCount * 1.02 };
      });
      const nearest = groupTimings.reduce((best, timing, index) => Math.abs(timing.centre - progress) < Math.abs(groupTimings[best].centre - progress) ? index : best, 0);
      const keepHorizontalAtEnd = horizontalStackExpanded && progress > galleryEnd, nextActive = progress < galleryStart || progress > galleryEnd && !keepHorizontalAtEnd ? -1 : nearest, nextVisible = new Set();
      let nextOpenStackGroup = "";
      if (nextActive >= 0) {
        const firstGroup = Math.max(0, nearest - 1);
        const lastGroup = Math.min(cardGroups.length - 1, nearest + 1);
        for (let groupIndex = firstGroup; groupIndex <= lastGroup; groupIndex++) {
          const stackGroup = cards[cardGroups[groupIndex][0]].dataset.stackGroup;
          const isHorizontalStack = stackGroup === "grid-remaining";
          const { centre, halfTravel } = groupTimings[groupIndex];
          const cardProgress = clamp((centre - progress) / halfTravel, -1, 1);
          if (isHorizontalStack) {
            if (workDirection >= 0 && cardProgress < .35) horizontalStackExpanded = true;
            if (workDirection < 0 && cardProgress >= 0) horizontalStackExpanded = false;
          }
          const visible = isHorizontalStack ? (horizontalStackExpanded ? progress < .95 : Math.abs(cardProgress) < .99) : Math.abs(cardProgress) < .92;
          const stackOpenRange = stackGroup === "triple-craft" || stackGroup === "triple-12-14" ? .58 : .22;
          if (stackGroup && groupIndex === nearest && (isHorizontalStack ? horizontalStackExpanded : Math.abs(cardProgress) < stackOpenRange)) nextOpenStackGroup = stackGroup;
          cardGroups[groupIndex].forEach((index) => {
            const card = cards[index];
            card.style.setProperty("--card-progress", String(cardProgress));
            if (isHorizontalStack) {
              const horizontalProgress = clamp(-cardProgress / .82);
              card.style.setProperty("--stack-scroll-x", `${horizontalProgress * -245}vw`);
            }
            card.style.opacity = visible ? "1" : "0";
            card.style.visibility = visible ? "visible" : "hidden";
            card.style.pointerEvents = Math.abs(cardProgress) < .35 ? "auto" : "none";
            if (visible) nextVisible.add(index);
          });
        }
      }
      setOpenStackGroup(nextOpenStackGroup);
      visibleCards.forEach((index) => { if (!nextVisible.has(index)) { cards[index].style.opacity = "0"; cards[index].style.visibility = "hidden"; cards[index].style.pointerEvents = "none"; } }); visibleCards.clear(); nextVisible.forEach((index) => visibleCards.add(index));
      lastWorkProgress = progress;
    };
    const requestUpdate = () => { if (!raf) raf = requestAnimationFrame(update); };
    addEventListener("scroll", requestUpdate, { passive: true }); addEventListener("resize", requestUpdate); requestUpdate();
  }

  function initSkillsSection() {
    const section = $(".skills");
    if (!section) return;
    const cards = $$(".skill-card[data-skill]", section);
    const targets = $$(".skills-list p[data-skill]", section);
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const entry = clamp((innerHeight - rect.top) / Math.max(1, innerHeight));
      const progress = clamp(-rect.top / Math.max(1, rect.height - innerHeight));
      const exit = clamp((progress - .86) / .14);
      section.style.setProperty("--skills-entry", String(entry));
      section.style.setProperty("--skills-progress", String(progress));
      section.style.setProperty("--skills-exit", String(exit));

      const activeSkills = new Set();
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        if (cardRect.bottom > 0 && cardRect.top < innerHeight) activeSkills.add(card.dataset.skill);
      });
      targets.forEach((target) => {
        const isActive = target.dataset.skill.split(/\s+/).some((skill) => activeSkills.has(skill));
        target.classList.toggle("is-active", isActive);
      });
    };
    const requestUpdate = () => { if (!raf) raf = requestAnimationFrame(update); };
    addEventListener("scroll", requestUpdate, { passive: true });
    addEventListener("resize", requestUpdate);
    requestUpdate();
  }

  function initHistory(smoothScroll) {
    const section = $(".history"), wrapper = $(".history-objects"), smiley = $(".history-smiley"), path = $(".history-lines path"), photoPlane = $(".history-photos", section), photos = $$(".history-photo", section), nodes = $$(".history-object", wrapper);
    const pool = nodes.map((element, index) => ({ element, index, size: 1, s: 0, x: 0, y: 0, z: -20000, rx: 90, ry: 0, rz: 0, vx: 0, vy: 0, vz: 45, vrx: 1, vry: 1 })), active = [];
    let raf = 0, visible = false, lastThrow = 0, throwDelay = 750, targetProgress = 0, smoothProgress = 0;
    let photoTimeline = 0, photoTargetTimeline = 0, photoPauseUntil = 0, photoPauseIndex = 0, photoDirection = 0;
    let historyLocked = false, historyLocking = false, historyComplete = false, historyLockPosition = 0, historyExitProgress = 0, lastPageY = scrollY;
    let historyTextStartY = -innerHeight;
    const photoEnd = 1, textEnd = 1.16;
    const photoSlot = 1 / (photos.length - 1 + 1.45);
    const photoStandAt = (photo) => {
      if (photo.classList.contains("history-caption")) return .84;
      const wideScreenLift = clamp((innerWidth / innerHeight - 1.6) / .5) * .08;
      return .76 - (photo.classList.contains("is-portrait") ? wideScreenLift : 0);
    };
    let photoPausePoints = photos.map((photo, index) => (index + 1.45 * photoStandAt(photo)) * photoSlot).filter((point) => point < 1);
    const paint = (object) => { const style = object.element.style; style.setProperty("--s", object.s); style.setProperty("--size", object.size); style.setProperty("--x", `${object.x}px`); style.setProperty("--y", `${object.y}px`); style.setProperty("--z", `${object.z}px`); style.setProperty("--rx", object.rx); style.setProperty("--ry", object.ry); style.setProperty("--rz", object.rz); };
    const reset = (object, spread = false) => { object.size = .5 + Math.random() * .5; object.s = spread ? 1 : 0; object.x = object.y = 0; object.z = spread ? -Math.random() * 20000 : -20000; object.rx = spread ? Math.random() * 360 : 90; object.ry = Math.random() * 2 - 1; object.rz = 0; object.vz = 40 + Math.random() * 10; object.vx = Math.random() * innerWidth * .0025 * (object.index % 2 ? -1 : 1); object.vy = Math.random() * innerHeight * .0025 * (object.index % 3 ? -1 : 1); object.vrx = .25 + Math.random(); object.vry = .25 + Math.random(); paint(object); object.element.classList.remove("is-waiting"); };
    const recycle = (object) => { object.element.classList.add("is-waiting"); active.splice(active.indexOf(object), 1); pool.push(object); };
    const throwObject = (spread = false) => { if (active.length >= 5 || !pool.length) return; const object = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; reset(object, spread); active.push(object); };

    const geometry = () => {
      const box = section.getBoundingClientRect(), face = smiley.getBoundingClientRect();
      const width = box.width, height = box.height;
      const cx = face.left - box.left + face.width / 2, cy = face.top - box.top + face.height / 2;
      const columns = innerWidth > 767 ? 60 : 30, depthSteps = innerWidth > 767 ? 11 : 8, floorDepthSteps = innerWidth > 767 ? 18 : 12;
      const planeLeft = -width * 2, planeRight = width * 3, planeWidth = planeRight - planeLeft;
      const gap = planeWidth / columns;
      let d = "";

      for (let index = 0; index <= columns; index++) {
        const x = planeLeft + gap * index;
        const floorX = x;
        d += `M ${x} 0 L ${cx} ${cy} M ${cx} ${cy} L ${floorX} ${height} `;
      }

      for (let index = 0; index < depthSteps; index++) {
        const depth = index / depthSteps;
        const eased = 1 - (1 - depth) ** 2.8;
        const ceilingLeftX = planeLeft + (cx - planeLeft) * eased;
        const ceilingRightX = planeRight + (cx - planeRight) * eased;
        const ceilingY = cy * eased;
        d += `M ${ceilingLeftX} ${ceilingY} L ${ceilingRightX} ${ceilingY} `;
      }

      for (let index = 0; index < floorDepthSteps; index++) {
        const depth = index / floorDepthSteps;
        const eased = 1 - (1 - depth) ** 4.2;
        const floorPlaneLeft = planeLeft;
        const floorPlaneRight = planeRight;
        const floorLeftX = floorPlaneLeft + (cx - floorPlaneLeft) * eased;
        const floorRightX = floorPlaneRight + (cx - floorPlaneRight) * eased;
        const floorY = height + (cy - height) * eased;
        d += `M ${floorLeftX} ${floorY} L ${floorRightX} ${floorY} `;
      }

      path.setAttribute("d", d);
      section.style.setProperty("--distortion", Math.hypot(width, (height - cy) / 1) * .05);
    };
    const measureHistoryTextStart = () => {
      const firstLine = $(".history-text-distorted span", section);
      if (!firstLine) return;
      const previousOpacity = section.style.getPropertyValue("--history-text-opacity");
      section.style.setProperty("--history-text-opacity", "0");
      let position = -innerHeight;
      for (let pass = 0; pass < 6; pass++) {
        section.style.setProperty("--history-text-y", `${position}px`);
        const lineCenter = firstLine.getBoundingClientRect().top + firstLine.getBoundingClientRect().height / 2;
        const face = smiley.getBoundingClientRect();
        const target = face.top + face.height / 2;
        section.style.setProperty("--history-text-y", `${position + 10}px`);
        const shifted = firstLine.getBoundingClientRect();
        const shiftedCenter = shifted.top + shifted.height / 2;
        const slope = (shiftedCenter - lineCenter) / 10;
        if (Math.abs(slope) < .001) break;
        position = clamp(position + (target - lineCenter) / slope, -innerHeight * 20, 0);
      }
      historyTextStartY = position;
      section.style.setProperty("--history-text-opacity", previousOpacity || "0");
    };
    const paintHistoryText = () => {
      const textProgress = clamp((photoTimeline - photoEnd) / (textEnd - photoEnd));
      const textArrival = textProgress ** .28;
      const textY = historyComplete && !historyLocked ? `${historyExitProgress * 100}%` : `${historyTextStartY * (1 - textArrival)}px`;
      section.style.setProperty("--history-text-y", textY);
      section.style.setProperty("--history-text-opacity", String(historyComplete && !historyLocked || textProgress > 0 ? 1 : 0));
    };
    const paintPhotos = () => {
      let standAmount = 0;
      photos.forEach((photo, index) => {
        const local = clamp((photoTimeline - index * photoSlot) / (photoSlot * 1.45));
        const perspectiveProgress = local ** .28;
        const portrait = photo.classList.contains("is-portrait");
        const standAt = photoStandAt(photo);
        const standIn = clamp((local - (standAt - .14)) / .14);
        const standOut = 1 - clamp((local - (standAt + .02)) / .12);
        const photoStand = Math.min(standIn, standOut);
        standAmount = Math.max(standAmount, photoStand);
        const caption = photo.classList.contains("history-caption");
        const photoOrder = Number(photo.dataset.photoOrder || 0);
        const lane = caption ? 0 : [0, -1, 1, 0][photoOrder % 4];
        const landscape = photo.classList.contains("is-landscape");
        const lateralProgress = clamp((local - .12) / .88) ** .75;
        const laneSpread = lane === 0 ? 0 : .6 + lateralProgress * .4;
        const photoX = lane * innerWidth * (landscape ? .285 : .32) * laneSpread;
        const photoRotateY = lane * -18 * laneSpread;
        const photoPlaneHeight = photo.parentElement.clientHeight;
        const exitY = photoPlaneHeight + 20;
        const fallingY = -8000 + perspectiveProgress * (8000 + exitY);
        const standBottom = photoPlaneHeight * .92;
        const standScaleReduction = caption ? 0 : portrait ? .3 : .22;
        const photoStandScale = 1 - photoStand * standScaleReduction;
        const bottomStretch = clamp((local - .72) / .28);
        const photoYScale = 1 - bottomStretch * .22;
        const bottomAlignedY = standBottom - photo.offsetHeight * photoStandScale * photoYScale;
        const photoY = fallingY + (bottomAlignedY - fallingY) * photoStand;
        photo.style.setProperty("--photo-x", `${photoX}px`);
        photo.style.setProperty("--photo-y", `${photoY}px`);
        photo.style.setProperty("--photo-ry", `${photoRotateY}deg`);
        photo.style.setProperty("--photo-stand-scale", String(photoStandScale));
        photo.style.setProperty("--photo-y-scale", String(photoYScale));
        photo.style.setProperty("--photo-opacity", String(clamp(local / .08)));
      });
      photoPlane.style.setProperty("--photo-tilt", String(1 - standAmount));
      paintHistoryText();
    };
    const lockHistory = (direction = 0) => {
      if (historyLocked || historyLocking) return;
      historyLocking = true;
      smoothScroll.moveTo(historyLockPosition, () => {
        historyLocking = false;
        historyLocked = true;
        smoothScroll.lock();
        if (direction < 0 && photoTimeline >= textEnd - .001) {
          const reverseStart = textEnd;
          photoTimeline = reverseStart;
          photoTargetTimeline = reverseStart;
          photoDirection = -1;
          photoPauseUntil = 0;
          paintPhotos();
        } else if (direction > 0) {
          photoDirection = 1;
          photoPauseUntil = 0;
          const nextPause = photoPausePoints.findIndex((point) => point > photoTimeline + .001);
          photoPauseIndex = nextPause < 0 ? photoPausePoints.length : nextPause;
        }
      });
    };
    const releaseHistory = (direction) => {
      historyLocked = false;
      historyComplete = direction > 0;
      smoothScroll.unlock();
      smoothScroll.moveTo(historyLockPosition + direction * 2);
    };
    const advancePhotos = (delta) => {
      photoDirection = Math.sign(delta);
      const divisor = photoTargetTimeline < photoEnd ? 10 : 3.5;
      photoTargetTimeline = clamp(photoTargetTimeline + delta / (innerHeight * divisor), 0, textEnd);
      start();
    };
    const updatePhotoTimeline = (time) => {
      if (!historyLocked || time < photoPauseUntil) return;
      const difference = photoTargetTimeline - photoTimeline;
      if (Math.abs(difference) < .00015) photoTimeline = photoTargetTimeline;
      else {
        const nextTimeline = photoTimeline + difference * .12;
        const pausePoint = photoPausePoints[photoPauseIndex];
        if (difference > 0 && pausePoint !== undefined && nextTimeline >= pausePoint) {
          photoTimeline = pausePoint;
          photoPauseIndex += 1;
          photoPauseUntil = time + 350;
        } else {
          photoTimeline = nextTimeline;
          if (difference < 0) {
            const nextPause = photoPausePoints.findIndex((point) => point > photoTimeline + .001);
            photoPauseIndex = nextPause < 0 ? photoPausePoints.length : nextPause;
          }
        }
      }
      paintPhotos();
      if (photoDirection > 0 && photoTimeline >= textEnd - .0001 && photoTargetTimeline >= textEnd) releaseHistory(1);
      else if (photoDirection < 0 && photoTimeline <= .0001 && photoTargetTimeline <= 0) releaseHistory(-1);
    };
    const updateTarget = () => {
      const box = section.getBoundingClientRect();
      const start = box.top + scrollY, end = start + box.height + innerHeight, value = scrollY + innerHeight;
      targetProgress = value < start ? 0 : value > end ? 1 : (value - start) / (end - start);
      historyLockPosition = start + box.height - innerHeight;
      historyExitProgress = clamp((scrollY - historyLockPosition) / innerHeight);
      paintHistoryText();
      const direction = scrollY - lastPageY;
      if (!historyLocked && !historyLocking) {
        if (!historyComplete && direction >= 0 && scrollY >= historyLockPosition && scrollY < historyLockPosition + innerHeight) lockHistory(1);
        else if (historyComplete && direction < 0 && scrollY <= historyLockPosition && scrollY > historyLockPosition - innerHeight) lockHistory(-1);
      }
      lastPageY = scrollY;
    };
    const tick = (time) => { raf = 0; if (!visible) return; smoothProgress += (targetProgress - smoothProgress) * .1; section.style.setProperty("--history-progress", smoothProgress); updatePhotoTimeline(time); if (time - lastThrow > throwDelay) { throwObject(); lastThrow = time; throwDelay = 500 + Math.random() * 500; } active.slice().forEach((object) => { object.s = Math.min(1, object.s + .005); object.z += object.vz; object.x += object.vx; object.y += object.vy; object.rx += object.vrx; object.ry += object.vry; if (object.z > 1000) recycle(object); else paint(object); }); raf = requestAnimationFrame(tick); };
    const start = () => { if (visible && !raf) raf = requestAnimationFrame(tick); };
    nodes.forEach((node) => node.classList.add("is-waiting")); geometry(); measureHistoryTextStart(); updateTarget();
    document.fonts?.ready.then(() => { measureHistoryTextStart(); paintHistoryText(); });
    smoothScroll.setWheelInterceptor((delta) => {
      if (historyLocked) { advancePhotos(delta); return true; }
      if (historyLocking) return true;
      const position = smoothScroll.position();
      const crossingDown = !historyComplete && delta > 0 && position.target < historyLockPosition && position.target + delta >= historyLockPosition;
      const crossingUp = historyComplete && delta < 0 && position.target > historyLockPosition && position.target + delta <= historyLockPosition;
      const alreadyAtDown = !historyComplete && delta > 0 && position.current >= historyLockPosition && position.current < historyLockPosition + innerHeight;
      const alreadyAtUp = historyComplete && delta < 0 && position.current <= historyLockPosition && position.current > historyLockPosition - innerHeight;
      if (crossingDown || crossingUp || alreadyAtDown || alreadyAtUp) { lockHistory(crossingUp || alreadyAtUp ? -1 : 1); return true; }
      return false;
    });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; section.classList.toggle("is-active", visible); if (visible) { while (active.length < Math.min(5, nodes.length)) throwObject(true); updateTarget(); start(); } else { cancelAnimationFrame(raf); raf = 0; } }, { rootMargin: "100% 0px" }).observe(section);
    const update = () => { updateTarget(); start(); }; addEventListener("scroll", update, { passive: true }); addEventListener("resize", () => { photoPausePoints = photos.map((photo, index) => (index + 1.45 * photoStandAt(photo)) * photoSlot).filter((point) => point < 1); geometry(); measureHistoryTextStart(); paintPhotos(); update(); });
  }

  function initContact() {
    const section = $(".contact"), portal = $(".portal"); let last = -1;
    const update = () => { const rect = section.getBoundingClientRect(), progress = rect.top >= innerHeight ? 0 : rect.bottom <= 0 ? 1 : clamp(-rect.top / (rect.height - innerHeight)); if (Math.abs(progress - last) > .0001) { last = progress; portal.style.setProperty("--portal", progress); } };
    addEventListener("scroll", update, { passive: true }); addEventListener("resize", update); update();
  }

  function initChatbotLauncher() {
    const launcher = $(".chatbot-launcher");
    const panel = $(".chatbot-panel");
    const close = $(".chatbot-panel__close", panel);
    const form = $(".chatbot-panel__form", panel);
    const input = $("#chatbot-question", panel);
    const about = $("#about");
    if (!launcher || !panel || !about) return;
    const setOpen = (open) => {
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", String(!open));
      launcher.setAttribute("aria-expanded", String(open));
      launcher.setAttribute("aria-label", open ? "챗봇 닫기" : "챗봇 열기");
      if (open) requestAnimationFrame(() => input?.focus());
    };
    const update = () => {
      const visible = about.getBoundingClientRect().top <= 0;
      launcher.classList.toggle("is-visible", visible);
      launcher.setAttribute("aria-hidden", String(!visible));
      launcher.tabIndex = visible ? 0 : -1;
      if (!visible) setOpen(false);
    };
    launcher.setAttribute("aria-controls", "chatbot-panel");
    launcher.setAttribute("aria-expanded", "false");
    panel.id = "chatbot-panel";
    launcher.addEventListener("click", () => setOpen(!panel.classList.contains("is-open")));
    close?.addEventListener("click", () => { setOpen(false); launcher.focus(); });
    form?.addEventListener("submit", (event) => event.preventDefault());
    addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("is-open")) { setOpen(false); launcher.focus(); }
    });
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
  }

  buildStaticContent();
  initHeader();
  const smoothScroll = initSmoothScroll();
  initLineField();
  initBinaryObservers();
  initWarningTyping(smoothScroll);
  initPerspectiveRails(smoothScroll);
  initSmileyTrail();
  initWorkSection();
  initSkillsSection();
  initHistory(smoothScroll);
  initContact();
  initChatbotLauncher();
})();
