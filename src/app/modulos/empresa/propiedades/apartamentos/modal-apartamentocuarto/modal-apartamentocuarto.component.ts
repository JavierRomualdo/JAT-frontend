import { Component, OnInit, Input } from '@angular/core';
import { ApartamentoCuartoMensaje } from '../../../../../entidades/entidad.apartamentocuartomensaje';
import { ApartamentoCuarto } from '../../../../../entidades/entidad.apartamentocuarto';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequest2Service } from '../../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../servicios/auth.service';
import { Persona } from '../../../../../entidades/entidad.persona';
import { ConfirmacionComponent } from '../../../../../util/confirmacion/confirmacion.component';
import { FileItem } from '../../../../../entidades/file-item';
import { Foto } from '../../../../../entidades/entidad.foto';
import { ModalPersonaComponent } from '../../../configuracion/empresa/modal-persona/modal-persona.component';

@Component({
  selector: 'app-modal-apartamentocuarto',
  templateUrl: './modal-apartamentocuarto.component.html',
  styleUrls: ['./modal-apartamentocuarto.component.css']
})
export class ModalApartamentocuartoComponent implements OnInit {

  @Input() edit;
  public cargando: Boolean = false;
  public vermensajes: Boolean = false;
  public estadomensajes: Boolean = true;
  public confirmarcambioestado: Boolean = false;
  public apartamentocuartos: any = []; // lista proyecto
  public apartamentocuarto_id: number;
  public mensajes: ApartamentoCuartoMensaje[];
  public parametros: ApartamentoCuarto;
  //
  public apartamentocuarto: ApartamentoCuarto;
  public archivos: FileItem[] = [];
  public fotos: Foto[];
  public persona: Persona;
  public listaLP: any = []; // lista de persona-roles
  errors: Array<Object> = [];
  //
  public activarFormulario: Boolean = false;
  public verNuevo: Boolean = false;

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new ApartamentoCuarto();
    this.mensajes = [];
    this.parametros.persona_id = new Persona();
    //
    this.persona = new Persona();
    this.apartamentocuarto = new ApartamentoCuarto();
    this.fotos = [];
    this.archivos = [];
    this.listaLP = [];
  }

  ngOnInit() {
    this.listarApartamentoCuartos();
    this.activarFormulario = false;
    this.vermensajes = false;
  }

  limpiar() {
    this.parametros = new ApartamentoCuarto();
    this.parametros.persona_id = new Persona();
    this.apartamentocuartos = [];
    this.listarApartamentoCuartos();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.persona_id.nombres !== undefined &&
      this.parametros.persona_id.nombres !== '') {
        nohayvacios = true;
      }
    if (this.parametros.direccion !== undefined && this.parametros.direccion !== '') {
      // this.toastr.info('Hay detalle datos: ' + this.parametros.detalle);
      nohayvacios = true;
    }
    if (nohayvacios) {
      this.cargando = true;
      console.log(this.parametros);
      this.api.post('buscarapartamentocuarto', this.parametros).then(
        (res) => {
          console.log(res);
          this.apartamentocuartos = res;
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

  editarApartamentoCuarto(id) {
    this.activarFormulario = true;
    this.vermensajes = false;
    this.verNuevo = false;
    this.traerParaEdicion(id);
  }

  nuevoApartamentoCuarto() {
    this.activarFormulario = true;
    this.vermensajes = false;
    this.limpiarapartamentocuarto();
    this.verNuevo = true;
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.api.get('apartamentocuartos/' + id).then(
      (res) => {
        // console.log(res);
        this.apartamentocuarto = res;
        this.listaLP = res.casapersonaList;
        this.persona = this.listaLP[0];

        for (const item of res.fotosList) {
          console.log('foto: ');
          console.log(item);
          this.fotos.push(item);
        }
        console.log('fotoss : ');
        console.log(this.fotos);
        // this.fotos = res.fotosList;
        console.log('traido para edicion');
        console.log(this.apartamentocuarto);
        this.apartamentocuarto.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
        // traer archivos de firebase storage
        // this._cargaImagenes.getImagenes(res.path);

        // aqui metodo para mostrar todas las imagenes de este propiedad ....
        // this.imagen = res.foto;
        // this.imagenAnterior = res.foto;
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

  guardarapartamentoCuarto() {
    console.log('vamos a guardar una apartamento');
    this.cargando = true;
    if (this.activarFormulario && this.verNuevo) { // guardar nueva apartamento
      // guardar en lista fotos
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.apartamentocuarto.fotosList = this.fotos;
      this.fotos = [];
      console.log('fotos: ');
      console.log(this.apartamentocuarto.fotosList);
      console.log('antes de guardar apartamentocuarto: ');
      console.log(this.apartamentocuarto);
      this.api.post('apartamentocuartos', this.apartamentocuarto).then(
        (res) => {
          console.log('se guardo estos datos: ');
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.verNuevo = false;
          this.activeModal.close(this.apartamentocuarto);
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
    } else if (this.activarFormulario && !this.verNuevo) { // guardar el rol editado
      // guardar en lista fotos
      let fotos: Foto[];
      fotos = [];
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.nombre = item.nombreArchivo;
        foto.foto = item.url;
        foto.detalle = item.detalle;
        fotos.push(foto);
      }
      this.apartamentocuarto.fotosList = fotos;
      fotos = [];
      console.log('fotos: ');
      console.log(this.apartamentocuarto.fotosList);
      console.log('antes de editar apartamentocuarto: ');
      console.log(this.apartamentocuarto);
      this.api.put('apartamentocuartos/' + this.apartamentocuarto.id, this.apartamentocuarto).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.verNuevo = false;
          this.activeModal.close(this.apartamentocuarto);
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

  limpiarapartamentocuarto() {
    // limpiar persona
    this.apartamentocuarto = new ApartamentoCuarto();
    this.apartamentocuarto.persona_id = new Persona();
    this.listaLP = [];
    // limpiar foto
    this.apartamentocuarto.foto = null;
  }

  buscarpropietario() {
    const modalRef = this.modalService.open(ModalPersonaComponent, {
      size: 'lg',
      keyboard: true
    });
    modalRef.result.then(
      result => {
        this.persona = result;
        this.apartamentocuarto.persona_id = result;
        this.listaLP[0] = result;
        this.auth.agregarmodalopenclass();
      },
      reason => {
        this.auth.agregarmodalopenclass();
      }
    );
  }

  confirmarcambiodeestado(apartamentocuarto): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(apartamentocuarto);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      apartamentocuarto.estado = !apartamentocuarto.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(apartamentocuarto) {
    this.cargando = true;
    this.api.delete('apartamentocuartos/' + apartamentocuarto.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarApartamentoCuartos();
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
    this.api.delete('apartamentocuartomensaje/' + mensaje.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarmensajes(this.apartamentocuarto_id, this.estadomensajes);
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

  listarApartamentoCuartos() {
    this.cargando = true;
    this.api.get('apartamentocuartos').then(
      (res) => {
        this.apartamentocuartos = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.apartamentocuartos);
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

  listarmensajes(apartamentocuarto_id, estado) {
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
    this.activarFormulario = false;
    this.apartamentocuarto_id = apartamentocuarto_id;
    this.api.get('mostrarapartamentocuartomensajes/' + apartamentocuarto_id + '/' + valor).then(
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
    this.activarFormulario = true;
    this.listarApartamentoCuartos();
  }

  private cerrarFomulario() {
    this.activarFormulario = false;
    this.vermensajes = false;
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }

}
