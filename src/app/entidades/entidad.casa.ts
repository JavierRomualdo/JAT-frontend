import { Persona } from './entidad.persona';
export class Casa {
  id: number;
  persona_id: Persona;
  precio: number;
  largo: number;
  ancho: number;
  ubicacion: string;
  direccion: string;
  // tslint:disable-next-line:no-inferrable-types
  npisos: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  ncuartos: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  nbanios: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  tjardin: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  tcochera: boolean = false;
  descripcion: string = null;
  foto: string = null;
  path: string = null; // camino o ruta de imagenes en cloud storage de firebase
  // foto: Blob;
  // fotos: Blob [];
  estado: Boolean = true;
  casapersonaList: any = {};
  fotosList: any = {};
  serviciosList: any = {};
  casaservicioList: any = {};
}
