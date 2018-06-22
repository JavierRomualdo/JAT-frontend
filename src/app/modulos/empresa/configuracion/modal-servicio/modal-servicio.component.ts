import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../servicios/auth.service';
import { Servicios } from '../../../../entidades/entidad.servicios';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';

@Component({
  selector: 'app-modal-servicio',
  templateUrl: './modal-servicio.component.html',
  styleUrls: ['./modal-servicio.component.css']
})
export class ModalServicioComponent implements OnInit {
  public servicio: Servicios;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public servicios: any = [];
  errors: Array<Object> = [];
  public parametros: Servicios;

  public listado: Boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private modal: NgbModal,
    public auth: AuthService
  ) {
    this.servicio = new Servicios();
    this.parametros = new Servicios();
  }

  ngOnInit() {
    this.listarServicios();
  }

  busqueda(): void {
    console.log(this.parametros);
    this.api.post('busquedaServicios', this.parametros).then(
      (res) => {
        console.log(res);
        this.servicios = res;
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
  }

  limpiar() {
    this.parametros = new Servicios();
    this.servicios = [];
    this.listarServicios();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.servicio = new Servicios();
  }

  listarServicios() {
    this.cargando = true;
    this.api.get('servicios').then(
      (res) => {
        this.servicios = res;
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
    this.api.get('servicios/' + id).then(
      (res) => {
        // console.log(res);
        this.servicio = res;
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

  guardarServicio() {
    this.cargando = true;
    if (!this.servicio.id) { // guardar nuevo servicio
      this.api.post('servicios', this.servicio).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarServicios();
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
    } else { // guardar el servicio editado
      this.api.put('servicios/' + this.servicio.id, this.servicio).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarServicios();
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

  confirmarcambiodeestado(servicio): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(servicio);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      servicio.estado = !servicio.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(servicio) {
    this.cargando = true;
    this.api.delete('servicios/' + servicio.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarServicios();
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
}
