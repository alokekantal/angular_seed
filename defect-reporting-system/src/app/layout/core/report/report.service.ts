import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ReportService {
    constructor(private http: HttpClient) {}

    loadProjectList  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadProjectListForCloser?shipId='+shipId, httpOptions);
    }

    loadShipList  (): Observable<any> {
        return this.http.post<any>('rest/core/shipListForAssignment', httpOptions);
    }

    async generateProjectReportIText  (projectId: any, reportFields: any): Promise<Blob> {
        const file =  await this.http.post<Blob>('rest/project/generateProjectReportIText?projectId='+projectId,reportFields,{responseType: 'blob' as 'json'}).toPromise();
        return file;
    }

    loadJobList  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadJobList?shipId='+shipId, httpOptions);
    }
}