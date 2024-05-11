import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';
import { Observable, tap, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL  = environments.baseURL;
  private user?: User;

  constructor( private httpClient: HttpClient) { }

  get currentUser():User|undefined {
    if( !this.user ) return undefined;
    return structuredClone( this.user );
  }

  login( email: string, password: string ): Observable<User>{
    // sould be a post petition

    return this.httpClient.get<User>(`${ this.baseURL }/users/1`)
    .pipe(
      tap( user => this.user = user),
      tap( user => localStorage.setItem('token', user.id.toString() ))
    );
  }

  checkAuthentication():Observable<boolean>{

    if( !localStorage.getItem( 'token' ) ) return of(false);
    const token = localStorage.getItem( 'token' );
    return this.httpClient.get<User>(`${ this.baseURL }/users/1`)
    .pipe(
      tap( user => this.user = user),
      map( user => !!user),
      catchError( err => of( false ))
    );
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

}
