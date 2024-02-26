import styled from "styled-components";
import { MainCanvas } from "./components/MainCanvas";
function App() {
  return (
    <Wrapper>
      {/* Let's make scroll dancer! */}
      <MainCanvas />
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
