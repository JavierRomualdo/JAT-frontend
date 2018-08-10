import { UbigeoTipo } from './entidad.tipoubigeo';

export class Ubigeo {
  id: number;
  tipoubigeo_id: UbigeoTipo;
  ubigeo: string;
  codigo: string = null;
  estado: Boolean = true;
}
