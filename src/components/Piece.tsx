import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { colors } from '../theme/colors';

interface PieceProps {
  player: 'X' | 'O';
  isVanishing: boolean;
  isWinning: boolean;
}

export const Piece: React.FC<PieceProps> = ({
  player,
  isVanishing,
  isWinning,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 80,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  useEffect(() => {
    if (isVanishing) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(blink, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(blink, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      blink.setValue(1);
    }
  }, [blink, isVanishing]);

  const color = player === 'X' ? colors.playerX : colors.playerO;

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        opacity: isVanishing ? blink : 1,
      }}
    >
      <Text
        style={{
          fontSize: 38,
          fontWeight: '900',
          color,
          textShadowColor: color,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: isWinning ? 12 : 0,
        }}
      >
        {player}
      </Text>
    </Animated.View>
  );
};
