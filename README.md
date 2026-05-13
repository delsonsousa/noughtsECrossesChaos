# Noughts & Crosses Chaos

> The infinite tic-tac-toe — only 3 pieces per player, no draws.

## Gameplay modes

- Local multiplayer on the same device.
- Single-player versus CPU with Easy, Medium, and Hard difficulty.

---

## How to run (dev)

> **Expo Go is NOT supported** — the AdMob native module requires a custom native build.

```bash
npm install
npx expo prebuild          # generates ios/ and android/ folders
npx expo run:ios           # or run:android
```

For local development without AdMob errors, the app uses AdMob **test IDs** automatically when `__DEV__` is true.

---

## How to build (production)

Install the EAS CLI if you haven't yet:
```bash
npm install -g eas-cli
eas login
```

### Android (AAB for Play Store)
```bash
eas build -p android --profile production
```

### iOS (IPA for App Store)
```bash
eas build -p ios --profile production
```

### Internal APK (for testing)
```bash
eas build -p android --profile preview
```

---

## Where to replace AdMob IDs

The project is configured with Google's official sample AdMob App IDs for local builds.
Before submitting, replace the production IDs in **two places**:

1. **`app.json`** → `plugins → react-native-google-mobile-ads`
   ```json
   "androidAppId": "ca-app-pub-your-real-android-app-id",
   "iosAppId":     "ca-app-pub-your-real-ios-app-id"
   ```

2. **`src/utils/ads.ts`** → constants at the top of the file
   ```ts
   const BANNER_ID_ANDROID       = 'ca-app-pub-.../...';
   const BANNER_ID_IOS           = 'ca-app-pub-.../...';
   const INTERSTITIAL_ID_ANDROID = 'ca-app-pub-.../...';
   const INTERSTITIAL_ID_IOS     = 'ca-app-pub-.../...';
   ```

---

## How to add a new language

1. Create `src/i18n/locales/<lang>.json` following the same key structure.
2. Import it in `src/i18n/index.ts` and add to `resources`.
3. Add the locale to `supportedLangs` in `src/i18n/index.ts`.
4. Add a `{ code, flag, label }` entry to `LANGUAGES` in `src/components/LanguageSelector.tsx`.

---

## Submission checklist

### Play Store (Android)
- [ ] Real AdMob App ID in `app.json` and `eas.json`
- [ ] `eas build -p android --profile production` → AAB uploaded to Play Console
- [ ] Signed with a production keystore (EAS manages this automatically)
- [ ] Set content rating: **Everyone**
- [ ] `com.google.android.gms.permission.AD_ID` declared (already in `app.json`)
- [ ] Complete store listing with ASO texts below

### App Store (iOS)
- [ ] Real AdMob App ID in `app.json`
- [ ] `NSUserTrackingUsageDescription` already set in `app.json`
- [ ] `eas build -p ios --profile production` → IPA uploaded via EAS Submit or Transporter
- [ ] Add SKAdNetworkItems from Google AdMob dashboard
- [ ] Set age rating: **4+**
- [ ] Complete store listing with ASO texts below

---

## App Store Optimization (ASO)

### English — App Store & Google Play

**Title (30 chars):** `Noughts & Crosses Chaos`

**Short description (80 chars):**
`The infinite tic-tac-toe. Only 3 pieces. Pure strategy. No draws.`

**Full description:**
```
Noughts & Crosses Chaos reinvents tic-tac-toe with one twist that changes everything: each player can only have 3 pieces on the board at once. Place a 4th piece and your oldest one vanishes — forcing you to constantly rethink your strategy.

No boring draws. No endless stalemates. Just pure, fast-paced strategy in every match.

✦ INFINITE GAMEPLAY — The board never locks up. Every move matters.
✦ VANISH MECHANIC — Your oldest piece disappears when you place a 4th. Plan ahead.
✦ QUICK MATCHES — Games last under 2 minutes. Perfect for commutes.
✦ OFFLINE — No internet required. Play anywhere, anytime.
✦ MINIMALIST DESIGN — Dark theme, clean UI, satisfying feedback.

Keywords: tic tac toe, noughts and crosses, strategy, puzzle, brain game, minimalist, offline game
```

---

### Português (BR) — Google Play Brasil

**Título:** `Jogo da Velha Chaos`

**Descrição curta:**
`Jogo da velha infinito. Só 3 peças por jogador. Sem empate. Pura estratégia.`

**Descrição longa:**
```
O Jogo da Velha Chaos reinventa o clássico com um detalhe que muda tudo: cada jogador só pode ter 3 peças no tabuleiro ao mesmo tempo. Ao colocar a 4ª peça, a mais antiga desaparece — te obrigando a pensar sempre um passo à frente.

Sem empate chato. Sem tabuleiro travado. Pura estratégia em cada rodada.

✦ JOGO INFINITO — O tabuleiro nunca trava. Cada jogada importa.
✦ MECÂNICA VANISH — Sua peça mais antiga some ao colocar a 4ª. Planeje.
✦ PARTIDAS RÁPIDAS — Menos de 2 minutos. Ideal para o dia a dia.
✦ OFFLINE — Sem internet. Jogue em qualquer lugar.
✦ DESIGN MINIMALISTA — Tema escuro, UI limpa, feedback satisfatório.

Palavras-chave: jogo da velha, jogo da velha online, estratégia, raciocínio, offline, minimalista
```

---

### Español (ES/LatAm) — App Store & Google Play

**Título:** `Tres en Raya Chaos`

**Descripción corta:**
`Tres en raya infinito. Solo 3 fichas. Pura estrategia. Sin empates.`

**Descripción larga:**
```
Tres en Raya Chaos reinventa el clásico con una mecánica que lo cambia todo: cada jugador solo puede tener 3 fichas en el tablero a la vez. Al colocar la 4ª ficha, la más antigua desaparece — obligándote a pensar siempre un paso adelante.

Sin empates aburridos. Sin tableros bloqueados. Pura estrategia en cada partida.

✦ JUEGO INFINITO — El tablero nunca se bloquea. Cada movimiento cuenta.
✦ MECÁNICA VANISH — Tu ficha más antigua desaparece al colocar la 4ª. Planifica.
✦ PARTIDAS RÁPIDAS — Menos de 1 minuto. Perfecto para cualquier momento.
✦ SIN CONEXIÓN — Sin internet. Juega en cualquier lugar.
✦ DISEÑO MINIMALISTA — Tema oscuro, UI limpia, feedback satisfactorio.

Palabras clave: tres en raya, gato, ta te ti, estrategia, puzzle, minimalista, sin conexión
```

---

## Monetization strategy

The app targets a simultaneous release in **US, UK, CA, AU, DE, FR, ES, PT, BR** with no geo-restrictions on ads.

Banner eCPMs in US/UK/DE/AU typically run **5–10× higher than BR**, meaning the i18n investment pays back immediately. Key points:

- **Banner ads** on every screen (bottom anchor)
- **Interstitial ads** every 3 games — high-value placements, low friction
- **Premium IAP (mock)** — one-time "Remove Ads" hook is wired; connect to real IAP when ready
- `maxAdContentRating: 'G'` maximizes premium advertiser inventory internationally
- No geo-restriction — let AdMob optimize fill rate globally

---

## Sound files

Place audio files at:
- `src/assets/sounds/pop.mp3` — short click (piece placement)
- `src/assets/sounds/win.mp3` — victory jingle

Free sources: Freesound.org, Zapsplat.com
