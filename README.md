# Drug Lord Tycoon – Fan-Nachbau (HTML)

Zwei spielbare Browser-Versionen, inspiriert von *Drug Lord Tycoon* (inoffizieller Fan-Nachbau, **Satire mit fiktiver Spielmechanik**).

- `drug-lord-3d.html` – First-Person-3D-Gewächshaus (three.js, Low-Poly): pflanzen, gießen, ernten, trimmen, verpacken, verkaufen, Arbeiter einstellen – plus **angebautes Labor (2 Räume)**.
- `index.html` – 2D-Idle-Tycoon-Variante.

Einfach die HTML-Datei im Browser öffnen (die 3D-Version lädt three.js per CDN, Internet nötig).

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

## Multiplayer (Co-op, 3D-Version)

Mehrere Spieler laufen gemeinsam im selben Gewächshaus (inkl. Labor): sie sehen sich als Figuren mit Namen, teilen sich **Kasse, Pflanzen, Lager, Labor, Arbeiter und Level** und können mit **Enter** chatten. Pro Spieler bleiben Werkzeug, Gießkanne, Schutzausrüstung und der laufende Ansatz getrennt. Der älteste Spieler im Raum (👑) ist Host und simuliert Tageswechsel, Pflanzenwachstum, Mining und die Arbeiter-KI; geht er, übernimmt der nächste. Der gemeinsame Hof wird serverseitig gespeichert (`data/room-<name>.json`); der erste Spieler eines neuen Raums bringt seinen lokalen Spielstand mit.

Server starten (nur Node ≥ 18, keine Abhängigkeiten):

```
node server.js          # PORT=8080, DATA_DIR=./data, MAX_PLAYERS=8
```

`server.js` liefert die HTML-Dateien selbst aus und bedient den WebSocket-Endpunkt `/ws`. Läuft davor nginx (z. B. für `https://drug-school.playground.tatula.ch`), muss `/ws` als WebSocket durchgereicht werden – siehe `deploy/nginx.conf.example` (Docker: `Dockerfile`). Die Seite verbindet sich automatisch mit `wss://<host>/ws`.

URL-Parameter: `?room=name` (eigener Raum, Standard `main`), `?solo` (ohne Server), `?server=wss://…/ws` (anderer Server). Erreicht die Seite keinen Server (z. B. nur statisches Hosting oder lokal geöffnete Datei), läuft das Spiel wie bisher als Einzelspieler.

## Wichtig / Rechtliches

Alles im Labor ist **frei erfunden**: Zutaten (z. B. „Grundstoff A“), Abläufe, Mengen, Zielzonen und Werte sind reine Spielmechanik und haben **keinen Bezug zu echter Herstellung**. Es gibt keine echten Anleitungen. Herstellung, Besitz und Handel mit Drogen sind in der Realität strafbar und gefährlich – das Spiel dient nur der Unterhaltung (ab 18). Im Spiel erscheint beim ersten Laborbesuch ein entsprechender Hinweis.
