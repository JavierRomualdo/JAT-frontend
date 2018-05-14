import { Injectable } from '@angular/core';

/**
 * This is a singleton class
 */
@Injectable()
export class AppConfig {

    // public baseApiPath:string="https://jat-backend.herokuapp.com/";
    public baseApiPath: String = 'http://localhost:8080/';

    constructor() {}
}
