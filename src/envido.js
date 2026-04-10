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
  let mejor = 0
  for (const palo in porPalo) {
    const vals = porPalo[palo].sort((a, b) => b - a)
    const puntaje = vals.length >= 2 ? 20 + vals[0] + vals[1] : vals[0]
    if (puntaje > mejor) mejor = puntaje
  }
  return mejor
}

export function proximosCantos(secuencia) {
  const cantos = secuencia.filter(c => c !== 'jugador' && c !== 'ia')
  const ultimo = cantos[cantos.length - 1]
  if (!ultimo) return ['envido', 'realEnvido', 'faltaEnvido']
  if (ultimo === 'envido') return ['envido2', 'realEnvido', 'faltaEnvido']
  if (ultimo === 'envido2') return ['realEnvido', 'faltaEnvido']
  if (ultimo === 'realEnvido') return ['faltaEnvido']
  return []
}

export function nombreCanto(canto) {
  const nombres = {
    envido: 'Envido',
    envido2: 'Envido',
    realEnvido: 'Real Envido',
    faltaEnvido: 'Falta Envido',
  }
  return nombres[canto] || canto
}

export function calcularPuntosNoQuiero(secuencia) {
  const cantos = secuencia.filter(c => c !== 'jugador' && c !== 'ia')
  if (cantos.length === 0) return 0
  if (cantos.length === 1) return 1
  const tabla = { envido: 2, envido2: 2, realEnvido: 3 }
  return cantos.slice(0, -1).reduce((total, c) => total + (tabla[c] || 0), 0)
}

export function calcularPuntosQuiero(secuencia, puntosJugador, puntosIA) {
  const cantos = secuencia.filter(c => c !== 'jugador' && c !== 'ia')
  if (cantos.length === 0) return 0
  const ultimo = cantos[cantos.length - 1]
  if (ultimo === 'faltaEnvido') {
    const maxPuntos = Math.max(puntosJugador, puntosIA)
    return 30 - maxPuntos
  }
  const tabla = { envido: 2, envido2: 2, realEnvido: 3 }
  return cantos.reduce((total, c) => total + (tabla[c] || 0), 0)
}