import { useRecoilState } from "recoil";
import { IsEnteredAtom } from "../store";
import { Html, useProgress } from "@react-three/drei";
import styled, { keyframes } from "styled-components";

export const Loader = ({ isCompleted }) => {
  const [isEntered, setIsEntered] = useRecoilState(IsEnteredAtom);
  const progress = useProgress();

  console.log("progress", progress);

  if (isEntered) return null;

  return (
    <Html center>
      <BluredBackground />
      <Container>
        <ProgressBar>{isCompleted ? 100 : progress.progress}%</ProgressBar>
        <EnterBtn
          onClick={() => {
            setIsEntered(true);
          }}
        >
          Enter
        </EnterBtn>
      </Container>
    </Html>
  );
};

const blink = keyframes`
0% {
  opacity : 1
}
50% {
  opacity : 0
}
100% {
  opacity : 1;
}
`;

const BluredBackground = styled.div`
  width: 400px;
  height: 400px;
  background-color: red;
  border-radius: 50%;
  filter: blur(300px);
`;
const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -50%);
  justify-content: flex-start;
  align-items: center;
  top: 50%;
  left: 50%;
  gap: 20px;
`;
const ProgressBar = styled.div`
  font-size: 20px;
  color: #ccc;
`;
const EnterBtn = styled.button`
  animation: ${blink} 1.5s infinite;
  translition-duration: 0.4s;
  font-size: 16px;
  outline: none;
  padding: 8px 18px;
  background-color: transparent;
  color: #ccc;
  border: 0.5px solid #999;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
    color: #dc4f00;
  }
`;
