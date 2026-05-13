import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Piece } from './Piece';

interface CellProps {
  index: number;
  player: 'X' | 'O' | null;
  isVanishing: boolean;
  isWinning: boolean;
  onPress: (index: number) => void;
  disabled: boolean;
}

export const Cell: React.FC<CellProps> = ({
  index,
  player,
  isVanishing,
  isWinning,
  onPress,
  disabled,
}) => {
  const isRightEdge = index % 3 !== 2;
  const isBottomEdge = index < 6;

  return (
    <Pressable
      onPress={() => onPress(index)}
      disabled={disabled || player !== null}
      accessibilityRole="button"
      style={styles.touchTarget}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.cell,
            isRightEdge && styles.borderRight,
            isBottomEdge && styles.borderBottom,
            pressed && !player && styles.pressed,
          ]}
        >
          <View style={styles.content}>
            {player && (
              <Piece
                player={player}
                isVanishing={isVanishing}
                isWinning={isWinning}
              />
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  touchTarget: {
    width: '33.33%',
    aspectRatio: 1,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  borderRight: {
    borderRightWidth: 2,
    borderRightColor: colors.textMuted,
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: colors.textMuted,
  },
  pressed: {
    backgroundColor: '#333333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
