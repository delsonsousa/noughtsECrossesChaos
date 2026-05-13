import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Animated,
  Modal,
  StatusBar,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { Grid } from '../components/Grid';
import { Button } from '../components/Button';
import { AdBanner } from '../components/AdBanner';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSound } from '../hooks/useSound';
import { useGameContext } from '../store/GameContext';
import { maybeShowGameStartInterstitial } from '../utils/ads';
import { chooseCpuMove } from '../utils/ai';
import type { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

const CELEBRATION_PARTICLES = [
  { color: '#FFEB3B', x: -112, y: -82, rotate: '-34deg', size: 12 },
  { color: colors.playerX, x: -78, y: -112, rotate: '26deg', size: 10 },
  { color: colors.playerO, x: -36, y: -126, rotate: '-20deg', size: 11 },
  { color: '#76FF03', x: 12, y: -132, rotate: '18deg', size: 12 },
  { color: '#E040FB', x: 54, y: -118, rotate: '38deg', size: 10 },
  { color: colors.playerX, x: 94, y: -92, rotate: '-28deg', size: 11 },
] as const;

export const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { hapticsEnabled, recordWin } = useGameContext();
  const { playPop, playWin } = useSound();
  const { pieces, currentPlayer, winner, winningLine, nextToVanish, placePiece, resetGame } =
    useGameLogic();

  const recordedWinnerRef = useRef<'X' | 'O' | null>(null);
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const [showWinModal, setShowWinModal] = useState(false);
  const [matchScores, setMatchScores] = useState({ X: 0, O: 0 });
  const { mode, difficulty = 'easy' } = route.params;
  const isCpuTurn = mode === 'cpu' && currentPlayer === 'O' && !winner;

  const scheduleGameStartInterstitial = useCallback(() => {
    const timer = setTimeout(() => {
      void maybeShowGameStartInterstitial();
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const handleRoundWin = useCallback(
    (roundWinner: 'X' | 'O') => {
      if (recordedWinnerRef.current === roundWinner) {
        return;
      }

      recordedWinnerRef.current = roundWinner;
      playWin();
      if (hapticsEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setMatchScores((prev) => ({
        ...prev,
        [roundWinner]: prev[roundWinner] + 1,
      }));
      recordWin(roundWinner, mode);
      confettiAnim.setValue(0);
      celebrationAnim.setValue(0);
      Animated.parallel([
        Animated.spring(confettiAnim, {
          toValue: 1,
          tension: 44,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
      ]).start();
      setShowWinModal(true);
    },
    [celebrationAnim, confettiAnim, hapticsEnabled, mode, playWin, recordWin]
  );

  useEffect(
    () => scheduleGameStartInterstitial(),
    [scheduleGameStartInterstitial]
  );

  const handleCellPress = useCallback(
    (index: number) => {
      if (isCpuTurn) {
        return;
      }

      playPop();
      if (hapticsEnabled) Haptics.selectionAsync();
      const roundWinner = placePiece(index);
      if (roundWinner) {
        handleRoundWin(roundWinner);
      }
    },
    [handleRoundWin, hapticsEnabled, isCpuTurn, placePiece, playPop]
  );

  useEffect(() => {
    if (!isCpuTurn) {
      return;
    }

    const cpuMoveTimer = setTimeout(() => {
      const position = chooseCpuMove(pieces, difficulty);

      if (position == null) {
        return;
      }

      playPop();
      const roundWinner = placePiece(position);
      if (roundWinner) {
        handleRoundWin(roundWinner);
      }
    }, 450);

    return () => clearTimeout(cpuMoveTimer);
  }, [difficulty, handleRoundWin, isCpuTurn, pieces, placePiece, playPop]);

  const handlePlayAgain = () => {
    setShowWinModal(false);
    confettiAnim.setValue(0);
    celebrationAnim.setValue(0);
    recordedWinnerRef.current = null;
    resetGame();
    scheduleGameStartInterstitial();
  };

  const handleReset = () => {
    setShowWinModal(false);
    confettiAnim.setValue(0);
    celebrationAnim.setValue(0);
    recordedWinnerRef.current = null;
    resetGame();
    scheduleGameStartInterstitial();
  };

  const handleMenu = () => {
    setShowWinModal(false);
    confettiAnim.setValue(0);
    celebrationAnim.setValue(0);
    recordedWinnerRef.current = null;
    resetGame();
    navigation.goBack();
  };

  const playerColor =
    currentPlayer === 'X' ? colors.playerX : colors.playerO;
  const leftScoreLabel =
    mode === 'cpu' ? t('game.player') : t('game.player1');
  const rightScoreLabel =
    mode === 'cpu' ? t('game.ai') : t('game.player2');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleMenu} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>{t('game.menu')}</Text>
        </Pressable>
        <View style={styles.headerScoreRow}>
          <Text style={[styles.headerScore, { color: colors.playerX }]}>
            {leftScoreLabel}
          </Text>
          <Text style={styles.headerScoreValue}>
            {matchScores.X}
          </Text>
          <Text style={styles.headerScoreSep}>-</Text>
          <Text style={styles.headerScoreValue}>
            {matchScores.O}
          </Text>
          <Text style={[styles.headerScore, { color: colors.playerO }]}>
            {rightScoreLabel}
          </Text>
        </View>
        <Pressable
          onPress={handleReset}
          style={styles.headerBtn}
        >
          <Text style={styles.headerBtnText}>{t('game.reset')}</Text>
        </Pressable>
      </View>

      {/* Turn indicator */}
      <View style={styles.turnRow}>
        <View style={[styles.turnDot, { backgroundColor: playerColor }]} />
        <Text style={[styles.turnText, { color: playerColor }]}>
          {t('game.turn', { player: currentPlayer })}
        </Text>
      </View>

      {/* Board */}
      <View style={styles.boardWrap}>
        <Grid
          pieces={pieces}
          winningLine={winningLine}
          nextToVanish={nextToVanish}
          onCellPress={handleCellPress}
          disabled={!!winner || isCpuTurn}
        />
      </View>

      <AdBanner />

      {/* Win Modal */}
      <Modal
        visible={showWinModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              {
                opacity: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.72, 1],
                }),
                transform: [
                  {
                    scale: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.celebrationStage}>
              {CELEBRATION_PARTICLES.map((particle, index) => (
                <Animated.View
                  key={`${particle.color}-${particle.x}-${index}`}
                  style={[
                    styles.celebrationParticle,
                    {
                      width: particle.size,
                      height: particle.size,
                      borderRadius: particle.size / 2,
                      backgroundColor: particle.color,
                      opacity: celebrationAnim.interpolate({
                        inputRange: [0, 0.16, 0.78, 1],
                        outputRange: [0, 1, 0.96, 0],
                      }),
                      transform: [
                        {
                          translateX: celebrationAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, particle.x],
                          }),
                        },
                        {
                          translateY: celebrationAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [12, particle.y],
                          }),
                        },
                        {
                          scale: celebrationAnim.interpolate({
                            inputRange: [0, 0.24, 1],
                            outputRange: [0.3, 1.15, 0.72],
                          }),
                        },
                        { rotate: particle.rotate },
                      ],
                    },
                  ]}
                />
              ))}

              <Animated.Text
                style={[
                  styles.celebrationGlyph,
                  {
                    color: winner === 'X' ? colors.playerX : colors.playerO,
                    opacity: celebrationAnim.interpolate({
                      inputRange: [0, 0.18, 1],
                      outputRange: [0, 1, 1],
                    }),
                    transform: [
                      {
                        scale: celebrationAnim.interpolate({
                          inputRange: [0, 0.4, 1],
                          outputRange: [0.4, 1.18, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {winner}
              </Animated.Text>
            </View>

            <Text style={styles.winText}>
              {t('game.wins', { player: winner })}
            </Text>

            <View style={styles.modalActions}>
              <Button
                label={t('game.playAgain')}
                onPress={handlePlayAgain}
              />
              <Button
                label={t('game.menu')}
                onPress={handleMenu}
                variant="secondary"
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    padding: 8,
    minWidth: 60,
  },
  headerBtnText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  headerScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerScore: {
    fontSize: 18,
    fontWeight: '900',
  },
  headerScoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMuted,
  },
  headerScoreSep: {
    color: colors.textMuted,
    fontSize: 14,
  },
  turnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  turnDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  turnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  boardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '86%',
    alignItems: 'center',
    gap: 18,
  },
  celebrationStage: {
    width: 220,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationParticle: {
    position: 'absolute',
  },
  celebrationGlyph: {
    fontSize: 34,
    fontWeight: '900',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
    textShadowColor: colors.text,
  },
  winText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  modalActions: {
    gap: 10,
    width: '100%',
  },
});
