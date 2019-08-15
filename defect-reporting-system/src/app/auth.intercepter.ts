import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import {catchError} from "rxjs/internal/operators";

import { AlertDialogService } from './alert-dialog/alert-dialog.service';

@Injectable()
export class AuthIntercepter implements HttpInterceptor{
  constructor(private alertDialogService: AlertDialogService,){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = environment.baseUrl +'/TrackDefect/';
    //console.log(window.location.origin);
    let currentUser = JSON.parse(localStorage.getItem('loginInfo'));
      if (currentUser && currentUser[0].token) {
          request = request.clone({
              url: url + request.url,
              setHeaders: { 
                  Authorization: currentUser[0].token
              }
          });
      }else{
        request = request.clone({
          url: url + request.url,
        });
      }     
  
    return next.handle(request).pipe(catchError((error, caught) => {
      this.handleAuthError(error);
      return of(error);
    }) as any);;
  }

  private handleAuthError(err: HttpErrorResponse) {
    if (err instanceof HttpErrorResponse) {
      // Server error happened      
        if (!navigator.onLine) {
          // No Internet connection
          this.alertDialogService.alert('Error!', 'No Internet connection', 'OK', 'lg')
          .then((alert) => console.log('User confirmed:', alert))
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
        }else{         
          // Http Error
          this.alertDialogService.alert('Error!', err.error.message, 'OK', 'lg')
          .then((alert) => console.log('User confirmed:', alert))
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
        }
        
      }
    throw err;
  }
}