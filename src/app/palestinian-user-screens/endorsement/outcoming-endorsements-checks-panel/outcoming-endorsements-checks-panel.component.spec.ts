import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomingEndorsementsChecksPanelComponent } from './outcoming-endorsements-checks-panel.component';

describe('OutcomingEndorsementsChecksPanelComponent', () => {
  let component: OutcomingEndorsementsChecksPanelComponent;
  let fixture: ComponentFixture<OutcomingEndorsementsChecksPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutcomingEndorsementsChecksPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutcomingEndorsementsChecksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
