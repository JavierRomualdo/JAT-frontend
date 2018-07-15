import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from '../../../../servicios/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { Rol } from '../../../../entidades/entidad.rol';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';
import { AuthService } from '../../../../servicios/auth.service';

@Component({
  selector: 'app-modal-rol',
  templateUrl: './modal-rol.component.html',
  styleUrls: ['./modal-rol.component.css']
})
export class ModalRolComponent implements OnInit {
  public rol: Rol;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public roles: any = [];
  errors: Array<Object> = [];
  public parametros: Rol;

  public listado: Boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    private modal: NgbModal,
    public auth: AuthService
  ) {
    this.rol = new Rol();
    this.parametros = new Rol();
  }

  ngOnInit() {
    this.listarRoles();
  }

  busqueda(): void {
    console.log(this.parametros);
    this.api.post('busquedaRoles', this.parametros).then(
      (res) => {
        console.log(res);
        this.roles = res;
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
    this.parametros = new Rol();
    this.roles = [];
    this.listarRoles();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.rol = new Rol();
  }

  listarRoles() {
    this.cargando = true;
    this.api.get('roles').then(
      (res) => {
        this.roles = res;
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
    this.api.get('roles/' + id).then(
      (res) => {
        // console.log(res);
        this.rol = res;
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

  guardarRol() {
    this.cargando = true;
    if (!this.rol.id) { // guardar nuevo rol
      this.api.post('roles', this.rol).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarRoles();
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
      this.api.put('roles/' + this.rol.id, this.rol).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarRoles();
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
    /*this.api.post('api/roles', this.rol)
        .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
                this.rol = respuesta.extraInfo;
                this.toastr.success('Registro guardado exitosamente', 'Exito');
                // this.cargando = false;
                this.listado = true;
                this.listarroles();
                this.vistaFormulario = false;
            } else {
                // this.cargando=false;
                this.toastr.error(respuesta.operacionMensaje, 'Error');
            }
        })
        .catch(err => this.handleError(err));*/
  }

  confirmarcambiodeestado(rol): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadorol(rol);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      rol.estado = !rol.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadorol(rol) {
    this.cargando = true;
    this.api.delete('roles/' + rol.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarRoles();
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

  enviarrol(rol: Rol) {
    this.activeModal.close(rol);
  }
}
