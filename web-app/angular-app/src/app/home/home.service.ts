import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  
  constructor(private homeService: DataService<any>) { }

  public login(): Observable<any> {
    return this.homeService.authorize();    
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
