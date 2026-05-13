import { checkWinner, WINNING_LINES } from './checkWinner';
import { MAX_PIECES_PER_PLAYER } from './constants';
import type { CpuDifficulty } from './gameModes';

type Player = 'X' | 'O';

export type AiPiece = {
  position: number;
  player: Player;
  id: string;
};

const BOARD_POSITIONS = Array.from({ length: 9 }, (_, index) => index);
const CORNERS = new Set([0, 2, 6, 8]);
const WIN_SCORE = 100_000;
const HARD_SEARCH_DEPTH = 7;

const getAvailablePositions = (pieces: AiPiece[]): number[] =>
  BOARD_POSITIONS.filter(
    (position) => !pieces.some((piece) => piece.position === position)
  );

const simulatePlacement = (
  pieces: AiPiece[],
  position: number,
  player: Player
): AiPiece[] => {
  const samePlayerPieces = pieces.filter((piece) => piece.player === player);
  const placedPieces = [
    ...pieces,
    {
      id: `sim-${player}-${position}-${pieces.length}`,
      player,
      position,
    },
  ];

  if (checkWinner(placedPieces).winner === player) {
    return placedPieces;
  }

  if (samePlayerPieces.length < MAX_PIECES_PER_PLAYER) {
    return placedPieces;
  }

  const oldestId = samePlayerPieces[0].id;
  return placedPieces.filter((piece) => piece.id !== oldestId);
};

const getWinningMove = (
  pieces: AiPiece[],
  player: Player
): number | null => {
  for (const position of getAvailablePositions(pieces)) {
    const result = checkWinner(simulatePlacement(pieces, position, player));
    if (result.winner === player) {
      return position;
    }
  }

  return null;
};

const getWinningMoves = (
  pieces: AiPiece[],
  player: Player
): number[] =>
  getAvailablePositions(pieces).filter((position) => {
    const result = checkWinner(simulatePlacement(pieces, position, player));
    return result.winner === player;
  });

const pickRandom = (positions: number[]): number | null => {
  if (positions.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * positions.length);
  return positions[randomIndex] ?? null;
};

const scoreLineControl = (
  pieces: AiPiece[],
  cpuPlayer: Player,
  humanPlayer: Player
): number =>
  WINNING_LINES.reduce((score, line) => {
    const linePieces = line
      .map((position) => pieces.find((piece) => piece.position === position))
      .filter((piece): piece is AiPiece => piece != null);

    const cpuCount = linePieces.filter(
      (piece) => piece.player === cpuPlayer
    ).length;
    const humanCount = linePieces.filter(
      (piece) => piece.player === humanPlayer
    ).length;

    if (cpuCount > 0 && humanCount > 0) {
      return score;
    }

    if (cpuCount === 2) {
      return score + 18;
    }

    if (cpuCount === 1) {
      return score + 6;
    }

    if (humanCount === 2) {
      return score - 14;
    }

    if (humanCount === 1) {
      return score - 4;
    }

    return score + 1;
  }, 0);

const scoreBoardPosition = (
  pieces: AiPiece[],
  cpuPlayer: Player,
  humanPlayer: Player
): number => {
  const cpuCenter = pieces.some(
    (piece) => piece.player === cpuPlayer && piece.position === 4
  );
  const humanCenter = pieces.some(
    (piece) => piece.player === humanPlayer && piece.position === 4
  );
  const cpuCorners = pieces.filter(
    (piece) => piece.player === cpuPlayer && CORNERS.has(piece.position)
  ).length;
  const humanCorners = pieces.filter(
    (piece) => piece.player === humanPlayer && CORNERS.has(piece.position)
  ).length;

  return (
    (cpuCenter ? 10 : 0) -
    (humanCenter ? 8 : 0) +
    cpuCorners * 4 -
    humanCorners * 3
  );
};

const evaluateState = (
  pieces: AiPiece[],
  cpuPlayer: Player,
  humanPlayer: Player
): number => {
  const result = checkWinner(pieces);

  if (result.winner === cpuPlayer) {
    return WIN_SCORE;
  }

  if (result.winner === humanPlayer) {
    return -WIN_SCORE;
  }

  const cpuWinningMoves = getWinningMoves(pieces, cpuPlayer).length;
  const humanWinningMoves = getWinningMoves(pieces, humanPlayer).length;

  return (
    scoreLineControl(pieces, cpuPlayer, humanPlayer) +
    scoreBoardPosition(pieces, cpuPlayer, humanPlayer) +
    cpuWinningMoves * 150 -
    humanWinningMoves * 180
  );
};

const createStateKey = (
  pieces: AiPiece[],
  currentPlayer: Player,
  depth: number
): string => {
  const orderedPieces = pieces
    .map((piece) => `${piece.player}:${piece.position}:${piece.id}`)
    .join('|');

  return `${currentPlayer}:${depth}:${orderedPieces}`;
};

const minimax = (
  pieces: AiPiece[],
  currentPlayer: Player,
  depth: number,
  alpha: number,
  beta: number,
  cpuPlayer: Player,
  humanPlayer: Player,
  memo: Map<string, number>
): number => {
  const evaluation = evaluateState(pieces, cpuPlayer, humanPlayer);
  const result = checkWinner(pieces);

  if (depth === 0 || result.winner != null) {
    return evaluation;
  }

  const availablePositions = getAvailablePositions(pieces);

  if (availablePositions.length === 0) {
    return evaluation;
  }

  const stateKey = createStateKey(pieces, currentPlayer, depth);
  const cached = memo.get(stateKey);

  if (cached != null) {
    return cached;
  }

  if (currentPlayer === cpuPlayer) {
    let bestScore = -Infinity;

    for (const position of availablePositions) {
      const nextPieces = simulatePlacement(pieces, position, currentPlayer);
      const score = minimax(
        nextPieces,
        humanPlayer,
        depth - 1,
        alpha,
        beta,
        cpuPlayer,
        humanPlayer,
        memo
      );
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        break;
      }
    }

    memo.set(stateKey, bestScore);
    return bestScore;
  }

  let bestScore = Infinity;

  for (const position of availablePositions) {
    const nextPieces = simulatePlacement(pieces, position, currentPlayer);
    const score = minimax(
      nextPieces,
      cpuPlayer,
      depth - 1,
      alpha,
      beta,
      cpuPlayer,
      humanPlayer,
      memo
    );
    bestScore = Math.min(bestScore, score);
    beta = Math.min(beta, bestScore);

    if (beta <= alpha) {
      break;
    }
  }

  memo.set(stateKey, bestScore);
  return bestScore;
};

const chooseHardMove = (
  pieces: AiPiece[],
  cpuPlayer: Player,
  humanPlayer: Player
): number | null => {
  const availablePositions = getAvailablePositions(pieces);

  if (availablePositions.length === 0) {
    return null;
  }

  const memo = new Map<string, number>();
  const scoredMoves = availablePositions.map((position) => {
    const nextPieces = simulatePlacement(pieces, position, cpuPlayer);
    const immediateResult = checkWinner(nextPieces);

    if (immediateResult.winner === cpuPlayer) {
      return { position, score: WIN_SCORE };
    }

    return {
      position,
      score: minimax(
        nextPieces,
        humanPlayer,
        HARD_SEARCH_DEPTH - 1,
        -Infinity,
        Infinity,
        cpuPlayer,
        humanPlayer,
        memo
      ),
    };
  });

  const bestScore = Math.max(...scoredMoves.map((move) => move.score));
  const bestMoves = scoredMoves
    .filter((move) => move.score === bestScore)
    .map((move) => move.position);

  return pickRandom(bestMoves);
};

const chooseMediumMove = (
  pieces: AiPiece[],
  blockingMove: number | null,
  cpuPlayer: Player,
  humanPlayer: Player
): number | null => {
  if (blockingMove != null) {
    return blockingMove;
  }

  const availablePositions = getAvailablePositions(pieces);

  if (availablePositions.length === 0) {
    return null;
  }

  const scoredMoves = availablePositions.map((position) => {
    const nextPieces = simulatePlacement(pieces, position, cpuPlayer);
    const score =
      scoreLineControl(nextPieces, cpuPlayer, humanPlayer) +
      scoreBoardPosition(nextPieces, cpuPlayer, humanPlayer) -
      getWinningMoves(nextPieces, humanPlayer).length * 80;

    return { position, score };
  });

  const orderedMoves = [...scoredMoves].sort((a, b) => b.score - a.score);
  const candidateMoves =
    Math.random() < 0.85 ? orderedMoves.slice(0, 1) : orderedMoves.slice(0, 2);

  return pickRandom(candidateMoves.map((move) => move.position));
};

export const chooseCpuMove = (
  pieces: AiPiece[],
  difficulty: CpuDifficulty,
  cpuPlayer: Player = 'O',
  humanPlayer: Player = 'X'
): number | null => {
  const winningMove = getWinningMove(pieces, cpuPlayer);
  const blockingMove = getWinningMove(pieces, humanPlayer);

  if (difficulty === 'easy') {
    if (winningMove != null && Math.random() < 0.2) {
      return winningMove;
    }

    return pickRandom(getAvailablePositions(pieces));
  }

  if (winningMove != null) {
    return winningMove;
  }

  if (
    difficulty === 'hard' &&
    blockingMove != null
  ) {
    return blockingMove;
  }

  if (difficulty === 'medium') {
    return chooseMediumMove(
      pieces,
      blockingMove,
      cpuPlayer,
      humanPlayer
    );
  }

  return chooseHardMove(pieces, cpuPlayer, humanPlayer);
};
