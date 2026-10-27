import * as THREE from "three";
import type { Product } from "@/lib/products";

export interface JarUpdateHandler {
  (time: number): void;
}

/**
 * Creates a highly aesthetic 3D artisan glass jar with:
 * - Refractive flint glass with authentic thickness and reflections
 * - Handcrafted vegetable & fruit pieces tailored to the pickle name (mango chunks,
 *   amla wedges, green chilli rings, bitter gourd slices, lemon wedges, baby mangoes)
 *   with realistic floating buoyancy motion in rich translucent spiced oil.
 * - Dynamic swirling & drifting particle powder motion for chutney powders.
 * - Heritage gold & crimson screw lid with embossed top medal.
 * - Curved Indira Pachhi's bottle_sticker.jpg label.
 */
export function createPickleJar(product: Product, stickerTexture: THREE.Texture): THREE.Group {
  const jarGroup = new THREE.Group();
  const isPowder = product.type === "powder";

  // 1. Flint Glass Materials
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.06,
    metalness: 0.04,
    transmission: 0.92,
    ior: 1.52,
    thickness: 0.72,
    specularIntensity: 1.3,
    specularColor: 0xffffff,
    transparent: true,
    opacity: 0.4,
  });

  // Metallic & lacquer lid materials
  const goldMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0xdeb059,
    roughness: 0.24,
    metalness: 0.78,
  });

  const lidCapMaterial = new THREE.MeshStandardMaterial({
    color: 0x6e1b15, // Deep royal lacquer crimson
    roughness: 0.3,
    metalness: 0.22,
  });

  // Updaters collection called every frame
  const animators: ((time: number) => void)[] = [];

  // ==========================================================================
  // A. PICKLE JARS: Translucent Spiced Oil + Floating Real Vegetable Pieces
  // ==========================================================================
  if (!isPowder) {
    // 1. Translucent spiced oil volume (lets light shine through onto floating chunks)
    const oilMaterial = new THREE.MeshPhysicalMaterial({
      color: product.fill,
      roughness: 0.2,
      metalness: 0.05,
      transmission: 0.52,
      ior: 1.48,
      thickness: 0.45,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    });

    const innerOilBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.65, 1.74, 48),
      oilMaterial,
    );
    innerOilBody.position.y = -0.14;
    jarGroup.add(innerOilBody);

    const innerOilShoulder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.72, 0.3, 48),
      oilMaterial,
    );
    innerOilShoulder.position.y = 0.87;
    jarGroup.add(innerOilShoulder);

    // 2. Vegetable Chunks Tailored to Pickle Type
    const pName = product.name.toLowerCase();

    // Reusable vegetable materials based on vegetable type
    let chunkColorPrimary = 0xe58e24; // default golden mango
    let chunkColorSecondary = 0xd46815; // spiced dark mango
    let chunkColorRind = 0x5b7824; // olive/green skin

    if (pName.includes("amla")) {
      chunkColorPrimary = 0x87a13c; // herbal olive jade
      chunkColorSecondary = 0x6e882a;
      chunkColorRind = 0x9bb744;
    } else if (pName.includes("chilli")) {
      chunkColorPrimary = 0x2f8a1e; // vibrant chilli green
      chunkColorSecondary = 0x226b15;
      chunkColorRind = 0x48a832;
    } else if (pName.includes("bitter gourd")) {
      chunkColorPrimary = 0x4d7524; // karela forest green
      chunkColorSecondary = 0x3d5e1c;
      chunkColorRind = 0x739c36;
    } else if (pName.includes("lemon")) {
      chunkColorPrimary = 0xd6bf29; // sunny citrus lemon
      chunkColorSecondary = 0xedd63e;
      chunkColorRind = 0xbfa71b;
    } else if (pName.includes("appi midi")) {
      chunkColorPrimary = 0x656e29; // deep savoury baby mango
      chunkColorSecondary = 0x4e541f;
      chunkColorRind = 0x758030;
    } else if (pName.includes("andhra")) {
      chunkColorPrimary = 0xc22b15; // fiery avakaya chilli red
      chunkColorSecondary = 0x9e1e0c;
      chunkColorRind = 0xda4c22;
    }

    const chunkMat1 = new THREE.MeshStandardMaterial({
      color: chunkColorPrimary,
      roughness: 0.28,
      metalness: 0.06,
    });
    const chunkMat2 = new THREE.MeshStandardMaterial({
      color: chunkColorSecondary,
      roughness: 0.32,
      metalness: 0.05,
    });
    const rindMat = new THREE.MeshStandardMaterial({
      color: chunkColorRind,
      roughness: 0.35,
      metalness: 0.04,
    });

    const floatingPieces: {
      mesh: THREE.Object3D;
      baseY: number;
      baseX: number;
      baseZ: number;
      phase: number;
      freq: number;
      amplitude: number;
      rotSpeed: THREE.Vector3;
    }[] = [];

    // Helper: Build specific piece geometry depending on vegetable type
    const createVegetablePiece = (index: number): THREE.Object3D => {
      const group = new THREE.Group();

      if (pName.includes("chilli")) {
        // Cut green chilli ring / slice with hollow center
        const ringGeom = new THREE.TorusGeometry(0.08 + (index % 3) * 0.015, 0.032, 8, 16);
        const ringMesh = new THREE.Mesh(ringGeom, index % 2 === 0 ? chunkMat1 : chunkMat2);
        group.add(ringMesh);

        // Visible pale chilli seed inside
        const seedGeom = new THREE.SphereGeometry(0.02, 6, 6);
        const seedMat = new THREE.MeshStandardMaterial({ color: 0xfff3d4, roughness: 0.4 });
        const seedMesh = new THREE.Mesh(seedGeom, seedMat);
        seedMesh.position.set(0.03, 0.02, 0);
        group.add(seedMesh);
      } else if (pName.includes("amla")) {
        // Curved amla segment / boat-shaped gooseberry wedge
        const amlaGeom = new THREE.CapsuleGeometry(0.065, 0.14, 4, 8);
        const amlaMesh = new THREE.Mesh(amlaGeom, index % 2 === 0 ? chunkMat1 : chunkMat2);
        amlaMesh.scale.set(1, 1, 0.65);
        group.add(amlaMesh);
      } else if (pName.includes("bitter gourd")) {
        // Karela ring slice with bumpy ridges
        const karelaGeom = new THREE.TorusGeometry(0.1, 0.038, 10, 18);
        const karelaMesh = new THREE.Mesh(karelaGeom, index % 2 === 0 ? chunkMat1 : chunkMat2);
        group.add(karelaMesh);
      } else if (pName.includes("lemon")) {
        // Triangular lemon wedge
        const lemonGeom = new THREE.CylinderGeometry(
          0.09,
          0.09,
          0.08,
          6,
          1,
          false,
          0,
          Math.PI * 0.8,
        );
        const lemonMesh = new THREE.Mesh(lemonGeom, index % 2 === 0 ? chunkMat1 : rindMat);
        group.add(lemonMesh);
      } else if (pName.includes("appi midi")) {
        // Oval whole baby mango with stem tip
        const appiGeom = new THREE.SphereGeometry(0.1, 10, 8);
        const appiMesh = new THREE.Mesh(appiGeom, index % 2 === 0 ? chunkMat1 : chunkMat2);
        appiMesh.scale.set(0.85, 1.35, 0.85);
        group.add(appiMesh);
      } else {
        // Default Mango (Raw Mango, Mango Hindi, Sweet Mango, Andhra):
        // Authentic knife-cut irregular diced mango cubes!
        const w = 0.16 + (index % 4) * 0.025;
        const h = 0.14 + (index % 3) * 0.022;
        const d = 0.15 + (index % 5) * 0.02;

        const mangoGeom = new THREE.BoxGeometry(w, h, d, 2, 2, 2);
        // Slightly perturb vertices for natural handmade artisan cut
        const pos = mangoGeom.attributes.position;
        for (let j = 0; j < pos.count; j++) {
          const vx = pos.getX(j) + ((j % 3) - 1) * 0.012;
          const vy = pos.getY(j) + ((j % 4) - 1.5) * 0.01;
          const vz = pos.getZ(j) + ((j % 2) - 0.5) * 0.012;
          pos.setXYZ(j, vx, vy, vz);
        }
        mangoGeom.computeVertexNormals();

        const mangoMesh = new THREE.Mesh(
          mangoGeom,
          index % 3 === 0 ? rindMat : index % 2 === 0 ? chunkMat1 : chunkMat2,
        );
        group.add(mangoMesh);
      }

      return group;
    };

    // Distribute 18 to 22 vegetable pieces inside the jar volume
    const totalChunks = 20;
    for (let i = 0; i < totalChunks; i++) {
      const piece = createVegetablePiece(i);

      // Spherical/cylindrical coordinates inside the jar
      const angle = i * 2.3999;
      const radius = 0.18 + (i % 6) * 0.065; // keep inside inner radius (0.6)
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -0.78 + (i / totalChunks) * 1.52;

      piece.position.set(x, y, z);
      piece.rotation.set((i * 1.3) % Math.PI, (i * 0.9) % Math.PI, (i * 1.7) % Math.PI);

      jarGroup.add(piece);

      floatingPieces.push({
        mesh: piece,
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: i * 0.85,
        freq: 1.2 + (i % 4) * 0.25,
        amplitude: 0.022 + (i % 3) * 0.01,
        rotSpeed: new THREE.Vector3(
          ((i % 3) - 1) * 0.002,
          ((i % 5) - 2) * 0.0025,
          ((i % 2) - 0.5) * 0.0018,
        ),
      });
    }

    // 3. Floating Spice Seeds (Mustard, Fenugreek, Chilli Seeds)
    const mustardMat = new THREE.MeshStandardMaterial({
      color: 0x1f1915,
      roughness: 0.45,
    });
    const fenugreekMat = new THREE.MeshStandardMaterial({
      color: 0xd9a43a,
      roughness: 0.4,
    });
    const chilliSeedMat = new THREE.MeshStandardMaterial({
      color: 0xffe7b8,
      roughness: 0.35,
    });

    const seedCount = 36;
    for (let i = 0; i < seedCount; i++) {
      const angle = i * 2.414;
      const radius = 0.22 + (i % 7) * 0.055;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -0.84 + (i / seedCount) * 1.6;

      const seedGeom =
        i % 3 === 0
          ? new THREE.SphereGeometry(0.028, 6, 6)
          : i % 3 === 1
            ? new THREE.DodecahedronGeometry(0.034)
            : new THREE.SphereGeometry(0.022, 6, 6);

      const mat = i % 3 === 0 ? mustardMat : i % 3 === 1 ? fenugreekMat : chilliSeedMat;
      const seed = new THREE.Mesh(seedGeom, mat);
      seed.position.set(x, y, z);
      jarGroup.add(seed);

      floatingPieces.push({
        mesh: seed,
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: i * 0.5,
        freq: 1.5 + (i % 3) * 0.4,
        amplitude: 0.018 + (i % 4) * 0.008,
        rotSpeed: new THREE.Vector3(0.004, 0.006, 0.002),
      });
    }

    // Animator: Organic floating motion in spiced oil
    animators.push((time: number) => {
      for (let i = 0; i < floatingPieces.length; i++) {
        const item = floatingPieces[i];
        // Vertical bobbing + subtle horizontal drift
        item.mesh.position.y =
          item.baseY + Math.sin(time * item.freq + item.phase) * item.amplitude;
        item.mesh.position.x =
          item.baseX + Math.cos(time * (item.freq * 0.7) + item.phase) * (item.amplitude * 0.4);
        item.mesh.position.z =
          item.baseZ + Math.sin(time * (item.freq * 0.6) + item.phase) * (item.amplitude * 0.4);

        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;
      }
    });
  }

  // ==========================================================================
  // B. CHUTNEY POWDERS: Granulated Bed + Active Swirling Particle Powder Motion
  // ==========================================================================
  if (isPowder) {
    // 1. Base Powder Bed at Bottom
    const powderBedMat = new THREE.MeshStandardMaterial({
      color: product.fill,
      roughness: 0.95,
      metalness: 0.02,
    });

    const powderBed = new THREE.Mesh(
      new THREE.CylinderGeometry(0.71, 0.65, 1.25, 48),
      powderBedMat,
    );
    powderBed.position.y = -0.42;
    jarGroup.add(powderBed);

    // Textured top powder mound
    const powderMound = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.38, 36), powderBedMat);
    powderMound.position.y = 0.25;
    jarGroup.add(powderMound);

    // 2. Active 3D Powder Particle Cloud
    // 280 particle granules with individual velocities and turbulent powder motion
    const particleCount = 280;
    const particleGeom = new THREE.DodecahedronGeometry(0.024, 0);

    const particleMat = new THREE.MeshStandardMaterial({
      color: product.color,
      roughness: 0.88,
      metalness: 0.04,
    });

    const instancedParticles = new THREE.InstancedMesh(particleGeom, particleMat, particleCount);
    jarGroup.add(instancedParticles);

    // Color variation across powder particles (garlic bits, chili powder, cumin specks)
    const colorA = new THREE.Color(product.color);
    const colorB = new THREE.Color(product.fill);
    const colorGarlic = new THREE.Color(0xf6e3bf); // roasted garlic speck
    const colorChilli = new THREE.Color(0xc93618); // fiery red chili speck

    const particleData: {
      radius: number;
      baseAngle: number;
      baseY: number;
      phase: number;
      speed: number;
      swirlRate: number;
      scale: number;
    }[] = [];

    const dummy = new THREE.Object3D();

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.08 + Math.random() * 0.52; // inside glass
      const baseAngle = Math.random() * Math.PI * 2;
      const baseY = -0.7 + Math.random() * 1.5; // fill from base to shoulder
      const scale = 0.6 + Math.random() * 0.9;
      const phase = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.4;
      const swirlRate = (Math.random() - 0.5) * 1.2;

      particleData.push({ radius, baseAngle, baseY, phase, speed, swirlRate, scale });

      dummy.position.set(Math.cos(baseAngle) * radius, baseY, Math.sin(baseAngle) * radius);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      instancedParticles.setMatrixAt(i, dummy.matrix);

      // Color assignment
      const r = Math.random();
      const pColor = r < 0.4 ? colorA : r < 0.7 ? colorB : r < 0.85 ? colorGarlic : colorChilli;
      instancedParticles.setColorAt(i, pColor);
    }
    instancedParticles.instanceMatrix.needsUpdate = true;
    if (instancedParticles.instanceColor) instancedParticles.instanceColor.needsUpdate = true;

    // Animator: Dynamic swirling, drifting, turbulent powder motion
    animators.push((time: number) => {
      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];

        // Continuous gentle swirling + turbulent updrafts & settling
        const currentAngle = p.baseAngle + time * p.swirlRate * 0.4;
        const currentRadius = p.radius + Math.sin(time * 1.8 + p.phase) * 0.02;

        const x = Math.cos(currentAngle) * currentRadius;
        const z = Math.sin(currentAngle) * currentRadius;
        const y =
          p.baseY +
          Math.sin(time * p.speed + p.phase) * 0.065 +
          Math.cos(time * 2.1 + p.phase * 1.5) * 0.025;

        dummy.position.set(x, y, z);
        dummy.rotation.set(time * 0.5 + p.phase, time * 0.7 + p.phase, 0);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();

        instancedParticles.setMatrixAt(i, dummy.matrix);
      }
      instancedParticles.instanceMatrix.needsUpdate = true;
    });
  }

  // ==========================================================================
  // C. OUTER GLASS SHELL
  // ==========================================================================
  // Lower body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.71, 1.86, 64), glassMaterial);
  body.position.y = -0.12;
  jarGroup.add(body);

  // Rounded shoulder
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.78, 0.36, 64), glassMaterial);
  shoulder.position.y = 0.97;
  jarGroup.add(shoulder);

  // Threaded neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.28, 64), glassMaterial);
  neck.position.y = 1.22;
  jarGroup.add(neck);

  // Glass screw thread ridges around neck
  const thread1 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.018, 10, 48), glassMaterial);
  thread1.rotation.x = Math.PI / 2;
  thread1.position.y = 1.17;
  jarGroup.add(thread1);

  const thread2 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.018, 10, 48), glassMaterial);
  thread2.rotation.x = Math.PI / 2;
  thread2.position.y = 1.26;
  jarGroup.add(thread2);

  // Heavy glass foot base ring
  const foot = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.05, 12, 64), glassMaterial);
  foot.rotation.x = Math.PI / 2;
  foot.position.y = -1.04;
  jarGroup.add(foot);

  // ==========================================================================
  // D. AUTHENTIC CURVED BRANDING LABEL (bottle_sticker.jpg)
  // ==========================================================================
  const stickerMat = new THREE.MeshStandardMaterial({
    map: stickerTexture,
    roughness: 0.32,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });

  const labelHeight = 0.88;
  const labelRadiusTop = 0.768;
  const labelRadiusBottom = 0.73;
  const labelTheta = 3.28; // ~188 degrees across front

  const labelGeom = new THREE.CylinderGeometry(
    labelRadiusTop,
    labelRadiusBottom,
    labelHeight,
    64,
    1,
    true,
    -labelTheta / 2,
    labelTheta,
  );

  const labelMesh = new THREE.Mesh(labelGeom, stickerMat);
  labelMesh.position.y = -0.05;
  jarGroup.add(labelMesh);

  // ==========================================================================
  // E. VINTAGE HERITAGE LID (Gold & Lacquer Crimson)
  // ==========================================================================
  // Lower gold seal ring
  const sealRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.485, 0.485, 0.08, 64),
    goldMetalMaterial,
  );
  sealRing.position.y = 1.37;
  jarGroup.add(sealRing);

  // Crimson lacquer screw cap
  const lidCap = new THREE.Mesh(new THREE.CylinderGeometry(0.505, 0.505, 0.26, 64), lidCapMaterial);
  lidCap.position.y = 1.52;
  jarGroup.add(lidCap);

  // Embossed gold top medal
  const lidTopMedal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 0.04, 64),
    goldMetalMaterial,
  );
  lidTopMedal.position.y = 1.66;
  jarGroup.add(lidTopMedal);

  // Attach master update handler to jarGroup.userData
  jarGroup.userData.update = (time: number) => {
    for (let i = 0; i < animators.length; i++) {
      animators[i](time);
    }
  };

  return jarGroup;
}
