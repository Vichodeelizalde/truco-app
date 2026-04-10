import { useState } from 'react'
import {
  nuevaPartida,
  jugarCarta,
  cantarEnvidoJugador,
  responderEnvidoJugador,
  cantarTrucoJugador,
  responderTrucoJugador,
  cerrarResultadoEnvido,
} from './juego.js'
import { proximosCantos, nombreCanto } from './envido.js'

const nombreCarta = (c) => `${c.valor} de ${c.palo}`

const VERDE = '#1a5c2a'
const VERDE_OSCURO = 'rgba(0,0,0,0.25)'

export default function App() {
  const [estado, setEstado] = useState(null)
  const [seleccionada, setSeleccionada] = useState(null)

  const iniciar = () => { setEstado(nuevaPartida()); setSeleccionada(null) }
  const jugar   = () => {
    if (!seleccionada) return
    setEstado(jugarCarta(estado, seleccionada))
    setSeleccionada(null)
  }

  if (!estado) return (
    <div style={estiloMesa}>
      <h1 style={{fontSize:52,margin:0}}>🃏 Truco</h1>
      <p style={{opacity:.8,margin:0}}>El juego de cartas argentino</p>
      <button style={btn('#f5c518','#1a1a1a',18)} onClick={iniciar}>Nueva partida</button>
    </div>
  )

  const cantosPosibles = !estado.envidoYaJugado && estado.estadoTruco !== 'aceptado'
    ? proximosCantos(estado.secuenciaEnvido)
    : []

  const ultimoCantador = [...estado.secuenciaEnvido]
    .reverse()
    .find(c => c === 'jugador' || c === 'ia')

  const esperandoEnvido = estado.esperandoRespuestaEnvido
  const esperandoTruco  = estado.esperandoRespuestaTruco

  return (
    <div style={estiloMesa}>

      {/* Puntaje */}
      <div style={{display:'flex',gap:40,fontSize:20,background:VERDE_OSCURO,padding:'10px 30px',borderRadius:12}}>
        <span>Vos: <strong>{estado.puntosJugador}</strong></span>
        <span style={{opacity:.4}}>/ 30</span>
        <span>IA: <strong>{estado.puntosIA}</strong></span>
      </div>

      {/* Ganador partida */}
      {estado.ganadorPartida && (
        <div style={{textAlign:'center',background:VERDE_OSCURO,padding:'24px 40px',borderRadius:16}}>
          <div style={{fontSize:32,marginBottom:16}}>
            {estado.ganadorPartida === 'jugador' ? '🏆 ¡Ganaste la partida!' : '😔 La IA ganó la partida'}
          </div>
          <button style={btn('#f5c518','#1a1a1a')} onClick={iniciar}>Jugar de nuevo</button>
        </div>
      )}

      {/* Cuadrito resultado envido */}
      {estado.mostrarResultadoEnvido && (
        <div style={{background:'rgba(0,0,0,0.85)',borderRadius:16,padding:'24px 32px',textAlign:'center',minWidth:260}}>
          <div style={{fontSize:18,fontWeight:'bold',marginBottom:16}}>Resultado del Envido</div>
          <div style={{display:'flex',justifyContent:'space-around',marginBottom:16,gap:24}}>
            <div>
              <div style={{opacity:.7,fontSize:13}}>Vos</div>
              <div style={{fontSize:36,fontWeight:'bold',color:'#f5c518'}}>{estado.puntosEnvidoJugador}</div>
            </div>
            <div style={{opacity:.4,fontSize:24,alignSelf:'center'}}>vs</div>
            <div>
              <div style={{opacity:.7,fontSize:13}}>IA</div>
              <div style={{fontSize:36,fontWeight:'bold',color:'#f5c518'}}>{estado.puntosEnvidoIA}</div>
            </div>
          </div>
          <div style={{marginBottom:16,fontSize:15}}>
            {estado.ganadorEnvido === 'jugador' ? '🏆 Ganaste el envido!'
              : estado.ganadorEnvido === 'ia' ? '😔 La IA ganó el envido'
              : '🤝 Empate!'}
          </div>
          <div style={{fontSize:13,opacity:.7,marginBottom:16}}>{estado.mensaje}</div>
          <button style={btn('#f5c518','#1a1a1a')} onClick={() => setEstado(cerrarResultadoEnvido(estado))}>
            Continuar
          </button>
        </div>
      )}

      {/* Mensaje */}
      {!estado.mostrarResultadoEnvido && (
        <div style={{fontSize:15,opacity:.85,textAlign:'center',minHeight:24}}>
          {estado.mensaje}
        </div>
      )}

      {/* Cartas IA */}
      <div style={{textAlign:'center'}}>
        <div style={{opacity:.6,fontSize:13,marginBottom:8}}>Cartas de la IA</div>
        <div style={{display:'flex',gap:10,justifyContent:'center'}}>
          {estado.cartasIA.map((_,i) => (
            <div key={i} style={estiloCartaTapada}>🂠</div>
          ))}
        </div>
      </div>

      {/* Ultima mano jugada */}
      {estado.cartasJugadasJugador.length > 0 && (
        <div style={{textAlign:'center',opacity:.75,fontSize:13}}>
          Última mano — Vos: {nombreCarta(estado.cartasJugadasJugador[estado.cartasJugadasJugador.length-1])} | IA: {nombreCarta(estado.cartasJugadasIA[estado.cartasJugadasIA.length-1])}
        </div>
      )}

      {/* Cartas del jugador */}
      <div style={{textAlign:'center'}}>
        <div style={{opacity:.6,fontSize:13,marginBottom:10}}>Tus cartas</div>
        <div style={{display:'flex',gap:12,justifyContent:'center'}}>
          {estado.cartasJugador.map((carta,i) => {
            const sel = seleccionada?.valor === carta.valor && seleccionada?.palo === carta.palo
            return (
              <div key={i} onClick={() => setSeleccionada(carta)} style={estiloCartaJugador(sel)}>
                <div style={{fontSize:22,fontWeight:'bold'}}>{carta.valor}</div>
                <div style={{fontSize:12,marginTop:4}}>{carta.palo}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Botones de accion */}
      {!estado.ganadorPartida && !estado.mostrarResultadoEnvido && (
        <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',maxWidth:400}}>

          {/* Jugar carta seleccionada */}
          {seleccionada && !esperandoEnvido && !esperandoTruco && (
            <button style={btn('#f5c518','#1a1a1a')} onClick={jugar}>
              Jugar {nombreCarta(seleccionada)}
            </button>
          )}

          {/* Jugador responde envido de la IA */}
          {esperandoEnvido && ultimoCantador === 'ia' && (
            <>
              <div style={{width:'100%',textAlign:'center',fontSize:13,opacity:.8}}>
                La IA cantó. ¿Qué hacés?
              </div>
              {cantosPosibles.map(c => (
                <button key={c} style={btn('#2980b9','white')}
                  onClick={() => setEstado(responderEnvidoJugador(estado, c))}>
                  {nombreCanto(c)}
                </button>
              ))}
              <button style={btn('#27ae60','white')}
                onClick={() => setEstado(responderEnvidoJugador(estado, 'quiero'))}>
                Quiero
              </button>
              <button style={btn('#7f8c8d','white')}
                onClick={() => setEstado(responderEnvidoJugador(estado, 'noQuiero'))}>
                No Quiero
              </button>
            </>
          )}

          {/* Jugador canta envido primero */}
          {!esperandoEnvido && !esperandoTruco && !estado.envidoYaJugado
            && estado.estadoTruco !== 'aceptado'
            && ultimoCantador !== 'jugador'
            && cantosPosibles.length > 0 && (
            <>
              {cantosPosibles.map(c => (
                <button key={c} style={btn('#2980b9','white')}
                  onClick={() => setEstado(cantarEnvidoJugador(estado, c))}>
                  {nombreCanto(c)}
                </button>
              ))}
            </>
          )}

          {/* Jugador responde truco de la IA */}
          {esperandoTruco && estado.trucoCantadoPor === 'ia' && (
            <>
              <div style={{width:'100%',textAlign:'center',fontSize:13,opacity:.8}}>
                La IA cantó {estado.nivelTruco === 1 ? 'Truco' : estado.nivelTruco === 2 ? 'Retruco' : 'Vale Cuatro'}. ¿Qué hacés?
              </div>
              {estado.nivelTruco < 3 && (
                <button style={btn('#c0392b','white')}
                  onClick={() => setEstado(responderTrucoJugador(estado, estado.nivelTruco + 1))}>
                  {estado.nivelTruco === 1 ? 'Retruco' : 'Vale Cuatro'}
                </button>
              )}
              <button style={btn('#27ae60','white')}
                onClick={() => setEstado(responderTrucoJugador(estado, 'quiero'))}>
                Quiero
              </button>
              <button style={btn('#7f8c8d','white')}
                onClick={() => setEstado(responderTrucoJugador(estado, 'noQuiero'))}>
                No Quiero
              </button>
            </>
          )}

          {/* Jugador canta truco */}
          {!esperandoEnvido && !esperandoTruco
            && estado.estadoTruco !== 'resuelto'
            && estado.estadoTruco !== 'aceptado'
            && estado.trucoCantadoPor !== 'jugador' && (
            <button style={btn('#c0392b','white')}
              onClick={() => setEstado(cantarTrucoJugador(estado, 1))}>
              Truco
            </button>
          )}

        </div>
      )}

      <button style={btn('transparent','white',13,'1px solid rgba(255,255,255,0.4)')} onClick={iniciar}>
        Nueva partida
      </button>

    </div>
  )
}

const estiloMesa = {
  minHeight: '100vh',
  background: VERDE,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'sans-serif',
  color: 'white',
  padding: 20,
  gap: 16,
}

const estiloCartaTapada = {
  background: '#2d4a8a',
  border: '3px solid #1a3a6a',
  borderRadius: 10,
  padding: '16px 12px',
  minWidth: 72,
  textAlign: 'center',
  fontSize: 24,
}

const estiloCartaJugador = (sel) => ({
  background: sel ? '#f5c518' : 'white',
  color: '#1a1a1a',
  border: sel ? '3px solid #e6a800' : '3px solid #ccc',
  borderRadius: 10,
  padding: '16px 12px',
  minWidth: 72,
  textAlign: 'center',
  cursor: 'pointer',
  transform: sel ? 'translateY(-10px)' : 'none',
  transition: 'all 0.2s',
})

function btn(bg, color, fontSize=15, border='none') {
  return {
    background: bg,
    color,
    border,
    padding: '10px 20px',
    borderRadius: 8,
    fontSize,
    fontWeight: 'bold',
    cursor: 'pointer',
  }
}