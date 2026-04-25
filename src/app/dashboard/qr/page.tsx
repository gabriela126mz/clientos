'use client'

import { Sidebar } from '../page'
import styles from '../page.module.css'
import qStyles from './qr.module.css'

export default function QR() {
  const url = 'https://clientos.app/jardines-mediterraneos'
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&color=0a0f14&bgcolor=ffffff&data=${encodeURIComponent(url)}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    alert('Link copiado ✅')
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/qr" />

      <main className={styles.main}>
        <div className={qStyles.hero}>
          <div>
            <span className={qStyles.kicker}>Código QR profesional</span>
            <h1 className={qStyles.title}>Tu QR y tu landing</h1>
            <p className={qStyles.subtitle}>
              Imprime tu QR, pégalo en tu local, tarjetas o furgoneta, y tus clientes accederán directamente a tu web.
            </p>
          </div>
        </div>

        <div className={qStyles.layout}>
          <section className={qStyles.qrCard}>
            <div className={qStyles.qrTop}>
              <span className={qStyles.bizName}>Jardines Mediterráneos</span>
              <span className={qStyles.status}>Activo</span>
            </div>

            <div className={qStyles.qrFrame}>
              <img src={qrSrc} alt="QR de Jardines Mediterráneos" width={260} height={260} />
            </div>

            <div className={qStyles.qrLabel}>Escanea para conocernos</div>
            <div className={qStyles.qrUrl}>{url}</div>
          </section>

          <section className={qStyles.side}>
            <div className={qStyles.infoCard}>
              <h2>Qué hacer con tu QR</h2>

              <div className={qStyles.steps}>
                {[
                  ['01', 'Descárgalo y pégalo en tu furgoneta, local o tarjeta de visita.'],
                  ['02', 'Cuando un cliente lo escanee verá tu landing con tus servicios.'],
                  ['03', 'Podrá contactarte desde ahí y entrar directo a tu CRM.'],
                ].map(([n, t]) => (
                  <div key={n} className={qStyles.step}>
                    <span>{n}</span>
                    <p>{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={qStyles.actions}>
              <a href={qrSrc} download="qr-clientos.png" className={qStyles.primaryBtn}>
                ↓ Descargar QR
              </a>

              <button className={qStyles.secondaryBtn} onClick={copyLink}>
                Copiar link
              </button>

              <a href={url} target="_blank" rel="noopener noreferrer" className={qStyles.secondaryBtn}>
                Ver landing
              </a>
            </div>

            <div className={qStyles.tipCard}>
              <strong>Consejo rápido</strong>
              <p>
                Usa este QR en presupuestos, carteles, tarjetas y mensajes de WhatsApp. Cuantos más lugares lo pongas, más fácil será que te contacten.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}