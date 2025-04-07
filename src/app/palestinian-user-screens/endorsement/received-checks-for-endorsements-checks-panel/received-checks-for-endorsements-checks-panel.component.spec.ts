import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedChecksForEndorsementsChecksPanelComponent } from './received-checks-for-endorsements-checks-panel.component';

describe('ReceivedChecksForEndorsementsChecksPanelComponent', () => {
  let component: ReceivedChecksForEndorsementsChecksPanelComponent;
  let fixture: ComponentFixture<ReceivedChecksForEndorsementsChecksPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedChecksForEndorsementsChecksPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedChecksForEndorsementsChecksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
