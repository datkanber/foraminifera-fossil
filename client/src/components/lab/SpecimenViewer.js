import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { applySpecimenMaterials, fitModel, loadSpecimenCopy } from "./modelLoader";

// ─── SPECIMEN VIEWER ────────────────────────────────────────────────────────
// A small three.js stage for one specimen: drag to rotate, wheel to zoom.
// It shows the room-sized model at once (already loaded for the pedestals)
// and swaps in the detailed model when that arrives.
//
// Modes:
//   solid   — lit surface
//   xray    — glowing edges, so walls inside the test show through
//   section — a plane facing the camera cuts the front away, like a thin
//             section; inner faces are tinted so the cut chambers stand out

const HOME = new THREE.Vector3(0, 0.35, 3.4);

// -jr A fresnel "x-ray": surfaces seen edge-on glow, surfaces facing the
// camera stay faint. With additive blending the inner chamber walls add up.
const xrayMaterial = new THREE.ShaderMaterial({
  uniforms: { color: { value: new THREE.Color(0x7fd6ff) } },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      float rim = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
      gl_FragColor = vec4(color * (0.03 + 0.5 * pow(rim, 2.5)), 1.0);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
});

// Back faces (the inside of a chamber) turn amber.
function tintInnerFaces(material) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      "#include <color_fragment>\n if (!gl_FrontFacing) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.85, 0.42, 0.18), 0.6);"
    );
  };
  material.customProgramCacheKey = () => "lab-inner-tint";
}

export default function SpecimenViewer({
  specimen,
  detail = true,
  mode = "solid",
  sectionDepth = 0.5,
  autoRotate = true,
  resetKey = 0,
  className = "",
  onDetailLoading,
}) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const settingsRef = useRef({ mode, sectionDepth });
  const [hasModel, setHasModel] = useState(false);

  settingsRef.current = { mode, sectionDepth };

  // ── Stage: renderer, camera, controls, lights ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.localClippingEnabled = true;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xfff8ec, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xa8d8ff, 0.8);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);
    camera.position.copy(HOME);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 7;
    controls.autoRotateSpeed = 1.4;

    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
    const viewDirection = new THREE.Vector3();

    const stage = { renderer, scene, camera, controls, envMap, clipPlane, holder: null, materials: [] };
    stageRef.current = stage;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      if (settingsRef.current.mode === "section") {
        // The plane faces away from the camera; everything nearer than the
        // chosen depth is cut away, whatever side the user looks from.
        camera.getWorldDirection(viewDirection);
        clipPlane.normal.copy(viewDirection);
        clipPlane.constant = -THREE.MathUtils.lerp(-1.1, 1.1, settingsRef.current.sectionDepth);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      stage.materials.forEach((m) => m.dispose());
      envMap.dispose();
      renderer.dispose();
      // Free the WebGL context now; browsers only allow a handful at a time.
      renderer.forceContextLoss();
      stageRef.current = null;
    };
  }, []);

  // ── Model: quick room model first, detailed model when it arrives ─────────
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !specimen) return undefined;
    let cancelled = false;
    let showingDetail = false;

    stage.camera.position.copy(HOME);
    stage.controls.target.set(0, 0, 0);
    setHasModel(false);

    const show = (model) => {
      const holder = fitModel(model, 2);
      const materials = applySpecimenMaterials(model, specimen, stage.envMap);
      materials.forEach(tintInnerFaces);
      model.traverse((child) => {
        if (child.isMesh) child.userData.solidMaterial = child.material;
      });

      if (stage.holder) stage.scene.remove(stage.holder);
      stage.materials.forEach((m) => m.dispose());
      stage.holder = holder;
      stage.materials = materials;
      stage.scene.add(holder);
      applyMode(stage, settingsRef.current.mode);
      setHasModel(true);
    };

    loadSpecimenCopy(specimen.model)
      .then((model) => !cancelled && !showingDetail && show(model))
      .catch(() => {});

    if (detail) {
      onDetailLoading && onDetailLoading(true);
      loadSpecimenCopy(specimen.detail)
        .then((model) => {
          if (cancelled) return;
          showingDetail = true;
          show(model);
        })
        .catch(() => {})
        .finally(() => !cancelled && onDetailLoading && onDetailLoading(false));
    }

    return () => {
      cancelled = true;
    };
    // onDetailLoading is a callback from the parent; re-running on its
    // identity would reload the model on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specimen, detail]);

  useEffect(() => {
    if (stageRef.current) applyMode(stageRef.current, mode);
  }, [mode]);

  useEffect(() => {
    if (stageRef.current) stageRef.current.controls.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !resetKey) return;
    stage.camera.position.copy(HOME);
    stage.controls.target.set(0, 0, 0);
  }, [resetKey]);

  return (
    <div className={`lab-viewer ${className}`}>
      <canvas ref={canvasRef} className="lab-viewer-canvas" />
      {!hasModel && <div className="lab-viewer-spinner" aria-hidden="true" />}
    </div>
  );
}

function applyMode(stage, mode) {
  if (!stage.holder) return;
  stage.holder.traverse((child) => {
    if (!child.isMesh) return;
    const solid = child.userData.solidMaterial;
    child.material = mode === "xray" ? xrayMaterial : solid;
  });
  stage.materials.forEach((m) => {
    m.clippingPlanes = mode === "section" ? [stage.clipPlane] : [];
    m.needsUpdate = true;
  });
}
