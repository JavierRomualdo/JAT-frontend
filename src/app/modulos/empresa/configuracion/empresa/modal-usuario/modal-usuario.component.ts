import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileItem } from '../../../../../entidades/file-item';
import { CargaImagenesService } from '../../../../../servicios/carga-imagenes.service';
// import { Observable } from 'rxjs';
import { Users } from '../../../../../entidades/entidad.users';
import { ApiRequest2Service } from '../../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs-compat/Observable';

export interface Item { nombre: string; url: string; }
@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  // asi... recogemos el parametro id del usuario que se ha enviado
  @Input() edit;
  public verNuevo = false;
  public cargando: Boolean = false;
  public fotoingresada = false;
  // public usuarios: any = [];
  errors: Array<Object> = [];
  public usuario: Users;

  public imagen: string = null;
  public imagenAnterior: string = null; // solo se usara para editar usuario

  public estaSobreElemento = false;
  // archivos: FileItem[] = [];
  archivo: FileItem;
  // files: File[] = [];
  file: File = null;
  // public items: Observable<any[]>; // alli estan las fotos que se encuentran subidas a firebase
  //
  // public item: Observable<any>;
  //
  constructor(
    public activeModal: NgbActiveModal,
    public _cargaImagenes: CargaImagenesService,
    public api: ApiRequest2Service,
    public toastr: ToastrService
  ) {
    // this.items = db.collection('usuarios').valueChanges();
    this.usuario = new Users();
    this.archivo = new FileItem(null);
    // this.archivos = [];
  }

  ngOnInit() {
    if (this.edit) {
      console.log('usuario_id: ' + this.edit);
      this.traerParaEdicion(this.edit);
      // this.items = this.db.collection('usuarios/' + this.usuario.name).valueChanges();
    }
  }

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = false;
    this.cargando = true;
    this.api.get('usuarios/' + id).then(
      (res) => {
        // console.log(res);
        this.usuario = res;
        console.log('traido para edicion');
        console.log(this.usuario);
        this.imagen = res.foto;
        this.imagenAnterior = res.foto;

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

  guardarusuario() {
    // const exito: Boolean = this.api.onUpload(this.files[0], this.archivo);
    // console.log('Estado exito = ' + exito);
    this.cargando = true;
    if (!this.edit) { // guardar nuevo usuario
      if (this.archivo.archivo == null) { // el usuario guarda sin su foto
        console.log('usuario antes de guardar:');
        console.log(this.usuario);
      } else { // el usuario guarda con su foto
        console.log('inicio de guardar usuario');
        this.usuario.foto = this.archivo.url;
        // console.log('usuario foto url: ' + this.usuario.foto);
      }
      this.nuevoUsuario();
    } else { // editar usuario
      if (this.imagenAnterior === this.imagen) { // el usuario edita con su misma foto
        console.log('usuario antes de guardar:');
        console.log(this.usuario);
      } else { // el usuario cambio su foto
        this.usuario.foto = this.archivo.url;
      }
      this.editarUsuario();
    }
  }

  private nuevoUsuario() {
    // .-. nuevo
    console.log('procesando nuevo usuario ...');
    this.api.post('usuarios', this.usuario).then(
      (res) => {
        console.log('usuario gaurdado: ');
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.cargando = false;
        this.verNuevo = false;
        // cierra el modal y adems pasa un parametro al componente que lo llamo a este modal usuario
        this.activeModal.close(this.usuario);
        // this.listarServicios();
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
  }

  private editarUsuario() {
    console.log('editando usuario...');
    this.api.put('usuarios/' + this.usuario.id, this.usuario).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.cargando = false;
        this.verNuevo = false;
        this.activeModal.close();
        // this.listarServicios();
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

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
  // subir imagen en firebase (cloud storage)
  subirimagen() {
    if (!this.edit) { // para nuevo usuario
      this.cargarImagen();
      this.usuario.nombrefoto = this.archivo.nombreArchivo;
      console.log('usuario por ahora: ');
      console.log(this.usuario);
    } else { // para editar usuario
      if (this.imagenAnterior !== this.imagen) { // la imagen es diferente
        // entonces se elimina la antigua y se sube una nueva imagen
        console.log('ha cambiado de imagen');
        if (this.usuario.nombrefoto != null) {
          console.log('nombrefoto antigua: ' + this.usuario.nombrefoto);
          this._cargaImagenes.deleteArchivo('usuarios', this.usuario.nombrefoto);
        }
        this.cargarImagen();
        this.usuario.nombrefoto = this.archivo.nombreArchivo;
      }
    }
  }
  /*para guardar las imagenes en storage firebase */
  detectarArchivo($event) {
    this.fotoingresada = true;
    // this.files = [];
    this.archivo = null;
    // this.archivos = [];
    this.file = $event.target.files[0];
    console.log('Detectar file:');
    console.log(this.file);
    this.archivo = new FileItem(this.file);
    // this.archivos.push(new FileItem(this.files[0]));
    console.log('Detectar archivo:');
    console.log(this.archivo);
    // console.log(this.archivos[0]);
    if ($event.target.files && $event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => { this.imagen = event.target.result; };
      reader.readAsDataURL($event.target.files[0]);
    }
  }
  /* cargarImagenes() {
    this._cargaImagenes.cargarImagenesFirebase('usuarios', this.archivos);
  }*/

  cargarImagen() {
    // el primer parametro es el nombre de la carpeta que le vamos bueno el nombre de la carpeta
    // lo vamos a ponerle al nombre del usuario y el segundo parametro su imagen para almacenar
    // en firebase (storage (aca se sube el archivo completo) y firestore (aca se registra el archivo en la bd))
    this._cargaImagenes.cargarImagen('usuarios', this.archivo);
    // this._cargaImagenes.cargarImagen('usuarios/', this.archivos[0]); // +  this.usuario.name
  }

  pruebaSobreElemento(event) {
    console.log(event);
  }

  limpiarArchivos() {
    this.archivo = null;
    // this.archivos = [];
  }
}
