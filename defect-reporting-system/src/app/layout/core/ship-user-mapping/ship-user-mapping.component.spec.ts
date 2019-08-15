import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipUserMappingComponent } from './ship-user-mapping.component';

describe('ShipUserMappingComponent', () => {
  let component: ShipUserMappingComponent;
  let fixture: ComponentFixture<ShipUserMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipUserMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipUserMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
