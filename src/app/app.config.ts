import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DATE_FORMATS,
  MatNativeDateModule,
  MatOptionSelectionChange,
} from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TreeModule } from 'primeng/tree';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MY_FORMATS } from './formats/my-date-formats';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    HttpClientModule,
    provideClientHydration(),
    provideHttpClient(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(
      MatFormFieldModule,
      MatInputModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatSortModule,
      MatSort,
      MatDatepickerModule,
      MatNativeDateModule,
      MatFormFieldModule,
      MatOptionSelectionChange,
      MatTableModule,
      MatDialogModule,
      FormsModule,
      TreeModule,
      ReactiveFormsModule
    ),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
};
