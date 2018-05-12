import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-rol',
  templateUrl: './modal-rol.component.html',
  styleUrls: ['./modal-rol.component.css']
})
export class ModalRolComponent implements OnInit {
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

  traerParaEdicion(id) {
    this.vistaFormulario = true;
    this.verNuevo = true;
  }

  guardarRoles() {}
}
