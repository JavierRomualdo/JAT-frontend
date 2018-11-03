import { Ubigeo } from './entidad.ubigeo';
import { Rangoprecios } from './entidadad.rangoprecios';
import { Servicios } from './entidad.servicios';

export class UbigeoGuardar {
  departamento: Ubigeo = new Ubigeo();
  provincia: Ubigeo = new Ubigeo();
  distrito: Ubigeo = new Ubigeo();
  ubigeo: Ubigeo = new Ubigeo();
  rangoprecio: Rangoprecios = new Rangoprecios();
  tiposervicio ?: String[] = [];
  propiedad ?: String;
  servicios: number[] = [];
}
