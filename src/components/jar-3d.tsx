import { useEffect, useRef } from "react";
import type { Product } from "@/lib/products";

type Jar3DProps = {
  product: Product;
  speed?: number;
  phase?: number;
  className?: string;
  id?: string;
  ariaLabel?: string;
};

/**
 * Interactive 3D glass pickle jar rendered with three.js.
 * The library is imported dynamically inside the effect so the module stays
 * SSR-safe; all rendering happens client-side in a canvas.
 */
export function Jar3D({ product, speed = 0.006, phase = 0, className, id, ariaLabel }: Jar3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let raf = 0;
    let ro: ResizeObserver | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const scene = new THREE.Scene();
      scene.background = null;
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 6.4);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const resize = () => {
        const w = Math.max(1, host.clientWidth);
        const h = Math.max(1, host.clientHeight);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      resize();
      host.innerHTML = "";
      host.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xfff0d4, 0x5b2416, 2.1));
      const key = new THREE.DirectionalLight(0xffffff, 3.0);
      key.position.set(3, 5, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffa44a, 1.5);
      rim.position.set(-4, 1, -2);
      scene.add(rim);

      const group = new THREE.Group();
      scene.add(group);

      const glass = new THREE.MeshPhysicalMaterial({ color: 0xf6dfb2, roughness: 0.2, metalness: 0, transparent: true, opacity: 0.26, transmission: 0.28, thickness: 0.3 });
      const jarMat = new THREE.MeshStandardMaterial({ color: product.color, roughness: 0.3, metalness: 0.02 });
      const lidMat = new THREE.MeshStandardMaterial({ color: 0x751b12, roughness: 0.35, metalness: 0.18 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9a34d, roughness: 0.3, metalness: 0.55 });

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.7, 1.85, 48, 1, false), jarMat);
      body.position.y = -0.12;
      group.add(body);
      const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.78, 0.35, 48), jarMat);
      shoulder.position.y = 0.98;
      group.add(shoulder);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.28, 48), glass);
      neck.position.y = 1.22;
      group.add(neck);
      const rimMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.09, 48), goldMat);
      rimMesh.position.y = 1.37;
      group.add(rimMesh);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.28, 48), lidMat);
      lid.position.y = 1.53;
      group.add(lid);
      const lidTop = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.035, 48), goldMat);
      lidTop.position.y = 1.685;
      group.add(lidTop);

      // Label is a real curved 3D surface placed on the front of the jar.
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 512;
      labelCanvas.height = 320;
      const ctx = labelCanvas.getContext("2d")!;
      ctx.fillStyle = "#f2e4c9";
      ctx.fillRect(0, 0, 512, 320);
      ctx.strokeStyle = "#a77b3d";
      ctx.lineWidth = 8;
      ctx.strokeRect(12, 12, 488, 296);
      ctx.fillStyle = "#7b2018";
      ctx.textAlign = "center";
      ctx.font = "bold 35px Georgia";
      ctx.fillText("INDIRA PACHHI'S", 256, 77);
      ctx.font = "bold 31px Georgia";
      ctx.fillText(product.type === "powder" ? "CHUTNEY POWDER" : "PICKLES", 256, 119);
      ctx.fillStyle = product.color;
      ctx.font = "bold 34px Georgia";
      const words = product.name.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const w of words) {
        if ((line + " " + w).trim().length > 19) {
          lines.push(line);
          line = w;
        } else line = (line + " " + w).trim();
      }
      if (line) lines.push(line);
      lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, 256, 177 + i * 40));
      ctx.fillStyle = "#8e2b1e";
      ctx.fillRect(40, 256, 432, 34);
      ctx.fillStyle = "#fff2d8";
      ctx.font = "bold 18px Arial";
      ctx.fillText("100 YEAR RECIPE • NO ADDED PRESERVATIVES", 256, 279);
      const tex = new THREE.CanvasTexture(labelCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const labelMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      const label = new THREE.Mesh(new THREE.CylinderGeometry(0.787, 0.787, 0.92, 64, 1, true, Math.PI * 0.25, Math.PI * 1.5), labelMat);
      label.position.y = -0.1;
      label.rotation.y = Math.PI;
      group.add(label);

      // Tiny textured food pieces visible through the translucent glass.
      const seedMat = new THREE.MeshStandardMaterial({ color: product.fill, roughness: 0.7 });
      for (let i = 0; i < 22; i++) {
        const a = i * 2.399;
        const r = 0.3 + (i % 5) * 0.075;
        const seed = new THREE.Mesh(new THREE.SphereGeometry(0.045 + (i % 3) * 0.014, 8, 6), seedMat);
        seed.position.set(Math.cos(a) * r, -0.83 + (i % 8) * 0.19, Math.sin(a) * r);
        group.add(seed);
      }

      const foot = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.045, 10, 48), glass);
      foot.rotation.x = Math.PI / 2;
      foot.position.y = -1.06;
      group.add(foot);

      group.rotation.y = -0.2;
      group.rotation.x = 0.025;

      ro = new ResizeObserver(resize);
      ro.observe(host);

      let frame = 0;
      let drag = false;
      let lastX = 0;
      const el = renderer.domElement;
      el.addEventListener("pointerdown", (e) => {
        drag = true;
        lastX = e.clientX;
        el.setPointerCapture(e.pointerId);
      });
      el.addEventListener("pointermove", (e) => {
        if (drag) {
          group.rotation.y += (e.clientX - lastX) * 0.012;
          lastX = e.clientX;
        }
      });
      el.addEventListener("pointerup", () => (drag = false));
      el.addEventListener("pointercancel", () => (drag = false));

      const animate = () => {
        if (disposed) return;
        frame++;
        if (!drag) group.rotation.y += speed;
        group.position.y = Math.sin(frame * 0.025 + phase) * 0.055;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      const canvas = host.querySelector("canvas");
      if (canvas) {
        const renderer = canvas as HTMLCanvasElement & { __jarRenderer?: { dispose: () => void } };
        renderer.__jarRenderer?.dispose();
      }
      host.innerHTML = "";
    };
  }, [product.color, product.fill, product.name, product.type, speed, phase]);

  return <div ref={hostRef} id={id} className={className} role="img" aria-label={ariaLabel ?? `Interactive 3D jar of ${product.name}. Drag to rotate.`} />;
}
