'use client'
import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={styles.auth}>
      <div className={styles.authSide}>
        <div className={styles.authSideInner}>
          <div className={styles.brand}>
            Clientos <span className={styles.brandDot}></span>
          </div>
          <div className={styles.tagline}>
            Menos papel.<br />Más <em>clientes</em>.
          </div>
          <p className={styles.taglineSub}>
            CRM + agenda + presupuestos + landing propia. Todo en uno para emprendedores sin tiempo.
          </p>
        </div>
        <div className={styles.pills}>
          <span className={styles.pill}>Landing propia</span>
          <span className={styles.pill}>CRM rápido</span>
          <span className={styles.pill}>Presupuestos</span>
          <span className={styles.pill}>Agenda</span>
        </div>
      </div>

      <div className={styles.authMain}>
        <form className={styles.authForm}>
          <h2>Bienvenido de vuelta</h2>
          <p className={styles.lead}>Entra y ponte al día en segundos.</p>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.btnDark}>
            Iniciar sesión →
          </button>

          <div className={styles.authSep}>o</div>

          <button type="button" className={styles.btnGhost}>
            ▶ Ver la demo completa
          </button>

          <p className={styles.authFoot}>
            ¿Sin cuenta? <a href="/register">Crear gratis</a>
          </p>
        </form>
      </div>
    </div>
  )
}