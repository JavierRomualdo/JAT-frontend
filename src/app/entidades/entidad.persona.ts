import { Rol } from './entidad.rol';
export class Persona {
  id: number;
  rol_id: Rol;
  dni: string;
  nombres: string;
  correo: string = null;
  ubicacion: string;
  direccion: string;
  telefono: string;
  estado: Boolean = true;
  personarolList: any = {};
}
