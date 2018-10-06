import { Rol } from './entidad.rol';
import { Ubigeo } from './entidad.ubigeo';

export class Persona {
  id: number;
  rol_id: Rol;
  ubigeo_id: Ubigeo;
  dni: string;
  nombres: string;
  correo: string = null;
  direccion: string;
  telefono: string;
  estado: Boolean = true;
  personarolList: any = {};
}
