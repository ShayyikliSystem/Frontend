import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEndorseCheckFormComponent } from './request-endorse-check-form.component';

describe('RequestEndorseCheckFormComponent', () => {
  let component: RequestEndorseCheckFormComponent;
  let fixture: ComponentFixture<RequestEndorseCheckFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestEndorseCheckFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestEndorseCheckFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
