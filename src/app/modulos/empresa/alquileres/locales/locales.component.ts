import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalLocalComponent } from './modal-local/modal-local.component';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../servicios/auth.service';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';
import { Persona } from '../../../../entidades/entidad.persona';
import { Local } from '../../../../entidades/entidad.local';
@Component({
  selector: 'app-locales',
  templateUrl: './locales.component.html',
  styleUrls: ['./locales.component.css']
})
export class LocalesComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public  locales: any = []; // lista proyecto
  public parametros: Local;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new Local();
    this.parametros.persona_id = new Persona();
  }

  ngOnInit() {
    this.listarLocales();
  }

  limpiar() {
    this.parametros = new Local();
    this.parametros.persona_id = new Persona();
    this.locales = [];
    this.listarLocales();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.persona_id.nombres !== undefined &&
      this.parametros.persona_id.nombres !== '') {
        nohayvacios = true;
      }
    if (this.parametros.ubicacion !== undefined && this.parametros.ubicacion !== '') {
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
      this.api.post('buscarlocal', this.parametros).then(
        (res) => {
          console.log(res);
          this.locales = res;
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

  abrirLocales(): void {
    const modalRef = this.modalService.open(ModalLocalComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarLocales();
    }, (reason) => {
    });
  }

  editarLocal(id) {
    const modalRef = this.modalService.open(ModalLocalComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarLocales();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(local): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(local);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      local.estado = !local.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(local) {
    this.cargando = true;
    this.api.delete('locales/' + local.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarLocales();
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

  listarLocales() {
    this.cargando = true;
    this.api.get('locales').then(
      (res) => {
        this.locales = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.locales);
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
