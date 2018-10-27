import { Component, OnInit } from '@angular/core';
import { ApartamentoMensaje } from '../../../../entidades/entidad.apartamentomensaje';
import { Apartamento } from '../../../../entidades/entidad.apartamento';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../servicios/auth.service';
import { Ubigeo } from '../../../../entidades/entidad.ubigeo';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';
import { ModalApartamentoComponent } from './modal-apartamento/modal-apartamento.component';

@Component({
  selector: 'app-apartamentos',
  templateUrl: './apartamentos.component.html',
  styleUrls: ['./apartamentos.component.css']
})
export class ApartamentosComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: Boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public apartamentos: any = []; // lista proyecto
  // tslint:disable-next-line:no-inferrable-types
  public apartamento_id: number;
  public mensajes: ApartamentoMensaje[];
  public parametros: Apartamento;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new Apartamento();
    this.mensajes = [];
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarApartamentos();
  }

  limpiar() {
    this.parametros = new Apartamento();
    this.parametros.ubigeo_id = new Ubigeo();
    this.apartamentos = [];
    this.listarApartamentos();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
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
      this.api.post('buscarapartamento', this.parametros).then(
        (res) => {
          console.log(res);
          this.apartamentos = res;
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

  abrirApartamentos(): void {
    const modalRef = this.modalService.open(ModalApartamentoComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarApartamentos();
    }, (reason) => {
    });
  }

  editarApartamento(id) {
    const modalRef = this.modalService.open(ModalApartamentoComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarApartamentos();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(apartamento): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(apartamento);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      apartamento.estado = !apartamento.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(apartamento) {
    this.cargando = true;
    this.api.delete('apartamentos/' + apartamento.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarApartamentos();
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
    this.api.delete('apartamentomensaje/' + mensaje.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarmensajes(this.apartamento_id, this.estadomensajes);
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

  listarApartamentos() {
    this.cargando = true;
    this.api.get('apartamentos').then(
      (res) => {
        this.apartamentos = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.apartamentos);
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

  listarmensajes(apartamento_id, estado) {
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
    this.apartamento_id = apartamento_id;
    this.api.get('mostrarapartamentomensajes/' + apartamento_id + '/' + valor).then(
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

  private mostrarApartamentoCuarto(apartamentoid) {
    const modalRef = this.modalService.open(ModalApartamentoComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.apartamentoid = apartamentoid;
    modalRef.result.then((result) => {
      // this.listarApartamentos();
    }, (reason) => {
    });
  }

  private cerrarmensajes() {
    this.vermensajes = false;
    this.listarApartamentos();
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
