# Memory Game

Ein browserbasiertes 2-Spieler-Memory-Spiel, gebaut mit Vite und TypeScript und scss.

---

## Starten

```bash
npm install
npm run dev
```

Die App läuft dann unter `http://localhost:5173`.

---

## Spielablauf

1. **Settings-Seite:** Beide Spieler konfigurieren das Spiel vor dem Start.
2. **Spielfeld:** Die Spieler wechseln sich ab, Karten aufzudecken.
3. **Ziel:** Wer am Ende die meisten Kartenpaare gefunden hat, gewinnt. Bei Gleichstand endet das Spiel unentschieden.

---

## Einstellungen

| Option | Werte |
|---|---|
| Game Theme | Code Vibes, Gaming |
| Startspieler | Blue, Orange |
| Board-Größe | 16, 24 oder 36 Karten |

---

## Projektstruktur

```
src/
├── styles/
│   ├── abstract/          # SCSS-Variablen (Farben, Fonts) und Mixins
│   ├── components/        # Komponentenspezifische Styles (Karten, Buttons, Dialoge)
│   ├── pages/             # Seitenlayouts (Settings, Game)
│   ├── themes/            # Theme-Dateien (Code Vibes, Gaming, ...)
│   └── main.scss          # Einstiegspunkt für alle Styles
├── templates/
│   └── card-template.ts   # HTML-Template für eine Spielkarte
├── main.ts                # App-Einstiegspunkt
├── settings.ts            # Logik der Settings-Seite
├── game.ts                # Spiellogik (Kartenmechanik, Spielerwechsel, Gewinnprüfung)
├── img-theme-loader.ts    # Lädt die passenden Bilder je nach gewähltem Theme
├── interface-game.ts      # TypeScript-Interfaces für das Spiel
└── interfaces-settings.ts # TypeScript-Interfaces für die Einstellungen
```

---

## Build

```bash
npm run build
```

Output landet im `dist/`-Ordner.
