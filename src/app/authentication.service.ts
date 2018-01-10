import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { Headers, Response, RequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    
    public token: string = null;

    constructor(private http: Http, private router: Router) {
        if (Cookie.check('access_token')) {
            this.token = Cookie.get('access_token');
        }
    }

    isLogged(): boolean {
        if (Cookie.check('access_token'))
            return true;
        else
            return false;
    }

    login(username: string, password: string): Observable<boolean> {
        let params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('grant_type', 'password');
        params.append('client_id', 'fooClientIdPassword');

        let headers = new Headers({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Basic ' + btoa("fooClientIdPassword:secret")
        });
        let options = new RequestOptions({ headers: headers });
        console.log(params.toString());
        this.http.post('/api/oauth/token', params.toString(), options)
            .map(res => res.json())
            .subscribe(
            data => {
                this.saveToken(data);
            },
            err => {
                alert('Invalid Credentials');
            });

        return Observable.of(true);
    }

    saveToken(token) {
        var expireDate = new Date().getTime() + (1000 * token.expires_in);
        Cookie.set("access_token", token.access_token, expireDate);
        console.log('Obtained Access token');
        this.router.navigate(['/']);
        this.token = token.access_token;
    }

    getResource(resourceUrl): Observable<any> {
        var headers = new Headers({ 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Bearer ' + Cookie.get('access_token') });
        var options = new RequestOptions({ headers: headers });
        return this.http.get(resourceUrl, options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    checkCredentials() {
        if (!Cookie.check('access_token')) {
            this.router.navigate(['/login']);
        }
    }

    logout() {
        Cookie.delete('access_token');
        this.router.navigate(['/login']);
    }
}