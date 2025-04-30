import { useMemo, useCallback } from "react";

// Import all audio files
import bingoWinSound from "../assets/bingo-win-sound.wav";
import gameStartAudioSrc from "../assets/game-start.mp3";
import drawNumberSound from "../assets/draw-number.mp3";
import matchSound from "../assets/matchSound.mp3";
import wrongBingoSound from "../assets/wrong-bingo.mp3";

/**
 * Custom hook to manage sound effects in the Bingo game
 */
const useBingoSound = (soundEnabledRef) => {
  // Create audio elements
  const audioElements = useMemo(() => ({
    drawNumber: new Audio(drawNumberSound),
    win: new Audio(bingoWinSound),
    match: new Audio(matchSound),
    wrongBingo: new Audio(wrongBingoSound),
    gameStart: new Audio(gameStartAudioSrc)
  }), []);

  /**
   * Plays a sound if sound is enabled
   * @param {string} soundName - The name of the sound to play
   */
  const playSound = useCallback((soundName) => {
    if (soundEnabledRef.current && audioElements[soundName]) {
      audioElements[soundName].currentTime = 0;
      audioElements[soundName].play().catch((error) => {
        console.error(`Error playing ${soundName} sound:`, error);
      });
    }
  }, [audioElements, soundEnabledRef]);

  return {
    playSound
  };
};

export default useBingoSound;