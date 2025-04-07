import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckbookInfoPanelComponent } from './checkbook-info-panel.component';

describe('CheckbookInfoPanelComponent', () => {
  let component: CheckbookInfoPanelComponent;
  let fixture: ComponentFixture<CheckbookInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckbookInfoPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckbookInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
