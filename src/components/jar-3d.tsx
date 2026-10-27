import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Product } from "@/lib/products";
import bottleStickerUrl from "@/assets/bottle_sticker.jpg";
import { createPickleJar } from "./pickle-jar-model";

type Jar3DProps = {
  product: Product;
  speed?: number;
  phase?: number;
  className?: string;
  id?: string;
  ariaLabel?: string;
};

// Global texture cache to avoid repeated image decoding
let cachedStickerTexture: THREE.Texture | null = null;
function getStickerTexture(): Promise<THREE.Texture> {
  if (cachedStickerTexture) return Promise.resolve(cachedStickerTexture);
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      bottleStickerUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        cachedStickerTexture = tex;
        resolve(tex);
      },
      undefined,
      () => {
        // Fallback procedural canvas texture if image loading fails
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 512, 180);
          ctx.fillStyle = "#751b12";
          ctx.font = "bold 28px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("INDIRA PACHHI'S", 256, 95);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        cachedStickerTexture = tex;
        resolve(tex);
      },
    );
  });
}

/**
 * Interactive 3D glass pickle jar rendered with Three.js.
 * Features:
 * - Refractive physical flint glass with authentic thickness
 * - Indira Pachhi's official bottle_sticker.jpg branding
 * - Suspended spices / seeds matching flavour
 * - Smooth pointer drag-to-rotate + idle floating
 * - Strict WebGL lifecycle & context loss management to eliminate canvas crashes
 */
export function Jar3D({ product, speed = 0.005, phase = 0, className, id, ariaLabel }: Jar3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let renderer: THREE.WebGLRenderer | null = null;

    (async () => {
      try {
        const texture = await getStickerTexture();
        if (disposed || !host) return;

        const scene = new THREE.Scene();
        scene.background = null;

        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
        camera.position.set(0, 0.1, 6.2);

        // Check WebGL availability
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          });
        } catch (e) {
          console.warn("WebGL not supported, using fallback", e);
          setLoadError(true);
          return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const canvas = renderer.domElement;
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.touchAction = "none";

        const updateSize = () => {
          if (!host || disposed || !renderer) return;
          const w = host.clientWidth || 320;
          const h = host.clientHeight || 420;
          const aspect = w / h;
          camera.aspect = aspect;
          // Keep the entire bottle with its top lid comfortably framed without clipping
          if (aspect < 0.85) {
            camera.position.set(0, 0.06, 6.8 / Math.max(0.62, aspect));
          } else if (aspect < 1.15) {
            camera.position.set(0, 0.09, 6.6);
          } else {
            camera.position.set(0, 0.1, 6.3);
          }
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        };

        host.innerHTML = "";
        host.appendChild(canvas);
        updateSize();

        // Studio lighting
        const ambient = new THREE.HemisphereLight(0xfff5e6, 0x542318, 2.4);
        scene.add(ambient);

        const key = new THREE.DirectionalLight(0xffffff, 3.2);
        key.position.set(3.5, 5, 4.5);
        scene.add(key);

        const rim = new THREE.DirectionalLight(0xffa855, 1.8);
        rim.position.set(-4, 2, -2.5);
        scene.add(rim);

        const fill = new THREE.DirectionalLight(0xfff0d8, 1.2);
        fill.position.set(0, -2, 3);
        scene.add(fill);

        // Jar Group using the rich artisan model with fillings & powder motion
        const jar = createPickleJar(product, texture);
        jar.scale.set(0.96, 0.96, 0.96);
        jar.position.set(0, -0.06, 0);
        scene.add(jar);

        // Interaction
        let isDragging = false;
        let lastX = 0;
        let userRotation = -0.18;
        let velocity = 0;

        const onPointerDown = (e: PointerEvent) => {
          isDragging = true;
          lastX = e.clientX;
          velocity = 0;
          canvas.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e: PointerEvent) => {
          if (!isDragging) return;
          const delta = e.clientX - lastX;
          lastX = e.clientX;
          velocity = delta * 0.01;
          userRotation += velocity;
        };

        const onPointerUp = () => {
          isDragging = false;
        };

        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerUp);

        // Debounced resize observer
        let resizeTimer = 0;
        resizeObserver = new ResizeObserver(() => {
          window.cancelAnimationFrame(resizeTimer);
          resizeTimer = window.requestAnimationFrame(updateSize);
        });
        resizeObserver.observe(host);

        // Handle WebGL context events
        const onContextLost = (event: Event) => {
          event.preventDefault();
          if (rafId) cancelAnimationFrame(rafId);
        };
        const onContextRestored = () => {
          updateSize();
          animate();
        };
        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);

        let frame = 0;
        const animate = () => {
          if (disposed || !renderer) return;
          frame++;
          const time = frame * 0.02;

          if (!isDragging) {
            velocity *= 0.94;
            userRotation += velocity + speed;
          }

          jar.rotation.y = userRotation;
          jar.position.y = -0.06 + Math.sin(frame * 0.025 + phase) * 0.032;

          // Animate floating vegetable chunks & particle powder motion
          if (typeof jar.userData?.update === "function") {
            jar.userData.update(time);
          }

          renderer.render(scene, camera);
          rafId = requestAnimationFrame(animate);
        };

        animate();
      } catch (err) {
        console.error("Jar3D error:", err);
        setLoadError(true);
      }
    })();

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      if (renderer) {
        try {
          renderer.dispose();
          renderer.forceContextLoss();
          const gl = renderer.getContext();
          const ext = gl?.getExtension("WEBGL_lose_context");
          ext?.loseContext();
        } catch {
          // ignore
        }
      }
      if (host) host.innerHTML = "";
    };
  }, [product, speed, phase]);

  if (loadError) {
    return (
      <div
        id={id}
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse, #edd7b4 0%, #f7eddb 70%)",
          borderRadius: 24,
          padding: 24,
          color: "var(--wine)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🫙</div>
        <strong style={{ fontFamily: "Cormorant Garamond", fontSize: 22 }}>{product.name}</strong>
        <small style={{ opacity: 0.8, marginTop: 4 }}>Authentic Indira Pachhi's Heritage</small>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      id={id}
      className={className}
      aria-label={ariaLabel ?? `Interactive 3D jar of ${product.name}. Drag to rotate.`}
    />
  );
}
