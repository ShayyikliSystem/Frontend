import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedChecksPanelComponent } from './received-checks-panel.component';

describe('ReceivedChecksPanelComponent', () => {
  let component: ReceivedChecksPanelComponent;
  let fixture: ComponentFixture<ReceivedChecksPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedChecksPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedChecksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
