import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFunctionMappingComponent } from './role-function-mapping.component';

describe('RoleFunctionMappingComponent', () => {
  let component: RoleFunctionMappingComponent;
  let fixture: ComponentFixture<RoleFunctionMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleFunctionMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFunctionMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
