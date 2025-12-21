/**
 * DevolucionPage.jsx
 *
 * Descripción del proyecto:
 * Página de Política de Devoluciones de Kallewear, integrada en la plataforma de e-commerce.
 *
 * Funcionalidades clave:
 * 1. Mostrar la política completa de devoluciones, incluyendo plazos, condiciones, procedimiento y reembolsos.
 * 2. Presentar la información de forma clara y estructurada, con secciones, listas y subtítulos.
 * 3. Adaptación a modo oscuro y claro para una experiencia de usuario consistente.
 * 4. Banner visual atractivo que contextualiza la sección.
 *
 * Propósito:
 * Informar al cliente sobre los procedimientos de devolución y cambio de manera transparente,
 * fomentando confianza y seguridad en la experiencia de compra.
 */
import React from "react";
// Definición de contenido de la política de devoluciones
const terminoDevolucion = {
  tituloPrincipal: "Política de Devoluciones",
  introduccion:
    "En Kallewear nos esforzamos por ofrecer productos de calidad y una experiencia de compra satisfactoria. Si por alguna razón no estás conforme con tu compra, puedes solicitar un cambio o devolución siguiendo nuestras políticas descritas a continuación.",
  secciones: [
    {
      titulo: "1. Plazo para devoluciones",
      descripcion:
        "Dispones de un plazo de hasta 15 días calendario desde la fecha de recepción del pedido para solicitar la devolución o cambio de un producto.",
    },
    {
      titulo: "2. Condiciones para aceptar devoluciones",
      lista: [
        "El producto debe encontrarse en su estado original, sin signos de uso o lavado.",
        "Debe conservar las etiquetas originales y el empaque en buen estado.",
        "Se debe presentar el comprobante de compra o número de pedido.",
        "No se aceptarán devoluciones de productos en oferta o personalizados.",
      ],
    },
    {
      titulo: "3. Procedimiento para solicitar una devolución",
      listaOrdenada: [
        "Envía un correo a devoluciones@kallewear.com con el número de pedido y motivo de la devolución.",
        "Nuestro equipo evaluará tu solicitud y responderá en un plazo máximo de 3 días hábiles.",
        "Si la devolución es aprobada, te indicaremos los pasos para enviar el producto a nuestras oficinas.",
        "Una vez recibido y revisado el producto, procesaremos el cambio o reembolso correspondiente.",
      ],
    },
    {
      titulo: "4. Reembolsos",
      descripcion:
        "Si deseas el reembolso en lugar del cambio, este se realizará en la misma forma de pago utilizada en la compra. El tiempo de procesamiento del reembolso dependerá de tu entidad bancaria, pero por lo general puede tomar entre 7 a 10 días hábiles.",
    },
    {
      titulo: "5. Costos de envío",
      descripcion:
        "El cliente será responsable de los costos de envío relacionados con la devolución, salvo que el motivo sea un error por parte de Kallewear (producto defectuoso, talla o modelo incorrecto).",
    },
    {
      titulo: "6. Productos defectuosos o dañados",
      descripcion:
        "Si recibiste un producto defectuoso o dañado, por favor contáctanos inmediatamente a soporte@kallewear.com. Nuestro equipo gestionará el cambio sin costo adicional.",
    },
  ],
  parrafoFinal:
    "En Kallewear nos comprometemos a garantizar tu satisfacción. Para cualquier duda adicional, puedes contactarnos a través de nuestro correo o redes sociales.",
};

const DevolucionPage = () => {
  return (
    // 🔹 Contenedor principal: fondo claro en light, gris oscuro en dark, texto blanco por defecto en dark
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-64 bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
          alt="Banner urbano"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Título centrado debajo del banner */}
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-gray-900 dark:text-white">
          {terminoDevolucion.tituloPrincipal}
        </h1>

        {/* Introducción */}
        <p className="mb-10 text-lg leading-relaxed text-center text-gray-600 dark:text-gray-300">
          {terminoDevolucion.introduccion}
        </p>

        {/* Secciones */}
        <div className="space-y-8">
          {terminoDevolucion.secciones.map((seccion, index) => (
            // 🔹 Tarjetas: fondo blanco en light, gris oscuro en dark, sombra adaptada
            <section
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-700 p-6 hover:shadow-lg dark:hover:shadow-gray-600 transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {seccion.titulo}
              </h2>

              {seccion.descripcion && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {seccion.descripcion}
                </p>
              )}

              {seccion.lista && (
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mt-3 pl-2">
                  {seccion.lista.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}

              {seccion.listaOrdenada && (
                <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2 mt-3 pl-2">
                  {seccion.listaOrdenada.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        {/* Párrafo final */}
        <p className="mt-12 text-lg leading-relaxed text-center text-gray-600 dark:text-gray-300">
          {terminoDevolucion.parrafoFinal}
        </p>
      </div>
    </div>
  );
};

export default DevolucionPage;
