import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalLoteComponent } from './modal-lote/modal-lote.component';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})
export class LotesComponent implements OnInit {

  constructor(
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  abrirLotes(): void {
    const modalRef = this.modalService.open(ModalLoteComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  editarLote(id) {
    const modalRef = this.modalService.open(ModalLoteComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
}
