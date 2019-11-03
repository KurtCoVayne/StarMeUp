import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessages: FlashMessagesService) { }

  ngOnInit() {
  }
  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };
    this.authService.authenticateUser(user).subscribe(response => {
      if (response.ok) {
        this.authService.storeUserData(response.data.token, response.data.user);
        this.flashMessages.show(`Has iniciado sesión correctamente!`, { cssClass: 'alert-success mt-2 w-100', timeout: 5000 });
        this.router.navigate(['/']);
      } else {
        this.flashMessages.show('Error iniciando sesión', { cssClass: 'alert-danger mt-2 w-100', timeout: 5000 });
        this.router.navigate(['/login']);
      }
    });
  }

}
