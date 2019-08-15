import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CopyJobFromOldJobService {
  constructor(private http: HttpClient) {}

  loadMyJobList (shipId: any): Observable<any> {
    return this.http.post<any>('rest/project/loadMyJobList?shipId=' + shipId, httpOptions);
  }

  copyJob (data): Observable<any> {    
    return this.http.post<any>('rest/project/copyMultipleJob', data, httpOptions);
  }

  loadOrgJobList  (): Observable<any> {
    return this.http.post<any>('rest/project/loadOrganizationJobList', httpOptions);
  }

  loadShipList  (): Observable<any> {
    return this.http.post<any>('rest/core/shipListForAssignment', httpOptions);
  }
}
