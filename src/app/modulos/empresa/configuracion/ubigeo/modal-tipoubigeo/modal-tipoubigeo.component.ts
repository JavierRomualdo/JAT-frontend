import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from '../../../../../servicios/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequest2Service } from '../../../../../servicios/api-request2.service';
import { ConfirmacionComponent } from '../../../../../util/confirmacion/confirmacion.component';
import { AuthService } from '../../../../../servicios/auth.service';
import { UbigeoTipo } from '../../../../../entidades/entidad.tipoubigeo';

@Component({
  selector: 'app-modal-tipoubigeo',
  templateUrl: './modal-tipoubigeo.component.html',
  styleUrls: ['./modal-tipoubigeo.component.css']
})
export class ModalTipoUbigeoComponent implements OnInit {
  public tipoubigeo: UbigeoTipo;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public tipoubigeos: any = [];
  errors: Array<Object> = [];
  public parametros: UbigeoTipo;

  public listado: Boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    private modal: NgbModal,
    public auth: AuthService
  ) {
    this.tipoubigeo = new UbigeoTipo();
    this.parametros = new UbigeoTipo();
  }

  ngOnInit() {
    this.listarTipoubigeos();
  }

  busqueda(): void {
    let nohayvacios: Boolean = false;
    if (this.parametros.tipoubigeo !== undefined && this.parametros.tipoubigeo !== '') {
      // this.toastr.info('Hay servicio datos: ' + this.parametros.servicio);
      nohayvacios = true;
    }
    if (nohayvacios) {
      console.log(this.parametros);
      this.api.post('buscartipoubigeo', this.parametros).then(
        (res) => {
          console.log(res);
          this.tipoubigeos = res;
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
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

  limpiar() {
    this.parametros = new UbigeoTipo();
    this.tipoubigeos = [];
    this.listarTipoubigeos();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.tipoubigeo = new UbigeoTipo();
  }

  listarTipoubigeos() {
    this.cargando = true;
    this.api.get('tipoubigeos').then(
      (res) => {
        this.tipoubigeos = res;
        this.cargando = false;
        console.log(res);
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

  traerParaEdicion(id) {
    this.vistaFormulario = true;
    this.verNuevo = false;
    this.cargando = true;
    this.api.get('tipoubigeos/' + id).then(
      (res) => {
        // console.log(res);
        this.tipoubigeo = res;
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

  guardarTipoUbigeo() {
    this.cargando = true;
    if (!this.tipoubigeo.id) { // guardar nuevo tipo ubigeo
      this.api.post('tipoubigeos', this.tipoubigeo).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarTipoubigeos();
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
    } else { // guardar el tipo ubigeo editado
      this.api.put('tipoubigeos/' + this.tipoubigeo.id, this.tipoubigeo).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarTipoubigeos();
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

  confirmarcambiodeestado(tipoubigeo): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadotipoubigeo(tipoubigeo);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      tipoubigeo.estado = !tipoubigeo.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadotipoubigeo(tipoubigeo) {
    this.cargando = true;
    this.api.delete('tipoubigeos/' + tipoubigeo.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarTipoubigeos();
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

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }

  enviartipoubigeo(tipoubigeo: UbigeoTipo) {
    this.activeModal.close(tipoubigeo);
  }
}
