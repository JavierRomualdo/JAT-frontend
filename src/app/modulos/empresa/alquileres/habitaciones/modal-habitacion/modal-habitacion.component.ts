import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Habitacion } from '../../../../../entidades/entidad.habitacion';
import { FileItem } from '../../../../../entidades/file-item';
import { Servicios } from '../../../../../entidades/entidad.servicios';
import { Habitacionservicio } from '../../../../../entidades/entidad.habitacionservicio';
import { Foto } from '../../../../../entidades/entidad.foto';
import { Persona } from '../../../../../entidades/entidad.persona';
import { CargaImagenesService } from '../../../../../servicios/carga-imagenes.service';
import { ApiRequest2Service } from '../../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';

import { ModalPersonaComponent } from '../../../configuracion/empresa/modal-persona/modal-persona.component';
import { ModalServicioComponent } from '../../../configuracion/empresa/modal-servicio/modal-servicio.component';
import { ConfirmacionComponent } from '../../../../../util/confirmacion/confirmacion.component';
import { UbigeoGuardar } from '../../../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../../../entidades/entidad.ubigeo';
import { ModalUbigeoComponent } from '../../../configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { AuthService } from '../../../../../servicios/auth.service';
@Component({
  selector: 'app-modal-habitacion',
  templateUrl: './modal-habitacion.component.html',
  styleUrls: ['./modal-habitacion.component.css']
})
export class ModalHabitacionComponent implements OnInit {
  @Input() edit;
  public verNuevo = false;
  public cargando: Boolean = false;
  public habitacion: Habitacion;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public habitacionservicios: Habitacionservicio[];
  public fotos: Foto[];
  public persona: Persona;
  public listaLP: any = []; // lista de persona-roles
  public ubigeo: UbigeoGuardar;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public _cargaImagenes: CargaImagenesService,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService
  ) {
    this.habitacion = new Habitacion();
    this.fotos = [];
    this.servicios = [];
    this.persona = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.archivos = [];
    this.listaLP = [];
  }

  ngOnInit() {
    if (this.edit) {
      this.traerParaEdicion(this.edit);
    }
  }

  guardarHabitacion() {
    console.log('vamos a guardar una habitacion');
    this.cargando = true;
    this.habitacion.habitacionpersonaList = this.listaLP;
    this.habitacion.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    this.habitacion.ubigeo_id = this.ubigeo.ubigeo;
    this.habitacion.serviciosList = this.servicios;
    if (!this.edit) { // guardar nueva habitacion
      // guardar en lista fotos
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.habitacion.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.habitacion.fotosList);
      console.log('antes de guardar habitacion: ');
      console.log(this.habitacion);
      this.api.post('habitaciones', this.habitacion).then(
        (res) => {
          console.log('se guardo estos datos: ');
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.verNuevo = false;
          this.activeModal.close(this.habitacion);
        },
        (error) => {
          if (error.status === 422) {
            this.errors = [];
            const errors = error.json();
            console.log('Error');
            this.cargando = false;
            this.handleError(error);
            /*for (const key in errors) {
              this.errors.push(errors[key]);
            }*/
          }
        }
      ).catch(err => this.handleError(err));
    } else { // guardar el rol editado
      // guardar en lista fotos
      let fotos: Foto[];
      fotos = [];
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        fotos.push(foto);
      }
      this.habitacion.fotosList = fotos;
      this.habitacion.habitacionservicioList = this.habitacionservicios;
      fotos = [];
      console.log('fotos: ');
      console.log(this.habitacion.fotosList);
      console.log('antes de editar propiedad: ');
      console.log(this.habitacion);
      this.api.put('habitaciones/' + this.habitacion.id, this.habitacion).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.verNuevo = false;
          this.activeModal.close(this.habitacion);
        },
        (error) => {
          if (error.status === 422) {
            this.errors = [];
            const errors = error.json();
            console.log('Error Interno');
            this.cargando = false;
            this.handleError(error);
            /*for (const key in errors) {
              this.errors.push(errors[key]);
            }*/
          }
        }
      ).catch(err => this.handleError(err));
    }
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.api.get('habitaciones/' + id).then(
      (res) => {
        // console.log(res);
        this.habitacion = res;
        this.listaLP = res.habitacionpersonaList;
        this.persona = this.listaLP[0];
        this.ubigeo = res.ubigeo;
        this.servicios = res.serviciosList;
        this.habitacionservicios = res.habitacionservicioList;

        for (const item of res.fotosList) {
          console.log('foto: ');
          console.log(item);
          this.fotos.push(item);
        }
        console.log('fotoss : ');
        console.log(this.fotos);
        // this.fotos = res.fotosList;
        console.log('traido para edicion');
        console.log(this.habitacion);
        this.habitacion.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
        // traer archivos de firebase storage
        // this._cargaImagenes.getImagenes(res.path);

        // aqui metodo para mostrar todas las imagenes de este propiedad ....
        // this.imagen = res.foto;
        // this.imagenAnterior = res.foto;
        this.cargando = false;
      },
      (error) => {
        if (error.status === 422) {
          this.errors = [];
          const errors = error.json();
          console.log('Error');
          this.cargando = false;
          /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
        }
      }
    ).catch(err => this.handleError(err));
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(ModalPersonaComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      this.persona = result;
      this.habitacion.persona_id = result;
      this.listaLP[0] = result;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  buscarubigeo() {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      console.log('ubigeoguardar:');
      console.log(result);
      this.ubigeo = result;
      this.habitacion.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  buscarservicio() {
    const modalRef = this.modalService.open(ModalServicioComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      let tieneservicio: Boolean = false;
      for (const servicio of this.servicios) {
        if (result.id === servicio.id) {
          console.log('si tiene servicio');
          tieneservicio = true;
        }
      }

      if (tieneservicio) {
        this.toastr.info('El servicio ya esta asignado');
      } else {
        this.servicios.push(result);
      }
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  cargarImagenes() {
    let estadetalle: Boolean = true;
    for (const item of this.archivos) {
      if (item.detalle === '' || item.detalle === null || item.detalle === undefined) {
        // aqui falta el detalle (input type text) del archivo que obligatoriamente debe tener contenido
        estadetalle = false;
      }
    }
    if (estadetalle) {
      this.habitacion.path = 'habitaciones/' + this.persona.dni;
      this._cargaImagenes.cargarImagenesFirebase(this.habitacion.path, this.archivos);
    } else {
      this.toastr.info('Ya esta asignado');
    }
  }

  limpiarArchivos() {
    this.archivos = [];
  }

  limpiarhabitacion() {
    // limpiar persona
    this.persona = new Persona();
    this.habitacion.persona_id = new Persona();
    this.habitacion.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.listaLP = [];
    // limpiar foto
    this.habitacion.foto = null;
    // limpiar servicios
    this.servicios = [];
    this.habitacionservicios = [];
    this.habitacion.serviciosList = {};
    this.habitacion.habitacionservicioList = {};
  }

  quitarservicio(servicio: Servicios) {
    const index = this.servicios.indexOf(servicio);
    this.servicios.splice(index, 1);
    // eliminamos en habitacionservicios
    let i = 0;
    for (const habitacionservicio of this.habitacionservicios) {
      if (servicio.id === habitacionservicio.servicio_id) {
        this.habitacionservicios.splice(i, 1);
      }
      i++;
    }
    // this.habitacionservicios.splice(index, 1);
    console.log('los habitacionservicios quedan: ');
    console.log(this.servicios);
    console.log('los habitacionservicios quedad');
    console.log(this.habitacionservicios);
  }

  quitarfoto(item: FileItem) {
    const index = this.archivos.indexOf(item);
    this.archivos.splice(index, 1);
    console.log('las fotos que quedan: ');
    console.log(this.archivos);
  }

  guardardetallefoto(foto: Foto) {
    console.log('salio del foco');
    this.api.put('habitaciones/' + foto.id, foto).then(
      (res) => {
        console.log('se ha modificado foto:');
        console.log(res);
      },
      (error) => {
        console.log('error: ');
      }
    ).catch(err => this.handleError(err));
  }

  //
  quitarfotohabitacion(foto: Foto) {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      // elimino de la bd
      this.eliminarfotohabitacion(foto);
      // elimino de firebase storage
      this._cargaImagenes.deleteArchivo(this.habitacion.path, foto.nombre);
      if (this.habitacion.foto === foto.foto) {
        this.habitacion.foto = null;
      }
      this.toastr.success(result.operacionMensaje, 'Exito');
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  eliminarfotohabitacion(foto: Foto) {
    this.api.delete('habitacionfoto/' + foto.id).then(
      (res) => {
        console.log('se ha eliminado:');
        console.log(res);
        const index = this.fotos.indexOf(foto);
        this.fotos.splice(index, 1);
      },
      (error) => {
        console.log('error: ');
      }
    ).catch(err => this.handleError(err));
  }

  mostrarFotoPrincipal(item: FileItem) {
    if (item.progreso >= 100 ) {
      this.habitacion.foto = item.url;
    }
  }

  mostrarFotoPrincipalExistente(foto: Foto) {
    this.habitacion.foto = foto.foto;
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
