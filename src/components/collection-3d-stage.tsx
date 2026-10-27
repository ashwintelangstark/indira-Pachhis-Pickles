import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { Product } from "@/lib/products";
import bottleStickerUrl from "@/assets/bottle_sticker.jpg";
import { createPickleJar } from "./pickle-jar-model";

type Collection3DStageProps = {
  products: Product[];
  onSelectProduct: (index: number) => void;
};

// Theme configurations for every flavour
export const flavourThemes: Record<
  string,
  { bg: string; bgGradient: string; keyword: string; accent: string }
> = {
  "Raw Mango Pickle": {
    bg: "#c24419",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #db582a 0%, #a13410 100%)",
    keyword: "RAW MANGO",
    accent: "#ffd15c",
  },
  "Mango Hindi": {
    bg: "#cf5419",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #e86d2a 0%, #ab3d0c 100%)",
    keyword: "MANGO HINDI",
    accent: "#ffc259",
  },
  "Amla Pickle": {
    bg: "#587826",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #6e9432 0%, #46621c 100%)",
    keyword: "AMLA PICKLE",
    accent: "#e0f779",
  },
  "Amla Hindi": {
    bg: "#647c28",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #7c9935 0%, #4e631d 100%)",
    keyword: "AMLA HINDI",
    accent: "#d4ed66",
  },
  "Mixed Fruit Hindi": {
    bg: "#c45422",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #db6c36 0%, #9e3911 100%)",
    keyword: "MIXED FRUIT",
    accent: "#ffd074",
  },
  "Green Chilli Pickle": {
    bg: "#2b7021",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #398c2d 0%, #1c5415 100%)",
    keyword: "GREEN CHILLI",
    accent: "#a9ff75",
  },
  "Andhra Pickle": {
    bg: "#b52414",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #d13724 0%, #8e1508 100%)",
    keyword: "ANDHRA SPICE",
    accent: "#ffa15c",
  },
  "Dry Appi Midi Pickle": {
    bg: "#686f26",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #7f8830 0%, #50571b 100%)",
    keyword: "APPI MIDI",
    accent: "#e3ea72",
  },
  "Bitter Gourd Pickle": {
    bg: "#4d6b24",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #628730 0%, #3a5319 100%)",
    keyword: "BITTER GOURD",
    accent: "#c4e868",
  },
  "Sweet Mango Pickle": {
    bg: "#c26b1c",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #db842e 0%, #9c4d0e 100%)",
    keyword: "SWEET MANGO",
    accent: "#ffe680",
  },
  "Lemon Pickle": {
    bg: "#b59416",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #cea924 0%, #94770d 100%)",
    keyword: "LEMON ZEST",
    accent: "#fff07d",
  },
  "Garlic Chutney Powder": {
    bg: "#8c3821",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #a64a30 0%, #702511 100%)",
    keyword: "GARLIC POWDER",
    accent: "#ffbc75",
  },
  "Hing Chutney Powder": {
    bg: "#915a25",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #aa7034 0%, #734316 100%)",
    keyword: "HING POWDER",
    accent: "#ffd98c",
  },
};

export function Collection3DStage({ products, onSelectProduct }: Collection3DStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "pickle" | "powder">("all");
  const [animDirection, setAnimDirection] = useState<"left" | "right">("right");

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  // References for persistent Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carouselRootRef = useRef<THREE.Group | null>(null);
  const stickerTextureRef = useRef<THREE.Texture | null>(null);

  const jarSlotsRef = useRef<{
    center?: THREE.Group;
    left?: THREE.Group;
    right?: THREE.Group;
  }>({});

  // Filtered product list
  const filteredProducts = products.filter((p) => filter === "all" || p.type === filter);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  const count = filteredProducts.length;
  const currentProduct = filteredProducts[currentIndex] || products[0];
  const prevIndex = (currentIndex - 1 + count) % count;
  const nextIndex = (currentIndex + 1) % count;
  const prevProduct = filteredProducts[prevIndex] || products[0];
  const nextProduct = filteredProducts[nextIndex] || products[0];

  const theme = flavourThemes[currentProduct?.name] || {
    bg: "#c24419",
    bgGradient: "radial-gradient(ellipse at 50% 40%, #db582a 0%, #a13410 100%)",
    keyword: currentProduct?.name.toUpperCase() || "INDIRA",
    accent: "#ffd15c",
  };

  const handlePrev = useCallback(() => {
    setAnimDirection("left");
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const handleNext = useCallback(() => {
    setAnimDirection("right");
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  // Keep navigation callbacks fresh for event handlers
  const handlePrevRef = useRef(handlePrev);
  handlePrevRef.current = handlePrev;
  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe handling on container
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) handleNext();
        else handlePrev();
      }
    };

    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchend", onTouchEnd);
    };
  }, [handlePrev, handleNext]);

  // --------------------------------------------------------------------------
  // 1. INITIALIZE THREE.JS SCENE ONCE ON MOUNT (Zero Context Leaks)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let rafId = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let centerJarUserRotation = -0.15;
    let dragVelocity = 0;
    let mouseTiltX = 0;
    let mouseTiltY = 0;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
    camera.position.set(0, 0.1, 6.8);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("WebGL creation failed", e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    const dom = renderer.domElement;
    dom.style.display = "block";
    dom.style.width = "100%";
    dom.style.height = "100%";
    dom.style.touchAction = "none";

    const resize = () => {
      if (!host || disposed || !renderer) return;
      const width = host.clientWidth || 800;
      const height = host.clientHeight || 520;
      camera.aspect = width / height;

      // Adjust camera distance on narrow mobile displays so side jars are never cut off
      if (width < 500) {
        camera.position.z = 8.1;
      } else if (width < 800) {
        camera.position.z = 7.4;
      } else {
        camera.position.z = 6.8;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    host.innerHTML = "";
    host.appendChild(dom);
    resize();

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(resize);
    });
    resizeObserver.observe(host);

    // Studio Lighting
    const ambientLight = new THREE.HemisphereLight(0xfff7ea, 0x472115, 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(3.5, 5, 4.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffaa55, 2.2);
    rimLight.position.set(-4.5, 2.5, -3);
    scene.add(rimLight);

    const frontSoftLight = new THREE.DirectionalLight(0xffecd6, 1.4);
    frontSoftLight.position.set(0, -1, 4);
    scene.add(frontSoftLight);

    // Root Group for all jars
    const carouselRoot = new THREE.Group();
    scene.add(carouselRoot);
    carouselRootRef.current = carouselRoot;

    // Load Texture
    const loader = new THREE.TextureLoader();
    loader.load(bottleStickerUrl, (tex) => {
      if (disposed) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      stickerTextureRef.current = tex;
      // Trigger initial jar build
      updateJarsInScene();
    });

    // Pointer event handlers for interactive 360 spin and clicking side preview jars
    const onPointerDown = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;

      // Tap side jars to navigate
      if (normX < -0.36) {
        handlePrevRef.current();
        return;
      }
      if (normX > 0.36) {
        handleNextRef.current();
        return;
      }

      isDragging = true;
      lastPointerX = e.clientX;
      dragVelocity = 0;
      dom.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      mouseTiltX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.12;
      mouseTiltY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.08;

      if (isDragging) {
        const delta = e.clientX - lastPointerX;
        lastPointerX = e.clientX;
        dragVelocity = delta * 0.008;
        centerJarUserRotation += dragVelocity;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // WebGL context handling
    const onContextLost = (e: Event) => {
      e.preventDefault();
      if (rafId) cancelAnimationFrame(rafId);
    };
    const onContextRestored = () => {
      resize();
      animate();
    };
    dom.addEventListener("webglcontextlost", onContextLost);
    dom.addEventListener("webglcontextrestored", onContextRestored);

    let time = 0;
    const animate = () => {
      if (disposed || !renderer) return;
      time += 0.018;

      if (!isDragging) {
        dragVelocity *= 0.94;
        centerJarUserRotation += dragVelocity + 0.0035;
      }

      carouselRoot.rotation.y += (mouseTiltX - carouselRoot.rotation.y) * 0.06;
      carouselRoot.rotation.x += (-mouseTiltY - carouselRoot.rotation.x) * 0.06;

      const slots = jarSlotsRef.current;
      if (slots.center) {
        slots.center.position.y = Math.sin(time * 1.8) * 0.07;
        slots.center.rotation.y = centerJarUserRotation;
        if (typeof slots.center.userData?.update === "function") {
          slots.center.userData.update(time);
        }
      }

      if (slots.left) {
        slots.left.position.y = -0.65 + Math.sin(time * 1.6 + 1.2) * 0.04;
        slots.left.rotation.y = 0.35 + Math.sin(time * 0.8) * 0.04;
        if (typeof slots.left.userData?.update === "function") {
          slots.left.userData.update(time);
        }
      }

      if (slots.right) {
        slots.right.position.y = -0.65 + Math.sin(time * 1.6 + 2.5) * 0.04;
        slots.right.rotation.y = -0.35 + Math.cos(time * 0.8) * 0.04;
        if (typeof slots.right.userData?.update === "function") {
          slots.right.userData.update(time);
        }
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      dom.removeEventListener("webglcontextlost", onContextLost);
      dom.removeEventListener("webglcontextrestored", onContextRestored);

      try {
        renderer.dispose();
        renderer.forceContextLoss();
      } catch {
        // ignore
      }
      if (host) host.innerHTML = "";
    };
  }, []);

  // --------------------------------------------------------------------------
  // 2. SMOOTHLY SWAP JARS WHEN SELECTION CHANGES (No Renderer Re-Creation!)
  // --------------------------------------------------------------------------
  const updateJarsInScene = useCallback(() => {
    const root = carouselRootRef.current;
    const tex = stickerTextureRef.current;
    if (!root || !tex) return;

    // Remove existing jar meshes
    while (root.children.length > 0) {
      root.remove(root.children[0]);
    }

    const hostWidth = canvasHostRef.current?.clientWidth || 800;
    const isMobile = hostWidth < 520;

    // Center Hero Jar
    const centerJar = createPickleJar(currentProduct, tex);
    centerJar.position.set(0, 0, 0);
    const centerScale = isMobile ? 1.08 : 1.15;
    centerJar.scale.set(centerScale, centerScale, centerScale);
    root.add(centerJar);

    // Left Preview Jar
    const leftJar = createPickleJar(prevProduct, tex);
    const sideX = isMobile ? 2.1 : 2.8;
    const sideScale = isMobile ? 0.42 : 0.48;
    leftJar.position.set(-sideX, -0.65, -1.4);
    leftJar.scale.set(sideScale, sideScale, sideScale);
    leftJar.rotation.y = 0.35;
    root.add(leftJar);

    // Right Preview Jar
    const rightJar = createPickleJar(nextProduct, tex);
    rightJar.position.set(sideX, -0.65, -1.4);
    rightJar.scale.set(sideScale, sideScale, sideScale);
    rightJar.rotation.y = -0.35;
    root.add(rightJar);

    jarSlotsRef.current = {
      center: centerJar,
      left: leftJar,
      right: rightJar,
    };
  }, [currentProduct, prevProduct, nextProduct]);

  useEffect(() => {
    updateJarsInScene();
  }, [updateJarsInScene]);

  // Find original index in master products array to trigger modal
  const originalMasterIndex = products.findIndex((p) => p.name === currentProduct.name);

  return (
    <div
      ref={stageRef}
      className="collection-3d-stage"
      style={{
        background: theme.bgGradient,
      }}
    >
      {/* 1. Giant Background Typography (matching video) */}
      <div className="stage-giant-typography" aria-hidden="true">
        <span
          key={`${currentProduct.name}-${animDirection}`}
          className={`giant-keyword slide-${animDirection}`}
        >
          {theme.keyword}
        </span>
      </div>

      {/* 2. Top Category Filter Pills - Horizontally scrollable on mobile */}
      <div className="stage-top-controls">
        <div className="stage-filter-pills">
          <button
            className={filter === "all" ? "pill-btn active" : "pill-btn"}
            onClick={() => setFilter("all")}
          >
            All Varieties ({products.length})
          </button>
          <button
            className={filter === "pickle" ? "pill-btn active" : "pill-btn"}
            onClick={() => setFilter("pickle")}
          >
            Pickles (11)
          </button>
          <button
            className={filter === "powder" ? "pill-btn active" : "pill-btn"}
            onClick={() => setFilter("powder")}
          >
            Chutney Powders (2)
          </button>
        </div>
      </div>

      {/* 3. Interactive 3D Canvas Host */}
      <div
        ref={canvasHostRef}
        className="stage-canvas-host"
        aria-label={`Interactive 3D showcase of ${currentProduct.name}. Drag to rotate 360 degrees.`}
      />

      {/* 4. Left Preview Click Target */}
      <button
        className="preview-touch-zone left"
        onClick={handlePrev}
        aria-label={`Previous flavour: ${prevProduct?.name}`}
      >
        <span className="preview-label">‹ {prevProduct?.name}</span>
      </button>

      {/* 5. Right Preview Click Target */}
      <button
        className="preview-touch-zone right"
        onClick={handleNext}
        aria-label={`Next flavour: ${nextProduct?.name}`}
      >
        <span className="preview-label">{nextProduct?.name} ›</span>
      </button>

      {/* 6. Bottom Flavour Details & Action Bar */}
      <div className="stage-bottom-bar">
        <div className="stage-info-block">
          <div className="stage-eyebrow">
            <span>
              {currentProduct.type === "pickle" ? "Traditional Pickle" : "Chutney Powder"}
            </span>
            <span className="sep">•</span>
            <span>
              Variant {currentIndex + 1} of {count}
            </span>
          </div>

          <h3 className="stage-product-title">{currentProduct.name}</h3>
          <p className="stage-product-notes">{currentProduct.description}</p>

          <div className="stage-flavour-tag">
            <span>Flavour: </span>
            <strong>{currentProduct.flavour}</strong>
          </div>

          {/* Navigation Controls */}
          <div className="stage-nav-arrows">
            <button className="arrow-circle-btn" onClick={handlePrev} aria-label="Previous flavour">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 19L8 12L15 5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="arrow-circle-btn" onClick={handleNext} aria-label="Next flavour">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5L16 12L9 19"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="arrow-hint">Drag jar to spin 360°</span>
          </div>
        </div>

        {/* Discover Action Button */}
        <div className="stage-action-block">
          <button
            className="stage-discover-btn"
            onClick={() => onSelectProduct(originalMasterIndex)}
          >
            <span>DISCOVER FLAVOUR</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17L17 7M17 7H9M17 7V15"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
