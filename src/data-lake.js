// Lake-zone (zona lacustre) nature: plants, animals and landmarks of the Basin of Mexico.
// Same structure as data.js. `view` may be a string or a list of views.

export const LAKE_ELEMENTS = {
  tule: {
    view: 'chinampa',
    group: 'nature',
    nahuatl: 'tolin · auautli',
    classical: 'tōllin · āhuauhtli',
    t: {
      es: {
        name: 'Tular (tule)',
        gloss: 'Tule · auautli: «amaranto de agua», huevecillos de insecto',
        fn: 'Bordea los canales, filtra el agua y da refugio a peces, aves e insectos. Es materia prima para petates y canastas.',
        desc: 'El tule (Schoenoplectus) crece en las orillas poco profundas. En sus tallos las chinches de agua (axayakatl) ponen huevecillos que se recolectaban y comían: el auautli, llamado hoy «caviar mexicano».',
        hist: ['Sahagún describe la recolección del āhuauhtli y del axayacatl en el Códice Florentino (libro 11).'],
      },
      en: {
        name: 'Tule reeds',
        gloss: 'Bulrush · auautli: “water amaranth”, insect eggs',
        fn: 'Lines the canals, filters the water and shelters fish, birds and insects. It is the raw material for mats and baskets.',
        desc: 'Tule (Schoenoplectus) grows in shallow edges. Water bugs (axayakatl) lay eggs on its stems, and those eggs were gathered and eaten: auautli, today called “Mexican caviar”.',
        hist: ['Sahagún describes gathering āhuauhtli and axayacatl in the Florentine Codex (Book 11).'],
      },
      zh: {
        name: '香蒲丛',
        gloss: '香蒲 · auautli：“水中苋”，即水生昆虫卵',
        fn: '生长在运河两岸，能过滤水质，为鱼、鸟和昆虫提供栖身之所，也是编席和编篮的原料。',
        desc: '香蒲（Schoenoplectus）生长在浅水岸边。水生蝽（axayakatl）把卵产在茎上，人们采集这些卵食用，称为 auautli，今天被称作“墨西哥鱼子酱”。',
        hist: ['萨阿贡在《佛罗伦萨手抄本》第11卷中记述了采集 āhuauhtli 和 axayacatl 的方法。'],
      },
    },
  },

  lily: {
    view: 'chinampa',
    group: 'nature',
    nahuatl: 'atlakuesonan',
    classical: 'ātlacuezōnan',
    t: {
      es: {
        name: 'Ninfa (lirio de agua)',
        gloss: 'Flor acuática de hojas flotantes',
        fn: 'Da sombra al agua, la mantiene fresca y oxigenada, y sirve de refugio a peces y ajolotes.',
        desc: 'Las ninfas (Nymphaea) flotan en los canales tranquilos. No hay que confundirlas con el lirio acuático (Eichhornia), que llegó de Sudamérica en el siglo XIX y hoy es una plaga en Xochimilco.',
        hist: ['El Códice Florentino (libro 11) describe el ātlacuezōnan entre las plantas del agua.'],
      },
      en: {
        name: 'Water lily',
        gloss: 'Water flower with floating leaves',
        fn: 'Shades the water, keeps it cool and oxygenated, and shelters fish and axolotls.',
        desc: 'Water lilies (Nymphaea) float on calm canals. They are not the water hyacinth (Eichhornia), which arrived from South America in the 19th century and is now a pest in Xochimilco.',
        hist: ['The Florentine Codex (Book 11) describes the ātlacuezōnan among water plants.'],
      },
      zh: {
        name: '睡莲',
        gloss: '叶片浮于水面的水生花',
        fn: '为水面遮阴，使水保持凉爽、富含氧气，并为鱼和美西螈提供庇护。',
        desc: '睡莲（Nymphaea）漂浮在平静的运河上。不要把它和凤眼莲（Eichhornia）混淆：后者19世纪从南美传入，如今是霍奇米尔科的入侵植物。',
        hist: ['《佛罗伦萨手抄本》第11卷在水生植物中描述了 ātlacuezōnan。'],
      },
    },
  },

  fish: {
    view: 'chinampa',
    group: 'nature',
    nahuatl: 'michin · amilotl',
    classical: 'michin · amilotl',
    t: {
      es: {
        name: 'Peces (pescado blanco y charal)',
        gloss: 'Pez · pescado blanco',
        fn: 'Una fuente diaria de proteína que se pescaba en los mismos canales de las chinampas.',
        desc: 'El pescado blanco (Chirostoma) y los charales se pescaban con redes y se vendían frescos o asados en hojas de maíz. El nombre Michoacán significa «lugar de pescadores».',
        hist: ['Sahagún enumera muchos peces del lago y sus vendedores en el Códice Florentino (libros 10 y 11).'],
      },
      en: {
        name: 'Fish (white fish and charal)',
        gloss: 'Fish · white fish',
        fn: 'A daily source of protein, caught in the same canals as the chinampas.',
        desc: 'White fish (Chirostoma) and charales were caught with nets and sold fresh or roasted in corn husks. The name Michoacán means “place of fishermen”.',
        hist: ['Sahagún lists many lake fish and their sellers in the Florentine Codex (Books 10 and 11).'],
      },
      zh: {
        name: '鱼（白鱼与小银鱼）',
        gloss: '鱼 · 白鱼',
        fn: '每日的蛋白质来源，就在奇南帕旁的运河里捕捞。',
        desc: '人们用网捕捞白鱼（Chirostoma）和小银鱼，新鲜出售或包在玉米叶里烤制。地名“米却肯”意为“渔夫之地”。',
        hist: ['萨阿贡在《佛罗伦萨手抄本》第10、11卷中列举了许多湖鱼及鱼贩。'],
      },
    },
  },

  acocil: {
    view: 'chinampa',
    group: 'nature',
    nahuatl: 'akosilin',
    classical: 'acocilin',
    t: {
      es: {
        name: 'Acocil',
        gloss: 'Camaroncito de agua dulce',
        fn: 'Alimento muy apreciado y parte de la cadena alimenticia del lago.',
        desc: 'El acocil (Cambarellus montezumae) es un crustáceo pequeño que vive en el fondo de los canales. Al cocerse se pone rojo, y todavía se vende en mercados del sur de la ciudad.',
        hist: ['El Vocabulario de Molina (1571) registra acocili como «camarón». Sahagún lo describe entre los animales del agua.'],
      },
      en: {
        name: 'Acocil (crayfish)',
        gloss: 'Small freshwater crayfish',
        fn: 'A prized food and part of the lake’s food chain.',
        desc: 'The acocil (Cambarellus montezumae) is a small crustacean living on the canal floor. It turns red when cooked and is still sold in markets in the south of the city.',
        hist: ['Molina’s Vocabulario (1571) lists acocili as “shrimp”. Sahagún describes it among water animals.'],
      },
      zh: {
        name: '小龙虾（阿科西尔）',
        gloss: '淡水小虾',
        fn: '备受珍视的食物，也是湖泊食物链的一环。',
        desc: '阿科西尔（Cambarellus montezumae）是一种生活在运河底部的小型甲壳动物，煮熟后变红，至今仍在墨西哥城南部的市场出售。',
        hist: ['莫利纳的《词汇》（1571）将 acocili 释为“虾”。萨阿贡将其列入水生动物。'],
      },
    },
  },

  duck: {
    view: 'chinampa',
    group: 'nature',
    nahuatl: 'kanautli',
    classical: 'canauhtli',
    t: {
      es: {
        name: 'Patos',
        gloss: 'Pato',
        fn: 'Aves migratorias que cada invierno llenaban los lagos. Eran una caza importante.',
        desc: 'Miles de patos llegaban del norte en invierno. Se cazaban con redes y con lanzadardos (atlatl). Los lagos de la cuenca eran un gran refugio de aves acuáticas.',
        hist: ['El Códice Florentino (libro 11) describe decenas de aves acuáticas y cómo se cazaban.'],
      },
      en: {
        name: 'Ducks',
        gloss: 'Duck',
        fn: 'Migratory birds that filled the lakes every winter. They were an important source of game.',
        desc: 'Thousands of ducks arrived from the north each winter. They were hunted with nets and with spear-throwers (atlatl). The basin’s lakes were a major refuge for waterfowl.',
        hist: ['The Florentine Codex (Book 11) describes dozens of waterbirds and how they were hunted.'],
      },
      zh: {
        name: '野鸭',
        gloss: '鸭',
        fn: '每年冬天布满湖面的候鸟，是重要的猎物。',
        desc: '每到冬天，成千上万的野鸭从北方飞来。人们用网和投矛器（atlatl）捕猎。盆地的湖泊是水鸟的重要栖息地。',
        hist: ['《佛罗伦萨手抄本》第11卷描述了数十种水鸟及其捕猎方法。'],
      },
    },
  },

  volcanoes: {
    view: ['chinampa', 'city'],
    group: 'nature',
    nahuatl: 'Popokatepetl · Istaksiuatl',
    classical: 'Popōcatepētl · Iztaccihuātl',
    t: {
      es: {
        name: 'Popocatépetl e Iztaccíhuatl',
        gloss: '«Cerro que humea» · «Mujer blanca»',
        fn: 'Los volcanes que cierran la cuenca al sureste. Su deshielo alimenta los manantiales y los lagos.',
        desc: 'Los dos volcanes nevados se ven desde las chinampas en días claros. Los cerros eran lugares de culto a Tlaloc y a los tlaloque, dueños de la lluvia, porque de ellos baja el agua.',
        hist: ['En 1519 Diego de Ordaz, de la expedición de Cortés, subió al Popocatépetl. Cortés lo cuenta en su Segunda carta.'],
      },
      en: {
        name: 'Popocatépetl and Iztaccíhuatl',
        gloss: '“Smoking mountain” · “White woman”',
        fn: 'The volcanoes that close the basin to the south-east. Their meltwater feeds the springs and lakes.',
        desc: 'The two snow-capped volcanoes can be seen from the chinampas on clear days. Mountains were places of worship for Tlaloc and the tlaloque, lords of rain, because water comes down from them.',
        hist: ['In 1519 Diego de Ordaz, of Cortés’ expedition, climbed Popocatépetl. Cortés tells it in his Second Letter.'],
      },
      zh: {
        name: '波波卡特佩特与伊斯塔西瓦特尔火山',
        gloss: '“冒烟的山” · “白衣女子”',
        fn: '在东南方环绕盆地的两座火山，融雪滋养着泉水和湖泊。',
        desc: '天气晴朗时，从奇南帕可以望见这两座积雪的火山。人们在山上祭祀雨神特拉洛克及其助手 tlaloque，因为水从山上流下。',
        hist: ['1519年，科尔特斯远征队的迭戈·德·奥尔达斯登上了波波卡特佩特火山，科尔特斯在《第二封信》中有所记载。'],
      },
    },
  },

  algae: {
    view: 'city',
    group: 'nature',
    nahuatl: 'tekuitlatl',
    classical: 'tecuitlatl',
    t: {
      es: {
        name: 'Alga espirulina',
        gloss: 'Suele traducirse como «excremento de piedra» (tetl + kuitlatl)',
        fn: 'Un alimento muy nutritivo que se cosechaba en el agua salobre del lago de Texcoco.',
        desc: 'La espirulina se recogía con redes finas, se secaba al sol en tortas y se vendía en el mercado. Es rica en proteína y hoy se cultiva en todo el mundo.',
        hist: ['Sahagún y Bernal Díaz describen las tortas de tecuitlatl que se vendían en Tlatelolco.'],
      },
      en: {
        name: 'Spirulina algae',
        gloss: 'Often glossed as “stone excrement” (tetl + kuitlatl)',
        fn: 'A very nutritious food harvested from the brackish water of Lake Texcoco.',
        desc: 'Spirulina was skimmed with fine nets, sun-dried into cakes and sold at the market. It is rich in protein and is now farmed worldwide.',
        hist: ['Sahagún and Bernal Díaz describe the tecuitlatl cakes sold in Tlatelolco.'],
      },
      zh: {
        name: '螺旋藻',
        gloss: '常译作“石头的粪便”（tetl + kuitlatl）',
        fn: '一种营养丰富的食物，采自特斯科科湖的微咸水域。',
        desc: '人们用细网捞取螺旋藻，晒成饼状在市场出售。它富含蛋白质，如今在全世界都有养殖。',
        hist: ['萨阿贡和贝尔纳尔·迪亚斯都描述过特拉特洛尔科市场上出售的 tecuitlatl 藻饼。'],
      },
    },
  },

  tepeyac: {
    view: 'city',
    group: 'nature',
    nahuatl: 'Tepeyakak',
    classical: 'Tepēyacac',
    t: {
      es: {
        name: 'Cerro del Tepeyac',
        gloss: '«En la punta (nariz) del cerro»',
        fn: 'El cerro donde terminaba la calzada del norte. Era un lugar sagrado y de peregrinación.',
        desc: 'Al pie del Tepeyac llegaba la calzada que salía de Tlatelolco. Fuentes coloniales lo asocian con el culto a Tonantzin, «nuestra venerable madre». Hoy ahí está la Basílica de Guadalupe.',
        hist: ['Sahagún menciona el Tepeyac como uno de los grandes lugares de peregrinación anteriores a la conquista.'],
      },
      en: {
        name: 'Tepeyac hill',
        gloss: '“At the tip (nose) of the hill”',
        fn: 'The hill where the northern causeway ended. It was a sacred place of pilgrimage.',
        desc: 'The causeway from Tlatelolco reached the foot of Tepeyac. Colonial sources link it to the worship of Tonantzin, “our revered mother”. The Basilica of Guadalupe stands there today.',
        hist: ['Sahagún mentions Tepeyac as one of the great pre-conquest pilgrimage sites.'],
      },
      zh: {
        name: '特佩亚克山',
        gloss: '“在山的尖端（鼻端）”',
        fn: '北堤道的终点山丘，是神圣的朝圣之地。',
        desc: '从特拉特洛尔科出发的堤道通到特佩亚克山脚下。殖民时期的文献将其与对 Tonantzin（“我们尊敬的母亲”）的崇拜联系在一起。如今这里是瓜达卢佩圣母大殿。',
        hist: ['萨阿贡提到特佩亚克是征服前的重要朝圣地之一。'],
      },
    },
  },

  estrella: {
    view: 'city',
    group: 'nature',
    nahuatl: 'Uixachtekatl',
    classical: 'Huīxachtecatl',
    t: {
      es: {
        name: 'Cerro de la Estrella',
        gloss: '«Cerro de los huizaches»',
        fn: 'El cerro donde se encendía el Fuego Nuevo cada 52 años.',
        desc: 'Al terminar cada ciclo de 52 años (xiuhmolpilli) se apagaban todos los fuegos. Los sacerdotes encendían uno nuevo en la cima y desde ahí se repartía a toda la cuenca. Se alza entre los lagos de Texcoco y Xochimilco, junto a Iztapalapa.',
        hist: ['La última ceremonia del Fuego Nuevo se celebró en 1507. Sahagún la describe en el libro 7 del Códice Florentino.'],
      },
      en: {
        name: 'Cerro de la Estrella',
        gloss: '“Hill of the huizache trees”',
        fn: 'The hill where the New Fire was lit every 52 years.',
        desc: 'At the end of each 52-year cycle (xiuhmolpilli) every fire was put out. Priests lit a new one on the summit and it was carried across the whole basin. The hill rises between Lakes Texcoco and Xochimilco, next to Iztapalapa.',
        hist: ['The last New Fire ceremony was held in 1507. Sahagún describes it in Book 7 of the Florentine Codex.'],
      },
      zh: {
        name: '星辰山',
        gloss: '“金合欢之山”',
        fn: '每52年点燃“新火”的山丘。',
        desc: '每个52年周期（xiuhmolpilli）结束时，所有的火都要熄灭。祭司在山顶点燃新火，再传遍整个盆地。这座山位于特斯科科湖与霍奇米尔科湖之间，紧邻伊斯塔帕拉帕。',
        hist: ['最后一次新火仪式举行于1507年。萨阿贡在《佛罗伦萨手抄本》第7卷中有所描述。'],
      },
    },
  },
};
