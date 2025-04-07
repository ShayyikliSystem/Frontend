import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedChecksPanelComponent } from './returned-checks-panel.component';

describe('ReturnedChecksPanelComponent', () => {
  let component: ReturnedChecksPanelComponent;
  let fixture: ComponentFixture<ReturnedChecksPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnedChecksPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnedChecksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
