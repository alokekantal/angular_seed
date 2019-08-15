import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DockyardCreationService {
    constructor(private http: HttpClient) {}
    
    saveOrUpdateDockyard (dockyardModel: any): Observable<any> {
        return this.http.post<any>('rest/core/saveDockyard ', dockyardModel, httpOptions);
    }

    getDockyardDetail (dockyardId): Observable<any> {
        return this.http.post<any>('rest/core/loadDockyardById?dockyardId='+dockyardId, httpOptions);
    }
}