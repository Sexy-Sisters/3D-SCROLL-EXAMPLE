import {
  Box,
  Circle,
  Points,
  useAnimations,
  useGLTF,
  useScroll,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { IsEnteredAtom } from "../store";
import { Loader } from "./Loader";
import gsap from "gsap";
import * as THREE from "three";

let timeline;

export const Dancer = () => {
  const three = useThree();
  const isEntered = useRecoilValue(IsEnteredAtom);
  const dancerRef = useRef(null);

  const { scene, animations } = useGLTF("/models/dancer.glb");
  const { actions } = useAnimations(animations, dancerRef);

  const texture = useTexture("/texture/threejs.webp");

  const { positions } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count + 3);
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 25;
    }
    return { positions };
  }, []);

  const scroll = useScroll();
  useFrame(() => {
    if (!isEntered) return;
    // console.log(scroll.offset, timeline.duration());
    timeline.seek(scroll.offset * timeline.duration());
  });

  useEffect(() => {
    if (!isEntered) return;
    actions["wave"].play();
  }, [actions, isEntered]);

  useEffect(() => {
    if (!isEntered) return;
    if (!dancerRef.current) return;
    gsap.fromTo(
      three.camera.position,
      {
        x: -5,
        y: 5,
        z: 5,
      },
      {
        x: 0,
        y: 6,
        z: 12,
        duration: 2.5, //속도
      }
    );

    //카메라 엥글 변경
    gsap.fromTo(
      three.camera.rotation,
      { z: Math.PI },
      {
        duration: 2.5,
        z: 0,
      }
    );
  }, [isEntered, three.camera.position]);

  useEffect(() => {
    if (!isEntered) return;
    if (!dancerRef.current) return;
    timeline = gsap.timeline();
    timeline
      .from(
        dancerRef.current.rotation,
        {
          duration: 4,
          y: -4 * Math.PI,
        },
        0.5
      )
      .from(
        dancerRef.current.position,
        {
          duration: 4,
          x: 3,
        },
        "<"
      )
      .to(
        three.camera.position,
        {
          duration: 10,
          x: 2,
          z: 8,
        },
        "<"
      )
      .to(three.camera.position, {
        duration: 10,
        x: 0,
        z: 6,
      })
      .to(three.camera.position, {
        duration: 10,
        x: 0,
        z: 16,
      });
  }, [isEntered]);

  if (!isEntered) {
    return <Loader isCompleted />;
  }

  return (
    <>
      <primitive ref={dancerRef} object={scene} scale={0.05} />
      {/* 원어 */}
      <ambientLight intensity={2} />
      <pointLight
        position={[0, 10, 0]}
        intensity={45}
        castShadow
        receiveShadow
      />
      <hemisphereLight
        position={[0, 5, 0]}
        intensity={0}
        groundColor={"lime"}
        color={"blue"}
      />
      <Box position={[0, 0, 0]} args={[100, 100, 100]}>
        <meshStandardMaterial color={"#DC4F00"} side={THREE.DoubleSide} />
      </Box>
      <Circle
        castShadow
        receiveShadow
        args={[8, 32]}
        rotation-x={-Math.PI / 2}
        position-y={-4.4}
      >
        <meshStandardMaterial color={"#DC4F00"} side={THREE.DoubleSide} />
      </Circle>
      <Points positions={positions.slice(0, positions.length / 3)}>
        <pointsMaterial
          size={0.5}
          color={new THREE.Color("#DC4F00")}
          sizeAttenuation
          depthWrite
          alphaMap={texture}
          transparent
          alphaTest={0.001}
        />
      </Points>
      <Points
        positions={positions.slice(
          positions.length / 3,
          (positions.length * 2) / 3
        )}
      >
        <pointsMaterial
          size={0.5}
          color={new THREE.Color("#DC4F00")}
          sizeAttenuation
          depthWrite
          alphaMap={texture}
          transparent
          alphaTest={0.001}
        />
      </Points>
      <Points positions={positions.slice((positions.length * 2) / 3)}>
        <pointsMaterial
          size={0.5}
          color={new THREE.Color("#DC4F00")}
          sizeAttenuation
          depthWrite
          alphaMap={texture}
          transparent
          alphaTest={0.001}
        />
      </Points>
    </>
  );
};
