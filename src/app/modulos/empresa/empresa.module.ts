import { environment } from '../../../environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmpresaComponentComponent } from './empresa-component/empresa-component.component';
import { PropiedadesComponent } from './propiedades/propiedades.component';
import { AlquileresComponent } from './alquileres/alquileres.component';
import { LotesComponent } from './lotes/lotes.component';
import { EmpresaConfiguracionComponent } from './configuracion/empresa/empresa.component';
import { EmpresaRoutingModule } from './empresa-routing-module';
import { LocalesComponent } from './alquileres/locales/locales.component';
import { HabitacionesComponent } from './alquileres/habitaciones/habitaciones.component';
import { ModalEmpresaComponent } from './configuracion/empresa/modal-empresa/modal-empresa.component';
import { ModalPersonaComponent } from './configuracion/empresa/modal-persona/modal-persona.component';
import { ModalRolComponent } from './configuracion/empresa/modal-rol/modal-rol.component';
import { ModalPropiedadComponent } from './propiedades/modal-propiedad/modal-propiedad.component';
import { HomeComponent } from './home/home.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ProgressBarModule} from 'primeng/progressbar';
import { ModalLoteComponent } from './lotes/modal-lote/modal-lote.component';
import { ModalHabitacionComponent } from './alquileres/habitaciones/modal-habitacion/modal-habitacion.component';
import { ModalLocalComponent } from './alquileres/locales/modal-local/modal-local.component';
import { ModalServicioComponent } from './configuracion/empresa/modal-servicio/modal-servicio.component';
import { ModalUsuarioComponent } from './configuracion/empresa/modal-usuario/modal-usuario.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ConfirmacionComponent } from '../../util/confirmacion/confirmacion.component';

import { NgDropFileDirective } from '../../directivas/ng-drop-file.directive';
import { AngularFireModule } from 'angularfire2';
import { CargaImagenesService } from '../../servicios/carga-imagenes.service';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ModalTipoUbigeoComponent } from './configuracion/ubigeo/modal-tipoubigeo/modal-tipoubigeo.component';
import { ModalUbigeoComponent } from './configuracion/ubigeo/modal-ubigeo/modal-ubigeo.component';
import { UbigeoComponent } from './configuracion/ubigeo/ubigeo.component';
import { CargandoComponent } from './../../util/cargando/cargando.component';
import { CocherasComponent } from './alquileres/cocheras/cocheras.component';
import { ApartamentosComponent } from './alquileres/apartamentos/apartamentos.component';
import { ModalCocheraComponent } from './alquileres/cocheras/modal-cochera/modal-cochera.component';
import { ModalApartamentoComponent } from './alquileres/apartamentos/modal-apartamento/modal-apartamento.component';
import { ModalApartamentocuartoComponent } from './alquileres/apartamentos/modal-apartamentocuarto/modal-apartamentocuarto.component';
@NgModule({
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot(),
    UiSwitchModule,
    KeyFilterModule,
    ProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  declarations: [
    EmpresaComponentComponent,
    CargandoComponent,
    PropiedadesComponent,
    AlquileresComponent,
    LotesComponent,
    EmpresaConfiguracionComponent,
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
    ModalLocalComponent,
    ModalServicioComponent,
    ModalUsuarioComponent,
    ModalTipoUbigeoComponent,
    ModalUbigeoComponent,
    UbigeoComponent,
    ConfirmacionComponent,
    NgDropFileDirective,
    CocherasComponent,
    ApartamentosComponent,
    ModalCocheraComponent,
    ModalApartamentoComponent,
    ModalApartamentocuartoComponent,
  ],
  entryComponents: [
    ModalEmpresaComponent,
    ModalPersonaComponent,
    ModalRolComponent,
    ModalPropiedadComponent,
    ModalLoteComponent,
    ModalHabitacionComponent,
    ModalLocalComponent,
    ModalServicioComponent,
    ModalCocheraComponent,
    ModalApartamentoComponent,
    ModalApartamentocuartoComponent,
    ModalUsuarioComponent,
    ModalTipoUbigeoComponent,
    ModalUbigeoComponent,
    ConfirmacionComponent
  ],
  providers: [
    NgbActiveModal,
    CargaImagenesService
  ]})
export class EmpresaModule { }

