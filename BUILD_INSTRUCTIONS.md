# Ledovač Návykov - Inštalácia na mobil

## Možnosť 1: PWA (Progressive Web App) - ODPORÚČANÉ

Najjednoduchší spôsob inštalácie bez potreby APK:

### Na Samsung/Android:
1. Otvor Chrome na telefóne
2. Choď na adresu kde beží aplikácia (napr. cez ngrok alebo deploy na Vercel)
3. Klikni na 3 bodky v pravom hornom rohu
4. Vyber "Pridať na plochu" alebo "Install app"
5. Aplikácia sa nainštaluje ako natívna app!

### Výhody PWA:
- Funguje offline
- Vyzerá ako natívna aplikácia
- Automatické aktualizácie
- Žiadne APK potrebné

---

## Možnosť 2: Natívne APK

Pre vytvorenie APK súboru potrebuješ:

### Požiadavky:
1. **Java JDK 17+** - stiahni z: https://adoptium.net/
2. **Android Studio** - stiahni z: https://developer.android.com/studio

### Po inštalácii spusti:
```bash
cd C:\Users\milan\Downloads\LEDOVAC_DESIGN

# Build web app
npm run build

# Sync s Android projektom
npx cap sync android

# Otvor v Android Studio
npx cap open android
```

### V Android Studio:
1. Počkaj kým sa projekt načíta
2. Menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
3. APK nájdeš v: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Možnosť 3: Online deploy + PWA

### Deploy na Vercel (zadarmo):
```bash
npm install -g vercel
vercel --prod
```

Potom otvor URL na mobile a nainštaluj ako PWA.

---

## Súbory projektu

- `/android` - Android projekt pre Capacitor
- `/dist` - Build web aplikácie
- `/public/manifest.json` - PWA manifest
- `/public/sw.js` - Service worker pre offline podporu
