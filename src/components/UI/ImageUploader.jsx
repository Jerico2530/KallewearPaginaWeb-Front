/**
 * ImageUploader.jsx
 * -------------------------------------------------
 * Componente reutilizable para subir y previsualizar imágenes en formularios.
 *
 * Funcionalidades clave:
 * - Permite seleccionar una imagen desde el equipo y la devuelve como DataURL.
 * - Muestra una vista previa y permite eliminar la imagen seleccionada.
 * - Limpia correctamente el input file para permitir volver a subir la misma imagen.
 *
 * Propósito del componente:
 * Centralizar la lógica de carga/preview de imágenes en formularios administrativos,
 * manteniendo la UI consistente y la lógica separada para facilitar su uso en el
 * panel de administración o en páginas públicas.
 *
 */
import React, { useRef } from "react";

const ImageUploader = ({ label = "Imagen", value, onChange }) => {
  // Referencia para manipular el input file (ej. limpiar valor)
  const inputRef = useRef(null);
  // Lee el archivo seleccionado y lo convierte a DataURL para previsualización.
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      // Devuelve la imagen como DataURL al padre
      reader.onloadend = () => onChange(reader.result);
      reader.readAsDataURL(file);
    }
  };
  // Elimina la imagen seleccionada: limpia el estado del padre y el input file nativo.
  const handleRemove = () => {
    // Indicar al componente padre que no hay imagen
    onChange("");
    // Reset del input para permitir re-subida
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl p-3 shadow-sm">
      {/* Etiqueta del campo */}
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>
      {/* Input de tipo file: solo imágenes */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border rounded-lg w-full px-2 py-1 text-sm dark:bg-gray-700 dark:text-gray-100"
      />
       {/* Vista previa y opción de quitar (se muestra solo si hay valor) */}
      {value && (
        <div className="mt-3 flex flex-col items-center gap-2">
          {/* Preview en miniatura: usa el DataURL recibido en `value` */}
          <img
            src={value}
            alt="Vista previa"
            className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-500 object-cover shadow-md"
          />
          {/* Botón para remover la imagen seleccionada */}
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs px-3 py-1 rounded-full border border-red-500 text-red-600 dark:text-red-400 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
          >
            Quitar imagen
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
