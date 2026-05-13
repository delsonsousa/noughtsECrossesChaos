type Piece = { position: number; player: 'X' | 'O'; id: string };

export const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const checkWinner = (
  pieces: Piece[]
): { winner: 'X' | 'O' | null; line: number[] | null } => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const pA = pieces.find((p) => p.position === a);
    const pB = pieces.find((p) => p.position === b);
    const pC = pieces.find((p) => p.position === c);
    if (
      pA && pB && pC &&
      pA.player === pB.player &&
      pA.player === pC.player
    ) {
      return { winner: pA.player, line };
    }
  }
  return { winner: null, line: null };
};
