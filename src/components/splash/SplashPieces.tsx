import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { splashLayout } from '../../utils/splashLayout';

type SplashPiecesProps = {
  xPosX: Animated.Value;
  oPosX: Animated.Value;
  xTrailPosX: Animated.Value;
  oTrailPosX: Animated.Value;
  trailOpacity: Animated.Value;
  chromaticOpacity: Animated.AnimatedInterpolation<number>;
  chromaticRedTranslate: Animated.AnimatedInterpolation<number>;
  chromaticBlueTranslate: Animated.AnimatedInterpolation<number>;
  xoPulse: Animated.Value;
};

export const SplashPieces: React.FC<SplashPiecesProps> = ({
  xPosX,
  oPosX,
  xTrailPosX,
  oTrailPosX,
  trailOpacity,
  chromaticOpacity,
  chromaticRedTranslate,
  chromaticBlueTranslate,
  xoPulse,
}) => (
  <>
    <Animated.View
      style={[
        styles.pieceTrail,
        {
          opacity: trailOpacity,
          transform: [{ translateX: xTrailPosX }],
        },
      ]}
    >
      <LogoPiece kind="x" color={colors.neonCyan} muted />
    </Animated.View>
    <Animated.View
      style={[
        styles.pieceTrail,
        {
          opacity: trailOpacity,
          transform: [{ translateX: oTrailPosX }],
        },
      ]}
    >
      <LogoPiece kind="o" color={colors.neonPink} muted />
    </Animated.View>

    <ChromaticPiece
      kind="x"
      color="#FF1E1E"
      opacity={chromaticOpacity}
      translateX={Animated.add(xPosX, chromaticRedTranslate)}
      scale={xoPulse}
    />
    <ChromaticPiece
      kind="x"
      color="#1E64FF"
      opacity={chromaticOpacity}
      translateX={Animated.add(xPosX, chromaticBlueTranslate)}
      scale={xoPulse}
    />
    <MainPiece kind="x" translateX={xPosX} scale={xoPulse} color={colors.neonCyan} />

    <ChromaticPiece
      kind="o"
      color="#FF1E1E"
      opacity={chromaticOpacity}
      translateX={Animated.add(oPosX, chromaticRedTranslate)}
      scale={xoPulse}
    />
    <ChromaticPiece
      kind="o"
      color="#1E64FF"
      opacity={chromaticOpacity}
      translateX={Animated.add(oPosX, chromaticBlueTranslate)}
      scale={xoPulse}
    />
    <MainPiece kind="o" translateX={oPosX} scale={xoPulse} color={colors.neonPink} />
  </>
);

type PieceKind = 'x' | 'o';

type PieceLayerProps = {
  kind: PieceKind;
  translateX: Animated.Value | Animated.AnimatedAddition<number>;
  scale: Animated.Value;
};

type ChromaticPieceProps = PieceLayerProps & {
  color: string;
  opacity: Animated.AnimatedInterpolation<number>;
};

const ChromaticPiece: React.FC<ChromaticPieceProps> = ({
  kind,
  color,
  opacity,
  translateX,
  scale,
}) => (
  <Animated.View
    style={[
      styles.pieceContainer,
      {
        opacity,
        transform: [{ translateX }, { scale }],
      },
    ]}
  >
    <LogoPiece kind={kind} color={color} flat />
  </Animated.View>
);

const MainPiece: React.FC<PieceLayerProps & { color: string }> = ({
  kind,
  translateX,
  scale,
  color,
}) => (
  <Animated.View
    style={[
      styles.pieceContainer,
      {
        transform: [{ translateX }, { scale }],
      },
    ]}
  >
    <LogoPiece kind={kind} color={color} />
  </Animated.View>
);

type LogoPieceProps = {
  kind: PieceKind;
  color: string;
  flat?: boolean;
  muted?: boolean;
};

const LogoPiece: React.FC<LogoPieceProps> = ({ kind, color, flat = false, muted = false }) => {
  const glowOpacity = muted ? 0.18 : 0.26;
  const midGlowOpacity = muted ? 0.28 : 0.42;
  const mainOpacity = muted ? 0.45 : 1;

  return (
    <Svg width={styles.piece.width} height={styles.piece.height} viewBox="0 0 160 160">
      {!flat && (
        <>
          <PieceShape kind={kind} color={color} width={54} opacity={glowOpacity} />
          <PieceShape kind={kind} color={color} width={42} opacity={midGlowOpacity} />
        </>
      )}
      <PieceShape kind={kind} color={color} width={28} opacity={mainOpacity} />
    </Svg>
  );
};

type PieceShapeProps = {
  kind: PieceKind;
  color: string;
  width: number;
  opacity: number;
};

const PieceShape: React.FC<PieceShapeProps> = ({ kind, color, width, opacity }) => {
  if (kind === 'o') {
    return (
      <Circle
        cx="80"
        cy="80"
        r="54"
        fill="none"
        stroke={color}
        strokeWidth={width}
        opacity={opacity}
      />
    );
  }

  return (
    <G opacity={opacity}>
      <Path d="M28 28L132 132" stroke={color} strokeWidth={width} strokeLinecap="square" />
      <Path d="M132 28L28 132" stroke={color} strokeWidth={width} strokeLinecap="square" />
    </G>
  );
};

const pieceSize = 132;

const styles = StyleSheet.create({
  pieceContainer: {
    position: 'absolute',
    top: splashLayout.centerY - pieceSize / 2,
    left: -pieceSize / 2,
    width: pieceSize,
    height: pieceSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceTrail: {
    position: 'absolute',
    top: splashLayout.centerY - pieceSize / 2,
    left: -pieceSize / 2,
    width: pieceSize,
    height: pieceSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piece: {
    width: pieceSize,
    height: pieceSize,
  },
});
