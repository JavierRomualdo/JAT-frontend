import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FileItem } from '../../../../entidades/file-item';
import { Empresa } from '../../../../entidades/entidad.empresa';
import { CargaImagenesService } from '../../../../servicios/carga-imagenes.service';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';

@Component({
  selector: 'app-modal-empresa',
  templateUrl: './modal-empresa.component.html',
  styleUrls: ['./modal-empresa.component.css']
})
export class ModalEmpresaComponent implements OnInit {

  public fotoingresada = false;
  public cargando: Boolean = false;
  archivo: FileItem;
  file: File = null;
  public imagen: string = null;
  public imagenAnterior: string = null; // solo se usara para editar usuario
  public empresa: Empresa;
  errors: Array<Object> = [];

  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public modalService: NgbModal,
    public _cargaImagenes: CargaImagenesService,
  ) {
    this.empresa = new Empresa();
    this.archivo = new FileItem(null);
  }

  ngOnInit() {
    this.traerParaEdicion();
  }

  traerParaEdicion() {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.api.get('empresa').then( // va a retornar siempre el primer registro de la tabla empresa en la bd
      (res) => {
        if (res !== 'vacio') {
          console.log('datos empresa: ');
          console.log(res);
          this.empresa = res;
          console.log('traido para edicion');
          console.log(this.empresa);
          this.imagen = res.foto;
          console.log('res.foto = ' + this.imagen);
          console.log('nombre empresa = ' + this.empresa.nombre);
          this.imagenAnterior = res.foto;
        } else {
          console.log('esta vacio');
          this.imagenAnterior = undefined;
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

  guardarEmpresa() {
    this.cargando = true;
    // this.imagenAnterior es un parametro que tambien se podra visualizar si es nuevo o editar empresa
    if (this.imagenAnterior === undefined) { // nueva empresa undefined
      if (this.archivo.archivo == null) { // la empresa guarda sin su foto
        console.log('empresa antes de guardar:');
        console.log(this.empresa);
      } else { // el usuario guarda con su foto
        console.log('inicio de guardar empresa');
        this.empresa.foto = this.archivo.url;
        console.log(this.empresa);
        // console.log('usuario foto url: ' + this.usuario.foto);
      }
      this.nuevaEmpresa();
    } else { // editar empresa
      if (this.imagenAnterior === this.imagen) { // el usuario edita con su misma foto
        console.log('usuario antes de guardar:');
        console.log(this.empresa);
      } else { // la empresa cambio de icono
        this.empresa.foto = this.archivo.url;
      }
      this.editarEmpresa();
    }
  }

  private nuevaEmpresa() {
    // .-. nuevo
    console.log('procesando nueva empresa ...');
    this.api.post('empresa', this.empresa).then(
      (res) => {
        console.log('empresa gaurdado: ');
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.cargando = false;
        // cierra el modal y adems pasa un parametro al componente que lo llamo a este modal usuario
        this.activeModal.close(this.empresa);
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

  private editarEmpresa() {
    console.log('editando empresa...');
    this.api.put('empresa/' + this.empresa.id, this.empresa).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.cargando = false;
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

  subirimagen() {
    if (this.imagenAnterior !== this.imagen) { // la imagen es diferente
      // entonces se elimina la antigua y se sube una nueva imagen
      console.log('ha cambiado de imagen');
      if (this.empresa.nombrefoto != null) {
        console.log('nombrefoto antigua: ' + this.empresa.nombrefoto);
        this._cargaImagenes.deleteArchivo('empresa', this.empresa.nombrefoto);
      }
      this.cargarImagen();
      this.empresa.nombrefoto = this.archivo.nombreArchivo;
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

  cargarImagen() {
    // el primer parametro es el nombre de la carpeta que le vamos bueno el nombre de la carpeta
    // lo vamos a ponerle al nombre del usuario y el segundo parametro su imagen para almacenar
    // en firebase (storage (aca se sube el archivo completo) y firestore (aca se registra el archivo en la bd))
    this._cargaImagenes.cargarImagen('empresa', this.archivo);
    // this._cargaImagenes.cargarImagen('usuarios/', this.archivos[0]); // +  this.usuario.name
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
