// Important buildings of Mexico-Tenochtitlan and the parts shown in the Buildings view.
// `building` on a part names the building it belongs to.

export const BUILDING_ELEMENTS = {
  ehecatl: {
    view: ['city', 'buildings'],
    group: 'buildings',
    nahuatl: 'Ehekatl teokalli',
    classical: 'Ehēcatl teōcalli',
    t: {
      es: {
        name: 'Templo de Ehécatl',
        gloss: 'Casa del dios del viento',
        fn: 'Templo del dios del viento, Ehécatl-Quetzalcóatl, frente al Templo Mayor.',
        desc: 'Era redondo para que el viento pudiera girar a su alrededor sin chocar con esquinas. El viento barre el camino a la lluvia, por eso estaba ligado a Tlaloc y a la agricultura.',
        hist: ['En 2017 el INAH dio a conocer los restos del templo de Ehécatl y parte del juego de pelota, bajo un antiguo hotel del Centro Histórico.'],
      },
      en: {
        name: 'Temple of Ehécatl',
        gloss: 'House of the wind god',
        fn: 'Temple of the wind god Ehécatl-Quetzalcóatl, facing the Templo Mayor.',
        desc: 'It was round so the wind could flow around it without hitting corners. The wind sweeps the way for the rain, so it was linked to Tlaloc and to farming.',
        hist: ['In 2017 INAH presented remains of the Ehécatl temple and part of the ballcourt, found under a former hotel in the Historic Centre.'],
      },
      zh: {
        name: '埃埃卡特尔神庙',
        gloss: '风神之殿',
        fn: '供奉风神埃埃卡特尔-克查尔科亚特尔的神庙，正对大神庙。',
        desc: '神庙呈圆形，让风可以绕行而不撞上墙角。风为雨开路，因此它与雨神特拉洛克和农业息息相关。',
        hist: ['2017年，墨西哥国家人类学与历史研究所（INAH）公布了在历史中心一座旧酒店地下发现的埃埃卡特尔神庙及部分球场遗址。'],
      },
    },
  },

  tlachtli: {
    view: ['city', 'buildings'],
    group: 'buildings',
    nahuatl: 'tlachtli · ulamalistli',
    classical: 'tlachtli · ōllamaliztli',
    t: {
      es: {
        name: 'Juego de pelota',
        gloss: 'Cancha de pelota · el juego de pelota',
        fn: 'Cancha en forma de I donde se jugaba con una pelota de hule. Tenía un sentido ritual y político.',
        desc: 'Los jugadores golpeaban la pelota de hule (olli) con la cadera. Pasarla por uno de los anillos de piedra era rarísimo y daba la victoria inmediata. El juego representaba el movimiento de los astros.',
        hist: ['Durán describe el juego y sus anillos. El Códice Mendoza muestra pelotas de hule entre los tributos.'],
      },
      en: {
        name: 'Ballcourt',
        gloss: 'Ballcourt · the ballgame',
        fn: 'An I-shaped court where a game was played with a rubber ball. It had ritual and political meaning.',
        desc: 'Players struck the rubber ball (olli) with their hips. Passing it through one of the stone rings was very rare and won the game at once. The game represented the movement of the heavenly bodies.',
        hist: ['Durán describes the game and its rings. The Codex Mendoza shows rubber balls among tribute items.'],
      },
      zh: {
        name: '球场',
        gloss: '球场 · 球赛',
        fn: '工字形球场，用橡胶球比赛，具有宗教和政治意义。',
        desc: '球员用髋部击打橡胶球（olli）。让球穿过石环极为罕见，一旦做到便立即获胜。这项运动象征着天体的运行。',
        hist: ['杜兰描述了这项球赛和石环。《门多萨手抄本》中的贡品里也有橡胶球。'],
      },
    },
  },

  tlachRing: {
    view: 'buildings',
    building: 'tlachtli',
    group: 'parts',
    nahuatl: 'tlachtemalakatl',
    classical: 'tlachtemalacatl',
    t: {
      es: {
        name: 'Anillo de piedra',
        gloss: 'Piedra redonda del juego de pelota',
        fn: 'Marcador vertical en el centro de cada muro.',
        desc: 'Un aro de piedra tallada, empotrado en lo alto de los muros laterales. Meter la pelota por él terminaba el partido.',
        hist: ['Durán describe los dos anillos de piedra colocados en medio de la cancha.'],
      },
      en: {
        name: 'Stone ring',
        gloss: 'Round stone of the ballcourt',
        fn: 'A vertical goal in the middle of each wall.',
        desc: 'A carved stone ring set high in the side walls. Sending the ball through it ended the match.',
        hist: ['Durán describes the two stone rings placed in the middle of the court.'],
      },
      zh: {
        name: '石环',
        gloss: '球场上的圆形石环',
        fn: '嵌在两侧墙壁中央的竖直球门。',
        desc: '雕刻而成的石环，高高嵌在两侧墙上。把球打进石环即可结束比赛。',
        hist: ['杜兰描述了球场中央的两个石环。'],
      },
    },
  },

  tzompantli: {
    view: ['city', 'buildings'],
    group: 'buildings',
    nahuatl: 'Ueyi tsompantli',
    classical: 'Huēyi tzompantli',
    t: {
      es: {
        name: 'Tzompantli',
        gloss: '«Hilera de cabezas»',
        fn: 'Estructura ritual donde se exhibían los cráneos de las personas sacrificadas.',
        desc: 'Una plataforma con postes de madera atravesados por varas, donde se colocaban cráneos frente al Templo Mayor. Era un símbolo religioso y político que mostraba el poder de la ciudad.',
        hist: ['Entre 2015 y 2017 el INAH excavó parte del Huey Tzompantli y una torre de cráneos descrita por los cronistas.'],
      },
      en: {
        name: 'Tzompantli (skull rack)',
        gloss: '“Row of heads”',
        fn: 'A ritual structure where the skulls of sacrificed people were displayed.',
        desc: 'A platform with wooden posts crossed by poles that held skulls, in front of the Templo Mayor. It was a religious and political symbol of the city’s power.',
        hist: ['Between 2015 and 2017 INAH excavated part of the Huey Tzompantli and a skull tower described by the chroniclers.'],
      },
      zh: {
        name: '头骨架',
        gloss: '“一排头颅”',
        fn: '展示献祭者头骨的仪式建筑。',
        desc: '在大神庙前的平台上立着木柱，柱间横穿木杆，上面挂放头骨。它既是宗教象征，也展示了城市的权力。',
        hist: ['2015至2017年间，INAH发掘了部分大头骨架以及编年史中记载的头骨塔。'],
      },
    },
  },

  tecpan: {
    view: ['city', 'buildings'],
    group: 'buildings',
    nahuatl: 'Ueyi tekpan',
    classical: 'Huēyi tēcpan',
    t: {
      es: {
        name: 'Palacio de Moctezuma',
        gloss: '«Gran palacio», casa del señor',
        fn: 'Residencia del gobernante y centro de gobierno: salas de consejo, tribunales, bodegas y jardines.',
        desc: 'Un gran conjunto de patios y salas sobre plataformas, al sur del recinto ceremonial. Tenía casas de aves y animales, jardines y estanques. Hoy el Palacio Nacional ocupa parte de su terreno.',
        hist: [
          'El Códice Mendoza (folio 69r) dibuja el tecpan de Moctezuma con sus salas de consejo.',
          'Cortés describe en su Segunda carta los palacios, jardines y la casa de las aves.',
        ],
      },
      en: {
        name: 'Palace of Moctezuma',
        gloss: '“Great palace”, the lord’s house',
        fn: 'The ruler’s residence and seat of government: council halls, courts, storehouses and gardens.',
        desc: 'A large complex of courtyards and halls on platforms, south of the ceremonial precinct. It had aviaries and animal houses, gardens and ponds. The National Palace now covers part of its site.',
        hist: [
          'The Codex Mendoza (folio 69r) draws Moctezuma’s tecpan with its council halls.',
          'Cortés describes the palaces, gardens and house of birds in his Second Letter.',
        ],
      },
      zh: {
        name: '蒙特祖马宫',
        gloss: '“大宫殿”，统治者之家',
        fn: '统治者的居所和政府中心，设有议事厅、法庭、仓库和花园。',
        desc: '位于礼仪区南面，由建在台基上的庭院和厅堂组成的大型建筑群，有鸟舍、动物园、花园和水池。今天的国家宫占据了它的部分旧址。',
        hist: [
          '《门多萨手抄本》第69r页描绘了蒙特祖马宫及其议事厅。',
          '科尔特斯在《第二封信》中描述了宫殿、花园和鸟舍。',
        ],
      },
    },
  },

  tianquiztli: {
    view: ['city', 'buildings'],
    group: 'buildings',
    nahuatl: 'tiankistli',
    classical: 'tiānquiztli',
    t: {
      es: {
        name: 'Mercado de Tlatelolco',
        gloss: 'Mercado, tianguis',
        fn: 'El mayor mercado de Mesoamérica: aquí llegaban las cosechas de las chinampas y productos de todo el mundo mexica.',
        desc: 'Una gran plaza con puestos ordenados por tipo de producto: maíz, chiles, pescado, telas, plumas, cerámica. Jueces vigilaban precios y medidas. Las canoas atracaban en sus orillas.',
        hist: [
          'Cortés (Segunda carta, 1520) dice que era dos veces mayor que la plaza de Salamanca y que acudían unas 60 000 personas al día.',
          'Bernal Díaz describe con asombro el orden del mercado.',
        ],
      },
      en: {
        name: 'Tlatelolco market',
        gloss: 'Market, tianguis',
        fn: 'The largest market in Mesoamerica, where chinampa harvests and goods from the whole Mexica world arrived.',
        desc: 'A great plaza with stalls grouped by product: maize, chilies, fish, cloth, feathers, pottery. Judges watched over prices and measures. Canoes docked along its edges.',
        hist: [
          'Cortés (Second Letter, 1520) says it was twice the size of the square of Salamanca, with some 60,000 people every day.',
          'Bernal Díaz describes the order of the market with amazement.',
        ],
      },
      zh: {
        name: '特拉特洛尔科市场',
        gloss: '市场、集市',
        fn: '中美洲最大的市场，奇南帕的收成和墨西加世界各地的货物都汇集于此。',
        desc: '一座大广场，摊位按商品分区：玉米、辣椒、鱼、布料、羽毛、陶器。有法官监督价格和度量。独木舟就停靠在广场边。',
        hist: [
          '科尔特斯在《第二封信》（1520）中说，它比萨拉曼卡的广场大一倍，每天约有6万人前来。',
          '贝尔纳尔·迪亚斯惊叹于市场的井然有序。',
        ],
      },
    },
  },

  tlatelolco: {
    view: 'city',
    group: 'city',
    nahuatl: 'Tlatelolko',
    classical: 'Tlatelōlco',
    t: {
      es: {
        name: 'Tlatelolco',
        gloss: 'Suele traducirse como «en el montículo de tierra»',
        fn: 'La ciudad gemela de Tenochtitlan, al norte de la isla, con su propio templo mayor y el gran mercado.',
        desc: 'Fue fundada por un grupo mexica y vivió independiente hasta que Tenochtitlan la sometió en 1473. Fue el último lugar en resistir el asedio español en 1521. Hoy ahí está la Plaza de las Tres Culturas.',
        hist: ['Los Anales de Tlatelolco (siglo XVI) narran la caída de la ciudad desde el punto de vista indígena.'],
      },
      en: {
        name: 'Tlatelolco',
        gloss: 'Often glossed as “at the mound of earth”',
        fn: 'Tenochtitlan’s twin city on the north of the island, with its own great temple and the great market.',
        desc: 'Founded by a Mexica group, it was independent until Tenochtitlan conquered it in 1473. It was the last place to resist the Spanish siege in 1521. The Plaza of the Three Cultures stands there today.',
        hist: ['The Annals of Tlatelolco (16th century) tell the fall of the city from an Indigenous point of view.'],
      },
      zh: {
        name: '特拉特洛尔科',
        gloss: '常译作“在土丘上”',
        fn: '特诺奇蒂特兰在岛北部的姐妹城，有自己的大神庙和大市场。',
        desc: '由一支墨西加人建立，独立存在到1473年被特诺奇蒂特兰征服。1521年西班牙围城时，这里是最后的抵抗之地。如今这里是三文化广场。',
        hist: ['16世纪的《特拉特洛尔科编年史》从原住民的视角讲述了城市的陷落。'],
      },
    },
  },

  /* ── Parts of the Templo Mayor (Buildings view) ── */
  tmPlatform: {
    view: 'buildings',
    building: 'temploMayor',
    group: 'parts',
    nahuatl: 'tlalmanalli',
    classical: 'tlalmanalli',
    t: {
      es: {
        name: 'Basamento escalonado',
        gloss: 'Terraplén, plataforma (Molina)',
        fn: 'La pirámide de cuerpos superpuestos que eleva los dos adoratorios hacia el cielo.',
        desc: 'Cuatro cuerpos en talud, uno sobre otro, sobre una gran plataforma. Cada gobernante amplió el templo cubriendo el anterior, así que por dentro hay al menos siete templos encimados.',
        hist: ['Las excavaciones desde 1978 identificaron siete etapas constructivas principales.'],
      },
      en: {
        name: 'Stepped base',
        gloss: 'Embankment, platform (Molina)',
        fn: 'The stacked pyramid that lifts the two shrines toward the sky.',
        desc: 'Four sloping tiers, one on top of another, on a large platform. Each ruler enlarged the temple by covering the previous one, so inside there are at least seven temples nested together.',
        hist: ['Excavations since 1978 have identified seven main construction stages.'],
      },
      zh: {
        name: '阶梯式台基',
        gloss: '土台、平台（莫利纳）',
        fn: '层层叠起的金字塔，把两座神殿托向天空。',
        desc: '在大平台上叠起四层斜坡式台体。每位统治者都通过覆盖旧神庙来扩建，因此内部至少套叠着七座神庙。',
        hist: ['自1978年以来的发掘确认了七个主要建造阶段。'],
      },
    },
  },

  tmStairs: {
    view: 'buildings',
    building: 'temploMayor',
    group: 'parts',
    nahuatl: 'tlamamatlatl',
    classical: 'tlamamatlatl',
    t: {
      es: {
        name: 'Escalinata doble',
        gloss: 'Escalera',
        fn: 'Dos escaleras paralelas en la fachada poniente, una para cada adoratorio.',
        desc: 'Las escalinatas miran al poniente, hacia donde se pone el sol. Por ellas subían sacerdotes y procesiones durante las fiestas.',
        hist: ['Bernal Díaz cuenta que subió los 114 escalones del templo junto con Cortés y Moctezuma.'],
      },
      en: {
        name: 'Double staircase',
        gloss: 'Stairway',
        fn: 'Two parallel staircases on the west face, one for each shrine.',
        desc: 'The stairs face west, toward the setting sun. Priests and processions climbed them during festivals.',
        hist: ['Bernal Díaz says he climbed the temple’s 114 steps with Cortés and Moctezuma.'],
      },
      zh: {
        name: '双阶梯',
        gloss: '阶梯',
        fn: '西面两道平行的阶梯，各通往一座神殿。',
        desc: '阶梯朝西，面向落日。节庆时，祭司和游行队伍由此登上神庙。',
        hist: ['贝尔纳尔·迪亚斯说，他曾与科尔特斯和蒙特祖马一同登上神庙的114级台阶。'],
      },
    },
  },

  tmTlaloc: {
    view: 'buildings',
    building: 'temploMayor',
    group: 'parts',
    nahuatl: 'Tlalok',
    classical: 'Tlāloc',
    t: {
      es: {
        name: 'Adoratorio de Tlaloc',
        gloss: 'Dios de la lluvia y del agua',
        fn: 'El santuario del norte, pintado de azul y blanco, dedicado a la lluvia y la fertilidad agrícola.',
        desc: 'Para una ciudad de chinamperos, la lluvia y el agua eran vida. Frente a este adoratorio se encontró una escultura de chac mool policromada de una etapa temprana.',
        hist: ['Las ofrendas excavadas del lado de Tlaloc incluyen corales, conchas y animales acuáticos.'],
      },
      en: {
        name: 'Shrine of Tlaloc',
        gloss: 'God of rain and water',
        fn: 'The northern shrine, painted blue and white, dedicated to rain and farming fertility.',
        desc: 'For a city of chinampa farmers, rain and water were life. A painted chac mool sculpture from an early stage was found in front of this shrine.',
        hist: ['Offerings excavated on Tlaloc’s side include coral, shells and aquatic animals.'],
      },
      zh: {
        name: '特拉洛克神殿',
        gloss: '雨水之神',
        fn: '北侧神殿，漆成蓝白两色，供奉雨水和农业丰饶。',
        desc: '对于以奇南帕为生的城市，雨水就是生命。在这座神殿前出土了一尊早期的彩绘查克莫尔雕像。',
        hist: ['在特拉洛克一侧发掘出的祭品包括珊瑚、贝壳和水生动物。'],
      },
    },
  },

  tmHuitzilopochtli: {
    view: 'buildings',
    building: 'temploMayor',
    group: 'parts',
    nahuatl: 'Uitsilopochtli',
    classical: 'Huītzilōpōchtli',
    t: {
      es: {
        name: 'Adoratorio de Huitzilopochtli',
        gloss: '«Colibrí del sur» (o «colibrí zurdo»)',
        fn: 'El santuario del sur, pintado de rojo, dedicado al dios mexica de la guerra y el sol.',
        desc: 'Huitzilopochtli guió a los mexicas desde Aztlan hasta el islote donde fundaron la ciudad. Su adoratorio recuerda el mito del cerro Coatepec, donde nació y venció a su hermana Coyolxauhqui.',
        hist: ['El Códice Florentino (libro 3) narra el nacimiento de Huitzilopochtli en Coatepec.'],
      },
      en: {
        name: 'Shrine of Huitzilopochtli',
        gloss: '“Hummingbird of the south” (or “left-handed hummingbird”)',
        fn: 'The southern shrine, painted red, dedicated to the Mexica god of war and the sun.',
        desc: 'Huitzilopochtli guided the Mexica from Aztlan to the island where they founded the city. His shrine recalls the myth of Coatepec hill, where he was born and defeated his sister Coyolxauhqui.',
        hist: ['The Florentine Codex (Book 3) tells the birth of Huitzilopochtli at Coatepec.'],
      },
      zh: {
        name: '维齐洛波奇特利神殿',
        gloss: '“南方的蜂鸟”（或“左手蜂鸟”）',
        fn: '南侧神殿，漆成红色，供奉墨西加的战争与太阳之神。',
        desc: '维齐洛波奇特利带领墨西加人从阿兹特兰来到建城的小岛。他的神殿重现了科亚特佩克山的神话：他在那里诞生，并打败了姐姐科约尔沙乌基。',
        hist: ['《佛罗伦萨手抄本》第3卷讲述了维齐洛波奇特利在科亚特佩克诞生的故事。'],
      },
    },
  },

  tmCoyolxauhqui: {
    view: 'buildings',
    building: 'temploMayor',
    group: 'parts',
    nahuatl: 'Koyolxauki',
    classical: 'Coyolxāuhqui',
    t: {
      es: {
        name: 'Piedra de Coyolxauhqui',
        gloss: '«La que se adorna con cascabeles»',
        fn: 'Un gran disco de piedra al pie de la escalinata de Huitzilopochtli, con la diosa desmembrada.',
        desc: 'Representa a la hermana de Huitzilopochtli, vencida y arrojada desde lo alto del cerro Coatepec. Al estar al pie del templo, recreaba el mito en cada ceremonia.',
        hist: ['Trabajadores de la compañía de luz la encontraron en febrero de 1978. Ese hallazgo inició el Proyecto Templo Mayor.'],
      },
      en: {
        name: 'Coyolxauhqui stone',
        gloss: '“She who is adorned with bells”',
        fn: 'A great stone disc at the foot of Huitzilopochtli’s stairs, showing the dismembered goddess.',
        desc: 'It shows Huitzilopochtli’s sister, defeated and thrown from the top of Coatepec hill. Lying at the foot of the temple, it re-enacted the myth in every ceremony.',
        hist: ['Electric company workers found it in February 1978. That find started the Templo Mayor Project.'],
      },
      zh: {
        name: '科约尔沙乌基石',
        gloss: '“以铃铛为饰的女神”',
        fn: '维齐洛波奇特利阶梯脚下的巨大石盘，刻着被肢解的女神。',
        desc: '石盘刻画的是维齐洛波奇特利的姐姐，她被打败后从科亚特佩克山顶抛下。石盘位于神庙脚下，每次仪式都在重演这段神话。',
        hist: ['1978年2月由电力公司工人发现，这一发现开启了大神庙考古项目。'],
      },
    },
  },

  tmSerpents: {
    view: 'buildings',
    building: 'temploMayor',
    group: 'parts',
    nahuatl: 'koatl',
    classical: 'cōātl',
    t: {
      es: {
        name: 'Cabezas de serpiente',
        gloss: 'Serpiente',
        fn: 'Esculturas en la base de las escalinatas que convertían al templo en el cerro Coatepec, «cerro de la serpiente».',
        desc: 'Grandes cabezas de serpiente de piedra marcaban el arranque de las escaleras y las esquinas de la plataforma. El templo entero se volvía así una montaña sagrada.',
        hist: ['Varias cabezas de serpiente pueden verse hoy in situ en la zona arqueológica del Templo Mayor.'],
      },
      en: {
        name: 'Serpent heads',
        gloss: 'Serpent',
        fn: 'Sculptures at the base of the stairs that turned the temple into Coatepec, “serpent hill”.',
        desc: 'Great stone serpent heads marked the foot of the stairs and the corners of the platform. The whole temple thus became a sacred mountain.',
        hist: ['Several serpent heads can be seen in place today at the Templo Mayor archaeological site.'],
      },
      zh: {
        name: '蛇头雕刻',
        gloss: '蛇',
        fn: '阶梯底部的雕刻，让神庙化身为科亚特佩克——“蛇之山”。',
        desc: '巨大的石雕蛇头标示着阶梯起点和平台四角，使整座神庙成为一座圣山。',
        hist: ['如今在大神庙考古区仍可看到几座原位保存的蛇头。'],
      },
    },
  },
};

// Order of the Buildings view and the part labels shown for each.
export const BUILDINGS = ['temploMayor', 'ehecatl', 'tlachtli', 'tzompantli', 'tecpan', 'tianquiztli'];
