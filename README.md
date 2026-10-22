# Drug Lord Tycoon – Fan-Nachbau (HTML)

Zwei spielbare Browser-Versionen, inspiriert von *Drug Lord Tycoon* (inoffizieller Fan-Nachbau, **Satire mit fiktiver Spielmechanik**).

- `drug-lord-3d.html` – First-Person-3D-Gewächshaus (three.js, Low-Poly): pflanzen, gießen, ernten, trimmen, verpacken, verkaufen, Arbeiter einstellen – plus **angebautes Labor (2 Räume)**.
- `index.html` – 2D-Idle-Tycoon-Variante.

Einfach die HTML-Datei im Browser öffnen (die 3D-Version lädt three.js per CDN, Internet nötig). Der Ordner `ui/` (gemeinsames Menü-Design) muss neben den HTML-Dateien liegen.

## UI (Startmenü, Einstellungen, Lobby)

Beide Spiele nutzen dasselbe UI-Modul (`ui/dlt-ui.css`, `ui/dlt-ui.js`):

- **Startmenü / Pause** mit Weiter, Neues Spiel, Speichern, Tastatur-Navigation (↑/↓, Esc = zurück). Das 2D-Spiel pausiert, solange ein Menü offen ist.
- **Einstellungen** (sofort wirksam, automatisch gespeichert): Menü-/HUD-Größe, reduzierte Animationen; 3D: Mausempfindlichkeit, Y-Achse, FOV, Renderauflösung, Schatten, Kopfwippen, FPS-Anzeige, Fadenkreuz, Ziel-Anzeige; 2D: Zahlenformat, Log, Benachrichtigungen, Autosave-Intervall. Tab „Daten“: Spielstand kopieren/importieren/löschen.
- **Steuerung** und **Über & Hinweis** (Satire-Hinweis).
- **Multiplayer-Lobby – nur UI-Vorschau:** Lobby erstellen (Koop/Wettbewerb, Spielerzahl, Sichtbarkeit), Code teilen, Bereit-Status, Chat, Demo-Bots. Es gibt noch keinen Server/Netzcode; „Beitreten“ per Code endet daher bewusst mit einer Fehlermeldung.

Steuerung 3D: WASD, Maus, Shift, 1/2/3 Werkzeug, Klick benutzen, E interagieren.

## Das Labor (3D-Version)

Freischalten: Tutorial-Ziele abschließen (Paket verkaufen, Arbeiter einstellen), Level 3 erreichen und bei Onkel Rick das Labor freischalten. Danach öffnet sich die **Stahltür in der Frontwand** des Gewächshauses – das Labor ist direkt angebaut, kein Ladebildschirm.

- **Raum 1 – Vorbereitung & Lager:** Spinde (Schutzausrüstung anlegen), gelber Chemikalien-Schrank (Zutaten kaufen), Rezept-Board (Ansatz starten), **Laptop** mit Mining-Rig.
- **Raum 2 – Kochlabor:** Analysenwaage, Magnetrührer, Abzug mit Heizrührer, Kühlbad, Vakuumfiltration, Trockenschrank, Tablettenpresse.
- **Laptop / Darknet (Satire):** SchwarzCoin (SCN) minen (Klick + Grafikkarten + Lüfter, Stromrechnung pro Tag), Kurs-Schwankungen und Meldungen, im Darknet-Markt **Anleitungen** (Spiel-Rezepte) und Zutaten per Drohne kaufen, Scam-Angebote inklusive. Tab „Anleitungen“ zeigt die Schrittliste samt Spiel-Tipps.
- **4 Produkte mit echten Namen:** Amphetamin, MDMA, Methamphetamin, LSD – unterschiedliche Schwierigkeit, Schritte und Preise.
- **Kochen = Geschicklichkeit:** jeder Schritt ist ein Minispiel (Dosieren, Rühren, Heizen, Kühlen, Filtern, Trocknen, Tablettieren). Qualität = Durchschnitt der Schritte, Marktpreis hängt von Qualität und Tagesmarkt ab. Siedeverzug ruiniert den Ansatz; ohne Schutzausrüstung kostet das Notaufnahme-Geld.
- **Ausrüstung:** Glasware (mehr Ausbeute) und Präzisions-Ausrüstung (größere Zielzonen) am Laptop.
- Verkauf der Produkte bei Onkel Rick.

## Wichtig / Rechtliches

Alles im Labor ist **frei erfunden**: Zutaten (z. B. „Grundstoff A“), Abläufe, Mengen, Zielzonen und Werte sind reine Spielmechanik und haben **keinen Bezug zu echter Herstellung**. Es gibt keine echten Anleitungen. Herstellung, Besitz und Handel mit Drogen sind in der Realität strafbar und gefährlich – das Spiel dient nur der Unterhaltung (ab 18). Im Spiel erscheint beim ersten Laborbesuch ein entsprechender Hinweis.
