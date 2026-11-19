// =============================================================
// storage.js – speichert alles im Browser des Handys (localStorage)
// Jeder Schlüssel bekommt das Präfix "wp." (WochenPlan), damit nichts
// mit anderen Seiten kollidiert. try/catch, weil localStorage im
// privaten Modus oder bei vollem Speicher Fehler werfen kann.
// =============================================================

const Store = (() => {
  const PREFIX = 'wp.';
  const KEYS = ['settings', 'plans', 'custom', 'favorites', 'blocked', 'checked', 'mealdb', 'translations', 'autoTranslate'];
  const NO_BACKUP = ['mealdb', 'translations']; // kann man jederzeit neu laden bzw. übersetzen

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.warn('Lesen fehlgeschlagen:', key, e);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Speichern fehlgeschlagen:', key, e);
      return false;
    }
  }

  function remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch (e) { /* egal */ }
  }

  // Backup: alles außer den Caches in NO_BACKUP
  function exportAll() {
    const out = { app: 'wochenplan', version: 1, exportedAt: new Date().toISOString() };
    for (const k of KEYS) if (!NO_BACKUP.includes(k)) out[k] = get(k, null);
    return out;
  }

  function importAll(obj) {
    if (!obj || obj.app !== 'wochenplan') throw new Error('Das ist keine Wochenplan-Sicherung.');
    for (const k of KEYS) {
      if (NO_BACKUP.includes(k)) continue;
      if (obj[k] !== undefined && obj[k] !== null) set(k, obj[k]);
    }
  }

  function clearAll() {
    for (const k of KEYS) remove(k);
  }

  return { get, set, remove, exportAll, importAll, clearAll };
})();
