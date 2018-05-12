import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-propiedad',
  templateUrl: './modal-propiedad.component.html',
  styleUrls: ['./modal-propiedad.component.css']
})
export class ModalPropiedadComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  guardarPropiedades() {}

  abrirrol() {}
}
