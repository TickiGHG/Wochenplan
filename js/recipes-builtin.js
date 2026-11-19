// =============================================================
// recipes-builtin.js – eingebaute deutsche Rezeptsammlung
// Alle Mengen gelten für 4 Portionen.
// Zutat = [Menge, Einheit, Name]  (Menge null = "nach Geschmack")
// time = Gesamtzeit in Minuten, difficulty: 1 einfach, 2 mittel, 3 aufwendig
// Vegetarisch/vegan/glutenfrei usw. wird NICHT hier eingetragen,
// sondern automatisch in classify.js aus den Zutaten erkannt.
// =============================================================

const BUILTIN_RECIPES = [
  // ---------------------------------------------------- Italienisch
  {
    name: 'Spaghetti Bolognese', cuisine: 'Italienisch', time: 50, difficulty: 1, tags: ['Pasta', 'Klassiker'],
    ingredients: [
      [400, 'g', 'Spaghetti'], [500, 'g', 'Rinderhackfleisch'], [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'],
      [1, 'Stück', 'Karotte'], [1, 'Stange', 'Staudensellerie'], [2, 'EL', 'Tomatenmark'], [800, 'g', 'passierte Tomaten'],
      [2, 'EL', 'Olivenöl'], [1, 'TL', 'Oregano, getrocknet'], [null, '', 'Salz und Pfeffer'], [50, 'g', 'Parmesan'],
    ],
    steps: [
      'Zwiebel, Knoblauch, Karotte und Sellerie sehr fein würfeln.',
      'Olivenöl in einem Topf erhitzen, das Hackfleisch darin krümelig braun anbraten.',
      'Gemüse dazugeben und 5 Minuten mitbraten, dann das Tomatenmark kurz mitrösten.',
      'Passierte Tomaten und Oregano zugeben, mit Salz und Pfeffer würzen und bei kleiner Hitze mindestens 30 Minuten köcheln lassen.',
      'In der Zwischenzeit die Spaghetti in reichlich Salzwasser nach Packungsangabe kochen.',
      'Spaghetti abgießen, mit der Soße anrichten und mit geriebenem Parmesan servieren.',
    ],
  },
  {
    name: 'Spaghetti Carbonara', cuisine: 'Italienisch', time: 25, difficulty: 2, tags: ['Pasta', 'Schnell'],
    ingredients: [
      [400, 'g', 'Spaghetti'], [150, 'g', 'Speck (oder Guanciale)'], [4, 'Stück', 'Eigelb'], [1, 'Stück', 'Ei'],
      [80, 'g', 'Parmesan oder Pecorino'], [null, '', 'Pfeffer, frisch gemahlen'], [null, '', 'Salz'],
    ],
    steps: [
      'Spaghetti in reichlich Salzwasser bissfest kochen.',
      'Speck in Streifen schneiden und in einer großen Pfanne ohne Öl knusprig auslassen. Pfanne vom Herd nehmen.',
      'Eigelb, Ei und geriebenen Käse verquirlen und kräftig pfeffern.',
      'Etwa eine Tasse Nudelwasser aufheben, Spaghetti abgießen und sofort zum Speck in die Pfanne geben.',
      'Eiermasse unterrühren und mit etwas Nudelwasser cremig ziehen lassen – die Pfanne darf nicht mehr auf der heißen Platte stehen, sonst stockt das Ei.',
      'Sofort mit extra Käse und Pfeffer servieren.',
    ],
  },
  {
    name: 'Lasagne', cuisine: 'Italienisch', time: 90, difficulty: 3, tags: ['Ofen', 'Pasta'],
    ingredients: [
      [12, 'Stück', 'Lasagneplatten'], [500, 'g', 'Hackfleisch gemischt'], [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'],
      [800, 'g', 'passierte Tomaten'], [2, 'EL', 'Tomatenmark'], [50, 'g', 'Butter'], [50, 'g', 'Mehl'],
      [600, 'ml', 'Milch'], [1, 'Prise', 'Muskatnuss'], [150, 'g', 'Mozzarella'], [50, 'g', 'Parmesan'],
      [null, '', 'Salz und Pfeffer'], [1, 'EL', 'Olivenöl'],
    ],
    steps: [
      'Zwiebel und Knoblauch würfeln, in Olivenöl anschwitzen, Hackfleisch zugeben und krümelig braten.',
      'Tomatenmark und passierte Tomaten unterrühren, würzen und 20 Minuten köcheln lassen.',
      'Für die Béchamel Butter schmelzen, Mehl einrühren, nach und nach die Milch zugießen und unter Rühren aufkochen, bis die Soße andickt. Mit Salz, Pfeffer und Muskat würzen.',
      'Ofen auf 180 °C Umluft vorheizen. In eine Auflaufform abwechselnd Fleischsoße, Lasagneplatten und Béchamel schichten, mit Béchamel abschließen.',
      'Mit Mozzarella und Parmesan bestreuen und 35–40 Minuten goldbraun backen.',
      'Vor dem Anschneiden 10 Minuten ruhen lassen.',
    ],
  },
  {
    name: 'Pilzrisotto', cuisine: 'Italienisch', time: 40, difficulty: 2, tags: ['Reis'],
    ingredients: [
      [300, 'g', 'Risottoreis'], [400, 'g', 'Champignons'], [1, 'Stück', 'Zwiebel'], [1, 'l', 'Gemüsebrühe'],
      [100, 'ml', 'Weißwein (optional)'], [40, 'g', 'Butter'], [60, 'g', 'Parmesan'], [2, 'EL', 'Olivenöl'],
      [null, '', 'Salz und Pfeffer'], [0.5, 'Bund', 'Petersilie'],
    ],
    steps: [
      'Brühe in einem Topf heiß halten. Zwiebel fein würfeln, Pilze in Scheiben schneiden.',
      'Pilze in einer Pfanne mit 1 EL Öl kräftig anbraten, salzen und beiseitestellen.',
      'Zwiebel im restlichen Öl glasig dünsten, Reis dazugeben und 1 Minute mitrösten, bis er glasig ist.',
      'Mit Weißwein ablöschen (oder einer Kelle Brühe), dann nach und nach Brühe angießen und unter häufigem Rühren ca. 18–20 Minuten garen.',
      'Pilze, Butter und geriebenen Parmesan unterrühren, abschmecken und mit gehackter Petersilie servieren.',
    ],
  },
  {
    name: 'Pasta mit Pesto und Kirschtomaten', cuisine: 'Italienisch', time: 20, difficulty: 1, tags: ['Pasta', 'Schnell'],
    ingredients: [
      [400, 'g', 'Penne'], [1, 'Bund', 'Basilikum'], [40, 'g', 'Pinienkerne'], [50, 'g', 'Parmesan'],
      [1, 'Zehe', 'Knoblauch'], [100, 'ml', 'Olivenöl'], [250, 'g', 'Kirschtomaten'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Nudeln in Salzwasser bissfest kochen.',
      'Pinienkerne in einer trockenen Pfanne goldbraun rösten.',
      'Basilikum, Pinienkerne, Knoblauch, Parmesan und Olivenöl im Mixer zu Pesto pürieren, mit Salz und Pfeffer würzen.',
      'Kirschtomaten halbieren.',
      'Nudeln abgießen, mit Pesto und Tomaten vermengen und sofort servieren.',
    ],
  },
  {
    name: 'Pizza Margherita', cuisine: 'Italienisch', time: 100, difficulty: 2, tags: ['Ofen', 'Wochenende'],
    ingredients: [
      [500, 'g', 'Weizenmehl Type 405'], [7, 'g', 'Trockenhefe'], [300, 'ml', 'lauwarmes Wasser'], [3, 'EL', 'Olivenöl'],
      [1, 'TL', 'Salz'], [400, 'g', 'stückige Tomaten'], [1, 'TL', 'Oregano, getrocknet'], [250, 'g', 'Mozzarella'],
      [1, 'Bund', 'Basilikum'],
    ],
    steps: [
      'Mehl, Hefe, Salz, Wasser und 2 EL Olivenöl 8–10 Minuten zu einem glatten Teig kneten. Abgedeckt 1 Stunde gehen lassen.',
      'Ofen auf höchster Stufe (mind. 250 °C Ober-/Unterhitze) mit Backblech vorheizen.',
      'Tomaten mit Oregano, Salz und 1 EL Olivenöl verrühren.',
      'Teig halbieren, dünn ausrollen, mit Tomatensoße bestreichen und mit zerrupftem Mozzarella belegen.',
      'Pizzen nacheinander 8–10 Minuten backen, bis der Rand braun ist. Mit frischem Basilikum belegen.',
    ],
  },
  {
    name: 'Ofen-Gnocchi mit Tomaten und Mozzarella', cuisine: 'Italienisch', time: 30, difficulty: 1, tags: ['Ofen', 'Schnell'],
    ingredients: [
      [800, 'g', 'Gnocchi (Kühlregal)'], [500, 'g', 'Kirschtomaten'], [1, 'Stück', 'Zucchini'], [2, 'Zehe', 'Knoblauch'],
      [3, 'EL', 'Olivenöl'], [125, 'g', 'Mozzarella'], [null, '', 'Salz und Pfeffer'], [1, 'TL', 'italienische Kräuter'],
    ],
    steps: [
      'Ofen auf 200 °C Umluft vorheizen.',
      'Tomaten halbieren, Zucchini würfeln, Knoblauch hacken.',
      'Gnocchi, Gemüse, Knoblauch, Olivenöl und Kräuter in einer Auflaufform mischen, salzen und pfeffern.',
      '20 Minuten backen, dann Mozzarella in Stücken darauf verteilen und weitere 5–8 Minuten backen.',
    ],
  },
  {
    name: 'Minestrone', cuisine: 'Italienisch', time: 45, difficulty: 1, tags: ['Suppe', 'Eintopf'],
    ingredients: [
      [1, 'Stück', 'Zwiebel'], [2, 'Stück', 'Karotte'], [2, 'Stange', 'Staudensellerie'], [1, 'Stück', 'Zucchini'],
      [2, 'Stück', 'Kartoffel'], [400, 'g', 'stückige Tomaten'], [1, 'Dose', 'weiße Bohnen (ca. 240 g)'],
      [1.2, 'l', 'Gemüsebrühe'], [100, 'g', 'Suppennudeln (Ditalini)'], [2, 'EL', 'Olivenöl'],
      [null, '', 'Salz und Pfeffer'], [0.5, 'Bund', 'Basilikum'],
    ],
    steps: [
      'Alle Gemüse in kleine Würfel schneiden.',
      'Olivenöl erhitzen, Zwiebel, Karotte und Sellerie 5 Minuten anschwitzen.',
      'Kartoffeln, Zucchini, Tomaten und Brühe zugeben und 15 Minuten köcheln lassen.',
      'Abgetropfte Bohnen und Nudeln zufügen und weitere 10 Minuten kochen, bis die Nudeln gar sind.',
      'Abschmecken und mit Basilikum servieren.',
    ],
  },
  {
    name: 'Penne all\'arrabbiata', cuisine: 'Italienisch', time: 25, difficulty: 1, tags: ['Pasta', 'Schnell', 'Scharf'],
    ingredients: [
      [400, 'g', 'Penne'], [800, 'g', 'stückige Tomaten'], [3, 'Zehe', 'Knoblauch'], [1, 'Stück', 'getrocknete Chilischote'],
      [3, 'EL', 'Olivenöl'], [0.5, 'Bund', 'Petersilie'], [null, '', 'Salz'],
    ],
    steps: [
      'Penne in Salzwasser bissfest kochen.',
      'Knoblauch in Scheiben schneiden, Chili zerbröseln und beides im Olivenöl kurz anschwitzen (nicht braun werden lassen).',
      'Tomaten zugeben, salzen und 15 Minuten einköcheln lassen.',
      'Penne abgießen, mit der Soße mischen und mit gehackter Petersilie bestreuen.',
    ],
  },

  // ---------------------------------------------------- Deutsch
  {
    name: 'Paniertes Schnitzel mit Bratkartoffeln', cuisine: 'Deutsch', time: 45, difficulty: 2, tags: ['Klassiker'],
    ingredients: [
      [4, 'Stück', 'Schweineschnitzel'], [2, 'Stück', 'Ei'], [60, 'g', 'Mehl'], [100, 'g', 'Paniermehl'],
      [800, 'g', 'festkochende Kartoffeln'], [1, 'Stück', 'Zwiebel'], [6, 'EL', 'Sonnenblumenöl'],
      [1, 'Stück', 'Zitrone'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Kartoffeln mit Schale ca. 20 Minuten kochen, pellen und in Scheiben schneiden (geht auch gut mit Kartoffeln vom Vortag).',
      'Kartoffelscheiben in 3 EL Öl rundum knusprig braten, Zwiebelwürfel kurz vor Ende zugeben, salzen und pfeffern.',
      'Schnitzel flach klopfen, salzen und pfeffern. Nacheinander in Mehl, verquirltem Ei und Paniermehl wenden.',
      'Schnitzel im restlichen heißen Öl pro Seite 3–4 Minuten goldbraun braten.',
      'Mit Bratkartoffeln und Zitronenspalten servieren.',
    ],
  },
  {
    name: 'Rinderrouladen mit Rotkohl', cuisine: 'Deutsch', time: 150, difficulty: 3, tags: ['Wochenende', 'Klassiker'],
    ingredients: [
      [4, 'Stück', 'Rinderrouladen'], [4, 'Scheibe', 'Bacon'], [4, 'TL', 'mittelscharfer Senf'], [2, 'Stück', 'Gewürzgurke'],
      [2, 'Stück', 'Zwiebel'], [1, 'Stück', 'Karotte'], [1, 'EL', 'Tomatenmark'], [250, 'ml', 'Rotwein'],
      [500, 'ml', 'Rinderfond'], [2, 'EL', 'Butterschmalz'], [700, 'g', 'Rotkohl (Glas)'],
      [800, 'g', 'Kartoffeln'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Rouladen ausbreiten, salzen, pfeffern, mit Senf bestreichen und mit Speck, Gurkenstreifen und etwas Zwiebel belegen. Aufrollen und mit Rouladennadeln oder Garn fixieren.',
      'Rouladen in Butterschmalz rundum kräftig anbraten und herausnehmen.',
      'Restliche Zwiebel und Karotte würfeln, im Bratfett anrösten, Tomatenmark kurz mitrösten, mit Rotwein ablöschen.',
      'Fond zugießen, Rouladen zurück in den Topf geben und zugedeckt ca. 1,5 Stunden schmoren.',
      'Kartoffeln kochen und Rotkohl erwärmen.',
      'Rouladen herausnehmen, Soße pürieren und abschmecken. Alles zusammen servieren.',
    ],
  },
  {
    name: 'Käsespätzle', cuisine: 'Deutsch', time: 40, difficulty: 2, tags: ['Klassiker'],
    ingredients: [
      [500, 'g', 'Spätzle (frisch oder getrocknet)'], [250, 'g', 'Bergkäse oder Emmentaler'], [3, 'Stück', 'Zwiebel'],
      [30, 'g', 'Butter'], [null, '', 'Salz und Pfeffer'], [0.5, 'Bund', 'Schnittlauch'],
    ],
    steps: [
      'Zwiebeln in Ringe schneiden und in der Butter bei mittlerer Hitze ca. 15 Minuten goldbraun rösten.',
      'Spätzle nach Packungsangabe kochen, Käse reiben. Ofen auf 180 °C vorheizen.',
      'Spätzle und Käse abwechselnd in eine Auflaufform schichten, pfeffern.',
      'Röstzwiebeln obenauf verteilen und 10 Minuten im Ofen backen, bis der Käse geschmolzen ist.',
      'Mit Schnittlauch bestreuen.',
    ],
  },
  {
    name: 'Kartoffelsuppe', cuisine: 'Deutsch', time: 45, difficulty: 1, tags: ['Suppe'],
    ingredients: [
      [1, 'kg', 'mehligkochende Kartoffeln'], [2, 'Stück', 'Karotte'], [0.25, 'Stück', 'Knollensellerie'],
      [1, 'Stange', 'Lauch'], [1, 'Stück', 'Zwiebel'], [1.2, 'l', 'Gemüsebrühe'], [100, 'ml', 'Sahne'],
      [1, 'TL', 'Majoran, getrocknet'], [1, 'EL', 'Butter'], [null, '', 'Salz, Pfeffer, Muskatnuss'],
    ],
    steps: [
      'Kartoffeln, Karotten und Sellerie schälen und würfeln, Lauch in Ringe, Zwiebel in Würfel schneiden.',
      'Zwiebel und Lauch in Butter anschwitzen.',
      'Restliches Gemüse und Brühe zugeben und ca. 20 Minuten weich kochen.',
      'Etwa die Hälfte grob pürieren, Sahne und Majoran unterrühren.',
      'Mit Salz, Pfeffer und Muskat abschmecken.',
    ],
  },
  {
    name: 'Linseneintopf', cuisine: 'Deutsch', time: 50, difficulty: 1, tags: ['Eintopf'],
    ingredients: [
      [250, 'g', 'Tellerlinsen'], [3, 'Stück', 'Kartoffel'], [2, 'Stück', 'Karotte'], [1, 'Stange', 'Lauch'],
      [1, 'Stück', 'Zwiebel'], [1.2, 'l', 'Gemüsebrühe'], [2, 'EL', 'Rapsöl'], [2, 'EL', 'Apfelessig'],
      [1, 'TL', 'Zucker'], [1, 'Stück', 'Lorbeerblatt'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Zwiebel würfeln und im Öl anschwitzen.',
      'Kartoffeln, Karotten und Lauch klein schneiden und kurz mitdünsten.',
      'Linsen, Brühe und Lorbeerblatt zugeben und ca. 35 Minuten köcheln lassen, bis die Linsen weich sind.',
      'Mit Essig, Zucker, Salz und Pfeffer süß-sauer abschmecken.',
    ],
  },
  {
    name: 'Frikadellen mit Kartoffelpüree', cuisine: 'Deutsch', time: 45, difficulty: 1, tags: ['Klassiker'],
    ingredients: [
      [500, 'g', 'Hackfleisch gemischt'], [1, 'Stück', 'Brötchen vom Vortag'], [1, 'Stück', 'Ei'], [1, 'Stück', 'Zwiebel'],
      [1, 'TL', 'Senf'], [1, 'kg', 'mehligkochende Kartoffeln'], [200, 'ml', 'Milch'], [40, 'g', 'Butter'],
      [2, 'EL', 'Öl'], [null, '', 'Salz, Pfeffer, Muskatnuss'],
    ],
    steps: [
      'Brötchen in Wasser einweichen und gut ausdrücken. Zwiebel fein würfeln.',
      'Hackfleisch, Brötchen, Ei, Zwiebel und Senf verkneten, kräftig salzen und pfeffern. 8 flache Frikadellen formen.',
      'Kartoffeln schälen, würfeln und in Salzwasser 20 Minuten weich kochen.',
      'Frikadellen im Öl bei mittlerer Hitze pro Seite 5–6 Minuten braten.',
      'Kartoffeln abgießen, mit warmer Milch und Butter stampfen, mit Muskat abschmecken.',
    ],
  },
  {
    name: 'Hähnchenbrust mit Ofengemüse', cuisine: 'Deutsch', time: 45, difficulty: 1, tags: ['Ofen', 'Gesund'],
    ingredients: [
      [4, 'Stück', 'Hähnchenbrustfilet'], [600, 'g', 'Kartoffeln (klein)'], [2, 'Stück', 'Paprika'], [1, 'Stück', 'Zucchini'],
      [1, 'Stück', 'rote Zwiebel'], [4, 'EL', 'Olivenöl'], [1, 'TL', 'Paprikapulver edelsüß'],
      [1, 'TL', 'Rosmarin, getrocknet'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Ofen auf 200 °C Umluft vorheizen. Kartoffeln halbieren, Gemüse in grobe Stücke schneiden.',
      'Kartoffeln mit 2 EL Öl, Rosmarin und Salz auf dem Blech verteilen und 15 Minuten vorbacken.',
      'Hähnchen mit Paprikapulver, Salz, Pfeffer und 1 EL Öl einreiben.',
      'Gemüse mit dem restlichen Öl zu den Kartoffeln geben, Hähnchen darauflegen und weitere 20–25 Minuten backen, bis das Fleisch durchgegart ist.',
    ],
  },
  {
    name: 'Kartoffel-Gemüse-Auflauf', cuisine: 'Deutsch', time: 60, difficulty: 1, tags: ['Ofen'],
    ingredients: [
      [800, 'g', 'festkochende Kartoffeln'], [300, 'g', 'Brokkoli'], [2, 'Stück', 'Karotte'], [200, 'ml', 'Sahne'],
      [200, 'ml', 'Milch'], [2, 'Stück', 'Ei'], [150, 'g', 'Gouda, gerieben'], [null, '', 'Salz, Pfeffer, Muskatnuss'],
    ],
    steps: [
      'Ofen auf 180 °C Umluft vorheizen. Kartoffeln und Karotten schälen und in dünne Scheiben schneiden, Brokkoli in Röschen teilen.',
      'Brokkoli 3 Minuten in Salzwasser vorgaren.',
      'Gemüse und Kartoffeln in eine gefettete Auflaufform schichten.',
      'Sahne, Milch und Eier verquirlen, kräftig würzen und darübergießen.',
      'Mit Käse bestreuen und 40–45 Minuten backen, bis die Kartoffeln weich sind.',
    ],
  },
  {
    name: 'Spinat-Feta-Pfannkuchen', cuisine: 'Deutsch', time: 30, difficulty: 1, tags: ['Schnell'],
    ingredients: [
      [250, 'g', 'Mehl'], [500, 'ml', 'Milch'], [3, 'Stück', 'Ei'], [450, 'g', 'Blattspinat (TK)'], [200, 'g', 'Feta'],
      [1, 'Stück', 'Zwiebel'], [1, 'Zehe', 'Knoblauch'], [2, 'EL', 'Öl'], [null, '', 'Salz, Pfeffer, Muskatnuss'],
    ],
    steps: [
      'Mehl, Milch, Eier und eine Prise Salz zu einem glatten Teig verrühren und 10 Minuten quellen lassen.',
      'Zwiebel und Knoblauch würfeln, in etwas Öl andünsten, Spinat zugeben und auftauen/garen lassen. Mit Salz, Pfeffer, Muskat würzen.',
      'Feta zerbröseln und unter den Spinat heben.',
      'Im restlichen Öl nacheinander dünne Pfannkuchen ausbacken.',
      'Pfannkuchen mit der Spinatfüllung belegen und zusammenklappen.',
    ],
  },
  {
    name: 'Lachs mit Zitronen-Dill-Kartoffeln', cuisine: 'Deutsch', time: 35, difficulty: 1, tags: ['Fisch', 'Gesund'],
    ingredients: [
      [4, 'Stück', 'Lachsfilet (à ca. 150 g)'], [800, 'g', 'kleine Kartoffeln'], [1, 'Stück', 'Zitrone'],
      [1, 'Bund', 'Dill'], [200, 'g', 'Schmand'], [500, 'g', 'grüne Bohnen'], [2, 'EL', 'Olivenöl'],
      [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Kartoffeln in Salzwasser ca. 20 Minuten kochen. Bohnen putzen und in den letzten 8 Minuten mitkochen.',
      'Schmand mit gehacktem Dill, etwas Zitronensaft, Salz und Pfeffer verrühren.',
      'Lachs salzen und pfeffern und im Olivenöl auf der Hautseite 4 Minuten braten, wenden und 2–3 Minuten fertig garen.',
      'Kartoffeln und Bohnen abgießen, mit Zitronenabrieb würzen und mit Lachs und Dill-Schmand servieren.',
    ],
  },
  {
    name: 'Ofenkartoffeln mit Kräuterquark', cuisine: 'Deutsch', time: 60, difficulty: 1, tags: ['Ofen'],
    ingredients: [
      [4, 'Stück', 'große mehligkochende Kartoffeln'], [500, 'g', 'Magerquark'], [100, 'g', 'Joghurt'],
      [1, 'Bund', 'Schnittlauch'], [0.5, 'Bund', 'Petersilie'], [1, 'Zehe', 'Knoblauch'], [2, 'EL', 'Olivenöl'],
      [null, '', 'Salz und Pfeffer'], [1, 'Stück', 'Gurke'],
    ],
    steps: [
      'Ofen auf 200 °C vorheizen. Kartoffeln waschen, mehrmals mit einer Gabel einstechen, mit Öl und Salz einreiben.',
      'Kartoffeln ca. 50–60 Minuten backen, bis sie innen weich sind.',
      'Quark mit Joghurt, gehackten Kräutern und gepresstem Knoblauch verrühren, salzen und pfeffern.',
      'Kartoffeln kreuzweise einschneiden, etwas aufdrücken und mit Kräuterquark und Gurkenscheiben servieren.',
    ],
  },
  {
    name: 'Kürbissuppe mit Kokosmilch', cuisine: 'Deutsch', time: 40, difficulty: 1, tags: ['Suppe', 'Herbst'],
    ingredients: [
      [1, 'kg', 'Hokkaido-Kürbis'], [1, 'Stück', 'Zwiebel'], [1, 'Stück', 'Ingwer (ca. 2 cm)'], [800, 'ml', 'Gemüsebrühe'],
      [400, 'ml', 'Kokosmilch'], [1, 'EL', 'Rapsöl'], [1, 'TL', 'Currypulver'], [null, '', 'Salz und Pfeffer'],
      [2, 'EL', 'Kürbiskerne'],
    ],
    steps: [
      'Kürbis waschen, entkernen und mit Schale würfeln. Zwiebel und Ingwer fein hacken.',
      'Zwiebel und Ingwer im Öl anschwitzen, Curry kurz mitrösten.',
      'Kürbis und Brühe zugeben und ca. 20 Minuten weich kochen.',
      'Kokosmilch zugeben, fein pürieren und abschmecken.',
      'Mit gerösteten Kürbiskernen servieren.',
    ],
  },

  // ---------------------------------------------------- Ungarisch / Osteuropa
  {
    name: 'Rindergulasch', cuisine: 'Ungarisch', time: 130, difficulty: 2, tags: ['Schmoren', 'Wochenende'],
    ingredients: [
      [1, 'kg', 'Rindergulasch'], [800, 'g', 'Zwiebel'], [2, 'EL', 'Tomatenmark'], [2, 'EL', 'Paprikapulver edelsüß'],
      [1, 'TL', 'Paprikapulver rosenscharf'], [1, 'TL', 'Kümmel, gemahlen'], [2, 'Zehe', 'Knoblauch'],
      [600, 'ml', 'Rinderfond'], [2, 'EL', 'Butterschmalz'], [null, '', 'Salz und Pfeffer'], [400, 'g', 'Bandnudeln'],
    ],
    steps: [
      'Zwiebeln in Würfel schneiden. Fleisch trocken tupfen.',
      'Fleisch portionsweise im Butterschmalz kräftig anbraten und herausnehmen.',
      'Zwiebeln im Bratfett 10 Minuten goldbraun schmoren, Tomatenmark und Knoblauch kurz mitrösten.',
      'Topf kurz vom Herd nehmen, Paprikapulver und Kümmel unterrühren (verbrennt sonst leicht), dann Fleisch und Fond zugeben.',
      'Zugedeckt bei kleiner Hitze ca. 1,5 Stunden schmoren, bis das Fleisch zart ist. Abschmecken.',
      'Mit Bandnudeln (oder Kartoffeln) servieren.',
    ],
  },

  // ---------------------------------------------------- Mexikanisch
  {
    name: 'Chili con Carne', cuisine: 'Mexikanisch', time: 60, difficulty: 1, tags: ['Eintopf', 'Scharf'],
    ingredients: [
      [500, 'g', 'Rinderhackfleisch'], [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'], [1, 'Stück', 'Paprika'],
      [800, 'g', 'stückige Tomaten'], [1, 'Dose', 'Kidneybohnen (ca. 250 g)'], [1, 'Dose', 'Mais (ca. 140 g)'],
      [1, 'TL', 'Kreuzkümmel'], [1, 'TL', 'Chiliflocken'], [1, 'EL', 'Tomatenmark'], [2, 'EL', 'Öl'],
      [null, '', 'Salz und Pfeffer'], [250, 'g', 'Reis'],
    ],
    steps: [
      'Zwiebel, Knoblauch und Paprika würfeln.',
      'Hackfleisch im Öl krümelig anbraten, Zwiebel, Knoblauch und Paprika zugeben und mitbraten.',
      'Tomatenmark, Kreuzkümmel und Chili kurz mitrösten, dann Tomaten zugeben.',
      '20 Minuten köcheln lassen, dann abgespülte Bohnen und Mais zufügen und weitere 10 Minuten köcheln.',
      'Reis nach Packungsangabe kochen und zum Chili servieren.',
    ],
  },
  {
    name: 'Chili sin Carne', cuisine: 'Mexikanisch', time: 50, difficulty: 1, tags: ['Eintopf', 'Scharf'],
    ingredients: [
      [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'], [2, 'Stück', 'Paprika'], [1, 'Stück', 'Süßkartoffel'],
      [800, 'g', 'stückige Tomaten'], [1, 'Dose', 'Kidneybohnen (ca. 250 g)'], [1, 'Dose', 'schwarze Bohnen (ca. 250 g)'],
      [1, 'Dose', 'Mais (ca. 140 g)'], [1, 'TL', 'Kreuzkümmel'], [1, 'TL', 'Paprikapulver geräuchert'],
      [1, 'TL', 'Chiliflocken'], [2, 'EL', 'Olivenöl'], [null, '', 'Salz und Pfeffer'], [1, 'Stück', 'Limette'],
    ],
    steps: [
      'Zwiebel, Knoblauch, Paprika und Süßkartoffel würfeln.',
      'Zwiebel und Knoblauch im Öl anschwitzen, Gewürze kurz mitrösten.',
      'Paprika, Süßkartoffel und Tomaten zugeben und 20 Minuten köcheln lassen.',
      'Abgespülte Bohnen und Mais zufügen und weitere 10 Minuten köcheln.',
      'Mit Salz, Pfeffer und Limettensaft abschmecken.',
    ],
  },
  {
    name: 'Hähnchen-Tacos', cuisine: 'Mexikanisch', time: 30, difficulty: 1, tags: ['Schnell'],
    ingredients: [
      [500, 'g', 'Hähnchenbrustfilet'], [12, 'Stück', 'kleine Weizentortillas'], [1, 'Stück', 'Avocado'],
      [2, 'Stück', 'Tomate'], [1, 'Stück', 'rote Zwiebel'], [1, 'Stück', 'Limette'], [150, 'g', 'saure Sahne'],
      [1, 'TL', 'Kreuzkümmel'], [1, 'TL', 'Paprikapulver'], [2, 'EL', 'Öl'], [0.5, 'Bund', 'Koriander'],
      [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Hähnchen in Streifen schneiden und mit Kreuzkümmel, Paprika, Salz und Pfeffer würzen.',
      'Im heißen Öl 6–8 Minuten rundum braten, bis es durch ist.',
      'Tomaten und Zwiebel würfeln, Avocado zerdrücken und mit Limettensaft und Salz würzen.',
      'Tortillas in einer trockenen Pfanne kurz erwärmen.',
      'Mit Hähnchen, Avocado, Tomaten-Zwiebel-Mix, saurer Sahne und Koriander füllen.',
    ],
  },
  {
    name: 'Bohnen-Burritos', cuisine: 'Mexikanisch', time: 30, difficulty: 1, tags: ['Schnell'],
    ingredients: [
      [4, 'Stück', 'große Weizentortillas'], [1, 'Dose', 'schwarze Bohnen (ca. 250 g)'], [150, 'g', 'Reis'],
      [1, 'Dose', 'Mais (ca. 140 g)'], [1, 'Stück', 'Paprika'], [100, 'g', 'Cheddar, gerieben'], [150, 'g', 'Salsa'],
      [1, 'TL', 'Kreuzkümmel'], [1, 'EL', 'Öl'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Reis nach Packungsangabe kochen.',
      'Paprika würfeln und im Öl anbraten, Bohnen und Mais zugeben, mit Kreuzkümmel, Salz und Pfeffer würzen und leicht zerdrücken.',
      'Tortillas erwärmen, mit Reis, Bohnenmischung, Salsa und Käse belegen.',
      'Seiten einschlagen, fest aufrollen und in einer Pfanne von beiden Seiten kurz anrösten.',
    ],
  },

  // ---------------------------------------------------- Indisch
  {
    name: 'Chicken Tikka Masala', cuisine: 'Indisch', time: 45, difficulty: 2, tags: ['Curry'],
    ingredients: [
      [600, 'g', 'Hähnchenbrustfilet'], [150, 'g', 'Joghurt'], [2, 'TL', 'Garam Masala'], [1, 'TL', 'Kurkuma'],
      [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'], [1, 'Stück', 'Ingwer (ca. 3 cm)'], [400, 'g', 'passierte Tomaten'],
      [150, 'ml', 'Sahne'], [1, 'TL', 'Paprikapulver'], [2, 'EL', 'Ghee oder Öl'], [null, '', 'Salz'], [250, 'g', 'Basmatireis'],
    ],
    steps: [
      'Hähnchen würfeln und mit Joghurt, 1 TL Garam Masala, Kurkuma und Salz mindestens 15 Minuten marinieren.',
      'Reis nach Packungsangabe kochen.',
      'Hähnchen im Ghee scharf anbraten und herausnehmen.',
      'Zwiebel, Knoblauch und Ingwer fein hacken und im Bratfett anschwitzen, restliches Garam Masala und Paprika kurz mitrösten.',
      'Tomaten zugeben und 10 Minuten köcheln, dann Sahne und Hähnchen zugeben und 5 Minuten ziehen lassen.',
      'Abschmecken und mit Reis servieren.',
    ],
  },
  {
    name: 'Rote-Linsen-Dal', cuisine: 'Indisch', time: 40, difficulty: 1, tags: ['Curry', 'Günstig'],
    ingredients: [
      [250, 'g', 'rote Linsen'], [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'], [1, 'Stück', 'Ingwer (ca. 2 cm)'],
      [400, 'g', 'stückige Tomaten'], [400, 'ml', 'Kokosmilch'], [500, 'ml', 'Gemüsebrühe'], [1, 'TL', 'Kurkuma'],
      [1, 'TL', 'Kreuzkümmel'], [1, 'TL', 'Garam Masala'], [2, 'EL', 'Rapsöl'], [1, 'Stück', 'Limette'],
      [null, '', 'Salz'], [250, 'g', 'Basmatireis'],
    ],
    steps: [
      'Zwiebel, Knoblauch und Ingwer fein hacken und im Öl anschwitzen.',
      'Gewürze zugeben und 1 Minute mitrösten.',
      'Linsen, Tomaten, Kokosmilch und Brühe zugeben und ca. 20 Minuten köcheln lassen, bis die Linsen zerfallen.',
      'Parallel Reis kochen.',
      'Dal mit Salz und Limettensaft abschmecken und mit Reis servieren.',
    ],
  },
  {
    name: 'Kichererbsen-Spinat-Curry', cuisine: 'Indisch', time: 35, difficulty: 1, tags: ['Curry', 'Schnell'],
    ingredients: [
      [2, 'Dose', 'Kichererbsen (à ca. 240 g)'], [200, 'g', 'Babyspinat'], [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'],
      [1, 'Stück', 'Ingwer (ca. 2 cm)'], [400, 'ml', 'Kokosmilch'], [400, 'g', 'stückige Tomaten'],
      [2, 'EL', 'Currypaste oder Currypulver'], [2, 'EL', 'Öl'], [null, '', 'Salz'], [250, 'g', 'Basmatireis'],
    ],
    steps: [
      'Reis kochen. Zwiebel, Knoblauch und Ingwer fein hacken.',
      'Im Öl anschwitzen, Currypaste/-pulver kurz mitrösten.',
      'Tomaten, Kokosmilch und abgespülte Kichererbsen zugeben und 15 Minuten köcheln lassen.',
      'Spinat unterrühren, bis er zusammenfällt. Mit Salz abschmecken und mit Reis servieren.',
    ],
  },
  {
    name: 'Palak Paneer', cuisine: 'Indisch', time: 40, difficulty: 2, tags: ['Curry'],
    ingredients: [
      [400, 'g', 'Paneer'], [600, 'g', 'Blattspinat (frisch oder TK)'], [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'],
      [1, 'Stück', 'Ingwer (ca. 3 cm)'], [1, 'Stück', 'grüne Chili'], [1, 'TL', 'Garam Masala'], [1, 'TL', 'Kreuzkümmel'],
      [100, 'ml', 'Sahne'], [2, 'EL', 'Ghee oder Öl'], [null, '', 'Salz'], [4, 'Stück', 'Naan-Brot'],
    ],
    steps: [
      'Spinat kurz blanchieren (TK-Spinat auftauen) und fein pürieren.',
      'Paneer würfeln und im Ghee goldbraun anbraten, herausnehmen.',
      'Zwiebel, Knoblauch, Ingwer und Chili hacken und im Bratfett anschwitzen, Gewürze kurz mitrösten.',
      'Spinatpüree und Sahne zugeben, 5 Minuten köcheln, Paneer unterheben und salzen.',
      'Mit Naan-Brot servieren.',
    ],
  },

  // ---------------------------------------------------- Thailändisch
  {
    name: 'Grünes Thai-Curry mit Hähnchen', cuisine: 'Thailändisch', time: 30, difficulty: 1, tags: ['Curry', 'Scharf'],
    ingredients: [
      [500, 'g', 'Hähnchenbrustfilet'], [2, 'EL', 'grüne Currypaste'], [400, 'ml', 'Kokosmilch'], [1, 'Stück', 'Paprika'],
      [150, 'g', 'Zuckerschoten'], [1, 'EL', 'Fischsauce'], [1, 'TL', 'Zucker'], [1, 'Stück', 'Limette'],
      [1, 'EL', 'Öl'], [0.5, 'Bund', 'Thai-Basilikum'], [250, 'g', 'Jasminreis'],
    ],
    steps: [
      'Reis kochen. Hähnchen in Streifen, Paprika in Stücke schneiden.',
      'Currypaste im Öl 1 Minute anrösten, dann Kokosmilch einrühren und aufkochen.',
      'Hähnchen zugeben und 6 Minuten köcheln lassen.',
      'Paprika und Zuckerschoten zugeben und 3–4 Minuten mitgaren.',
      'Mit Fischsauce, Zucker und Limettensaft abschmecken, mit Basilikum und Reis servieren.',
    ],
  },
  {
    name: 'Pad Thai mit Garnelen', cuisine: 'Thailändisch', time: 30, difficulty: 2, tags: ['Wok'],
    ingredients: [
      [250, 'g', 'Reisbandnudeln'], [300, 'g', 'Garnelen'], [2, 'Stück', 'Ei'], [150, 'g', 'Sojasprossen'],
      [3, 'Stück', 'Frühlingszwiebel'], [2, 'Zehe', 'Knoblauch'], [3, 'EL', 'Fischsauce'], [2, 'EL', 'Tamarindenpaste'],
      [2, 'EL', 'brauner Zucker'], [50, 'g', 'geröstete Erdnüsse'], [2, 'EL', 'Öl'], [1, 'Stück', 'Limette'],
    ],
    steps: [
      'Reisnudeln nach Packungsangabe in heißem Wasser einweichen und abtropfen lassen.',
      'Fischsauce, Tamarindenpaste und Zucker zu einer Soße verrühren.',
      'Knoblauch im Wok in Öl anbraten, Garnelen zugeben und 2 Minuten braten.',
      'Alles an den Rand schieben, Eier in die Mitte geben und unter Rühren stocken lassen.',
      'Nudeln und Soße zugeben und unter Schwenken 2 Minuten braten, Sprossen und Frühlingszwiebeln unterheben.',
      'Mit gehackten Erdnüssen und Limettenspalten servieren.',
    ],
  },

  // ---------------------------------------------------- Chinesisch
  {
    name: 'Gebratener Reis mit Gemüse und Ei', cuisine: 'Chinesisch', time: 25, difficulty: 1, tags: ['Wok', 'Resteverwertung'],
    ingredients: [
      [300, 'g', 'Reis (am besten vom Vortag, gekocht ca. 750 g)'], [3, 'Stück', 'Ei'], [200, 'g', 'Erbsen (TK)'],
      [2, 'Stück', 'Karotte'], [4, 'Stück', 'Frühlingszwiebel'], [2, 'Zehe', 'Knoblauch'], [3, 'EL', 'Sojasauce'],
      [1, 'TL', 'Sesamöl'], [2, 'EL', 'Öl'],
    ],
    steps: [
      'Reis kochen und vollständig abkühlen lassen (oder Reis vom Vortag nehmen).',
      'Karotten fein würfeln, Frühlingszwiebeln in Ringe schneiden, Knoblauch hacken.',
      'Eier im Wok in etwas Öl verrühren und stocken lassen, herausnehmen.',
      'Karotten und Knoblauch im restlichen Öl 3 Minuten braten, Erbsen und Reis zugeben und unter Rühren 5 Minuten braten.',
      'Sojasauce, Sesamöl, Ei und Frühlingszwiebeln unterheben.',
    ],
  },
  {
    name: 'Süß-saures Hähnchen', cuisine: 'Chinesisch', time: 40, difficulty: 2, tags: ['Wok'],
    ingredients: [
      [600, 'g', 'Hähnchenbrustfilet'], [3, 'EL', 'Speisestärke'], [1, 'Stück', 'Paprika rot'], [1, 'Stück', 'Paprika grün'],
      [1, 'Stück', 'Zwiebel'], [200, 'g', 'Ananas (Dose)'], [3, 'EL', 'Ketchup'], [3, 'EL', 'Reisessig'],
      [2, 'EL', 'Zucker'], [2, 'EL', 'Sojasauce'], [100, 'ml', 'Ananassaft'], [4, 'EL', 'Öl'], [250, 'g', 'Reis'],
    ],
    steps: [
      'Reis kochen. Hähnchen würfeln und in 2 EL Stärke wenden.',
      'Ketchup, Essig, Zucker, Sojasauce, Ananassaft und 1 EL Stärke zu einer Soße verrühren.',
      'Hähnchen in 3 EL Öl portionsweise knusprig braten, herausnehmen.',
      'Paprika und Zwiebel in Stücke schneiden und im restlichen Öl 3 Minuten braten, Ananas zugeben.',
      'Soße zugießen und aufkochen lassen, bis sie andickt. Hähnchen unterheben und mit Reis servieren.',
    ],
  },
  {
    name: 'Gebratene Nudeln mit Tofu', cuisine: 'Chinesisch', time: 25, difficulty: 1, tags: ['Wok', 'Schnell'],
    ingredients: [
      [250, 'g', 'Mie-Nudeln, eifrei'], [200, 'g', 'Tofu natur'], [1, 'Stück', 'Paprika'], [200, 'g', 'Brokkoli'],
      [2, 'Stück', 'Karotte'], [2, 'Zehe', 'Knoblauch'], [1, 'Stück', 'Ingwer (ca. 2 cm)'], [4, 'EL', 'Sojasauce'],
      [1, 'EL', 'Agavendicksaft'], [1, 'TL', 'Sesamöl'], [3, 'EL', 'Öl'], [1, 'EL', 'Sesam'],
    ],
    steps: [
      'Nudeln nach Packungsangabe kochen und abtropfen lassen.',
      'Tofu trocken tupfen, würfeln und in 2 EL Öl knusprig braten, herausnehmen.',
      'Gemüse klein schneiden, Knoblauch und Ingwer hacken und alles im restlichen Öl 4–5 Minuten scharf braten.',
      'Nudeln, Tofu, Sojasauce, Agavendicksaft und Sesamöl zugeben und gut durchschwenken.',
      'Mit Sesam bestreuen.',
    ],
  },

  // ---------------------------------------------------- Japanisch / Korea / Vietnam
  {
    name: 'Teriyaki-Lachs mit Reis', cuisine: 'Japanisch', time: 30, difficulty: 1, tags: ['Fisch'],
    ingredients: [
      [4, 'Stück', 'Lachsfilet (à ca. 150 g)'], [4, 'EL', 'Sojasauce'], [2, 'EL', 'Mirin'], [1, 'EL', 'Honig'],
      [1, 'Stück', 'Ingwer (ca. 2 cm)'], [250, 'g', 'Sushireis oder Jasminreis'], [300, 'g', 'Brokkoli'],
      [1, 'EL', 'Öl'], [1, 'EL', 'Sesam'], [2, 'Stück', 'Frühlingszwiebel'],
    ],
    steps: [
      'Reis kochen. Brokkoli in Röschen teilen und 4 Minuten dämpfen oder kochen.',
      'Sojasauce, Mirin, Honig und geriebenen Ingwer verrühren.',
      'Lachs im Öl auf der Hautseite 4 Minuten braten, wenden.',
      'Soße zugießen und 2–3 Minuten einkochen lassen, Lachs dabei mit Soße beträufeln.',
      'Mit Reis, Brokkoli, Sesam und Frühlingszwiebeln servieren.',
    ],
  },
  {
    name: 'Miso-Nudelsuppe mit Gemüse', cuisine: 'Japanisch', time: 30, difficulty: 1, tags: ['Suppe'],
    ingredients: [
      [250, 'g', 'Udon-Nudeln'], [3, 'EL', 'Misopaste'], [1.2, 'l', 'Gemüsebrühe'], [200, 'g', 'Tofu natur'],
      [150, 'g', 'Shiitake oder Champignons'], [100, 'g', 'Pak Choi'], [3, 'Stück', 'Frühlingszwiebel'],
      [1, 'EL', 'Sojasauce'], [4, 'Stück', 'Ei (optional, wachsweich)'],
    ],
    steps: [
      'Eier 7 Minuten kochen, abschrecken und pellen.',
      'Brühe erhitzen, Pilze in Scheiben und Pak Choi in Streifen schneiden und 4 Minuten darin garen.',
      'Tofu würfeln und zugeben. Nudeln separat nach Packungsangabe kochen.',
      'Topf vom Herd nehmen, Misopaste mit etwas Brühe glatt rühren und einrühren (nicht mehr kochen lassen).',
      'Nudeln auf Schalen verteilen, Suppe darübergeben, mit halbierten Eiern und Frühlingszwiebeln servieren.',
    ],
  },
  {
    name: 'Bibimbap', cuisine: 'Koreanisch', time: 45, difficulty: 2, tags: ['Bowl'],
    ingredients: [
      [300, 'g', 'Rinderhackfleisch'], [250, 'g', 'Reis'], [4, 'Stück', 'Ei'], [2, 'Stück', 'Karotte'], [1, 'Stück', 'Zucchini'],
      [200, 'g', 'Babyspinat'], [150, 'g', 'Sojasprossen'], [3, 'EL', 'Sojasauce'], [2, 'EL', 'Gochujang (Chilipaste)'],
      [2, 'TL', 'Sesamöl'], [2, 'Zehe', 'Knoblauch'], [2, 'EL', 'Öl'], [1, 'EL', 'Sesam'],
    ],
    steps: [
      'Reis kochen. Karotten und Zucchini in feine Streifen schneiden.',
      'Hackfleisch mit Knoblauch in 1 EL Öl krümelig braten, mit 2 EL Sojasauce und 1 TL Sesamöl würzen.',
      'Gemüse nacheinander jeweils kurz anbraten, Spinat nur zusammenfallen lassen; jeweils leicht salzen.',
      'Spiegeleier braten.',
      'Reis in Schalen geben, Gemüse, Fleisch und Spiegelei darauf anrichten.',
      'Gochujang mit restlicher Sojasauce und Sesamöl verrühren, darübergeben und mit Sesam bestreuen. Vor dem Essen alles vermischen.',
    ],
  },
  {
    name: 'Pho mit Rindfleisch (vereinfacht)', cuisine: 'Vietnamesisch', time: 60, difficulty: 2, tags: ['Suppe'],
    ingredients: [
      [300, 'g', 'Rinderhüfte'], [250, 'g', 'Reisbandnudeln'], [1.5, 'l', 'Rinderbrühe'], [1, 'Stück', 'Zwiebel'],
      [1, 'Stück', 'Ingwer (ca. 4 cm)'], [2, 'Stück', 'Sternanis'], [1, 'Stück', 'Zimtstange'], [3, 'EL', 'Fischsauce'],
      [150, 'g', 'Sojasprossen'], [1, 'Bund', 'Koriander'], [1, 'Bund', 'Thai-Basilikum'], [1, 'Stück', 'Limette'],
      [1, 'Stück', 'rote Chili'],
    ],
    steps: [
      'Zwiebel und Ingwer halbieren und in einer trockenen Pfanne kräftig anrösten, bis sie schwarze Stellen haben.',
      'Brühe mit Zwiebel, Ingwer, Sternanis und Zimt 30 Minuten leise köcheln lassen, dann durchsieben und mit Fischsauce abschmecken.',
      'Fleisch kurz anfrieren lassen und hauchdünn aufschneiden.',
      'Nudeln nach Packungsangabe einweichen und auf Schalen verteilen, rohes Fleisch darauflegen.',
      'Kochend heiße Brühe darübergießen – das Fleisch gart dabei.',
      'Mit Sprossen, Kräutern, Chili und Limette servieren.',
    ],
  },

  // ---------------------------------------------------- Griechisch / Türkisch / Orient
  {
    name: 'Gyros-Pfanne mit Tzatziki', cuisine: 'Griechisch', time: 40, difficulty: 1, tags: ['Pfanne'],
    ingredients: [
      [600, 'g', 'Schweinenacken'], [2, 'Stück', 'Zwiebel'], [2, 'TL', 'Gyrosgewürz'], [3, 'EL', 'Olivenöl'],
      [500, 'g', 'griechischer Joghurt'], [1, 'Stück', 'Gurke'], [2, 'Zehe', 'Knoblauch'], [4, 'Stück', 'Pitabrot'],
      [2, 'Stück', 'Tomate'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Fleisch in dünne Streifen schneiden und mit Gyrosgewürz und 2 EL Öl mindestens 15 Minuten marinieren.',
      'Für Tzatziki Gurke raspeln, gut ausdrücken und mit Joghurt, gepresstem Knoblauch, Salz und 1 EL Öl verrühren.',
      'Fleisch in einer heißen Pfanne portionsweise scharf anbraten. Zwiebelringe zugeben und mitbraten.',
      'Pitabrot im Ofen oder Toaster erwärmen.',
      'Gyros mit Tzatziki, Tomaten und Pita servieren.',
    ],
  },
  {
    name: 'Moussaka', cuisine: 'Griechisch', time: 100, difficulty: 3, tags: ['Ofen', 'Wochenende'],
    ingredients: [
      [2, 'Stück', 'Aubergine'], [500, 'g', 'Rinderhackfleisch'], [4, 'Stück', 'Kartoffel'], [1, 'Stück', 'Zwiebel'],
      [2, 'Zehe', 'Knoblauch'], [400, 'g', 'stückige Tomaten'], [1, 'TL', 'Zimt'], [1, 'TL', 'Oregano, getrocknet'],
      [40, 'g', 'Butter'], [40, 'g', 'Mehl'], [500, 'ml', 'Milch'], [1, 'Stück', 'Ei'], [50, 'g', 'Parmesan'],
      [5, 'EL', 'Olivenöl'], [null, '', 'Salz, Pfeffer, Muskatnuss'],
    ],
    steps: [
      'Auberginen und geschälte Kartoffeln in 1 cm dicke Scheiben schneiden, mit Öl bestreichen, salzen und bei 200 °C ca. 20 Minuten im Ofen vorbacken.',
      'Zwiebel und Knoblauch würfeln, mit dem Hackfleisch anbraten, Tomaten, Zimt und Oregano zugeben und 15 Minuten köcheln.',
      'Béchamel: Butter schmelzen, Mehl einrühren, Milch nach und nach zugießen und aufkochen. Vom Herd nehmen, Ei und Hälfte des Käses einrühren, würzen.',
      'In eine Form Kartoffeln, Hälfte Auberginen, Fleischsoße und restliche Auberginen schichten. Béchamel darübergießen und mit restlichem Käse bestreuen.',
      'Bei 180 °C ca. 40 Minuten goldbraun backen und vor dem Schneiden 15 Minuten ruhen lassen.',
    ],
  },
  {
    name: 'Ofen-Feta mit Gemüse', cuisine: 'Griechisch', time: 35, difficulty: 1, tags: ['Ofen', 'Schnell'],
    ingredients: [
      [400, 'g', 'Feta'], [2, 'Stück', 'Paprika'], [1, 'Stück', 'Zucchini'], [1, 'Stück', 'rote Zwiebel'],
      [250, 'g', 'Kirschtomaten'], [80, 'g', 'Kalamata-Oliven'], [4, 'EL', 'Olivenöl'], [1, 'TL', 'Oregano, getrocknet'],
      [4, 'Stück', 'Fladenbrot oder Baguette'], [null, '', 'Pfeffer'],
    ],
    steps: [
      'Ofen auf 200 °C Umluft vorheizen. Gemüse in mundgerechte Stücke schneiden.',
      'Gemüse und Oliven mit Olivenöl und Oregano mischen und in eine Auflaufform geben.',
      'Feta in vier Stücke schneiden, zwischen das Gemüse setzen, pfeffern und mit etwas Öl beträufeln.',
      '25 Minuten backen und mit Brot servieren.',
    ],
  },
  {
    name: 'Shakshuka', cuisine: 'Orientalisch', time: 30, difficulty: 1, tags: ['Pfanne', 'Schnell'],
    ingredients: [
      [6, 'Stück', 'Ei'], [800, 'g', 'stückige Tomaten'], [2, 'Stück', 'Paprika rot'], [1, 'Stück', 'Zwiebel'],
      [2, 'Zehe', 'Knoblauch'], [1, 'TL', 'Kreuzkümmel'], [1, 'TL', 'Paprikapulver edelsüß'], [0.5, 'TL', 'Chiliflocken'],
      [3, 'EL', 'Olivenöl'], [100, 'g', 'Feta'], [0.5, 'Bund', 'Petersilie'], [null, '', 'Salz und Pfeffer'],
      [1, 'Stück', 'Baguette'],
    ],
    steps: [
      'Zwiebel, Knoblauch und Paprika würfeln und im Öl 8 Minuten weich dünsten.',
      'Gewürze kurz mitrösten, Tomaten zugeben, salzen und 10 Minuten einköcheln lassen.',
      'Mit einem Löffel 6 Mulden in die Soße drücken und je ein Ei hineinschlagen.',
      'Zugedeckt bei kleiner Hitze 6–8 Minuten garen, bis das Eiweiß fest und das Eigelb noch flüssig ist.',
      'Mit Feta und Petersilie bestreuen und mit Brot servieren.',
    ],
  },
  {
    name: 'Falafel mit Hummus im Fladenbrot', cuisine: 'Orientalisch', time: 40, difficulty: 2, tags: ['Streetfood'],
    ingredients: [
      [2, 'Dose', 'Kichererbsen (à ca. 240 g)'], [1, 'Stück', 'Zwiebel'], [2, 'Zehe', 'Knoblauch'], [1, 'Bund', 'Petersilie'],
      [2, 'TL', 'Kreuzkümmel'], [3, 'EL', 'Kichererbsenmehl oder Mehl'], [3, 'EL', 'Tahini'], [1, 'Stück', 'Zitrone'],
      [4, 'Stück', 'Fladenbrot'], [2, 'Stück', 'Tomate'], [0.5, 'Stück', 'Gurke'], [100, 'ml', 'Öl zum Braten'],
      [null, '', 'Salz'],
    ],
    steps: [
      'Eine Dose Kichererbsen mit 2 EL Tahini, Saft einer halben Zitrone, 1 Knoblauchzehe, Salz und etwas Wasser zu Hummus pürieren.',
      'Zweite Dose Kichererbsen gut abtropfen lassen und mit Zwiebel, Knoblauch, Petersilie, Kreuzkümmel, Mehl und Salz grob pürieren (nicht zu fein).',
      'Aus der Masse kleine Bällchen formen und leicht flach drücken.',
      'Im heißen Öl rundum 4–5 Minuten knusprig braten, auf Küchenpapier abtropfen lassen.',
      'Fladenbrot mit Hummus bestreichen, mit Falafel, Tomate und Gurke füllen. Restliches Tahini mit Zitronensaft und Wasser als Soße darüber.',
    ],
  },
  {
    name: 'Türkische Linsensuppe (Mercimek)', cuisine: 'Türkisch', time: 40, difficulty: 1, tags: ['Suppe', 'Günstig'],
    ingredients: [
      [250, 'g', 'rote Linsen'], [1, 'Stück', 'Zwiebel'], [1, 'Stück', 'Karotte'], [1, 'Stück', 'Kartoffel'],
      [1, 'EL', 'Tomatenmark'], [1, 'EL', 'Paprikamark (Biber Salçası)'], [1.2, 'l', 'Gemüsebrühe'], [1, 'TL', 'Kreuzkümmel'],
      [1, 'TL', 'Pul Biber'], [3, 'EL', 'Olivenöl'], [1, 'Stück', 'Zitrone'], [1, 'TL', 'getrocknete Minze'], [null, '', 'Salz'],
    ],
    steps: [
      'Zwiebel, Karotte und Kartoffel würfeln und in 2 EL Öl anschwitzen.',
      'Tomaten- und Paprikamark kurz mitrösten.',
      'Linsen, Brühe und Kreuzkümmel zugeben und 20–25 Minuten köcheln lassen.',
      'Fein pürieren und mit Salz abschmecken.',
      'Restliches Öl mit Pul Biber und Minze kurz erhitzen und über die Suppe träufeln. Mit Zitronenspalten servieren.',
    ],
  },
  {
    name: 'Köfte mit Bulgur und Joghurt', cuisine: 'Türkisch', time: 45, difficulty: 2, tags: ['Grill/Pfanne'],
    ingredients: [
      [500, 'g', 'Rinderhackfleisch'], [1, 'Stück', 'Zwiebel'], [1, 'Bund', 'Petersilie'], [1, 'TL', 'Kreuzkümmel'],
      [1, 'TL', 'Paprikapulver'], [250, 'g', 'Bulgur'], [1, 'EL', 'Tomatenmark'], [500, 'ml', 'Gemüsebrühe'],
      [300, 'g', 'Joghurt'], [1, 'Zehe', 'Knoblauch'], [2, 'EL', 'Öl'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Zwiebel fein reiben, Petersilie hacken. Mit Hackfleisch, Kreuzkümmel, Paprika, Salz und Pfeffer verkneten und längliche Köfte formen.',
      'Bulgur mit Tomatenmark in 1 EL Öl kurz anrösten, Brühe angießen und zugedeckt 15 Minuten quellen lassen.',
      'Köfte im restlichen Öl rundum 8–10 Minuten braten.',
      'Joghurt mit gepresstem Knoblauch und Salz verrühren.',
      'Köfte mit Bulgur und Knoblauchjoghurt servieren.',
    ],
  },
  {
    name: 'Couscous-Salat mit Kichererbsen', cuisine: 'Orientalisch', time: 25, difficulty: 1, tags: ['Salat', 'Schnell'],
    ingredients: [
      [250, 'g', 'Couscous'], [1, 'Dose', 'Kichererbsen (ca. 240 g)'], [1, 'Stück', 'Gurke'], [250, 'g', 'Kirschtomaten'],
      [1, 'Stück', 'Paprika'], [1, 'Bund', 'Petersilie'], [0.5, 'Bund', 'Minze'], [1, 'Stück', 'Zitrone'],
      [4, 'EL', 'Olivenöl'], [300, 'ml', 'Gemüsebrühe'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Couscous mit kochender Brühe übergießen und 5 Minuten zugedeckt quellen lassen, dann mit einer Gabel auflockern.',
      'Gurke, Tomaten und Paprika würfeln, Kräuter hacken, Kichererbsen abspülen.',
      'Alles mit Couscous, Zitronensaft und Olivenöl mischen.',
      'Mit Salz und Pfeffer kräftig abschmecken.',
    ],
  },

  // ---------------------------------------------------- Französisch / Spanisch
  {
    name: 'Ratatouille', cuisine: 'Französisch', time: 60, difficulty: 1, tags: ['Gemüse'],
    ingredients: [
      [1, 'Stück', 'Aubergine'], [2, 'Stück', 'Zucchini'], [2, 'Stück', 'Paprika'], [1, 'Stück', 'Zwiebel'],
      [3, 'Zehe', 'Knoblauch'], [800, 'g', 'stückige Tomaten'], [2, 'TL', 'Kräuter der Provence'], [4, 'EL', 'Olivenöl'],
      [null, '', 'Salz und Pfeffer'], [250, 'g', 'Reis'],
    ],
    steps: [
      'Alle Gemüse in ca. 2 cm große Würfel schneiden.',
      'Aubergine in 2 EL Öl anbraten, bis sie Farbe bekommt, herausnehmen.',
      'Zwiebel, Knoblauch und Paprika im restlichen Öl anbraten, Zucchini zugeben.',
      'Aubergine, Tomaten und Kräuter zugeben, würzen und 30 Minuten bei kleiner Hitze schmoren lassen.',
      'Mit Reis oder Baguette servieren.',
    ],
  },
  {
    name: 'Quiche Lorraine', cuisine: 'Französisch', time: 75, difficulty: 2, tags: ['Ofen'],
    ingredients: [
      [1, 'Packung', 'Mürbeteig oder Blätterteig (Kühlregal)'], [200, 'g', 'Speckwürfel'], [1, 'Stück', 'Zwiebel'],
      [4, 'Stück', 'Ei'], [200, 'ml', 'Sahne'], [100, 'ml', 'Milch'], [150, 'g', 'Gruyère oder Emmentaler'],
      [null, '', 'Salz, Pfeffer, Muskatnuss'],
    ],
    steps: [
      'Ofen auf 180 °C Ober-/Unterhitze vorheizen. Teig in eine gefettete Quicheform legen, Boden mehrfach einstechen.',
      'Teig 10 Minuten blind vorbacken.',
      'Speck und Zwiebelwürfel in einer Pfanne anbraten.',
      'Eier, Sahne, Milch und geriebenen Käse verquirlen, würzen.',
      'Speck auf dem Boden verteilen, Eiermasse darübergießen und 35–40 Minuten backen, bis die Füllung gestockt ist.',
    ],
  },
  {
    name: 'Paella mit Hähnchen und Meeresfrüchten', cuisine: 'Spanisch', time: 60, difficulty: 3, tags: ['Wochenende'],
    ingredients: [
      [300, 'g', 'Paellareis (Rundkorn)'], [400, 'g', 'Hähnchenschenkel ohne Knochen'], [200, 'g', 'Garnelen'],
      [500, 'g', 'Miesmuscheln (optional)'], [1, 'Stück', 'Zwiebel'], [1, 'Stück', 'Paprika rot'], [2, 'Zehe', 'Knoblauch'],
      [2, 'Stück', 'Tomate'], [150, 'g', 'Erbsen (TK)'], [900, 'ml', 'Hühnerbrühe'], [1, 'Prise', 'Safran'],
      [1, 'TL', 'Paprikapulver geräuchert'], [4, 'EL', 'Olivenöl'], [1, 'Stück', 'Zitrone'], [null, '', 'Salz'],
    ],
    steps: [
      'Safran in etwas warmer Brühe einweichen. Hähnchen würfeln, Zwiebel, Paprika und Knoblauch klein schneiden, Tomaten reiben.',
      'Hähnchen in einer großen Pfanne im Öl rundum anbraten, Zwiebel, Paprika und Knoblauch zugeben.',
      'Tomaten und Paprikapulver zugeben und kurz einkochen, dann Reis einrühren.',
      'Heiße Brühe mit Safran angießen, salzen und ab jetzt NICHT mehr rühren. 15 Minuten köcheln lassen.',
      'Garnelen, Muscheln und Erbsen in den Reis drücken und weitere 8–10 Minuten garen, bis der Reis die Flüssigkeit aufgenommen hat. Geschlossene Muscheln wegwerfen.',
      'Kurz ruhen lassen und mit Zitronenspalten servieren.',
    ],
  },
  {
    name: 'Spanische Tortilla', cuisine: 'Spanisch', time: 40, difficulty: 2, tags: ['Pfanne'],
    ingredients: [
      [800, 'g', 'festkochende Kartoffeln'], [2, 'Stück', 'Zwiebel'], [8, 'Stück', 'Ei'], [100, 'ml', 'Olivenöl'],
      [null, '', 'Salz und Pfeffer'], [1, 'Stück', 'Salatkopf'],
    ],
    steps: [
      'Kartoffeln schälen und in dünne Scheiben, Zwiebeln in Streifen schneiden.',
      'Beides im Olivenöl bei mittlerer Hitze ca. 15 Minuten weich (nicht knusprig) garen, dann abtropfen lassen.',
      'Eier verquirlen, salzen und pfeffern, Kartoffeln untermischen.',
      'Masse in eine Pfanne mit etwas Öl geben und bei kleiner Hitze 8 Minuten stocken lassen.',
      'Mit Hilfe eines Tellers wenden und weitere 4–5 Minuten braten. Mit Salat servieren.',
    ],
  },

  // ---------------------------------------------------- Amerikanisch / International
  {
    name: 'Selbstgemachte Burger', cuisine: 'Amerikanisch', time: 40, difficulty: 2, tags: ['Wochenende'],
    ingredients: [
      [600, 'g', 'Rinderhackfleisch'], [4, 'Stück', 'Burgerbrötchen'], [4, 'Scheibe', 'Cheddar'], [1, 'Stück', 'Tomate'],
      [1, 'Stück', 'rote Zwiebel'], [4, 'Blatt', 'Eisbergsalat'], [2, 'Stück', 'Gewürzgurke'], [4, 'EL', 'Ketchup'],
      [2, 'EL', 'Mayonnaise'], [1, 'EL', 'Öl'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Hackfleisch in 4 Portionen teilen und zu flachen Patties formen (etwas größer als die Brötchen), mit einer Daumenmulde in der Mitte.',
      'Tomate, Zwiebel und Gurken in Scheiben schneiden.',
      'Patties im heißen Öl oder auf dem Grill pro Seite 3–4 Minuten braten, erst dann salzen und pfeffern. In der letzten Minute Käse darauflegen.',
      'Brötchen aufschneiden und auf den Schnittflächen kurz anrösten.',
      'Mit Ketchup, Mayo, Salat, Patty und Gemüse belegen.',
    ],
  },
  {
    name: 'Mac and Cheese', cuisine: 'Amerikanisch', time: 30, difficulty: 1, tags: ['Pasta', 'Schnell'],
    ingredients: [
      [400, 'g', 'Makkaroni'], [40, 'g', 'Butter'], [40, 'g', 'Mehl'], [600, 'ml', 'Milch'], [200, 'g', 'Cheddar, gerieben'],
      [50, 'g', 'Parmesan'], [1, 'TL', 'Senf'], [null, '', 'Salz, Pfeffer, Muskatnuss'],
    ],
    steps: [
      'Makkaroni in Salzwasser bissfest kochen.',
      'Butter schmelzen, Mehl einrühren, Milch nach und nach unterrühren und aufkochen, bis die Soße andickt.',
      'Topf vom Herd nehmen, Käse und Senf einrühren, bis er geschmolzen ist. Würzen.',
      'Nudeln unterheben. Wer mag, im Ofen bei 200 °C noch 10 Minuten mit Käse überbacken.',
    ],
  },
  {
    name: 'Buddha Bowl mit Süßkartoffel', cuisine: 'International', time: 35, difficulty: 1, tags: ['Bowl', 'Gesund'],
    ingredients: [
      [200, 'g', 'Quinoa'], [2, 'Stück', 'Süßkartoffel'], [1, 'Dose', 'Kichererbsen (ca. 240 g)'], [1, 'Stück', 'Avocado'],
      [100, 'g', 'Babyspinat'], [1, 'Stück', 'Karotte'], [3, 'EL', 'Tahini'], [1, 'Stück', 'Zitrone'],
      [1, 'TL', 'Paprikapulver'], [3, 'EL', 'Olivenöl'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Ofen auf 200 °C vorheizen. Süßkartoffeln würfeln, Kichererbsen abtropfen lassen.',
      'Beides mit Öl, Paprika und Salz mischen und 25 Minuten auf einem Blech rösten.',
      'Quinoa nach Packungsangabe kochen.',
      'Tahini mit Zitronensaft, Salz und Wasser zu einem cremigen Dressing verrühren.',
      'Quinoa, Spinat, geraspelte Karotte, Avocado und Ofengemüse in Schalen anrichten und mit Dressing beträufeln.',
    ],
  },
  {
    name: 'Hähnchen-Gemüse-Wraps', cuisine: 'International', time: 25, difficulty: 1, tags: ['Schnell'],
    ingredients: [
      [400, 'g', 'Hähnchenbrustfilet'], [4, 'Stück', 'Weizentortillas (Wraps)'], [1, 'Stück', 'Paprika'],
      [0.5, 'Stück', 'Gurke'], [4, 'Blatt', 'Salat'], [150, 'g', 'Frischkäse'], [1, 'TL', 'Currypulver'],
      [1, 'EL', 'Öl'], [null, '', 'Salz und Pfeffer'],
    ],
    steps: [
      'Hähnchen in Streifen schneiden, mit Curry, Salz und Pfeffer würzen und im Öl 6–8 Minuten braten.',
      'Paprika und Gurke in Streifen schneiden.',
      'Wraps kurz in einer Pfanne erwärmen und mit Frischkäse bestreichen.',
      'Mit Salat, Gemüse und Hähnchen belegen, fest einrollen und halbieren.',
    ],
  },
  {
    name: 'Zucchini-Hack-Pfanne mit Reis', cuisine: 'International', time: 30, difficulty: 1, tags: ['Pfanne', 'Schnell'],
    ingredients: [
      [400, 'g', 'Rinderhackfleisch'], [2, 'Stück', 'Zucchini'], [1, 'Stück', 'Zwiebel'], [1, 'Zehe', 'Knoblauch'],
      [400, 'g', 'stückige Tomaten'], [100, 'g', 'Feta'], [1, 'TL', 'Paprikapulver'], [1, 'EL', 'Öl'],
      [null, '', 'Salz und Pfeffer'], [250, 'g', 'Reis'],
    ],
    steps: [
      'Reis kochen. Zucchini würfeln, Zwiebel und Knoblauch hacken.',
      'Hackfleisch im Öl krümelig braten, Zwiebel und Knoblauch zugeben.',
      'Zucchini zugeben und 5 Minuten mitbraten, mit Paprika, Salz und Pfeffer würzen.',
      'Tomaten zugeben und 5 Minuten köcheln lassen. Mit zerbröseltem Feta bestreuen und mit Reis servieren.',
    ],
  },
  {
    name: 'Gemüse-Curry mit Tofu und Erdnuss', cuisine: 'Thailändisch', time: 35, difficulty: 1, tags: ['Curry'],
    ingredients: [
      [400, 'g', 'Tofu natur'], [2, 'EL', 'rote Currypaste'], [400, 'ml', 'Kokosmilch'], [2, 'EL', 'Erdnussbutter'],
      [1, 'Stück', 'Paprika'], [200, 'g', 'Brokkoli'], [1, 'Stück', 'Karotte'], [2, 'EL', 'Sojasauce'],
      [1, 'Stück', 'Limette'], [2, 'EL', 'Öl'], [250, 'g', 'Jasminreis'],
    ],
    steps: [
      'Reis kochen. Tofu würfeln und in 1 EL Öl knusprig braten, herausnehmen.',
      'Currypaste im restlichen Öl kurz anrösten, Kokosmilch und Erdnussbutter einrühren.',
      'Gemüse klein schneiden, zugeben und 8 Minuten köcheln lassen.',
      'Tofu zugeben, mit Sojasauce und Limettensaft abschmecken und mit Reis servieren.',
    ],
  },
];

if (typeof module !== 'undefined') module.exports = BUILTIN_RECIPES;
