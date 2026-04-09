export const jerarquiaTruco = [
  { valor: 1, palo: 'espada' },   // 1° - la más fuerte
  { valor: 1, palo: 'basto' },    // 2°
  { valor: 7, palo: 'espada' },   // 3°
  { valor: 7, palo: 'oro' },      // 4°
  { valor: 3, palo: 'espada' },   // 5°
  { valor: 3, palo: 'basto' },    // 6°
  { valor: 3, palo: 'copa' },     // 7°
  { valor: 3, palo: 'oro' },      // 8°
  { valor: 2, palo: 'espada' },   // 9°
  { valor: 2, palo: 'basto' },    // 10°
  { valor: 2, palo: 'copa' },     // 11°
  { valor: 2, palo: 'oro' },      // 12°
  { valor: 1, palo: 'copa' },     // 13°
  { valor: 1, palo: 'oro' },      // 14°
  { valor: 12, palo: 'espada' },  // 15°
  { valor: 12, palo: 'basto' },   // 16°
  { valor: 12, palo: 'copa' },    // 17°
  { valor: 12, palo: 'oro' },     // 18°
  { valor: 11, palo: 'espada' },  // 19°
  { valor: 11, palo: 'basto' },   // 20°
  { valor: 11, palo: 'copa' },    // 21°
  { valor: 11, palo: 'oro' },     // 22°
  { valor: 10, palo: 'espada' },  // 23°
  { valor: 10, palo: 'basto' },   // 24°
  { valor: 10, palo: 'copa' },    // 25°
  { valor: 10, palo: 'oro' },     // 26°
  { valor: 7, palo: 'basto' },    // 27°
  { valor: 7, palo: 'copa' },     // 28°
  { valor: 6, palo: 'espada' },   // 29°
  { valor: 6, palo: 'basto' },    // 30°
  { valor: 6, palo: 'copa' },     // 31°
  { valor: 6, palo: 'oro' },      // 32°
  { valor: 5, palo: 'espada' },   // 33°
  { valor: 5, palo: 'basto' },    // 34°
  { valor: 5, palo: 'copa' },     // 35°
  { valor: 5, palo: 'oro' },      // 36°
  { valor: 4, palo: 'espada' },   // 37°
  { valor: 4, palo: 'basto' },    // 38°
  { valor: 4, palo: 'copa' },     // 39°
  { valor: 4, palo: 'oro' },      // 40° - la más débil
]

export function getPoder(carta) {
  const pos = jerarquiaTruco.findIndex(
    c => c.valor === carta.valor && c.palo === carta.palo
  )
  return 40 - pos
}

export function compararCartas(carta1, carta2) {
  const p1 = getPoder(carta1)
  const p2 = getPoder(carta2)
  if (p1 > p2) return 1   // gana carta1
  if (p2 > p1) return -1  // gana carta2
  return 0                 // empate (parda)
}