'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className={styles.auth}>
      <section className={styles.authSide}>
        <div>
          <div className={styles.brand}>
            Atelia <span className={styles.brandDot}></span>
          </div>

          <h1 className={styles.tagline}>
            Menos papeleo.<br />
            Más <em>clientes</em>.
          </h1>

          <p className={styles.taglineSub}>
            La plataforma todo-en-uno para emprendedores que no tienen tiempo para perder en administración.
          </p>
        </div>

        <div className={styles.pills}>
          <span>✓ Landing propia</span>
          <span>✓ CRM clientes</span>
          <span>✓ Facturación</span>
        </div>
      </section>

      <section className={styles.authMain}>
        <form className={styles.authForm}>
          <h2>Bienvenido de vuelta</h2>
          <p className={styles.lead}>Inicia sesión para gestionar tu negocio.</p>

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
            Iniciar sesión
          </button>

          <a className={styles.forgot} href="#">
            ¿Olvidaste tu contraseña?
          </a>

          <div className={styles.authSep}>
            <span></span>
            <b>o</b>
            <span></span>
          </div>

          <button type="button" className={styles.btnGhost}>
            Probar con cuenta demo
          </button>

          <p className={styles.authFoot}>
            ¿Aún no tienes cuenta? <a href="/register">Crear cuenta</a>
          </p>
        </form>
      </section>
    </div>
  )
}