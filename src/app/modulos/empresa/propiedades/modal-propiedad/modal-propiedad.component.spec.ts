import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPropiedadComponent } from './modal-propiedad.component';

describe('ModalPropiedadComponent', () => {
  let component: ModalPropiedadComponent;
  let fixture: ComponentFixture<ModalPropiedadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPropiedadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
