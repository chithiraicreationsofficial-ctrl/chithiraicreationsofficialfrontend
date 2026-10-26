import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DiwaliThreeCanvas({ className = "", style = {} }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0416, 0.02);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffb74d, 1.4);
    dirLight.position.set(6, 12, 10);
    scene.add(dirLight);

    const subtleBackLight = new THREE.DirectionalLight(0xff7700, 0.6);
    subtleBackLight.position.set(-6, -6, -4);
    scene.add(subtleBackLight);

    // ==========================================
    // Procedural Particle Spark Texture
    // ==========================================
    const createSparkTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.2, "rgba(255, 230, 130, 0.95)");
      gradient.addColorStop(0.5, "rgba(255, 120, 20, 0.5)");
      gradient.addColorStop(1, "rgba(255, 30, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const sparkTexture = createSparkTexture();

    // ==========================================
    // 1. Ambient Golden Firefly & Spark Particles
    // ==========================================
    const ambientCount = 380;
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPos = new Float32Array(ambientCount * 3);
    const ambientCols = new Float32Array(ambientCount * 3);
    const ambientVels = [];

    const sparkPalette = [
      new THREE.Color(0xffd700), // Gold
      new THREE.Color(0xff9100), // Amber
      new THREE.Color(0xff3d00), // Vivid orange
      new THREE.Color(0xffea00), // Bright yellow
      new THREE.Color(0xffffff), // White spark
      new THREE.Color(0xff1744), // Crimson
    ];

    for (let i = 0; i < ambientCount; i++) {
      ambientPos[i * 3] = (Math.random() - 0.5) * 40;
      ambientPos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      ambientPos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

      const col = sparkPalette[Math.floor(Math.random() * sparkPalette.length)];
      ambientCols[i * 3] = col.r;
      ambientCols[i * 3 + 1] = col.g;
      ambientCols[i * 3 + 2] = col.b;

      ambientVels.push({
        vx: (Math.random() - 0.5) * 0.012,
        vy: Math.random() * 0.018 + 0.006,
        swaySpeed: Math.random() * 2 + 1,
        swayAmp: Math.random() * 0.01 + 0.004,
      });
    }

    ambientGeo.setAttribute("position", new THREE.BufferAttribute(ambientPos, 3));
    ambientGeo.setAttribute("color", new THREE.BufferAttribute(ambientCols, 3));

    const ambientMat = new THREE.PointsMaterial({
      size: 0.38,
      map: sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const ambientParticles = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientParticles);

    // ==========================================
    // 2. Dynamic Cracker Burst & Firework System
    // ==========================================
    const bursts = [];
    const maxBursts = 14;

    const burstPalettes = [
      [0xffd700, 0xff9100, 0xffffff, 0xffa000], // Gold & Saffron
      [0xff1744, 0xff5252, 0xffffff, 0xff8a80], // Crimson Festival Red
      [0x00e676, 0x69f0ae, 0xffffff, 0xb9f6ca], // Festive Emerald
      [0xd500f9, 0xe040fb, 0xffffff, 0xea80fc], // Royal Violet
      [0x00e5ff, 0x18ffff, 0xffffff, 0x84ffff], // Cyan Electric
      [0xff6d00, 0xffab40, 0xffd700, 0xfff3e0], // Golden Orange
    ];

    const triggerCrackerBurst = (originX, originY, originZ = -1) => {
      if (bursts.length > maxBursts) {
        const oldest = bursts.shift();
        scene.remove(oldest.points);
        scene.remove(oldest.flash);
        oldest.geo.dispose();
        oldest.mat.dispose();
      }

      const sparkCount = 85;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(sparkCount * 3);
      const cols = new Float32Array(sparkCount * 3);
      const velocities = [];

      const palette = burstPalettes[Math.floor(Math.random() * burstPalettes.length)];

      for (let i = 0; i < sparkCount; i++) {
        pos[i * 3] = originX;
        pos[i * 3 + 1] = originY;
        pos[i * 3 + 2] = originZ;

        // Spherical velocity explosion
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = Math.random() * 0.18 + 0.06;

        velocities.push({
          vx: speed * Math.sin(phi) * Math.cos(theta),
          vy: speed * Math.sin(phi) * Math.sin(theta),
          vz: speed * Math.cos(phi),
          drag: 0.965,
          gravity: -0.0026,
        });

        const hex = palette[Math.floor(Math.random() * palette.length)];
        const c = new THREE.Color(hex);
        cols[i * 3] = c.r;
        cols[i * 3 + 1] = c.g;
        cols[i * 3 + 2] = c.b;
      }

      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.55,
        map: sparkTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
        opacity: 1,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // Flash light
      const flash = new THREE.PointLight(palette[0], 3.8, 10);
      flash.position.set(originX, originY, originZ);
      scene.add(flash);

      bursts.push({
        points,
        geo,
        mat,
        flash,
        velocities,
        count: sparkCount,
        life: 1.0,
        decay: 0.015,
      });
    };

    // ==========================================
    // 3. Rocket Cracker Trails (Launch upwards)
    // ==========================================
    const rockets = [];
    const launchRocket = () => {
      const startX = (Math.random() - 0.5) * 20;
      const startY = -12;
      const targetY = Math.random() * 6 + 1;
      const z = (Math.random() - 0.5) * 6 - 2;

      const rocketGeo = new THREE.BufferGeometry();
      const trailCount = 12;
      const rPos = new Float32Array(trailCount * 3);
      for (let i = 0; i < trailCount * 3; i++) rPos[i] = 0;
      rocketGeo.setAttribute("position", new THREE.BufferAttribute(rPos, 3));

      const rocketMat = new THREE.PointsMaterial({
        size: 0.6,
        map: sparkTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        color: 0xffd700,
      });

      const trailPoints = new THREE.Points(rocketGeo, rocketMat);
      trailPoints.position.set(startX, startY, z);
      scene.add(trailPoints);

      rockets.push({
        mesh: trailPoints,
        geo: rocketGeo,
        mat: rocketMat,
        x: startX,
        y: startY,
        z: z,
        vy: Math.random() * 0.18 + 0.22,
        targetY: targetY,
      });
    };

    // Auto-launch rockets / crackers periodically
    let lastLaunchTime = 0;
    const launchRandomCracker = () => {
      if (Math.random() > 0.5) {
        launchRocket();
      } else {
        const rx = (Math.random() - 0.5) * 24;
        const ry = Math.random() * 8 - 1;
        const rz = (Math.random() - 0.5) * 8 - 2;
        triggerCrackerBurst(rx, ry, rz);
      }
    };

    // Initial festive bursts
    setTimeout(() => launchRandomCracker(), 500);
    setTimeout(() => launchRandomCracker(), 1200);

    // ==========================================
    // 4. Ground Spinning Chakras (Zamin Chakkar)
    // ==========================================
    const chakras = [];
    const createChakra = (x, y, z) => {
      const chakraGroup = new THREE.Group();

      // Disc geometry
      const discGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.08, 20);
      const discMat = new THREE.MeshStandardMaterial({
        color: 0xff5722,
        roughness: 0.4,
        metalness: 0.6,
        emissive: 0xff3d00,
        emissiveIntensity: 0.4,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      chakraGroup.add(disc);

      // Spark spiral particles around chakra
      const sparkCount = 45;
      const sGeo = new THREE.BufferGeometry();
      const sPos = new Float32Array(sparkCount * 3);
      for (let i = 0; i < sparkCount; i++) {
        const r = Math.random() * 1.5 + 0.5;
        const a = (i / sparkCount) * Math.PI * 2;
        sPos[i * 3] = Math.cos(a) * r;
        sPos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        sPos[i * 3 + 2] = Math.sin(a) * r;
      }
      sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
      const sMat = new THREE.PointsMaterial({
        size: 0.45,
        map: sparkTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        color: 0xffd700,
      });
      const sparks = new THREE.Points(sGeo, sMat);
      chakraGroup.add(sparks);

      const light = new THREE.PointLight(0xff9100, 2.5, 6);
      chakraGroup.add(light);

      chakraGroup.position.set(x, y, z);
      chakraGroup.rotation.x = Math.PI / 3;
      scene.add(chakraGroup);

      return { group: chakraGroup, sparks, sGeo, sMat, light, rotSpeed: 0.2 };
    };

    chakras.push(createChakra(-8.5, -5.5, -2));
    chakras.push(createChakra(8.5, -5.5, -2));

    // ==========================================
    // 5. 3D FESTIVE SWEETS (Laddus, Kaju Katlis, Jamuns)
    // ==========================================
    const sweets = [];

    // Helper: 3D Golden Motichoor Laddu
    const createLaddu = (x, y, z, scale = 1) => {
      const ladduGroup = new THREE.Group();

      // Core sphere with warm golden motichoor amber tone
      const sphereGeo = new THREE.SphereGeometry(0.72, 24, 24);
      const ladduMat = new THREE.MeshStandardMaterial({
        color: 0xffa000,
        roughness: 0.55,
        metalness: 0.25,
        emissive: 0xff6f00,
        emissiveIntensity: 0.28,
      });
      const core = new THREE.Mesh(sphereGeo, ladduMat);
      ladduGroup.add(core);

      // Tiny pistachios / saffron flecks decoration
      const fleckGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
      const fleckMat = new THREE.MeshStandardMaterial({
        color: 0x4caf50, // Pistachio green
        roughness: 0.3,
      });
      for (let i = 0; i < 6; i++) {
        const fleck = new THREE.Mesh(fleckGeo, fleckMat);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        fleck.position.set(
          0.7 * Math.sin(phi) * Math.cos(theta),
          0.7 * Math.sin(phi) * Math.sin(theta),
          0.7 * Math.cos(phi)
        );
        fleck.rotation.set(Math.random(), Math.random(), Math.random());
        ladduGroup.add(fleck);
      }

      ladduGroup.position.set(x, y, z);
      ladduGroup.scale.set(scale, scale, scale);
      scene.add(ladduGroup);

      return {
        group: ladduGroup,
        baseY: y,
        bobSpeed: Math.random() * 1.2 + 0.8,
        bobAmp: 0.22,
        rotSpeedX: 0.006,
        rotSpeedY: 0.009,
        rotSpeedZ: 0.004,
        seed: Math.random() * 100,
      };
    };

    // Helper: 3D Diamond Kaju Katli (with shimmering silver leaf)
    const createKajuKatli = (x, y, z, scale = 1) => {
      const katliGroup = new THREE.Group();

      // Diamond rhombus shape
      const shape = new THREE.Shape();
      shape.moveTo(0, 0.9);
      shape.lineTo(0.65, 0);
      shape.lineTo(0, -0.9);
      shape.lineTo(-0.65, 0);
      shape.closePath();

      const extrudeSettings = {
        depth: 0.25,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04,
      };

      const katliGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const silverMat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        metalness: 0.9,
        roughness: 0.18,
        emissive: 0xffffff,
        emissiveIntensity: 0.15,
      });
      const katliMesh = new THREE.Mesh(katliGeo, silverMat);
      katliGroup.add(katliMesh);

      katliGroup.position.set(x, y, z);
      katliGroup.scale.set(scale, scale, scale);
      scene.add(katliGroup);

      return {
        group: katliGroup,
        baseY: y,
        bobSpeed: Math.random() * 1.3 + 0.9,
        bobAmp: 0.25,
        rotSpeedX: 0.008,
        rotSpeedY: 0.012,
        rotSpeedZ: 0.005,
        seed: Math.random() * 100,
      };
    };

    // Helper: 3D Golden Jalebi Coil
    const createJalebi = (x, y, z, scale = 1) => {
      const jalebiGroup = new THREE.Group();

      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.16, 12, 28),
        new THREE.MeshStandardMaterial({
          color: 0xff6d00,
          roughness: 0.25,
          metalness: 0.35,
          emissive: 0xff3d00,
          emissiveIntensity: 0.3,
        })
      );
      jalebiGroup.add(ring1);

      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.14, 12, 24),
        new THREE.MeshStandardMaterial({
          color: 0xff9100,
          roughness: 0.2,
          metalness: 0.4,
          emissive: 0xff6d00,
          emissiveIntensity: 0.35,
        })
      );
      ring2.position.set(0.2, 0.1, 0.05);
      jalebiGroup.add(ring2);

      jalebiGroup.position.set(x, y, z);
      jalebiGroup.scale.set(scale, scale, scale);
      scene.add(jalebiGroup);

      return {
        group: jalebiGroup,
        baseY: y,
        bobSpeed: Math.random() * 1.1 + 0.85,
        bobAmp: 0.2,
        rotSpeedX: 0.007,
        rotSpeedY: 0.01,
        rotSpeedZ: 0.006,
        seed: Math.random() * 100,
      };
    };

    // Place 3D sweets on both sides of the screen at various depths
    sweets.push(createLaddu(-7.2, 0.5, -1.8, 0.9));
    sweets.push(createLaddu(7.2, 0.2, -1.5, 0.88));
    sweets.push(createKajuKatli(-6.2, -1.6, -1.2, 0.85));
    sweets.push(createKajuKatli(6.6, 3.8, -2.2, 0.8));
    sweets.push(createJalebi(6.8, -1.4, -1.4, 0.85));
    sweets.push(createJalebi(-6.5, 3.5, -2.0, 0.8));

    // ==========================================
    // 6. 3D Floating Diya Lamps
    // ==========================================
    const diyas = [];

    const createDiya = (x, y, z, scale = 1, rotationSpeed = 0.004) => {
      const diyaGroup = new THREE.Group();

      const points = [];
      points.push(new THREE.Vector2(0, -0.4));
      points.push(new THREE.Vector2(0.8, -0.35));
      points.push(new THREE.Vector2(1.2, -0.05));
      points.push(new THREE.Vector2(1.35, 0.25));
      points.push(new THREE.Vector2(1.2, 0.35));
      points.push(new THREE.Vector2(0.95, 0.28));
      points.push(new THREE.Vector2(0.5, 0.1));
      points.push(new THREE.Vector2(0, 0.05));

      const bowlGeometry = new THREE.LatheGeometry(points, 24);
      const bowlMaterial = new THREE.MeshStandardMaterial({
        color: 0xcd7f32,
        roughness: 0.35,
        metalness: 0.7,
        emissive: 0x5a1800,
        emissiveIntensity: 0.35,
      });
      const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
      diyaGroup.add(bowl);

      const rimGeo = new THREE.TorusGeometry(1.28, 0.07, 8, 28);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.95,
        roughness: 0.2,
        emissive: 0xffb300,
        emissiveIntensity: 0.45,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.3;
      diyaGroup.add(rim);

      const flameCoreGeo = new THREE.ConeGeometry(0.2, 0.65, 14);
      const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
      flameCore.position.set(0, 0.55, 0);
      diyaGroup.add(flameCore);

      const flameOuterGeo = new THREE.ConeGeometry(0.38, 0.85, 14);
      const flameOuterMat = new THREE.MeshBasicMaterial({
        color: 0xff7700,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const flameOuter = new THREE.Mesh(flameOuterGeo, flameOuterMat);
      flameOuter.position.set(0, 0.58, 0);
      diyaGroup.add(flameOuter);

      const diyaLight = new THREE.PointLight(0xffa726, 2.5, 7.5);
      diyaLight.position.set(0, 0.7, 0);
      diyaGroup.add(diyaLight);

      diyaGroup.position.set(x, y, z);
      diyaGroup.scale.set(scale, scale, scale);
      scene.add(diyaGroup);

      return {
        group: diyaGroup,
        flameCore,
        flameOuter,
        light: diyaLight,
        baseY: y,
        baseX: x,
        bobSpeed: Math.random() * 1.5 + 1.2,
        bobAmp: Math.random() * 0.25 + 0.15,
        rotSpeed: rotationSpeed,
        seed: Math.random() * 100,
      };
    };

    diyas.push(createDiya(-7.8, 2.6, -2.4, 0.82, 0.003));
    diyas.push(createDiya(7.8, 2.3, -2.2, 0.82, -0.003));
    diyas.push(createDiya(-8.2, -3.2, -1.8, 0.88, 0.004));
    diyas.push(createDiya(8.2, -3.0, -1.5, 0.88, -0.004));

    // Mouse Parallax & Click to Burst
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e) => {
      const xNorm = (e.clientX / window.innerWidth) * 2 - 1;
      const yNorm = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = xNorm * 1.2;
      targetCameraY = yNorm * 0.8;
    };

    const handleWindowClick = (e) => {
      // Map click to 3D world coordinates
      const x = ((e.clientX / window.innerWidth) * 2 - 1) * 10;
      const y = (-(e.clientY / window.innerHeight) * 2 + 1) * 6;
      triggerCrackerBurst(x, y, (Math.random() - 0.5) * 4);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleWindowClick);

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera parallax
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Auto-launch random cracker burst or rocket every 2.0 seconds
      if (elapsedTime - lastLaunchTime > 2.0) {
        lastLaunchTime = elapsedTime;
        launchRandomCracker();
      }

      // Update Rockets
      for (let r = rockets.length - 1; r >= 0; r--) {
        const rk = rockets[r];
        rk.y += rk.vy;
        rk.mesh.position.set(rk.x, rk.y, rk.z);

        if (rk.y >= rk.targetY) {
          triggerCrackerBurst(rk.x, rk.y, rk.z);
          scene.remove(rk.mesh);
          rk.geo.dispose();
          rk.mat.dispose();
          rockets.splice(r, 1);
        }
      }

      // Update Ground Chakras
      chakras.forEach((chk) => {
        chk.group.rotation.y += chk.rotSpeed;
        const sPos = chk.sGeo.attributes.position.array;
        const sparkCount = sPos.length / 3;
        for (let i = 0; i < sparkCount; i++) {
          const a = elapsedTime * 8 + (i / sparkCount) * Math.PI * 2;
          const r = 0.6 + Math.sin(elapsedTime * 4 + i) * 0.5;
          sPos[i * 3] = Math.cos(a) * r;
          sPos[i * 3 + 2] = Math.sin(a) * r;
        }
        chk.sGeo.attributes.position.needsUpdate = true;
        chk.light.intensity = 2.0 + Math.sin(elapsedTime * 12) * 0.8;
      });

      // Update 3D Sweets Bobbing and Rotation
      sweets.forEach((sw) => {
        const t = elapsedTime * sw.bobSpeed + sw.seed;
        sw.group.position.y = sw.baseY + Math.sin(t) * sw.bobAmp;
        sw.group.rotation.x += sw.rotSpeedX;
        sw.group.rotation.y += sw.rotSpeedY;
        sw.group.rotation.z += sw.rotSpeedZ;
      });

      // Update Ambient Spark Particles
      const posAttr = ambientGeo.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < ambientCount; i++) {
        const vel = ambientVels[i];
        posArray[i * 3 + 1] += vel.vy;
        posArray[i * 3] += Math.sin(elapsedTime * vel.swaySpeed + i) * vel.swayAmp + vel.vx;

        if (posArray[i * 3 + 1] > 14) {
          posArray[i * 3 + 1] = -14;
          posArray[i * 3] = (Math.random() - 0.5) * 40;
        }
      }
      posAttr.needsUpdate = true;

      // Update Cracker Bursts
      for (let b = bursts.length - 1; b >= 0; b--) {
        const burst = bursts[b];
        burst.life -= burst.decay;

        if (burst.life <= 0) {
          scene.remove(burst.points);
          scene.remove(burst.flash);
          burst.geo.dispose();
          burst.mat.dispose();
          bursts.splice(b, 1);
          continue;
        }

        const bPos = burst.geo.attributes.position.array;
        for (let i = 0; i < burst.count; i++) {
          const v = burst.velocities[i];
          v.vx *= v.drag;
          v.vy *= v.drag;
          v.vz *= v.drag;
          v.vy += v.gravity;

          bPos[i * 3] += v.vx;
          bPos[i * 3 + 1] += v.vy;
          bPos[i * 3 + 2] += v.vz;
        }
        burst.geo.attributes.position.needsUpdate = true;
        burst.mat.opacity = Math.max(0, burst.life);
        burst.mat.size = 0.55 * Math.max(0.2, burst.life);
        burst.flash.intensity = 3.8 * burst.life;
      }

      // Update Diyas
      diyas.forEach((diya) => {
        const t = elapsedTime * diya.bobSpeed + diya.seed;
        diya.group.position.y = diya.baseY + Math.sin(t) * diya.bobAmp;
        diya.group.rotation.y += diya.rotSpeed;
        diya.group.rotation.z = Math.sin(t * 0.7) * 0.04;

        const flicker = 1 + Math.sin(elapsedTime * 18 + diya.seed) * 0.22 + (Math.random() - 0.5) * 0.12;
        diya.flameCore.scale.set(1, flicker, 1);
        diya.flameOuter.scale.set(1 + Math.sin(t * 8) * 0.1, flicker, 1 + Math.sin(t * 8) * 0.1);
        diya.light.intensity = 2.4 * flicker;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("resize", handleResize);

      bursts.forEach((burst) => {
        scene.remove(burst.points);
        scene.remove(burst.flash);
        burst.geo.dispose();
        burst.mat.dispose();
      });

      rockets.forEach((rk) => {
        scene.remove(rk.mesh);
        rk.geo.dispose();
        rk.mat.dispose();
      });

      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ambientGeo.dispose();
      ambientMat.dispose();
      sparkTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`diwali-three-canvas-container ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
        ...style,
      }}
    />
  );
}
