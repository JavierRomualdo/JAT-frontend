import { Component, OnInit } from '@angular/core';
import { Users } from '../../entidades/entidad.users';
import { LoginService } from '../../servicios/login.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

public usuario: Users;
  constructor(
    public loginservicio: LoginService,
    public activeModal: NgbActiveModal,
  ) {
    this.usuario = new Users();
  }

  ngOnInit() {
  }

  ingresar() {
    console.log('javier');
    this.loginservicio.login('javier');
    this.activeModal.dismiss('Cross click');
  }

  salir() {
    this.loginservicio.logout();
  }

}
