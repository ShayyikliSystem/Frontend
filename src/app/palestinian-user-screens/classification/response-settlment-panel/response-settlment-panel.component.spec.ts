import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseSettlmentPanelComponent } from './response-settlment-panel.component';

describe('ResponseSettlmentPanelComponent', () => {
  let component: ResponseSettlmentPanelComponent;
  let fixture: ComponentFixture<ResponseSettlmentPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseSettlmentPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseSettlmentPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
