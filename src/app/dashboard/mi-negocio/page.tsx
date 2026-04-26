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
            <p className={styles.phSub}>
              Rellena lo esencial. Tu landing se genera automáticamente.
            </p>
          </div>

          <button className={styles.btnGold}>Ver mi landing →</button>
        </div>

        <div className={mStyles.layout}>
          <div className={mStyles.mainCol}>

            <section className={mStyles.sectionPrivate}>
              <div className={mStyles.sectionHead}>
                <span className={mStyles.badgePrivate}>Privado</span>
                <div>
                  <h2>Datos del negocio</h2>
                  <p>Esto sirve para tu cuenta, contacto y facturación. No todo se muestra en la landing.</p>
                </div>
              </div>

              <div className={mStyles.grid2}>
                <div className={mStyles.field}>
                  <label>Nombre del negocio</label>
                  <input defaultValue="Jardines Mediterráneos" />
                </div>

                <div className={mStyles.field}>
                  <label>Oficio</label>
                  <select defaultValue="jardineria">
                    <option value="jardineria">🌿 Jardinería</option>
                    <option value="paisajismo">🌱 Paisajismo</option>
                    <option value="mantenimiento">🧹 Mantenimiento</option>
                    <option value="reformas">🏗️ Reformas</option>
                    <option value="limpieza">✨ Limpieza</option>
                    <option value="estetica">💆 Estética</option>
                    <option value="fontaneria">🔧 Fontanería</option>
                    <option value="electricidad">⚡ Electricidad</option>
                  </select>
                </div>

                <div className={mStyles.field}>
                  <label>Tu nombre</label>
                  <input defaultValue="Laura Fernández" />
                </div>

                <div className={mStyles.field}>
                  <label>WhatsApp</label>
                  <input defaultValue="+34 600 123 456" />
                </div>

                <div className={mStyles.field}>
                  <label>Email</label>
                  <input defaultValue="hola@jardinesmediterraneos.es" />
                </div>

                <div className={mStyles.field}>
                  <label>Ciudad</label>
                  <input defaultValue="Madrid" />
                </div>
              </div>

              <div className={mStyles.grid2}>
                <div className={mStyles.field}>
                  <label>Dirección fiscal</label>
                  <input placeholder="C/ Olivos, 12, Madrid" />
                </div>

                <div className={mStyles.field}>
                  <label>Horario</label>
                  <input defaultValue="Lunes a viernes · 9:00 a 18:00" />
                </div>

                <div className={mStyles.field}>
                  <label>NIF / CIF</label>
                  <input placeholder="Para facturas" />
                </div>

                <div className={mStyles.field}>
                  <label>IBAN</label>
                  <input placeholder="ES91 2100…" />
                </div>
              </div>
            </section>

            <section className={mStyles.sectionPublic}>
              <div className={mStyles.sectionHead}>
                <span className={mStyles.badgePublic}>Landing pública</span>
                <div>
                  <h2>Lo que verá tu cliente</h2>
                  <p>Con estos campos se genera una web tipo premium en menos de 2 minutos.</p>
                </div>
              </div>

              <div className={mStyles.field}>
                <label>Titular principal</label>
                <input defaultValue="Un jardín a la altura de tu casa. Hoy y siempre." />
              </div>

              <div className={mStyles.field}>
                <label>Subtítulo</label>
                <input defaultValue="Diseño, ejecución y mantenimiento de jardines en Madrid." />
              </div>

              <div className={mStyles.field}>
                <label>Presentación breve</label>
                <textarea defaultValue="Creamos y cuidamos jardines elegantes, funcionales y pensados para durar. Trabajamos con viviendas, comunidades y empresas que buscan un resultado profesional." />
              </div>

              <div className={mStyles.grid2}>
                <div className={mStyles.field}>
                  <label>Zona de trabajo</label>
                  <input defaultValue="Madrid, Pozuelo, Majadahonda y alrededores" />
                </div>

                <div className={mStyles.field}>
                  <label>Años de experiencia</label>
                  <input defaultValue="12 años" />
                </div>
              </div>

              <div className={mStyles.quickGroup}>
                <h3>Servicios principales</h3>

                {[
                  ['Diseño y paisajismo', 'Jardines pensados para madurar con belleza.'],
                  ['Obra y ejecución', 'Precisión técnica, equipo propio y cero improvisación.'],
                  ['Mantenimiento profesional', 'El mismo equipo que crea, mantiene.'],
                ].map((s, i) => (
                  <div key={i} className={mStyles.serviceRow}>
                    <div className={mStyles.field}>
                      <label>Servicio {i + 1}</label>
                      <input defaultValue={s[0]} />
                    </div>

                    <div className={mStyles.field}>
                      <label>Descripción</label>
                      <input defaultValue={s[1]} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={mStyles.quickGroup}>
                <h3>Por qué elegirnos</h3>

                <div className={mStyles.grid3}>
                  <div className={mStyles.field}>
                    <label>Punto 1</label>
                    <input defaultValue="Equipo propio" />
                  </div>

                  <div className={mStyles.field}>
                    <label>Punto 2</label>
                    <input defaultValue="Presupuesto claro" />
                  </div>

                  <div className={mStyles.field}>
                    <label>Punto 3</label>
                    <input defaultValue="Trabajo cuidado" />
                  </div>
                </div>
              </div>

              <div className={mStyles.quickGroup}>
                <h3>Reseñas / enamorados del servicio</h3>

                {[1, 2, 3].map((n) => (
                  <div key={n} className={mStyles.testimonialRow}>
                    <div className={mStyles.field}>
                      <label>Nombre</label>
                      <input placeholder={`Cliente ${n}`} />
                    </div>

                    <div className={mStyles.field}>
                      <label>Reseña</label>
                      <input placeholder="El servicio fue excelente..." />
                    </div>
                  </div>
                ))}
              </div>

              <div className={mStyles.grid2}>
                <div className={mStyles.field}>
                  <label>Texto del botón WhatsApp</label>
                  <input defaultValue="Solicitar presupuesto" />
                </div>

                <div className={mStyles.field}>
                  <label>Mensaje automático</label>
                  <input defaultValue="Hola, he visto vuestra web y quiero pedir información." />
                </div>
              </div>
            </section>

            <div className={mStyles.actionsBottom}>
              <button className={styles.btnGhost}>Descartar</button>
              <button className={styles.btnDark}>Guardar cambios</button>
            </div>
          </div>

          <aside className={mStyles.sideCol}>
            <div className={mStyles.urlCard}>
              <div className={mStyles.urlLabel}>Tu URL pública</div>

              <div className={mStyles.urlBox}>
                clientos.app/jardines-mediterraneos
              </div>

              <div className={mStyles.urlActions}>
                <button className={styles.btnGold}>Ver landing</button>
                <button className={mStyles.copyBtn}>⎘</button>
              </div>
            </div>

            <div className={mStyles.mediaCard}>
              <h3>Logo</h3>
              <div className={mStyles.uploadZone}>
                <input type="file" accept="image/*" />
                <div className={mStyles.uploadIcon}>🖼️</div>
                <div className={mStyles.uploadText}>Subir logo</div>
              </div>
            </div>

            <div className={mStyles.mediaCard}>
              <h3>Imagen principal</h3>
              <div className={mStyles.uploadZoneLarge}>
                <input type="file" accept="image/*" />
                <div className={mStyles.uploadIcon}>🌿</div>
                <div className={mStyles.uploadText}>Foto hero</div>
              </div>
            </div>

            <div className={mStyles.mediaCard}>
              <h3>Galería</h3>
              <div className={mStyles.galleryGrid}>
                {[1, 2, 3].map((n) => (
                  <div key={n} className={mStyles.gallerySlot}>
                    <input type="file" accept="image/*" />
                    +
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}