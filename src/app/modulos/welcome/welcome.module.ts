
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PropiedadesComponent } from './servicios/propiedades/propiedades.component';
import { AlquileresComponent } from './servicios/alquileres/alquileres.component';
import { LotesComponent } from './servicios/lotes/lotes.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { ServiciosComponent } from './servicios/servicios.component';
import {WelcomeRoutingModule} from './welcome-routing-module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    WelcomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    PropiedadesComponent,
    AlquileresComponent,
    LotesComponent,
    NosotrosComponent,
    SuscripcionComponent,
    ServiciosComponent,
    NavbarComponent,
    FooterComponent]
})
export class WelcomeModule { }
