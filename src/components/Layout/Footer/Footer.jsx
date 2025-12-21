import React from "react";
import { Link } from "react-router-dom";
import footerLogo from "../../../assets/logo.png";
import { FooterLinks, FooterLinks2 } from "../../../config/footerLinks";
import SocialLinks from "./SocialLinks";
import { FaLocationArrow, FaMobileAlt } from "react-icons/fa";

/**
 * Footer.jsx
 * -------------------------------------------------
 * Componente de pie de página corporativo para Kallewear.
 * Diseñado para integrarse con React Router y TailwindCSS.

 * Características destacadas:
 * Uso de mapas de enlaces desde configuración externa (FooterLinks / FooterLinks2) → escalabilidad y mantenimiento.
 * Carga diferida de imágenes con `loading="lazy"` → optimización de performance.
 * Accesibilidad y enfoque visual (focus:ring, transition) → experiencia profesional.
 * Modularidad: SocialLinks como componente independiente.

 */

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14">
        <div className="grid gap-12 md:grid-cols-3">

          {/* 
              SECCIÓN 1: Marca y descripción
              Propósito: Refuerza identidad de marca y storytelling.
          */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-4">
              <img src={footerLogo} alt="Logo Kallewear" className="w-12" loading="lazy" />
              <span className="text-white">Kallewear</span>
            </h1>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Marca de ropa urbana independiente. Diseñamos prendas con identidad para quienes no siguen reglas, fusionando estilo, actitud y cultura callejera.
            </p>
          </div>

          {/*
              SECCIÓN 2: Navegación
              Propósito: Acceso rápido a secciones importantes.
              - Explora la tienda (FooterLinks)
              - Centro de ayuda (FooterLinks2)
              - Escalable para agregar nuevas secciones.
          */}
          <div className="grid grid-cols-2 gap-8">
            {/* Explora la tienda */}
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Explora la tienda
              </h2>
              <ul className="flex-1 flex flex-col justify-start space-y-3">
                {FooterLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={link.link}
                      className="hover:text-secondary hover:translate-x-1 inline-block transition duration-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Centro de ayuda */}
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Centro de ayuda
              </h2>
              <ul className="flex-1 flex flex-col justify-start space-y-3">
                {FooterLinks2.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={link.link}
                      className="hover:text-secondary hover:translate-x-1 inline-block transition duration-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 
              SECCIÓN 3: Contacto y redes sociales
              Propósito: Facilita interacción directa y refuerza confianza.
              - SocialLinks como componente independiente para reuso
              - Información de contacto con iconografía vectorial
          */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-white">Conéctate con nosotros</h2>
            <SocialLinks />
            <div className="space-y-3 text-sm md:text-base mt-4">
              <div className="flex items-center gap-3">
                <FaLocationArrow className="text-white" />
                <p>Lima, Perú</p>
              </div>
              <div className="flex items-center gap-3">
                <FaMobileAlt className="text-white" />
                <p>+51 123 456 789</p>
              </div>
            </div>
          </div>

        </div>

         {/*
            LÍNEA INFERIOR: Derechos de autor
            Propósito: Elemento obligatorio legal y corporativo.
            - Año dinámico
            - Nombre de marca destacado
         */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-xs sm:text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="text-white">Kallewear</span>. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
