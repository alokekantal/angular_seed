import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ShipCreationService {
    constructor(private http: HttpClient) {

    }
    
    saveOrUpdateShip (shipModel: any): Observable<any> {
        return this.http.post<any>('rest/core/saveShip  ', shipModel, httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    getShipDetail (shipId): Observable<any> {
        return this.http.post<any>('rest/core/loadShipDetailsById?shipId='+shipId, httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    uploadImageFileBulk(file: any, orgId: any, shipId: any): Observable<any> {
        const HttpUploadOptions = {            
        } 
        var formData = new FormData(); 
        formData.append("file", file);
        formData.append('orgId', orgId);
        formData.append('shipId', shipId);
        return this.http.post<any>('rest/resource/uploadShipDocument', formData, HttpUploadOptions);
    }

    async downloadDocument  (path: any, orgId: any, shipId: any): Promise<Blob> {
        const file =  await this.http.get<Blob>('rest/resource/downloadShipDocument?orgId='+orgId+"&shipId="+shipId+'&path='+path,{responseType: 'blob' as 'json'}).toPromise();
        return file;
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