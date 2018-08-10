import { Persona } from './entidad.persona';
export class Local {
    id: number;
    persona_id: Persona;
    precio: number;
    largo: number;
    ancho: number;
    ubicacion: string;
    direccion: string;
    tbanio: Boolean = false;
    descripcion: string;
    foto: string = null;
    path: string = null; // camino o ruta de imagenes en cloud storage de firebase
    // foto: Blob;
    // fotos: Blob[];
    estado: Boolean = true;
    localpersonaList: any = {};
    fotosList: any = {};
    serviciosList: any = {};
    localservicioList: any = {};
}
