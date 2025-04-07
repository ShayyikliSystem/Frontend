import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInfoPanelComponent } from './general-info-panel.component';

describe('GeneralInfoPanelComponent', () => {
  let component: GeneralInfoPanelComponent;
  let fixture: ComponentFixture<GeneralInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralInfoPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
