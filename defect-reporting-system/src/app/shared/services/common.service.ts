import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CommonService {
    constructor(private http: HttpClient) {

    }
    
    loadDepartmentList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadDepartmentList', httpOptions);
    }

    loadDesignationList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadDesignationList', httpOptions);
    }

    loadRoleList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadRoleList', httpOptions);
    }

    loadUserList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadUserList', httpOptions);
    }

    loadFunctionList(): Observable<any> {
        return this.http.post<any>('rest/core/loadFunctionList', httpOptions);
    }

    loadOrganization(): Observable<any> {
        return this.http.post<any>('rest/core/loadOrganization?orgId='+JSON.parse(localStorage.getItem('loginInfo'))[0].orgId, httpOptions);
    }

    loadShipDetail (shipId): Observable<any> {
        return this.http.post<any>('rest/core/loadShipDetailsById?shipId='+shipId, httpOptions);
    }

    loadShipList(): Observable<any> {
        return this.http.post<any>('rest/core/shipListForCreation', httpOptions);
    }

    loadOrganizationList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadOrganizationList', httpOptions);
    }

    getMasterVesselTypeList(): Observable<any> {
        return this.http.post<any>('rest/core/getMasterVesselTypeList', httpOptions);
    }

    loadApplicationJobDetails(applicationJobId: any): Observable<any> {
        return this.http.post<any>('rest/project/loadApplicationJobDetails?applicationJobId='+applicationJobId, httpOptions);
    }

    loadMyJobList(jobId: any): Observable<any> {
        return this.http.post<any>('rest/project/loadJobDetails?jobId='+jobId, httpOptions);
    }

    getOrganizationComponemtList (): Observable<any> {
        return this.http.post<any>('rest/project/loadOrganizationComponentList', httpOptions);
    }

    getApplicationComponemtList (): Observable<any> {
        return this.http.post<any>('rest/project/loadApplicationComponentList', httpOptions);
    }

    loadCheckboxesList (): Observable<any> {
        return this.http.post<any>('rest/project/loadCheckboxesList', httpOptions);
    }

    loadOrganizationJobDetail(jobId: any): Observable<any> {
        return this.http.post<any>('rest/project/loadOrganizationJobDetail?jobId='+jobId, httpOptions);
    }

    loadDockyardList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadDockyardList', httpOptions);
    }

    getComponentDetail (componentId, shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadShipComponentDetails?organizationcomponentid='+componentId+"&shipId="+shipId, httpOptions);
    }

    loadOrganizationVesselDocTypeList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadOrganizationVesselDocTypeList', httpOptions);
    }

    loadShipAttachmentListList (shipId): Observable<any> {
        return this.http.post<any>('rest/core/loadShipDetailsById?shipId='+shipId, httpOptions).pipe(
            map(shipDetail => shipDetail.shipAttachmentList));
    }

    loadCurrencyMaster(): Observable<any> {
        return this.http.post<any>('rest/core/loadCurrencyList', httpOptions);
    }
}
