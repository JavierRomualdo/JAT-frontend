import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public usuario: any = {};
  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      console.log('Estado del usuario: ', user);
      this.usuario = user;
      if (!user) {
        return;
      }
      this.usuario = {};
      // aqui comprobar el usuario ingresado con dlos datos del usuario de la bd
      this.usuario.nombre = user.displayName;
      this.usuario.email = user.email;
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string) {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  isAuthenticated() {
    const hayauth: boolean = !this.usuario ? false : true;
    return hayauth;
  }
}
