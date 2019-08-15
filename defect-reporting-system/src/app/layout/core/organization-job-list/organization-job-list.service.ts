import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OrganizationJobListService {
    constructor(private http: HttpClient) {}

    loadJobList  (): Observable<any> {
        return this.http.post<any>('rest/project/loadOrganizationJobList', httpOptions);
    }
    
}