import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private flashMessages: FlashMessagesService) {

  }
  canActivate() {
      if (!this.authService.loggedIn()) {
          return true;
      } else {
          this.router.navigate(['/login']);
          this.flashMessages.show(`Debes iniciar sesión`, { cssClass: 'alert-danger mt-2', timeout: 3000 });
          return false;
      }
  }
}
