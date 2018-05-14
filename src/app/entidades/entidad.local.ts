import { Persona } from './entidad.persona';
export class Local {
    id: number;
    persona_id: Persona;
    precio: number;
    largo: number;
    ancho: number;
    ubicacion: string;
    direccion: string;
    nbaños: number;
    descripcion: string;
    foto: Blob;
    // fotos: Blob[];
    estado: boolean;
}
