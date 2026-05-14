import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import type { RootStackParamList } from '../../App';
import { AdBanner } from '../components/AdBanner';
import { HomeAtmosphere } from '../components/HomeAtmosphere';
import { Logo } from '../components/Logo';
import { useFeedback } from '../hooks/useFeedback';
import { useGameContext } from '../store/GameContext';
import { colors } from '../theme/colors';

export const HomeScreen = () => {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { action: playActionFeedback, move: playMoveFeedback } = useFeedback();
  const { scoreboards, scoreboardsResetAt, todayMatches } = useGameContext();
  const seasonStartDate = new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(scoreboardsResetAt));
  const totalMatches =
    scoreboards.local.X +
    scoreboards.local.O +
    scoreboards.cpu.X +
    scoreboards.cpu.O;
  const playerWins = scoreboards.local.X + scoreboards.cpu.X;
  const winRate =
    totalMatches > 0 ? Math.round((playerWins / totalMatches) * 100) : 0;

  return (
    <LinearGradient
      colors={[colors.backgroundTop, colors.backgroundMid, colors.background]}
      style={{ flex: 1 }}
    >
      <HomeAtmosphere />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={() => {
              playActionFeedback();
              nav.navigate('Settings');
            }}
            style={({ pressed }) => ({
              width: 70,
              height: 70,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: pressed ? colors.neonCyan : colors.neonPurple + '66',
              backgroundColor: colors.surface + '99',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: pressed ? colors.neonCyan : colors.neonPurple,
              shadowOpacity: pressed ? 0.6 : 0.2,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 0 },
            })}
          >
            <Text style={{ fontSize: 34, color: colors.textMuted }}>{'⚙︎'}</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Logo size={100} />
          <Text
            style={{
              fontSize: 36,
              fontFamily: 'Bungee_400Regular',
              color: colors.text,
              letterSpacing: 2,
              marginTop: 16,
              textShadowColor: colors.neonPink,
              textShadowRadius: 12,
            }}
          >
            CHAOS
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SpaceGrotesk_500Medium',
              color: colors.neonCyan,
              letterSpacing: 4,
              marginTop: 4,
            }}
          >
            NOUGHTS × CROSSES
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SpaceGrotesk_500Medium',
              color: colors.textMuted,
              marginTop: 12,
              fontStyle: 'italic',
            }}
          >
            {t('home.tagline')}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginTop: 18,
            paddingBottom: 18,
          }}
        >
          <NeonButton
            label={t('home.playLocal')}
            icon={'⚔︎'}
            color={colors.neonCyan}
            onPress={() => {
              playActionFeedback();
              nav.navigate('Game', { mode: 'local' });
            }}
            large
          />

          {/* VS IA CARD */}
          <View
            style={{
              marginTop: 18,
              borderRadius: 16,
              backgroundColor: colors.surface + 'CC',
              borderWidth: 1,
              borderColor: colors.neonPurple + '4D',
              overflow: 'hidden',
              shadowColor: colors.neonPurple,
              shadowOpacity: 0.28,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 0 },
            }}
          >
            <LinearGradient
              colors={['transparent', colors.neonPurple, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 1 }}
            />
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 20,
                paddingBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.neonPurple,
                    fontSize: 10,
                    opacity: 0.6,
                    letterSpacing: 1,
                  }}
                >
                  ▰▰
                </Text>
                <Text
                  style={{
                    fontFamily: 'Bungee_400Regular',
                    fontSize: 13,
                    color: colors.text,
                    letterSpacing: 3,
                  }}
                >
                  {t('home.vsComputer')}
                </Text>
                <Text
                  style={{
                    color: colors.neonPurple,
                    fontSize: 10,
                    opacity: 0.6,
                    letterSpacing: 1,
                  }}
                >
                  ▰▰
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'SpaceGrotesk_500Medium',
                  fontSize: 12,
                  color: colors.textMuted,
                  textAlign: 'center',
                  letterSpacing: 2,
                  marginBottom: 18,
                }}
              >
                {t('home.chooseDifficulty')}
              </Text>
              <View
                style={{
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <View style={{ flex: 1, minWidth: 0 }}>
                  <DifficultyButtonFrame color={colors.easyGreen}>
                    <DifficultyButton
                      label={t('home.easy')}
                      dots={1}
                      color={colors.easyGreen}
                      onPress={() => {
                        playMoveFeedback();
                        nav.navigate('Game', {
                          mode: 'cpu',
                          difficulty: 'easy',
                        });
                      }}
                    />
                  </DifficultyButtonFrame>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <DifficultyButtonFrame color={colors.mediumYellow}>
                    <DifficultyButton
                      label={t('home.medium')}
                      dots={2}
                      color={colors.mediumYellow}
                      onPress={() => {
                        playMoveFeedback();
                        nav.navigate('Game', {
                          mode: 'cpu',
                          difficulty: 'medium',
                        });
                      }}
                    />
                  </DifficultyButtonFrame>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <DifficultyButtonFrame color={colors.hardRed}>
                    <DifficultyButton
                      label={t('home.hard')}
                      dots={3}
                      color={colors.hardRed}
                      onPress={() => {
                        playMoveFeedback();
                        nav.navigate('Game', {
                          mode: 'cpu',
                          difficulty: 'hard',
                        });
                      }}
                    />
                  </DifficultyButtonFrame>
                </View>
              </View>
            </View>
          </View>

          <StatsPanel
            title={t('home.yourStats')}
            seasonLabel={t('home.seasonSince', { date: seasonStartDate })}
            winRateLabel={t('home.winRate')}
            winRate={winRate}
            todayLabel={t('home.today')}
            todayMatches={todayMatches}
            totalLabel={t('home.total')}
            totalMatches={totalMatches}
          />
        </View>
      </ScrollView>

      <AdBanner />
    </LinearGradient>
  );
};

type NeonButtonProps = {
  label: string;
  color: string;
  onPress: () => void;
  large?: boolean;
  icon?: string;
};

const NeonButton = ({
  label,
  color,
  onPress,
  large = false,
  icon,
}: NeonButtonProps) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const glitchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1250,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1250,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const glitchLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(glitchAnim, {
          toValue: 1,
          duration: 55,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 0,
          duration: 45,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(75),
        Animated.timing(glitchAnim, {
          toValue: 1,
          duration: 45,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 0,
          duration: 70,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(1350),
      ]),
    );

    glowLoop.start();
    glitchLoop.start();

    return () => {
      glowLoop.stop();
      glitchLoop.stop();
    };
  }, [glitchAnim, glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });
  const glitchOverlayOpacity = glitchAnim.interpolate({
    inputRange: [0, 0.1, 0.65, 1],
    outputRange: [0, 0.42, 0.28, 0],
  });
  const glitchBandTranslateX = glitchAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-24, 18, -8],
  });
  const glitchBandScaleX = glitchAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 1, 0.55],
  });
  const buttonLabel = `${icon ?? '×'} ${label}`;

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -8,
          left: -8,
          right: -8,
          bottom: -8,
          borderRadius: 22,
          backgroundColor: color,
          opacity: glowOpacity,
        }}
      />
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#00B8D9' : color,
          paddingVertical: large ? 22 : 14,
          paddingHorizontal: 18,
          borderRadius: 16,
          alignItems: 'center',
          overflow: 'hidden',
          shadowColor: color,
          shadowOpacity: pressed ? 0.55 : 0.9,
          shadowRadius: pressed ? 10 : 22,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: -12,
            right: -12,
            top: 9,
            height: 9,
            backgroundColor: colors.text,
            opacity: glitchOverlayOpacity,
            transform: [
              { translateX: glitchBandTranslateX },
              { scaleX: glitchBandScaleX },
            ],
          }}
        />
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: -12,
            right: -12,
            bottom: 10,
            height: 7,
            backgroundColor: colors.neonPink,
            opacity: glitchOverlayOpacity,
            transform: [
              { translateX: glitchBandTranslateX },
              { scaleX: glitchBandScaleX },
            ],
          }}
        />
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '48%',
            height: 3,
            backgroundColor: colors.background,
            opacity: glitchOverlayOpacity,
          }}
        />
        <Text
          style={{
            fontFamily: 'Bungee_400Regular',
            fontSize: large ? 17 : 14,
            color: colors.background,
            letterSpacing: 3,
            textAlign: 'center',
          }}
        >
          {buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
};

type DifficultyButtonProps = {
  label: string;
  dots: number;
  color: string;
  onPress: () => void;
};

const DifficultyButtonFrame = ({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) => (
  <View
    style={{
      width: '100%',
      borderRadius: 15,
      borderWidth: 2,
      borderColor: color,
      backgroundColor: colors.background + '22',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 3,
      shadowColor: color,
      shadowOpacity: 0.28,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      overflow: 'hidden',
    }}
  >
    {children}
  </View>
);

const DifficultyButton = ({
  label,
  dots,
  color,
  onPress,
}: DifficultyButtonProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      width: '100%',
      minHeight: 13,
      paddingVertical: 18,
      borderRadius: 20,
      backgroundColor: pressed ? color + '12' : colors.background + '55',
      shadowColor: color,
      shadowOpacity: pressed ? 0.65 : 0.28,
      shadowRadius: pressed ? 16 : 10,
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
      transform: [{ scale: pressed ? 0.97 : 1 }],
    })}
  >
    <View
      style={{
        height: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 5,
        marginBottom: 14,
      }}
    >
      {[1, 2, 3].map((i) => {
        const active = i <= dots;

        return (
          <View
            key={i}
            style={{
              width: 4,
              height: 4 + i * 6,
              borderRadius: 2,
              backgroundColor: active ? color : color + '30',
              shadowColor: color,
              shadowOpacity: active ? 0.9 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        );
      })}
    </View>

    <Text
      style={{
        fontFamily: 'Bungee_400Regular',
        fontSize: 12,
        color,
        letterSpacing: 1.5,
        textAlign: 'center',
        textShadowColor: color,
        textShadowRadius: 8,
        textShadowOffset: { width: 0, height: 0 },
      }}
    >
      {label}
    </Text>
  </Pressable>
);

type StatsPanelProps = {
  title: string;
  seasonLabel: string;
  winRateLabel: string;
  winRate: number;
  todayLabel: string;
  todayMatches: number;
  totalLabel: string;
  totalMatches: number;
};

const StatsPanel = ({
  title,
  seasonLabel,
  winRateLabel,
  winRate,
  todayLabel,
  todayMatches,
  totalLabel,
  totalMatches,
}: StatsPanelProps) => (
  <View style={{ marginTop: 22 }}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 4,
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: 'SpaceGrotesk_700Bold',
            fontSize: 10,
            color: colors.textMuted,
            letterSpacing: 4,
          }}
        >
          {title.toUpperCase()}
        </Text>
        <Text
          style={{
            fontFamily: 'SpaceGrotesk_500Medium',
            fontSize: 9,
            color: colors.textMuted,
            marginTop: 2,
            opacity: 0.6,
            letterSpacing: 1,
          }}
        >
          {seasonLabel}
        </Text>
      </View>
    </View>

    <View style={{ flexDirection: 'row', gap: 8 }}>
      <StatCard
        value={`${winRate}%`}
        label={winRateLabel}
        color={colors.neonCyan}
      />
      <StatCard
        value={String(todayMatches)}
        label={todayLabel}
        color={colors.neonPink}
      />
      <StatCard
        value={String(totalMatches)}
        label={totalLabel}
        color={colors.neonYellow}
      />
    </View>
  </View>
);

const StatCard = ({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) => (
  <View
    style={{
      flex: 1,
      minHeight: 64,
      paddingVertical: 12,
      paddingHorizontal: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.neonPurple + '40',
      backgroundColor: colors.surface + '80',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontFamily: 'Bungee_400Regular',
        fontSize: 22,
        color,
        lineHeight: 24,
        textShadowColor: color,
        textShadowRadius: 10,
        textShadowOffset: { width: 0, height: 0 },
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontFamily: 'SpaceGrotesk_700Bold',
        fontSize: 8.5,
        color: colors.textMuted,
        letterSpacing: 1.5,
        marginTop: 4,
      }}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {label.toUpperCase()}
    </Text>
  </View>
);
