import { Persona } from './entidad.persona';
export class Habitacion {
  id: number;
  persona_id: Persona;
  precio: number;
  largo: number;
  ancho: number;
  ubicacion: string;
  direccion: string;
  camas: number;
  tbaños: boolean;
  descripcion: string;
  foto: Blob;
  // fotos: Blob [];
  estado: boolean;
}
