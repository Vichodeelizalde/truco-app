export const palos = ['espada', 'basto', 'copa', 'oro']

export const valores = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]

export function crearMazo() {
  const mazo = []
  for (const palo of palos) {
    for (const valor of valores) {
      mazo.push({ palo, valor })
    }
  }
  return mazo
}

export function mezclarMazo(mazo) {
  const m = [...mazo]
  for (let i = m.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[m[i], m[j]] = [m[j], m[i]]
  }
  return m
}

export function repartirCartas(mazo) {
  const mezclado = mezclarMazo(mazo)
  return {
    cartasJugador: mezclado.slice(0, 3),
    cartasIA: mezclado.slice(3, 6),
    resto: mezclado.slice(6)
  }
}