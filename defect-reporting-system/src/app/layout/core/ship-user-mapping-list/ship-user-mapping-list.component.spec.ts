import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipUserMappingListComponent } from './ship-user-mapping-list.component';

describe('ShipUserMappingListComponent', () => {
  let component: ShipUserMappingListComponent;
  let fixture: ComponentFixture<ShipUserMappingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipUserMappingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipUserMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
