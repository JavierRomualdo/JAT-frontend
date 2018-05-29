import { HomeComponent } from './home/home.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { PropiedadesComponent } from './servicios/propiedades/propiedades.component';
import { AlquileresComponent } from './servicios/alquileres/alquileres.component';
import { LotesComponent } from './servicios/lotes/lotes.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponentComponent } from './welcome-component/welcome-component.component';

const welcomeRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponentComponent,
    children: [
      // {path: '', component: HomeComponent},
      {path: 'home', component: HomeComponent},
      {path: 'nosotros', component: NosotrosComponent},
      {path: 'servicios', component: ServiciosComponent},
      {path: 'servicios/propiedades', component: PropiedadesComponent},
      {path: 'servicios/lotes', component: LotesComponent},
      {path: 'servicios/alquileres', component: AlquileresComponent},
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
