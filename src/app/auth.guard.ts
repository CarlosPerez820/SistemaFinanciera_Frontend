import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // El usuario está autenticado, permite el acceso a la ruta protegida
      return true;
    } else {
      // El usuario no está autenticado, redirige a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}