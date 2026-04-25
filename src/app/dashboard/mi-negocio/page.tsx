'use client'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import mStyles from './mi-negocio.module.css'

export default function MiNegocio() {
  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/mi-negocio" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Mi negocio</h1>
            <p className={styles.phSub}>Datos de tu web pública y tus facturas.</p>
          </div>
          <button className={styles.btnGold}>Ver mi landing →</button>
        </div>

        <div className={mStyles.layout}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className={styles.card}>
              <div className={styles.cardT} style={{ marginBottom: '1.1rem' }}>Datos generales</div>
              <div className={mStyles.grid2}>
                <div className={mStyles.field}><label>Nombre del negocio</label><input defaultValue="Jardines Mediterráneos" /></div>
                <div className={mStyles.field}><label>Oficio</label>
                  <select defaultValue="jardineria">
                    <option value="jardineria">🌿 Jardinería</option>
                    <option value="fontaneria">🔧 Fontanería</option>
                    <option value="electricidad">⚡ Electricidad</option>
                    <option value="reformas">🏗️ Reformas</option>
                    <option value="limpieza">✨ Limpieza</option>
                    <option value="estetica">💆 Estética</option>
                    <option value="peluqueria">✂️ Peluquería</option>
                    <option value="trainer">💪 Personal Trainer</option>
                    <option value="consultoria">📊 Consultoría</option>
                    <option value="fotografia">📸 Fotografía</option>
                  </select>
                </div>
                <div className={mStyles.field}><label>Tu nombre</label><input defaultValue="Laura Fernández" /></div>
                <div className={mStyles.field}><label>Teléfono</label><input defaultValue="+34 600 123 456" /></div>
                <div className={mStyles.field}><label>Email contacto</label><input defaultValue="hola@jardinesmediterraneos.es" /></div>
                <div className={mStyles.field}><label>Ciudad</label><input defaultValue="Madrid" /></div>
              </div>
              <div className={mStyles.field} style={{ marginTop: '.65rem' }}>
                <label>Dirección completa</label>
                <input placeholder="C/ Olivos, 12, Madrid" />
              </div>
              <div className={mStyles.grid2} style={{ marginTop: '.65rem' }}>
                <div className={mStyles.field}><label>NIF / CIF</label><input placeholder="Para facturas" /></div>
                <div className={mStyles.field}><label>IBAN</label><input placeholder="ES91 2100…" /></div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardT} style={{ marginBottom: '1.1rem' }}>Landing — Texto y servicios</div>
              <div className={mStyles.field}><label>Titular principal</label><input defaultValue="Diseño, ejecución y cuidado de jardines" /></div>
              <div className={mStyles.field}><label>Subtítulo</label><input defaultValue="Un jardín a la altura de tu casa. Hoy y siempre." /></div>
              {[
                { t: 'Diseño y paisajismo', d: 'Jardines pensados para madurar con belleza.' },
                { t: 'Obra y ejecución', d: 'Equipo propio, precisión técnica, cero improvisación.' },
                { t: 'Mantenimiento', d: 'El mismo equipo que crea, mantiene.' },
              ].map((s, i) => (
                <div key={i} className={mStyles.grid2} style={{ marginTop: '.6rem' }}>
                  <div className={mStyles.field} style={{ margin: 0 }}><input defaultValue={s.t} placeholder={`Servicio ${i+1}`} /></div>
                  <div className={mStyles.field} style={{ margin: 0 }}><input defaultValue={s.d} placeholder="Descripción" /></div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.55rem' }}>
              <button className={styles.btnGhost}>Descartar</button>
              <button className={styles.btnDark}>Guardar cambios</button>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className={styles.card}>
              <div className={mStyles.urlCard}>
                <div style={{ fontSize: '.62rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '.5rem' }}>Tu URL pública</div>
                <div style={{ fontFamily: 'monospace', fontSize: '.82rem', color: 'rgba(255,255,255,.7)', background: 'rgba(255,255,255,.08)', padding: '.6rem .8rem', borderRadius: 'var(--r)', marginBottom: '.9rem' }}>
                  clientos.app/jardines-mediterraneos
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className={styles.btnGold} style={{ flex: 1 }}>Ver landing</button>
                  <button style={{ padding: '.65rem', background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer', fontSize: '.82rem' }}>⎘</button>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardT} style={{ marginBottom: '1rem' }}>Foto de perfil / logo</div>
              <div className={mStyles.uploadZone}>
                <input type="file" accept="image/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <div style={{ fontSize: '1.75rem', marginBottom: '.4rem', opacity: .4 }}>🖼️</div>
                <div style={{ fontSize: '.82rem', color: 'var(--grey)' }}><strong>Clic</strong> para subir tu foto o logo</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}