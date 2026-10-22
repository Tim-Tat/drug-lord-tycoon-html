# Drug Lord Tycoon – Fan-Nachbau (HTML)

> **Version 1 (Branch `main-1v`)** – erster kompletter Stand: 3D-Optik, Multiplayer (Co-op/P2P), Charakter-Editor, Straße/Lieferwagen/Straßenverkauf, Darknet-Verkauf mit Packstation, Gesundheit/Tod, mehrstufige Labor-Rezepte und der Labor-Schlüssel bei Onkel Rick. Per Smoke-Test geprüft: Pflanzen → Verkauf → Labor → Kochen (alle 4 Produkte) → Laptop → Straße/Kunden → Auto → Post → Tod/Respawn → Speichern/Laden.


Zwei spielbare Browser-Versionen, inspiriert von *Drug Lord Tycoon* (inoffizieller Fan-Nachbau, **Satire mit fiktiver Spielmechanik**).

- `drug-lord-3d.html` – First-Person-3D-Gewächshaus (three.js, Low-Poly): pflanzen, gießen, ernten, trimmen, verpacken, verkaufen, Arbeiter einstellen – plus **angebautes Labor (2 Räume)**.
- `index.html` – 2D-Idle-Tycoon-Variante.

Einfach die HTML-Datei im Browser öffnen (die 3D-Version lädt three.js per CDN, Internet nötig).

Steuerung 3D: WASD, Maus, Shift, 1/2/3 Werkzeug, Klick benutzen, E interagieren, **F2** Grafik hoch/niedrig.

## Grafik & Animation (3D-Version)

Rein optische Überarbeitung – Spielregeln, Werte und Abläufe sind unverändert.

- **Render-Pipeline:** HDR mit MSAA, Bloom (leuchtende Lampen, Bildschirme, Sonne), Tone-Mapping, Vignette, leichtes Filmkorn. Mit **F2** auf „niedrig“ schalten (kein Bloom, kleinere Schatten, kein Gras) – läuft auch ohne WebGL2/Float-Targets automatisch im Fallback.
- **Tag & Nacht:** Ein Spieltag (90 s) ist ein kompletter Tageszyklus mit Sonnenaufgang, Mittag, Abendrot, Nacht mit Mond und Sternen. Sonne und Mond werfen Schatten, die Hängelampen gehen abends an.
- **Prozeduraler Himmel** mit ziehenden Wolken, Sonnenscheibe und Reflexionen auf Glas/Metall (aus dem Himmel gerenderte Umgebungskarte).
- **Gewächshaus:** Ziegel-, Beton-, Holz- und Glas-Materialien mit Bump, Kondenswasser auf den Scheiben, Lichtstrahlen und Staub im Sonnenlicht, Dachklappen die sich langsam öffnen, drehende Ventilatoren, schwingende Lampen, Wanduhr in Echtzeit, Werkzeugwand, Regale, Pfützen.
- **Pflanzen:** gezackte Fächerblätter, Seitentriebe, Blüten mit Stempelhärchen und funkelndem Harz. Sie wiegen sich im Wind, lassen bei Durst die Blätter hängen und richten sich nach dem Gießen auf; feuchte Erde wird dunkler. Partikel beim Pflanzen, Gießen und Ernten.
- **Hand & Werkzeug (Ego-Ansicht):** Handschuhhand mit Samentüte, Gießkanne (echter Wasserstrahl) und Gartenschere, mit Lauf-Wippen, Trägheit, Werkzeugwechsel- und Benutz-Animationen. Mit Schutzausrüstung wechseln die Handschuhe auf Nitril-Blau.
- **Figuren:** Onkel Rick (Hawaiihemd, Strohhut, Blinzeln, folgt dir mit dem Blick, gestikuliert beim Reden, Kaffee mit Dampf) und Arbeiter im Schutzanzug mit Lauf-/Arbeitsanimation und Staubwölkchen.
- **Außenwelt:** Gelände mit Hügeln, Gras und Blumen im Wind, Bäume, Büsche, Zaun, Windräder, Vögel, Schmetterlinge.
- **Labor:** glänzender Fliesenboden mit Reflexionen, Wandfliesen, Deckenplatten mit Leuchtstoffröhren (flackern gelegentlich), Rohre und Kabeltrassen, beschriftete Reagenzflaschen. Alle Geräte reagieren auf das Minispiel: Rührfisch dreht sich, Heizspirale glüht mit Blasen und Dampf, Eisbad mit Nebel, Filtration mit Manometer, Presse schlägt zu, Trockenschrank glüht, Waage zeigt das Gewicht, Zentrifuge und Mining-Rig-Lüfter drehen, der Laptop zeigt einen laufenden Terminal-Bildschirm. Ein Leuchtring markiert die nächste Station.
- **Minispiele & HUD:** neu gezeichnete Minispiele (Kolben, Flamme, Eisbad, Vakuum-Manometer, Wirbel, Presse), Glas-HUD mit Tasten-Hinweisen, animiertem Geld-/Ziel-Feedback und Fadenkreuz, das auf Interaktionen reagiert.

## Das Labor (3D-Version)

Freischalten: Tutorial-Ziele abschließen (Paket verkaufen, Arbeiter einstellen), Level 3 erreichen und bei Onkel Rick das Labor freischalten. Danach öffnet sich die **Stahltür in der Frontwand** des Gewächshauses – das Labor ist direkt angebaut, kein Ladebildschirm.

- **Raum 1 – Vorbereitung & Lager:** Spinde (Schutzausrüstung anlegen), gelber Chemikalien-Schrank (Zutaten kaufen), Rezept-Board (Ansatz starten), **Laptop** mit Mining-Rig.
- **Raum 2 – Kochlabor:** Analysenwaage, Magnetrührer, Abzug mit Heizrührer, Kühlbad, Vakuumfiltration, Trockenschrank, Tablettenpresse.
- **Laptop / Darknet (Satire):** SchwarzCoin (SCN) minen (Klick + Grafikkarten + Lüfter, Stromrechnung pro Tag), Kurs-Schwankungen und Meldungen, im Darknet-Markt **Anleitungen** (Spiel-Rezepte) und Zutaten per Drohne kaufen, Scam-Angebote inklusive. Tab „Anleitungen“ zeigt die Schrittliste samt Spiel-Tipps.
- **4 Produkte mit echten Namen:** Amphetamin, MDMA, Methamphetamin, LSD – unterschiedliche Schwierigkeit, Schritte und Preise.
- **Kochen = Geschicklichkeit:** jeder Schritt ist ein Minispiel (Dosieren, Rühren, Heizen, Kühlen, Filtern, Trocknen, Tablettieren). Qualität = Durchschnitt der Schritte, Marktpreis hängt von Qualität und Tagesmarkt ab. Siedeverzug ruiniert den Ansatz; ohne Schutzausrüstung kostet das Notaufnahme-Geld.
- **Ausrüstung:** Glasware (mehr Ausbeute) und Präzisions-Ausrüstung (größere Zielzonen) am Laptop.
- Verkauf der Produkte bei Onkel Rick.

## Straße, Auto, Post & Fahndung (3D)

Sobald du das erste Paket an Onkel Rick verkauft hast, geht die **Hintertür** (Ostwand des Gewächshauses) auf. Draußen liegen Hof, Straße, Häuser, ein Lieferwagen und die Postfiliale.

- **Straßenverkauf:** Auf dem Gehweg kommen Kunden auf dich zu (💬). **E** = ansprechen: Menge, Mindestqualität und Preis stehen im Menü. Straßenpreise liegen über Ricks Preisen, an den **💰-Straßenecken** kommen mehr Kunden mit besseren Preisen. „Mehr verlangen (+25 %)“ ist ein Risiko (Kunde geht, Lärm erhöht die Fahndung). Es werden Gras-Päckchen und alle selbst gekochten Produkte nachgefragt.
- **Fahndung 🚨:** Jeder Verkauf und jeder Blitzer erhöht sie, mit der Zeit sinkt sie. Ab 55 % taucht ein Polizist auf (Streifenwagen blinkt) und verfolgt dich. Mit Ware am Mann folgt **Festnahme** (70 % der Ware weg, Strafe, Fahndung zurück, du landest im Gewächshaus), ohne Ware nur eine Kontrolle. Verstecken geht im Gewächshaus oder in der Post, im Auto holt dich der Polizist nicht ein.
- **Lieferwagen:** **E** am Auto einsteigen/aussteigen, W/S Gas/Bremse, A/D lenken, Leertaste Handbremse. Tempolimit 40 km/h, zwei **Blitzer** an der Straße (Strafe + Fahndung). Kollisionen beschädigen mitgeführte Pakete.
- **Darknet-Aufträge:** Laptop → Tab **📦 Aufträge** (neue Aufträge kommen laufend, wenn du Rezepte hast): annehmen → am **Versandtisch** (Labor, Raum 1) packen und mitnehmen → mit dem Auto die Straße nach Norden zur **Postfiliale** (Entfernung im HUD) und am **Postschalter** (E) abgeben. Lohn in SCN: voller Lohn ab 80 % Paketzustand, danach Abzug, unter 20 % zerstört. Aufträge haben eine Frist.
- **Hotbar draußen:** 💰 Straßenpreise · 🚗 Auto · 📦 Pakete · 🚨 Fahndung (Tasten 1–4).
- **Multiplayer:** Verkäufe, Festnahmen, Pakete und Abgabe laufen über den Host (gemeinsames Geld/Ware/Fahndung). Kunden, Polizisten und dein Lieferwagen sind pro Spieler lokal; Mitspieler sehen deine Figur samt Auto beim Fahren.

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

## Darknet-Verkauf & Post

Am Laptop gibt es den Tab **📤 Darknet-Verkauf**: Ware (Pakete oder Labor-Produkte) mit Preisfaktor einstellen. Käufer bestellen von allein – je teurer, desto seltener (und je besser deine Händler-Bewertung, desto häufiger). Jede Bestellung ist ein **Paket, das du zur gelben Packstation auf der Straße bringen musst** (Porto $4, Frist 3 Tage). Nach dem Aufgeben kommt das Paket zum Tageswechsel an: Zahlung in **SCN**, Bewertung steigt oder sinkt je nach Qualität. Verpasste Frist = Storno + schlechtere Bewertung, 8 % Zoll-Risiko pro Paket.

## Gesundheit, Rausch & Gefahren beim Kochen

- **Gesundheitsbalken** (rechts unten). Regeneriert langsam, Erste-Hilfe-Schrank in Raum 1 heilt gegen Geld. **Bei 0 HP stirbst du**: Krankenhaus kostet 30 % Bargeld, die Labor-Ware ist zur Hälfte weg.
- **Beim Kochen kann alles schiefgehen** (rein fiktive Spielmechanik): Siedeverzug → Explosion; falsche Einwaage → giftige Dämpfe; zu wildes Rühren → ätzende Spritzer; Unterdruck/Gefrierbruch → Glasbruch; zweimal komplett verfehlte Schläge → Brand/Quetschung. **Abzug-Lüftung** (Schalter neben dem Abzug) muss beim Erhitzen laufen, sonst gibt es Gas. Schutzausrüstung reduziert den Schaden stark, ersetzt aber keine Präzision. Die Zielzonen sind enger geworden.
- **Eigenkonsum (F)**: jede Ware hat einen eigenen mehrminütigen Rausch-Effekt (Tempo, Bildfilter, Wackeln) und danach einen Crash. Unreine Ware (< 50 % Qualität) macht krank, **Mischkonsum kann zur Überdosis führen**.

## Wichtig / Rechtliches

Alles im Labor ist **frei erfunden**: Zutaten (z. B. „Grundstoff A“), Abläufe, Mengen, Zielzonen und Werte sind reine Spielmechanik und haben **keinen Bezug zu echter Herstellung**. Es gibt keine echten Anleitungen. Herstellung, Besitz und Handel mit Drogen sind in der Realität strafbar und gefährlich – das Spiel dient nur der Unterhaltung (ab 18). Im Spiel erscheint beim ersten Laborbesuch ein entsprechender Hinweis.
