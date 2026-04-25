'use client'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import qStyles from './qr.module.css'

export default function QR() {
  const url = 'https://clientos.app/jardines-mediterraneos'
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&color=0a0f14&bgcolor=ffffff&data=${encodeURIComponent(url)}`

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/qr" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>QR y landing</h1>
            <p className={styles.phSub}>Tu web profesional en un código.</p>
          </div>
        </div>

        <div className={qStyles.layout}>
          <div className={qStyles.qrCard}>
            <div className={qStyles.bizName}>Jardines Mediterráneos</div>
            <div className={qStyles.qrFrame}>
              <img src={qrSrc} alt="QR" width={240} height={240} />
            </div>
            <div className={qStyles.qrLabel}>Escanea para conocernos</div>
            <div className={qStyles.qrUrl}>{url}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className={styles.card}>
              <div className={styles.cardT} style={{ marginBottom: '1rem' }}>Cómo usar tu QR</div>
              {[
                ['01', 'Imprímelo en tarjetas de visita, furgoneta o escaparate.'],
                ['02', 'El cliente lo escanea y ve tus servicios y contacto.'],
                ['03', 'Cuando contacte, lo añades al CRM en 3 segundos.'],
              ].map(([n, t]) => (
                <div key={n} style={{ display: 'flex', gap: '.85rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: 'Syne', fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold)', lineHeight: 1, flexShrink: 0 }}>{n}</span>
                  <span style={{ fontSize: '.875rem', color: 'var(--ink2)' }}>{t}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '.55rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
                <a href={qrSrc} download="qr-clientos.png" className={styles.btnDark}>↓ Descargar QR</a>
                <button className={styles.btnGhost} onClick={() => navigator.clipboard.writeText(url)}>⎘ Copiar link</button>
                <button className={styles.btnGold}>Ver landing</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}