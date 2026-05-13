import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Cell } from './Cell';

interface Piece {
  position: number;
  player: 'X' | 'O';
  id: string;
}

interface GridProps {
  pieces: Piece[];
  winningLine: number[] | null;
  nextToVanish: { X: string | null; O: string | null };
  onCellPress: (index: number) => void;
  disabled: boolean;
}

export const Grid: React.FC<GridProps> = ({
  pieces,
  winningLine,
  nextToVanish,
  onCellPress,
  disabled,
}) => {
  const { width } = useWindowDimensions();
  const size = width * 0.9;

  return (
    <View style={[styles.grid, { width: size, height: size }]}>
      {Array.from({ length: 9 }).map((_, i) => {
        const piece = pieces.find((p) => p.position === i);
        const isVanishing =
          piece != null &&
          (nextToVanish[piece.player] === piece.id);
        const isWinning = winningLine?.includes(i) ?? false;

        return (
          <Cell
            key={i}
            index={i}
            player={piece?.player ?? null}
            isVanishing={isVanishing}
            isWinning={isWinning}
            onPress={onCellPress}
            disabled={disabled}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
