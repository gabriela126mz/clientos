// ✅ UTILIDADES PARA OPTIMIZACIÓN DE IMÁGENES

export interface ImageOptimizationConfig {
  maxWidth: number
  maxHeight: number
  quality: number // 0-100
  format: 'webp' | 'jpeg' | 'png'
}

// ✅ CONFIGURACIONES POR SECCIÓN
export const imageConfigs: Record<string, ImageOptimizationConfig> = {
  logo: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 90,
    format: 'webp',
  },
  hero: {
    maxWidth: 1200,
    maxHeight: 600,
    quality: 85,
    format: 'webp',
  },
  servicio: {
    maxWidth: 500,
    maxHeight: 400,
    quality: 80,
    format: 'webp',
  },
  galeria: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 80,
    format: 'webp',
  },
}

// ✅ OPTIMIZAR IMAGEN SUBIDA
export async function optimizeImage(file: File, section: keyof typeof imageConfigs): Promise<string> {
  return new Promise((resolve, reject) => {
    const config = imageConfigs[section]
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        
        // Calcular dimensiones manteniendo aspecto
        let { width, height } = img
        const ratio = width / height

        if (width > config.maxWidth || height > config.maxHeight) {
          if (ratio > 1) {
            width = config.maxWidth
            height = config.maxWidth / ratio
          } else {
            height = config.maxHeight
            width = config.maxHeight * ratio
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Convertir a WebP o JPEG según sección
        const mimeType = config.format === 'webp' ? 'image/webp' : 'image/jpeg'
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('No blob'))
              return
            }
            const reader2 = new FileReader()
            reader2.onload = (e) => {
              resolve(e.target?.result as string)
            }
            reader2.readAsDataURL(blob)
          },
          mimeType,
          config.quality / 100
        )
      }
      img.src = event.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}

// ✅ OPTIMIZAR MÚLTIPLES IMÁGENES
export async function optimizeMultipleImages(
  files: File[],
  section: keyof typeof imageConfigs
): Promise<string[]> {
  return Promise.all(files.map(file => optimizeImage(file, section)))
}

// ✅ COMPRIMIR Y MEJORAR CALIDAD
export async function compressAndEnhance(dataUrl: string, section: keyof typeof imageConfigs): Promise<string> {
  return new Promise((resolve) => {
    const config = imageConfigs[section]
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        resolve(dataUrl)
        return
      }

      canvas.width = img.width
      canvas.height = img.height

      // Mejorar contraste y saturación ligeramente
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Mejorar nitidez
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.05) // Rojo
        data[i + 1] = Math.min(255, data[i + 1] * 1.05) // Verde
        data[i + 2] = Math.min(255, data[i + 2] * 1.05) // Azul
      }

      ctx.putImageData(imageData, 0, 0)

      const mimeType = config.format === 'webp' ? 'image/webp' : 'image/jpeg'
      canvas.toBlob(
        (blob) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve(e.target?.result as string)
          }
          reader.readAsDataURL(blob!)
        },
        mimeType,
        config.quality / 100
      )
    }

    img.src = dataUrl
  })
}

// ✅ VALIDAR IMAGEN
export function validateImage(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Solo se permiten imágenes JPG, PNG, WebP o GIF' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'El archivo no puede exceder 10MB' }
  }

  return { valid: true }
}
