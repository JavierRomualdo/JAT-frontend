import { Component, OnInit } from '@angular/core';
import { CocheraMensaje } from '../../../../entidades/entidad.cocheramensaje';
import { Cochera } from '../../../../entidades/entidad.cochera';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../servicios/auth.service';
import { Persona } from '../../../../entidades/entidad.persona';
import { Ubigeo } from '../../../../entidades/entidad.ubigeo';
import { ModalCocheraComponent } from './modal-cochera/modal-cochera.component';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';

@Component({
  selector: 'app-cocheras',
  templateUrl: './cocheras.component.html',
  styleUrls: ['./cocheras.component.css']
})
export class CocherasComponent implements OnInit {

  public cargando: Boolean = false;
  public vermensajes: Boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public cocheras: any = []; // lista proyecto
  public cochera_id: number;
  public mensajes: CocheraMensaje[];
  public parametros: Cochera;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new Cochera();
    this.mensajes = [];
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarCocheras();
  }

  limpiar() {
    this.parametros = new Cochera();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.cocheras = [];
    this.listarCocheras();
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
      this.api.post('buscarcochera', this.parametros).then(
        (res) => {
          console.log(res);
          this.cocheras = res;
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

  abrirCocheras(): void {
    const modalRef = this.modalService.open(ModalCocheraComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarCocheras();
    }, (reason) => {
    });
  }

  editarCochera(id) {
    const modalRef = this.modalService.open(ModalCocheraComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarCocheras();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(cochera): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(cochera);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      cochera.estado = !cochera.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(cochera) {
    this.cargando = true;
    this.api.delete('cocheras/' + cochera.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarCocheras();
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
    this.api.delete('cocheramensaje/' + mensaje.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarmensajes(this.cochera_id, this.estadomensajes);
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

  listarCocheras() {
    this.cargando = true;
    this.api.get('cocheras').then(
      (res) => {
        this.cocheras = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.cocheras);
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

  listarmensajes(cochera_id, estado) {
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
    this.cochera_id = cochera_id;
    this.api.get('mostrarcocheramensajes/' + cochera_id + '/' + valor).then(
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
    this.listarCocheras();
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
