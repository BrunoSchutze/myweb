import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  ContactShadows,
  Bounds,
  Center,
  useAnimations,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const AVATAR_URL =
  "https://models.readyplayer.me/690e9173602baf51af29da4a.glb";

function AvatarModel() {
  const group = useRef();
  const { scene, animations } = useGLTF(AVATAR_URL);
  const { actions, names } = useAnimations(animations, scene);

  // ===== 1) Si el modelo trae animaciones, reproducimos la primera =====
  useEffect(() => {
    const first = names?.[0];
    if (first && actions[first]) {
      actions[first].reset().fadeIn(0.3).play();
      return () => actions[first]?.fadeOut(0.2);
    }
  }, [actions, names]);

  // ===== 2) Fallback: idle procedural (cabeza y brazos) =====
  // Busco bones por nombre (RPM usa esqueleto tipo Mixamo: "Hips", "Spine", "Head", "LeftArm", "RightArm", etc.)
  const bones = useMemo(() => {
    const out = { head: null, lArm: null, rArm: null, spine: null };
    scene.traverse((o) => {
      if (o.isBone) {
        const n = o.name.toLowerCase();
        if (n.includes("head")) out.head = o;
        else if (n.includes("leftarm")) out.lArm = o;
        else if (n.includes("rightarm")) out.rArm = o;
        else if (n.includes("spine") || n.includes("chest")) out.spine = o;
      }
    });
    return out;
  }, [scene]);

  useFrame((state) => {
    // Si NO hay clip activo, hago idle procedural
    const anyPlaying = Object.values(actions || {}).some(
      (a) => a?.isRunning() || a?.isScheduled()
    );
    if (!anyPlaying) {
      const t = state.clock.getElapsedTime();
      if (bones.head) {
        bones.head.rotation.z = Math.sin(t * 0.8) * 0.05;
        bones.head.rotation.y = Math.sin(t * 0.6) * 0.08;
      }
      if (bones.spine) {
        bones.spine.rotation.x = Math.sin(t * 0.5) * 0.03;
      }
      if (bones.lArm) {
        bones.lArm.rotation.z = -0.2 + Math.sin(t * 1.2) * 0.06;
      }
      if (bones.rArm) {
        bones.rArm.rotation.z = 0.2 + Math.sin(t * 1.2 + Math.PI) * 0.06;
      }
    }

    // Giro idle suave (si querés, comentá esta línea)
    if (group.current) group.current.rotation.y += 0.0015;
  });

  // Escala general menor para que jamáaaas se corte
  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export default function Memoji3D() {
  return (
    <div className="memoji3d">
      <Canvas
        shadows
        dpr={[1, 2]}
        // Cámara más lejana + FOV un toque más abierto
        camera={{ position: [0, 1.2, 6.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Encadre automático: asegura que se vea COMPLETO, sin cortar */}
          <Bounds fit clip observe margin={1.15}>
            <Center top>
              <AvatarModel />
            </Center>
          </Bounds>

          {/* Luces / entorno */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 6, 6]} intensity={1.3} castShadow />
          <Environment preset="studio" />

          {/* Sombra bajo el avatar */}
          <ContactShadows
            position={[0, -1.5, 0]}
            scale={8}
            blur={2.8}
            opacity={0.35}
            far={6}
          />

          {/* Controles: sigue siendo 360°, sin zoom para no romper el layout */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            // el target lo ajusta Bounds, igual lo dejamos neutro
            target={[0, 1, 0]}
            minPolarAngle={Math.PI / 2 - 0.5}
            maxPolarAngle={Math.PI / 2 + 0.4}
            rotateSpeed={0.9}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
