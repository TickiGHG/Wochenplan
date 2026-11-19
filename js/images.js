// =============================================================
// images.js – Bilder für Rezepte
// Reihenfolge, welches Bild gezeigt wird:
//   1. eigenes Foto (vom Handy, gespeichert in IndexedDB)
//   2. Foto der Quelle: TheMealDB-Foto bzw. Wikimedia-Commons-Foto (eingebaute Rezepte)
//   3. gezeichnete Platzhalter-Illustration passend zum Gerichtstyp
// =============================================================

// Wikimedia-Commons-Fotos für die eingebauten Rezepte.
// [Pfad auf Commons, Urheber, Lizenz, true = nur Original vorhanden (kein Vorschaubild)]
// Jedes Bild wurde einzeln angesehen und passt zum Gericht. Lizenzen erlauben die Nutzung
// mit Namensnennung – deshalb wird unter jedem Foto Urheber + Lizenz angezeigt.
const WIKI_IMAGES = {
  'Spaghetti Bolognese': ['4/4d/Tagliatelle_al_ragù_(image_modified).jpg', 'Ivan Vighetto', 'CC BY-SA 3.0'],
  'Spaghetti Carbonara': ['3/33/Espaguetis_carbonara.jpg', 'Javier Somoza', 'CC BY-SA 4.0'],
  'Lasagne': ['b/ba/Lasagne_-_stonesoup.jpg', 'jules / stonesoup', 'CC BY 2.0'],
  'Pilzrisotto': ['b/b6/Mushroom_Risotto_(4789415965).jpg', 'Katrin Gilger', 'CC BY-SA 2.0'],
  'Pasta mit Pesto und Kirschtomaten': ['0/05/Vegan_Avocado_Pesto_Pasta_(7891158180).jpg', 'tomatoes and friends', 'CC BY 2.0'],
  'Pizza Margherita': ['5/57/Neapolitan_pizza_at_Trappica_(48701940197).jpg', 'Bex Walton from London, England', 'CC BY 2.0'],
  'Ofen-Gnocchi mit Tomaten und Mozzarella': ['8/86/Gnocchi_di_ricotta_burro_e_salvia.jpg', 'Paoletta S.', 'CC BY 2.0', true],
  'Minestrone': ['f/fe/Minestrone_soup_(5).jpg', 'Daniel Ziegener', 'CC BY-SA 2.0'],
  'Penne all\'arrabbiata': ['c/cd/Penne_Arrabbiata.jpg', 'Petar Milošević', 'CC BY-SA 4.0'],
  'Paniertes Schnitzel mit Bratkartoffeln': ['2/22/Breitenlesau_Krug_Bräu_Schnitzel.JPG', 'Benreis', 'CC BY-SA 3.0'],
  'Rinderrouladen mit Rotkohl': ['2/20/2019-04-28_Rinderroulade_mit_Rotkohl_und_Klößen_in_Erfurt_anagoria.jpg', 'Anagoria', 'CC BY 3.0'],
  'Käsespätzle': ['f/f1/Berggasthof_Haldenhof_-_Käsknöpfle_(1).jpg', '1971markus', 'CC BY-SA 4.0'],
  'Kartoffelsuppe': ['3/31/Bramboračka_022.jpg', 'Matěj Baťha', 'CC BY-SA 3.0'],
  'Linseneintopf': ['a/a4/Catalan_lentil_soup.JPG', 'Xufanc', 'CC BY-SA 3.0', true],
  'Frikadellen mit Kartoffelpüree': ['c/cd/Buletten.jpg', 'Rainer Z ...', 'CC BY-SA 3.0'],
  'Kartoffel-Gemüse-Auflauf': ['b/b7/Kartoffel-Broccoli-Auflauf_20170906_193030.jpg', 'Kim Holger Kelting', 'CC BY 4.0'],
  'Spinat-Feta-Pfannkuchen': ['3/34/Spinach_crepes_(3236762733).jpg', 'Karen and Brad Emerson', 'CC BY 2.0'],
  'Lachs mit Zitronen-Dill-Kartoffeln': ['7/77/DFC_1021_Seared_salmon_fillet_topped_with_shrimp_and_dill_served_with_coleslaw_roasted_potatoes_and_a_side_of_creamed_spinach_on_a_bed_of_greens.jpg', 'PattayaPatrol', 'CC BY-SA 4.0'],
  'Ofenkartoffeln mit Kräuterquark': ['9/93/BakedPotatoWithButter.jpg', 'Renee Comet', 'Public domain'],
  'Kürbissuppe mit Kokosmilch': ['c/cd/Kürbissuppe_mit_Kernöl.JPG', 'Wald1siedel', 'CC BY-SA 4.0'],
  'Rindergulasch': ['5/5c/Gulyas080.jpg', 'Lily15', 'CC BY-SA 3.0'],
  'Chili con Carne': ['5/50/Bowl_of_chili.jpg', 'Carstor', 'CC BY-SA 2.5'],
  'Hähnchen-Tacos': ['7/73/001_Tacos_de_carnitas,_carne_asada_y_al_pastor.jpg', 'Larry Miller', 'CC BY-SA 2.0'],
  'Bohnen-Burritos': ['6/60/Burrito.JPG', 'samuelfernandezrivera', 'CC0'],
  'Chicken Tikka Masala': ['0/00/Chicken_tikka_masala_(cropped).jpg', 'Michael Hays', 'CC BY 2.0'],
  'Rote-Linsen-Dal': ['a/ae/Masoor_Dal_in_Dhaba_Style.jpg', 'Solehachikhalkar', 'CC BY-SA 4.0', true],
  'Kichererbsen-Spinat-Curry': ['8/8e/Chana_masala.jpg', 'Simon Law (sfllaw)', 'CC BY-SA 2.0'],
  'Palak Paneer': ['b/b7/Palakpaneer_Rayagada_Odisha_0009.jpg', 'Lopanayak', 'CC BY-SA 4.0'],
  'Grünes Thai-Curry mit Hähnchen': ['e/e5/Thai_green_chicken_curry_and_roti.jpg', 'Takeaway', 'CC BY-SA 3.0'],
  'Pad Thai mit Garnelen': ['3/39/Phat_Thai_kung_Chang_Khien_street_stall.jpg', 'Takeaway', 'CC BY-SA 3.0'],
  'Gebratener Reis mit Gemüse und Ei': ['c/c3/Koh_Mak,_Thailand,_Fried_rice_with_seafood,_Thai_fried_rice.jpg', 'Vyacheslav Argenberg', 'CC BY 4.0'],
  'Süß-saures Hähnchen': ['4/4e/Sweet_and_Sour_Chicken_(28825811693).jpg', 'vagueonthehow', 'CC BY 2.0'],
  'Teriyaki-Lachs mit Reis': ['1/12/Flickr_-_Roger_T_Wong_-_20100130-45-Teriyaki_salmon_at_Wagamama_in_Christchurch.jpg', 'Roger Wong', 'CC BY-SA 2.0', true],
  'Miso-Nudelsuppe mit Gemüse': ['6/6f/Mixed_Mushroom_Udon_(red_miso_broth)_-_MOGUMOGU_2024-10-02.jpg', 'Andy Li', 'CC0'],
  'Bibimbap': ['4/44/Dolsot-bibimbap.jpg', 'Sous Chef', 'CC BY 2.0'],
  'Pho mit Rindfleisch (vereinfacht)': ['5/52/Bowl_of_Meatball_pho.jpg', 'SerraKnightz', 'CC BY 4.0'],
  'Gyros-Pfanne mit Tzatziki': ['c/c7/Pita_giros.JPG', 'Antonio Fajardo i López', 'CC BY-SA 3.0'],
  'Moussaka': ['a/a8/MussakasMeMelitsanesKePatates01.JPG', 'Robert Kindermann', 'CC BY-SA 2.5'],
  'Ofen-Feta mit Gemüse': ['9/97/Tiktok_Viral_Feta_pasta.jpg', 'Gabbybratcher', 'CC BY-SA 4.0'],
  'Shakshuka': ['1/18/Shakshuka_by_Calliopejen1.jpg', 'Calliopejen1', 'CC BY-SA 3.0'],
  'Falafel mit Hummus im Fladenbrot': ['5/57/Falafels_2.jpg', 'Popo le Chien', 'CC BY-SA 3.0'],
  'Türkische Linsensuppe (Mercimek)': ['7/74/Mercimek_çorbası_in_Ankara,_Turkey.jpg', 'E4024', 'CC BY-SA 4.0'],
  'Köfte mit Bulgur und Joghurt': ['1/19/Köfte-pilav.jpg', 'E4024', 'CC BY-SA 4.0'],
  'Ratatouille': ['3/37/Ratatouille_home_cooked.jpg', 'Jack145945', 'CC0', true],
  'Quiche Lorraine': ['2/29/Quiche.jpg', 'Ghouston', 'CC0'],
  'Paella mit Hähnchen und Meeresfrüchten': ['e/ed/01_Paella_Valenciana_original.jpg', 'Jan Harenburg', 'CC BY-SA 4.0'],
  'Spanische Tortilla': ['4/49/Tortilla_de_patata_-_San_Sebastián.jpg', 'Kent Wang', 'CC BY-SA 2.0'],
  'Selbstgemachte Burger': ['0/0b/RedDot_Burger.jpg', 'Hongreddotbrewhouse', 'CC BY-SA 3.0'],
  'Mac and Cheese': ['4/44/Original_Mac_n_Cheese_.jpg', 'Texasfoodgawker', 'CC BY-SA 4.0'],
  'Buddha Bowl mit Süßkartoffel': ['5/53/BuddhaBowlLot.jpg', 'PizzaMan', 'CC BY-SA 4.0'],
  'Hähnchen-Gemüse-Wraps': ['f/f8/Smoked_chicken_and_avocado_wrap.jpg', 'Takeaway', 'CC BY-SA 3.0'],
};

// -------------------------------------------------------------
// Eigene Fotos: IndexedDB, weil localStorage (5 MB, nur Text) für Bilder zu klein ist.
// -------------------------------------------------------------
const OwnPhotos = (() => {
  const DB = 'wochenplan-fotos', STORE = 'fotos';
  const urls = new Map();       // Rezept-ID -> Objekt-URL zum Anzeigen
  let dbPromise = null;

  function open() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }

  // Kleiner Helfer: IndexedDB-Anfrage als Promise
  async function tx(mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const req = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(req?.result);
      t.onerror = () => reject(t.error);
    });
  }

  // Beim Start alle Fotos laden (es sind nur so viele, wie du selbst gemacht hast)
  async function loadAll() {
    try {
      const keys = await tx('readonly', s => s.getAllKeys());
      for (const k of keys) {
        const blob = await tx('readonly', s => s.get(k));
        if (blob) urls.set(k, URL.createObjectURL(blob));
      }
    } catch (e) {
      console.warn('Eigene Fotos nicht verfügbar:', e);
    }
  }

  // Handyfotos sind oft 4000 px groß und mehrere MB → auf max. 1280 px verkleinern
  async function shrink(file, max = 1280) {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.82));
  }

  async function save(recipeId, file) {
    const blob = await shrink(file);
    await tx('readwrite', s => s.put(blob, recipeId));
    if (urls.has(recipeId)) URL.revokeObjectURL(urls.get(recipeId));
    urls.set(recipeId, URL.createObjectURL(blob));
  }

  async function remove(recipeId) {
    await tx('readwrite', s => s.delete(recipeId));
    if (urls.has(recipeId)) URL.revokeObjectURL(urls.get(recipeId));
    urls.delete(recipeId);
  }

  return { loadAll, save, remove, url: id => urls.get(id) || null, has: id => urls.has(id) };
})();

// -------------------------------------------------------------
// Platzhalter-Illustrationen (SVG, im Code gezeichnet – keine Datei nötig)
// -------------------------------------------------------------
const Placeholder = (() => {
  const PALETTES = [
    ['#f4e3c9', '#c8763a'], ['#e3efd9', '#4f8a3c'], ['#fbe0dc', '#c4493a'], ['#e0e9f5', '#3f6fb0'],
    ['#f6efc7', '#b38b12'], ['#ece1f3', '#7a4ea3'], ['#dff1ee', '#2f8a7a'], ['#f3e4e9', '#a5486b'],
  ];

  // Gleiche Küche -> immer gleiche Farbe (einfacher Text-Hash)
  function hash(text) {
    let h = 0;
    for (const c of String(text)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h;
  }

  function typeOf(r) {
    const t = r.tags || [];
    if (t.includes('Pasta')) return 'pasta';
    if (t.includes('Suppe') || t.includes('Eintopf')) return 'suppe';
    if (t.includes('Curry')) return 'curry';
    if (t.includes('Wok')) return 'wok';
    if (t.includes('Salat')) return 'salat';
    if (t.includes('Bowl')) return 'bowl';
    if (t.includes('Ofen')) return 'ofen';
    if (r.mainProtein === 'fisch') return 'fisch';
    return 'teller';
  }

  // Jede Form ist eine kleine Zeichnung im 100×100-Raster; c = Akzentfarbe
  const SHAPES = {
    pasta: c => `<ellipse cx="50" cy="62" rx="34" ry="12" fill="#fff"/><path d="M26 60c8-14 16 6 24-8s16 6 24-6" stroke="${c}" stroke-width="3" fill="none"/><path d="M28 64c8-10 16 6 24-6s14 6 22-4" stroke="${c}" stroke-width="3" fill="none" opacity=".7"/><circle cx="44" cy="54" r="4" fill="#d9442b"/><circle cx="58" cy="57" r="3.5" fill="#d9442b"/>`,
    suppe: c => `<path d="M18 50h64a32 26 0 0 1-64 0z" fill="#fff"/><ellipse cx="50" cy="50" rx="32" ry="7" fill="${c}"/><path d="M40 38c-4-6 4-8 0-14M52 38c-4-6 4-8 0-14M64 38c-4-6 4-8 0-14" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".6"/>`,
    curry: c => `<path d="M16 52h68a34 24 0 0 1-68 0z" fill="#fff"/><ellipse cx="50" cy="52" rx="34" ry="8" fill="${c}"/><circle cx="40" cy="51" r="3" fill="#fff" opacity=".8"/><circle cx="56" cy="53" r="3" fill="#fff" opacity=".8"/><path d="M60 47l6-6 3 3-6 6" fill="#4f8a3c"/>`,
    wok: c => `<path d="M14 48h60a30 20 0 0 1-60 0z" fill="#333"/><path d="M74 50l16-6" stroke="#333" stroke-width="5" stroke-linecap="round"/><ellipse cx="44" cy="48" rx="30" ry="6" fill="${c}"/><rect x="32" y="40" width="8" height="5" rx="2" fill="#f2c94c"/><rect x="48" y="38" width="9" height="5" rx="2" fill="#6fb04a"/>`,
    salat: c => `<path d="M16 54h68a34 22 0 0 1-68 0z" fill="#fff"/><circle cx="36" cy="50" r="9" fill="#6fb04a"/><circle cx="50" cy="46" r="10" fill="#8cc63f"/><circle cx="64" cy="50" r="9" fill="#6fb04a"/><circle cx="46" cy="52" r="4" fill="#d9442b"/><circle cx="60" cy="47" r="3" fill="${c}"/>`,
    bowl: c => `<path d="M16 50h68a34 26 0 0 1-68 0z" fill="#fff"/><path d="M18 50a32 8 0 0 1 32-8v8z" fill="#f2c94c"/><path d="M50 42a32 8 0 0 1 32 8H50z" fill="#6fb04a"/><circle cx="50" cy="47" r="6" fill="${c}"/>`,
    ofen: c => `<rect x="16" y="40" width="68" height="30" rx="8" fill="#fff"/><rect x="20" y="40" width="60" height="14" rx="5" fill="${c}"/><circle cx="34" cy="46" r="3" fill="#f2c94c"/><circle cx="52" cy="45" r="3.5" fill="#f2c94c"/><circle cx="66" cy="47" r="3" fill="#f2c94c"/><rect x="8" y="48" width="10" height="5" rx="2" fill="#fff"/><rect x="82" y="48" width="10" height="5" rx="2" fill="#fff"/>`,
    fisch: c => `<ellipse cx="50" cy="56" rx="38" ry="14" fill="#fff"/><path d="M28 54c10-12 30-12 40 0-10 12-30 12-40 0z" fill="${c}"/><path d="M68 54l10-8v16z" fill="${c}"/><circle cx="35" cy="52" r="2" fill="#fff"/>`,
    teller: c => `<circle cx="50" cy="52" r="28" fill="#fff"/><circle cx="50" cy="52" r="19" fill="none" stroke="${c}" stroke-width="2" opacity=".5"/><path d="M14 30v24M10 30v10M18 30v10M14 54v18" stroke="#999" stroke-width="2.5" stroke-linecap="round"/><path d="M86 30c-6 4-6 18 0 22v20" stroke="#999" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  };

  const cache = new Map();

  function svg(recipe) {
    const type = typeOf(recipe);
    const [bg, accent] = PALETTES[hash(recipe.cuisine) % PALETTES.length];
    const key = type + bg;
    if (!cache.has(key)) {
      const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="${bg}"/>${SHAPES[type](accent)}</svg>`;
      cache.set(key, 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup));
    }
    return cache.get(key);
  }

  return { svg, typeOf };
})();

// -------------------------------------------------------------
// Öffentliche Schnittstelle: welches Bild für welches Rezept?
// -------------------------------------------------------------
const Images = (() => {
  const COMMONS = 'https://upload.wikimedia.org/wikipedia/commons/';

  function wikiInfo(recipe) {
    // Eigene Version eines eingebauten Rezepts erbt dessen Foto
    const base = recipe.baseRecipe ? RecipeDB.byId(recipe.baseRecipe) : null;
    return WIKI_IMAGES[recipe.name] || (base && WIKI_IMAGES[base.name]) || null;
  }

  function wikiUrl([path, , , originalOnly], size) {
    if (originalOnly) return COMMONS + encodePath(path);
    const file = path.split('/').pop();
    // Wikimedia liefert Vorschaubilder nur in festen Breiten aus (z. B. 330, 500, 960)
    const w = size === 'small' ? 330 : 960;
    return COMMONS + 'thumb/' + encodePath(path) + '/' + w + 'px-' + encodeURIComponent(file);
  }

  function encodePath(path) {
    return path.split('/').map(encodeURIComponent).join('/');
  }

  // size: 'small' (Listen) oder 'large' (Rezeptansicht)
  // Rückgabe: { src, kind: 'own' | 'photo' | 'placeholder', credit?: {text, url} }
  function forRecipe(recipe, size = 'small') {
    const own = OwnPhotos.url(recipe.id);
    if (own) return { src: own, kind: 'own', credit: { text: 'Dein Foto' } };

    const wiki = wikiInfo(recipe);
    if (wiki) {
      const file = wiki[0].split('/').pop();
      return {
        src: wikiUrl(wiki, size),
        kind: 'photo',
        credit: { text: `Foto: ${wiki[1]} · ${wiki[2]} · Wikimedia Commons`, url: 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file) },
      };
    }

    if (recipe.image) {
      // TheMealDB bietet verkleinerte Varianten über die Endung /small bzw. /medium
      const isMealDB = recipe.image.includes('themealdb.com');
      return {
        src: isMealDB ? recipe.image + (size === 'small' ? '/small' : '/medium') : recipe.image,
        kind: 'photo',
        credit: isMealDB ? { text: 'Foto: TheMealDB', url: 'https://www.themealdb.com' } : null,
      };
    }

    return { src: Placeholder.svg(recipe), kind: 'placeholder' };
  }

  // <img>-HTML mit Rückfall auf den Platzhalter, falls das Foto nicht lädt (z. B. offline)
  function img(recipe, size, cls) {
    const pic = forRecipe(recipe, size);
    const fallback = Placeholder.svg(recipe);
    const onerr = pic.kind === 'placeholder' ? '' : ` onerror="this.onerror=null;this.src='${fallback}'"`;
    // Großes Bild sofort laden (ist sowieso sichtbar), Listenbilder erst beim Hinscrollen
    const loading = size === 'large' ? 'eager' : 'lazy';
    return `<img class="${cls}" src="${pic.src}" alt="" loading="${loading}" decoding="async"${onerr}>`;
  }

  // Bilder der Woche schon mal laden, damit sie offline im Cache liegen
  function prefetch(recipes) {
    for (const r of recipes) {
      if (!r) continue;
      for (const size of ['small', 'large']) {
        const pic = forRecipe(r, size);
        if (pic.kind === 'photo') { const i = new Image(); i.src = pic.src; }
      }
    }
  }

  return { forRecipe, img, prefetch, WIKI_IMAGES };
})();
