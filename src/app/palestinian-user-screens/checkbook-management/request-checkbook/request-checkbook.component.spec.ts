import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCheckbookComponent } from './request-checkbook.component';

describe('RequestCheckbookComponent', () => {
  let component: RequestCheckbookComponent;
  let fixture: ComponentFixture<RequestCheckbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestCheckbookComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestCheckbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
