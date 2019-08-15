import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApplicationComponemtListService {
    constructor(private http: HttpClient) {

    }
    
    getApplicationComponemtList (): Observable<any> {
        return this.http.post<any>('rest/project/loadApplicationComponentList', httpOptions);
    }

    saveApplicationComponemtList (model): Observable<any> {
        return this.http.post<any>('rest/project/saveApplicationComponent', model, httpOptions);
    }

    deleteComponent (componentId): Observable<any> {
        return this.http.post<any>('rest/project/deleteApplicationComponent?applicationcomponentid='+componentId, httpOptions);
    }
    
}