import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiRequest2Service } from '../../../../../servicios/api-request2.service';
import { ConfirmacionComponent } from '../../../../../util/confirmacion/confirmacion.component';
import { AuthService } from '../../../../../servicios/auth.service';
import { Ubigeo } from '../../../../../entidades/entidad.ubigeo';
import { UbigeoTipo } from '../../../../../entidades/entidad.tipoubigeo';

@Component({
  selector: 'app-modal-ubigeo',
  templateUrl: './modal-ubigeo.component.html',
  styleUrls: ['./modal-ubigeo.component.css']
})
export class ModalUbigeoComponent implements OnInit {
  public ubigeo: Ubigeo;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public ubigeodepartamentos: Ubigeo[];
  public ubigeoprovincias: Ubigeo[];
  public ubigeos: Ubigeo[]; // son ubigeos de distritos que muestra en la tabla
  public tipoubigeos: UbigeoTipo[];
  // tslint:disable-next-line:no-inferrable-types
  public idTipoUbigeo: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoDepartamento: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoProvincia: number = 0;
  errors: Array<Object> = [];
  public parametros: Ubigeo;

  public listado: Boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    private modal: NgbModal,
    public auth: AuthService
  ) {
    this.ubigeo = new Ubigeo();
    this.ubigeodepartamentos = [];
    this.ubigeoprovincias = [];
    this.ubigeos = [];
    this.tipoubigeos = [];
    this.parametros = new Ubigeo();
  }

  ngOnInit() {
    // this.listarUbigeos();
    // por defecto se debe listar tipoubigeo 1 (departamentos)
    this.listarCiudades(1); // Departamentos (por defecto)
  }

  busqueda(): void {
    let nohayvacios: Boolean = false;
    if (this.parametros.ubigeo !== undefined && this.parametros.ubigeo !== '') {
      // this.toastr.info('Hay servicio datos: ' + this.parametros.servicio);
      nohayvacios = true;
    }
    if (this.parametros.codigo !== undefined && this.parametros.codigo !== '' &&
    this.parametros.codigo !== null ) {
      // this.toastr.info('Hay detalle datos: ' + this.parametros.detalle);
      nohayvacios = true;
    }
    if (nohayvacios) {
      console.log(this.parametros);
      this.api.post('buscarubigeo', this.parametros).then(
        (res) => {
          console.log(res);
          this.ubigeos = res;
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

  mostrarprovincias() {
    this.listarCiudades(2);
  }

  mostrardistritos() {
    this.listarCiudades(3);
  }

  limpiar() {
    this.parametros = new Ubigeo();
    this.ubigeos = [];
    this.listarUbigeos();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.ubigeo = new Ubigeo();
    // this.idTipoUbigeo = 0;
    this.listarTipoUbigeos();
  }

  listarUbigeos() {
    this.cargando = true;
    this.api.get('ubigeos').then(
      (res) => {
        this.ubigeos = res;
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

  listarCiudades(idtipoubigeo) {
    this.cargando = true;
    this.api.get('buscarubigeo/' + idtipoubigeo).then(
      (res) => {
        if (idtipoubigeo === 1) {
          this.ubigeodepartamentos = res;
          this.ubigeos = this.ubigeodepartamentos;
        } else if (idtipoubigeo === 2) {
          this.ubigeoprovincias = res;
          this.ubigeos = this.ubigeoprovincias;
        } else {
          this.ubigeos = res; // distritos
        }
        // this.ubigeos = res;
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

  listarTipoUbigeos() {
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
    this.listarTipoUbigeos();
    this.vistaFormulario = true;
    this.verNuevo = false;
    this.cargando = true;
    this.api.get('ubigeos/' + id).then(
      (res) => {
        // console.log(res);
        this.ubigeo = res;
        this.idTipoUbigeo = this.ubigeo.tipoubigeo_id.id;
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

  guardarUbigeo() {
    this.cargando = true;
    if (!this.ubigeo.id) { // guardar nuevo ubigeo
      for (const tipoubigeo of this.tipoubigeos) {
        if (tipoubigeo.id === this.idTipoUbigeo) {
          this.ubigeo.tipoubigeo_id = tipoubigeo;
        }
      }
      console.log(this.ubigeo);
      this.api.post('ubigeos', this.ubigeo).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarUbigeos();
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
    } else { // guardar el ubigeo editado
      for (const tipoubigeo of this.tipoubigeos) {
        if (tipoubigeo.id === this.idTipoUbigeo) {
          this.ubigeo.tipoubigeo_id = tipoubigeo;
        }
      }
      console.log(this.ubigeo);
      this.api.put('ubigeos/' + this.ubigeo.id, this.ubigeo).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarUbigeos();
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

  confirmarcambiodeestado(ubigeo): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoubigeo(ubigeo);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      ubigeo.estado = !ubigeo.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoubigeo(ubigeo) {
    this.cargando = true;
    this.api.delete('ubigeos/' + ubigeo.id).then(
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

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }

  enviarubigeo(ubigeo: Ubigeo) {
    this.activeModal.close(ubigeo);
  }
}
