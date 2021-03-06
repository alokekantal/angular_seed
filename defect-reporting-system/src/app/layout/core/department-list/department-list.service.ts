import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DepartmentListService {
    constructor(private http: HttpClient) {

    }

    loadDepartmentList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadDepartmentList', httpOptions).pipe(
            tap(
                (model: any) => console.log('success'),
                error =>  console.log('error')
                )
        );
    }

    uploadFile(fileToUpload: any): Observable<any> {
        const HttpUploadOptions = {}
        var formData = new FormData();
        formData.append('file', fileToUpload);
        return this.http.post<any>('rest/core/uploadDepartmentExcel', formData, HttpUploadOptions).pipe(
            tap((registrain: any) => console.log('Registion fail')),
            catchError(this.handleError<any>('addHero'))
        );
    }

    async downloadUserTemplate  (): Promise<Blob> {
        const file =  await this.http.get<Blob>('rest/resource/loadDepartmentExcel',{responseType: 'blob' as 'json'}).toPromise();
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