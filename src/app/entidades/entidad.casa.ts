import { Persona } from './entidad.persona';
export class Casa {
  id: number;
  persona_id: Persona;
  precio: number;
  largo: number;
  ancho: number;
  ubicacion: string;
  direccion: string;
  npisos: number;
  ncuartos: number;
  nbaños: number;
  tjardin: boolean;
  tcochera: boolean;
  descripcion: string;
  foto: Blob;
  // fotos: Blob [];
  estado: boolean;
}
