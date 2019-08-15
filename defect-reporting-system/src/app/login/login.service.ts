import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LoginService {
    constructor(private http: HttpClient) {

    }


    userLogin (loginModel: any): Observable<any> {
        return this.http.post<any>('rest/login/validateLogin?userCode='+loginModel.userCode+'&passcode='+loginModel.passcode, httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    forgotPasswordCheck (userCode: any, email: any): Observable<any> {
        return this.http.post<any>('rest/core/forgotPasswordCheck?userCode='+userCode+'&email='+email, httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    forgotPassword (userCode: any, email: any, password: any): Observable<any> {
        return this.http.post<any>('rest/core/forgotPassword?userCode='+userCode+'&email='+email+'&password='+password, httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

 /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
    
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
        return of(error as T);
        };
    }
}