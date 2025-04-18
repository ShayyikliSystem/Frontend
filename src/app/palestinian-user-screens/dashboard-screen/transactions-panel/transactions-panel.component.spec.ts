import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsPanelComponent } from './transactions-panel.component';

describe('TransactionsPanelComponent', () => {
  let component: TransactionsPanelComponent;
  let fixture: ComponentFixture<TransactionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
