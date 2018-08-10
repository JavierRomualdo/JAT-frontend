import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaConfiguracionComponent } from './empresa.component';

describe('EmpresaConfiguracionComponent', () => {
  let component: EmpresaConfiguracionComponent;
  let fixture: ComponentFixture<EmpresaConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
