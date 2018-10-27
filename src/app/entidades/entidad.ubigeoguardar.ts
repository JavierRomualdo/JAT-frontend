import { Ubigeo } from './entidad.ubigeo';
import { Rangoprecios } from './entidadad.rangoprecios';
import { Servicios } from './entidad.servicios';

export class UbigeoGuardar {
  departamento: Ubigeo;
  provincia: Ubigeo;
  distrito: Ubigeo;
  ubigeo: Ubigeo;
  rangoprecio: Rangoprecios;
  tiposervicio ?: String[] = [];
  propiedad ?: String;
  servicios: number[] = [];
}
