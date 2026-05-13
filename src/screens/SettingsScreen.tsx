import React from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { LanguageSelector } from '../components/LanguageSelector';
import { AdBanner } from '../components/AdBanner';
import { useGameContext } from '../store/GameContext';
import type { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingRow: React.FC<{
  label: string;
  right: React.ReactNode;
}> = ({ label, right }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    {right}
  </View>
);

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    soundEnabled,
    hapticsEnabled,
    setSoundEnabled,
    setHapticsEnabled,
    resetScores,
  } = useGameContext();

  const handleResetScores = () => {
    Alert.alert(
      t('settings.resetScores'),
      t('settings.confirmReset'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.yes'),
          style: 'destructive',
          onPress: resetScores,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <SettingRow
            label={t('settings.sound')}
            right={
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ true: colors.accent, false: colors.textMuted }}
                thumbColor={colors.text}
              />
            }
          />
          <SettingRow
            label={t('settings.haptics')}
            right={
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ true: colors.accent, false: colors.textMuted }}
                thumbColor={colors.text}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
          <LanguageSelector />
        </View>

        <View style={styles.section}>
          <Pressable
            onPress={handleResetScores}
            style={({ pressed }) => [styles.actionBtn, styles.dangerBtn, pressed && { opacity: 0.75 }]}
          >
            <Text style={styles.dangerBtnText}>{t('settings.resetScores')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AdBanner />
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
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 32,
    color: colors.accent,
    fontWeight: '300',
    lineHeight: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 24,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  dangerBtnText: {
    color: '#FF4444',
    fontWeight: '600',
    fontSize: 15,
  },
});
