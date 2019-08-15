import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ManageShipComponentsService {
    constructor(private http: HttpClient) {

    }
    
    getOrganizationComponemtList (): Observable<any> {
        return this.http.post<any>('rest/project/loadOrganizationComponentList', httpOptions);
    }

    saveComponentDetail (model): Observable<any> {
        return this.http.post<any>('rest/project/saveShipComponentDetails', model, httpOptions);
    }

    deleteComponent (componentId): Observable<any> {
        return this.http.post<any>('rest/project/deleteOrganizationComponent?organizationcomponentid='+componentId, httpOptions);
    }

    getComponentDetail (componentId, shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadShipComponentDetails?organizationcomponentid='+componentId+"&shipId="+shipId, httpOptions);
    }
    
}