/**
 * TerminosPage.jsx
 *
 * Descripción del proyecto:
 * Página de "Términos y Condiciones de Uso" de Kallewear, diseñada para informar
 * a los usuarios sobre las normas, derechos y responsabilidades al utilizar el sitio web.
 *
 * Funcionalidades clave:
 * 1. Presenta los términos y condiciones de manera estructurada y clara.
 * 2. Secciones dinámicas con títulos, descripciones y listas para mejorar la lectura.
 * 3. Párrafo final que refuerza la aceptación de los términos por parte del usuario.
 * 4. Estilo limpio y responsivo, con adaptación a modo claro y oscuro.
 *
 */

import React from "react";

const terminosCondiciones = {
  tituloPrincipal: "Términos y Condiciones de Uso",
  introduccion:
    "Bienvenido a Kallewear. Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones. Te recomendamos leerlos cuidadosamente antes de realizar cualquier compra o registrarte en nuestro sitio.",

  secciones: [
    {
      titulo: "1. Información general",
      descripcion:
        "Kallewear es una marca registrada que opera en Perú bajo razón social ficticia 'Kallewear S.A.C.'. Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento, por lo que te sugerimos revisarlos periódicamente.",
    },
    {
      titulo: "2. Uso del sitio web",
      lista: [
        "El usuario se compromete a utilizar el sitio únicamente para fines lícitos.",
        "Queda prohibido realizar compras con información falsa o no autorizada.",
        "El contenido del sitio web (imágenes, textos, diseños) está protegido por derechos de autor y no puede ser utilizado sin autorización previa.",
      ],
    },
    {
      titulo: "3. Registro de usuarios",
      descripcion:
        "Para acceder a ciertos servicios, el usuario debe registrarse proporcionando información verídica y actualizada. Kallewear se reserva el derecho de suspender cuentas que contengan datos falsos o que infrinjan nuestras políticas.",
    },
    {
      titulo: "4. Precios y disponibilidad",
      descripcion:
        "Los precios y disponibilidad de productos pueden variar sin previo aviso. En caso de error tipográfico o de sistema que afecte el precio o características de un producto, Kallewear podrá cancelar la compra y notificar al cliente.",
    },
    {
      titulo: "5. Envíos y entregas",
      descripcion:
        "Realizamos envíos a todo el Perú a través de operadores logísticos seleccionados. Los plazos y costos de entrega dependerán de la ubicación del cliente y serán detallados durante el proceso de compra.",
    },
    {
      titulo: "6. Devoluciones y cambios",
      descripcion:
        "El cliente tiene derecho a solicitar cambios o devoluciones bajo las condiciones establecidas en nuestra Política de Devoluciones, disponible en la sección correspondiente de nuestro sitio web.",
    },
    {
      titulo: "7. Protección de datos personales",
      descripcion:
        "Kallewear respeta tu privacidad. La información personal proporcionada será tratada de acuerdo con nuestra Política de Privacidad, cumpliendo con la normativa vigente en protección de datos personales en Perú.",
    },
    {
      titulo: "8. Contacto",
      descripcion:
        "Para consultas o reclamos, puedes escribirnos al correo soporte@kallewear.com o llamarnos al +51 123456789.",
    },
  ],

  parrafoFinal:
    "El uso continuo de nuestro sitio implica la aceptación de estos términos y condiciones. Gracias por confiar en Kallewear.",
};

const TerminosPage = () => {
  return (
    // Contenedor principal: centrado, ancho máximo, padding y tipografía legible
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      {/* Título principal */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        {terminosCondiciones.tituloPrincipal}
      </h1>
      {/* Introducción */}
      <p className="mb-6 text-gray-600 leading-relaxed">
        {terminosCondiciones.introduccion}
      </p>
      {/* Secciones de términos */}
      {terminosCondiciones.secciones.map((seccion, index) => (
        <section className="mb-8" key={index}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            {seccion.titulo}
          </h2>

          {seccion.descripcion && (
            <p className="text-gray-600">{seccion.descripcion}</p>
          )}

          {seccion.lista && (
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              {seccion.lista.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {/* Párrafo final */}
      <p className="text-gray-600">{terminosCondiciones.parrafoFinal}</p>
    </div>
  );
};

export default TerminosPage;
