import { HomeComponent } from './home/home.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { AlquileresComponent } from './servicios/alquileres/alquileres.component';
import { LotesComponent } from './servicios/lotes/lotes.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponentComponent } from './welcome-component/welcome-component.component';
import { PropiedadDetalleComponent } from './servicios/propiedades/propiedaddetalle/propiedaddetalle.component';
import { LoteDetalleComponent } from './servicios/lotes/lotedetalle/lotedetalle.component';
import { HabitacionesComponent } from './servicios/alquileres/habitaciones/habitaciones.component';
import { HabitacionDetalleComponent } from './servicios/alquileres/habitaciones/habitaciondetalle/habitaciondetalle.component';
import { LocalesComponent } from './servicios/alquileres/locales/locales.component';
import { LocalDetalleComponent } from './servicios/alquileres/locales/localdetalle/localdetalle.component';
import { VentaComponent } from './servicios/venta/venta.component';
import { AlquilerComponent } from './servicios/alquiler/alquiler.component';
import { LoginComponent } from '../../componentescomunes/login/login.component';

const welcomeRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponentComponent,
    children: [
      // {path: '', component: HomeComponent},
      {path: 'inicio', component: HomeComponent},
      {path: 'nosotros', component: NosotrosComponent},
      {path: 'propiedades', component: PropiedadesComponent},
      {path: 'servicios', component: ServiciosComponent},
      // {path: 'servicios/propiedades', component: PropiedadesComponent},
      {path: 'propiedad/:id', component: PropiedadDetalleComponent},
      {path: 'servicios/lotes', component: LotesComponent},
      {path: 'lote/:id', component: LoteDetalleComponent},
      {path: 'servicios/alquileres', component: AlquileresComponent},
      {path: 'servicios/venta', component: VentaComponent},
      {path: 'servicios/alquiler', component: AlquilerComponent},
      {path: 'servicios/alquileres/habitaciones', component: HabitacionesComponent},
      {path: 'habitacion/:id', component: HabitacionDetalleComponent},
      {path: 'servicios/alquileres/locales', component: LocalesComponent},
      {path: 'local/:id', component: LocalDetalleComponent},
      {path: 'suscripcion', component: SuscripcionComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: '**', component: HomeComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(welcomeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WelcomeRoutingModule {
}
