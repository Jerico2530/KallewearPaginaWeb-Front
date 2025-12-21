import {FaUser,FaCalendarAlt,FaIdCard,FaEnvelope,FaLock,} from "react-icons/fa";

export const camposUsuario = [
  { name: "nombreCompleto", placeholder: "Nombre completo", icon: <FaUser className="absolute left-3 top-3 text-gray-400" />, type: "text" },
  { name: "apellidoCompleto", placeholder: "Apellido completo", icon: <FaUser className="absolute left-3 top-3 text-gray-400" />, type: "text" },
  { name: "fechaNacimiento", placeholder: "Fecha de nacimiento", icon: <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />, type: "date" },
  { name: "dni", placeholder: "DNI", icon: <FaIdCard className="absolute left-3 top-3 text-gray-400" />, type: "text" },
  { name: "correoElectronico", placeholder: "Correo electrónico", icon: <FaEnvelope className="absolute left-3 top-3 text-gray-400" />, type: "email" },
  { name: "contraseña", placeholder: "Contraseña", icon: <FaLock className="absolute left-3 top-3 text-gray-400" />, type: "password" },
  { name: "contraseñaVisible", placeholder: "Repetir contraseña", icon: <FaLock className="absolute left-3 top-3 text-gray-400" />, type: "password" },
];