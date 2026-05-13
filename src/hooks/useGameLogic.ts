import { useState, useCallback } from 'react';
import { checkWinner } from '../utils/checkWinner';
import { MAX_PIECES_PER_PLAYER } from '../utils/constants';

type Player = 'X' | 'O';

interface Piece {
  position: number;
  player: Player;
  id: string;
}

interface NextToVanish {
  X: string | null;
  O: string | null;
}

interface GameLogic {
  pieces: Piece[];
  currentPlayer: Player;
  winner: Player | null;
  winningLine: number[] | null;
  nextToVanish: NextToVanish;
  placePiece: (position: number) => Player | null;
  resetGame: () => void;
}

let pieceCounter = 0;

const getNextToVanish = (
  pieces: Piece[],
  currentPlayer: Player
): NextToVanish => {
  const playerPieces = pieces.filter((p) => p.player === currentPlayer);
  const oldestId =
    playerPieces.length >= MAX_PIECES_PER_PLAYER ? playerPieces[0].id : null;

  return {
    X: currentPlayer === 'X' ? oldestId : null,
    O: currentPlayer === 'O' ? oldestId : null,
  };
};

export const useGameLogic = (): GameLogic => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const nextToVanish = getNextToVanish(pieces, currentPlayer);

  const placePiece = useCallback(
    (position: number) => {
      if (winner) return null;
      if (pieces.some((p) => p.position === position)) return null;

      pieceCounter += 1;
      const newPiece: Piece = {
        position,
        player: currentPlayer,
        id: `${currentPlayer}-${pieceCounter}`,
      };

      const playerPieces = pieces.filter((p) => p.player === currentPlayer);
      const placedPieces = [...pieces, newPiece];
      const immediateWin = checkWinner(placedPieces);

      if (immediateWin.winner) {
        setPieces(placedPieces);
        setWinner(immediateWin.winner);
        setWinningLine(immediateWin.line);
        return immediateWin.winner;
      }

      let next = placedPieces;

      if (playerPieces.length >= MAX_PIECES_PER_PLAYER) {
        const oldestId = playerPieces[0].id;
        next = next.filter((p) => p.id !== oldestId);
      }

      const { winner: nextWinner, line } = checkWinner(next);
      setPieces(next);

      if (nextWinner) {
        setWinner(nextWinner);
        setWinningLine(line);
        return nextWinner;
      }

      setCurrentPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
      return null;
    },
    [pieces, currentPlayer, winner]
  );

  const resetGame = useCallback(() => {
    setPieces([]);
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
  }, []);

  return {
    pieces,
    currentPlayer,
    winner,
    winningLine,
    nextToVanish,
    placePiece,
    resetGame,
  };
};
