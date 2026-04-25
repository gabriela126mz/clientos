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
              Configura los datos que aparecerán en tu landing pública.
            </p>
          </div>

          <button className={styles.btnGold}>Ver mi landing →</button>
        </div>

        <div className={mStyles.layout}>
          <div className={mStyles.mainCol}>
            <div className={styles.card}>
              <div className={styles.cardT}>Datos generales</div>

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
                  <label>Teléfono / WhatsApp</label>
                  <input defaultValue="+34 600 123 456" />
                </div>

                <div className={mStyles.field}>
                  <label>Email contacto</label>
                  <input defaultValue="hola@jardinesmediterraneos.es" />
                </div>

                <div className={mStyles.field}>
                  <label>Ciudad</label>
                  <input defaultValue="Madrid" />
                </div>
              </div>

              <div className={mStyles.field}>
                <label>Zona de trabajo</label>
                <input defaultValue="Madrid, Pozuelo, Majadahonda y alrededores" />
              </div>

              <div className={mStyles.grid2}>
                <div className={mStyles.field}>
                  <label>Dirección completa</label>
                  <input placeholder="C/ Olivos, 12, Madrid" />
                </div>

                <div className={mStyles.field}>
                  <label>Horario de atención</label>
                  <input defaultValue="Lunes a viernes · 9:00 a 18:00" />
                </div>
              </div>

              <div className={mStyles.grid2}>
                <div className={mStyles.field}>
                  <label>NIF / CIF</label>
                  <input placeholder="Para facturas" />
                </div>

                <div className={mStyles.field}>
                  <label>IBAN</label>
                  <input placeholder="ES91 2100…" />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardT}>Landing — Hero principal</div>

              <div className={mStyles.field}>
                <label>Titular principal</label>
                <input defaultValue="Diseño, ejecución y cuidado de jardines" />
              </div>

              <div className={mStyles.field}>
                <label>Subtítulo</label>
                <input defaultValue="Creamos jardines elegantes, funcionales y pensados para durar." />
              </div>

              <div className={mStyles.field}>
                <label>Texto de presentación</label>
                <textarea defaultValue="Somos un equipo especializado en jardinería y paisajismo para viviendas, comunidades y negocios. Diseñamos, ejecutamos y mantenemos espacios verdes con criterio técnico y sensibilidad estética." />
              </div>

              <div className={mStyles.field}>
                <label>Frase destacada</label>
                <input defaultValue="Un jardín bien cuidado cambia la forma de vivir tu casa." />
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardT}>Servicios principales</div>

              {[
                {
                  t: 'Diseño y paisajismo',
                  d: 'Proyectamos jardines equilibrados, bonitos y adaptados al clima mediterráneo.',
                },
                {
                  t: 'Obra y ejecución',
                  d: 'Nos encargamos de la instalación, plantación, riego y acabados.',
                },
                {
                  t: 'Mantenimiento',
                  d: 'Cuidamos tu jardín durante todo el año para que siempre luzca impecable.',
                },
              ].map((s, i) => (
                <div key={i} className={mStyles.serviceRow}>
                  <div className={mStyles.field}>
                    <label>Servicio {i + 1}</label>
                    <input defaultValue={s.t} />
                  </div>

                  <div className={mStyles.field}>
                    <label>Descripción</label>
                    <input defaultValue={s.d} />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.card}>
              <div className={styles.cardT}>Confianza y diferenciadores</div>

              <div className={mStyles.grid3}>
                <div className={mStyles.field}>
                  <label>Años de experiencia</label>
                  <input defaultValue="12 años" />
                </div>

                <div className={mStyles.field}>
                  <label>Tipo de cliente</label>
                  <input defaultValue="Particulares, comunidades y empresas" />
                </div>

                <div className={mStyles.field}>
                  <label>Compromiso</label>
                  <input defaultValue="Presupuesto claro y trabajo cuidado" />
                </div>
              </div>

              <div className={mStyles.grid3}>
                <div className={mStyles.field}>
                  <label>Beneficio 1</label>
                  <input defaultValue="Diseño personalizado" />
                </div>

                <div className={mStyles.field}>
                  <label>Beneficio 2</label>
                  <input defaultValue="Equipo propio" />
                </div>

                <div className={mStyles.field}>
                  <label>Beneficio 3</label>
                  <input defaultValue="Mantenimiento continuo" />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardT}>WhatsApp y llamada a la acción</div>

              <div className={mStyles.grid2}>
                <div className={mStyles.field}>
                  <label>Texto del botón</label>
                  <input defaultValue="Solicitar presupuesto por WhatsApp" />
                </div>

                <div className={mStyles.field}>
                  <label>Mensaje automático</label>
                  <input defaultValue="Hola, he visto vuestra web y quiero pedir información." />
                </div>
              </div>
            </div>

            <div className={mStyles.actionsBottom}>
              <button className={styles.btnGhost}>Descartar</button>
              <button className={styles.btnDark}>Guardar cambios</button>
            </div>
          </div>

          <aside className={mStyles.sideCol}>
            <div className={styles.card}>
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
            </div>

            <div className={styles.card}>
              <div className={styles.cardT}>Logo / foto de perfil</div>

              <div className={mStyles.uploadZone}>
                <input type="file" accept="image/*" />
                <div className={mStyles.uploadIcon}>🖼️</div>
                <div className={mStyles.uploadText}>
                  <strong>Clic</strong> para subir logo
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardT}>Imagen principal</div>

              <div className={mStyles.uploadZoneLarge}>
                <input type="file" accept="image/*" />
                <div className={mStyles.uploadIcon}>🌿</div>
                <div className={mStyles.uploadText}>
                  Foto hero para la landing
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardT}>Galería de trabajos</div>

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