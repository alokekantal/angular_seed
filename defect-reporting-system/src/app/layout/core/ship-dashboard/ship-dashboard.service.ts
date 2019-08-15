import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ShipDashboardService {
    constructor(private http: HttpClient) {

    }

    loadProjectList  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadCompletedProjectListByShipId?shipId=' + shipId, httpOptions);
    }

    getShipDetail (shipId): Observable<any> {
        return this.http.post<any>('rest/core/loadShipDetailsById?shipId=' + shipId, httpOptions);
    }

    loadJobList  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadJobList?shipId=' + shipId, httpOptions);
    }

    loadActiveProjectDetail  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadActiveProjectDetail?shipId=' + shipId, httpOptions);
    }

    async downloadDocument  (path: any, orgId: any, shipId: any): Promise<Blob> {
        const file =  await this.http.get<Blob>('rest/resource/downloadShipDocument?orgId='+orgId+"&shipId="+shipId+'&path='+path,{responseType: 'blob' as 'json'}).toPromise();
        return file;
    }

    uploadFile(fileToUpload: any): Observable<any> {
        const HttpUploadOptions = {}
        var formData = new FormData();
        formData.append('file', fileToUpload);
        return this.http.post<any>('rest/core/downloadReport', formData, HttpUploadOptions);
    }
}
