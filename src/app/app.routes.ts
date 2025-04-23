import { UserLayoutComponent } from './palestinian-user-screens/user-layout/user-layout.component';
import { ExtraOptions, Routes } from '@angular/router';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { SignupScreenComponent } from './signup-screen/signup-screen.component';
import { ForgotPasswordScreenComponent } from './forgot-password-screen/forgot-password-screen.component';
import { EmailSentScreenComponent } from './email-sent-screen/email-sent-screen.component';
import { SignupSuccessScreenComponent } from './signup-success-screen/signup-success-screen.component';
import { AuthenticationFailedScreenComponent } from './authentication-failed-screen/authentication-failed-screen.component';
import { AuthorizationFailedScreenComponent } from './authorization-failed-screen/authorization-failed-screen.component';
import { PageNotFoundScreenComponent } from './page-not-found-screen/page-not-found-screen.component';
import { DashboardScreenComponent } from './palestinian-user-screens/dashboard-screen/dashboard-screen.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardAdminScreenComponent } from './admin-screens/dashboard-admin-screen/dashboard-admin-screen.component';
import { RoleGuard } from './services/role.guard';
import { CheckManagementComponent } from './palestinian-user-screens/check-management/check-management.component';
import { ClassificationComponent } from './palestinian-user-screens/classification/classification.component';
import { EndorsementComponent } from './palestinian-user-screens/endorsement/endorsement.component';
import { SecurityComponent } from './palestinian-user-screens/security/security.component';
import { SettingsComponent } from './palestinian-user-screens/settings/settings.component';
import { TransactionComponent } from './palestinian-user-screens/transaction/transaction.component';
import { SupportComponent } from './palestinian-user-screens/support/support.component';
import { CheckbookManagementComponent } from './palestinian-user-screens/checkbook-management/checkbook-management.component';
import { AdminLayoutComponent } from './admin-screens/admin-layout/admin-layout.component';
import { ContactRequestsComponent } from './admin-screens/contact-requests/contact-requests.component';
import { PalestinianManagementComponent } from './admin-screens/palestinian-management/palestinian-management.component';
import { SupportMessagesComponent } from './admin-screens/support-messages/support-messages.component';

export const routes: Routes = [
  { path: '', component: SplashScreenComponent },
  { path: 'home', component: HomeScreenComponent },
  { path: 'login', component: LoginScreenComponent },
  { path: 'signup', component: SignupScreenComponent },
  { path: 'forgot-password', component: ForgotPasswordScreenComponent },
  { path: 'email-sent', component: EmailSentScreenComponent },
  { path: 'signup-success', component: SignupSuccessScreenComponent },
  {
    path: 'authentication-failed',
    component: AuthenticationFailedScreenComponent,
  },
  {
    path: 'authorization-failed',
    component: AuthorizationFailedScreenComponent,
  },
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: 'dashboard', component: DashboardScreenComponent },
      { path: 'checkbook-management', component: CheckbookManagementComponent },
      { path: 'check-management', component: CheckManagementComponent },
      { path: 'endorsement', component: EndorsementComponent },
      { path: 'classification', component: ClassificationComponent },
      { path: 'transaction', component: TransactionComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'support', component: SupportComponent },
      { path: 'settings', component: SettingsComponent },
    ],
    data: { roles: ['ROLE_PALESTINIAN'] },
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: 'dashboard', component: DashboardAdminScreenComponent },
      { path: 'palestinian', component: PalestinianManagementComponent },
      { path: 'support', component: SupportMessagesComponent },
      { path: 'contacts', component: ContactRequestsComponent },
    ],
  },
  { path: '**', component: PageNotFoundScreenComponent },
];

export const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};
