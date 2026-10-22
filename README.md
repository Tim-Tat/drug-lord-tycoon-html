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

## Charaktere & Hotbar

- **Charakter-Editor** im Startbildschirm (Live-Vorschau): Haut, Frisur, Haarfarbe, Oberteil, Hose, Extra (Sonnenbrille / Cap / Mundschutz). Wird lokal gespeichert und im Multiplayer an alle gesendet, die anderen sehen deine Figur samt Namen. Mit angelegter Schutzausrüstung trägt sie Kittel, Schutzbrille und Handschuhe.
- **V** wechselt zwischen 1. und 3. Person (eigenen Charakter ansehen).
- **Hotbar wechselt automatisch:** im Gewächshaus Samen / Gießen / Schere (1–3), im Labor die Chemie-Leiste (1–4): 🥽 Schutzausrüstung an/aus, 📋 aktueller Ansatz-Schritt (Taste zeigt Hinweis), 🧪 Zutaten-Vorrat, 💻 Laptop öffnen.

## Multiplayer (Co-op, P2P)

Im Startbildschirm der 3D-Version: **Raum hosten** (zeigt einen 5-stelligen Code) oder mit dem Code **Beitreten**. Bis zu 8 Spieler, Drop-in jederzeit.

- **Host = Autorität:** Der Host spielt vom eigenen Gerät aus und führt die komplette Simulation (Pflanzen, Arbeiter, Tage, Mining, Labor). Der Host-Tab muss sichtbar bleiben.
- **Geteilte Welt:** Alle bedienen dasselbe Gewächshaus und Labor (Geld, Pakete, Rezepte, Ansatz, Produkte sind gemeinsam). Pflanzen, gießen, ernten, trimmen, verpacken, Rick-Menü, Chemikalien-Schrank, Rezept-Board, Laptop/Darknet und alle Koch-Schritte funktionieren auch für Mitspieler. Schutzausrüstung, Gießkanne und Werkzeug sind pro Spieler.
- **Sichtbar:** Avatare mit Namen, Spielerliste, Chat (Enter).
- **Technik:** WebRTC über [PeerJS](https://peerjs.com). Der Vermittlungsserver (PeerJS-Cloud) wird nur für den Verbindungsaufbau genutzt, Spieldaten laufen direkt zwischen den Geräten. Eigener Server: `?ps=host:port` an die URL hängen (z. B. `peer`-npm-Paket). Hinter sehr strikten NATs/Firmennetzen kann ein TURN-Server nötig sein.
- Mitspieler speichern nicht über den Host-Spielstand; der Host speichert wie gewohnt lokal.

## Wichtig / Rechtliches

Alles im Labor ist **frei erfunden**: Zutaten (z. B. „Grundstoff A“), Abläufe, Mengen, Zielzonen und Werte sind reine Spielmechanik und haben **keinen Bezug zu echter Herstellung**. Es gibt keine echten Anleitungen. Herstellung, Besitz und Handel mit Drogen sind in der Realität strafbar und gefährlich – das Spiel dient nur der Unterhaltung (ab 18). Im Spiel erscheint beim ersten Laborbesuch ein entsprechender Hinweis.
