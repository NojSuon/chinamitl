// Content for every clickable element, in Spanish (main), English and Chinese.
// Nahuatl names use the modern practical orthography (tlajkuilolpamitl, SEP-style):
//   k = c/qu, kw = cu/uc, w = hu/uh, s = z/ce/ci, ts = tz, j = saltillo (h), no vowel-length marks.
// `classical` keeps the colonial-era spelling (with vowel length) for comparison.
// Words in Nahuatl and cultural data should be validated with speakers before publishing.

export const ELEMENTS = {
  /* ───────────────────────── Overview ───────────────────────── */
  chinampa: {
    view: 'chinampa',
    group: 'overview',
    nahuatl: 'chinamitl · chinampan',
    classical: 'chināmitl · chināmpan',
    t: {
      es: {
        name: 'Chinampa',
        gloss: '«Cerco de cañas» · chinampan = «sobre el cerco de cañas»',
        fn: 'Un campo elevado y rectangular construido en los lagos poco profundos de la Cuenca de México. Se riega desde abajo y se abona con lodo de los canales, así que se puede cultivar todo el año.',
        desc: 'Primero se marcaba el terreno con estacas de madera y un cerco de carrizo tejido. Después se rellenaba con capas de vegetación acuática y lodo del fondo del lago, hasta que la superficie quedaba sobre el agua. Los ahuejotes sujetaban las orillas. Los canales servían para moverse en canoa, pescar, regar y abonar. Las chinampas están ancladas al fondo: no flotan, aunque se les llame «jardines flotantes».',
        hist: [
          'La agricultura de chinampas en los lagos del sur (Xochimilco–Chalco) suele fecharse en el Posclásico. Los mexicas la ampliaron a gran escala en el siglo XV.',
          'Pedro Armillas, «Gardens on Swamps» (Science, 1971), usó fotografía aérea para mapear la enorme extensión de las chinampas antiguas.',
          'En 2017 la FAO reconoció el «Sistema agrícola chinampero de la Ciudad de México» como Sistema Importante del Patrimonio Agrícola Mundial (SIPAM).',
          'Xochimilco es Patrimonio de la Humanidad de la UNESCO desde 1987, junto con el Centro Histórico de la Ciudad de México.',
        ],
      },
      en: {
        name: 'Chinampa',
        gloss: '“Reed or cane enclosure” · chinampan = “on the cane fence”',
        fn: 'A raised, rectangular field built in the shallow lakes of the Basin of Mexico. It is watered from below and fertilised with mud from the canals, so it can be farmed all year.',
        desc: 'Farmers marked out a plot with wooden stakes and a woven reed fence. They filled it with layers of aquatic vegetation and lake-bottom mud until it rose above the water. Willow trees anchored the edges. The canals were used for canoe transport, fishing, irrigation and fertiliser. Chinampas are anchored to the lake bed. They do not float, even though they are often called “floating gardens”.',
        hist: [
          'Chinampa farming in the southern lakes (Xochimilco–Chalco) is generally dated to the Postclassic period. The Mexica expanded it on a large scale in the 15th century.',
          'Pedro Armillas’ “Gardens on Swamps” (Science, 1971) used aerial photographs to map the huge extent of ancient chinampa fields.',
          'In 2017 the FAO designated the “Chinampa Agricultural System of Mexico City” a Globally Important Agricultural Heritage System (GIAHS).',
          'Xochimilco has been a UNESCO World Heritage Site since 1987, together with the Historic Centre of Mexico City.',
        ],
      },
      zh: {
        name: '奇南帕（湖田）',
        gloss: '“芦苇围栏” · chinampan = “在芦苇围栏之上”',
        fn: '建在墨西哥盆地浅湖中的长方形高田。水分从下方渗入，用运河淤泥施肥，因此全年都可以耕种。',
        desc: '农民先用木桩和编织的芦苇围栏圈出地块，再层层填入水生植物和湖底淤泥，直到田面高出水面。岸边种植的柳树起固定作用。田间的运河用于划船运输、捕鱼、灌溉和取肥。奇南帕固定在湖底，并不会漂浮，尽管常被称为“浮动园地”。',
        hist: [
          '南部湖区（霍奇米尔科—查尔科）的奇南帕农业一般被认为始于后古典期。15世纪时，墨西加人大规模扩建了奇南帕。',
          '佩德罗·阿米利亚斯在《沼泽上的园地》（《科学》，1971）中用航拍照片绘制了古代奇南帕的巨大范围。',
          '2017年，联合国粮农组织将“墨西哥城奇南帕农业系统”列为全球重要农业文化遗产。',
          '1987年，霍奇米尔科与墨西哥城历史中心一同列入联合国教科文组织世界遗产名录。',
        ],
      },
    },
  },

  neighbor: {
    view: 'chinampa',
    group: 'overview',
    nahuatl: 'chinampan',
    classical: 'chināmpan',
    action: { view: 'city' },
    t: {
      es: {
        name: 'Chinampas vecinas',
        gloss: '«Sobre las chinampas». También nombra a la región de los pueblos lacustres del sur',
        fn: 'Una chinampa es un módulo. Repetida miles de veces, formó barrios enteros de la ciudad.',
        desc: 'Las chinampas se trazaban en retículas de franjas largas separadas por canales. Cambia a la vista de Tenochtitlan para ver cómo se volvieron los bloques con los que se construyó la ciudad.',
        hist: ['Los recorridos arqueológicos estiman que las chinampas cubrieron miles de hectáreas solo en los lagos del sur.'],
        action: 'Ver Tenochtitlan',
      },
      en: {
        name: 'Neighbouring chinampas',
        gloss: '“On the chinampas”, also a name for the southern lake towns',
        fn: 'One chinampa is a module. Repeated thousands of times, chinampas formed whole city districts.',
        desc: 'Chinampas were laid out in grids of long strips separated by canals. Switch to the Tenochtitlan view to see how they became the building blocks of the city.',
        hist: ['Archaeological surveys estimate that chinampas once covered thousands of hectares in the southern lakes alone.'],
        action: 'See Tenochtitlan',
      },
      zh: {
        name: '相邻的奇南帕',
        gloss: '“在奇南帕之上”，也是南部湖区村镇的统称',
        fn: '一块奇南帕就是一个模块。重复成千上万次后，便构成了整片城区。',
        desc: '奇南帕排列成由运河分隔的长条形网格。切换到特诺奇蒂特兰视图，看看它们如何成为城市的基本单元。',
        hist: ['考古调查估计，仅南部湖区的奇南帕就曾覆盖数千公顷。'],
        action: '查看特诺奇蒂特兰',
      },
    },
  },

  /* ───────────────────────── Structure ───────────────────────── */
  stakes: {
    view: 'chinampa',
    group: 'structure',
    nahuatl: 'kwawitl',
    classical: 'cuahuitl',
    t: {
      es: {
        name: 'Estacas de madera',
        gloss: 'Árbol, madera, palo',
        fn: 'Marcan el contorno y sostienen el relleno. Se clavan en el fondo del lago y forman el esqueleto de la chinampa.',
        desc: 'Se hincaban postes en el fondo blando alrededor del rectángulo y se tejía carrizo entre ellos. Así las capas de vegetación y lodo se mantenían en su lugar mientras se asentaban. Con el tiempo, las raíces de los ahuejotes hacían buena parte de este trabajo.',
        hist: ['En excavaciones en Xochimilco y el sur de la cuenca se han registrado hileras de postes en antiguos bordes de chinampa.'],
      },
      en: {
        name: 'Wooden stakes',
        gloss: 'Tree, wood, stick',
        fn: 'They outline the plot and hold the fill in place. They are driven into the lake bottom to form the skeleton of the chinampa.',
        desc: 'Posts were driven into the soft lake bed around the rectangle, and reeds were woven between them. This held the layers of vegetation and mud in place while they settled. Over time, the roots of the willows took over much of this job.',
        hist: ['Excavations in Xochimilco and the southern basin have recorded rows of posts along old chinampa edges.'],
      },
      zh: {
        name: '木桩',
        gloss: '树、木头、木棍',
        fn: '木桩勾勒出地块轮廓并固定填料。它们被打入湖底，构成奇南帕的骨架。',
        desc: '人们沿长方形四周把木桩打进松软的湖底，再在木桩之间编织芦苇。这样，植物和淤泥层在沉降过程中就能保持原位。日后，柳树的根系会逐渐承担这一作用。',
        hist: ['在霍奇米尔科和盆地南部的发掘中，沿古代奇南帕边缘发现了成排的木桩。'],
      },
    },
  },

  wattle: {
    view: 'chinampa',
    group: 'structure',
    nahuatl: 'chinamitl',
    classical: 'chināmitl',
    t: {
      es: {
        name: 'Cerco de carrizo',
        gloss: 'Cerca o seto hecho de cañas',
        fn: 'Un cerco tejido entre las estacas que evita que el lodo y la vegetación se deslaven hacia el canal.',
        desc: 'Este cerco le da nombre a toda la técnica. Chinampa viene de chinamitl («cerco de cañas») y el locativo -pan («sobre, en»): el campo es, literalmente, «el lugar sobre el cerco de cañas». Se reparaba seguido, porque el carrizo se pudre y hay que reemplazarlo.',
        hist: ['El Vocabulario de Molina (1571) registra chinamitl como «seto o cerca de cañas».'],
      },
      en: {
        name: 'Reed fence (wattle)',
        gloss: 'Enclosure or fence made of canes',
        fn: 'A woven reed fence between the stakes that keeps mud and plant material from washing into the canal.',
        desc: 'This fence gives the whole technique its name. Chinampa comes from chinamitl (“cane fence”) plus the locative -pan (“on, at”), so the field is literally “the place on the cane enclosure”. The fence was repaired often, as the reeds rotted and had to be replaced.',
        hist: ['Molina’s Vocabulario (1571) lists chinamitl as “seto o cerca de cañas” (a hedge or fence of canes).'],
      },
      zh: {
        name: '芦苇编篱',
        gloss: '用芦苇或藤条编成的围栏',
        fn: '编织在木桩之间的芦苇篱笆，防止淤泥和植物材料被冲入运河。',
        desc: '整个技术的名称就来自这道篱笆。chinampa 由 chinamitl（“芦苇围栏”）加上方位后缀 -pan（“在……之上”）构成，字面意思是“在芦苇围栏之上的地方”。芦苇会腐烂，所以篱笆需要经常修补更换。',
        hist: ['莫利纳的《词汇》（1571）将 chinamitl 释为“芦苇做的篱笆或围栏”。'],
      },
    },
  },

  reedMat: {
    view: 'chinampa',
    group: 'structure',
    nahuatl: 'tolin · akatl',
    classical: 'tōllin · ācatl',
    t: {
      es: {
        name: 'Capa de tule y vegetación acuática',
        gloss: 'Tule · carrizo',
        fn: 'Las capas fibrosas de la base dan cuerpo al relleno, evitan que el lodo se escurra y, al descomponerse, se vuelven materia orgánica muy fértil.',
        desc: 'Se cortaban plantas flotantes, lirios, tule y carrizo, y se tendían en capas gruesas alternadas con lodo. Las fibras amarran el relleno como la varilla al concreto. Al pudrirse, alimentan a los cultivos de arriba.',
        hist: [
          'El tule también se tejía en petates (petlatl), canastas y asientos. Fue uno de los recursos lacustres más importantes para los mexicas.',
          'El Códice Florentino de Sahagún (libro 11) describe muchas plantas del lago y sus usos.',
        ],
      },
      en: {
        name: 'Aquatic vegetation mat',
        gloss: 'Tule (bulrush) · reed',
        fn: 'The fibrous base layers give the fill body and keep the mud from slumping. As they decompose they become rich organic matter.',
        desc: 'Farmers cut floating plants, water lilies, tule and reeds, and laid them in thick mats alternating with mud. The fibres bind the fill like rebar in concrete. As they rot, they feed the crops above.',
        hist: [
          'Tule was also woven into mats (petlatl), baskets and seats. It was one of the most important lake resources of the Mexica.',
          'Sahagún’s Florentine Codex (Book 11) describes many lake plants and their uses.',
        ],
      },
      zh: {
        name: '水生植物层',
        gloss: '香蒲（灯心草）· 芦苇',
        fn: '底部的纤维层让填料成形、防止淤泥坍塌，分解后会变成肥沃的有机质。',
        desc: '人们割下浮水植物、睡莲、香蒲和芦苇，铺成厚厚的垫层，与淤泥层交替堆叠。纤维像钢筋固定混凝土一样把填料连在一起，腐烂后又为上层作物提供养分。',
        hist: [
          '香蒲还被编成草席（petlatl）、篮子和座椅，是墨西加人最重要的湖泊资源之一。',
          '萨阿贡的《佛罗伦萨手抄本》第11卷记述了许多湖生植物及其用途。',
        ],
      },
    },
  },

  mud: {
    view: 'chinampa',
    group: 'structure',
    nahuatl: 'sokitl',
    classical: 'zoquitl',
    t: {
      es: {
        name: 'Lodo del canal',
        gloss: 'Lodo, barro',
        fn: 'El relleno principal y el abono: el lodo del fondo del canal está lleno de materia orgánica descompuesta.',
        desc: 'Los chinamperos sacan lodo de los canales para construir la plataforma y renovar la superficie cada temporada. Así también mantienen el canal hondo para las canoas: cuidar la parcela y cuidar el agua es el mismo trabajo.',
        hist: ['Sacar lodo del canal y subirlo a la chinampa se sigue haciendo hoy en Xochimilco y San Gregorio Atlapulco.'],
      },
      en: {
        name: 'Lake mud',
        gloss: 'Mud, clay',
        fn: 'The main fill and fertiliser. Mud dredged from the canal bottom is full of decomposed organic matter.',
        desc: 'Chinamperos scoop mud from the canals to build the platform and to renew its surface every season. This also keeps the canals deep enough for canoes, so caring for the field and the waterway is the same job.',
        hist: ['Dredging canal mud onto the beds is still practised in Xochimilco and San Gregorio Atlapulco today.'],
      },
      zh: {
        name: '湖底淤泥',
        gloss: '淤泥、黏土',
        fn: '主要的填料和肥料：运河底的淤泥富含分解后的有机质。',
        desc: '奇南帕农民从运河里捞取淤泥，用来堆筑田台，并在每个季节更新田面。这同时让运河保持足够的深度以便行船，所以照料田地和照料水道是同一件事。',
        hist: ['如今在霍奇米尔科和圣格雷戈里奥阿特拉普尔科，人们仍在把运河淤泥捞上田面。'],
      },
    },
  },

  topsoil: {
    view: 'chinampa',
    group: 'structure',
    nahuatl: 'tlalli',
    classical: 'tlālli',
    t: {
      es: {
        name: 'Tierra y composta',
        gloss: 'Tierra, suelo',
        fn: 'La superficie fértil de cultivo, a medio metro sobre el agua, siempre húmeda gracias a la capilaridad.',
        desc: 'Después de cada cosecha se extiende lodo fresco, composta y restos de plantas para devolverle la fertilidad. Como el agua sube por la tierra desde los canales, casi no hace falta regar a mano, y se pueden levantar varias cosechas al año.',
        hist: ['Cronistas coloniales y estudios modernos reportan varias cosechas anuales en las chinampas. Las cifras varían según el cultivo y la época.'],
      },
      en: {
        name: 'Topsoil & compost',
        gloss: 'Earth, soil, land',
        fn: 'The fertile growing surface, about half a metre above the water, kept moist from below by capillary action.',
        desc: 'After each harvest, fresh mud, compost and plant waste are spread on the surface to restore fertility. Because water rises through the soil from the canals, the beds need little hand-watering, and several harvests a year are possible.',
        hist: ['Colonial and modern observers report multiple crops per year on chinampas. Estimates vary with crop and period.'],
      },
      zh: {
        name: '表土与堆肥',
        gloss: '土地、土壤',
        fn: '肥沃的耕作面，高出水面约半米，借助毛细作用从下方保持湿润。',
        desc: '每次收获后，人们在田面铺上新淤泥、堆肥和植物残渣以恢复地力。由于运河的水会透过土壤上升，几乎不需要人工浇水，一年可以收获多次。',
        hist: ['殖民时期的记录和现代研究都提到奇南帕一年多熟，具体次数因作物和时代而异。'],
      },
    },
  },

  ahuejote: {
    view: 'chinampa',
    group: 'structure',
    nahuatl: 'awexotl',
    classical: 'āhuēxōtl',
    t: {
      es: {
        name: 'Ahuejote',
        gloss: '«Sauce de agua» (a- agua + wexotl sauce)',
        fn: 'Estacas vivas: sus raíces amarran la orilla de la chinampa al fondo del lago y evitan la erosión.',
        desc: 'El ahuejote (Salix bonplandiana) crece alto y angosto, así que casi no da sombra a los cultivos. También funciona como rompevientos y como percha para aves que comen plagas. Su silueta es la imagen más reconocible de los canales de Xochimilco.',
        hist: ['Salix bonplandiana es nativo del centro de México y sigue siendo el árbol tradicional de los bordes de chinampa.'],
      },
      en: {
        name: 'Ahuejote (willow)',
        gloss: '“Water willow” (a- water + wexotl willow)',
        fn: 'Living stakes: the roots bind the edges of the chinampa to the lake bed and stop erosion.',
        desc: 'The ahuejote (Salix bonplandiana) grows tall and narrow, so it casts little shade on the crops. It also works as a windbreak and as a perch for birds that eat pests. Its silhouette is the most recognisable image of the Xochimilco canals.',
        hist: ['Salix bonplandiana is native to central Mexico and is still the traditional border tree of the chinampas.'],
      },
      zh: {
        name: '阿韦霍特柳',
        gloss: '“水柳”（a- 水 + wexotl 柳树）',
        fn: '活的木桩：根系把奇南帕的边缘牢牢固定在湖底，防止侵蚀。',
        desc: '阿韦霍特柳（Salix bonplandiana）高而窄，几乎不遮挡作物的阳光。它还能防风，并为捕食害虫的鸟类提供栖息处。它的剪影是霍奇米尔科运河最具代表性的景象。',
        hist: ['这种柳树原产于墨西哥中部，至今仍是奇南帕边缘的传统树种。'],
      },
    },
  },

  canal: {
    view: 'chinampa',
    group: 'structure',
    nahuatl: 'apantli',
    classical: 'āpantli',
    t: {
      es: {
        name: 'Canal (apantle)',
        gloss: 'Canal de agua (a- agua + pantli hilera)',
        fn: 'Riego desde abajo, transporte en canoa, fuente de lodo y abono, y lugar de pesca.',
        desc: 'Cada chinampa está rodeada de agua. Canales angostos separan las parcelas y otros más anchos conectan barrios enteros. El nivel del agua mantiene húmedas las raíces, y por esos mismos canales llegaban las cosechas a los mercados.',
        hist: ['La palabra «apantle» (zanja de riego) viene del náhuatl apantli.'],
      },
      en: {
        name: 'Canal',
        gloss: 'Water channel (a- water + pantli row)',
        fn: 'Irrigation from below, canoe transport, a source of mud and fertiliser, and a fishing ground.',
        desc: 'Every chinampa is surrounded by water. Narrow canals separate the beds and wider ones connect whole districts. The water table keeps the roots moist, and the same canals carried the harvest to the markets.',
        hist: ['The Mexican Spanish word apantle (an irrigation ditch) comes from Nahuatl apantli.'],
      },
      zh: {
        name: '运河',
        gloss: '水道（a- 水 + pantli 行、列）',
        fn: '从下方灌溉、划船运输、提供淤泥和肥料，也是捕鱼的地方。',
        desc: '每块奇南帕四周都是水。窄运河分隔田块，宽运河连接整片街区。地下水位让根系保持湿润，收获的作物也沿着这些运河运往市场。',
        hist: ['墨西哥西班牙语中的 apantle（灌溉沟）一词来自纳瓦特尔语 apantli。'],
      },
    },
  },

  seedbed: {
    view: 'chinampa',
    group: 'structure',
    nahuatl: 'xinachtli',
    classical: 'xīnachtli',
    t: {
      es: {
        name: 'Almácigo con chapines',
        gloss: 'Semilla, plántula',
        fn: 'Un vivero donde las semillas germinan en cubitos de lodo antes de trasplantarse al campo.',
        desc: 'En un extremo se extiende una capa de lodo fino y se corta en una cuadrícula de cubos, los chapines. En cada uno se siembra una semilla. La plántula se trasplanta con su propio bloque de tierra, y así el campo se aprovecha mucho más.',
        hist: ['El almácigo de chapines es una de las técnicas más características de la agricultura chinampera y se sigue usando hoy.'],
      },
      en: {
        name: 'Seedbed (chapines)',
        gloss: 'Seed, seedling',
        fn: 'A nursery where seeds sprout in small cubes of mud before being transplanted into the field.',
        desc: 'A layer of fine mud is spread at one end of the bed and cut into a grid of small cubes, called chapines. One seed is pressed into each cube. Each seedling is moved with its own block of soil, so the field is used much more intensively.',
        hist: ['The chapín seedbed is one of the hallmarks of chinampa agriculture and is still used today.'],
      },
      zh: {
        name: '育苗床（泥块苗）',
        gloss: '种子、幼苗',
        fn: '育苗区：种子先在小泥块中发芽，再移栽到田里。',
        desc: '在田的一端铺一层细泥，切成整齐的小方块，当地称为 chapines。每块泥中播一粒种子。幼苗连同自己的泥块一起移栽，使田地得到更充分的利用。',
        hist: ['泥块育苗是奇南帕农业最具特色的技术之一，至今仍在使用。'],
      },
    },
  },

  /* ───────────────────────── Crops ───────────────────────── */
  maize: {
    view: 'chinampa',
    group: 'crops',
    nahuatl: 'sintli · elotl · milli',
    classical: 'cintli · ēlōtl · mīlli',
    t: {
      es: {
        name: 'Maíz',
        gloss: 'Mazorca seca · elote · campo de cultivo (milpa)',
        fn: 'El grano principal. También sirve de tutor vivo para el frijol que trepa por él.',
        desc: 'El maíz estaba en el centro de la dieta y de la visión del mundo mesoamericana. En la chinampa se sembraba en milpa, junto con frijol y calabaza. Trasplantarlo desde los chapines le daba ventaja.',
        hist: [
          'El Códice Mendoza (c. 1541) muestra grandes trojes de maíz enviadas como tributo a Tenochtitlan.',
          'El Códice Florentino registra muchas variedades de maíz y sus deidades: Chicomecoatl y Centeotl.',
        ],
      },
      en: {
        name: 'Maize',
        gloss: 'Dried ear · green ear · cultivated field (milpa)',
        fn: 'The staple grain. It also serves as a living pole for the climbing beans.',
        desc: 'Maize was at the centre of Mesoamerican diet and worldview. On chinampas it was grown as part of the milpa, together with beans and squash. Transplanting seedlings from the chapines gave it a head start.',
        hist: [
          'The Codex Mendoza (c. 1541) shows large tribute bins of maize sent to Tenochtitlan.',
          'The Florentine Codex records many varieties of maize and the deities linked to it (Chicomecoatl, Centeotl).',
        ],
      },
      zh: {
        name: '玉米',
        gloss: '干玉米穗 · 嫩玉米 · 耕地（米尔帕）',
        fn: '主粮，同时也是攀援菜豆的天然支架。',
        desc: '玉米是中美洲饮食和世界观的核心。在奇南帕上，玉米与菜豆、南瓜一起以“米尔帕”方式混种。从泥块苗床移栽，让它一开始就长势领先。',
        hist: [
          '《门多萨手抄本》（约1541年）描绘了作为贡品送往特诺奇蒂特兰的大批玉米。',
          '《佛罗伦萨手抄本》记载了众多玉米品种及相关神祇（奇科梅科阿特尔、森特奥特尔）。',
        ],
      },
    },
  },

  beans: {
    view: 'chinampa',
    group: 'crops',
    nahuatl: 'etl',
    classical: 'ētl',
    t: {
      es: {
        name: 'Frijol',
        gloss: 'Frijol',
        fn: 'Proteína y nitrógeno para la tierra. Trepa por las cañas del maíz.',
        desc: 'El frijol fija nitrógeno con sus raíces y así ayuda a mantener fértil el suelo. Junto con el maíz forma una proteína completa. Es una de las «tres hermanas» de la milpa.',
        hist: ['El frijol aparece en las listas de tributo del Códice Mendoza junto con maíz, amaranto y chía.'],
      },
      en: {
        name: 'Beans',
        gloss: 'Bean',
        fn: 'Protein, and nitrogen for the soil. Beans climb up the maize stalks.',
        desc: 'Beans fix nitrogen through their roots, which helps keep the soil fertile. Eaten with maize they make a complete protein. They are one of the “three sisters” of the milpa.',
        hist: ['Beans appear in the Codex Mendoza tribute lists alongside maize, amaranth and chia.'],
      },
      zh: {
        name: '菜豆',
        gloss: '豆子',
        fn: '提供蛋白质，并为土壤固氮。菜豆沿着玉米秆向上攀爬。',
        desc: '菜豆的根能固氮，帮助土壤保持肥沃。与玉米同食可构成完全蛋白。它是米尔帕“三姐妹”之一。',
        hist: ['在《门多萨手抄本》的贡品清单中，菜豆与玉米、苋米、奇亚籽并列出现。'],
      },
    },
  },

  squash: {
    view: 'chinampa',
    group: 'crops',
    nahuatl: 'ayojtli',
    classical: 'ayohtli',
    t: {
      es: {
        name: 'Calabaza',
        gloss: 'Calabaza',
        fn: 'Cubre el suelo: sus hojas anchas dan sombra, guardan humedad y frenan las hierbas.',
        desc: 'Es la tercera hermana de la milpa. Se comía la pulpa, las semillas (ayojwachtli) y las flores.',
        hist: ['La calabaza es de las primeras plantas domesticadas en Mesoamérica. El Códice Florentino describe varios tipos.'],
      },
      en: {
        name: 'Squash',
        gloss: 'Squash, pumpkin',
        fn: 'Ground cover: its broad leaves shade the soil, hold moisture and suppress weeds.',
        desc: 'Squash is the third sister of the milpa. People ate the flesh, the seeds (ayojwachtli) and the flowers.',
        hist: ['Squash is among the earliest domesticated plants of Mesoamerica. The Florentine Codex lists several kinds.'],
      },
      zh: {
        name: '南瓜',
        gloss: '南瓜',
        fn: '地面覆盖：宽大的叶片为土壤遮阴、保湿并抑制杂草。',
        desc: '南瓜是米尔帕的第三位“姐妹”。人们食用它的果肉、种子（ayojwachtli）和花。',
        hist: ['南瓜是中美洲最早被驯化的植物之一，《佛罗伦萨手抄本》记载了多个品种。'],
      },
    },
  },

  chili: {
    view: 'chinampa',
    group: 'crops',
    nahuatl: 'chilli',
    classical: 'chīlli',
    t: {
      es: {
        name: 'Chile',
        gloss: 'Chile',
        fn: 'Condimento, medicina y conservador. Se comía todos los días.',
        desc: 'El chile era tan esencial que dejar de comerlo era una forma de ayuno. La palabra «chile» viene directamente del náhuatl.',
        hist: ['Sahagún describe a los vendedores de chile del mercado de Tlatelolco y sus muchas variedades (Códice Florentino, libro 10).'],
      },
      en: {
        name: 'Chili',
        gloss: 'Chili pepper',
        fn: 'Seasoning, medicine and preservative. It was eaten every day.',
        desc: 'Chili was so essential that giving it up was a form of fasting. The words “chile” and “chili” come directly from Nahuatl.',
        hist: ['Sahagún describes the chili sellers of the Tlatelolco market and their many varieties (Florentine Codex, Book 10).'],
      },
      zh: {
        name: '辣椒',
        gloss: '辣椒',
        fn: '调味品、药物和防腐剂，是每天都吃的食物。',
        desc: '辣椒极其重要，戒食辣椒甚至是一种斋戒方式。西班牙语和英语中的“chile/chili”一词直接来自纳瓦特尔语。',
        hist: ['萨阿贡记述了特拉特洛尔科市场上的辣椒商贩及众多辣椒品种（《佛罗伦萨手抄本》第10卷）。'],
      },
    },
  },

  tomato: {
    view: 'chinampa',
    group: 'crops',
    nahuatl: 'xitomatl',
    classical: 'xītomatl',
    t: {
      es: {
        name: 'Jitomate',
        gloss: '«Tomatl de ombligo»: el jitomate rojo y grande',
        fn: 'Verdura y base de salsas. Se cultiva en parcelas chicas y con tutores para que el fruto no toque la tierra.',
        desc: 'Tomatl nombraba al tomate de cáscara y frutos parecidos. Xitomatl era el rojo y carnoso. Ambas palabras llegaron a muchas lenguas del mundo a través del español.',
        hist: ['Los informantes de Sahagún describen a los vendedores de tomate y muchas clases de tomatl en los mercados.'],
      },
      en: {
        name: 'Tomato',
        gloss: '“Navel tomatl”: the large red tomato',
        fn: 'Vegetable and sauce base, grown in small plots and staked to keep the fruit off the soil.',
        desc: 'Tomatl referred to husk tomatoes and similar fruits. Xitomatl was the plump red kind. Both words reached many world languages through Spanish.',
        hist: ['Sahagún’s informants describe tomato sellers and many kinds of tomatl in the markets.'],
      },
      zh: {
        name: '番茄',
        gloss: '“有肚脐的 tomatl”，即大个的红番茄',
        fn: '蔬菜和酱汁的基础原料，种在小块地里并搭支架，让果实不接触土壤。',
        desc: 'tomatl 指带壳的绿番茄及类似果实，xitomatl 则是饱满的红番茄。这两个词经由西班牙语传入世界多种语言。',
        hist: ['萨阿贡的报告人描述了市场上的番茄商贩以及多种 tomatl。'],
      },
    },
  },

  amaranth: {
    view: 'chinampa',
    group: 'crops',
    nahuatl: 'wawtli',
    classical: 'huauhtli',
    t: {
      es: {
        name: 'Amaranto',
        gloss: 'Amaranto (alegría)',
        fn: 'Grano y quelite con mucha proteína. También tenía uso ritual.',
        desc: 'Con masa de semilla de amaranto (tzoalli) se hacían figuras de deidades como Huitzilopochtli para las fiestas. Después de la conquista se suprimió su uso ritual. Hoy sobrevive como la «alegría», dulce típico de los pueblos chinamperos.',
        hist: [
          'El huauhtli aparece en las listas de tributo del Códice Mendoza junto a maíz, frijol y chía.',
          'Durán y Sahagún describen las figuras de tzoalli hechas para las fiestas mexicas.',
        ],
      },
      en: {
        name: 'Amaranth',
        gloss: 'Amaranth',
        fn: 'Grain and greens with high protein. It was also used in ritual.',
        desc: 'Amaranth seed dough (tzoalli) was shaped into figures of deities such as Huitzilopochtli for festivals. After the conquest its ritual use was suppressed. Today it survives as the sweet “alegría”, a speciality of the chinampa towns.',
        hist: [
          'Huauhtli appears in the Codex Mendoza tribute lists next to maize, beans and chia.',
          'Durán and Sahagún both describe tzoalli figures made for Mexica festivals.',
        ],
      },
      zh: {
        name: '苋菜（苋米）',
        gloss: '苋',
        fn: '高蛋白的谷物和蔬菜，也用于祭祀。',
        desc: '人们用苋籽面团（tzoalli）捏成维齐洛波奇特利等神像，在节庆时使用。西班牙征服后，这种祭祀用途被禁止。如今它以甜点“alegría（欢喜糖）”的形式流传下来，是奇南帕村镇的特产。',
        hist: [
          '在《门多萨手抄本》的贡品清单中，苋米与玉米、菜豆、奇亚籽并列出现。',
          '杜兰和萨阿贡都记述了为墨西加节庆制作的 tzoalli 神像。',
        ],
      },
    },
  },

  cempasuchil: {
    view: 'chinampa',
    group: 'crops',
    nahuatl: 'sempowalxochitl',
    classical: 'cempōhualxōchitl',
    t: {
      es: {
        name: 'Cempasúchil',
        gloss: '«Flor de veinte» / flor de muchos pétalos',
        fn: 'Flor ceremonial y medicinal. También aleja algunas plagas del suelo.',
        desc: 'Es la flor del Día de Muertos (Tagetes erecta). Xochimilco, «lugar de la sementera de flores», abastece de flores a la ciudad desde tiempos prehispánicos, y cada otoño sus viveros chinamperos llenan los canales de naranja.',
        hist: ['El Códice Florentino y la historia natural de Francisco Hernández (siglo XVI) la describen entre las flores medicinales y rituales.'],
      },
      en: {
        name: 'Cempasúchil (marigold)',
        gloss: '“Twenty flower” / many-petalled flower',
        fn: 'Ceremonial and medicinal flower. It also repels some soil pests.',
        desc: 'The marigold of the Day of the Dead (Tagetes erecta). Xochimilco, “place of the flower fields”, has supplied flowers to the city since prehispanic times, and every autumn its chinampa nurseries fill the canals with orange.',
        hist: ['The Florentine Codex and Francisco Hernández’s 16th-century natural history describe it among medicinal and ritual flowers.'],
      },
      zh: {
        name: '万寿菊',
        gloss: '“二十之花”/多瓣之花',
        fn: '用于仪式和药用的花卉，还能驱除部分土壤害虫。',
        desc: '这是亡灵节的花（Tagetes erecta）。霍奇米尔科意为“花田之地”，自前西班牙时期起就为城市供应鲜花。每到秋天，奇南帕苗圃的橙色花朵铺满运河。',
        hist: ['《佛罗伦萨手抄本》和弗朗西斯科·埃尔南德斯的16世纪博物志都将其列为药用和仪式用花。'],
      },
    },
  },

  /* ───────────────────────── Life & tools ───────────────────────── */
  hut: {
    view: 'chinampa',
    group: 'life',
    nahuatl: 'kalli',
    classical: 'calli',
    t: {
      es: {
        name: 'Casa (jacal)',
        gloss: 'Casa',
        fn: 'Vivienda y bodega, construida sobre la chinampa o en el frente que da al canal.',
        desc: 'En la ciudad, las familias vivían en sus propias parcelas. La casa miraba al canal o a la calle y las franjas de cultivo se extendían detrás. Las paredes eran de carrizo, adobe o bajareque, y los techos de zacate.',
        hist: ['El Plano en papel de maguey (c. 1560) registra cientos de solares, cada uno con el glifo del nombre de su dueño y sus franjas de chinampa.'],
      },
      en: {
        name: 'Farmer’s house',
        gloss: 'House',
        fn: 'A home and storage, built on the chinampa itself or on the plot facing the canal.',
        desc: 'In the city, families lived on their own plots. The house faced a canal or street and the cultivated strips stretched out behind it. Walls were made of reed, adobe or wattle-and-daub, and roofs were thatched.',
        hist: ['The Maguey Plan (c. 1560) records hundreds of house plots, each with its owner’s name glyph and strips of chinampas.'],
      },
      zh: {
        name: '农舍',
        gloss: '房屋',
        fn: '住所兼仓库，建在奇南帕上或临运河的地块前端。',
        desc: '在城市里，每户人家都住在自己的地块上。房屋朝向运河或街道，耕作的长条田在屋后延伸。墙用芦苇、土坯或抹泥编篱筑成，屋顶覆以茅草。',
        hist: ['《龙舌兰纸地图》（约1560年）记录了数百个宅地，每块都标有主人的名字符号和奇南帕田条。'],
      },
    },
  },

  canoe: {
    view: 'chinampa',
    group: 'life',
    nahuatl: 'akalli',
    classical: 'ācalli',
    t: {
      es: {
        name: 'Canoa',
        gloss: '«Casa de agua» (a- agua + kalli casa)',
        fn: 'Transporte de personas, cosechas, lodo y mercancías por los canales.',
        desc: 'Las canoas de fondo plano, impulsadas con una pértiga, conectaban cada chinampa con la ciudad. Miles de canoas llevaban comida a Tenochtitlan todos los días. Las trajineras de Xochimilco son sus descendientes.',
        hist: ['Cortés (Segunda carta de relación, 1520) y Bernal Díaz describen la enorme cantidad de canoas que movían mercancías por la ciudad.'],
      },
      en: {
        name: 'Canoe',
        gloss: '“Water house” (a- water + kalli house)',
        fn: 'Transport for people, harvests, mud and goods along the canals.',
        desc: 'Flat-bottomed canoes, pushed with a pole, linked every chinampa to the city. Thousands of canoes carried food into Tenochtitlan every day. The trajineras of Xochimilco are their descendants.',
        hist: ['Cortés (Second Letter, 1520) and Bernal Díaz describe the great numbers of canoes moving goods around the city.'],
      },
      zh: {
        name: '独木舟',
        gloss: '“水上之屋”（a- 水 + kalli 房屋）',
        fn: '沿运河运送人员、收获物、淤泥和货物。',
        desc: '用撑篙推动的平底独木舟把每块奇南帕与城市相连。每天有成千上万只独木舟把食物运进特诺奇蒂特兰。霍奇米尔科的彩色游船（trajinera）就是它们的后代。',
        hist: ['科尔特斯在《第二封信》（1520）中、贝尔纳尔·迪亚斯在其记述中，都描写了城中大量运货的独木舟。'],
      },
    },
  },

  farmer: {
    view: 'chinampa',
    group: 'life',
    nahuatl: 'tlalchiwki',
    classical: 'tlālchīuhqui',
    t: {
      es: {
        name: 'Chinampero',
        gloss: '«El que trabaja la tierra»',
        fn: 'Construye, cuida, siembra y cosecha la chinampa, y lleva sus productos al mercado en canoa.',
        desc: 'El trabajo dura todo el año: sacar lodo, renovar la tierra, cortar chapines, trasplantar, deshierbar y cosechar. La tierra se tenía a través del calpolli (barrio), y el saber se transmite de generación en generación.',
        hist: ['El libro 10 del Códice Florentino describe al buen y al mal tlālchīuhqui (labrador).'],
      },
      en: {
        name: 'Chinampa farmer',
        gloss: '“One who works the land”',
        fn: 'Builds, maintains, plants and harvests the chinampa, and takes produce to market by canoe.',
        desc: 'The work runs all year: dredging mud, renewing the soil, cutting chapines, transplanting, weeding and harvesting. Land was held through the calpolli (neighbourhood), and the knowledge passes down through the generations.',
        hist: ['Book 10 of the Florentine Codex describes the good and the bad tlālchīuhqui (farmer).'],
      },
      zh: {
        name: '奇南帕农民',
        gloss: '“耕作土地的人”',
        fn: '建造、维护、播种和收获奇南帕，并划独木舟把农产品运到市场。',
        desc: '工作全年不停：捞淤泥、更新土壤、切泥块苗床、移栽、除草和收获。土地通过卡尔波利（街区）分配，知识则代代相传。',
        hist: ['《佛罗伦萨手抄本》第10卷描述了好的和坏的 tlālchīuhqui（农夫）。'],
      },
    },
  },

  coa: {
    view: 'chinampa',
    group: 'life',
    nahuatl: 'wiktli',
    classical: 'huictli',
    t: {
      es: {
        name: 'Coa',
        gloss: 'Bastón plantador',
        fn: 'Para sembrar, deshierbar y aflojar la tierra.',
        desc: 'Una herramienta larga de madera con la punta aplanada, que se usaba sin animales de tiro. Fue la herramienta principal de la agricultura mesoamericana.',
        hist: ['El Códice Florentino ilustra a campesinos trabajando con la huictli.'],
      },
      en: {
        name: 'Coa (digging stick)',
        gloss: 'Digging stick',
        fn: 'For planting, weeding and breaking up the soil.',
        desc: 'A long wooden tool with a flattened blade, used without draft animals. It was the main hand tool of Mesoamerican farming.',
        hist: ['Farmers using the huictli are illustrated in the Florentine Codex.'],
      },
      zh: {
        name: '掘土棒（科阿）',
        gloss: '掘土棒',
        fn: '用于播种、除草和松土。',
        desc: '一种末端扁平的长木制工具，无需役畜即可使用，是中美洲农业最主要的手工农具。',
        hist: ['《佛罗伦萨手抄本》中绘有农民使用 huictli 劳作的图像。'],
      },
    },
  },

  axolotl: {
    view: 'chinampa',
    group: 'life',
    nahuatl: 'axolotl',
    classical: 'āxōlōtl',
    t: {
      es: {
        name: 'Ajolote',
        gloss: 'Suele traducirse como «monstruo o perro de agua». Se asocia con el dios Xolotl',
        fn: 'Salamandra nativa de los canales. Fue alimento, y hoy indica la salud del ecosistema.',
        desc: 'Ambystoma mexicanum conserva sus branquias de larva toda la vida. En estado silvestre sobrevive casi solo en los canales de Xochimilco, y las chinampas le sirven de refugio. Está en peligro crítico.',
        hist: ['El Códice Florentino de Sahagún (libro 11) describe al axolotl y cómo se comía.'],
      },
      en: {
        name: 'Axolotl',
        gloss: 'Often glossed as “water monster/water dog”. Associated with the god Xolotl',
        fn: 'A native salamander of the canals. It was food, and today it signals the health of the ecosystem.',
        desc: 'Ambystoma mexicanum keeps its larval gills all its life. In the wild it survives almost only in the canals of Xochimilco, and the chinampas act as a refuge for it. It is critically endangered.',
        hist: ['Sahagún’s Florentine Codex (Book 11) describes the axolotl and how it was eaten.'],
      },
      zh: {
        name: '美西螈',
        gloss: '常译作“水怪”或“水狗”，与神祇修洛特尔有关',
        fn: '运河里的本土蝾螈，曾是食物，如今是生态系统健康状况的指标。',
        desc: '美西螈（Ambystoma mexicanum）终生保留幼体的外鳃。野生个体几乎只生存在霍奇米尔科的运河中，奇南帕是它们的避难所。该物种极度濒危。',
        hist: ['萨阿贡的《佛罗伦萨手抄本》第11卷描述了美西螈及其食用方法。'],
      },
    },
  },

  heron: {
    view: 'chinampa',
    group: 'life',
    nahuatl: 'astatl',
    classical: 'āztatl',
    t: {
      es: {
        name: 'Garza',
        gloss: 'Garza',
        fn: 'Parte del ecosistema del lago que el sistema chinampero mantenía vivo.',
        desc: 'Garzas y garcetas cazan en los canales. El nombre Aztlan, la patria mítica de los mexicas, suele interpretarse como «lugar de garzas».',
        hist: ['La garza aparece en el glifo de Aztlan en fuentes como el Códice Boturini (Tira de la Peregrinación).'],
      },
      en: {
        name: 'Heron',
        gloss: 'Heron, egret',
        fn: 'Part of the lake ecosystem that the chinampa system kept alive.',
        desc: 'Egrets and herons hunt in the canals. The name Aztlan, the mythical homeland of the Mexica, is often interpreted as “place of herons”.',
        hist: ['The heron appears in the place glyph of Aztlan in sources such as the Codex Boturini (Tira de la Peregrinación).'],
      },
      zh: {
        name: '鹭',
        gloss: '鹭、白鹭',
        fn: '奇南帕系统所维系的湖泊生态的一部分。',
        desc: '鹭和白鹭在运河中觅食。墨西加人传说中的故乡“阿兹特兰”常被解释为“鹭之地”。',
        hist: ['在《博图里尼手抄本》（迁徙图）等文献中，阿兹特兰的地名符号里画有一只鹭。'],
      },
    },
  },

  /* ───────────────────────── Tenochtitlan ───────────────────────── */
  cityChinampa: {
    view: 'city',
    group: 'city',
    nahuatl: 'chinampan',
    classical: 'chināmpan',
    action: { view: 'chinampa' },
    t: {
      es: {
        name: 'Manzanas de chinampas',
        gloss: '«Sobre las chinampas»',
        fn: 'La unidad básica de la ciudad: franjas de cultivo, cada una con su casa, en una retícula de canales y calles.',
        desc: 'Gran parte de Tenochtitlan creció desde un islote pequeño construyendo chinampas. El resultado fue una retícula ordenada donde muchas calles eran mitad tierra y mitad agua. Daba alimento fresco a una ciudad de unas 150 000 a 250 000 personas (las estimaciones varían).',
        hist: [
          'Cortés, Segunda carta (1520): las calles principales son «la mitad de tierra y por la otra mitad es agua, por la cual andan en sus canoas».',
          'El Plano en papel de maguey muestra la retícula chinampera de un barrio a inicios de la época colonial.',
        ],
        action: 'Explorar una chinampa',
      },
      en: {
        name: 'Chinampa blocks',
        gloss: '“On the chinampas”',
        fn: 'The basic unit of the city: strips of farmland, each with a house, on a grid of canals and streets.',
        desc: 'Large parts of Tenochtitlan grew outward from a small island by building chinampas. The result was an orderly grid where many streets were half earth, half water. It fed a city of roughly 150,000–250,000 people (estimates vary).',
        hist: [
          'Cortés, Second Letter (1520): the main streets are “half of earth and half of water, along which they go in their canoes”.',
          'The Maguey Plan shows the chinampa grid of a city district in the early colonial period.',
        ],
        action: 'Explore one chinampa',
      },
      zh: {
        name: '奇南帕街区',
        gloss: '“在奇南帕之上”',
        fn: '城市的基本单元：每条农田配一座房屋，排列在运河与街道组成的网格中。',
        desc: '特诺奇蒂特兰的大部分城区是通过修建奇南帕从一个小岛向外扩展而成的，形成了整齐的网格，许多街道一半是陆地、一半是水道。它为约15万至25万人口的城市提供新鲜食物（估计数字不一）。',
        hist: [
          '科尔特斯《第二封信》（1520）：主要街道“一半是土地，一半是水，人们乘独木舟往来”。',
          '《龙舌兰纸地图》展示了殖民初期一个城区的奇南帕网格。',
        ],
        action: '探索一块奇南帕',
      },
    },
  },

  focusMarker: {
    view: 'city',
    group: 'city',
    nahuatl: 'chinamitl',
    classical: 'chināmitl',
    action: { view: 'chinampa' },
    t: {
      es: {
        name: 'Tu chinampa',
        gloss: 'Cerco de cañas',
        fn: 'La chinampa que exploraste a detalle en la primera vista.',
        desc: 'Cada una de estas miles de franjas está hecha como la que exploraste: estacas, cerco de carrizo, capas de vegetación y lodo, ahuejotes y cultivos.',
        hist: [],
        action: 'Explorar esta chinampa',
      },
      en: {
        name: 'Your chinampa',
        gloss: 'Cane enclosure',
        fn: 'The single chinampa explored in detail in the first view.',
        desc: 'Each of these thousands of strips is built like the one you explored: stakes, reed fence, layers of vegetation and mud, willows and crops.',
        hist: [],
        action: 'Explore this chinampa',
      },
      zh: {
        name: '你的奇南帕',
        gloss: '芦苇围栏',
        fn: '你在第一个视图中详细探索过的那块奇南帕。',
        desc: '这成千上万条田地，每一条都和你探索过的那块一样：木桩、芦苇编篱、植物与淤泥层、柳树和作物。',
        hist: [],
        action: '探索这块奇南帕',
      },
    },
  },

  calpolli: {
    view: 'city',
    group: 'city',
    nahuatl: 'kalpolli',
    classical: 'calpōlli',
    t: {
      es: {
        name: 'Calpolli (barrio)',
        gloss: '«Casa grande»: barrio o parcialidad',
        fn: 'La unidad social que tenía y repartía la tierra chinampera, organizaba el trabajo y el tributo, y tenía su propio templo y escuela.',
        desc: 'Tenochtitlan se dividía en cuatro grandes parcialidades (Moyotlan, Teopan, Atzacualco y Cuepopan) alrededor del recinto ceremonial. Cada una agrupaba muchos calpolli. Las familias trabajaban sus chinampas bajo la autoridad del calpolli.',
        hist: ['Sahagún, Durán y Zorita describen el papel del calpolli en la tenencia de la tierra.'],
      },
      en: {
        name: 'Calpolli (neighbourhood)',
        gloss: '“Big house”: a ward or neighbourhood',
        fn: 'The social unit that held and distributed chinampa land, organised labour and tribute, and had its own temple and school.',
        desc: 'Tenochtitlan was divided into four great quarters (Moyotlan, Teopan, Atzacualco and Cuepopan) around the ceremonial centre. Each quarter contained many calpolli. Families farmed their chinampas under the calpolli’s authority.',
        hist: ['Sahagún, Durán and Zorita describe the calpolli’s role in land tenure.'],
      },
      zh: {
        name: '卡尔波利（街区）',
        gloss: '“大房子”：街区或氏族社区',
        fn: '持有并分配奇南帕土地、组织劳动和贡赋的社会单位，拥有自己的神庙和学校。',
        desc: '特诺奇蒂特兰以礼仪中心为轴分为四大区（莫约特兰、特奥潘、阿查夸尔科、奎波潘），每区包含许多卡尔波利。各家在卡尔波利的管理下耕种自己的奇南帕。',
        hist: ['萨阿贡、杜兰和索里塔都记述了卡尔波利在土地占有中的作用。'],
      },
    },
  },

  cityCanal: {
    view: 'city',
    group: 'city',
    nahuatl: 'akalojtli',
    classical: 'ācalohtli',
    t: {
      es: {
        name: 'Canales de la ciudad',
        gloss: '«Camino de canoas»',
        fn: 'Las calles de una ciudad de agua: transporte, drenaje y límite entre parcelas.',
        desc: 'Canales principales cruzaban la isla y se unían al lago, y otros más chicos corrían entre cada pocas chinampas. Puentes, muchas veces removibles, cruzaban las calles.',
        hist: ['Bernal Díaz comparó la vista de la ciudad sobre el agua con «las cosas de encantamiento que cuentan en el libro de Amadís».'],
      },
      en: {
        name: 'City canals',
        gloss: '“Canoe road”',
        fn: 'The streets of a water city: transport, drainage and the boundaries between plots.',
        desc: 'Main canals crossed the island and joined the lake, and smaller ones ran between every few chinampas. Bridges, often removable, crossed the streets.',
        hist: ['Bernal Díaz compared the view of the city on the water to “the enchantments told in the book of Amadís”.'],
      },
      zh: {
        name: '城市运河',
        gloss: '“独木舟之路”',
        fn: '水上城市的街道：用于交通、排水，也是地块之间的分界。',
        desc: '主运河横贯全岛并与湖相连，较小的运河每隔几块奇南帕就有一条。桥梁（常常可以拆卸）横跨街道。',
        hist: ['贝尔纳尔·迪亚斯把这座水上城市的景象比作“《阿马迪斯》书中所讲的魔法奇景”。'],
      },
    },
  },

  temploMayor: {
    view: 'city',
    group: 'city',
    nahuatl: 'Weyi Teokalli',
    classical: 'Huēyi Teōcalli',
    t: {
      es: {
        name: 'Templo Mayor',
        gloss: '«Gran casa de los dioses»',
        fn: 'El centro ritual de la ciudad y el eje de sus cuatro parcialidades.',
        desc: 'Una pirámide doble con adoratorios a Tlaloc (lluvia y agua, azul) y a Huitzilopochtli (guerra y sol, rojo). El adoratorio de Tlaloc recuerda que el agua y la agricultura eran sagradas para la ciudad. El templo se reconstruyó en unas siete etapas.',
        hist: ['Según la tradición, la ciudad se fundó en 1325. El templo fue destruido en 1521. Su excavación sistemática empezó en 1978, tras el hallazgo de la piedra de Coyolxauhqui.'],
      },
      en: {
        name: 'Templo Mayor',
        gloss: '“Great house of the gods”',
        fn: 'The ritual centre of the city and the axis of its four quarters.',
        desc: 'A twin pyramid with shrines to Tlaloc (rain and water, blue) and Huitzilopochtli (war and sun, red). Tlaloc’s shrine is a reminder that water and farming were sacred to the city. The temple was rebuilt in about seven stages.',
        hist: ['By tradition the city was founded in 1325. The temple was destroyed in 1521. Systematic excavation began in 1978, after the discovery of the Coyolxauhqui stone.'],
      },
      zh: {
        name: '大神庙',
        gloss: '“众神的大殿”',
        fn: '城市的宗教中心，也是四大区的中轴。',
        desc: '一座双塔金字塔，分别供奉特拉洛克（雨水之神，蓝色）和维齐洛波奇特利（战争与太阳之神，红色）。特拉洛克神殿提醒人们，水与农业对这座城市来说是神圣的。神庙前后约经历了七次重建。',
        hist: ['据传城市建于1325年，神庙毁于1521年。1978年发现科约尔沙乌基石后，系统发掘随即展开。'],
      },
    },
  },

  causeway: {
    view: 'city',
    group: 'city',
    nahuatl: 'ojtli',
    classical: 'ōhtli',
    t: {
      es: {
        name: 'Calzadas',
        gloss: 'Camino',
        fn: 'Caminos elevados que unían la isla con la orilla: Tepeyac (norte), Tlacopan (poniente) e Iztapalapa (sur).',
        desc: 'Las calzadas también funcionaban como diques que regulaban el nivel del agua. Tenían aberturas con puentes removibles para dejar pasar canoas y agua.',
        hist: ['Cortés entró a Tenochtitlan el 8 de noviembre de 1519 por la calzada de Iztapalapa, donde lo recibió Moctezuma.'],
      },
      en: {
        name: 'Causeways',
        gloss: 'Road, path',
        fn: 'Raised roads linking the island to the shore: Tepeyac (north), Tlacopan (west) and Iztapalapa (south).',
        desc: 'The causeways also worked as dikes that controlled water levels. Openings with removable bridges let canoes and water pass.',
        hist: ['Cortés entered Tenochtitlan on 8 November 1519 along the Iztapalapa causeway, where he was met by Moctezuma.'],
      },
      zh: {
        name: '堤道',
        gloss: '道路',
        fn: '连接小岛与湖岸的高架道路：特佩亚克（北）、特拉科潘（西）和伊斯塔帕拉帕（南）。',
        desc: '堤道同时也是调节水位的堤坝。堤上留有开口，架设可拆卸的桥梁，让独木舟和水流通过。',
        hist: ['1519年11月8日，科尔特斯沿伊斯塔帕拉帕堤道进入特诺奇蒂特兰，蒙特祖马在那里迎接他。'],
      },
    },
  },

  albarradon: {
    view: 'city',
    group: 'city',
    nahuatl: 'tepantli',
    classical: 'tepāntli',
    t: {
      es: {
        name: 'Albarradón de Nezahualcóyotl',
        gloss: 'Muro',
        fn: 'Separaba el agua salada del lago oriental del agua más dulce que rodeaba la ciudad y la protegía de inundaciones.',
        desc: 'Este dique de estacas, piedra y tierra cruzaba el lago por unos 16 km. Mantenía el agua más dulce en la laguna occidental, que era la que necesitaban los cultivos de las chinampas.',
        hist: ['Se construyó hacia 1449, bajo la dirección de Nezahualcóyotl de Texcoco, después de una gran inundación.'],
      },
      en: {
        name: 'Dike of Nezahualcóyotl',
        gloss: 'Wall',
        fn: 'It separated the salty eastern lake from the fresher water around the city and protected it from floods.',
        desc: 'This dike of stakes, stone and earth crossed the lake for roughly 16 km. It kept fresher water in the western lagoon, which the chinampa crops needed.',
        hist: ['Built around 1449 under the direction of Nezahualcóyotl of Texcoco after a severe flood.'],
      },
      zh: {
        name: '内萨瓦尔科约特尔大堤',
        gloss: '墙',
        fn: '把东部的咸水湖与城市周围较淡的湖水隔开，并保护城市免受洪水侵袭。',
        desc: '这道由木桩、石块和泥土筑成的堤坝横跨湖面约16公里，使西侧湖区保持奇南帕作物所需的淡水。',
        hist: ['约1449年一场大洪水之后，在特斯科科的内萨瓦尔科约特尔主持下修建。'],
      },
    },
  },

  aqueduct: {
    view: 'city',
    group: 'city',
    nahuatl: 'Chapoltepek apantli',
    classical: 'Chapoltepēc āpantli',
    t: {
      es: {
        name: 'Acueducto de Chapultepec',
        gloss: 'Canal de agua de Chapultepec («cerro del chapulín»)',
        fn: 'Traía agua de manantial de Chapultepec a la isla para beber.',
        desc: 'El agua del lago era salobre en algunas zonas, así que la ciudad dependía de los manantiales. El acueducto tenía dos caños: mientras se limpiaba uno, el otro seguía llevando agua.',
        hist: ['Se construyó a mediados del siglo XV. Cortés describe el doble caño en su Segunda carta (1520).'],
      },
      en: {
        name: 'Chapultepec aqueduct',
        gloss: 'Water channel of Chapultepec (“grasshopper hill”)',
        fn: 'It brought spring water from Chapultepec to the island for drinking.',
        desc: 'Lake water was brackish in places, so the city depended on springs. The aqueduct had a double channel: while one was cleaned, the other kept carrying water.',
        hist: ['Built in the mid-15th century. Cortés describes the double channel in his Second Letter (1520).'],
      },
      zh: {
        name: '查普尔特佩克引水渠',
        gloss: '查普尔特佩克（“蚱蜢山”）的水道',
        fn: '把查普尔特佩克的泉水引到岛上供饮用。',
        desc: '部分湖水带咸味，城市因此依赖泉水。引水渠有两条水槽：清理其中一条时，另一条继续输水。',
        hist: ['建于15世纪中叶。科尔特斯在《第二封信》（1520）中描述了这条双槽引水渠。'],
      },
    },
  },

  lake: {
    view: 'city',
    group: 'city',
    nahuatl: 'Tetskoko · Mestliapan',
    classical: 'Tetzcoco · Mētztliāpan',
    t: {
      es: {
        name: 'Lago de Texcoco',
        gloss: 'Mētztliāpan suele traducirse como «lago de la luna»',
        fn: 'El cuerpo de agua que hizo posibles la agricultura chinampera, el transporte y la ciudad isla.',
        desc: 'La Cuenca de México tenía una cadena de lagos conectados: Zumpango, Xaltocan, Texcoco, Xochimilco y Chalco. Los del sur eran de agua dulce y los mejores para chinampas. Las obras de desagüe coloniales y modernas secaron casi todo el sistema.',
        hist: ['El Códice Mendoza abre con la fundación de Tenochtitlan en un islote, donde un águila se posó sobre un nopal.'],
      },
      en: {
        name: 'Lake Texcoco',
        gloss: 'Mētztliāpan is often given as “lake of the moon”',
        fn: 'The body of water that made chinampa farming, transport and the island city possible.',
        desc: 'The Basin of Mexico held a chain of connected lakes: Zumpango, Xaltocan, Texcoco, Xochimilco and Chalco. The southern lakes were fresh and the best for chinampas. Colonial and modern drainage projects later dried most of the system.',
        hist: ['The Codex Mendoza opens with the founding of Tenochtitlan on an island, where an eagle perched on a cactus.'],
      },
      zh: {
        name: '特斯科科湖',
        gloss: 'Mētztliāpan 常被译为“月亮之湖”',
        fn: '使奇南帕农业、水上交通和岛上城市成为可能的水体。',
        desc: '墨西哥盆地曾有一串相连的湖泊：孙潘戈、哈尔托坎、特斯科科、霍奇米尔科和查尔科。南部湖泊是淡水，最适合修建奇南帕。殖民时期和现代的排水工程后来使整个湖系几乎干涸。',
        hist: ['《门多萨手抄本》开篇描绘了特诺奇蒂特兰在一座小岛上建城：一只鹰落在仙人掌上。'],
      },
    },
  },
};

// Layers used by the exploded and axonometric views (bottom → top).
export const LAYERS = [
  { key: 'bed', id: 'canal', nahuatl: 'atl', name: { es: 'Fondo del lago y agua', en: 'Lake bed & water', zh: '湖底与水' } },
  { key: 'frame', id: 'stakes', nahuatl: 'kwawitl · chinamitl', name: { es: 'Estacas y cerco', en: 'Stakes & reed fence', zh: '木桩与芦苇篱' } },
  { key: 'mat1', id: 'reedMat', nahuatl: 'tolin', name: { es: 'Capa de tule', en: 'Vegetation mat', zh: '水生植物层' } },
  { key: 'mud1', id: 'mud', nahuatl: 'sokitl', name: { es: 'Lodo', en: 'Lake mud', zh: '淤泥' } },
  { key: 'mat2', id: 'reedMat', nahuatl: 'tolin', name: { es: 'Capa de tule', en: 'Vegetation mat', zh: '水生植物层' } },
  { key: 'mud2', id: 'mud', nahuatl: 'sokitl', name: { es: 'Lodo', en: 'Lake mud', zh: '淤泥' } },
  { key: 'soil', id: 'topsoil', nahuatl: 'tlalli', name: { es: 'Tierra y composta', en: 'Topsoil & compost', zh: '表土与堆肥' } },
  { key: 'crops', id: 'maize', nahuatl: 'xinachtli · milli', name: { es: 'Almácigo y cultivos', en: 'Seedbed & crops', zh: '苗床与作物' } },
  { key: 'life', id: 'ahuejote', nahuatl: 'awexotl · kalli', name: { es: 'Ahuejotes y casa', en: 'Willows & house', zh: '柳树与农舍' } },
];
