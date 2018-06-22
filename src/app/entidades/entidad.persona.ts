import { Rol } from './entidad.rol';
export class Persona {
  id: number;
  rol_id: Rol;
  dni: string;
  nombres: string;
  correo: string;
  ubicacion: string;
  direccion: string;
  telefono: string;
  estado: boolean;
  personarolList: any = {};
}
