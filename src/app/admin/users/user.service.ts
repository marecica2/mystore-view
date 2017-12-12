import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {User} from './user';

@Injectable()
export class UserService {
  private static apiUrl = '/api/customers';
  private headers = new Headers({'Content-Type': 'application/json'});

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  constructor(private http: Http) {
  }

  getUsers(): Promise<User[]> {
    return this.http.get(UserService.apiUrl)
      .toPromise()
      .then(response => response.json() as User[])
      .catch(UserService.handleError);
  }

  getUser(id: String): Promise<User> {
    const url = `${UserService.apiUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as User)
      .catch(UserService.handleError);
  }

  updateUser(user: User): Promise<User> {
    const url = `${UserService.apiUrl}/${user.id}`;
    return this.http.put(url, user)
      .toPromise()
      .then(response => response.json() as User)
      .catch(UserService.handleError);
  }
}
