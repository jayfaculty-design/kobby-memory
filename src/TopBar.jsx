import React, { createContext, useContext } from "react";
import { GameContext } from "./GameContext";

function TopBar() {
  const { score, highScore } = useContext(GameContext);
  const [scoreValue, setScoreValue] = score;
  const [highScoreValue, setHighScoreValue] = highScore;
  return (
    <div id="topContainer" className="">
      <div>
        <h1 className="text-[30px] font-bold">KOBBY MEMORY CARD</h1>
        <p className="italic text-yellow-400">
          Get Points by clicking characters but do not click a character twice
        </p>
      </div>

      <div>
        <h1 className="text-yellow-200">Score: {scoreValue}</h1>
        <h1 className="text-yellow-400">High Score: {highScoreValue}</h1>
      </div>
    </div>
  );
}

export default TopBar;
