import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './componentescomunes/login/login.component';
import { AppRoutingModule } from './app-routing-module';
import { AppConfig } from './app-config';
import { ApiRequestService } from './servicios/api-request.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    AppConfig,
    ApiRequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
