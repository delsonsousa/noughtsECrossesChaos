import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { RootStackParamList } from '../../App';
import { AdBanner } from '../components/AdBanner';
import { Logo } from '../components/Logo';
import { useGameContext } from '../store/GameContext';
import { colors } from '../theme/colors';

export const HomeScreen = () => {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { scoreboards, scoreboardsResetAt } = useGameContext();
  const seasonStartDate = new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(scoreboardsResetAt));

  return (
    <LinearGradient
      colors={[colors.backgroundTop, colors.backgroundMid, colors.background]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 60,
        }}
      >
        {/* HEADER: Logo + Título */}
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
            paddingVertical: 28,
          }}
        >
          {/* BOTÃO PRIMÁRIO: Jogar com amigo */}
          <NeonButton
            label={t('home.playLocal')}
            color={colors.neonCyan}
            onPress={() => nav.navigate('Game', { mode: 'local' })}
            large
          />

          {/* CARD: Jogar contra IA */}
          <View
            style={{
              marginTop: 20,
              paddingHorizontal: 18,
              paddingTop: 18,
              paddingBottom: 16,
              borderRadius: 16,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.neonPurple,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Bungee_400Regular',
                color: colors.text,
                textAlign: 'center',
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              {t('home.vsComputer')}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SpaceGrotesk_500Medium',
                color: colors.textMuted,
                textAlign: 'center',
                marginBottom: 14,
              }}
            >
              {t('home.chooseDifficulty')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <DifficultyButton
                label={t('home.easy')}
                dots={1}
                color={colors.easyGreen}
                onPress={() =>
                  nav.navigate('Game', { mode: 'cpu', difficulty: 'easy' })
                }
              />
              <DifficultyButton
                label={t('home.medium')}
                dots={2}
                color={colors.mediumYellow}
                onPress={() =>
                  nav.navigate('Game', { mode: 'cpu', difficulty: 'medium' })
                }
              />
              <DifficultyButton
                label={t('home.hard')}
                dots={3}
                color={colors.hardRed}
                onPress={() =>
                  nav.navigate('Game', { mode: 'cpu', difficulty: 'hard' })
                }
              />
            </View>
          </View>

          {/* LISTA DE RECORDES */}
          <View
            style={{
              marginTop: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SpaceGrotesk_500Medium',
                color: colors.textMuted,
                letterSpacing: 3,
              }}
            >
              {t('home.highScore').toUpperCase()}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'SpaceGrotesk_500Medium',
                color: colors.textMuted,
                marginTop: 4,
              }}
            >
              {t('home.seasonSince', { date: seasonStartDate })}
            </Text>
            <View style={{ alignSelf: 'stretch', gap: 8, marginTop: 12 }}>
              <ScoreboardRow
                label={t('home.localScore')}
                leftLabel={t('home.player1')}
                leftScore={scoreboards.local.X}
                rightLabel={t('home.player2')}
                rightScore={scoreboards.local.O}
              />
              <ScoreboardRow
                label={t('home.cpuScore')}
                leftLabel={t('home.player')}
                leftScore={scoreboards.cpu.X}
                rightLabel={t('home.ai')}
                rightScore={scoreboards.cpu.O}
              />
            </View>
          </View>
        </View>

        {/* Botão settings discreto */}
        <Pressable
          onPress={() => nav.navigate('Settings')}
          style={{
            paddingVertical: 12,
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontFamily: 'SpaceGrotesk_700Bold',
              fontSize: 13,
              color: colors.textMuted,
              letterSpacing: 2,
            }}
          >
            ⚙ {t('home.settings').toUpperCase()}
          </Text>
        </Pressable>
      </ScrollView>

      <AdBanner />
    </LinearGradient>
  );
};

// === Subcomponentes ===

const NeonButton = ({ label, color, onPress, large = false }: any) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      backgroundColor: pressed ? color + '24' : colors.surface,
      paddingVertical: large ? 18 : 14,
      paddingHorizontal: 18,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: color,
      alignItems: 'center',
      shadowColor: color,
      shadowOpacity: pressed ? 0.45 : 0.75,
      shadowRadius: pressed ? 8 : 18,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
      transform: [{ scale: pressed ? 0.98 : 1 }],
    })}
  >
    <Text
      style={{
        fontFamily: 'Bungee_400Regular',
        fontSize: large ? 18 : 14,
        color: colors.text,
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: color,
        textShadowRadius: 12,
        textShadowOffset: { width: 0, height: 0 },
      }}
    >
      {label}
    </Text>
  </Pressable>
);

const DifficultyButton = ({ label, dots, color, onPress }: any) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      flex: 1,
      minHeight: 70,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: pressed ? color : color + '66',
      backgroundColor: pressed ? color + '24' : color + '10',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: color,
      shadowOpacity: pressed ? 0.45 : 0.25,
      shadowRadius: pressed ? 10 : 6,
    })}
  >
    <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: i <= dots ? color : color + '33',
          }}
        />
      ))}
    </View>
    <Text
      style={{
        fontFamily: 'Bungee_400Regular',
        fontSize: 10,
        color: color,
        letterSpacing: 0.5,
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

const ScoreboardRow = ({
  label,
  leftLabel,
  leftScore,
  rightLabel,
  rightScore,
}: {
  label: string;
  leftLabel: string;
  leftScore: number;
  rightLabel: string;
  rightScore: number;
}) => (
  <View
    style={{
      minHeight: 42,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.neonPurple + '66',
      backgroundColor: colors.surface + '88',
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    }}
  >
    <Text
      style={{
        flex: 1,
        fontFamily: 'SpaceGrotesk_700Bold',
        fontSize: 11,
        color: colors.textMuted,
        letterSpacing: 1.5,
      }}
      numberOfLines={1}
    >
      {label.toUpperCase()}
    </Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text
        style={{
          fontFamily: 'Bungee_400Regular',
          fontSize: 13,
          color: colors.playerX,
        }}
      >
        {leftLabel} {leftScore}
      </Text>
      <View
        style={{
          width: 1,
          height: 14,
          backgroundColor: colors.textMuted,
          opacity: 0.45,
        }}
      />
      <Text
        style={{
          fontFamily: 'Bungee_400Regular',
          fontSize: 13,
          color: colors.playerO,
        }}
      >
        {rightScore} {rightLabel}
      </Text>
    </View>
  </View>
);
