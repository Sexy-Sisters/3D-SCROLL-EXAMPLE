import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { IsEnteredAtom } from "../store";
import { Loader } from "./Loader";
import gsap from "gsap";

export const Dancer = () => {
  const three = useThree();
  const isEntered = useRecoilValue(IsEnteredAtom);
  const dancerRef = useRef(null);

  const { scene, animations } = useGLTF("/models/dancer.glb");
  const { actions } = useAnimations(animations, dancerRef);

  const scroll = useScroll();
  useFrame(() => {
    console.log(scroll.offset);
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
        duration: 3.5, //속도
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

  if (!isEntered) {
    return <Loader isCompleted />;
  }

  return (
    <>
      <ambientLight intensity={2} />
      <primitive ref={dancerRef} object={scene} scale={0.05} />
      {/* 원어 */}
    </>
  );
};
