import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VesselDocTypeListService {
    constructor(private http: HttpClient) {

    }

    loadApplicationVesselDocTypeList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadApplicationVesselDocTypeList', httpOptions);
    }

    loadOrganizationVesselDocTypeList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadOrganizationVesselDocTypeList', httpOptions);
    }

    saveApplicationVesselDocTypeList  (docTypeList: any): Observable<any> {
        return this.http.post<any>('rest/core/saveApplicationVesselDocTypeList', docTypeList, httpOptions);
    }

    saveOrganizationVesselDocTypeList  (docTypeList: any): Observable<any> {
        return this.http.post<any>('rest/core/saveOrganizationVesselDocTypeList', docTypeList, httpOptions);
    }
}