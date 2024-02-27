import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { IsEnteredAtom } from "../store";
import { Loader } from "./Loader";
import gsap from "gsap";

let timeline;

export const Dancer = () => {
  const three = useThree();
  const isEntered = useRecoilValue(IsEnteredAtom);
  const dancerRef = useRef(null);

  const { scene, animations } = useGLTF("/models/dancer.glb");
  const { actions } = useAnimations(animations, dancerRef);

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
      <ambientLight intensity={2} />
      <primitive ref={dancerRef} object={scene} scale={0.05} />
      {/* 원어 */}
    </>
  );
};
