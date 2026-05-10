if (window.location.hash && window.location.hash !== "#") {
  window.history.replaceState(null, "", `${window.location.pathname}#`);
  window.scrollTo(0, 0);
}

const workflow = [
  {
    label: "01 / coleta",
    title: "Coleta de dados e cadastro",
    body:
      "Conexão com bases de campo, arquivos CAD/GIS, levantamentos, sensores e documentos. Cada camada recebe origem, data, coordenada e status de validação.",
    tags: ["CAD", "GIS", "LiDAR", "Campo"],
    visual: "collect"
  },
  {
    label: "02 / leitura",
    title: "Leitura geoespacial",
    body:
      "Interpretação de superfícies, feições, pontos de controle, áreas de interesse e relações territoriais para reduzir ruído operacional.",
    tags: ["Relevo", "Feições", "Áreas", "Datum"],
    visual: "read"
  },
  {
    label: "03 / evidências",
    title: "Enriquecimento de evidências",
    body:
      "Bases públicas, imagens, dados ambientais, matrículas, registros de campo e camadas externas entram no mesmo contexto analítico.",
    tags: ["Fontes", "Imagens", "Registros", "Contexto"],
    visual: "evidence"
  },
  {
    label: "04 / checagem",
    title: "Checagem técnica",
    body:
      "Validação de inconsistências, divergências de coordenadas, sobreposições, lacunas de fonte e riscos de interpretação.",
    tags: ["Conflitos", "Risco", "Revisão", "Auditoria"],
    visual: "check"
  },
  {
    label: "05 / entrega",
    title: "Entrega customizada",
    body:
      "Relatórios, dashboards e pacotes GIS preparados para engenharia, gestão territorial e tomada de decisão com rastreabilidade.",
    tags: ["Relatório", "Dashboard", "GIS", "Decisão"],
    visual: "deliver"
  }
];

const testimonials = [
  {
    quote:
      "Integrar curvas de nível, pontos de controle, bases GIS e levantamentos de campo para leitura técnica do território.",
    name: "Topografia e geotecnia",
    role: "Relevo, superfície, drenagem, terraplenagem e compatibilização de engenharia"
  },
  {
    quote:
      "Cruzar imagens aéreas, satélite, LiDAR e drones com bases públicas para reduzir incerteza em áreas sensíveis.",
    name: "Sensoriamento remoto",
    role: "LiDAR, drones, satélite, georreferenciamento e interpretação territorial"
  },
  {
    quote:
      "Converter dados espaciais em mapas, relatórios e painéis GIS com origem, versão e cadeia de validação.",
    name: "Cartografia inteligente",
    role: "Mapas, dashboards, relatórios técnicos e tomada de decisão rastreável"
  }
];

const translations = {
  pt: {},
  en: {}
};

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const mapPins = document.querySelectorAll(".map-pin");
const scanStatus = document.querySelector("#scan-status");
const logoMarker = document.querySelector("#logo-map-marker");
const headerBrand = document.querySelector(".brand");
const scrollBrandLockup = document.querySelector("#scroll-brand-lockup");
const heroSection = document.querySelector("#inicio");
const layerButtons = document.querySelectorAll(".layer");
const workflowDetail = document.querySelector("#workflow-detail");
const workflowSteps = document.querySelectorAll(".step");
const processWorkbench = document.querySelector(".process-workbench");
const mobileWorkflowQuery = window.matchMedia("(max-width: 720px)");
let workflowDetailTween;
const testimonialQuote = document.querySelector("#testimonial-quote");
const testimonialName = document.querySelector("#testimonial-name");
const testimonialRole = document.querySelector("#testimonial-role");
const testimonialButtons = document.querySelectorAll(".testimonial-nav");
const accordionItems = document.querySelectorAll(".accordion-item");
const languageButtons = document.querySelectorAll(".language");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const topographyCanvas = document.querySelector("#site-topography-field");
const liquidOrbCanvases = document.querySelectorAll("[data-liquid-orb]");

let testimonialIndex = 0;

document.body.classList.add("motion-ready");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function initTopographyField() {
  if (!topographyCanvas) {
    return;
  }

  const context = topographyCanvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchInput = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    smoothX: window.innerWidth * 0.5,
    smoothY: window.innerHeight * 0.5,
    active: false
  };
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let animationFrame = 0;
  let contours = [];

  function buildContours() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
    topographyCanvas.width = Math.floor(width * pixelRatio);
    topographyCanvas.height = Math.floor(height * pixelRatio);
    topographyCanvas.style.width = `${width}px`;
    topographyCanvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const spacing = width < 720 ? 22 : 28;
    const count = Math.ceil(height / spacing) + 18;
    contours = Array.from({ length: count }, (_, index) => ({
      y: -spacing * 3.2 + index * spacing,
      amplitude: 10 + (index % 6) * 4.5,
      frequency: 0.0064 + (index % 5) * 0.0018,
      phase: index * 0.72,
      drift: (index % 2 === 0 ? 1 : -1) * (0.00062 + index * 0.000008),
      accent: index % 5 === 1 || index % 7 === 0
    }));
  }

  function drawContour(contour, time) {
    const step = width < 720 ? 14 : 16;
    context.beginPath();

    for (let x = -80; x <= width + 80; x += step) {
      const wave =
        Math.sin(x * contour.frequency + time * contour.drift + contour.phase) * contour.amplitude +
        Math.sin(x * contour.frequency * 0.42 + time * contour.drift * 1.25) * (contour.amplitude * 0.46);
      let plotX = x;
      let y = contour.y + wave + Math.sin(time * 0.00034 + contour.phase) * 18;

      if (pointer.active) {
        const dx = plotX - pointer.smoothX;
        const dy = y - pointer.smoothY;
        const distance = Math.hypot(dx, dy);
        const radius = width < 720 ? 176 : 248;

        if (distance < radius) {
          const falloff = 1 - distance / radius;
          const force = Math.pow(falloff, 1.78);
          const ring = Math.sin(falloff * Math.PI);
          const safeDistance = Math.max(distance, 1);
          const normalX = dx / safeDistance;
          const normalY = dy / safeDistance;
          const tangent = Math.sin((plotX + contour.phase * 80 + time * 0.012) * 0.018) * ring;

          plotX += normalX * force * (width < 720 ? 26 : 42);
          y += normalY * force * (width < 720 ? 82 : 124);
          y += tangent * (width < 720 ? 9 : 14);
        }
      }

      if (x === -80) {
        context.moveTo(plotX, y);
      } else {
        context.lineTo(plotX, y);
      }
    }

    context.strokeStyle = contour.accent ? "rgba(0, 126, 167, 0.44)" : "rgba(7, 20, 38, 0.29)";
    context.lineWidth = contour.accent ? 1.5 : 1.08;
    context.stroke();
  }

  function render(time = 0) {
    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";

    if (pointer.active) {
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.14;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.14;
    }

    contours.forEach((contour) => drawContour(contour, time));

    if (!reduceMotion) {
      animationFrame = requestAnimationFrame(render);
    }
  }

  buildContours();
  render();

  window.addEventListener("resize", buildContours);
  if (!reduceMotion && !touchInput) {
    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
      },
      { passive: true }
    );
    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });
  }

  if (reduceMotion) {
    cancelAnimationFrame(animationFrame);
  }
}

function initPointerMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchInput = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (reduceMotion || touchInput) {
    document.body.classList.add("pointer-motion-off");
    return;
  }

  const motionTargets = [...document.querySelectorAll(".terrain-console, .process-workbench, .map-pin")];
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5
  };
  let ticking = false;

  document.body.classList.add("pointer-motion-ready");

  function updatePointerMotion() {
    const viewportX = pointer.x / Math.max(window.innerWidth, 1) - 0.5;
    const viewportY = pointer.y / Math.max(window.innerHeight, 1) - 0.5;

    document.documentElement.style.setProperty("--topo-parallax-x", `${(-viewportX * 14).toFixed(2)}px`);
    document.documentElement.style.setProperty("--topo-parallax-y", `${(-viewportY * 10).toFixed(2)}px`);

    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const insideHero =
        pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
      heroSection.style.setProperty("--hero-parallax-x", `${(viewportX * (insideHero ? 18 : 7)).toFixed(2)}px`);
      heroSection.style.setProperty("--hero-parallax-y", `${(viewportY * (insideHero ? 12 : 4)).toFixed(2)}px`);
    }

    motionTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (pointer.x - centerX) / Math.max(rect.width, 1);
      const dy = (pointer.y - centerY) / Math.max(rect.height, 1);
      const near = Math.abs(dx) < 0.85 && Math.abs(dy) < 0.85;
      const strength = target.classList.contains("map-pin") ? 10 : 4;

      target.style.setProperty("--motion-x", `${(near ? dx * strength : 0).toFixed(2)}px`);
      target.style.setProperty("--motion-y", `${(near ? dy * strength : 0).toFixed(2)}px`);
      target.style.setProperty("--motion-active", near ? "1" : "0");
    });

    ticking = false;
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updatePointerMotion);
      }
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    document.documentElement.style.setProperty("--topo-parallax-x", "0px");
    document.documentElement.style.setProperty("--topo-parallax-y", "0px");
    motionTargets.forEach((target) => {
      target.style.setProperty("--motion-x", "0px");
      target.style.setProperty("--motion-y", "0px");
      target.style.setProperty("--motion-active", "0");
    });
  });
}

function initLiquidOrbs() {
  if (!window.THREE) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchInput = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  liquidOrbCanvases.forEach((canvas) => {
    const host = canvas.closest(".product-card");
    const pointer = {
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0,
      active: false
    };
    let frame = 0;
    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
    camera.position.set(0, 0, 5.2);

    const geometry = new THREE.SphereGeometry(1, 72, 48);
    const basePositions = Float32Array.from(geometry.attributes.position.array);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#dff5fb"),
      emissive: new THREE.Color("#007ea7"),
      emissiveIntensity: 0.035,
      metalness: 0.03,
      roughness: 0.36,
      transmission: 0.16,
      transparent: true,
      opacity: 0.9,
      clearcoat: 0.55,
      clearcoatRoughness: 0.42
    });
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#007ea7"),
      transparent: true,
      opacity: 0.14,
      wireframe: true
    });
    const pointMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#071426"),
      transparent: true,
      opacity: 0.26,
      size: 0.014,
      sizeAttenuation: true
    });
    const sphere = new THREE.Mesh(geometry, sphereMaterial);
    const wire = new THREE.Mesh(geometry, wireMaterial);
    const lidarPoints = new THREE.Points(geometry, pointMaterial);
    const group = new THREE.Group();

    group.add(sphere);
    group.add(wire);
    group.add(lidarPoints);
    group.rotation.set(-0.16, 0.34, -0.08);
    scene.add(group);

    const radarMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#007ea7"),
      transparent: true,
      opacity: 0.34
    });
    const radarGroup = new THREE.Group();
    [0.42, 0.68, 0.92].forEach((radius) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(96).map((point) => new THREE.Vector3(point.x, point.y, 0.06));
      radarGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), radarMaterial));
    });
    group.add(radarGroup);

    scene.add(new THREE.AmbientLight(0xf7fafc, 1.2));
    const keyLight = new THREE.DirectionalLight(0xf7fafc, 2.4);
    keyLight.position.set(-2.4, 2.2, 4);
    scene.add(keyLight);
    const blueLight = new THREE.PointLight(0x007ea7, 2.1, 6);
    blueLight.position.set(2.1, -1.2, 2.8);
    scene.add(blueLight);

    function resizeOrb() {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(140, Math.round(rect.width));
      const height = Math.max(140, Math.round(rect.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function deformSphere(time = 0) {
      const positions = geometry.attributes.position.array;
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.12;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.12;

      for (let index = 0; index < positions.length; index += 3) {
        const baseX = basePositions[index];
        const baseY = basePositions[index + 1];
        const baseZ = basePositions[index + 2];
        const idle =
          Math.sin(time * 0.0012 + baseX * 3.6 + baseY * 1.8) * 0.025 +
          Math.sin(time * 0.00074 + baseZ * 5.2) * 0.018;
        let offsetX = 0;
        let offsetY = 0;
        let offsetZ = idle;

        if (pointer.active) {
          const targetX = pointer.smoothX * 1.08;
          const targetY = pointer.smoothY * 1.08;
          const pullX = targetX - baseX;
          const pullY = targetY - baseY;
          const distance = Math.hypot(pullX, pullY);
          const radius = 0.82;

          if (distance < radius) {
            const falloff = Math.pow(1 - distance / radius, 2.1);
            const safeDistance = Math.max(distance, 0.001);
            const gravityX = pullX / safeDistance;
            const gravityY = pullY / safeDistance;
            const frontBias = 0.42 + Math.max(baseZ, 0) * 0.58;

            offsetX += gravityX * falloff * 0.32;
            offsetY += gravityY * falloff * 0.32;
            offsetZ += falloff * frontBias * 0.26;
          }
        }

        positions[index] = baseX * (1 + idle * 0.22) + offsetX;
        positions[index + 1] = baseY * (1 + idle * 0.22) + offsetY;
        positions[index + 2] = baseZ * (1 + idle * 0.18) + offsetZ;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }

    function renderOrb(time = 0) {
      deformSphere(time);
      if (!reduceMotion) {
        group.rotation.y += 0.0022;
        group.rotation.x = -0.16 + Math.sin(time * 0.0007) * 0.035;
        radarGroup.rotation.z = time * 0.00042;
      }
      renderer.render(scene, camera);

      if (!reduceMotion) {
        frame = requestAnimationFrame(renderOrb);
      }
    }

    resizeOrb();
    renderOrb();
    window.addEventListener("resize", resizeOrb);

    if (!reduceMotion && !touchInput && host) {
      host.addEventListener(
        "pointermove",
        (event) => {
          const rect = canvas.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
          pointer.active =
            event.clientX > rect.left - 48 &&
            event.clientX < rect.right + 48 &&
            event.clientY > rect.top - 48 &&
            event.clientY < rect.bottom + 48;
        },
        { passive: true }
      );
      host.addEventListener("pointerleave", () => {
        pointer.active = false;
      });
    }

    if (reduceMotion) {
      cancelAnimationFrame(frame);
    }
  });
}

let logoTargetProgress = 0;
let logoVisualProgress = 0;
let logoAnimationFrame = 0;
let logoIdleTimer = 0;
let logoAutoScrollFrame = 0;
let logoAutoCompleting = false;
let logoPreviousScrollBehavior = "";
const logoAutoCompleteDelay = 2000;
const logoAutoCompleteStart = 0.006;
const logoAutoCompleteFormationEnd = 0.42;
const logoAutoCompleteCenteredEnd = 0.58;
const logoAutoCompleteDuration = 2400;

function getLogoScrollProgress() {
  if (!heroSection) {
    return 0;
  }

  const rect = heroSection.getBoundingClientRect();
  const travel = Math.max(rect.height, 1);
  return clamp(-rect.top / travel, 0, 1);
}

function cancelLogoAutoComplete() {
  clearTimeout(logoIdleTimer);

  if (logoAutoScrollFrame) {
    cancelAnimationFrame(logoAutoScrollFrame);
    logoAutoScrollFrame = 0;
  }

  if (logoPreviousScrollBehavior !== "") {
    document.documentElement.style.scrollBehavior = logoPreviousScrollBehavior;
    logoPreviousScrollBehavior = "";
  }

  logoAutoCompleting = false;
}

function completeLogoScroll() {
  if (!heroSection || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const currentProgress = getLogoScrollProgress();

  if (
    logoAutoCompleting ||
    currentProgress < logoAutoCompleteStart ||
    currentProgress >= logoAutoCompleteCenteredEnd
  ) {
    return;
  }

  const heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
  const targetProgress =
    currentProgress < logoAutoCompleteFormationEnd ? logoAutoCompleteFormationEnd : logoAutoCompleteCenteredEnd;
  const targetY = heroTop + heroSection.offsetHeight * targetProgress;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  const root = document.documentElement;

  logoAutoCompleting = true;
  logoPreviousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  function step(time) {
    const elapsed = Math.min((time - startTime) / logoAutoCompleteDuration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    window.scrollTo(0, startY + distance * eased);
    updateLogoMarker();

    if (elapsed < 1) {
      logoAutoScrollFrame = requestAnimationFrame(step);
    } else {
      logoAutoScrollFrame = 0;
      logoAutoCompleting = false;
      root.style.scrollBehavior = logoPreviousScrollBehavior;
      logoPreviousScrollBehavior = "";
    }
  }

  logoAutoScrollFrame = requestAnimationFrame(step);
}

function scheduleLogoAutoComplete() {
  clearTimeout(logoIdleTimer);

  if (logoAutoCompleting) {
    return;
  }

  logoIdleTimer = window.setTimeout(() => {
    completeLogoScroll();
  }, logoAutoCompleteDelay);
}

function applyLogoProgress(progress) {
  const eased = 1 - Math.pow(1 - progress, 3);
  const x = 12 + (36 - 12) * eased;
  const y = 22 + (54 - 22) * eased;
  const draw = 0.18 + 0.82 * eased;
  const arrival = clamp(progress / 0.34, 0, 1);
  const arrivalEase = 1 - Math.pow(1 - arrival, 4);
  const exit = clamp((progress - 0.36) / 0.22, 0, 1);
  const exitEase = 1 - Math.pow(1 - exit, 3);

  if (logoMarker) {
    logoMarker.style.setProperty("--marker-x", x.toFixed(2));
    logoMarker.style.setProperty("--marker-y", y.toFixed(2));
    logoMarker.style.setProperty("--logo-draw", draw.toFixed(3));
    logoMarker.dataset.docked = progress > 0.72 ? "true" : "false";
  }

  if (scrollBrandLockup && headerBrand) {
    const brandRect = headerBrand.getBoundingClientRect();
    const startX = brandRect.left + brandRect.width / 2 - window.innerWidth / 2;
    const startY = brandRect.top + brandRect.height / 2 - window.innerHeight / 2;
    const visualArrival = 0.82 + 0.18 * arrivalEase;
    const lockupX = startX * (1 - visualArrival);
    const lockupY = startY * (1 - visualArrival) - 86 * exitEase;
    const lockupScale = 0.92 + (1.26 - 0.92) * arrivalEase - 0.16 * exitEase;
    const lockupOpacity = arrivalEase * (1 - exitEase);
    const wordReveal = clamp(arrival / 0.42, 0, 1);
    const dDrawReveal = clamp((arrival - 0.42) / 0.46, 0, 1);
    const dDrawEase = 1 - Math.pow(1 - dDrawReveal, 4);
    const wordOpacity = wordReveal * (1 - exitEase);
    const wordShift = -118 + 118 * wordReveal - 28 * exitEase;

    scrollBrandLockup.style.setProperty("--lockup-x", lockupX.toFixed(2));
    scrollBrandLockup.style.setProperty("--lockup-y", lockupY.toFixed(2));
    scrollBrandLockup.style.setProperty("--lockup-scale", lockupScale.toFixed(3));
    scrollBrandLockup.style.setProperty("--lockup-opacity", lockupOpacity.toFixed(3));
    scrollBrandLockup.style.setProperty("--lockup-draw", (0.2 + 0.8 * dDrawEase).toFixed(3));
    scrollBrandLockup.style.setProperty("--word-opacity", wordOpacity.toFixed(3));
    scrollBrandLockup.style.setProperty("--word-shift", wordShift.toFixed(2));
  }

  document.body.classList.toggle("logo-in-motion", arrival > 0 && exit < 1);
  document.body.classList.toggle("logo-centered", arrival > 0.22 && exit < 1);
  document.body.classList.toggle("logo-word-revealing", arrival > 0.02 && exit < 1);
  document.body.classList.toggle("logo-prelude", exit < 1);
}

function updateLogoMarker(options = {}) {
  logoTargetProgress = getLogoScrollProgress();

  if (options.immediate || logoTargetProgress >= 0.72) {
    if (logoAnimationFrame) {
      cancelAnimationFrame(logoAnimationFrame);
      logoAnimationFrame = 0;
    }
    logoVisualProgress = logoTargetProgress;
    applyLogoProgress(logoVisualProgress);
    return;
  }

  if (logoAnimationFrame) {
    return;
  }

  function animateLogoProgress() {
    const delta = logoTargetProgress - logoVisualProgress;
    const isCatchingUp = Math.abs(delta) > 0.002;
    const ease = delta > 0 ? 0.062 : 0.11;

    logoVisualProgress += delta * ease;

    if (!isCatchingUp) {
      logoVisualProgress = logoTargetProgress;
    }

    applyLogoProgress(logoVisualProgress);

    if (isCatchingUp) {
      logoAnimationFrame = requestAnimationFrame(animateLogoProgress);
    } else {
      logoAnimationFrame = 0;
    }
  }

  logoAnimationFrame = requestAnimationFrame(animateLogoProgress);
}

function placeWorkflowDetail() {
  if (!workflowDetail || !processWorkbench) {
    return;
  }

  const activeStep = document.querySelector(".step.is-active");

  if (mobileWorkflowQuery.matches && activeStep) {
    activeStep.insertAdjacentElement("afterend", workflowDetail);
    return;
  }

  processWorkbench.appendChild(workflowDetail);
}

function setWorkflowStepState(step, isActive) {
  step.classList.toggle("is-active", isActive);
  step.setAttribute("aria-selected", String(isActive));
  step.setAttribute("aria-expanded", String(isActive));
}

function collapseMobileWorkflow() {
  if (!workflowDetail || !mobileWorkflowQuery.matches) {
    return;
  }

  workflowSteps.forEach((item) => setWorkflowStepState(item, false));
  tweenMobileWorkflowDetail("close", () => {
    workflowDetail.hidden = true;
    processWorkbench.appendChild(workflowDetail);
  });
}

function syncWorkflowLayout() {
  if (!workflowDetail) {
    return;
  }

  if (mobileWorkflowQuery.matches) {
    placeWorkflowDetail();
    return;
  }

  workflowDetail.hidden = false;

  if (!document.querySelector(".step.is-active")) {
    setWorkflowStepState(workflowSteps[0], true);
    renderWorkflow(0);
    return;
  }

  placeWorkflowDetail();
}

function tweenMobileWorkflowDetail(direction, onFinish) {
  if (!workflowDetail || !mobileWorkflowQuery.matches) {
    onFinish?.();
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (workflowDetailTween) {
    workflowDetailTween.cancel();
  }

  if (prefersReducedMotion || typeof workflowDetail.animate !== "function") {
    onFinish?.();
    return;
  }

  const open = direction === "open";
  const fullHeight = `${workflowDetail.scrollHeight}px`;
  workflowDetail.style.overflow = "hidden";
  workflowDetail.style.transformOrigin = "top center";

  workflowDetailTween = workflowDetail.animate(
    open
      ? [
          { maxHeight: "0px", opacity: 0, transform: "translateY(-10px) scale(0.985)", filter: "blur(2px)" },
          { maxHeight: fullHeight, opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" }
        ]
      : [
          { maxHeight: fullHeight, opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
          { maxHeight: "0px", opacity: 0, transform: "translateY(-8px) scale(0.99)", filter: "blur(1.5px)" }
        ],
    {
      duration: open ? 420 : 300,
      easing: open ? "cubic-bezier(0.16, 1, 0.3, 1)" : "cubic-bezier(0.55, 0, 0.1, 1)",
      fill: "both"
    }
  );

  workflowDetailTween.onfinish = () => {
    const finishedTween = workflowDetailTween;
    workflowDetailTween = undefined;

    if (!open) {
      onFinish?.();
      finishedTween?.cancel();
      return;
    }

    finishedTween?.cancel();
    workflowDetail.style.overflow = "";
    workflowDetail.style.transformOrigin = "";
    onFinish?.();
  };

  workflowDetailTween.oncancel = () => {
    workflowDetail.style.overflow = "";
    workflowDetail.style.transformOrigin = "";
  };
}

function revealMobileWorkflowStep(step) {
  if (!mobileWorkflowQuery.matches || !step) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => {
    step.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });
}

function renderWorkflow(index) {
  if (!workflowDetail) {
    return;
  }

  const item = workflow[index];
  workflowDetail.innerHTML = `
    <div class="step-detail-copy">
      <span>${item.label}</span>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
      <div class="detail-grid">${item.tags.map((tag) => `<strong>${tag}</strong>`).join("")}</div>
    </div>
    ${renderWorkflowVisual(item.visual)}
  `;

  placeWorkflowDetail();
}

function renderWorkflowVisual(type) {
  const visuals = {
    collect: `
      <div class="workflow-visual workflow-visual-collect" aria-hidden="true">
        <span></span><span></span><span></span>
        <i></i><i></i><i></i>
      </div>
    `,
    read: `
      <div class="workflow-visual workflow-visual-read" aria-hidden="true">
        <svg viewBox="0 0 220 150">
          <path d="M12 104C42 72 72 82 98 54C119 32 148 35 169 61C184 80 199 83 210 78" />
          <path d="M20 121C54 96 82 101 110 76C134 55 154 65 176 86C191 101 202 102 212 98" />
          <path d="M42 132C76 118 104 121 129 100C151 82 166 93 187 111" />
          <circle cx="98" cy="54" r="5" />
          <circle cx="169" cy="61" r="5" />
        </svg>
      </div>
    `,
    evidence: `
      <div class="workflow-visual workflow-visual-evidence" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
    `,
    check: `
      <div class="workflow-visual workflow-visual-check" aria-hidden="true">
        <svg viewBox="0 0 220 150">
          <path d="M38 92L82 52L128 86L174 44" />
          <path d="M54 102L88 118L159 58" />
          <circle cx="82" cy="52" r="8" />
          <circle cx="128" cy="86" r="8" />
          <circle cx="174" cy="44" r="8" />
        </svg>
      </div>
    `,
    deliver: `
      <div class="workflow-visual workflow-visual-deliver" aria-hidden="true">
        <span></span><span></span><span></span>
        <i></i>
      </div>
    `
  };

  return visuals[type] || visuals.collect;
}

function renderTestimonial(index) {
  const item = testimonials[index];
  testimonialQuote.textContent = `"${item.quote}"`;
  testimonialName.textContent = item.name;
  testimonialRole.textContent = item.role;
}

function setFieldError(field, message) {
  const error = contactForm.querySelector(`[data-error-for="${field.name}"]`);
  field.classList.toggle("is-invalid", Boolean(message));
  if (error) {
    error.textContent = message;
  }
}

initTopographyField();
initPointerMotion();
initLiquidOrbs();

function setMobileNavState(isOpen) {
  if (!siteNav || !navToggle) {
    return;
  }

  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  siteNav.toggleAttribute("inert", !isOpen && window.matchMedia("(max-width: 760px)").matches);
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener(
  "scroll",
  () => {
    updateLogoMarker();
    scheduleLogoAutoComplete();
  },
  { passive: true }
);

["wheel", "touchstart", "keydown"].forEach((eventName) => {
  window.addEventListener(
    eventName,
    () => {
      if (!logoAutoCompleting) {
        return;
      }

      cancelLogoAutoComplete();
    },
    { passive: true }
  );
});

window.addEventListener("resize", () => updateLogoMarker({ immediate: true }));
updateLogoMarker({ immediate: true });

setMobileNavState(false);
window.addEventListener("resize", () => setMobileNavState(document.body.classList.contains("nav-open")));

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  setMobileNavState(isOpen);
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    setMobileNavState(false);
  });
});

mapPins.forEach((pin) => {
  pin.addEventListener("click", () => {
    mapPins.forEach((item) => item.classList.remove("is-active"));
    pin.classList.add("is-active");
    scanStatus.textContent = `${pin.dataset.pin} validado`;
  });
});

layerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-active");
    const activeLayers = Array.from(layerButtons)
      .filter((item) => item.classList.contains("is-active"))
      .map((item) => item.textContent.trim())
      .join(" + ");
    scanStatus.textContent = activeLayers ? `${activeLayers} ativos` : "camadas pausadas";
  });
});

workflowSteps.forEach((step) => {
  step.setAttribute("aria-controls", "workflow-detail");

  step.addEventListener("click", () => {
    const isOpenMobileStep = mobileWorkflowQuery.matches && step.classList.contains("is-active") && !workflowDetail.hidden;

    if (isOpenMobileStep) {
      collapseMobileWorkflow();
      return;
    }

    workflowDetail.hidden = false;
    workflowSteps.forEach((item) => setWorkflowStepState(item, false));
    setWorkflowStepState(step, true);
    renderWorkflow(Number(step.dataset.step));
    tweenMobileWorkflowDetail("open");
    revealMobileWorkflowStep(step);
  });
});

renderWorkflow(0);

mobileWorkflowQuery.addEventListener("change", syncWorkflowLayout);

testimonialButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.testimonial === "next" ? 1 : -1;
    testimonialIndex = (testimonialIndex + direction + testimonials.length) % testimonials.length;
    renderTestimonial(testimonialIndex);
  });
});

accordionItems.forEach((item) => {
  item.addEventListener("click", () => {
    accordionItems.forEach((entry) => {
      if (entry !== item) {
        entry.classList.remove("is-open");
      }
    });
    item.classList.toggle("is-open");
  });
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang;
    languageButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = translations[lang][key];
    });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button");
  const status = form.querySelector(".form-status");
  const fields = Array.from(form.querySelectorAll("input, textarea"));
  let isValid = true;

  fields.forEach((field) => {
    let message = "";
    if (!field.value.trim()) {
      message = "Preencha este campo.";
    } else if (field.type === "email" && !field.validity.valid) {
      message = "Use um email válido.";
    }
    setFieldError(field, message);
    isValid = isValid && !message;
  });

  if (!isValid) {
    status.textContent = "Revise os campos destacados para enviar o diagnóstico.";
    return;
  }

  button.textContent = "Diagnóstico solicitado";
  button.disabled = true;
  status.textContent = "Recebemos seu contexto técnico. A equipe DATUM retorna com o próximo passo.";
});

contactForm.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => setFieldError(field, ""));
});
