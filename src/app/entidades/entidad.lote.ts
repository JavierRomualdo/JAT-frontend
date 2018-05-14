import { Persona } from './entidad.persona';
export class Lote {
    id: number;
    persona_id: Persona;
    precio: number;
    largo: number;
    ancho: number;
    ubicacion: string;
    direccion: string;
    descripcion: string;
    foto: Blob;
    // fotos: Blob[];
    estado: boolean;
}
