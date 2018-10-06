import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPropiedadComponent } from './modal-propiedad/modal-propiedad.component';
import { ApiRequest2Service } from '../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../servicios/auth.service';
import { ConfirmacionComponent } from '../../../util/confirmacion/confirmacion.component';
import { Casa } from '../../../entidades/entidad.casa';
import { Persona } from '../../../entidades/entidad.persona';
import { Ubigeo } from '../../../entidades/entidad.ubigeo';
import { CasaMensaje } from '../../../entidades/entidad.casamensaje';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.css']
})
export class PropiedadesComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: Boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public casas: any = []; // lista proyecto
  public casa_id: number;
  public mensajes: CasaMensaje[];
  public parametros: Casa;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new Casa();
    this.mensajes = [];
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarPropiedades();
  }

  limpiar() {
    this.parametros = new Casa();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.casas = [];
    this.listarPropiedades();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.persona_id.nombres !== undefined &&
      this.parametros.persona_id.nombres !== '') {
        nohayvacios = true;
      }
    if (this.parametros.ubigeo_id.ubigeo !== undefined && this.parametros.ubigeo_id.ubigeo !== '') {
      // this.toastr.info('Hay servicio datos: ' + this.parametros.servicio);
      nohayvacios = true;
    }
    if (this.parametros.direccion !== undefined && this.parametros.direccion !== '') {
      // this.toastr.info('Hay detalle datos: ' + this.parametros.detalle);
      nohayvacios = true;
    }
    if (nohayvacios) {
      this.cargando = true;
      console.log(this.parametros);
      this.api.post('buscarcasa', this.parametros).then(
        (res) => {
          console.log(res);
          this.casas = res;
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
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
    } else {
      this.toastr.info('Ingrese datos');
    }
  }

  abrirPropiedades(): void {
    const modalRef = this.modalService.open(ModalPropiedadComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarPropiedades();
    }, (reason) => {
    });
  }

  editarPropiedad(id) {
    const modalRef = this.modalService.open(ModalPropiedadComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarPropiedades();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(casa): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(casa);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      casa.estado = !casa.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(casa) {
    this.cargando = true;
    this.api.delete('casas/' + casa.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarPropiedades();
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

  confirmarcambiodeestadomensaje(mensaje): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.confirmarmensajeleido(mensaje);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      mensaje.estado = !mensaje.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  confirmarmensajeleido(mensaje) {
    // this.cargando = true;
    this.api.delete('casamensaje/' + mensaje.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarmensajes(this.casa_id, this.estadomensajes);
        // this.cargando = false;
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

  listarPropiedades() {
    this.cargando = true;
    this.api.get('casas').then(
      (res) => {
        this.casas = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.casas);
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

  listarmensajes(casa_id, estado) {
    console.log('estado del mensaje: ');
    console.log(estado);
    this.estadomensajes = estado;
    let valor = 1;
    if (estado === false) {
      valor = 0;
    }
    console.log(valor);
    this.cargando = true;
    this.vermensajes = true;
    this.casa_id = casa_id;
    this.api.get('mostrarcasamensajes/' + casa_id + '/' + valor).then(
      (res) => {
        this.mensajes = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.mensajes);
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

  private cerrarmensajes() {
    this.vermensajes = false;
    this.listarPropiedades();
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
