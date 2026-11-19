// =============================================================
// planner.js – Filter und Wochenplan-Generator
// Reine Logik ohne Bildschirm-Code: bekommt Rezepte + Einstellungen
// und gibt einen Plan zurück. Dadurch lässt sie sich gut testen.
// =============================================================

const Planner = (() => {
  const DAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

  const DEFAULT_SETTINGS = {
    diet: 'alles',                 // 'alles' | 'vegetarisch' | 'vegan'
    excludeProteins: [],           // z. B. ['schwein', 'fisch']
    glutenFree: false,
    lactoseFree: false,
    nutFree: false,
    eggFree: false,
    excludeIngredients: '',        // Freitext, kommagetrennt: "Pilze, Koriander"
    cuisines: [],                  // leer = alle Küchen erlaubt
    categories: ['Hauptgericht'],
    maxTimeWeekday: 45,            // Minuten Mo–Fr (0 = egal)
    maxTimeWeekend: 0,             // Minuten Sa–So (0 = egal)
    maxDifficulty: 3,              // 1 einfach … 3 aufwendig
    allowUnknown: true,            // Rezepte ohne Zeit-/Schwierigkeitsangabe (TheMealDB) zulassen
    days: [true, true, true, true, true, true, true],
    servings: 2,
    veggieDays: 2,                 // mindestens so viele fleischlose Tage (nur bei diet 'alles')
    noRepeatWeeks: 3,              // Rezepte der letzten X Wochen nicht wiederholen
    varietyCuisine: true,          // nicht zweimal hintereinander dieselbe Küche
    varietyProtein: true,          // nicht zweimal hintereinander dasselbe Fleisch/Fisch
    varietyType: true,             // nicht zweimal hintereinander Pasta/Suppe/Curry …
    preferFavorites: true,
    maxOnlinePerWeek: 2,           // höchstens so viele TheMealDB-Rezepte (englisch) pro Woche
    sources: { builtin: true, mealdb: true, custom: true },
    pantry: 'Salz, Pfeffer, Öl, Olivenöl, Rapsöl, Sonnenblumenöl, Zucker, Mehl, Paprikapulver, Oregano',
  };

  // Gerichtstypen, die nicht zweimal hintereinander kommen sollen
  const TYPE_TAGS = ['Pasta', 'Suppe', 'Eintopf', 'Curry', 'Wok', 'Bowl', 'Ofen'];

  function withDefaults(settings) {
    const s = { ...DEFAULT_SETTINGS, ...(settings || {}) };
    s.sources = { ...DEFAULT_SETTINGS.sources, ...(settings?.sources || {}) };
    return s;
  }

  function parseTerms(text) {
    return String(text || '').split(/[,;\n]/).map(t => t.trim().toLowerCase()).filter(Boolean);
  }

  // ---------------------------------------------------------------
  // FILTER: Gibt null zurück, wenn das Rezept passt, sonst den Grund.
  // (Der Grund wird in der Rezeptliste angezeigt – hilft beim Verstehen,
  // warum ein Rezept nie vorgeschlagen wird.)
  // ---------------------------------------------------------------
  function checkRecipe(r, s) {
    if (!s.sources[r.source]) return 'Quelle ausgeschaltet';
    if (s.categories.length && !s.categories.includes(r.category)) return 'Kategorie: ' + r.category;
    if (s.diet === 'vegetarisch' && !r.flags.vegetarian) return 'nicht vegetarisch';
    if (s.diet === 'vegan' && !r.flags.vegan) return 'nicht vegan';
    const badProtein = r.proteins.find(p => s.excludeProteins.includes(p));
    if (badProtein) return 'enthält ' + Classify.PROTEIN_LABELS[badProtein];
    if (s.glutenFree && !r.flags.glutenFree) return 'enthält Gluten';
    if (s.lactoseFree && !r.flags.lactoseFree) return 'enthält Milchprodukte';
    if (s.nutFree && !r.flags.nutFree) return 'enthält Nüsse';
    if (s.eggFree && !r.flags.eggFree) return 'enthält Ei';
    if (s.cuisines.length && !s.cuisines.includes(r.cuisine)) return 'Küche: ' + r.cuisine;
    if (r.difficulty == null) {
      if (!s.allowUnknown) return 'Schwierigkeit unbekannt';
    } else if (r.difficulty > s.maxDifficulty) return 'zu aufwendig';
    const terms = parseTerms(s.excludeIngredients);
    const hit = terms.find(t => r.name.toLowerCase().includes(t) || r.ingredients.some(i => i.name.toLowerCase().includes(t)));
    if (hit) return 'enthält „' + hit + '“';
    return null;
  }

  function maxTimeForDay(dayIndex, s) {
    return dayIndex >= 5 ? s.maxTimeWeekend : s.maxTimeWeekday;
  }

  function timeOk(r, maxTime, s) {
    if (!maxTime) return true;                 // 0 / leer = egal
    if (r.time == null) return s.allowUnknown;
    return r.time <= maxTime;
  }

  function filterRecipes(recipes, settings) {
    const s = withDefaults(settings);
    return recipes.filter(r => checkRecipe(r, s) === null);
  }

  // ---------------------------------------------------------------
  // ABWECHSLUNG: darf Rezept r neben den Nachbartagen stehen?
  // ---------------------------------------------------------------
  function varietyOk(r, neighbors, s) {
    for (const n of neighbors) {
      if (!n) continue;
      if (s.varietyCuisine && n.cuisine === r.cuisine) return false;
      if (s.varietyProtein && r.proteins.length && n.mainProtein === r.mainProtein) return false;
      if (s.varietyType && TYPE_TAGS.some(t => r.tags.includes(t) && n.tags.includes(t))) return false;
    }
    return true;
  }

  // ---------------------------------------------------------------
  // ZUFALL: gewichtete Auswahl. Favoriten bekommen ein höheres Gewicht,
  // werden also öfter gezogen, aber nicht immer.
  // ---------------------------------------------------------------
  function weightedPick(list, weightOf, rng) {
    const weights = list.map(weightOf);
    const total = weights.reduce((a, b) => a + b, 0);
    let x = rng() * total;
    for (let i = 0; i < list.length; i++) {
      x -= weights[i];
      if (x < 0) return list[i];
    }
    return list[list.length - 1];
  }

  // Seed-basierter Zufallsgenerator (mulberry32) – gleiche Zahl = gleicher Plan.
  // Wird für Tests genutzt; in der App reicht Math.random.
  function seededRng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function sample(arr, n, rng) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  // ---------------------------------------------------------------
  // EINEN TAG FÜLLEN
  // Versucht zuerst die strengste Variante und lockert dann Schritt für
  // Schritt, bis etwas passt. Jede Lockerung erzeugt eine Warnung.
  // ---------------------------------------------------------------
  function pickForDay(ctx, dayIndex) {
    const { pool, s, resolved, used, recent, favorites, exclude, rng } = ctx;
    const vegDay = ctx.vegDays.has(dayIndex);
    const maxTime = maxTimeForDay(dayIndex, s);
    const neighbors = [resolved[dayIndex - 1], resolved[dayIndex + 1]];
    const allAvailable = pool.filter(r => !exclude.has(r.id));
    // Online-Kontingent aufgebraucht? Dann erstmal ohne TheMealDB-Rezepte suchen
    const onlineFull = ctx.onlineCount >= s.maxOnlinePerWeek;
    const available = onlineFull ? allAvailable.filter(r => r.source !== 'mealdb') : allAvailable;

    // Kandidaten-Mengen, von streng nach locker
    const buildSets = (avail, extraWarn) => {
      const out = [];
      const inTime = avail.filter(r => timeOk(r, maxTime, s));
      if (vegDay) out.push({ list: inTime.filter(r => r.flags.vegetarian), warn: extraWarn });
      out.push({ list: inTime, warn: vegDay ? 'kein passendes vegetarisches Rezept' : extraWarn });
      if (maxTime) out.push({ list: avail, warn: 'kein Rezept unter ' + maxTime + ' Min – Zeitlimit ignoriert' });
      return out;
    };
    const sets = buildSets(available, null);
    if (onlineFull) sets.push(...buildSets(allAvailable, 'mehr Online-Rezepte als eingestellt'));

    const tiers = [
      { test: r => !used.has(r.id) && !recent.has(r.id) && varietyOk(r, neighbors, s), warn: null },
      { test: r => !used.has(r.id) && !recent.has(r.id), warn: 'Abwechslung gelockert' },
      { test: r => !used.has(r.id), warn: 'Rezept aus den letzten Wochen wiederholt' },
    ];

    const weightOf = r => (s.preferFavorites && favorites.has(r.id) ? 3 : 1);

    for (const set of sets) {
      for (const tier of tiers) {
        const candidates = set.list.filter(tier.test);
        if (candidates.length) {
          return {
            recipe: weightedPick(candidates, weightOf, rng),
            warnings: [set.warn, tier.warn].filter(Boolean),
          };
        }
      }
    }
    return { recipe: null, warnings: ['kein Rezept passt zu deinen Filtern'] };
  }

  function makeContext({ recipes, settings, recentIds, favorites, blocked, rng }) {
    const s = withDefaults(settings);
    const blockedSet = new Set(blocked || []);
    return {
      s,
      pool: filterRecipes(recipes, s).filter(r => !blockedSet.has(r.id)),
      byId: new Map(recipes.map(r => [r.id, r])),
      recent: new Set(recentIds || []),
      favorites: new Set(favorites || []),
      rng: rng || Math.random,
      exclude: new Set(),
      vegDays: new Set(),
      onlineCount: 0,
    };
  }

  // ---------------------------------------------------------------
  // GANZE WOCHE ERSTELLEN
  // previous = bisheriger Plan dieser Woche; gesperrte Tage (locked) bleiben.
  // ---------------------------------------------------------------
  function generateWeek(opts) {
    const ctx = makeContext(opts);
    const { s, byId, rng } = ctx;
    const prev = opts.previous?.days || [];

    const days = DAY_NAMES.map((_, i) => (prev[i]?.locked && prev[i].recipeId
      ? { ...prev[i] }
      : { recipeId: null, name: null, locked: false, planned: !!s.days[i] }));

    ctx.resolved = days.map(d => (d.recipeId ? byId.get(d.recipeId) || null : null));
    ctx.used = new Set(days.map(d => d.recipeId).filter(Boolean));
    ctx.onlineCount = ctx.resolved.filter(r => r && r.source === 'mealdb').length;

    const open = days.map((d, i) => i).filter(i => s.days[i] && !days[i].locked);

    // Fleischlose Tage zufällig auf die offenen Tage verteilen
    if (s.diet === 'alles' && s.veggieDays > 0) {
      const lockedVeg = ctx.resolved.filter(r => r && r.flags.vegetarian).length;
      const need = Math.max(0, s.veggieDays - lockedVeg);
      ctx.vegDays = new Set(sample(open, Math.min(need, open.length), rng));
    }

    const warnings = [];
    for (const i of open) {
      const res = pickForDay(ctx, i);
      days[i] = { recipeId: res.recipe?.id || null, name: res.recipe?.name || null, locked: false, planned: true };
      ctx.resolved[i] = res.recipe;
      if (res.recipe) ctx.used.add(res.recipe.id);
      if (res.recipe?.source === 'mealdb') ctx.onlineCount++;
      for (const w of res.warnings) warnings.push(DAY_NAMES[i] + ': ' + w);
    }

    return { days, warnings, servings: s.servings, createdAt: new Date().toISOString() };
  }

  // ---------------------------------------------------------------
  // EINEN TAG NEU WÜRFELN (andere Tage bleiben, wie sie sind)
  // ---------------------------------------------------------------
  function rerollDay(opts) {
    const ctx = makeContext(opts);
    const { s, byId } = ctx;
    const plan = opts.plan;
    const i = opts.dayIndex;
    const days = plan.days.map(d => ({ ...d }));

    ctx.resolved = days.map(d => (d.recipeId ? byId.get(d.recipeId) || null : null));
    ctx.used = new Set(days.filter((d, j) => j !== i).map(d => d.recipeId).filter(Boolean));
    if (days[i].recipeId) ctx.exclude.add(days[i].recipeId); // nicht dasselbe nochmal
    ctx.resolved[i] = null;
    ctx.onlineCount = ctx.resolved.filter(r => r && r.source === 'mealdb').length;

    if (s.diet === 'alles') {
      const vegOthers = ctx.resolved.filter(r => r && r.flags.vegetarian).length;
      if (vegOthers < s.veggieDays) ctx.vegDays.add(i);
    }

    const res = pickForDay(ctx, i);
    days[i] = { recipeId: res.recipe?.id || null, name: res.recipe?.name || null, locked: false, planned: true };
    return { plan: { ...plan, days }, warnings: res.warnings.map(w => DAY_NAMES[i] + ': ' + w) };
  }

  // ---------------------------------------------------------------
  // KALENDERWOCHEN (ISO 8601: Woche beginnt Montag, KW 1 enthält den 4. Januar)
  // Schlüssel-Format: "2026-W47"
  // ---------------------------------------------------------------
  function weekKey(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;            // Sonntag = 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);    // auf Donnerstag der Woche springen
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return d.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
  }

  // Montag einer Kalenderwoche als lokales Datum
  function weekMonday(key) {
    const [y, w] = key.split('-W').map(Number);
    const jan4 = new Date(y, 0, 4);
    const dayNum = jan4.getDay() || 7;
    return new Date(y, 0, 4 - dayNum + 1 + (w - 1) * 7);
  }

  function addWeeks(key, n) {
    const m = weekMonday(key);
    return weekKey(new Date(m.getFullYear(), m.getMonth(), m.getDate() + 7 * n));
  }

  function dayDate(key, dayIndex) {
    const m = weekMonday(key);
    return new Date(m.getFullYear(), m.getMonth(), m.getDate() + dayIndex);
  }

  // Alle Rezept-IDs aus den X Wochen VOR der Woche "key"
  function recentRecipeIds(plans, key, weeks) {
    const ids = [];
    for (let k = 1; k <= weeks; k++) {
      const p = plans[addWeeks(key, -k)];
      if (p) for (const d of p.days) if (d.recipeId) ids.push(d.recipeId);
    }
    return ids;
  }

  return {
    DAY_NAMES, DEFAULT_SETTINGS, withDefaults, checkRecipe, filterRecipes, timeOk, maxTimeForDay,
    generateWeek, rerollDay, weekKey, weekMonday, addWeeks, dayDate, recentRecipeIds, seededRng, parseTerms,
  };
})();

if (typeof module !== 'undefined') module.exports = Planner;
