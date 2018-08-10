import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTipoUbigeoComponent } from './modal-tipoubigeo.component';

describe('ModalTipoUbigeoComponent', () => {
  let component: ModalTipoUbigeoComponent;
  let fixture: ComponentFixture<ModalTipoUbigeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTipoUbigeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTipoUbigeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
