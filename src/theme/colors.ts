export const colors = {
  // Backgrounds — gradient deep space
  background: '#0A0118', // roxo quase preto (era #1A1A1A)
  backgroundMid: '#1A0B2E', // roxo escuro
  backgroundTop: '#2D0B4E', // roxo médio (para gradient)
  surface: '#1F0F3A', // card synthwave
  surfaceBorder: '#FF2E97', // borda magenta neon

  // Players
  playerX: '#00F0FF', // ciano elétrico (mais saturado)
  playerO: '#FF2E97', // magenta neon

  // Accents synthwave
  neonPink: '#FF2E97',
  neonCyan: '#00F0FF',
  neonPurple: '#B026FF',
  neonYellow: '#FFE600', // para "Hard" e destaques
  sunOrange: '#FF6B35', // do sol synthwave
  accent: '#00F0FF',

  // Texto
  text: '#FFFFFF',
  textMuted: '#8B7AB8', // lilás suave (era cinza)
  textNeon: '#00F0FF',

  // Dificuldade
  easyGreen: '#00FF9F',
  mediumYellow: '#FFE600',
  hardRed: '#FF3864',

  // Glow shadows (use em shadowColor)
  glowCyan: '#00F0FF',
  glowPink: '#FF2E97',
} as const;
