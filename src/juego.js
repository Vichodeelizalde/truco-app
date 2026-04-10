import { crearMazo, repartirCartas } from './mazo.js'
import { compararCartas } from './jerarquia.js'
import {
  calcularEnvido,
  calcularPuntosQuiero,
  calcularPuntosNoQuiero,
  proximosCantos,
} from './envido.js'

function estadoInicial(cartasJugador, cartasIA, puntosJugador, puntosIA, manoActual) {
  return {
    cartasJugador,
    cartasIA,
    cartasJugadasJugador: [],
    cartasJugadasIA: [],
    turnoMano: 'jugador',
    resultadoManos: [],
    puntosJugador,
    puntosIA,
    manoActual,
    ganadorPartida: null,
    mensaje: 'Tu turno. Jugá una carta o cantá.',
    secuenciaEnvido: [],
    estadoEnvido: null,
    envidoYaJugado: false,
    mostrarResultadoEnvido: false,
    puntosEnvidoJugador: 0,
    puntosEnvidoIA: 0,
    ganadorEnvido: null,
    esperandoRespuestaEnvido: false,
    nivelTruco: 0,
    estadoTruco: null,
    trucoCantadoPor: null,
    esperandoRespuestaTruco: false,
  }
}

export function nuevaPartida() {
  const mazo = crearMazo()
  const { cartasJugador, cartasIA } = repartirCartas(mazo)
  return estadoInicial(cartasJugador, cartasIA, 0, 0, 1)
}

function nuevaMano(estado) {
  const mazo = crearMazo()
  const { cartasJugador, cartasIA } = repartirCartas(mazo)
  return estadoInicial(
    cartasJugador,
    cartasIA,
    estado.puntosJugador,
    estado.puntosIA,
    estado.manoActual + 1
  )
}

export function jugarCarta(estado, cartaElegida) {
  if (estado.esperandoRespuestaEnvido || estado.esperandoRespuestaTruco) return estado

  const nuevasCartasJugador = estado.cartasJugador.filter(
    c => !(c.valor === cartaElegida.valor && c.palo === cartaElegida.palo)
  )
  const cartaIA = elegirCartaIA(estado.cartasIA)
  const nuevasCartasIA = estado.cartasIA.filter(
    c => !(c.valor === cartaIA.valor && c.palo === cartaIA.palo)
  )

  const resultado = compararCartas(cartaElegida, cartaIA)
  let ganadorMano = null
  let mensaje = ''

  if (resultado === 1) {
    ganadorMano = 'jugador'
    mensaje = `Ganaste la mano: ${cartaElegida.valor} de ${cartaElegida.palo} vs ${cartaIA.valor} de ${cartaIA.palo}`
  } else if (resultado === -1) {
    ganadorMano = 'ia'
    mensaje = `La IA ganó la mano: ${cartaIA.valor} de ${cartaIA.palo} vs ${cartaElegida.valor} de ${cartaElegida.palo}`
  } else {
    ganadorMano = 'parda'
    mensaje = `Parda! ${cartaElegida.valor} de ${cartaElegida.palo} vs ${cartaIA.valor} de ${cartaIA.palo}`
  }

  let nuevoTurno = estado.turnoMano
  if (ganadorMano === 'jugador') nuevoTurno = 'jugador'
  else if (ganadorMano === 'ia') nuevoTurno = 'ia'

  const nuevosResultados = [...estado.resultadoManos, ganadorMano]
  const ganadorRonda = evaluarRonda(nuevosResultados)

  let puntosJugador = estado.puntosJugador
  let puntosIA = estado.puntosIA
  let ganadorPartida = null

  if (ganadorRonda === 'jugador') {
    const puntos = puntosRonda(estado.nivelTruco, estado.estadoTruco)
    puntosJugador += puntos
    mensaje += ` — Ganaste la ronda! +${puntos} punto(s)`
  } else if (ganadorRonda === 'ia') {
    const puntos = puntosRonda(estado.nivelTruco, estado.estadoTruco)
    puntosIA += puntos
    mensaje += ` — La IA ganó la ronda! +${puntos} punto(s)`
  }

  if (puntosJugador >= 30) ganadorPartida = 'jugador'
  if (puntosIA >= 30) ganadorPartida = 'ia'

  const nuevoEstado = {
    ...estado,
    cartasJugador: nuevasCartasJugador,
    cartasIA: nuevasCartasIA,
    cartasJugadasJugador: [...estado.cartasJugadasJugador, cartaElegida],
    cartasJugadasIA: [...estado.cartasJugadasIA, cartaIA],
    resultadoManos: nuevosResultados,
    turnoMano: nuevoTurno,
    puntosJugador,
    puntosIA,
    ganadorPartida,
    mensaje,
    envidoYaJugado: true,
  }

  if (ganadorRonda && !ganadorPartida) return nuevaMano(nuevoEstado)
  return nuevoEstado
}

export function cantarEnvidoJugador(estado, canto) {
  if (estado.envidoYaJugado) return estado
  if (estado.estadoTruco === 'aceptado') return estado
  const nuevaSecuencia = [...estado.secuenciaEnvido, 'jugador', canto]
  return respuestaIAEnvido(estado, nuevaSecuencia)
}

export function responderEnvidoJugador(estado, respuesta) {
  if (respuesta === 'noQuiero') {
    return resolverEnvido(estado, estado.secuenciaEnvido, 'noQuiero', 'jugador')
  }
  if (respuesta === 'quiero') {
    return resolverEnvido(estado, estado.secuenciaEnvido, 'quiero')
  }
  const nuevaSecuencia = [...estado.secuenciaEnvido, 'jugador', respuesta]
  return respuestaIAEnvido(estado, nuevaSecuencia)
}

function respuestaIAEnvido(estado, secuencia) {
  const puntosIA = calcularEnvido(estado.cartasIA)
  const siguientes = proximosCantos(secuencia)
  const dado = Math.random()

  if (puntosIA >= 28) {
    if (siguientes.length > 0 && dado < 0.5) {
      const subida = siguientes[siguientes.length - 1]
      const nuevaSecuencia = [...secuencia, 'ia', subida]
      return {
        ...estado,
        secuenciaEnvido: nuevaSecuencia,
        estadoEnvido: 'esperando',
        esperandoRespuestaEnvido: true,
        mensaje: `La IA sube a ${nombreCantoInterno(subida)}. ¿Qué hacés?`,
      }
    }
    return resolverEnvido(estado, secuencia, 'quiero')
  }

  if (puntosIA >= 22) {
    if (dado < 0.5) return resolverEnvido(estado, secuencia, 'quiero')
    return resolverEnvido(estado, secuencia, 'noQuiero', 'ia')
  }

  if (dado < 0.15) return resolverEnvido(estado, secuencia, 'quiero')
  return resolverEnvido(estado, secuencia, 'noQuiero', 'ia')
}

function resolverEnvido(estado, secuencia, decision, quienNoQuiso = 'ia') {
  const puntosJ = calcularEnvido(estado.cartasJugador)
  const puntosI = calcularEnvido(estado.cartasIA)

  let puntosJugador = estado.puntosJugador
  let puntosIA = estado.puntosIA
  let ganadorEnvido = null
  let puntosGanados = 0

  if (decision === 'noQuiero') {
    puntosGanados = calcularPuntosNoQuiero(secuencia)
    if (quienNoQuiso === 'ia') {
      ganadorEnvido = 'jugador'
      puntosJugador += puntosGanados
    } else {
      ganadorEnvido = 'ia'
      puntosIA += puntosGanados
    }
  } else {
    puntosGanados = calcularPuntosQuiero(secuencia, estado.puntosJugador, estado.puntosIA)
    if (puntosJ > puntosI) {
      ganadorEnvido = 'jugador'
      puntosJugador += puntosGanados
    } else if (puntosI > puntosJ) {
      ganadorEnvido = 'ia'
      puntosIA += puntosGanados
    } else {
      ganadorEnvido = 'empate'
      puntosJugador += puntosGanados
    }
  }

  let ganadorPartida = null
  if (puntosJugador >= 30) ganadorPartida = 'jugador'
  if (puntosIA >= 30) ganadorPartida = 'ia'

  const msg =
    ganadorEnvido === 'jugador' ? `Ganaste el envido! +${puntosGanados} punto(s)` :
    ganadorEnvido === 'ia'      ? `La IA ganó el envido! +${puntosGanados} punto(s)` :
                                  `Empate en el envido! +${puntosGanados} punto(s)`

  return {
    ...estado,
    secuenciaEnvido: secuencia,
    estadoEnvido: 'resuelto',
    envidoYaJugado: true,
    esperandoRespuestaEnvido: false,
    puntosEnvidoJugador: puntosJ,
    puntosEnvidoIA: puntosI,
    ganadorEnvido,
    mostrarResultadoEnvido: decision === 'quiero',
    puntosJugador,
    puntosIA,
    ganadorPartida,
    mensaje: msg,
  }
}

export function cantarTrucoJugador(estado, nivel) {
  if (estado.estadoTruco === 'resuelto' || estado.estadoTruco === 'aceptado') return estado
  return respuestaIATruco(estado, nivel, 'jugador')
}

export function responderTrucoJugador(estado, respuesta) {
  if (respuesta === 'noQuiero') {
    const puntosGanados = estado.nivelTruco === 1 ? 1 : estado.nivelTruco === 2 ? 2 : 3
    const puntosIA = estado.puntosIA + puntosGanados
    let ganadorPartida = null
    if (puntosIA >= 30) ganadorPartida = 'ia'
    const base = {
      ...estado,
      estadoTruco: 'resuelto',
      esperandoRespuestaTruco: false,
      puntosIA,
      ganadorPartida,
      mensaje: `No quisiste el truco. La IA gana +${puntosGanados} punto(s)`,
    }
    if (!ganadorPartida) return nuevaMano(base)
    return base
  }

  if (respuesta === 'quiero') {
    return {
      ...estado,
      estadoTruco: 'aceptado',
      esperandoRespuestaTruco: false,
      envidoYaJugado: true,
      mensaje: 'Quisiste el truco! Seguimos jugando.',
    }
  }

  const subida = estado.nivelTruco + 1
  return respuestaIATruco({ ...estado, nivelTruco: subida }, subida, 'jugador')
}

function respuestaIATruco(estado, nivel, cantadoPor) {
  const dado = Math.random()
  const poderIA = Math.max(...estado.cartasIA.map(c => c.valor))
  const tieneCartasBuenas = poderIA >= 7

  if (tieneCartasBuenas || dado < 0.3) {
    if (nivel < 3 && dado < 0.35) {
      const subida = nivel + 1
      return {
        ...estado,
        nivelTruco: subida,
        estadoTruco: 'cantado',
        trucoCantadoPor: 'ia',
        esperandoRespuestaTruco: true,
        mensaje: subida === 2 ? 'La IA canta Retruco! ¿Querés?' : 'La IA canta Vale Cuatro! ¿Querés?',
      }
    }
    return {
      ...estado,
      nivelTruco: nivel,
      estadoTruco: 'aceptado',
      trucoCantadoPor: cantadoPor,
      esperandoRespuestaTruco: false,
      envidoYaJugado: true,
      mensaje: 'La IA quiere el truco! Seguimos jugando.',
    }
  }

  const puntosGanados = nivel === 1 ? 1 : nivel === 2 ? 2 : 3
  const puntosJugador = estado.puntosJugador + puntosGanados
  let ganadorPartida = null
  if (puntosJugador >= 30) ganadorPartida = 'jugador'
  const base = {
    ...estado,
    nivelTruco: nivel,
    estadoTruco: 'resuelto',
    esperandoRespuestaTruco: false,
    puntosJugador,
    ganadorPartida,
    mensaje: `La IA no quiso el truco. +${puntosGanados} punto(s)`,
  }
  if (!ganadorPartida) return nuevaMano(base)
  return base
}

export function cerrarResultadoEnvido(estado) {
  return { ...estado, mostrarResultadoEnvido: false }
}

function elegirCartaIA(cartasIA) {
  return cartasIA[Math.floor(Math.random() * cartasIA.length)]
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

function puntosRonda(nivelTruco, estadoTruco) {
  if (!estadoTruco || estadoTruco === 'cantado') return 1
  if (nivelTruco === 1) return 2
  if (nivelTruco === 2) return 3
  if (nivelTruco === 3) return 4
  return 1
}

function nombreCantoInterno(canto) {
  const nombres = {
    envido: 'Envido',
    envido2: 'Envido',
    realEnvido: 'Real Envido',
    faltaEnvido: 'Falta Envido',
  }
  return nombres[canto] || canto
}