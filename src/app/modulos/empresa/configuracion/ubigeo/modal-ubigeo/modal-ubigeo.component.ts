import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiRequest2Service } from '../../../../../servicios/api-request2.service';
import { ConfirmacionComponent } from '../../../../../util/confirmacion/confirmacion.component';
import { AuthService } from '../../../../../servicios/auth.service';
import { Ubigeo } from '../../../../../entidades/entidad.ubigeo';
import { UbigeoTipo } from '../../../../../entidades/entidad.tipoubigeo';
import { UbigeoGuardar } from '../../../../../entidades/entidad.ubigeoguardar';

@Component({
  selector: 'app-modal-ubigeo',
  templateUrl: './modal-ubigeo.component.html',
  styleUrls: ['./modal-ubigeo.component.css']
})
export class ModalUbigeoComponent implements OnInit {
  @Input() edit;
  public ubigeo: Ubigeo;
  public ubigeoGuardar: UbigeoGuardar;
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
  // tslint:disable-next-line:no-inferrable-types
  public idUbigeoDistrito: number = 0;
  errors: Array<Object> = [];
  // public parametros: Ubigeo;
  public parametros: UbigeoGuardar;

  public listado: Boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    private modal: NgbModal,
    public auth: AuthService
  ) {
    this.ubigeo = new Ubigeo();
    this.ubigeoGuardar = new UbigeoGuardar();
    this.ubigeoGuardar.ubigeo = new Ubigeo();
    this.ubigeodepartamentos = [];
    this.ubigeoprovincias = [];
    this.ubigeos = [];
    this.tipoubigeos = [];
    // this.parametros = new Ubigeo();
    this.parametros = new UbigeoGuardar();
    this.parametros.departamento = null;
    this.parametros.provincia = null;
    this.parametros.ubigeo = new Ubigeo();
  }

  ngOnInit() {
    if (this.edit) {
      this.traerParaEdicion(this.edit);
    } else {
      this.listarUbigeos(); // index ubigeos (departamento)
    }
    // por defecto se debe listar tipoubigeo 1 (departamentos)
  }

  busqueda(): void {
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

  mostrarprovincias(idubigeo) {
    if (idubigeo > 0) {
      let departamento: Ubigeo = new Ubigeo();
      for (const ubigeo of this.ubigeodepartamentos) {
        if (idubigeo === ubigeo.id) {
          departamento = ubigeo;
        }
      }
      this.parametros.departamento = departamento;
      console.log(departamento);
      this.mostrarubigeos(departamento.tipoubigeo_id, departamento.codigo);
    } else {
      this.ubigeoprovincias = [];
      this.parametros.departamento = null;
      this.listarUbigeos();
    }
  }

  mostrardistritos(idubigeo) {
    if (idubigeo > 0) {
      let provincia: Ubigeo = new Ubigeo();
      for (const ubigeo of this.ubigeoprovincias) {
        if (idubigeo === ubigeo.id) {
          provincia = ubigeo;
        }
      }
      this.parametros.provincia = provincia;
      console.log(provincia);
      this.mostrarubigeos(provincia.tipoubigeo_id, provincia.codigo);
    } else {
      this.ubigeos = [];
      this.parametros.provincia = null;
      this.listarUbigeos();
    }
  }

  limpiar() {
    // this.parametros = new Ubigeo();
    this.parametros = new UbigeoGuardar();
    this.parametros.departamento = null;
    this.parametros.provincia = null;
    this.parametros.ubigeo = new Ubigeo();

    this.ubigeos = [];
    this.ubigeoprovincias = [];
    this.idUbigeoDepartamento = 0;
    this.idUbigeoProvincia = 0;
    this.listarUbigeos();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.idTipoUbigeo = 0;
    this.idUbigeoDepartamento = 0;
    this.idUbigeoProvincia = 0;
    this.ubigeoGuardar.ubigeo = new Ubigeo();
    this.ubigeo = new Ubigeo();
    // this.idTipoUbigeo = 0;
    this.listarTipoUbigeos();
  }

  listarUbigeos() {
    this.cargando = true;
    this.api.get('ubigeos').then(
      (res) => {
        this.ubigeodepartamentos = res;
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

  mostrarubigeos(idtipoubigeo, codigo) {
    this.cargando = true;
    this.api.get('mostrarubigeos/' + idtipoubigeo + '/' + codigo).then(
      (res) => {
        if (idtipoubigeo === 1) { // departamento
          // listo las provincias del departamento
          this.ubigeoprovincias = res;
          this.ubigeos = this.ubigeoprovincias;
        } else if (idtipoubigeo === 2) { // provincia
          // listo los distritos de la provincia
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
        console.log(res);
        this.ubigeoGuardar.ubigeo = res.ubigeo;
        // this.ubigeo = res;
        this.idTipoUbigeo = this.ubigeoGuardar.ubigeo.tipoubigeo_id.id;
        // console.log('tipoubigeo_id: ' + this.idTipoUbigeo);
        if (res.departamento != null) {
          this.ubigeoGuardar.departamento = res.departamento;
          this.idUbigeoDepartamento = this.ubigeoGuardar.departamento.id;
          // console.log('departamento != null ' + this.idUbigeoDepartamento);
        }
        if (res.provincia != null) {
          // console.log('prvinci != null');
          this.ubigeoGuardar.departamento = res.departamento;
          this.idUbigeoDepartamento = this.ubigeoGuardar.departamento.id;
          this.ubigeoGuardar.provincia = res.provincia;
          this.idUbigeoProvincia = this.ubigeoGuardar.provincia.id;
        }
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
    if (this.idTipoUbigeo === 1) {
      this.ubigeoGuardar.departamento = null;
      this.ubigeoGuardar.provincia = null;
    } else if (this.idTipoUbigeo === 2) {
      for (const departamento of this.ubigeodepartamentos) {
        if (this.idUbigeoDepartamento === departamento.id) {
          this.ubigeoGuardar.departamento = departamento;
        }
      }
    } else if (this.idTipoUbigeo === 3) {
      for (const departamento of this.ubigeodepartamentos) {
        if (this.idUbigeoDepartamento === departamento.id) {
          this.ubigeoGuardar.departamento = departamento;
        }
      }
      for (const provincia of this.ubigeoprovincias) {
        if (this.idUbigeoProvincia === provincia.id) {
          this.ubigeoGuardar.provincia = provincia;
        }
      }
    }

    for (const tipoubigeo of this.tipoubigeos) {
      if (tipoubigeo.id === this.idTipoUbigeo) {
        this.ubigeoGuardar.ubigeo.tipoubigeo_id = tipoubigeo;
      }
    }
    if (!this.ubigeoGuardar.ubigeo.id) { // guardar nuevo ubigeo
      console.log('antes de guardar:');
      console.log(this.ubigeoGuardar);
      this.api.post('ubigeos', this.ubigeoGuardar).then(
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
          }
        }
      ).catch(err => this.handleError(err));
    } else { // guardar el ubigeo editado
      console.log('antes de editar:');
      console.log(this.ubigeoGuardar);
      this.api.put('ubigeos/' + this.ubigeoGuardar.ubigeo.id, this.ubigeoGuardar).then(
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
          }
        }
      ).catch(err => this.handleError(err));
    }
    this.idUbigeoDepartamento = 0;
    this.idUbigeoProvincia = 0;
    this.ubigeoprovincias = [];
    this.ubigeoGuardar = new UbigeoGuardar();
    this.ubigeoGuardar.ubigeo = new Ubigeo();
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
    this.parametros.ubigeo = ubigeo;
    this.activeModal.close(this.parametros);
  }
}
