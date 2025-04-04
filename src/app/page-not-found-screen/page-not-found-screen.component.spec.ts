import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundScreenComponent } from './page-not-found-screen.component';

describe('PageNotFoundScreenComponent', () => {
  let component: PageNotFoundScreenComponent;
  let fixture: ComponentFixture<PageNotFoundScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
