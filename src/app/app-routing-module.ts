import { LoginComponent } from './componentescomunes/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SelectivePreloadingStrategy } from './selective-preloading-startegy';
import { AuthGuardService } from './servicios/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'welcome', loadChildren: 'app/modulos/welcome/welcome.module#WelcomeModule' },
  { path : 'empresa',
    loadChildren: 'app/modulos/empresa/empresa.module#EmpresaModule'}, // canActivate: [AuthGuardService]
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        useHash : true,
        preloadingStrategy: SelectivePreloadingStrategy
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    SelectivePreloadingStrategy
  ]
})

export class AppRoutingModule {
}
