import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Persona } from '../../../../../entidades/entidad.persona';
import { ApiRequest2Service } from '../../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../servicios/auth.service';
import { ConfirmacionComponent } from '../../../../../util/confirmacion/confirmacion.component';
import { ModalRolComponent } from '../modal-rol/modal-rol.component';
import { Rol } from '../../../../../entidades/entidad.rol';
import { UbigeoGuardar } from '../../../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../../../entidades/entidad.ubigeo';
import { ModalUbigeoComponent } from '../../ubigeo/modal-ubigeo/modal-ubigeo.component';

@Component({
  selector: 'app-modal-persona',
  templateUrl: './modal-persona.component.html',
  styleUrls: ['./modal-persona.component.css']
})
export class ModalPersonaComponent implements OnInit {
  public persona: Persona;
  public vistaFormulario = false;
  public cargando: Boolean = false;
  public verNuevo: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public personas: any = [];
  errors: Array<Object> = [];
  public roles: Rol[];
  public ubigeo: UbigeoGuardar;
  public parametros: Persona;
  public idServicio: Number = 0; // sirve para el combo roles en la busqueda

  public listado: Boolean = false;
  public listaPR: any = []; // lista de persona-roles

  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService, // para mensajes de exito o error
    private modal: NgbModal,
    public auth: AuthService
  ) {
    this.persona = new Persona();
    this.parametros = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.roles = [];
    this.listaPR = [];
  }

  ngOnInit() {
    this.listarPersonas();
    this.listarRoles();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.nombres !== undefined && this.parametros.nombres !== '') {
      // this.toastr.info('Hay servicio datos: ' + this.parametros.servicio);
      nohayvacios = true;
    }
    if (this.parametros.dni !== undefined && this.parametros.dni !== '') {
      // this.toastr.info('Hay detalle datos: ' + this.parametros.detalle);
      nohayvacios = true;
    }
    if (this.idServicio > 0) {
      // this.toastr.info('Hay detalle datos: ' + this.parametros.detalle);
      nohayvacios = true;
      for (const rol of this.roles) {
        if (this.idServicio === rol.id) {
          this.parametros.rol_id = rol;
        }
      }
    }
    if (nohayvacios) {
      console.log(this.parametros);
      this.api.post('buscarpersona', this.parametros).then(
        (res) => {
          console.log(res);
          this.personas = res;
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
    this.parametros = new Persona();
    this.personas = [];

    this.persona.ubigeo_id = new Ubigeo();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();

    this.listarPersonas();
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = true;
    this.persona = new Persona();
    this.listaPR = [];
    this.listaPR = this.listaPR && this.listaPR.length > 0 ? this.listaPR : [];
  }

  listarPersonas() {
    this.cargando = true;
    this.api.get('personas').then(
      (res) => {
        this.personas = res;
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
    this.api.get('personas/' + id).then(
      (res) => {
        console.log('esto trajo para editar');
        console.log(res);
        this.persona = res;
        this.ubigeo = res.ubigeo;
        this.cargando = false;
        this.listaPR = this.persona.personarolList && this.persona.personarolList.length > 0 ? this.persona.personarolList : [];
      },
      (error) => {
        if (error.status === 422) {
          this.errors = [];
          const errors = error.json();
          console.log('Error');
          this.cargando = false;
        }
      }
    ).catch(err => this.handleError(err));
  }

  guardarPersona() {
    this.cargando = true;
    this.persona.personarolList = this.listaPR;
    this.persona.rol_id = this.listaPR[0]; // this.listaPR[0].idrol
    this.persona.ubigeo_id = this.ubigeo.ubigeo;
    if (!this.persona.id) { // guardar nuevo rol
      console.log('antes de guardar persona: ');
      console.log(this.persona);
      this.api.post('personas', this.persona).then(
        (res) => {
          console.log('se guardo estos datos: ');
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarPersonas();
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
      this.api.put('personas/' + this.persona.id, this.persona).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.vistaFormulario = false;
          this.verNuevo = false;
          this.listarPersonas();
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

  confirmarcambiodeestado(persona): void {
    const modalRef = this.modal.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadopersona(persona);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      persona.estado = !persona.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadopersona(persona) {
    this.cargando = true;
    this.api.delete('personas/' + persona.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarPersonas();
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

  abrirrol() {
    const modalRef = this.modal.open(ModalRolComponent, {windowClass: 'nuevo-modal', size: 'lg', keyboard: true});
      modalRef.result.then((result) => {
        const rol = result;
        console.log('se seleccion el rol: ');
        console.log(result);
        /*const pr = {
          personarolPK: {
            idrol: rol.id,
            idpersona: this.persona.id
          },
          estado: true,
          idrol: rol
        };*/
        const rSelect = this.listaPR.find(item => item.idrol.id === rol.id);
        if (rSelect && rSelect.idrol && rSelect.idrol.id) {
          this.toastr.warning('Rol ya existe', 'Aviso');
        } else {
          this.listaPR.push(rol);
        }
        this.auth.agregarmodalopenclass();
      }, (reason) => {
          this.auth.agregarmodalopenclass();
        }
    );
  }

  buscarubigeo() {
    const modalRef = this.modal.open(ModalUbigeoComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      console.log('ubigeoguardar:');
      console.log(result);
      this.ubigeo = result;
      this.persona.ubigeo_id = result.ubigeo;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  quitardelista(pr) {
    this.listaPR.pop(pr);
  }

  enviarpersona(persona: Persona) {
    this.activeModal.close(persona);
  }

}
