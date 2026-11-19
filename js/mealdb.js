// =============================================================
// mealdb.js – lädt Rezepte aus der kostenlosen Online-Datenbank
// TheMealDB (https://www.themealdb.com). Die Rezepte sind auf Englisch.
// Wir laden einmal alle Rezepte (Suche nach Anfangsbuchstabe a–z),
// wandeln sie in unser eigenes Format um und speichern sie lokal,
// damit die App danach auch offline funktioniert.
// =============================================================

const MealDB = (() => {
  const API = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';

  // Englische Herkunftsländer -> deutsche Küchennamen
  const AREAS = {
    American: 'Amerikanisch', British: 'Britisch', Canadian: 'Kanadisch', Chinese: 'Chinesisch', Croatian: 'Kroatisch',
    Dutch: 'Niederländisch', Egyptian: 'Ägyptisch', Filipino: 'Philippinisch', French: 'Französisch', Greek: 'Griechisch',
    Indian: 'Indisch', Irish: 'Irisch', Italian: 'Italienisch', Jamaican: 'Jamaikanisch', Japanese: 'Japanisch',
    Kenyan: 'Kenianisch', Malaysian: 'Malaysisch', Mexican: 'Mexikanisch', Moroccan: 'Marokkanisch', Polish: 'Polnisch',
    Portuguese: 'Portugiesisch', Russian: 'Russisch', Spanish: 'Spanisch', Thai: 'Thailändisch', Tunisian: 'Tunesisch',
    Turkish: 'Türkisch', Ukrainian: 'Ukrainisch', Vietnamese: 'Vietnamesisch', Norwegian: 'Norwegisch',
    Argentinian: 'Argentinisch', Australian: 'Australisch', Algerian: 'Algerisch', Syrian: 'Syrisch',
    'Saudi Arabian': 'Saudi-Arabisch', Uruguayan: 'Uruguayisch', Venezulan: 'Venezolanisch', Venezuelan: 'Venezolanisch',
    Slovakian: 'Slowakisch', Unknown: 'International',
    // TheMealDB nutzt teils Ländernamen statt Adjektiven
    Argentina: 'Argentinisch', France: 'Französisch', India: 'Indisch', Netherlands: 'Niederländisch',
    Norway: 'Norwegisch', Slovakia: 'Slowakisch', 'United States': 'Amerikanisch', Venezuela: 'Venezolanisch',
    'United Kingdom': 'Britisch', Germany: 'Deutsch', German: 'Deutsch', Italy: 'Italienisch', Mexico: 'Mexikanisch',
    Japan: 'Japanisch', China: 'Chinesisch', Spain: 'Spanisch', Greece: 'Griechisch', Turkey: 'Türkisch',
    Thailand: 'Thailändisch', Vietnam: 'Vietnamesisch', Portugal: 'Portugiesisch', Poland: 'Polnisch',
    Ireland: 'Irisch', Canada: 'Kanadisch', Jamaica: 'Jamaikanisch', Morocco: 'Marokkanisch', Egypt: 'Ägyptisch',
    Kenya: 'Kenianisch', Malaysia: 'Malaysisch', Philippines: 'Philippinisch', Russia: 'Russisch',
    Ukraine: 'Ukrainisch', Tunisia: 'Tunesisch', Croatia: 'Kroatisch', Australia: 'Australisch', Algeria: 'Algerisch',
    Syria: 'Syrisch', 'Saudi Arabia': 'Saudi-Arabisch', Uruguay: 'Uruguayisch', Korea: 'Koreanisch',
    Korean: 'Koreanisch', 'South Korea': 'Koreanisch', Brazil: 'Brasilianisch', Brazilian: 'Brasilianisch',
    Peru: 'Peruanisch', Peruvian: 'Peruanisch', Hungary: 'Ungarisch', Hungarian: 'Ungarisch',
  };

  // Auch für schon gespeicherte Rezepte nutzbar (falls neue Übersetzungen dazukommen)
  const area = name => AREAS[name] || name || 'International';

  // TheMealDB-Kategorie -> unsere Kategorie (+ bekannte Fleischsorte)
  const CATEGORIES = {
    Beef: ['Hauptgericht', 'rind'], Chicken: ['Hauptgericht', 'gefluegel'], Pork: ['Hauptgericht', 'schwein'],
    Lamb: ['Hauptgericht', 'lamm'], Goat: ['Hauptgericht', 'lamm'], Seafood: ['Hauptgericht', 'fisch'],
    Vegetarian: ['Hauptgericht'], Vegan: ['Hauptgericht'], Pasta: ['Hauptgericht'], Miscellaneous: ['Hauptgericht'],
    Dessert: ['Dessert'], Breakfast: ['Frühstück'], Side: ['Beilage'], Starter: ['Vorspeise'],
  };

  const FRACTIONS = { '½': '.5', '¼': '.25', '¾': '.75', '⅓': '.33', '⅔': '.67', '⅛': '.125' };

  // "1 1/2 cups" -> {amount: 1.5, unit: 'cups'};  "To taste" -> {amount: null, unit: 'To taste'}
  function parseMeasure(measure) {
    let m = String(measure || '').trim();
    for (const [f, d] of Object.entries(FRACTIONS)) m = m.replace(new RegExp('(\\d)?' + f), (_, n) => (n || '0') + d);
    const match = m.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)\s*(.*)$/);
    if (!match) return { amount: null, unit: m };
    const num = match[1];
    let amount;
    if (num.includes('/')) {
      const parts = num.split(/\s+/);
      amount = parts.reduce((sum, p) => {
        if (p.includes('/')) { const [a, b] = p.split('/').map(Number); return sum + a / b; }
        return sum + Number(p);
      }, 0);
    } else {
      amount = Number(num.replace(',', '.'));
    }
    return { amount: Math.round(amount * 100) / 100, unit: match[2].trim() };
  }

  function splitSteps(text) {
    return String(text || '')
      .split(/\r?\n+/)
      .map(s => s.trim())
      .filter(s => s && !/^(step\s*\d+|\d+\.?)$/i.test(s)); // reine "STEP 1"-Zeilen weg
  }

  // Ein TheMealDB-Datensatz -> unser Rohformat (wird in recipes.js normalisiert)
  function convert(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const name = (meal['strIngredient' + i] || '').trim();
      if (!name) continue;
      const { amount, unit } = parseMeasure(meal['strMeasure' + i]);
      ingredients.push([amount, unit, name]);
    }
    const [category, protein] = CATEGORIES[meal.strCategory] || ['Hauptgericht'];
    return {
      id: 'm-' + meal.idMeal,
      name: meal.strMeal,
      cuisine: area(meal.strArea),
      category,
      time: null,        // TheMealDB kennt keine Zubereitungszeit
      difficulty: null,  // ... und keine Schwierigkeit
      servings: 4,       // Annahme, TheMealDB gibt keine Portionen an
      tags: (meal.strTags || '').split(',').map(t => t.trim()).filter(Boolean),
      ingredients,
      steps: splitSteps(meal.strInstructions),
      image: meal.strMealThumb || null,
      sourceUrl: meal.strSource || meal.strYoutube || null,
      lang: 'en',
      extraProteins: protein ? [protein] : [],
    };
  }

  // Lädt alle Buchstaben a–z. onProgress(fertig, gesamt) für eine Fortschrittsanzeige.
  async function fetchAll(onProgress = () => {}) {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const results = [];
    let done = 0;
    const BATCH = 5; // nicht 26 Anfragen gleichzeitig, um die API zu schonen
    for (let i = 0; i < letters.length; i += BATCH) {
      const chunk = letters.slice(i, i + BATCH);
      const responses = await Promise.all(chunk.map(async l => {
        const res = await fetch(API + l);
        if (!res.ok) throw new Error('TheMealDB antwortet mit Fehler ' + res.status);
        const json = await res.json();
        done++;
        onProgress(done, letters.length);
        return json.meals || [];
      }));
      for (const meals of responses) results.push(...meals.map(convert));
    }
    const payload = { fetchedAt: new Date().toISOString(), recipes: results };
    if (!Store.set('mealdb', payload)) throw new Error('Nicht genug Speicherplatz auf dem Gerät.');
    return results.length;
  }

  function cached() {
    const c = Store.get('mealdb', null);
    return c ? c.recipes : [];
  }

  function info() {
    const c = Store.get('mealdb', null);
    return c ? { count: c.recipes.length, fetchedAt: c.fetchedAt } : null;
  }

  function clear() { Store.remove('mealdb'); }

  return { fetchAll, cached, info, clear, parseMeasure, convert, area };
})();
