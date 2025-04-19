import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalestinianManagementComponent } from './palestinian-management.component';

describe('PalestinianManagementComponent', () => {
  let component: PalestinianManagementComponent;
  let fixture: ComponentFixture<PalestinianManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalestinianManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalestinianManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
