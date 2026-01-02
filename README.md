# 🧊 LEDOVAČ NÁVYKOV

Moderná, prémiová webová aplikácia na sledovanie dobrých návykov a zlozvykov v slovenčine.

## ✨ Hlavné funkcie

### 📊 Dashboard
- **KPI karty**: Prehľad aktuálnych streakov, úspechov, neúspechov a konzistentnosti za posledných 30 dní
- **Kalendár**: 42-dňový prehľad s farebnými bodkami indikujúcimi stav každého dňa
- **Denný prehľad**: Zoznam všetkých návykov pre vybraný deň s možnosťou označiť úspech/neúspech

### 🎯 Návyky
- **Dobré návyky**: Činnosti, ktoré chcete robiť častejšie (cvičenie, čítanie, meditácia...)
- **Zlé návyky**: Činnosti, ktorým sa chcete vyhnúť (fajčenie, fast food, nadmerné používanie telefónu...)
- **Vlastné ikony**: Výber z 32 emoji pre každý návyk
- **Tagy**: Organizácia návykov pomocí štítkov
- **Poznámky**: Pridajte si motiváciu alebo dôvod

### 📈 Štatistiky
- **Streak tracker**: Sledovanie nepretržitej série úspechov
- **Heatmapa**: Vizualizácia posledných 30 dní pre každý návyk
- **Grafy**: 
  - Trend úspešnosti (30 dní)
  - Týždenný prehľad (4 týždne)
  - Koláčový graf konzistentnosti
- **Kritické zlozvyky**: Upozornenie na návyky s najväčším počtom neúspechov

### 🎨 Vizuálne prvky
- **Glassmorphism dizajn**: Moderný vzhľad s priesvitným sklom a rozmazaním
- **Frost glow efekty**: Ľadové zvýraznenia pripomínajúce mráz
- **Streak animácie**: Špeciálne žiariace efekty pri dosiahnutí 7+ dňových streakov
- **Dark mode**: Prepínanie medzi svetlým a tmavým motívom

### 🔧 Funkcie
- **Vyhľadávanie**: Rýchle vyhľadávanie návykov podľa názvu alebo tagov
- **Filtre**: Zobrazenie všetkých návykov, len dobrých, alebo len zlých
- **Navigácia mesiacov**: Prehľad minulých a budúcich mesiacov
- **Export/Reset**: Možnosť resetovať všetky dáta

## 🚀 Ako používať

1. **Pridanie návyku**: Kliknite na tlačidlo "+ Pridať návyk" v hlavičke
2. **Označenie úspechu/neúspechu**: Kliknite na ✓ alebo ✗ pri návyku
3. **Detail návyku**: Kliknite na kartu návyku pre zobrazenie detailov a štatistík
4. **Kalendár**: Kliknite na deň v kalendári pre zobrazenie návykov v ten deň
5. **Štatistiky**: Kliknite na ikonu grafu v hlavičke pre pokročilé štatistiky

## 🎯 Demo dáta

Pri prvom spustení aplikácia automaticky načíta demo dáta s 8 návykmi a záznamami za posledných 30 dní. Môžete ich upraviť, mazať, alebo pridať vlastné.

## 💾 Uloženie dát

Všetky dáta sú uložené lokálne vo vašom prehliadači (localStorage), takže vaše návyky zostanú súkromné a dostupné aj offline.

## 🎨 Témy

- **Svetlá téma**: #f8fafc pozadie, čisté biele karty
- **Tmavá téma**: #0f0f1a pozadie, #1a1a2e karty
- **Akcent**: #6366f1 (indigo modrá)

---

**Vytvorené s**: React, TypeScript, Tailwind CSS, Recharts, Motion, date-fns
