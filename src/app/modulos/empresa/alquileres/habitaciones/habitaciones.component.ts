import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalHabitacionComponent } from './modal-habitacion/modal-habitacion.component';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../servicios/auth.service';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';
import { Habitacion } from '../../../../entidades/entidad.habitacion';
import { Persona } from '../../../../entidades/entidad.persona';
@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public  habitaciones: any = []; // lista proyecto
  public parametros: Habitacion;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new Habitacion();
    this.parametros.persona_id = new Persona();
  }

  ngOnInit() {
    this.listarHabitaciones();
  }

  limpiar() {
    this.parametros = new Habitacion();
    this.parametros.persona_id = new Persona();
    this.habitaciones = [];
    this.listarHabitaciones();
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
      this.api.post('buscarhabitacion', this.parametros).then(
        (res) => {
          console.log(res);
          this.habitaciones = res;
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

  abrirHabitaciones(): void {
    const modalRef = this.modalService.open(ModalHabitacionComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarHabitaciones();
    }, (reason) => {
    });
  }

  editarHabitacion(id) {
    const modalRef = this.modalService.open(ModalHabitacionComponent, {size: 'lg', keyboard: false});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarHabitaciones();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(habitacion): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(habitacion);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      habitacion.estado = !habitacion.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(habitacion) {
    this.cargando = true;
    this.api.delete('habitaciones/' + habitacion.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarHabitaciones();
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

  listarHabitaciones() {
    this.cargando = true;
    this.api.get('habitaciones').then(
      (res) => {
        this.habitaciones = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.habitaciones);
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
