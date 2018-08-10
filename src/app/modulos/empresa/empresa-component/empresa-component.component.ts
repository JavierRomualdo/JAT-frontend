import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsuarioComponent } from '../configuracion/empresa/modal-usuario/modal-usuario.component';

@Component({
  selector: 'app-empresa-component',
  templateUrl: './empresa-component.component.html',
  styleUrls: ['./empresa-component.component.css']
})
export class EmpresaComponentComponent implements OnInit {
  ahora: Date;
  constructor(
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    this.ahora = new Date();
  }

  editarUsuario(id) {
    const modalRef = this.modalService.open(ModalUsuarioComponent, {size: 'lg', keyboard: true});
    // asi... le pasamos el parametro id del usuario en el modal-usuario :p
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
}
