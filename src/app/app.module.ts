
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './componentescomunes/login/login.component';
import { AppRoutingModule } from './app-routing-module';
import { AppConfig } from './app-config';
import { ApiRequestService } from './servicios/api-request.service';
import { ApiRequest2Service } from './servicios/api-request2.service';
import { HttpModule } from '@angular/http';
import { AuthService } from './servicios/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    AppConfig,
    ApiRequestService,
    ApiRequest2Service,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
