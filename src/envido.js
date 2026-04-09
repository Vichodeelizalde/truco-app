export function getValorEnvido(carta) {
  if (carta.valor >= 10) return 0
  return carta.valor
}

export function calcularEnvido(cartas) {
  const porPalo = {}
  for (const carta of cartas) {
    if (!porPalo[carta.palo]) porPalo[carta.palo] = []
    porPalo[carta.palo].push(getValorEnvido(carta))
  }

  let mejorPuntaje = 0

  for (const palo in porPalo) {
    const vals = porPalo[palo].sort((a, b) => b - a)
    let puntaje = 0

    if (vals.length >= 2) {
      puntaje = 20 + vals[0] + vals[1]
    } else {
      puntaje = vals[0]
    }

    if (puntaje > mejorPuntaje) mejorPuntaje = puntaje
  }

  return mejorPuntaje
}

export function compararEnvido(cartasJ1, cartasJ2) {
  const p1 = calcularEnvido(cartasJ1)
  const p2 = calcularEnvido(cartasJ2)
  if (p1 > p2) return { ganador: 'jugador1', puntaje1: p1, puntaje2: p2 }
  if (p2 > p1) return { ganador: 'jugador2', puntaje1: p1, puntaje2: p2 }
  return { ganador: 'empate', puntaje1: p1, puntaje2: p2 }
}