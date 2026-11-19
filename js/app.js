// =============================================================
// app.js – Bildschirm & Bedienung (vorerst bewusst schlicht)
// Prinzip: Es gibt einen "state" (was gerade angezeigt wird) und
// "data" (was gespeichert ist). render() baut den Bildschirm jedes
// Mal neu aus diesen beiden. Klicks werden über data-action-Attribute
// an EINER Stelle ausgewertet (Event-Delegation).
// =============================================================

const App = (() => {
  // ---------- gespeicherte Daten ----------
  const data = {
    settings: Planner.withDefaults(Store.get('settings', {})),
    plans: Store.get('plans', {}),
    favorites: new Set(Store.get('favorites', [])),
    blocked: new Set(Store.get('blocked', [])),
    checked: Store.get('checked', {}),
  };

  // ---------- Bildschirmzustand ----------
  const state = {
    tab: 'woche',
    week: Planner.weekKey(new Date()),
    detail: null,          // geöffnetes Rezept (id)
    detailServings: null,
    pickDay: null,         // Tag, für den gerade ein Rezept ausgewählt wird
    form: null,            // Rohdaten des Rezeptformulars
    search: '',
    onlyMatching: true,
    listLimit: 60,         // Rezeptliste seitenweise, damit 800 Bilder nicht auf einmal laden
    warnings: [],
    mealdbStatus: '',
  };

  const save = {
    settings: () => Store.set('settings', data.settings),
    plans: () => Store.set('plans', data.plans),
    favorites: () => Store.set('favorites', [...data.favorites]),
    blocked: () => Store.set('blocked', [...data.blocked]),
    checked: () => Store.set('checked', data.checked),
  };

  // ---------- Hilfsfunktionen ----------
  const $ = sel => document.querySelector(sel);

  // Verhindert, dass Text aus Rezepten als HTML interpretiert wird
  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const fmtDate = d => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

  function weekLabel(key) {
    const mon = Planner.weekMonday(key);
    const sun = Planner.dayDate(key, 6);
    return 'KW ' + Number(key.split('-W')[1]) + ' · ' + fmtDate(mon) + '–' + fmtDate(sun) + sun.getFullYear();
  }

  const DIFF = { 1: 'einfach', 2: 'mittel', 3: 'aufwendig' };

  function planArgs() {
    return {
      recipes: RecipeDB.all(),
      settings: data.settings,
      recentIds: Planner.recentRecipeIds(data.plans, state.week, data.settings.noRepeatWeeks),
      favorites: data.favorites,
      blocked: data.blocked,
    };
  }

  const currentPlan = () => data.plans[state.week] || null;

  // ---------- TheMealDB laden (automatisch beim Start oder per Knopf) ----------
  async function fetchMealDB(auto) {
    if (state.mealdbLoading) return;
    state.mealdbLoading = true;
    state.mealdbStatus = 'Lade Online-Rezepte …';
    renderBanner();
    try {
      // Fortschritt nur im Banner aktualisieren, damit z. B. die Suche beim Tippen nicht gestört wird
      const n = await MealDB.fetchAll((done, total) => { state.mealdbStatus = `Lade Online-Rezepte … ${done}/${total}`; renderBanner(); });
      RecipeDB.invalidate();
      state.mealdbStatus = n + ' Online-Rezepte geladen.';
    } catch (e) {
      state.mealdbStatus = auto
        ? 'Online-Rezepte konnten nicht geladen werden – neuer Versuch beim nächsten Start.'
        : 'Fehler: ' + e.message + ' (Internetverbindung?)';
    }
    state.mealdbLoading = false;
    render();
    if (auto) setTimeout(() => { state.mealdbStatus = ''; renderBanner(); }, 5000);
  }

  // Beim ersten Start laden; danach alle 30 Tage im Hintergrund aktualisieren.
  // Wer die Online-Rezepte im Daten-Reiter entfernt hat, bekommt sie nicht ungefragt zurück.
  function autoLoadMealDB() {
    if (Store.get('mealdbOptOut', false) || !navigator.onLine) return;
    const info = MealDB.info();
    const stale = info && Date.now() - new Date(info.fetchedAt).getTime() > 30 * 86400000;
    if (!info || stale) fetchMealDB(true);
  }

  function prefetchWeek() {
    const plan = currentPlan();
    if (!plan) return;
    Images.prefetch(plan.days.map(d => d.recipeId && RecipeDB.byId(d.recipeId)));
    translateWeek();
  }

  // ---------- Übersetzen ----------
  // Übersetzt ein englisches Rezept (falls nötig) und zeichnet danach neu
  async function translateRecipe(id) {
    const r = RecipeDB.byId(id);
    if (!r || r.source !== 'mealdb' || Translate.has(id)) return;
    try {
      await Translate.recipe(r);
      RecipeDB.invalidate();         // damit die Übersetzung überall (Woche, Liste, Einkauf) auftaucht
      if (state.detail === id) state.translateError = '';
    } catch (e) {
      if (state.detail === id) state.translateError = e.message;
    }
    render();
  }

  // Englische Rezepte der aktuellen Woche nacheinander übersetzen (bei Auto-Übersetzen)
  async function translateWeek() {
    const plan = currentPlan();
    if (!plan || !Translate.auto() || !navigator.onLine) return;
    for (const d of plan.days) if (d.recipeId) await translateRecipe(d.recipeId);
  }

  // =============================================================
  // AKTIONEN
  // =============================================================
  const actions = {
    tab(el) {
      state.tab = el.dataset.tab; state.detail = null; state.form = null; state.listLimit = 60;
      if (state.tab !== 'rezepte') state.pickDay = null;
      window.scrollTo(0, 0);
    },
    showMore() { state.listLimit += 60; },
    weekPrev() { state.week = Planner.addWeeks(state.week, -1); state.warnings = []; },
    weekNext() { state.week = Planner.addWeeks(state.week, 1); state.warnings = []; },
    weekToday() { state.week = Planner.weekKey(new Date()); state.warnings = []; },

    generate() {
      const plan = Planner.generateWeek({ ...planArgs(), previous: currentPlan() });
      state.warnings = plan.warnings;
      delete plan.warnings;
      data.plans[state.week] = plan;
      save.plans();
      prefetchWeek();
    },
    reroll(el) {
      const i = Number(el.dataset.day);
      const res = Planner.rerollDay({ ...planArgs(), plan: currentPlan(), dayIndex: i });
      data.plans[state.week] = res.plan;
      state.warnings = res.warnings;
      save.plans();
      prefetchWeek();
    },
    lock(el) {
      const d = currentPlan().days[Number(el.dataset.day)];
      d.locked = !d.locked;
      save.plans();
    },
    clearDay(el) {
      const d = currentPlan().days[Number(el.dataset.day)];
      Object.assign(d, { recipeId: null, name: null, locked: false, planned: false });
      save.plans();
    },
    pick(el) {
      state.pickDay = Number(el.dataset.day);
      state.tab = 'rezepte';
      state.detail = null;
    },
    choose(el) {
      // gewähltes Rezept in den Tag eintragen (wird automatisch gesperrt)
      let plan = currentPlan();
      if (!plan) {
        plan = { days: Planner.DAY_NAMES.map(() => ({ recipeId: null, name: null, locked: false, planned: false })),
                 servings: data.settings.servings, createdAt: new Date().toISOString() };
        data.plans[state.week] = plan;
      }
      const r = RecipeDB.byId(el.dataset.id);
      plan.days[state.pickDay] = { recipeId: r.id, name: r.name, locked: true, planned: true };
      save.plans();
      state.pickDay = null;
      state.detail = null;
      state.tab = 'woche';
    },
    cancelPick() { state.pickDay = null; state.tab = 'woche'; },

    open(el) {
      state.detail = el.dataset.id; state.detailServings = data.settings.servings; state.showOriginal = false;
      state.translateError = '';
      window.scrollTo(0, 0);
      if (Translate.auto()) translateRecipe(state.detail); // läuft im Hintergrund, zeichnet danach neu
    },
    closeDetail() { state.detail = null; },

    // ---------- Übersetzen ----------
    translate(el) { return translateRecipe(el.dataset.id); },
    toggleOriginal() { state.showOriginal = !state.showOriginal; },
    removeTranslation(el) { Translate.remove(el.dataset.id); RecipeDB.invalidate(); state.showOriginal = false; },
    clearTranslations() {
      if (!confirm('Alle gespeicherten Übersetzungen löschen? Die Rezepte sind dann wieder englisch.')) return;
      Translate.clear(); RecipeDB.invalidate();
    },
    servingsMinus() { state.detailServings = Math.max(1, state.detailServings - 1); },
    servingsPlus() { state.detailServings = Math.min(20, state.detailServings + 1); },
    fav(el) {
      const id = el.dataset.id;
      data.favorites.has(id) ? data.favorites.delete(id) : data.favorites.add(id);
      save.favorites();
    },
    block(el) {
      const id = el.dataset.id;
      data.blocked.has(id) ? data.blocked.delete(id) : data.blocked.add(id);
      save.blocked();
    },

    // ---------- eigene Rezepte ----------
    newRecipe() {
      state.form = { name: '', cuisine: 'Deutsch', category: 'Hauptgericht', time: 30, difficulty: 1, servings: 4,
                     tags: [], ingredients: [], steps: [] };
      state.detail = null;
    },
    editRecipe(el) {
      const r = RecipeDB.byId(el.dataset.id);
      state.form = r.source === 'custom' ? { ...RecipeDB.getCustomRaw(r.id) } : RecipeDB.toEditable(r);
      if (r.source !== 'custom') state.form.name = r.name + ' (meine Version)';
      state.detail = null;
    },
    deleteRecipe(el) {
      if (!confirm('Dieses eigene Rezept wirklich löschen?')) return;
      RecipeDB.deleteCustom(el.dataset.id);
      state.detail = null;
    },
    saveForm() {
      const f = document.forms.recipe;
      const raw = {
        ...state.form,
        name: f.name.value.trim(),
        cuisine: f.cuisine.value.trim() || 'International',
        category: f.category.value,
        time: f.time.value ? Number(f.time.value) : null,
        difficulty: f.difficulty.value ? Number(f.difficulty.value) : null,
        servings: Number(f.servings.value) || 4,
        tags: f.tags.value.split(',').map(t => t.trim()).filter(Boolean),
        ingredients: f.ingredients.value.split('\n').map(l => l.trim()).filter(Boolean).map(RecipeDB.parseIngredientLine),
        steps: f.steps.value.split('\n').map(l => l.trim()).filter(Boolean),
      };
      if (!raw.name) return alert('Bitte einen Namen eingeben.');
      if (!raw.ingredients.length) return alert('Bitte mindestens eine Zutat eingeben.');
      delete raw.extraProteins;
      const id = RecipeDB.saveCustom(raw);
      state.form = null;
      state.detail = id;
      state.detailServings = data.settings.servings;
    },
    cancelForm() { state.form = null; },

    // ---------- Einkaufsliste ----------
    async shareList() {
      const text = Shopping.toText(shoppingList(), weekLabel(state.week));
      try {
        if (navigator.share) await navigator.share({ title: 'Einkaufsliste', text });
        else { await navigator.clipboard.writeText(text); alert('Einkaufsliste kopiert.'); }
      } catch (e) { /* abgebrochen */ }
    },
    uncheckAll() {
      for (const k of Object.keys(data.checked)) if (k.startsWith(state.week + '|')) delete data.checked[k];
      save.checked();
    },

    // ---------- eigene Fotos ----------
    async removePhoto(el) {
      if (!confirm('Dein Foto für dieses Rezept löschen?')) return;
      await OwnPhotos.remove(el.dataset.id);
    },

    // ---------- Daten ----------
    async loadMealDB() {
      Store.remove('mealdbOptOut');
      await fetchMealDB(false);
    },
    clearMealDB() {
      if (!confirm('TheMealDB-Rezepte vom Gerät entfernen? Sie werden dann auch nicht mehr automatisch geladen.')) return;
      MealDB.clear(); RecipeDB.invalidate(); state.mealdbStatus = 'Entfernt.';
      Store.set('mealdbOptOut', true);
    },
    exportData() {
      const blob = new Blob([JSON.stringify(Store.exportAll(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'wochenplan-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    resetAll() {
      if (!confirm('Wirklich ALLES löschen (Pläne, eigene Rezepte, Favoriten, Einstellungen)?')) return;
      Store.clearAll();
      location.reload();
    },
    resetFilters() {
      if (!confirm('Alle Filter auf Standard zurücksetzen?')) return;
      data.settings = Planner.withDefaults({});
      save.settings();
    },
  };

  // =============================================================
  // ANSICHTEN
  // Jede view…-Funktion gibt einen HTML-Text zurück. Die Klassen
  // (card, chip, pick, switch …) sind in style.css beschrieben.
  // =============================================================

  // Kleine farbige "Chips" unter einem Rezeptnamen: Zeit, Fleisch/vegetarisch, Küche
  function metaChips(r, withCuisine = true) {
    const c = [`<span class="chip">${icon('clock')} ${r.time ? r.time + ' Min' : '? Min'}</span>`];
    if (r.flags.vegan) c.push(`<span class="chip green">${icon('leaf')} Vegan</span>`);
    else if (r.flags.vegetarian) c.push(`<span class="chip green">${icon('leaf')} Vegetarisch</span>`);
    else if (r.mainProtein) c.push(`<span class="chip">${esc(Classify.PROTEIN_LABELS[r.mainProtein])}</span>`);
    if (withCuisine) c.push(`<span class="chip">${esc(r.cuisine)}</span>`);
    return `<div class="chips">${c.join('')}</div>`;
  }

  // Echte Mengeneinheiten bleiben vor dem Namen ("2 EL Öl").
  // Beschreibungen wie "klein, fein gewürfelt" wandern dahinter: "1 Rote Zwiebel (klein, fein gewürfelt)".
  const MEASURES = new Set(['g', 'kg', 'ml', 'l', 'el', 'tl', 'msp', 'stück', 'prise', 'prisen', 'bund', 'dose', 'dosen',
    'zehe', 'zehen', 'packung', 'scheibe', 'scheiben', 'blatt', 'tasse', 'tassen', 'becher', 'glas', 'stange', 'stangen',
    'pfund', 'oz', 'handvoll', 'zweig', 'zweige', 'spritzer', 'schuss', 'cup', 'cups', 'tbs', 'tbsp', 'tsp', 'lb', 'lbs',
    'pinch', 'clove', 'cloves', 'can', 'tin', 'slice', 'slices', 'bunch', 'handful', 'sprig', 'sprigs', 'dash']);
  function ingredientParts(i, factor) {
    const amount = i.amount == null ? null : i.amount * factor;
    if (!i.unit || MEASURES.has(i.unit.toLowerCase())) {
      return { amt: Shopping.formatAmount(amount, i.unit), name: i.name };
    }
    return { amt: amount == null ? '' : Shopping.formatAmount(amount, ''), name: `${i.name} (${i.unit})` };
  }

  // Kopf mit Wochenwechsel (für Woche und Einkauf)
  function weekHead() {
    const todayKey = Planner.weekKey(new Date());
    const rel = state.week === todayKey ? 'Diese Woche'
      : state.week === Planner.addWeeks(todayKey, 1) ? 'Nächste Woche'
      : state.week === Planner.addWeeks(todayKey, -1) ? 'Letzte Woche'
      : 'KW ' + Number(state.week.split('-W')[1]);
    return `
      <div class="pagehead">
        <button class="icon-btn" data-action="weekPrev" aria-label="Vorige Woche">${icon('left')}</button>
        <div class="title center">
          <h2>${rel}</h2>
          <div class="sub">${esc(weekLabel(state.week))}
            ${state.week !== todayKey ? ' · <button class="link" data-action="weekToday">Heute</button>' : ''}</div>
        </div>
        <button class="icon-btn" data-action="weekNext" aria-label="Nächste Woche">${icon('right')}</button>
      </div>`;
  }

  function viewWeek() {
    const plan = currentPlan();
    const todayKey = Planner.weekKey(new Date());
    const todayIdx = (new Date().getDay() + 6) % 7;
    let html = weekHead() + `
      <button class="primary wide" data-action="generate">${icon('dice')} ${plan ? 'Woche neu würfeln' : 'Woche planen'}</button>
      <p class="center muted small" style="margin:6px 0 16px">${plan
        ? 'Gesperrte Tage bleiben beim Würfeln erhalten.'
        : 'Die App sucht für jeden Tag ein passendes Gericht nach deinen Filtern aus.'}</p>`;

    if (state.warnings.length) {
      html += `<div class="warn"><strong>Hinweise</strong><ul>${state.warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul></div>`;
    }

    Planner.DAY_NAMES.forEach((dayName, i) => {
      const d = plan?.days[i];
      const r = d?.recipeId ? RecipeDB.byId(d.recipeId) : null;
      const isToday = state.week === todayKey && i === todayIdx;
      const label = `<div class="dayname">${dayName} <span class="date">· ${fmtDate(Planner.dayDate(state.week, i))}</span></div>`;

      if (r) {
        const id = esc(r.id);
        // Nur die ersten Bilder sofort laden, den Rest beim Hinscrollen
        const big = Images.img(r, 'large', '');
        const img = i < 2 ? big : big.replace('loading="eager"', 'loading="lazy"');
        html += `
          <article class="card day ${isToday ? 'today' : ''}">
            <button class="pic" data-action="open" data-id="${id}" aria-label="${esc(r.name)} öffnen">${img}</button>
            ${isToday ? '<span class="today-badge">HEUTE</span>' : ''}
            ${d.locked ? `<span class="lock-badge" title="Gesperrt">${icon('lock')}</span>` : ''}
            <div class="body">
              ${label}
              <h3><button data-action="open" data-id="${id}">${esc(r.name)}</button></h3>
              ${metaChips(r)}
              <div class="actions">
                <button class="soft grow" data-action="reroll" data-day="${i}">${icon('refresh')} Neu würfeln</button>
                <button class="icon-btn ${d.locked ? 'on' : ''}" data-action="lock" data-day="${i}"
                  aria-label="${d.locked ? 'Entsperren' : 'Sperren'}" title="${d.locked ? 'Entsperren' : 'Sperren'}">${icon(d.locked ? 'lock' : 'unlock')}</button>
                <button class="icon-btn" data-action="pick" data-day="${i}" aria-label="Selbst wählen" title="Selbst wählen">${icon('search')}</button>
                <button class="icon-btn" data-action="clearDay" data-day="${i}" aria-label="Tag leeren" title="Tag leeren">${icon('x')}</button>
              </div>
            </div>
          </article>`;
      } else {
        const text = d?.recipeId ? esc(d.name) + ' – Rezept nicht mehr verfügbar'
          : plan && d && !d.planned ? 'Nicht geplant'
          : plan ? 'Kein passendes Rezept gefunden'
          : 'Noch leer';
        html += `
          <article class="card day empty ${isToday ? 'today' : ''}">
            <div class="body">
              <div>${label}<div class="muted">${text}</div></div>
              ${plan ? `<button class="icon-btn" data-action="reroll" data-day="${i}" aria-label="Würfeln" title="Würfeln">${icon('refresh')}</button>` : ''}
              <button class="soft small-btn" data-action="pick" data-day="${i}">${icon('plus')} Wählen</button>
            </div>
          </article>`;
      }
    });
    return html;
  }

  function viewDetail() {
    const stored = RecipeDB.byId(state.detail);
    if (!stored) return '<p>Rezept nicht gefunden.</p><button data-action="closeDetail">Zurück</button>';
    // "Original anzeigen": englische Texte statt der Übersetzung
    const r = state.showOriginal && stored.original ? { ...stored, ...stored.original } : stored;
    const id = esc(r.id);
    const factor = state.detailServings / r.servings;
    const reason = Planner.checkRecipe(r, data.settings);
    const fav = data.favorites.has(r.id);
    const blocked = data.blocked.has(r.id);
    const pic = Images.forRecipe(r, 'large');
    const credit = pic.credit
      ? (pic.credit.url ? `<a href="${esc(pic.credit.url)}" target="_blank" rel="noopener">${esc(pic.credit.text)}</a>` : esc(pic.credit.text))
      : '';

    return `
      <figure class="detail-hero" style="margin-top:0">
        ${Images.img(r, 'large', '')}
        <div class="float">
          <button class="icon-btn" data-action="closeDetail" aria-label="Zurück">${icon('back')}</button>
          <span style="flex:1"></span>
          <label class="button icon-btn" title="${OwnPhotos.has(r.id) ? 'Eigenes Foto ersetzen' : 'Eigenes Foto aufnehmen'}" aria-label="Eigenes Foto">
            ${icon('camera')}<input type="file" accept="image/*" data-photo="${id}" hidden></label>
          <button class="icon-btn ${fav ? 'on' : ''}" data-action="fav" data-id="${id}" aria-label="Favorit" title="Favorit">
            ${icon('heart', fav ? 'style="fill:currentColor"' : '')}</button>
        </div>
        ${credit ? `<figcaption>Foto: ${credit}</figcaption>` : ''}
      </figure>

      <div class="detail-sheet">
        ${state.pickDay != null ? `<button class="primary wide" data-action="choose" data-id="${id}" style="margin-bottom:14px">${icon('check')} Für ${Planner.DAY_NAMES[state.pickDay]} wählen</button>` : ''}
        <h2>${esc(r.name)}</h2>
        <div class="chips">
          ${r.flags.vegan ? `<span class="chip green">${icon('leaf')} Vegan</span>` : r.flags.vegetarian ? `<span class="chip green">${icon('leaf')} Vegetarisch</span>` : ''}
          ${r.flags.glutenFree ? '<span class="chip">Glutenfrei</span>' : ''}
          ${r.flags.lactoseFree ? '<span class="chip">Laktosefrei</span>' : ''}
          ${!r.flags.nutFree ? '<span class="chip">Enthält Nüsse</span>' : ''}
          ${fav ? `<span class="chip accent">${icon('heart')} Favorit</span>` : ''}
        </div>

        <div class="facts">
          <div class="fact">${icon('clock')}<b>${r.time ? r.time + ' Min' : '?'}</b><span>Zeit</span></div>
          <div class="fact">${icon('flame')}<b>${r.difficulty ? DIFF[r.difficulty] : '?'}</b><span>Aufwand</span></div>
          <div class="fact">${icon('globe')}<b>${esc(r.cuisine)}</b><span>Küche</span></div>
        </div>

        ${reason ? `<div class="warn">Passt nicht zu deinen Filtern: ${esc(reason)}</div>` : ''}
        ${viewTranslation(stored)}

        <section class="card">
          <div class="row between">
            <h3 style="margin:0">Zutaten</h3>
            <div class="stepper">
              <button data-action="servingsMinus" aria-label="Weniger Portionen">${icon('minus')}</button>
              <b>${state.detailServings} Portionen</b>
              <button data-action="servingsPlus" aria-label="Mehr Portionen">${icon('plus')}</button>
            </div>
          </div>
          ${r.source === 'mealdb' ? '<p class="muted small" style="margin:8px 0 0">Originalportionen geschätzt</p>' : ''}
          <ul class="ingredients">
            ${r.ingredients.map(i => { const p = ingredientParts(i, factor); return `<li><span class="amt">${esc(p.amt)}</span><span>${esc(p.name)}</span></li>`; }).join('')}
          </ul>
        </section>

        <section class="card">
          <h3>Zubereitung</h3>
          <ol class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        </section>

        <div class="row wrap" style="margin-bottom:16px">
          <button data-action="editRecipe" data-id="${id}">${icon('edit')} ${r.source === 'custom' ? 'Bearbeiten' : 'Eigene Version'}</button>
          <button class="${blocked ? 'soft' : ''}" data-action="block" data-id="${id}">${icon('ban')} ${blocked ? 'Wird nie vorgeschlagen' : 'Nie vorschlagen'}</button>
          ${OwnPhotos.has(r.id) ? `<button data-action="removePhoto" data-id="${id}">${icon('trash')} Eigenes Foto löschen</button>` : ''}
          ${r.sourceUrl ? `<a class="button" href="${esc(r.sourceUrl)}" target="_blank" rel="noopener">${icon('link')} Originalquelle</a>` : ''}
          ${r.source === 'custom' ? `<button class="danger" data-action="deleteRecipe" data-id="${id}">${icon('trash')} Löschen</button>` : ''}
        </div>
        <p class="muted small">Quelle: ${esc(RecipeDB.SOURCE_LABELS[r.source])}</p>
      </div>`;
  }

  // Hinweis + Knöpfe zur Übersetzung (nur bei TheMealDB-Rezepten)
  function viewTranslation(r) {
    if (r.source !== 'mealdb') return '';
    const id = esc(r.id);
    if (Translate.isPending(r.id)) return `<div class="note">${icon('globe')} Wird übersetzt …</div>`;
    if (r.original) {
      return `<div class="note">${icon('globe')} Automatisch übersetzt (${esc(r.translatedBy)}), kleine Fehler sind möglich.<br>
        <button class="link" data-action="toggleOriginal">${state.showOriginal ? 'Übersetzung anzeigen' : 'Englisches Original'}</button>
        · <button class="link" data-action="removeTranslation" data-id="${id}">Übersetzung entfernen</button></div>`;
    }
    return `<div class="note row between">
      <span>${icon('globe')} Dieses Rezept ist auf Englisch.</span>
      <button class="soft small-btn" data-action="translate" data-id="${id}">Übersetzen</button>
      ${state.translateError ? `<span class="muted small" style="flex-basis:100%">${esc(state.translateError)} – Internetverbindung?</span>` : ''}</div>`;
  }

  function viewRecipes() {
    const all = RecipeDB.all();
    const q = state.search.toLowerCase();
    let list = all.filter(r => !q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      || (r.original && r.original.name.toLowerCase().includes(q)) // übersetzte Rezepte auch unter englischem Namen finden
      || r.ingredients.some(i => i.name.toLowerCase().includes(q)));
    const matching = list.filter(r => Planner.checkRecipe(r, data.settings) === null);
    if (state.onlyMatching) list = matching;
    list = [...list].sort((a, b) => (data.favorites.has(b.id) - data.favorites.has(a.id)) || a.name.localeCompare(b.name, 'de'));
    const shown = list.slice(0, state.listLimit);

    return `
      ${state.pickDay != null ? `<div class="pick-bar"><span>Gericht für <strong>${Planner.DAY_NAMES[state.pickDay]}</strong> wählen</span>
        <button class="small-btn" data-action="cancelPick">Abbrechen</button></div>` : ''}
      <div class="pagehead"><div class="title"><h2>Rezepte</h2></div>
        <button class="primary small-btn" data-action="newRecipe">${icon('plus')} Eigenes</button></div>
      <div class="searchbar">${icon('search')}<input type="search" id="search" placeholder="Name, Küche oder Zutat" value="${esc(state.search)}" aria-label="Rezepte durchsuchen"></div>
      <label class="switch" style="border:0;padding-bottom:0"><span>Nur Rezepte, die zu meinen Filtern passen</span>
        <input type="checkbox" id="onlyMatching" ${state.onlyMatching ? 'checked' : ''}></label>
      <p class="count">${list.length} von ${all.length} Rezepten</p>
      <div class="grid">
        ${shown.map(r => {
          const id = esc(r.id);
          const reason = state.onlyMatching ? null : Planner.checkRecipe(r, data.settings);
          const src = r.source === 'custom' ? ' · Eigenes' : r.source === 'mealdb' ? (r.original ? ' · übersetzt' : ' · EN') : '';
          return `<article class="card tile">
            <button class="pic" data-action="open" data-id="${id}" aria-label="${esc(r.name)} öffnen">${Images.img(r, 'small', '')}</button>
            ${data.favorites.has(r.id) ? `<span class="fav" title="Favorit">${icon('heart')}</span>` : ''}
            <div class="body">
              <button class="name" data-action="open" data-id="${id}">${esc(r.name)}</button>
              <div class="meta">${r.time ? r.time + ' Min · ' : ''}${esc(r.cuisine)}${src}</div>
              ${reason ? `<div class="why">${esc(reason)}</div>` : ''}
              ${data.blocked.has(r.id) ? '<div class="why">Wird nie vorgeschlagen</div>' : ''}
              ${state.pickDay != null ? `<button class="primary small-btn choose" data-action="choose" data-id="${id}">Wählen</button>` : ''}
            </div>
          </article>`;
        }).join('')}
      </div>
      ${list.length > shown.length ? `<button class="wide" style="margin-top:14px" data-action="showMore">Weitere anzeigen (${list.length - shown.length} übrig)</button>` : ''}
      ${!list.length ? '<p class="center muted">Keine Rezepte gefunden.</p>' : ''}`;
  }

  function viewForm() {
    const f = state.form;
    const ingText = f.ingredients.map(RecipeDB.ingredientToLine).join('\n');
    return `
      <div class="pagehead">
        <button class="icon-btn" data-action="cancelForm" aria-label="Abbrechen">${icon('back')}</button>
        <div class="title"><h2>${f.id ? 'Rezept bearbeiten' : 'Eigenes Rezept'}</h2></div>
      </div>
      <form name="recipe" onsubmit="return false">
        <section class="card">
          <label><span class="lbl">Name</span><input name="name" value="${esc(f.name)}" required></label>
          <label><span class="lbl">Küche</span><input name="cuisine" value="${esc(f.cuisine)}" list="cuisineList"></label>
          <datalist id="cuisineList">${RecipeDB.cuisines().map(c => `<option value="${esc(c)}">`).join('')}</datalist>
          <label><span class="lbl">Kategorie</span><select name="category">${RecipeDB.CATEGORIES.map(c => `<option ${c === f.category ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
          <div class="two">
            <label><span class="lbl">Zeit (Min)</span><input name="time" type="number" min="0" inputmode="numeric" value="${esc(f.time ?? '')}"></label>
            <label><span class="lbl">Portionen</span><input name="servings" type="number" min="1" inputmode="numeric" value="${esc(f.servings)}"></label>
          </div>
          <label><span class="lbl">Schwierigkeit</span><select name="difficulty">
            <option value="" ${f.difficulty == null ? 'selected' : ''}>unbekannt</option>
            ${[1, 2, 3].map(d => `<option value="${d}" ${f.difficulty === d ? 'selected' : ''}>${DIFF[d]}</option>`).join('')}
          </select></label>
          <label><span class="lbl">Tags</span><input name="tags" value="${esc(f.tags.join(', '))}" placeholder="z. B. Pasta, Ofen, Schnell"></label>
        </section>
        <section class="card">
          <label><span class="lbl">Zutaten</span><span class="muted small">Eine pro Zeile, z. B. „200 g Mehl“, „2 Eier“, „Salz“</span>
            <textarea name="ingredients" rows="8">${esc(ingText)}</textarea></label>
        </section>
        <section class="card">
          <label><span class="lbl">Zubereitung</span><span class="muted small">Ein Schritt pro Zeile</span>
            <textarea name="steps" rows="8">${esc(f.steps.join('\n'))}</textarea></label>
        </section>
        <p class="muted small">Vegetarisch, vegan, glutenfrei usw. erkennt die App automatisch an den Zutaten.</p>
        <div class="row">
          <button class="primary" style="flex:1" data-action="saveForm">${icon('check')} Speichern</button>
          <button data-action="cancelForm">Abbrechen</button>
        </div>
      </form>`;
  }

  function shoppingList() {
    return Shopping.build(currentPlan(), RecipeDB.byId, currentPlan()?.servings || data.settings.servings, data.settings.pantry);
  }

  function viewShopping() {
    const plan = currentPlan();
    let html = weekHead();
    if (!plan || !plan.days.some(d => d.recipeId)) {
      return html + `<div class="card center">
        <p>Für diese Woche gibt es noch keinen Plan, also auch keine Einkaufsliste.</p>
        <button class="primary" data-action="tab" data-tab="woche">${icon('calendar')} Zur Woche</button></div>`;
    }
    const list = shoppingList();
    const isDone = i => !!data.checked[state.week + '|' + i.key];
    const item = i => {
      const key = state.week + '|' + i.key;
      return `<li class="${isDone(i) ? 'done' : ''}"><label>
        <input type="checkbox" class="tick" data-check="${esc(key)}" ${isDone(i) ? 'checked' : ''}>
        <span class="what"><span class="name">${esc(i.name)}</span><div class="from">${esc(i.recipes.join(', '))}</div></span>
        <span class="qty">${esc(Shopping.formatAmount(i.amount, i.unit))}</span></label></li>`;
    };
    // Abgehakte nach unten sortieren
    const sorted = arr => [...arr.filter(i => !isDone(i)), ...arr.filter(isDone)];
    const buy = list.filter(i => !i.pantry);
    const pantry = list.filter(i => i.pantry);
    const done = buy.filter(isDone).length;

    html += `
      <section class="card">
        <div class="row between"><b>${done} von ${buy.length} erledigt</b>
          <span class="muted small">${plan.servings || data.settings.servings} Portionen pro Gericht</span></div>
        <div class="progress"><div style="width:${buy.length ? Math.round(done / buy.length * 100) : 0}%"></div></div>
        <div class="row" style="margin-top:12px">
          <button class="soft" data-action="shareList">${icon('share')} Teilen</button>
          ${done ? `<button class="ghost" data-action="uncheckAll">Haken entfernen</button>` : ''}
        </div>
      </section>
      <section class="card"><ul class="shopping">${sorted(buy).map(item).join('')}</ul></section>`;
    if (pantry.length) {
      html += `<h3 style="margin-top:22px">Vorrat prüfen</h3>
        <p class="muted small" style="margin-top:-6px">Hast du meistens da – kurz nachsehen.</p>
        <section class="card"><ul class="shopping">${sorted(pantry).map(item).join('')}</ul></section>`;
    }
    return html;
  }

  function viewFilters() {
    const s = data.settings;
    const count = Planner.filterRecipes(RecipeDB.all(), s).filter(r => !data.blocked.has(r.id)).length;
    const sw = (key, label) => `<label class="switch"><span>${label}</span><input type="checkbox" data-setting="${key}" ${s[key] ? 'checked' : ''}></label>`;
    const num = (key, label, min, max) => `<label class="numrow"><span>${label}</span>
      <input type="number" inputmode="numeric" data-setting="${key}" min="${min}" max="${max}" value="${s[key]}"></label>`;
    const chips = (list, items, labelOf = x => x) => `<div class="pick">${items.map(v =>
      `<label><input type="checkbox" data-list="${list}" value="${esc(v)}" ${s[list].includes(v) ? 'checked' : ''}>${esc(labelOf(v))}</label>`).join('')}</div>`;
    const radios = (key, values, labelOf = x => x) => `<div class="pick">${values.map(v =>
      `<label><input type="radio" name="${key}" data-setting="${key}" value="${v}" ${String(s[key]) === String(v) ? 'checked' : ''}>${esc(labelOf(v))}</label>`).join('')}</div>`;

    return `
      <div class="pagehead"><div class="title"><h2>Filter</h2></div></div>
      <div class="card summary ${count < 7 ? 'low' : 'good'}">
        <b>${count}</b>
        <div>Rezepte passen zu deinen Filtern${count < 7 ? '<br><span class="small">Für Abwechslung sollten es mindestens 7 sein.</span>' : ''}</div>
      </div>

      <section class="card">
        <h3>Ernährung</h3>
        ${radios('diet', ['alles', 'vegetarisch', 'vegan'], d => d[0].toUpperCase() + d.slice(1))}
        ${s.diet === 'alles' ? num('veggieDays', 'Mindestens fleischlose Tage pro Woche', 0, 7) : ''}
        <p class="lbl" style="margin:14px 0 8px;font-weight:600">Kein …</p>
        ${chips('excludeProteins', Classify.PROTEINS, p => Classify.PROTEIN_LABELS[p])}
      </section>

      <section class="card">
        <h3>Unverträglichkeiten</h3>
        ${sw('glutenFree', 'Glutenfrei')}${sw('lactoseFree', 'Laktosefrei / ohne Milchprodukte')}${sw('nutFree', 'Ohne Nüsse')}${sw('eggFree', 'Ohne Ei')}
        <label><span class="lbl">Zutaten ausschließen</span>
          <input data-setting="excludeIngredients" value="${esc(s.excludeIngredients)}" placeholder="z. B. Pilze, Koriander, Oliven"></label>
        <p class="muted small">Wird automatisch aus den Zutaten erkannt. Bei echten Allergien bitte trotzdem selbst prüfen.</p>
      </section>

      <section class="card">
        <h3>Zeit & Aufwand</h3>
        ${num('maxTimeWeekday', 'Max. Minuten Mo–Fr <span class="muted small">(0 = egal)</span>', 0, 600)}
        ${num('maxTimeWeekend', 'Max. Minuten Sa–So <span class="muted small">(0 = egal)</span>', 0, 600)}
        <p class="lbl" style="margin:14px 0 8px;font-weight:600">Höchstens</p>
        ${radios('maxDifficulty', [1, 2, 3], d => DIFF[d])}
        <div style="margin-top:8px">${sw('allowUnknown', 'Rezepte ohne Zeitangabe erlauben (Online-Rezepte)')}</div>
      </section>

      <section class="card">
        <h3>Planung</h3>
        <div class="pick">${Planner.DAY_NAMES.map((d, i) => `<label><input type="checkbox" data-day-toggle="${i}" ${s.days[i] ? 'checked' : ''}>${d.slice(0, 2)}</label>`).join('')}</div>
        <div style="margin-top:8px">${num('servings', 'Portionen pro Gericht', 1, 20)}</div>
      </section>

      <section class="card">
        <h3>Abwechslung</h3>
        ${num('noRepeatWeeks', 'Rezepte der letzten X Wochen nicht wiederholen', 0, 12)}
        ${sw('varietyCuisine', 'Nicht zweimal hintereinander dieselbe Küche')}
        ${sw('varietyProtein', 'Nicht zweimal hintereinander dasselbe Fleisch / Fisch')}
        ${sw('varietyType', 'Nicht zweimal hintereinander Pasta, Suppe, Curry …')}
        ${sw('preferFavorites', 'Favoriten öfter vorschlagen')}
      </section>

      <section class="card">
        <h3>Küchen</h3>
        <p class="muted small" style="margin-top:-4px">Nichts ausgewählt = alle Küchen.</p>
        ${chips('cuisines', RecipeDB.cuisines())}
      </section>

      <section class="card">
        <h3>Gerichtsarten</h3>
        ${chips('categories', RecipeDB.CATEGORIES)}
      </section>

      <section class="card">
        <h3>Rezeptquellen</h3>
        ${Object.entries(RecipeDB.SOURCE_LABELS).map(([k, l]) => `<label class="switch"><span>${l}</span><input type="checkbox" data-source="${k}" ${s.sources[k] ? 'checked' : ''}></label>`).join('')}
        ${num('maxOnlinePerWeek', 'Max. Online-Rezepte pro Woche', 0, 7)}
      </section>

      <section class="card">
        <h3>Vorrat</h3>
        <label><span class="muted small">Diese Zutaten kommen unter „Vorrat prüfen“ statt auf die Einkaufsliste.</span>
          <textarea data-setting="pantry" rows="3">${esc(s.pantry)}</textarea></label>
      </section>

      <button class="wide ghost danger" data-action="resetFilters">Filter zurücksetzen</button>`;
  }

  function viewData() {
    const info = MealDB.info();
    const all = RecipeDB.all();
    const bySource = k => all.filter(r => r.source === k).length;
    return `
      <div class="pagehead"><div class="title"><h2>Daten</h2></div></div>
      <section class="card stat">
        <div><b>${bySource('builtin')}</b><span>Eingebaut</span></div>
        <div><b>${bySource('mealdb')}</b><span>Online</span></div>
        <div><b>${bySource('custom')}</b><span>Eigene</span></div>
      </section>

      <section class="card">
        <h3>Online-Rezepte (TheMealDB)</h3>
        <p class="muted">${info ? `${info.count} Rezepte gespeichert, Stand ${new Date(info.fetchedAt).toLocaleDateString('de-DE')}. Werden alle 30 Tage automatisch aktualisiert.` : 'Noch nicht geladen.'}</p>
        <div class="row">
          <button class="soft" data-action="loadMealDB">${icon('refresh')} ${info ? 'Jetzt aktualisieren' : 'Rezepte laden'}</button>
          ${info ? '<button class="ghost" data-action="clearMealDB">Entfernen</button>' : ''}
        </div>
        ${state.mealdbStatus ? `<p class="muted small">${esc(state.mealdbStatus)}</p>` : ''}
      </section>

      <section class="card">
        <h3>Übersetzung</h3>
        <label class="switch"><span>Englische Rezepte automatisch übersetzen</span>
          <input type="checkbox" id="autoTranslate" ${Translate.auto() ? 'checked' : ''}></label>
        <p class="muted small">${Translate.count()} Rezepte übersetzt und gespeichert. Übersetzt wird beim Öffnen und für die Rezepte
          im Wochenplan, mit dem Google Übersetzer (ersatzweise MyMemory). Dafür wird der englische Rezepttext an den Dienst geschickt.</p>
        ${Translate.count() ? '<button class="ghost" data-action="clearTranslations">Übersetzungen löschen</button>' : ''}
      </section>

      <section class="card">
        <h3>Sicherung</h3>
        <p class="muted small">Pläne, eigene Rezepte, Favoriten und Filter als Datei sichern oder auf ein anderes Gerät übertragen.
          Deine eigenen Fotos sind (noch) nicht enthalten.</p>
        <div class="row">
          <button class="soft" data-action="exportData">${icon('share')} Exportieren</button>
          <label class="button">Importieren <input type="file" id="importFile" accept="application/json,.json" hidden></label>
        </div>
      </section>

      <button class="wide ghost danger" data-action="resetAll">${icon('trash')} Alle Daten löschen</button>`;
  }

  // =============================================================
  // RENDER
  // =============================================================
  function render() {
    let html;
    if (state.form) html = viewForm();
    else if (state.detail) html = viewDetail();
    else html = { woche: viewWeek, rezepte: viewRecipes, einkauf: viewShopping, filter: viewFilters, daten: viewData }[state.tab]();
    $('#main').innerHTML = html;
    renderNav();
    renderBanner();
  }

  // Navigation unten: Symbol + Beschriftung, aktiver Reiter hervorgehoben
  const TABS = [['woche', 'Woche', 'calendar'], ['rezepte', 'Rezepte', 'book'], ['einkauf', 'Einkauf', 'cart'],
                ['filter', 'Filter', 'sliders'], ['daten', 'Daten', 'database']];
  function renderNav() {
    $('#nav').innerHTML = TABS.map(([key, label, ic]) =>
      `<button data-action="tab" data-tab="${key}" ${key === state.tab ? 'class="active" aria-current="page"' : ''}>${icon(ic)}<span>${label}</span></button>`
    ).join('');
  }

  // Statuszeile oben (z. B. "Lade Online-Rezepte … 12/26") – unabhängig vom Rest der Seite
  function renderBanner() {
    const el = $('#banner');
    el.textContent = state.mealdbStatus || '';
    el.hidden = !state.mealdbStatus;
  }

  // ---------- Ereignisse ----------
  function onClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    e.preventDefault();
    const fn = actions[el.dataset.action];
    if (!fn) return;
    const result = fn(el);
    if (result instanceof Promise) result.then(render); else render();
  }

  function onChange(e) {
    const t = e.target;
    const s = data.settings;
    if (t.dataset.setting) {
      const key = t.dataset.setting;
      if (t.type === 'checkbox') s[key] = t.checked;
      else if (t.type === 'number' || key === 'maxDifficulty') s[key] = Number(t.value) || 0;
      else s[key] = t.value;
    } else if (t.dataset.list) {
      const arr = new Set(s[t.dataset.list]);
      t.checked ? arr.add(t.value) : arr.delete(t.value);
      s[t.dataset.list] = [...arr];
    } else if (t.dataset.dayToggle) {
      s.days[Number(t.dataset.dayToggle)] = t.checked;
    } else if (t.dataset.source) {
      s.sources[t.dataset.source] = t.checked;
    } else if (t.dataset.check) {
      if (t.checked) data.checked[t.dataset.check] = true; else delete data.checked[t.dataset.check];
      save.checked();
      render();
      return;
    } else if (t.id === 'autoTranslate') {
      Translate.setAuto(t.checked);
      if (t.checked) translateWeek();
      render(); return;
    } else if (t.id === 'onlyMatching') {
      state.onlyMatching = t.checked; render(); return;
    } else if (t.id === 'importFile') {
      importFile(t.files[0]); return;
    } else if (t.dataset.photo) {
      const file = t.files[0];
      if (file) OwnPhotos.save(t.dataset.photo, file).then(render).catch(err => alert('Foto konnte nicht gespeichert werden: ' + err.message));
      return;
    } else {
      return;
    }
    save.settings();
    render();
  }

  // Suche: bei jeder Eingabe neu filtern, Cursor im Feld behalten
  function onInput(e) {
    if (e.target.id !== 'search') return;
    state.search = e.target.value;
    state.listLimit = 60;
    render();
    const input = $('#search');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  async function importFile(file) {
    if (!file) return;
    try {
      Store.importAll(JSON.parse(await file.text()));
      alert('Sicherung importiert.');
      location.reload();
    } catch (e) {
      alert('Import fehlgeschlagen: ' + e.message);
    }
  }

  async function init() {
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    document.addEventListener('input', onInput);
    render();
    await OwnPhotos.loadAll();   // eigene Fotos aus IndexedDB holen, dann neu zeichnen
    render();
    prefetchWeek();
    autoLoadMealDB();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(e => console.warn('Service Worker:', e));
    }
  }

  return { init, state, data, render };
})();

document.addEventListener('DOMContentLoaded', App.init);
