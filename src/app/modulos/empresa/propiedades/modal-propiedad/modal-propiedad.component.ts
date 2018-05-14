import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-propiedad',
  templateUrl: './modal-propiedad.component.html',
  styleUrls: ['./modal-propiedad.component.css']
})
export class ModalPropiedadComponent implements OnInit {
  @Input() edit;
  public verNuevo = false;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    if (this.edit) {
      this.traerParaEdicion(this.edit);
    }
  }

  guardarPropiedades() {}

  abrirrol() {}

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
  }
}
