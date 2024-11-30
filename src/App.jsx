import { useState } from "react";
import TopBar from "./TopBar";
import ImagesContainer from "./ImagesContainer";
import { GameContext } from "./GameContext";
import useSound from "use-sound";
function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [play, { stop, isPlaying }] = useSound("/audio/sound.mp3", {
    volume: 0.1,
    loop: true,
    autoplay: true,
  });
  return (
    <>
      <div>
        <GameContext.Provider
          value={{
            score: [score, setScore],
            highScore: [highScore, setHighScore],
          }}
        >
          <TopBar />
          <div className="mt-[120px]" id="imgContainer">
            <ImagesContainer />
          </div>
        </GameContext.Provider>
      </div>
    </>
  );
}

export default App;
