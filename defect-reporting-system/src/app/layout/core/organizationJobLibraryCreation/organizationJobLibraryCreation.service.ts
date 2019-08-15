import { Injectable } from "@angular/core";
import { Http, Response, ResponseContentType } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OrganizationjobLibraryCreationService {
    constructor(private http: HttpClient) { }
    
    saveOrUpdateJob (model: any): Observable<any> {
        return this.http.post<any>('rest/project/saveOrganizationJob ', model, httpOptions);
    }

    loadJobDetails (jobId: any): Observable<any> {
        return this.http.post<any>('rest/project/loadOrganizationJobDetail?jobId='+jobId, httpOptions);
    }
}