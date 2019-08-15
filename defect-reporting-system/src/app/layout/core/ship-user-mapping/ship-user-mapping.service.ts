import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ShipMappingService {
    constructor(private http: HttpClient) {

    }
    
    loadShipListByUserId  (): Observable<any> {
        //return this.http.post<any>('rest/core/shipListForAssignment', httpOptions).pipe(
        return this.http.post<any>('rest/core/shipListForAssignment', httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    loadUserUnderLoggedInUser  (): Observable<any> {
        return this.http.post<any>('rest/core/loadAllUserUnderLoggedInUser', httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    loadUserAssignedToShip  (shipId): Observable<any> {
        return this.http.post<any>('rest/core/loadUserAssignedToShip?shipId='+shipId, httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    saveShipUserMapping (shipId: any, removedUserIdList: any, addedUserIdList: any): Observable<any> {
        return this.http.post<any>('rest/core/saveUserShipMapping?shipId='+shipId+"&removedUserIdList="+removedUserIdList+"&addedUserIdList="+addedUserIdList, httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }


    addUserToShip(shipId: number, user: Array<number>): Observable<any> {
        return this.http.post<any>('rest/core/addUserToShip?shipId='+shipId+"&userId="+user, httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    removeUserFromShip(shipId: number, user: Array<number>): Observable<any> {
        return this.http.post<any>('rest/core/removeUserFromShip?shipId='+shipId+"&userId="+user, httpOptions).pipe(
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