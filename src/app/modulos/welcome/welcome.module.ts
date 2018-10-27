import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
// import { PropiedadesComponent } from './servicios/propiedades/propiedades.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { AlquileresComponent } from './servicios/alquileres/alquileres.component';
import { LotesComponent } from './servicios/lotes/lotes.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { ServiciosComponent } from './servicios/servicios.component';
import {WelcomeRoutingModule} from './welcome-routing-module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { WelcomeComponentComponent } from './welcome-component/welcome-component.component';
import { PaWelcomeCargandoComponent } from './../../util/cargando/cargando.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AgmCoreModule } from '@agm/core';
import { LoteDetalleComponent } from './servicios/lotes/lotedetalle/lotedetalle.component';
import { PropiedadDetalleComponent } from './servicios/propiedades/propiedaddetalle/propiedaddetalle.component';
import { LocalesComponent } from './servicios/alquileres/locales/locales.component';
import { LocalDetalleComponent } from './servicios/alquileres/locales/localdetalle/localdetalle.component';
import { HabitacionesComponent } from './servicios/alquileres/habitaciones/habitaciones.component';
import { HabitacionDetalleComponent } from './servicios/alquileres/habitaciones/habitaciondetalle/habitaciondetalle.component';
import { VentaComponent } from './servicios/venta/venta.component';
import { AlquilerComponent } from './servicios/alquiler/alquiler.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {PanelModule} from 'primeng/panel';
import {SpinnerModule} from 'primeng/spinner';
import { PropiedadesServiceComponent } from './servicios/propiedades/propiedades.component';
// import { LoginComponent } from '../../componentescomunes/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACiya9u1WJZ3DBZmZcw2gUlczgoHtxC80'
    }),
    ToastrModule.forRoot(),
    WelcomeRoutingModule,
    RadioButtonModule,
    CheckboxModule,
    ScrollPanelModule,
    PanelModule,
    SpinnerModule
  ],
  declarations: [
    HomeComponent,
    PropiedadesComponent,
    PropiedadesServiceComponent,
    PropiedadDetalleComponent,
    LotesComponent,
    LoteDetalleComponent,
    LocalesComponent,
    LocalDetalleComponent,
    HabitacionesComponent,
    HabitacionDetalleComponent,
    AlquileresComponent,
    LotesComponent,
    LoteDetalleComponent,
    NosotrosComponent,
    SuscripcionComponent,
    ServiciosComponent,
    NavbarComponent,
    FooterComponent,
    PaWelcomeCargandoComponent,
    WelcomeComponentComponent,
    VentaComponent,
    AlquilerComponent,
    // LoginComponent
  ],
  entryComponents: [
    // LoginComponent
  ],
  providers: [
    NgbActiveModal,
  ]})
export class WelcomeModule { }
