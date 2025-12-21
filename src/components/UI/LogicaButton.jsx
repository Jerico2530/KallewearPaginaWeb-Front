import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus ,FaFileExcel  } from "react-icons/fa";
import IconButton from "./IconButton";

// Botón de Editar
export const EditButton = ({ onClick }) => (
  <IconButton 
    icon={<FaEdit className="text-sm sm:text-xs md:text-sm" />} 
    color="bg-blue-500" 
    darkColor="dark:bg-blue-700" 
    size={8} 
    onClick={onClick} 
  />
);


// Botón de Excel
export const ExcelButton = ({ onClick }) => (
  <IconButton
    icon={<FaFileExcel className="text-sm sm:text-xs md:text-sm" />}
    color="bg-green-600"
    darkColor="dark:bg-green-700"
    size={8}
    onClick={onClick}
  />
);


// Botón de Eliminar
export const DeleteButton = ({ onClick }) => (
  <IconButton
    icon={<FaTrash className="text-sm sm:text-xs md:text-sm" />}
    color="bg-red-500"
    darkColor="dark:bg-red-700"
    size={8}
    onClick={onClick}
  />
);

// Botón de Guardar
export const SaveButton = ({ onClick }) => (
  <IconButton 
    icon={<FaCheck className="text-sm sm:text-xs md:text-sm" />} 
    color="bg-green-600" 
    darkColor="dark:bg-green-700"
    size={8}
    onClick={onClick} 
  />
);

// Botón de Cancelar
export const CancelButton = ({ onClick }) => (
  <IconButton 
    icon={<FaTimes className="text-sm sm:text-xs md:text-sm" />} 
    color="bg-gray-400" 
    darkColor="dark:bg-gray-600"
    size={8}
    onClick={onClick} 
  />
);

// Botón de Agregar (formulario)
export const AddButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="
      bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 
      text-white rounded-lg px-4 py-2 sm:px-3 sm:py-1 md:px-5 md:py-2
      flex items-center gap-2 sm:gap-1 md:gap-3 
      shadow-lg transition transform hover:scale-105
      text-sm sm:text-xs md:text-sm
    "
  >
    <FaPlus className="text-sm sm:text-xs md:text-sm" /> {label || "Agregar"}
  </button>
);
