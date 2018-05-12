import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaComponentComponent } from './empresa-component/empresa-component.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { AlquileresComponent } from './alquileres/alquileres.component';
import { LotesComponent } from './lotes/lotes.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { EmpresaRoutingModule } from './empresa-routing-module';
import { LocalesComponent } from './alquileres/locales/locales.component';
import { HabitacionesComponent } from './alquileres/habitaciones/habitaciones.component';
import { ModalEmpresaComponent } from './configuracion/modal-empresa/modal-empresa.component';
import { ModalPersonaComponent } from './configuracion/modal-persona/modal-persona.component';
import { ModalRolComponent } from './configuracion/modal-rol/modal-rol.component';
import { ModalPropiedadComponent } from './propiedades/modal-propiedad/modal-propiedad.component';
import { HomeComponent } from './home/home.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {KeyFilterModule} from 'primeng/keyfilter';
import { ModalLoteComponent } from './lotes/modal-lote/modal-lote.component';
import { ModalHabitacionComponent } from './alquileres/habitaciones/modal-habitacion/modal-habitacion.component';
import { ModalLocalComponent } from './alquileres/locales/modal-local/modal-local.component';

@NgModule({
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot(),
    UiSwitchModule,
    KeyFilterModule
  ],
  declarations: [
    EmpresaComponentComponent,
    PropiedadesComponent,
    AlquileresComponent,
    LotesComponent,
    ConfiguracionComponent,
    LocalesComponent,
    HabitacionesComponent,
    ModalEmpresaComponent,
    ModalPersonaComponent,
    ModalRolComponent,
    ModalPropiedadComponent,
    HomeComponent,
    ModalPropiedadComponent,
    ModalLoteComponent,
    ModalHabitacionComponent,
    ModalLocalComponent
  ],
  entryComponents: [
    ModalEmpresaComponent,
    ModalPersonaComponent,
    ModalRolComponent,
    ModalPropiedadComponent,
    ModalLoteComponent,
    ModalHabitacionComponent,
    ModalLocalComponent
  ],
  providers: [
    NgbActiveModal
  ]})
export class EmpresaModule { }

