import { useState } from 'react'
import { nuevaPartida, jugarCarta } from './juego.js'

const nombreCarta = (carta) => `${carta.valor} de ${carta.palo}`

const estiloMesa = {
  minHeight: '100vh',
  background: '#1a5c2a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'sans-serif',
  color: 'white',
  padding: '20px'
}

const estiloCarta = (seleccionada) => ({
  background: seleccionada ? '#f5c518' : 'white',
  color: '#1a1a1a',
  border: seleccionada ? '3px solid #e6a800' : '3px solid #ccc',
  borderRadius: '10px',
  padding: '16px 12px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  minWidth: '80px',
  textAlign: 'center',
  transform: seleccionada ? 'translateY(-10px)' : 'none',
  transition: 'all 0.2s'
})

const estiloBoton = {
  background: '#f5c518',
  color: '#1a1a1a',
  border: 'none',
  padding: '12px 28px',
  fontSize: '16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  margin: '8px'
}

export default function App() {
  const [estado, setEstado] = useState(null)
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null)

  const iniciar = () => {
    setEstado(nuevaPartida())
    setCartaSeleccionada(null)
  }

  const jugar = () => {
    if (!cartaSeleccionada) return
    const nuevoEstado = jugarCarta(estado, cartaSeleccionada)
    setEstado(nuevoEstado)
    setCartaSeleccionada(null)
  }

  if (!estado) {
    return (
      <div style={estiloMesa}>
        <h1 style={{ fontSize: '52px', marginBottom: '8px' }}>🃏 Truco</h1>
        <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px' }}>
          El juego de cartas argentino
        </p>
        <button style={estiloBoton} onClick={iniciar}>
          Nueva partida
        </button>
      </div>
    )
  }

  return (
    <div style={estiloMesa}>
      <div style={{ display: 'flex', gap: '40px', marginBottom: '20px', fontSize: '18px' }}>
        <span>Vos: <strong>{estado.puntosJugador}</strong></span>
        <span>IA: <strong>{estado.puntosIA}</strong></span>
      </div>

      {estado.ganadorPartida && (
        <div style={{ fontSize: '28px', marginBottom: '20px', textAlign: 'center' }}>
          {estado.ganadorPartida === 'jugador' ? '🏆 ¡Ganaste la partida!' : '😔 La IA ganó la partida'}
          <br />
          <button style={{ ...estiloBoton, marginTop: '16px' }} onClick={iniciar}>
            Jugar de nuevo
          </button>
        </div>
      )}

      <div style={{ marginBottom: '24px', fontSize: '15px', opacity: 0.85, textAlign: 'center' }}>
        {estado.mensaje}
      </div>

      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <p style={{ opacity: 0.7, marginBottom: '12px', fontSize: '14px' }}>
          Cartas de la IA: {estado.cartasIA.length} carta(s) restante(s)
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {estado.cartasIA.map((_, i) => (
            <div key={i} style={{
              background: '#2d4a8a',
              border: '3px solid #1a3a6a',
              borderRadius: '10px',
              padding: '16px 12px',
              minWidth: '80px',
              textAlign: 'center',
              fontSize: '24px'
            }}>
              🂠
            </div>
          ))}
        </div>
      </div>

      {estado.cartasJugadasJugador.length > 0 && (
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ opacity: 0.7, fontSize: '13px', marginBottom: '8px' }}>Última mano</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '13px' }}>
            <span>Vos: {nombreCarta(estado.cartasJugadasJugador[estado.cartasJugadasJugador.length - 1])}</span>
            <span>IA: {nombreCarta(estado.cartasJugadasIA[estado.cartasJugadasIA.length - 1])}</span>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <p style={{ opacity: 0.7, marginBottom: '12px', fontSize: '14px' }}>
          Tus cartas — tocá una para seleccionarla
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
          {estado.cartasJugador.map((carta, i) => {
            const sel = cartaSeleccionada &&
              cartaSeleccionada.valor === carta.valor &&
              cartaSeleccionada.palo === carta.palo
            return (
              <div
                key={i}
                style={estiloCarta(sel)}
                onClick={() => setCartaSeleccionada(carta)}
              >
                <div style={{ fontSize: '20px' }}>{carta.valor}</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>{carta.palo}</div>
              </div>
            )
          })}
        </div>

        {cartaSeleccionada && (
          <button style={estiloBoton} onClick={jugar}>
            Jugar {nombreCarta(cartaSeleccionada)}
          </button>
        )}
      </div>

      <button
        style={{ ...estiloBoton, background: 'transparent', color: 'white', border: '1px solid white', marginTop: '24px', fontSize: '13px' }}
        onClick={iniciar}
      >
        Nueva partida
      </button>
    </div>
  )
}