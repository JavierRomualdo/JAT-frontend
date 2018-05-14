import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-habitacion',
  templateUrl: './modal-habitacion.component.html',
  styleUrls: ['./modal-habitacion.component.css']
})
export class ModalHabitacionComponent implements OnInit {
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

  guardarHabitacion() {}

  traerParaEdicion(id) {
    this.verNuevo = true;
  }
}
