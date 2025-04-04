import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationPerUserComponent } from './classification-per-user.component';

describe('ClassificationPerUserComponent', () => {
  let component: ClassificationPerUserComponent;
  let fixture: ComponentFixture<ClassificationPerUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassificationPerUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassificationPerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
