import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const allowedRoles = route.data['roles'] as string[];

    const userRolesString = localStorage.getItem('userRoles');
    if (!userRolesString) {
      return this.router.createUrlTree(['/authorization-failed']);
    }

    const userRoles: string[] = JSON.parse(userRolesString);

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return this.router.createUrlTree(['/authorization-failed']);
    }

    return true;
  }
}
