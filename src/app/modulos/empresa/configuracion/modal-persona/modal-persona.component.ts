import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-persona',
  templateUrl: './modal-persona.component.html',
  styleUrls: ['./modal-persona.component.css']
})
export class ModalPersonaComponent implements OnInit {
  public vistaFormulario = false;
  public verNuevo: Boolean = false;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  nuevo() {
    this.vistaFormulario = true;
    this.verNuevo = false;
  }

  guardarPersonas() {}

  abrirrol() {}

  traerParaEdicion(id) {
    this.vistaFormulario = true;
    this.verNuevo = true;
  }

}
