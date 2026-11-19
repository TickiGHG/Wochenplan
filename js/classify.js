// =============================================================
// classify.js – erkennt automatisch, was in einem Rezept steckt
// (Fleischsorte, Fisch, Milch, Ei, Gluten, Nüsse) anhand der
// Zutatennamen. Funktioniert für deutsche UND englische Zutaten,
// damit eingebaute, eigene und TheMealDB-Rezepte gleich behandelt
// werden.
// =============================================================

const Classify = (() => {
  // Für jede Eigenschaft: Suchwörter (Teilstring-Treffer) und
  // Ausnahmen, die vorher aus dem Text entfernt werden.
  // Beispiel: "Kokosmilch" enthält "milch", ist aber kein Milchprodukt.
  const RULES = {
    rind: {
      words: ['rind', 'beef', 'steak', 'kalb', 'veal', 'hackfleisch', 'brisket', 'oxtail'],
      except: ['sojahack', 'soja-hack', 'veganes hack', 'vegane hack', 'tofu-steak', 'blumenkohlsteak', 'tamarind'],
    },
    schwein: {
      words: ['schwein', 'speck', 'schinken', 'bacon', 'pork', ' ham ', ' ham,', 'chorizo', 'salami', 'wurst', 'würstchen',
              'pancetta', 'prosciutto', 'sausage', 'hackfleisch gemischt', 'lardon', 'guanciale', 'kassler'],
      except: ['champignon', 'gemüsewurst', 'vegane wurst', 'vegan sausage', 'shallot'],
    },
    gefluegel: {
      words: ['hähnchen', 'huhn', 'hühner', 'hühnchen', ' pute', 'chicken', 'turkey', 'duck', ' ente', 'geflügel'],
      except: ['kichererbse', 'chickpea'],
    },
    fisch: {
      words: ['lachs', 'thunfisch', 'fisch', 'garnele', 'shrimp', 'prawn', 'salmon', 'tuna', 'fish', ' cod', 'kabeljau',
              'muschel', 'mussel', 'clam', 'anchov', 'sardell', 'sardine', 'seafood', 'squid', 'tintenfisch', 'calamari',
              'crab', 'krabbe', 'scampi', 'seelachs', 'forelle', 'trout', 'haddock', 'lobster', 'hummer', 'oyster', 'auster',
              'mackerel', 'makrele', 'hering', 'herring', 'monkfish', 'seabass', 'sea bass', 'dorade', 'tilapia'],
      // Würzsaucen zählen extra (siehe "fischwuerze"), nicht als Hauptzutat
      except: ['fischsauce', 'fish sauce', 'austernsauce', 'oyster sauce', 'sardellenpaste', 'anchovy paste',
               'garnelenpaste', 'shrimp paste'],
    },
    // Fisch nur als Würze: macht ein Gericht NICHT vegetarisch,
    // soll aber ein Hähnchen-Curry nicht zum "Fischgericht" machen.
    fischwuerze: {
      words: ['fischsauce', 'fish sauce', 'austernsauce', 'oyster sauce', 'sardellenpaste', 'anchovy paste',
              'garnelenpaste', 'shrimp paste', 'worcester'],
      except: [],
    },
    lamm: {
      words: ['lamm', 'lamb', 'goat', 'ziege', 'mutton', 'hammel'],
      except: ['ziegenkäse', 'goat cheese', "goat's cheese", 'goats cheese'],
    },
    milch: {
      words: ['milch', 'sahne', 'butter', 'käse', 'joghurt', 'quark', 'schmand', 'crème fraîche', 'creme fraiche',
              'crème fraiche', 'mozzarella', 'parmesan', 'feta', 'ricotta', 'mascarpone', 'gouda', 'emmentaler',
              'ghee', 'cream', 'cheese', 'yogurt', 'yoghurt', 'milk', 'paneer', 'halloumi', 'cheddar', 'pecorino',
              'gruyère', 'gruyere', 'brie', 'camembert', 'buttermilk', 'kefir', 'skyr'],
      except: ['kokosmilch', 'hafermilch', 'sojamilch', 'mandelmilch', 'reismilch', 'erdnussbutter', 'coconut milk',
               'coconut cream', 'kokoscreme', 'almond milk', 'oat milk', 'soy milk', 'soya milk', 'peanut butter',
               'butternut', 'butter bean', 'butterbohne', 'vegan', 'pflanzlich', 'hafersahne', 'sojasahne',
               'kakaobutter', 'cocoa butter', 'cream of tartar', 'ice cream'],
    },
    nuss: {
      words: ['nuss', 'nüsse', 'mandel', 'cashew', 'pinienkern', 'pistazie', 'pekannuss', 'macadamia', ' nut', 'nuts ', 'almond',
              'peanut', 'pecan', 'pistachio', 'pine nut', 'hazelnut', 'walnut', 'marzipan', 'nougat'],
      except: ['muskatnuss', 'nutmeg', 'kokosnuss', 'coconut', 'butternut', 'nutrition', 'donut', 'doughnut'],
    },
    gluten: {
      words: ['weizen', 'mehl', 'nudel', 'spaghetti', 'pasta', 'penne', 'fusilli', 'tagliatelle', 'lasagne', 'lasagna',
              'makkaroni', 'macaroni', 'brot', 'brötchen', 'semmel', 'paniermehl', 'couscous', 'bulgur', 'dinkel',
              'gerste', 'grünkern', 'sojasauce', 'sojasoße', 'bier', 'tortilla', 'wrap', 'blätterteig', 'teig', 'gnocchi',
              'spätzle', 'maultasche', 'baguette', 'pita', 'naan', 'udon', 'ramen', 'flour', 'bread', 'noodle',
              'breadcrumb', 'soy sauce', 'beer', 'pastry', 'barley', 'orzo', 'panko', 'cracker', 'seitan', 'filo',
              'phyllo', 'semolina', 'grieß', ' bun', 'ravioli', 'tortellini', 'linguine', 'rigatoni',
              'farfalle', 'vermicelli', 'biscuit', 'cake', 'roggen', ' rye', 'malz', 'malt'],
      except: ['buchweizen', 'reisnudel', 'glasnudel', 'maismehl', 'reismehl', 'kichererbsenmehl', 'kartoffelmehl',
               'mehlig', 'glutenfrei', 'reisbandnudel', 'rice noodle', 'rice vermicelli', 'corn tortilla', 'maistortilla', 'gluten-free',
               'gluten free', 'buckwheat', 'cornflour', 'corn flour', 'rice flour', 'tamari', 'brotgewürz',
               'bunch', 'bundle', 'gram flour', 'chickpea flour', 'almond flour', 'mandelmehl', 'kokosmehl'],
    },
    honig: { words: ['honig', 'honey'], except: [] },
  };

  // Ei wird mit einem regulären Ausdruck gesucht, weil "ei" sonst
  // in "Reis", "Weizen", "Zwiebel"... gefunden würde.
  // \b = Wortgrenze. Achtung: "eier?" hieße "eie" + optional "r" – deshalb "ei|eier" ausgeschrieben.
  const EGG_REGEX = /\b(ei|eier|eigelb|eiwei|eiernudeln|eggs?|egg yolks?|egg whites?)\b/;
  const EGG_EXCEPT = ['eggplant'];

  // Reihenfolge = Priorität, wenn ein Rezept mehrere Sorten enthält
  const PROTEINS = ['fisch', 'gefluegel', 'rind', 'schwein', 'lamm'];

  const PROTEIN_LABELS = {
    fisch: 'Fisch & Meeresfrüchte',
    gefluegel: 'Geflügel',
    rind: 'Rind',
    schwein: 'Schwein',
    lamm: 'Lamm & Ziege',
    vegetarisch: 'Vegetarisch',
    vegan: 'Vegan',
  };

  function removeExceptions(text, exceptions) {
    let t = text;
    for (const ex of exceptions) t = t.split(ex).join(' ');
    return t;
  }

  function hasRule(text, rule) {
    const cleaned = removeExceptions(text, rule.except);
    return rule.words.some(w => cleaned.includes(w));
  }

  // Prüft eine einzelne Zutat. Rückgabe: Set mit gefundenen Eigenschaften
  function analyzeIngredient(name) {
    const text = ' ' + String(name).toLowerCase() + ' ';
    const found = new Set();
    for (const [key, rule] of Object.entries(RULES)) {
      if (hasRule(text, rule)) found.add(key);
    }
    const eggText = removeExceptions(text, EGG_EXCEPT);
    if (EGG_REGEX.test(eggText) || text.includes('mayo')) found.add('ei');
    return found;
  }

  // Hauptfunktion: nimmt ein Rezept und gibt Flags + Fleischsorten zurück.
  // extraProteins: z. B. aus der TheMealDB-Kategorie "Seafood".
  function analyzeRecipe(recipe, extraProteins = []) {
    const all = new Set(extraProteins);
    for (const ing of recipe.ingredients) {
      for (const f of analyzeIngredient(ing.name)) all.add(f);
    }
    const main = PROTEINS.filter(p => all.has(p));          // echte Hauptzutaten
    const proteins = [...main];
    if (all.has('fischwuerze') && !proteins.includes('fisch')) proteins.push('fisch');
    const vegetarian = proteins.length === 0;
    const vegan = vegetarian && !all.has('milch') && !all.has('ei') && !all.has('honig');
    return {
      proteins,                                              // alles, was drin ist (für Ausschluss-Filter)
      mainProtein: main[0] || proteins[0] || (vegan ? 'vegan' : 'vegetarisch'), // für Abwechslung
      flags: {
        vegetarian,
        vegan,
        glutenFree: !all.has('gluten'),
        lactoseFree: !all.has('milch'),
        nutFree: !all.has('nuss'),
        eggFree: !all.has('ei'),
      },
    };
  }

  return { analyzeIngredient, analyzeRecipe, PROTEINS, PROTEIN_LABELS };
})();

if (typeof module !== 'undefined') module.exports = Classify;
