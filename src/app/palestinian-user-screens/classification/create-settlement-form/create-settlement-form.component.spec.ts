import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSettlementFormComponent } from './create-settlement-form.component';

describe('CreateSettlementFormComponent', () => {
  let component: CreateSettlementFormComponent;
  let fixture: ComponentFixture<CreateSettlementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSettlementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSettlementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
