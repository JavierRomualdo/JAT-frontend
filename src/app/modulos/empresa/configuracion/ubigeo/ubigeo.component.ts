import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { Users } from '../../../../entidades/entidad.users';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';
import { AuthService } from '../../../../servicios/auth.service';
import { ModalUbigeoComponent } from './modal-ubigeo/modal-ubigeo.component';
import { ModalTipoUbigeoComponent } from './modal-tipoubigeo/modal-tipoubigeo.component';
import { UbigeoGuardar } from '../../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../../entidades/entidad.ubigeo';

@Component({
  selector: 'app-ubigeo',
  templateUrl: './ubigeo.component.html',
  styleUrls: ['./ubigeo.component.css']
})
export class UbigeoComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public ubigeos: any = []; // lista proyecto
  public parametros: UbigeoGuardar;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new UbigeoGuardar();
    this.parametros.departamento = null;
    this.parametros.provincia = null;
    this.parametros.ubigeo = new Ubigeo();
  }

  ngOnInit() {
    this.listarUbigeos();
  }
  // Metodos para abrir los modales
  abrirUbigeos() {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirTipoUbigeos() {
    const modalRef = this.modalService.open(ModalTipoUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  editarUbigeo(id) {
    const modalRef = this.modalService.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    // asi... le pasamos el parametro id del usuario en el modal-usuario :p
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarUbigeos();
    }, (reason) => {
    });
  }

  listarUbigeos() {
    this.cargando = true;
    this.api.get('ubigeos').then(
      (res) => {
        this.ubigeos = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.ubigeos);
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

  confirmarcambiodeestado(usuario): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(usuario);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      usuario.estado = !usuario.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(usuario) {
    this.cargando = true;
    this.api.delete('usuarios/' + usuario.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarUbigeos();
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

  limpiar() {
    this.parametros = new UbigeoGuardar();
    this.parametros.departamento = null;
    this.parametros.provincia = null;
    this.parametros.ubigeo = new Ubigeo();

    this.ubigeos = [];
    this.listarUbigeos();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.ubigeo.ubigeo !== undefined && this.parametros.ubigeo.ubigeo !== '') {
      // this.toastr.info('Hay servicio datos: ' + this.parametros.servicio);
      nohayvacios = true;
    }
    if (nohayvacios) {
      console.log(this.parametros);
      this.api.post('buscarubigeos', this.parametros).then(
        (res) => {
          console.log(res);
          this.ubigeos = res;
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

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
