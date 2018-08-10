import { CommonModule } from '@angular/common';
import { EmpresaComponentComponent } from './empresa-component/empresa-component.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { AlquileresComponent } from './alquileres/alquileres.component';
import { LotesComponent } from './lotes/lotes.component';
import { EmpresaConfiguracionComponent } from './configuracion/empresa/empresa.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalesComponent } from './alquileres/locales/locales.component';
import { HabitacionesComponent } from './alquileres/habitaciones/habitaciones.component';
import { HomeComponent } from './home/home.component';
import { UbigeoComponent } from './configuracion/ubigeo/ubigeo.component';

const empresaRoutes: Routes = [
  {
    path: '',
    component: EmpresaComponentComponent,
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'alquileres/locales', component: LocalesComponent},
      {path: 'alquileres/habitaciones', component: HabitacionesComponent},
      {path: 'propiedades', component: PropiedadesComponent},
      {path: 'configuracion/empresa', component: EmpresaConfiguracionComponent},
      {path: 'configuracion/ubigeo', component: UbigeoComponent},
      {path: 'lotes', component: LotesComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: '**', component: HomeComponent}
    ]
  },

  /*{path: 'perfil', component: PerfilUsuarioComponent,
      children: [
        {path: 'editperfil', component: PerfilComponent},
        {path: 'cuenta', component: CuentaComponent},
        {path: 'foto', component: FotoComponent},
      ]
  },*/
];

@NgModule({
  imports: [
    RouterModule.forChild(empresaRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EmpresaRoutingModule {
}
