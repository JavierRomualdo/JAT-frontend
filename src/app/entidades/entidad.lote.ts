import { Persona } from './entidad.persona';
export class Lote {
    id: number;
    persona_id: Persona;
    precio: number;
    largo: number;
    ancho: number;
    ubicacion: string;
    direccion: string;
    descripcion: string = null;
    foto: string = null;
    path: string = null; // camino o ruta de imagenes en cloud storage de firebase
    // fotos: Blob[];
    estado: Boolean = true;
    lotepersonaList: any = {};
    fotosList: any = {};
}
