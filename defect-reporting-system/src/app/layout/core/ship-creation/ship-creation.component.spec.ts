import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipCreationComponent } from './ship-creation.component';

describe('ShipCreationComponent', () => {
  let component: ShipCreationComponent;
  let fixture: ComponentFixture<ShipCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
