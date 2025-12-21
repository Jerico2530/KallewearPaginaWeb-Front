export const mapToPayload = (data) => ({
  NombreCompleto: data.nombreCompleto,
  ApellidoCompleto: data.apellidoCompleto,
  FechaNacimiento: data.fechaNacimiento || null,
  DNI: data.dni.toString(),
  CorreoElectronico: data.correoElectronico,
  Imagen: data.imagen || "",
  Contraseña: data.contraseña,
  ContraseñaVisible: data.contraseñaVisible,
  Estado: true,
});