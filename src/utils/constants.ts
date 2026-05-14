export const MAX_PIECES_PER_PLAYER = 3;

export const STORAGE_KEYS = {
  SCORES: '@ncc:scores',
  SCORES_RESET_AT: '@ncc:scoresResetAt',
  COMPLETED_MATCHES: '@ncc:completedMatches',
  CURRENT_STREAK: '@ncc:currentStreak',
  TODAY_MATCH_DATE: '@ncc:todayMatchDate',
  TODAY_MATCHES: '@ncc:todayMatches',
  AD_LAST_GAME_START_INTERSTITIAL_AT: '@ncc:adLastGameStartInterstitialAt',
  AD_GAME_STARTS_SINCE_INTERSTITIAL: '@ncc:adGameStartsSinceInterstitial',
  SOUND_ENABLED: '@ncc:soundEnabled',
  HAPTICS_ENABLED: '@ncc:hapticsEnabled',
  LANGUAGE: '@ncc:language',
} as const;
