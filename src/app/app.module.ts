import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
// import { LoginComponent } from './componentescomunes/login/login.component';
import { AppRoutingModule } from './app-routing-module';
import { AppConfig } from './app-config';
import { ApiRequestService } from './servicios/api-request.service';
import { ApiRequest2Service } from './servicios/api-request2.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './servicios/auth.service';
import { LoginComponent } from './componentescomunes/login/login.component';
import { LoginService } from './servicios/login.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AuthGuardService } from './servicios/auth-guard.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  entryComponents: [
    LoginComponent
  ],
  providers: [
    AppConfig,
    ApiRequestService,
    ApiRequest2Service,
    AuthService,
    LoginService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
