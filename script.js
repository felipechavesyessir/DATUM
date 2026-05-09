const workflow = [
  {
    label: "01 / coleta",
    title: "Coleta de dados e cadastro",
    body:
      "Conexão com bases de campo, arquivos CAD/GIS, levantamentos, sensores e documentos. Cada camada recebe origem, data, coordenada e status de validação.",
    tags: ["CAD", "GIS", "LiDAR", "Campo"]
  },
  {
    label: "02 / leitura",
    title: "Leitura geoespacial",
    body:
      "Interpretação de superfícies, feições, pontos de controle, áreas de interesse e relações territoriais para reduzir ruído operacional.",
    tags: ["Relevo", "Feições", "Áreas", "Datum"]
  },
  {
    label: "03 / evidências",
    title: "Enriquecimento de evidências",
    body:
      "Bases públicas, imagens, dados ambientais, matrículas, registros de campo e camadas externas entram no mesmo contexto analítico.",
    tags: ["Fontes", "Imagens", "Registros", "Contexto"]
  },
  {
    label: "04 / checagem",
    title: "Checagem técnica",
    body:
      "Validação de inconsistências, divergências de coordenadas, sobreposições, lacunas de fonte e riscos de interpretação.",
    tags: ["Conflitos", "Risco", "Revisão", "Auditoria"]
  },
  {
    label: "05 / entrega",
    title: "Entrega customizada",
    body:
      "Relatórios, dashboards e pacotes GIS preparados para engenharia, gestão territorial e tomada de decisão com rastreabilidade.",
    tags: ["Relatório", "Dashboard", "GIS", "Decisão"]
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
const mapPins = document.querySelectorAll(".map-pin");
const scanStatus = document.querySelector("#scan-status");
const logoMarker = document.querySelector("#logo-map-marker");
const headerBrand = document.querySelector(".brand");
const scrollBrandLockup = document.querySelector("#scroll-brand-lockup");
const heroSection = document.querySelector("#inicio");
const layerButtons = document.querySelectorAll(".layer");
const workflowDetail = document.querySelector("#workflow-detail");
const workflowSteps = document.querySelectorAll(".step");
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
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchInput = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  liquidOrbCanvases.forEach((canvas) => {
    const context = canvas.getContext("2d");
    const host = canvas.closest(".product-card");
    const pointer = {
      x: 0,
      y: 0,
      active: false
    };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let points = [];

    function resizeOrb() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(120, Math.round(rect.width));
      height = Math.max(120, Math.round(rect.height));
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = 56;
      points = Array.from({ length: count }, (_, index) => {
        const angle = (Math.PI * 2 * index) / count;
        return {
          angle,
          phase: index * 0.47,
          noise: 0.72 + (index % 5) * 0.08
        };
      });
    }

    function drawOrb(time = 0) {
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.34;
      const influenceRadius = Math.min(width, height) * 0.42;

      context.clearRect(0, 0, width, height);
      context.save();
      context.lineCap = "round";
      context.lineJoin = "round";

      const outline = points.map((point) => {
        const normalX = Math.cos(point.angle);
        const normalY = Math.sin(point.angle);
        const baseX = centerX + normalX * baseRadius;
        const baseY = centerY + normalY * baseRadius;
        const pulse =
          Math.sin(time * 0.001 + point.phase) * 3.4 +
          Math.sin(time * 0.00042 + point.phase * 1.7) * 2.2;
        let radiusOffset = pulse * point.noise;

        if (pointer.active) {
          const dx = baseX - pointer.x;
          const dy = baseY - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < influenceRadius) {
            const falloff = Math.pow(1 - distance / influenceRadius, 2.05);
            const outward = (dx * normalX + dy * normalY) / Math.max(distance, 1);
            radiusOffset += Math.max(outward, 0.24) * falloff * 34;
            radiusOffset += Math.sin(point.angle * 3 + time * 0.002) * falloff * 8;
          }
        }

        const radius = baseRadius + radiusOffset;
        return {
          x: centerX + normalX * radius,
          y: centerY + normalY * radius
        };
      });

      context.beginPath();
      outline.forEach((point, index) => {
        const next = outline[(index + 1) % outline.length];
        const controlX = (point.x + next.x) * 0.5;
        const controlY = (point.y + next.y) * 0.5;

        if (index === 0) {
          context.moveTo(controlX, controlY);
        } else {
          context.quadraticCurveTo(point.x, point.y, controlX, controlY);
        }
      });
      context.closePath();

      const fill = context.createRadialGradient(centerX * 0.82, centerY * 0.72, 8, centerX, centerY, baseRadius * 1.45);
      fill.addColorStop(0, "rgba(247, 250, 252, 0.92)");
      fill.addColorStop(0.48, "rgba(0, 126, 167, 0.18)");
      fill.addColorStop(1, "rgba(7, 20, 38, 0.08)");
      context.fillStyle = fill;
      context.fill();

      context.strokeStyle = "rgba(7, 20, 38, 0.58)";
      context.lineWidth = 1.4;
      context.stroke();

      context.save();
      context.clip();
      context.strokeStyle = "rgba(0, 126, 167, 0.28)";
      context.lineWidth = 1;
      for (let ring = 0.36; ring <= 0.86; ring += 0.18) {
        context.beginPath();
        context.arc(centerX, centerY, baseRadius * ring, 0, Math.PI * 2);
        context.stroke();
      }

      const sweep = time * 0.00045;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo(centerX + Math.cos(sweep) * baseRadius * 1.08, centerY + Math.sin(sweep) * baseRadius * 1.08);
      context.strokeStyle = "rgba(0, 126, 167, 0.48)";
      context.lineWidth = 1.25;
      context.stroke();

      context.fillStyle = "rgba(7, 20, 38, 0.38)";
      for (let index = 0; index < 24; index += 1) {
        const angle = index * 2.399 + time * 0.00008;
        const radius = baseRadius * (0.16 + ((index * 37) % 68) / 100);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle * 1.12) * radius;
        context.beginPath();
        context.arc(x, y, index % 4 === 0 ? 1.7 : 1.15, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();

      context.beginPath();
      context.arc(centerX, centerY, 2.6, 0, Math.PI * 2);
      context.fillStyle = "rgba(47, 191, 113, 0.72)";
      context.fill();
      context.restore();

      if (!reduceMotion) {
        frame = requestAnimationFrame(drawOrb);
      }
    }

    resizeOrb();
    drawOrb();
    window.addEventListener("resize", resizeOrb);

    if (!reduceMotion && !touchInput && host) {
      host.addEventListener(
        "pointermove",
        (event) => {
          const rect = canvas.getBoundingClientRect();
          pointer.x = event.clientX - rect.left;
          pointer.y = event.clientY - rect.top;
          pointer.active =
            pointer.x > -40 && pointer.x < rect.width + 40 && pointer.y > -40 && pointer.y < rect.height + 40;
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

function updateLogoMarker() {
  if (!heroSection) {
    return;
  }

  const rect = heroSection.getBoundingClientRect();
  const travel = Math.max(rect.height, 1);
  const progress = clamp(-rect.top / travel, 0, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  const x = 12 + (36 - 12) * eased;
  const y = 22 + (54 - 22) * eased;
  const draw = 0.18 + 0.82 * eased;
  const arrival = clamp(progress / 0.24, 0, 1);
  const arrivalEase = 1 - Math.pow(1 - arrival, 4);
  const exit = clamp((progress - 0.54) / 0.2, 0, 1);
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
    const lockupX = startX * (1 - arrivalEase);
    const lockupY = startY * (1 - arrivalEase) - 86 * exitEase;
    const lockupScale = 0.34 + (0.98 - 0.34) * arrivalEase - 0.12 * exitEase;
    const lockupOpacity = arrivalEase * (1 - exitEase);
    const wordReveal = clamp((arrival - 0.16) / 0.28, 0, 1);
    const wordOpacity = wordReveal * (1 - exitEase);
    const wordShift = -118 + 118 * wordReveal - 28 * exitEase;

    scrollBrandLockup.style.setProperty("--lockup-x", lockupX.toFixed(2));
    scrollBrandLockup.style.setProperty("--lockup-y", lockupY.toFixed(2));
    scrollBrandLockup.style.setProperty("--lockup-scale", lockupScale.toFixed(3));
    scrollBrandLockup.style.setProperty("--lockup-opacity", lockupOpacity.toFixed(3));
    scrollBrandLockup.style.setProperty("--lockup-draw", Math.max(0.18, arrivalEase).toFixed(3));
    scrollBrandLockup.style.setProperty("--word-opacity", wordOpacity.toFixed(3));
    scrollBrandLockup.style.setProperty("--word-shift", wordShift.toFixed(2));
  }

  document.body.classList.toggle("logo-in-motion", arrival > 0 && exit < 1);
  document.body.classList.toggle("logo-centered", arrival > 0.22 && exit < 1);
  document.body.classList.toggle("logo-prelude", exit < 1);
}

function renderWorkflow(index) {
  const item = workflow[index];
  workflowDetail.innerHTML = `
    <span>${item.label}</span>
    <h3>${item.title}</h3>
    <p>${item.body}</p>
    <div class="detail-grid">${item.tags.map((tag) => `<strong>${tag}</strong>`).join("")}</div>
  `;
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

let markerTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (markerTicking) {
      return;
    }
    markerTicking = true;
    requestAnimationFrame(() => {
      updateLogoMarker();
      markerTicking = false;
    });
  },
  { passive: true }
);

window.addEventListener("resize", updateLogoMarker);
updateLogoMarker();

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
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
  step.addEventListener("click", () => {
    workflowSteps.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });
    step.classList.add("is-active");
    step.setAttribute("aria-selected", "true");
    renderWorkflow(Number(step.dataset.step));
  });
});

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
