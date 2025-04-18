import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedChecksPanelComponent } from './issued-checks-panel.component';

describe('IssuedChecksPanelComponent', () => {
  let component: IssuedChecksPanelComponent;
  let fixture: ComponentFixture<IssuedChecksPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuedChecksPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IssuedChecksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
