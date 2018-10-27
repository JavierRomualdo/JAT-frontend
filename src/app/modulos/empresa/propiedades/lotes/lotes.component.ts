import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalLoteComponent } from './modal-lote/modal-lote.component';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../servicios/auth.service';
import { Lote } from '../../../../entidades/entidad.lote';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';
import { Persona } from '../../../../entidades/entidad.persona';
import { Ubigeo } from '../../../../entidades/entidad.ubigeo';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})
export class LotesComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public  lotes: any = []; // lista proyecto
  public parametros: Lote;
  errors: Array<Object> = [];

  constructor(
    public modalService: NgbModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new Lote();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
  }

  ngOnInit() {
    this.listarLotes();
  }

  limpiar() {
    this.parametros = new Lote();
    this.parametros.persona_id = new Persona();
    this.parametros.ubigeo_id = new Ubigeo();
    this.lotes = [];
    this.listarLotes();
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
      this.api.post('buscarlote', this.parametros).then(
        (res) => {
          console.log(res);
          this.lotes = res;
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

  abrirLotes(): void {
    const modalRef = this.modalService.open(ModalLoteComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
      this.listarLotes();
    }, (reason) => {
    });
  }

  editarLote(id) {
    const modalRef = this.modalService.open(ModalLoteComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarLotes();
    }, (reason) => {
    });
  }

  confirmarcambiodeestado(lote): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(lote);
      // this.auth.agregarmodalopenclass();
    }, (reason) => {
      lote.estado = !lote.estado;
      // this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(lote) {
    this.cargando = true;
    this.api.delete('lotes/' + lote.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarLotes();
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

  listarLotes() {
    this.cargando = true;
    this.api.get('lotes').then(
      (res) => {
        this.lotes = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.lotes);
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
