import { HomeComponent } from './home/home.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { PropiedadesComponent } from './servicios/propiedades/propiedades.component';
import { AlquileresComponent } from './servicios/alquileres/alquileres.component';
import { LotesComponent } from './servicios/lotes/lotes.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const welcomeRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'nosotros', component: NosotrosComponent},
  {path: 'servicios', component: ServiciosComponent,
    children: [
      {path: 'alquileres', component: AlquileresComponent},
      {path: 'lotes', component: LotesComponent},
      {path: 'propiedades', component: PropiedadesComponent},
    ]
  },
  {path: 'suscripcion', component: SuscripcionComponent},
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '**', component: HomeComponent}
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
