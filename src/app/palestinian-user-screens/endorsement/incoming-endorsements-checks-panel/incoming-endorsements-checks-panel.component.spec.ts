import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingEndorsementsChecksPanelComponent } from './incoming-endorsements-checks-panel.component';

describe('IncomingEndorsementsChecksPanelComponent', () => {
  let component: IncomingEndorsementsChecksPanelComponent;
  let fixture: ComponentFixture<IncomingEndorsementsChecksPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingEndorsementsChecksPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomingEndorsementsChecksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
