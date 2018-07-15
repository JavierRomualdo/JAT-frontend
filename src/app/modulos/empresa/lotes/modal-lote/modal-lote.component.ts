import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileItem } from '../../../../entidades/file-item';
import { CargaImagenesService } from '../../../../servicios/carga-imagenes.service';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPersonaComponent } from '../../configuracion/modal-persona/modal-persona.component';
import { AuthService } from '../../../../servicios/auth.service';
import { Persona } from '../../../../entidades/entidad.persona';
import { Foto } from '../../../../entidades/entidad.foto';
import { Lote } from '../../../../entidades/entidad.lote';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
  selector: 'app-modal-lote',
  templateUrl: './modal-lote.component.html',
  styleUrls: ['./modal-lote.component.css']
})
export class ModalLoteComponent implements OnInit {
  @Input() edit;
  public verNuevo = false;
  public cargando: Boolean = false;
  public lote: Lote;
  public archivos: FileItem[] = [];
  public fotos: Foto[];
  public files: File[];
  public persona: Persona;
  public listaLP: any = []; // lista de persona-roles
  errors: Array<Object> = [];

  private itemsCollection: AngularFirestoreCollection<FileItem>;
  items: Observable<FileItem[]>;

  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public _cargaImagenes: CargaImagenesService,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService
  ) {
    this.lote = new Lote();
    this.fotos = [];
    this.persona = new Persona();
    this.archivos = [];
    this.listaLP = [];
  }

  ngOnInit() {
    if (this.edit) {
      this.traerParaEdicion(this.edit);
    }
  }

  guardarlote() {
    console.log('vamos a guardar un lote');
    this.cargando = true;
    this.lote.lotepersonaList = this.listaLP;
    this.lote.persona_id = this.listaLP[0]; // this.listaPR[0].idrol
    if (!this.lote.id) { // guardar nuevo rol
      // guardar en lista fotos
      for (const item of this.archivos) {
        const foto: Foto = new Foto();
        foto.foto = item.url;
        foto.detalle = item.detalle;
        this.fotos.push(foto);
      }
      this.lote.fotosList = this.fotos;
      console.log('fotos: ');
      console.log(this.lote.fotosList);
      console.log('antes de guardar lote: ');
      console.log(this.lote);
      this.api.post('lotes', this.lote).then(
        (res) => {
          console.log('se guardo estos datos: ');
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.verNuevo = false;
          this.activeModal.close(this.lote);
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
      this.api.put('lotes/' + this.lote.id, this.lote).then(
        (res) => {
          console.log(res);
          this.toastr.success(res.operacionMensaje, 'Exito');
          this.cargando = false;
          this.verNuevo = false;
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

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
    this.cargando = true;
    this.api.get('lotes/' + id).then(
      (res) => {
        // console.log(res);
        this.lote = res;
        console.log('traido para edicion');
        console.log(this.lote);

        // aqui metodo para mostrar todas las imagenes de este lote ....
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

  buscarpropietario() {
    const modalRef = this.modalService.open(ModalPersonaComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      this.persona = result;
      this.lote.persona_id = result;
      this.listaLP[0] = result;
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      this.auth.agregarmodalopenclass();
    });
  }

  cargarImagenes() {
    this.lote.path = 'lotes/' + this.persona.dni;
    this._cargaImagenes.cargarImagenesFirebase(this.lote.path, this.archivos);
  }

  limpiarArchivos() {
    this.archivos = [];
  }

  quitarfoto(item: FileItem) {
    const index = this.archivos.indexOf(item);
    this.archivos.splice(index, 1);
    console.log('las fotos que quedan: ');
    console.log(this.archivos);
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
