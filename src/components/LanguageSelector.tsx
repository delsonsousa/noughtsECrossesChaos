import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useFeedback } from '../hooks/useFeedback';
import { useGameContext } from '../store/GameContext';
import { colors } from '../theme/colors';

const LANGUAGES = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useGameContext();
  const { toggle: playToggleFeedback } = useFeedback();

  return (
    <View style={styles.row}>
      {LANGUAGES.map(({ code, flag, label }) => {
        const active = language === code;
        return (
          <Pressable
            key={code}
            onPress={() => {
              if (!active) {
                playToggleFeedback();
              }
              void setLanguage(code as LangCode);
            }}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={styles.flag}>{flag}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemActive: {
    borderColor: colors.accent,
  },
  flag: {
    fontSize: 22,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  labelActive: {
    color: colors.accent,
  },
});
