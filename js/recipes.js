// =============================================================
// recipes.js – die Rezept-Datenbank der App
// Führt drei Quellen zusammen: eingebaut (builtin), TheMealDB (mealdb)
// und eigene Rezepte (custom). Alle werden in EIN einheitliches Format
// gebracht ("normalisiert") und automatisch klassifiziert.
// =============================================================

const RecipeDB = (() => {
  let list = null;      // alle Rezepte als Array
  let index = null;     // Map id -> Rezept, für schnellen Zugriff

  const CATEGORIES = ['Hauptgericht', 'Beilage', 'Vorspeise', 'Frühstück', 'Dessert'];
  const SOURCE_LABELS = { builtin: 'Eingebaut', mealdb: 'TheMealDB (EN)', custom: 'Eigenes Rezept' };

  function slug(text) {
    return String(text).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // Bringt ein Rezept aus beliebiger Quelle in unser Standardformat
  function normalize(raw, source) {
    const r = {
      id: raw.id,
      name: raw.name,
      cuisine: raw.cuisine || 'International',
      category: raw.category || 'Hauptgericht',
      time: raw.time == null || raw.time === '' ? null : Number(raw.time),
      difficulty: raw.difficulty == null || raw.difficulty === '' ? null : Number(raw.difficulty),
      servings: Number(raw.servings) || 4,
      tags: raw.tags || [],
      ingredients: (raw.ingredients || []).map(i => Array.isArray(i)
        ? { amount: i[0], unit: i[1] || '', name: i[2] }
        : { amount: i.amount ?? null, unit: i.unit || '', name: i.name }),
      steps: raw.steps || [],
      image: raw.image || null,
      sourceUrl: raw.sourceUrl || null,
      lang: raw.lang || 'de',
      baseRecipe: raw.baseRecipe || null, // Original, falls das eine "eigene Version" ist
      source,
    };
    Object.assign(r, Classify.analyzeRecipe(r, raw.extraProteins || []));
    return r;
  }

  function rebuild() {
    const builtin = BUILTIN_RECIPES.map(r => normalize({ ...r, id: 'b-' + slug(r.name) }, 'builtin'));
    // Klassifiziert wird auf dem englischen Original, danach kommt ggf. die deutsche Übersetzung drüber
    const mealdb = MealDB.cached().map(r => Translate.apply(normalize({ ...r, cuisine: MealDB.area(r.cuisine) }, 'mealdb')));
    const custom = Store.get('custom', []).map(r => normalize(r, 'custom'));
    list = [...builtin, ...custom, ...mealdb];
    index = new Map(list.map(r => [r.id, r]));
  }

  function all() { if (!list) rebuild(); return list; }
  function byId(id) { if (!index) rebuild(); return index.get(id) || null; }
  function invalidate() { list = null; index = null; }

  function cuisines() {
    return [...new Set(all().map(r => r.cuisine))].sort((a, b) => a.localeCompare(b, 'de'));
  }

  // ---------- eigene Rezepte ----------
  function getCustomRaw(id) {
    return Store.get('custom', []).find(r => r.id === id) || null;
  }

  function saveCustom(raw) {
    const customs = Store.get('custom', []);
    if (!raw.id) raw.id = 'c-' + Date.now().toString(36);
    const i = customs.findIndex(r => r.id === raw.id);
    if (i >= 0) customs[i] = raw; else customs.push(raw);
    Store.set('custom', customs);
    invalidate();
    return raw.id;
  }

  function deleteCustom(id) {
    Store.set('custom', Store.get('custom', []).filter(r => r.id !== id));
    invalidate();
  }

  // Macht aus einem beliebigen Rezept eine bearbeitbare Kopie (Rohformat)
  function toEditable(recipe) {
    return {
      name: recipe.name, cuisine: recipe.cuisine, category: recipe.category, time: recipe.time,
      difficulty: recipe.difficulty, servings: recipe.servings, tags: [...recipe.tags],
      ingredients: recipe.ingredients.map(i => ({ ...i })), steps: [...recipe.steps],
      image: recipe.image, sourceUrl: recipe.sourceUrl, lang: recipe.lang,
      baseRecipe: recipe.baseRecipe || recipe.id, // damit die Kopie das Foto des Originals behält
    };
  }

  // ---------- Zutatenzeilen aus dem Formular ----------
  const UNITS = {
    g: 'g', gr: 'g', kg: 'kg', ml: 'ml', l: 'l', el: 'EL', tl: 'TL', msp: 'Msp', stück: 'Stück', stk: 'Stück',
    prise: 'Prise', prisen: 'Prise', bund: 'Bund', dose: 'Dose', dosen: 'Dose', zehe: 'Zehe', zehen: 'Zehe',
    packung: 'Packung', pck: 'Packung', päckchen: 'Packung', scheibe: 'Scheibe', scheiben: 'Scheibe',
    blatt: 'Blatt', tasse: 'Tasse', tassen: 'Tasse', becher: 'Becher', glas: 'Glas', stange: 'Stange', stangen: 'Stange',
  };

  // "200 g Mehl" -> {amount: 200, unit: 'g', name: 'Mehl'};  "Salz" -> {amount: null, unit: '', name: 'Salz'}
  function parseIngredientLine(line) {
    let text = line.trim().replace(/½/g, '0.5').replace(/¼/g, '0.25').replace(/¾/g, '0.75');
    const m = text.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)\s*([a-zA-Zäöüß]+\.?)?\s+(.+)$/);
    if (!m) return { amount: null, unit: '', name: text };
    let amount = m[1].includes('/') ? m[1].split('/').reduce((a, b) => Number(a) / Number(b)) : Number(m[1].replace(',', '.'));
    const unitKey = (m[2] || '').replace('.', '').toLowerCase();
    if (m[2] && UNITS[unitKey]) return { amount, unit: UNITS[unitKey], name: m[3].trim() };
    // Kein bekanntes Einheitswort -> gehört zum Namen ("2 Eier")
    return { amount, unit: '', name: ((m[2] || '') + ' ' + m[3]).trim() };
  }

  function ingredientToLine(i) {
    return [i.amount == null ? '' : String(i.amount).replace('.', ','), i.unit, i.name].filter(Boolean).join(' ');
  }

  return {
    all, byId, invalidate, cuisines, saveCustom, deleteCustom, getCustomRaw, toEditable,
    parseIngredientLine, ingredientToLine, CATEGORIES, SOURCE_LABELS,
  };
})();
