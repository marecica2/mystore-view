import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http, private router: Router) {
        // set token if saved in local storage
        var currentUser = localStorage.getItem('currentUser');
        this.token = currentUser;
    }

    login(username: string, password: string): Observable<Response> {

        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        });
        let options = new RequestOptions({ headers: headers });
        let pr: Promise<Response> = this.http.post('/api/login', 'username=' + username + '&password=' + password, options).toPromise();
        pr.then(response => {
            this.token = btoa(username + ":" + password);
            localStorage.setItem('currentUser', this.token);
            this.router.navigate(['/']);
        }).catch(response => {
            console.log("error while logging in");
        });

        return Observable.fromPromise(pr);
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        let pr: Promise<Response> = this.http.post('/api/logout', null).toPromise();
        pr.then(response => {
            console.log(response);
            this.router.navigate(['/']);
        }).catch(response => {
            console.error(response);
        });

    }

    isLogged(): boolean {
        return this.token !== null;
    }
}