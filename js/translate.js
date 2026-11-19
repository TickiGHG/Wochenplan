// =============================================================
// translate.js – übersetzt englische TheMealDB-Rezepte ins Deutsche
// Ablauf: Name, Zutaten, Einheiten und Schritte werden als Zeilen
// gesammelt, in EINER Anfrage übersetzt und wieder zurückverteilt.
// Jede Übersetzung wird gespeichert – jedes Rezept wird also nur
// einmal übersetzt und ist danach auch offline auf Deutsch.
//
// Dienste (der erste, der klappt, gewinnt):
//   1. Google Übersetzer (gute Qualität, kein Schlüssel nötig – aber
//      eine inoffizielle Schnittstelle, die Google jederzeit ändern kann)
//   2. MyMemory (offizielle Gratis-API, aber nur ca. 5000 Zeichen/Tag)
// =============================================================

const Translate = (() => {
  const KEY = 'translations';
  let cache = null; // { rezeptId: { name, ingredients[], units[], steps[], provider, at } }

  const load = () => cache || (cache = Store.get(KEY, {}));
  const get = id => load()[id] || null;
  const has = id => !!load()[id];

  function persist() {
    if (Store.set(KEY, cache)) return;
    // Speicher voll: die ältere Hälfte der Übersetzungen verwerfen und nochmal versuchen
    const ids = Object.keys(cache).sort((a, b) => cache[a].at - cache[b].at);
    ids.slice(0, Math.ceil(ids.length / 2)).forEach(id => delete cache[id]);
    Store.set(KEY, cache);
  }

  function remove(id) { load(); delete cache[id]; persist(); }
  function count() { return Object.keys(load()).length; }
  function clear() { cache = {}; Store.remove(KEY); }

  // ---------- Einheiten: feste Liste statt Maschine ----------
  // "tbs" oder "cup" allein versteht ein Übersetzer oft falsch.
  const UNITS = {
    cup: 'Tasse', cups: 'Tassen', tbsp: 'EL', tbs: 'EL', tblsp: 'EL', tbls: 'EL', tablespoon: 'EL', tablespoons: 'EL',
    tsp: 'TL', teaspoon: 'TL', teaspoons: 'TL', pinch: 'Prise', pinches: 'Prisen', clove: 'Zehe', cloves: 'Zehen',
    can: 'Dose', cans: 'Dosen', tin: 'Dose', tins: 'Dosen', slice: 'Scheibe', slices: 'Scheiben', handful: 'Handvoll',
    bunch: 'Bund', sprig: 'Zweig', sprigs: 'Zweige', dash: 'Spritzer', splash: 'Schuss', drizzle: 'etwas',
    large: 'groß', medium: 'mittel', small: 'klein', whole: 'ganz', chopped: 'gehackt', sliced: 'in Scheiben',
    diced: 'gewürfelt', minced: 'fein gehackt', grated: 'gerieben', 'to taste': 'nach Geschmack',
    'to serve': 'zum Servieren', garnish: 'zum Garnieren', 'to garnish': 'zum Garnieren', 'for frying': 'zum Braten',
    lb: 'Pfund', lbs: 'Pfund', pound: 'Pfund', pounds: 'Pfund', oz: 'oz', g: 'g', kg: 'kg', ml: 'ml', l: 'l',
    piece: 'Stück', pieces: 'Stück', packet: 'Packung', package: 'Packung', jar: 'Glas', stick: 'Stange', sticks: 'Stangen',
  };
  const unitFromList = u => {
    const k = String(u || '').trim().toLowerCase().replace(/\.$/, '');
    return k === '' ? '' : UNITS[k];
  };

  // ---------- Hilfen ----------
  // fetch mit Zeitlimit, damit ein hängender Dienst die App nicht blockiert
  async function fetchJson(url, ms = 15000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error('Fehler ' + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  // Teilt eine Zeilenliste in Pakete von höchstens maxChars Zeichen
  function chunks(lines, maxChars) {
    const out = [];
    let cur = [], len = 0;
    for (const line of lines) {
      if (cur.length && len + line.length > maxChars) { out.push(cur); cur = []; len = 0; }
      cur.push(line); len += line.length + 1;
    }
    if (cur.length) out.push(cur);
    return out;
  }

  // ---------- Dienst 1: Google ----------
  async function googleOne(text) {
    const json = await fetchJson('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=de&dt=t&q='
      + encodeURIComponent(text));
    // Antwort: [[["Übersetzung","Original",…], …], …] – Satzstücke zusammensetzen
    return json[0].map(part => part[0]).join('');
  }

  async function google(lines) {
    const out = [];
    for (const chunk of chunks(lines, 1500)) {
      // Zeilen mit \n verbinden: eine Anfrage statt 30
      const parts = (await googleOne(chunk.join('\n'))).split('\n');
      if (parts.length === chunk.length) out.push(...parts);
      else for (const line of chunk) out.push(await googleOne(line)); // Zeilen verrutscht -> einzeln
    }
    return out.map(s => s.trim());
  }

  // ---------- Dienst 2: MyMemory ----------
  async function myMemoryOne(text) {
    // MyMemory erlaubt max. 500 Zeichen pro Anfrage -> lange Schritte in Sätze zerlegen
    if (text.length > 480) {
      const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
      const parts = [];
      for (const c of chunks(sentences, 450)) parts.push(await myMemoryOne(c.join('').trim()));
      return parts.join(' ');
    }
    const json = await fetchJson('https://api.mymemory.translated.net/get?langpair=en|de&q=' + encodeURIComponent(text));
    if (json.responseStatus !== 200 && json.responseStatus !== '200') throw new Error(json.responseDetails || 'MyMemory-Fehler');
    if (json.quotaFinished) throw new Error('Tageslimit von MyMemory erreicht');
    return json.responseData.translatedText;
  }

  async function myMemory(lines) {
    const out = new Array(lines.length);
    let next = 0;
    // 3 Anfragen gleichzeitig: schneller als nacheinander, aber schonend für den Dienst
    const worker = async () => { while (next < lines.length) { const i = next++; out[i] = (await myMemoryOne(lines[i])).trim(); } };
    await Promise.all([worker(), worker(), worker()]);
    return out;
  }

  const PROVIDERS = [['Google Übersetzer', google], ['MyMemory', myMemory]];

  // Übersetzt eine Liste von Zeilen; probiert die Dienste nacheinander
  async function lines(list) {
    let lastError;
    for (const [name, fn] of PROVIDERS) {
      try {
        const result = await fn(list);
        if (result.length === list.length) return { result, provider: name };
      } catch (e) {
        lastError = e;
        console.warn('Übersetzung mit', name, 'fehlgeschlagen:', e);
      }
    }
    throw new Error('Übersetzung nicht möglich (' + (lastError?.message || 'unbekannt') + ')');
  }

  // ---------- ein Rezept übersetzen ----------
  const pending = new Map(); // läuft schon? Dann dasselbe Promise zurückgeben statt doppelt anfragen

  function recipe(r) {
    if (pending.has(r.id)) return pending.get(r.id);
    const job = (async () => {
      const src = r.original || r; // immer vom englischen Original aus übersetzen
      // Was übersetzt werden soll, als flache Zeilenliste – und merken, wo was steht
      const list = [src.name];
      const ingStart = list.length;
      list.push(...src.ingredients.map(i => i.name));
      const unitSlots = []; // [Zutat-Index, Zeilen-Index] für Einheiten, die nicht in der Liste stehen
      src.ingredients.forEach((ing, k) => {
        if (unitFromList(ing.unit) === undefined) { unitSlots.push([k, list.length]); list.push(ing.unit); }
      });
      const stepStart = list.length;
      list.push(...src.steps);

      const { result, provider } = await lines(list.map(l => l.replace(/\n/g, ' ')));

      const units = src.ingredients.map(i => unitFromList(i.unit) ?? i.unit);
      for (const [k, line] of unitSlots) units[k] = result[line];
      load()[r.id] = {
        name: result[0],
        ingredients: result.slice(ingStart, ingStart + src.ingredients.length),
        units,
        steps: result.slice(stepStart),
        provider,
        at: Date.now(),
      };
      persist();
    })();
    pending.set(r.id, job);
    return job.finally(() => pending.delete(r.id));
  }

  const isPending = id => pending.has(id);

  // Legt eine gespeicherte Übersetzung über ein Rezept (aufgerufen in recipes.js).
  // Das englische Original bleibt in r.original, damit man es anzeigen kann.
  // (t kann für Tests direkt übergeben werden)
  function apply(r, t = get(r.id)) {
    if (!t) return r;
    return {
      ...r,
      original: { name: r.name, ingredients: r.ingredients, steps: r.steps },
      name: t.name,
      ingredients: r.ingredients.map((i, k) => ({ ...i, unit: t.units[k] ?? i.unit, name: t.ingredients[k] || i.name })),
      steps: t.steps,
      lang: 'de',
      translatedBy: t.provider,
    };
  }

  // Einstellung: Online-Rezepte automatisch übersetzen (Standard: an)
  const auto = () => Store.get('autoTranslate', true);
  const setAuto = on => Store.set('autoTranslate', !!on);

  return { recipe, apply, get, has, remove, count, clear, isPending, auto, setAuto, UNITS };
})();
