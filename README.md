# Wochenplan – Gerichte für jeden Tag

Web-App (PWA) fürs Handy: erstellt per Knopfdruck einen Wochenplan mit einem anderen Gericht pro Tag,
inklusive Zutaten, Anleitung und Einkaufsliste. Läuft komplett im Browser, Daten bleiben auf dem Gerät.

## Funktionen

- **Wochenplan** pro Kalenderwoche, vor/zurück blättern, jeden Tag einzeln neu würfeln, sperren 🔒, leeren oder selbst wählen
- **Rezepte**: 57 eingebaute deutsche Rezepte + optional ~790 englische Rezepte von TheMealDB + eigene Rezepte
- **Filter**: Ernährungsform, mind. X fleischlose Tage, Fleischsorten ausschließen, gluten-/laktose-/nuss-/eifrei,
  Zutaten ausschließen, Küchen, max. Zeit (Werktag/Wochenende getrennt), Schwierigkeit, Tage, Portionen
- **Abwechslung**: keine Wiederholung aus den letzten X Wochen, nicht zweimal hintereinander gleiche Küche /
  gleiches Fleisch / gleicher Gerichtstyp, Favoriten werden öfter gezogen, „nie vorschlagen“-Liste,
  max. Anzahl englischer Online-Rezepte pro Woche
- **Online-Rezepte** werden beim ersten Start automatisch geladen und alle 30 Tage aktualisiert
- **Übersetzung** der englischen Rezepte ins Deutsche (Google Übersetzer, ersatzweise MyMemory) – automatisch
  beim Öffnen und für die Rezepte im Wochenplan, wird gespeichert, Original jederzeit einblendbar
- **Bilder**: eigenes Handyfoto > Foto der Quelle (TheMealDB bzw. Wikimedia Commons mit Bildnachweis) >
  gezeichnete Illustration passend zum Gerichtstyp; Fotos der Woche werden für offline gespeichert
- **Rezeptansicht** mit Portionsrechner
- **Einkaufsliste** für die Woche, zusammengefasst und umgerechnet, abhakbar, teilen/kopieren, Vorrat getrennt
- **Eigene Rezepte** anlegen/bearbeiten, oder fremde Rezepte als eigene Version kopieren (z. B. zum Übersetzen)
- **Sicherung** als JSON exportieren/importieren
- Funktioniert offline (Service Worker)

Vegetarisch/vegan/glutenfrei usw. wird **automatisch aus den Zutaten erkannt** (`js/classify.js`).
Bei echten Allergien trotzdem selbst prüfen.

## Lokal starten

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Dann im Browser `http://localhost:8080` öffnen. Tests: `http://localhost:8080/tests.html`.

## Aufs Handy bringen

Als App installieren (Startbildschirm, offline) geht nur über **HTTPS**. Am einfachsten:
den Ordner bei **GitHub Pages** (oder Netlify/Cloudflare Pages) hochladen, die Adresse auf dem Handy öffnen und
„Zum Startbildschirm hinzufügen“ wählen.

## Dateien

| Datei | Aufgabe |
|---|---|
| `js/storage.js` | Speichern im Browser (localStorage), Backup |
| `js/classify.js` | erkennt Fleisch, Fisch, Milch, Ei, Gluten, Nüsse aus Zutatennamen |
| `js/recipes-builtin.js` | eingebaute Rezepte |
| `js/mealdb.js` | lädt & übersetzt TheMealDB-Rezepte |
| `js/translate.js` | übersetzt TheMealDB-Rezepte, speichert die Übersetzungen |
| `js/recipes.js` | führt alle Quellen zusammen, eigene Rezepte |
| `js/images.js` | Bildauswahl, Wikimedia-Fotoliste, eigene Fotos (IndexedDB), Platzhalter-Zeichnungen |
| `js/planner.js` | Filter + Wochenplan-Algorithmus + Kalenderwochen |
| `js/shopping.js` | Einkaufsliste |
| `js/icons.js` | Symbole (SVG) für Knöpfe und Navigation |
| `js/app.js` | Oberfläche: alle Bildschirme |
| `style.css` | Design (Farben, hell/dunkel, Karten, Schalter) |
| `tests.html` | automatische Tests der Logik |
| `LERNEN.md` | Erklärung, wie alles funktioniert |
