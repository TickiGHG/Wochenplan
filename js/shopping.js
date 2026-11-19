// =============================================================
// shopping.js – Einkaufsliste aus einem Wochenplan
// Rechnet alle Zutaten auf die gewünschte Portionszahl um und fasst
// gleiche Zutaten zusammen (z. B. 2× Zwiebel aus zwei Rezepten).
// =============================================================

const Shopping = (() => {
  // Einheiten, die ineinander umgerechnet werden können -> Basiseinheit
  const BASE = { g: ['g', 1], kg: ['g', 1000], ml: ['ml', 1], l: ['ml', 1000] };

  // "Kichererbsen (à ca. 240 g)" und "Kichererbsen (ca. 240 g)" -> gleicher Schlüssel
  function cleanName(name) {
    return String(name).replace(/\(.*?\)/g, '').replace(/,\s*$/, '').replace(/\s+/g, ' ').trim();
  }

  function scale(amount, factor) {
    return amount == null ? null : amount * factor;
  }

  // plan: {days:[{recipeId}]}, getRecipe: id -> Rezept, servings: gewünschte Portionen
  function build(plan, getRecipe, servings, pantryText = '') {
    const items = new Map();
    const pantryTerms = String(pantryText).split(',').map(t => t.trim().toLowerCase()).filter(Boolean);

    for (const day of plan?.days || []) {
      if (!day.recipeId) continue;
      const r = getRecipe(day.recipeId);
      if (!r) continue;
      const factor = (day.servings || servings) / r.servings;
      for (const ing of r.ingredients) {
        const name = cleanName(ing.name);
        const [unit, mult] = BASE[ing.unit] || [ing.unit, 1];
        const amount = ing.amount == null ? null : scale(ing.amount, factor) * mult;
        // Zutaten ohne Menge werden pro Name gesammelt, mit Menge pro Name + Einheit
        const key = name.toLowerCase() + '|' + (amount == null ? '?' : unit);
        let item = items.get(key);
        if (!item) {
          item = { key, name, unit: amount == null ? ing.unit : unit, amount: amount == null ? null : 0, recipes: [] };
          items.set(key, item);
        }
        if (amount != null) item.amount += amount;
        if (!item.recipes.includes(r.name)) item.recipes.push(r.name);
      }
    }

    // Vorrat = Zutat steht in der Vorratsliste (z. B. "Salz", "Olivenöl", "Paprikapulver edelsüß")
    // oder besteht nur aus Vorratsdingen ("Salz und Pfeffer")
    const isPantry = name => {
      const n = name.toLowerCase();
      if (pantryTerms.some(t => n === t || n.startsWith(t + ' ') || n.startsWith(t + ','))) return true;
      const parts = n.split(/ und |, /).map(p => p.trim());
      return pantryTerms.length > 0 && parts.length > 1 && parts.every(p => pantryTerms.includes(p));
    };
    const list = [...items.values()].map(item => ({ ...item, pantry: isPantry(item.name) }));
    list.sort((a, b) => a.name.localeCompare(b.name, 'de'));
    return list;
  }

  // 1250 g -> "1,25 kg";  1.5 Stück -> "1½ Stück"
  function formatAmount(amount, unit) {
    if (amount == null) return unit || '';
    let a = amount, u = unit;
    if (u === 'g' && a >= 1000) { a /= 1000; u = 'kg'; }
    if (u === 'ml' && a >= 1000) { a /= 1000; u = 'l'; }
    let text;
    if ((u === 'g' || u === 'ml') && a >= 20) {
      text = String(Math.round(a / 5) * 5);            // auf 5 runden
    } else if (u === 'kg' || u === 'l') {
      text = (Math.round(a * 100) / 100).toString().replace('.', ',');
    } else {
      const q = Math.round(a * 4) / 4;                  // auf Viertel runden
      const whole = Math.floor(q);
      const frac = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }[q - whole];
      text = (whole || !frac ? String(whole) : '') + frac;
      if (text === '0') text = (Math.round(a * 100) / 100).toString().replace('.', ',');
    }
    return (text + ' ' + (u || '')).trim();
  }

  function toText(list, weekLabel) {
    const lines = ['Einkaufsliste ' + (weekLabel || ''), ''];
    for (const i of list.filter(i => !i.pantry)) lines.push('☐ ' + (formatAmount(i.amount, i.unit) + ' ' + i.name).trim());
    const pantry = list.filter(i => i.pantry);
    if (pantry.length) {
      lines.push('', 'Vorrat prüfen:');
      for (const i of pantry) lines.push('☐ ' + (formatAmount(i.amount, i.unit) + ' ' + i.name).trim());
    }
    return lines.join('\n');
  }

  return { build, formatAmount, toText, cleanName };
})();

if (typeof module !== 'undefined') module.exports = Shopping;
