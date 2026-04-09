import { crearMazo, repartirCartas } from './mazo.js'
import { compararCartas } from './jerarquia.js'
import { calcularEnvido } from './envido.js'

export function nuevaPartida() {
  const mazo = crearMazo()
  const { cartasJugador, cartasIA } = repartirCartas(mazo)

  return {
    cartasJugador,
    cartasIA,
    cartasJugadasJugador: [],
    cartasJugadasIA: [],
    turno: 'jugador',
    manoActual: 1,
    resultadoManos: [],
    puntosJugador: 0,
    puntosIA: 0,
    estadoTruco: null,
    estadoEnvido: null,
    ganadorPartida: null,
    mensaje: 'Tu turno. Elegí una carta para jugar.'
  }
}

export function jugarCarta(estado, cartaElegida) {
  if (estado.turno !== 'jugador') return estado

  const nuevasCartas = estado.cartasJugador.filter(
    c => !(c.valor === cartaElegida.valor && c.palo === cartaElegida.palo)
  )

  const cartaIA = elegirCartaIA(estado.cartasIA, estado)
  const nuevasCartasIA = estado.cartasIA.filter(
    c => !(c.valor === cartaIA.valor && c.palo === cartaIA.palo)
  )

  const resultado = compararCartas(cartaElegida, cartaIA)
  let ganadorMano = null
  let mensaje = ''

  if (resultado === 1) {
    ganadorMano = 'jugador'
    mensaje = `Ganaste la mano con ${cartaElegida.valor} de ${cartaElegida.palo}`
  } else if (resultado === -1) {
    ganadorMano = 'ia'
    mensaje = `La IA ganó la mano con ${cartaIA.valor} de ${cartaIA.palo}`
  } else {
    ganadorMano = 'parda'
    mensaje = `Parda! ${cartaElegida.valor} de ${cartaElegida.palo} vs ${cartaIA.valor} de ${cartaIA.palo}`
  }

  const nuevosResultados = [...estado.resultadoManos, ganadorMano]
  const ganadorRonda = evaluarRonda(nuevosResultados)

  let puntosJugador = estado.puntosJugador
  let puntosIA = estado.puntosIA
  let ganadorPartida = null

  if (ganadorRonda === 'jugador') {
    puntosJugador += 1
    mensaje += ' — Ganaste la ronda!'
  } else if (ganadorRonda === 'ia') {
    puntosIA += 1
    mensaje += ' — La IA ganó la ronda!'
  }

  if (puntosJugador >= 15) ganadorPartida = 'jugador'
  if (puntosIA >= 15) ganadorPartida = 'ia'

  return {
    ...estado,
    cartasJugador: nuevasCartas,
    cartasIA: nuevasCartasIA,
    cartasJugadasJugador: [...estado.cartasJugadasJugador, cartaElegida],
    cartasJugadasIA: [...estado.cartasJugadasIA, cartaIA],
    resultadoManos: nuevosResultados,
    puntosJugador,
    puntosIA,
    ganadorPartida,
    mensaje,
    turno: 'jugador'
  }
}

function elegirCartaIA(cartasIA) {
  const idx = Math.floor(Math.random() * cartasIA.length)
  return cartasIA[idx]
}

function evaluarRonda(resultados) {
  const ganoJugador = resultados.filter(r => r === 'jugador').length
  const ganoIA = resultados.filter(r => r === 'ia').length

  if (ganoJugador >= 2) return 'jugador'
  if (ganoIA >= 2) return 'ia'
  if (resultados.length === 3) {
    if (ganoJugador > ganoIA) return 'jugador'
    if (ganoIA > ganoJugador) return 'ia'
    return 'empate'
  }
  return null
}

export function obtenerEnvido(estado) {
  return {
    jugador: calcularEnvido(estado.cartasJugador),
    ia: calcularEnvido(estado.cartasIA)
  }
}