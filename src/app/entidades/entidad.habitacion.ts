import { Persona } from './entidad.persona';
export class Habitacion {
  id: number;
  persona_id: Persona;
  precio: number;
  largo: number;
  ancho: number;
  ubicacion: string;
  direccion: string;
  // tslint:disable-next-line:no-inferrable-types
  ncamas: number = 0;
  tbanio: Boolean = false;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // fotos: Blob [];
  estado: Boolean = true;
  habitacionpersonaList: any = {};
  fotosList: any = {};
  serviciosList: any = {};
  habitacionservicioList: any = {};
}
