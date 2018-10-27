import { CommonModule } from '@angular/common';
import { EmpresaComponentComponent } from './empresa-component/empresa-component.component';
import { CasaComponent } from './propiedades/casas/casa.component';
import { AlquileresComponent } from './alquileres/alquileres.component';
import { LotesComponent } from './propiedades/lotes/lotes.component';
import { EmpresaConfiguracionComponent } from './configuracion/empresa/empresa.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalesComponent } from './propiedades/locales/locales.component';
import { HabitacionesComponent } from './propiedades/habitaciones/habitaciones.component';
import { HomeComponent } from './home/home.component';
import { UbigeoComponent } from './configuracion/ubigeo/ubigeo.component';
import { CocherasComponent } from './propiedades/cocheras/cocheras.component';
import { ApartamentosComponent } from './propiedades/apartamentos/apartamentos.component';
import { VentasComponent } from './ventas/ventas.component';

const empresaRoutes: Routes = [
  {
    path: '',
    component: EmpresaComponentComponent,
    children: [
      {path: 'inicio', component: HomeComponent},
      {path: 'propiedades/locales', component: LocalesComponent},
      {path: 'propiedades/habitaciones', component: HabitacionesComponent},
      {path: 'propiedades/cocheras', component: CocherasComponent},
      {path: 'propiedades/apartamentos', component: ApartamentosComponent},
      {path: 'propiedades/casas', component: CasaComponent},
      {path: 'propiedades/lotes', component: LotesComponent},
      {path: 'alquileres', component: AlquileresComponent},
      {path: 'ventas', component: VentasComponent},
      {path: 'configuracion/empresa', component: EmpresaConfiguracionComponent},
      {path: 'configuracion/ubigeo', component: UbigeoComponent},
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
