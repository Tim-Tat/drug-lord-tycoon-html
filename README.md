# Drug Lord Tycoon – Fan-Nachbau (HTML)

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

## Wichtig / Rechtliches

Alles im Labor ist **frei erfunden**: Zutaten (z. B. „Grundstoff A“), Abläufe, Mengen, Zielzonen und Werte sind reine Spielmechanik und haben **keinen Bezug zu echter Herstellung**. Es gibt keine echten Anleitungen. Herstellung, Besitz und Handel mit Drogen sind in der Realität strafbar und gefährlich – das Spiel dient nur der Unterhaltung (ab 18). Im Spiel erscheint beim ersten Laborbesuch ein entsprechender Hinweis.
