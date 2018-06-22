import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response,
          Request, RequestOptions,
          URLSearchParams, RequestMethod
        } from '@angular/http';
import { Router } from '@angular/router';

import { AppConfig } from '../app-config';

import { Observable } from 'rxjs/Observable';
import { Rol } from '../entidades/entidad.rol';

import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

export interface ObjetoJWT {
  userId: string;
  token: string;
}

@Injectable()
export class ApiRequest2Service {
  headers = new Headers();
  private usuarioActualKey = 'currentUser'; // : string

  constructor(
    private _http: Http,
    private router: Router,
    private appConfig: AppConfig
  ) {
  }

  appendAuthHeader(): Headers {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    // Este codigo me sirve el ingreso del sistema validando si se ingreso con el usuario y password
    // caso contrario no me ingresa al sistema (token del navegador)
    /* const objJWT: ObjetoJWT = JSON.parse(localStorage.getItem(this.usuarioActualKey));
    if (objJWT !== null) {
        const token = objJWT.token;
        if (token !== null) {
           this.headers.append('Authorization', token);
        }
    }*/
    return this.headers;
  }

  // funcion get (retorna una fila o todas de la tabla dependiendo del url)
  get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http.get(this.appConfig.baseApiPath + url, {
        headers: this.appendAuthHeader()
      }).map((res: Response) => res.json()).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
          this.handleError(error);
        }
      );
    });
  }
  // funcion create
  post(url: string, objeto: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http.post(this.appConfig.baseApiPath + url, objeto, {
          headers: this.appendAuthHeader()
      }).map((res: Response) => res.json()).subscribe(
        (res) => {
        resolve(res);
      },
        (error) => {
          reject(error);
          this.handleError(error);
        }
      );
    });
  }
  // function editar
  put(url: string, objeto: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http.patch(this.appConfig.baseApiPath + url, objeto, {
          headers: this.appendAuthHeader()
      }).map((res: Response) => res.json()).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
          this.handleError(error);
        }
      );
    });
  }
  // funcion eliminar
  delete(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http.delete(this.appConfig.baseApiPath + url, {
          headers: this.appendAuthHeader()
      }).map((res: Response) => res.json()).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
          this.handleError(error);
        }
      );
    });
  }

  handleError(error: any): Promise<any> {
    if (error.status === 401 || error.status === 403) {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['login']);
    }
    if (error.status === 404) {
      console.error('página solicitada no se encuentra');
    }
    return Promise.reject(error.message || error);
  }
}
