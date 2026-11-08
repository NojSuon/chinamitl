# Chinamitl · Explorador de chinampas

Un sitio interactivo en 3D (low poly, three.js) para explorar una **chinampa**, la técnica agrícola de los lagos de la Cuenca de México, y ver cómo miles de chinampas formaron los bloques de **Mexiko-Tenochtitlan**. Un proyecto con la identidad de **Mati Mati**.

Idiomas: **español** (principal), English y 中文.

## Vistas

| Vista | Qué muestra |
| --- | --- |
| **Chinampa** | Una chinampa completa: estacas, cerco de carrizo, capas de tule y lodo, tierra, almácigo con chapines, milpa, chile, jitomate, amaranto, cempasúchil, ahuejotes, casa, canoa, ajolote y garza. El control «Separar capas» abre la chinampa por capas. |
| **Plano por capas** | Vista axonométrica (isométrica, ortográfica) con las 9 capas separadas y rotuladas. Recorre las capas una a una con ◀ ▶ (o con `[` y `]`) y gira el plano 90° con ⟲ ⟳. |
| **Tenochtitlan** | La isla como una retícula de manzanas de chinampas con casas, canales, el Templo Mayor, las calzadas, el albarradón de Nezahualcóyotl y el acueducto de Chapultepec. El marcador morado señala «tu chinampa». |

Toca cualquier elemento para ver su nombre, su **nombre en náhuatl** (ortografía práctica / tlajkuilolpamitl, con la grafía clásica al lado), su función principal, una descripción y referencias históricas.

**Física de movimiento:** cuando giras o mueves la escena, los árboles, cultivos, la canoa y el agua reaccionan con inercia (resortes amortiguados) y luego se asientan. Se puede apagar desde la barra inferior.

## Controles

- Arrastrar: girar · Clic derecho / dos dedos: mover · Rueda / pellizco: acercar o alejar
- Doble clic en un elemento: acercar la cámara a él
- Flechas del teclado: mover · `R`: reiniciar vista

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Estructura

- `src/data.js`: contenido trilingüe de cada elemento y de las capas
- `src/i18n.js`: textos de la interfaz (es / en / zh)
- `src/chinampa.js`: modelo low poly de la chinampa, por capas
- `src/city.js`: Tenochtitlan como retícula de chinampas
- `src/physics.js`: inercia de plantas, canoa y agua
- `src/main.js`: escena, cámaras, selección, modos y UI
- `public/`: logotipo de Mati Mati (versión Petróleo)

## Notas sobre el contenido

Las palabras en náhuatl y los datos culturales deben validarse con hablantes y fuentes de referencia antes de publicar, como indica el manual de Mati Mati. Las cifras históricas (población, extensión, fechas) son estimaciones y se presentan como tales.
