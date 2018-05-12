import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalPropiedadComponent } from './modal-propiedad/modal-propiedad.component';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.css']
})
export class PropiedadesComponent implements OnInit {

  constructor(
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  abrirPropiedades(): void {
    const modalRef = this.modalService.open(ModalPropiedadComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
}
