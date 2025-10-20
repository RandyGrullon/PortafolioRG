# ImageUploadField Component

Un componente moderno y flexible para subir imágenes con drag & drop, preview y compresión automática.

## Características

- ✅ **Drag & Drop**: Arrastra y suelta imágenes directamente
- ✅ **Pegar imágenes**: Pega imágenes directamente desde el portapapeles
- ✅ **Múltiples archivos**: Soporte para subir varias imágenes a la vez
- ✅ **Selección primaria**: Marca una imagen como primaria con estrella
- ✅ **Compresión automática**: Reduce el tamaño de las imágenes automáticamente
- ✅ **Preview en tiempo real**: Muestra las imágenes subidas inmediatamente
- ✅ **Validación**: Verifica tipos de archivo, tamaño y cantidad máxima
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Modo compacto**: Para espacios más pequeños
- ✅ **Accesible**: Etiquetas y navegación por teclado

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `id` | `string` | - | ID único para el campo |
| `label` | `string` | - | Etiqueta del campo |
| `value` | `string \| string[]` | - | Valor actual (URL o array de URLs) |
| `onChange` | `(files: FileList \| null) => Promise<void>` | - | Función que maneja la subida de archivos |
| `multiple` | `boolean` | `false` | Permitir múltiples archivos |
| `maxFiles` | `number` | `10` | Máximo número de archivos |
| `maxSizeMB` | `number` | `10` | Tamaño máximo por archivo en MB |
| `disabled` | `boolean` | `false` | Deshabilitar el campo |
| `loading` | `boolean` | `false` | Mostrar estado de carga |
| `previewImages` | `string[]` | `[]` | Imágenes adicionales para preview |
| `onRemoveImage` | `(index: number) => void` | - | Función para eliminar imagen por índice |
| `accept` | `string` | `"image/*"` | Tipos de archivo aceptados |
| `description` | `string` | - | Texto descriptivo adicional |
| `showDragDropText` | `boolean` | `true` | Mostrar texto de drag & drop |
| `compact` | `boolean` | `false` | Modo compacto para espacios pequeños |
| `primaryIndex` | `number` | - | Índice de la imagen primaria (0-based) |
| `onSetPrimary` | `(index: number) => void` | - | Función para establecer imagen primaria |

## Ejemplos de uso

### Imagen única
```tsx
<ImageUploadField
  id="profile-image"
  label="Foto de perfil"
  value={profileImage}
  onChange={handleImageUpload}
  description="Sube tu foto de perfil (máximo 5MB)"
/>
```

### Múltiples imágenes (galería)
```tsx
<ImageUploadField
  id="gallery"
  label="Galería de imágenes"
  value={galleryImages}
  onChange={handleGalleryUpload}
  multiple={true}
  maxFiles={10}
  previewImages={galleryImages}
  onRemoveImage={(index) => removeImage(index)}
  description="Sube hasta 10 imágenes para la galería"
/>
```

### Modo compacto
```tsx
<ImageUploadField
  id="thumbnail"
  label="Miniatura"
  value={thumbnail}
  onChange={handleThumbnailUpload}
  compact={true}
  maxSizeMB={2}
/>
```

## Estilos y personalización

El componente usa Tailwind CSS y se integra perfectamente con el sistema de diseño existente. Los colores y estilos se adaptan automáticamente al tema actual.

### Estados visuales
- **Normal**: Borde punteado gris
- **Hover**: Borde azul claro con fondo sutil
- **Drag over**: Borde azul brillante con escala y fondo azul
- **Disabled**: Opacidad reducida, cursor no permitido
- **Loading**: Spinner animado

### Animaciones
- Transiciones suaves en hover y estados
- Efectos de escala en drag & drop
- Animaciones de carga
- Transiciones en preview de imágenes

## Integración con formularios

El componente está diseñado para trabajar con cualquier sistema de manejo de formularios. Solo necesitas proporcionar una función `onChange` que maneje los archivos seleccionados.

### Ejemplo con compresión
```tsx
const handleImageUpload = async (files: FileList | null) => {
  if (!files || files.length === 0) return;

  try {
    const compressedImages = [];
    for (const file of Array.from(files)) {
      const compressed = await compressImage(file);
      compressedImages.push(compressed);
    }

    // Actualizar estado
    setImages(compressedImages);
  } catch (error) {
    console.error('Error al procesar imágenes:', error);
  }
};
```

## Consideraciones de rendimiento

- Las imágenes se comprimen automáticamente antes de almacenarse
- Preview optimizado con lazy loading
- Manejo eficiente de memoria para múltiples archivos
- Validación del lado del cliente para reducir errores del servidor

## Accesibilidad

- Etiquetas descriptivas para lectores de pantalla
- Navegación por teclado completa
- Indicadores visuales claros de estado
- Mensajes de error informativos