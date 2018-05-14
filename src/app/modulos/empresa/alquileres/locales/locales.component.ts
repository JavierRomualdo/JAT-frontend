import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalLocalComponent } from './modal-local/modal-local.component';
@Component({
  selector: 'app-locales',
  templateUrl: './locales.component.html',
  styleUrls: ['./locales.component.css']
})
export class LocalesComponent implements OnInit {

  constructor(
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  abrirLocales(): void {
    const modalRef = this.modalService.open(ModalLocalComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  editarLocal(id) {
    const modalRef = this.modalService.open(ModalLocalComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
}
