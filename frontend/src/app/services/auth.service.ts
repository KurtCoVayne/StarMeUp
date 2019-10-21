import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import IUser from '../models/IUser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { IResponse } from '../models/IResponse';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URI = 'http://localhost:3000';
  // API_URI = 'https://estrellame.herokuapp.com';
  authToken: string;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  registerUser(user: IUser) {
    return this.http.post(`${this.API_URI}/api/auth/logup`, user, { headers: { 'Content-Type': 'application/json' } })
      .pipe(map((res: IResponse) => res));
  }
  authenticateUser(user: IUser): Observable<IResponse> {
    console.log(user);
    return this.http.post(`${this.API_URI}/api/auth/login`, user, { headers: { 'Content-Type': 'application/json' } })
      .pipe(map((res: IResponse) => res));
  }

  getProfile(): Observable<IResponse> {
    this.loadToken();
    return this.http.get(`${this.API_URI}/api/auth/profile`, {
      headers: { 'Content-Type': 'application/json', Authorization: this.authToken }
    })
      .pipe(map((res: any) => res));
  }

  storeUserData(token: string, user: IUser): void {
    localStorage.setItem('id_token', token);
    this.authToken = token;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return this.jwtHelper.isTokenExpired(this.authToken);
  }

  logout() {
    this.authToken = null;
    localStorage.clear();
  }
}
