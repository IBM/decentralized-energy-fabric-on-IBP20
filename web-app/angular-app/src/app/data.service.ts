import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Configuration } from './configuration';

@Injectable()
export class DataService<Type> {
    private resolveSuffix: string = '?resolve=true';
    private actionUrl: string;
    private headers: Headers;
    //private token: string;

    //get rest api configuration from configuration.ts
    constructor(private http: Http, private _configuration: Configuration) {
        this.actionUrl = _configuration.ServerWithApiUrl;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');        
        this.headers.append('Authorization', null);

    }

    public getAll(ns: string): Observable<Type[]> {

        var access_token = localStorage.getItem('access_token');
        var token = 'Bearer ' + access_token;
        //console.log('token');
        //console.log(token);
        this.headers.set('Authorization', token);

        //console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
        return this.http.get(`${this.actionUrl}${ns}`, { headers: this.headers })
          .map(this.extractData)
          .catch(this.handleError);
    }

    public getSingle(ns: string, id: string): Observable<Type> {

        var access_token = localStorage.getItem('access_token');
        var token = 'Bearer ' + access_token;
        //console.log('token');
        //console.log(token);
        this.headers.set('Authorization', token);

        //console.log('GetSingle ' + ns);
        return this.http.get(this.actionUrl + ns + '/' + id + this.resolveSuffix, { headers: this.headers })
          .map(this.extractData)
          .catch(this.handleError);
    }

    public add(ns: string, asset: Type): Observable<Type> {

        var access_token = localStorage.getItem('access_token');
        var token = 'Bearer ' + access_token;
        //console.log('token');
        //console.log(token);
        this.headers.set('Authorization', token);

        //console.log('Entered DataService add');
        //console.log('Add ' + ns);
        //console.log('asset', asset);

        return this.http.post(this.actionUrl + ns, asset, { headers: this.headers })
          .map(this.extractData)
          .catch(this.handleError);
    }

    //get all transactions from system historian
    public transactions(): Observable<Type> {

        var access_token = localStorage.getItem('access_token');
        var token = 'Bearer ' + access_token;
        //console.log('token');
        //console.log(token);
        this.headers.set('Authorization', token);
        
        //console.log('Get transactions ');

        return this.http.get(this.actionUrl + 'blockchain', { headers: this.headers })
        .map(this.extractData)
        .catch(this.handleError);
    }

    public authorize(): Observable<Type> {
        //console.log('Authorize');

        return this.http.post(this.actionUrl + 'auth', {})
          .map(this.extractData)
          .catch(this.handleError);
    }

    private handleError(error: any): Observable<string> {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private extractData(res: Response): any {
        return res.json();
    }

}
