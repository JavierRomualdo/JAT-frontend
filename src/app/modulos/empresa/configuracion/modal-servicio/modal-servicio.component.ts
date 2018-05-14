import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-servicio',
  templateUrl: './modal-servicio.component.html',
  styleUrls: ['./modal-servicio.component.css']
})
export class ModalServicioComponent implements OnInit {
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

  guardarServicio() {}
}
