# Wie die Wochenplan-App funktioniert

Erklärung Baustein für Baustein, damit du den Code verstehst und selbst erweitern kannst.

## Das große Bild

```
Rezepte (eingebaut / TheMealDB / eigene)
        │  recipes.js bringt alle ins gleiche Format
        ▼
classify.js: Was steckt drin? (Fleisch? Milch? Gluten?)
        │
        ▼
planner.js: Filter anwenden → für jeden Tag ein Rezept ziehen
        │
        ▼
app.js zeigt es an   ·   shopping.js macht die Einkaufsliste   ·   storage.js speichert alles
```

Wichtiges Prinzip: **Logik und Oberfläche sind getrennt.** `planner.js`, `classify.js` und `shopping.js`
wissen nichts vom Bildschirm. Deshalb können wir sie in `tests.html` automatisch testen und später die UI
komplett neu bauen, ohne die Logik anzufassen.

## Warum mehrere `<script>`-Dateien statt Modulen?

In `index.html` werden die Dateien nacheinander geladen. Jede Datei legt **ein** Objekt an
(`Store`, `Classify`, `Planner` …), das die späteren Dateien benutzen können. Die Reihenfolge ist deshalb
wichtig. Vorteil: Läuft ohne Build-Tools, ohne Node, ohne Installation.

Das Muster `const Planner = (() => { ... return { ... }; })();` heißt **IIFE** (sofort ausgeführte Funktion).
Alles innerhalb ist privat; nur was im `return` steht, ist von außen erreichbar.

## storage.js – Speichern

`localStorage` ist ein kleiner Schlüssel-Wert-Speicher im Browser (ca. 5 MB). Er kann nur Text speichern,
deshalb `JSON.stringify` beim Schreiben und `JSON.parse` beim Lesen. Alles steckt in `try/catch`, weil
localStorage z. B. im privaten Modus Fehler werfen kann – die App soll dann trotzdem laufen.

## classify.js – Was ist in einem Rezept?

Für jede Eigenschaft gibt es eine Liste von **Suchwörtern** und **Ausnahmen**:

- `milch` sucht nach „milch“, „sahne“, „käse“ … – aber **zuerst** werden Ausnahmen wie „kokosmilch“ oder
  „erdnussbutter“ aus dem Text entfernt. Sonst wäre ein veganes Curry mit Kokosmilch „nicht vegan“.
- `ei` wird mit einem **regulären Ausdruck** gesucht: `\b(ei|eier|…)\b`. `\b` bedeutet Wortgrenze. Ohne das
  würde „ei“ in „R**ei**s“ oder „Zwi**e**b**e**l“ gefunden.

Aus den gefundenen Eigenschaften ergibt sich: vegetarisch = kein Fleisch/Fisch, vegan = zusätzlich keine Milch,
kein Ei, kein Honig.

**Fehler, die beim Testen aufgefallen sind (und wie sie gelöst wurden):**
1. Der Ausdruck war zuerst `eier?`. Das heißt aber „eie + optional r“ – das einzelne Wort „Ei“ wurde nie
   erkannt. Lösung: `ei|eier` ausschreiben. Gefunden durch einen Test, nicht durch Hinschauen!
2. „Tamarindenpaste“ enthält „rind“ → Pad Thai galt als Rindfleischgericht. Lösung: Ausnahme „tamarind“.
3. Grünes Curry mit Hähnchen galt wegen **Fischsauce** als Fischgericht. Lösung: eigene Kategorie
   `fischwuerze` – macht ein Gericht nicht vegetarisch, ist aber nie die „Hauptzutat“.
4. „mehligkochende Kartoffeln“ enthält „mehl“ → Ausnahme „mehlig“.

## planner.js – der Wochenplan-Algorithmus

### 1. Filtern
`checkRecipe(rezept, einstellungen)` prüft nacheinander alle Filter und gibt **den Grund** zurück, warum ein
Rezept nicht passt (oder `null`, wenn es passt). Der Grund wird in der Rezeptliste angezeigt („✗ enthält
Gluten“) – so verstehst du, warum etwas nie vorgeschlagen wird.

### 2. Fleischlose Tage verteilen
Bei „mindestens 2 fleischlose Tage“ werden 2 der offenen Tage zufällig ausgewählt (`sample` mischt die Liste
mit dem **Fisher-Yates-Verfahren**). An diesen Tagen wird zuerst nur unter vegetarischen Rezepten gesucht.

### 3. Jeden Tag füllen – mit schrittweisem Lockern
Das ist die wichtigste Idee: Statt bei zu strengen Filtern einfach „nichts gefunden“ zu sagen, probiert
`pickForDay` mehrere Stufen von streng nach locker:

| Stufe | Bedingung |
|---|---|
| 1 | nicht schon diese Woche, nicht in den letzten Wochen, Abwechslung zu den Nachbartagen ok |
| 2 | wie 1, aber Abwechslung egal → Warnung „Abwechslung gelockert“ |
| 3 | nur noch „nicht schon diese Woche“ → Warnung „aus den letzten Wochen wiederholt“ |

Und das jeweils für: (vegetarisch + Zeitlimit) → (Zeitlimit) → (ohne Zeitlimit) → (mehr Online-Rezepte).
Die erste Stufe, in der es Kandidaten gibt, gewinnt. Jede Lockerung erzeugt einen Hinweis in der App.

### 4. Gewichteter Zufall
`weightedPick`: Jedes Rezept bekommt ein Gewicht (Favoriten 3, andere 1). Man zieht eine Zufallszahl zwischen 0
und der Summe aller Gewichte und läuft die Liste ab, bis die Zahl „aufgebraucht“ ist. Favoriten kommen so
dreimal so oft, aber nicht immer.

### 5. Seed-Zufall für Tests
`seededRng(42)` liefert immer dieselbe Zufallsfolge. So erzeugen Tests reproduzierbare Pläne – wenn ein Test
bei Seed 137 fehlschlägt, kann man genau diesen Fall nachstellen.

### 6. Kalenderwochen
Nach ISO 8601: Woche beginnt Montag, KW 1 ist die Woche mit dem 4. Januar. Trick in `weekKey`: Man springt
auf den **Donnerstag** derselben Woche – dessen Jahr ist immer das Jahr der Kalenderwoche.
Beispiel: Fr 1.1.2027 gehört zu KW 53/**2026**.

## shopping.js – Einkaufsliste

- Umrechnung: `Faktor = gewünschte Portionen / Portionen des Rezepts`
- kg → g und l → ml werden vorher in die Grundeinheit umgerechnet, damit „500 g Mehl“ + „1 kg Mehl“ zu
  „1,5 kg Mehl“ zusammengefasst werden können.
- Klammertexte werden für den Vergleich entfernt: „Kichererbsen (à 240 g)“ = „Kichererbsen (ca. 240 g)“.
- Mengen werden auf Viertel gerundet und als ¼ ½ ¾ angezeigt.

## app.js – Oberfläche

- `data` = was gespeichert wird, `state` = was gerade angezeigt wird.
- `render()` baut den ganzen Bildschirm neu aus `data` + `state`. Einfach und fehlerarm.
- **Event-Delegation**: Statt jedem Knopf einen eigenen Klick-Handler zu geben, gibt es einen einzigen für das
  ganze Dokument. Jeder Knopf hat `data-action="reroll"` – der Handler ruft dann `actions.reroll()` auf.
- `esc()` wandelt `<`, `>`, `&` usw. um, damit Text aus Rezepten nie als HTML ausgeführt wird (Sicherheit).

## images.js – Bilder

`Images.forRecipe(rezept)` entscheidet in fester Reihenfolge: **eigenes Foto → Foto der Quelle → Platzhalter**.

- **Wikimedia-Fotos:** Für 50 der 57 eingebauten Rezepte wurde je ein Foto von Wikimedia Commons ausgesucht
  und angesehen (z. B. zeigte das automatisch gefundene Bild für „Dal“ nur rohe Linsen, für „Teriyaki“ eine
  Ente – solche wurden ersetzt). Die Lizenzen (CC BY, CC BY-SA, CC0) erlauben die Nutzung, verlangen aber
  **Namensnennung** – deshalb steht unter jedem Foto Urheber + Lizenz mit Link. Wikimedia liefert verkleinerte
  Bilder nur in festen Breiten (330, 960 …), daher `330px-` für Listen und `960px-` für die Detailansicht.
- **TheMealDB-Fotos:** Die Endung `/small` bzw. `/medium` an der Bildadresse liefert kleinere Versionen
  (7 KB statt 100 KB) – wichtig, wenn eine Liste 60 Bilder zeigt.
- **Eigene Fotos** liegen in **IndexedDB**, einer Browser-Datenbank, die – anders als localStorage – auch
  große Binärdaten (Blobs) speichern kann. Vor dem Speichern wird das Foto über ein `<canvas>` auf max.
  1280 px verkleinert (aus 4 MB werden ~200 KB). Angezeigt wird es über `URL.createObjectURL(blob)`.
- **Platzhalter** sind kleine SVG-Zeichnungen, direkt im Code als Text erzeugt und als `data:`-Adresse ins
  `<img>` gesteckt. Die Hintergrundfarbe kommt aus einem **Hash** des Küchennamens – gleiche Küche, gleiche Farbe.
- `onerror` am Bild: Lädt ein Foto nicht (offline, Server weg), wird es durch den Platzhalter ersetzt.

## translate.js – Englische Rezepte übersetzen

- **Eine Anfrage pro Rezept:** Name, Zutaten, Einheiten und Schritte werden zu einer Zeilenliste zusammengefügt
  (getrennt durch `\n`), auf einmal übersetzt und danach anhand der Zeilennummern wieder verteilt. Kommt eine
  andere Zeilenzahl zurück, wird zur Sicherheit Zeile für Zeile übersetzt.
- **Einheiten aus einer festen Liste:** „tbs“ oder „cup“ allein versteht ein Übersetzer oft falsch, deshalb
  steht in `UNITS` z. B. `tbs → EL`. Nur unbekannte Einheiten gehen an den Dienst.
- **Zwei Dienste mit Ausweichen:** zuerst der Google Übersetzer (inoffizielle Gratis-Adresse, sehr gut, kann aber
  irgendwann wegfallen), bei einem Fehler MyMemory (offiziell, aber max. ~5000 Zeichen pro Tag und 500 pro
  Anfrage – lange Schritte werden deshalb in Sätze zerlegt). `fetchJson` bricht nach 15 Sekunden ab.
- **Übersetzung als Schicht:** Gespeichert wird nur die Übersetzung (`wp.translations`). `Translate.apply` legt sie
  beim Aufbau der Rezeptliste über das Rezept und hebt das Original in `r.original` auf. Wichtig: Die
  Klassifizierung (Fleisch? Gluten?) läuft **vorher** auf dem englischen Text – der ist dafür erprobt.
- **Doppelte Anfragen vermeiden:** `pending` merkt sich laufende Übersetzungen. Wer dasselbe Rezept nochmal anfragt,
  bekommt dasselbe Promise zurück.
- Ist der Speicher voll, wird die ältere Hälfte der Übersetzungen verworfen; sie lassen sich ja neu erzeugen.
  Deshalb sind Übersetzungen (wie die TheMealDB-Daten) auch nicht in der Sicherungsdatei.

## style.css + icons.js – das Design

- **Design-Tokens:** Alle Farben, Abstände und Schriften stehen oben als CSS-Variablen (`--bg`, `--accent` …).
  Der Dunkelmodus (`@media (prefers-color-scheme: dark)`) tauscht **nur diese Variablen** aus, der Rest des CSS
  bleibt gleich. Willst du die Akzentfarbe ändern, reicht eine Zeile.
- **Zwei Terrakotta-Töne:** `--accent` für Flächen (Knöpfe), `--accent-ink` (dunkler) für Text. Helles Orange als
  Schrift auf Weiß wäre schlecht lesbar (zu wenig Kontrast).
- **Symbole** (`icons.js`) sind kleine SVG-Zeichnungen mit `stroke="currentColor"`: Sie nehmen automatisch die
  Textfarbe des Knopfs an, also auch die Farbe im Dunkelmodus und im aktiven Reiter.
- **Schalter und Chips ohne JavaScript:** Ein Schalter ist eine normale Checkbox mit `appearance: none` und einem
  `::after`-Kreis, der bei `:checked` nach rechts rutscht. Die Auswahl-Chips (Küchen, Tage) verstecken die
  Checkbox, und `label:has(input:checked)` färbt den Chip, wenn sie angehakt ist. Die App-Logik merkt davon
  nichts: Sie liest weiterhin ganz normale Checkboxen.
- **Rezeptraster:** `grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))` zeigt so viele Spalten, wie
  hinpassen: 2 auf dem Handy, mehr auf dem Tablet.
- **Zutaten aufräumen:** `ingredientParts` in app.js trennt echte Einheiten („EL“, „g“) von Beschreibungen
  („klein, fein gewürfelt“). Beschreibungen kommen in Klammern hinter den Namen.

## sw.js – Offline

Der Service Worker sitzt zwischen App und Netzwerk. Strategie „**erst Netz, dann Cache**“: Online wird immer die
neueste Version geladen und nebenbei gespeichert; offline kommt die gespeicherte. Zuerst hatte ich „erst Cache“
– dann zeigte der Browser nach Code-Änderungen aber weiter die alte Version an.

Für **Fotos** gilt das Gegenteil: „**erst Cache**“, denn ein Foto ändert sich nie. Sie landen in einem eigenen
Cache (max. 400 Bilder, die ältesten fliegen raus). Nach dem Würfeln einer Woche lädt die App die Fotos dieser
Woche schon vorab (`Images.prefetch`) – so sind sie beim Kochen auch ohne Netz da.

## Ideen zum Selbst-Erweitern

- Neues Rezept in `recipes-builtin.js` ergänzen (Format oben in der Datei)
- Neuen Filter: Feld in `DEFAULT_SETTINGS`, Prüfung in `checkRecipe`, Eingabe in `viewFilters`, Test in `tests.html`
- Nährwerte, Bewertungen mit Sternen, Mittag + Abend pro Tag …
