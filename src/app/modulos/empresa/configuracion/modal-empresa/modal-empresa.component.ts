import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from '../../../../servicios/api-request.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-modal-empresa',
  templateUrl: './modal-empresa.component.html',
  styleUrls: ['./modal-empresa.component.css']
})
export class ModalEmpresaComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiRequestService,
    public toastr: ToastrService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  guardarEmpresa() {}
}
