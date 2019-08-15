import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class JobListService {
    constructor(private http: HttpClient) {}

    loadJobList  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadJobList?shipId='+shipId, httpOptions);
    }

    loadProject  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadProjectList?shipId='+shipId, httpOptions);
    }

    markJobComplete  (jobId, jobCloserRemark): Observable<any> {
        return this.http.post<any>('rest/project/markJobComplete?jobId='+jobId+"&jobCloserRemark="+jobCloserRemark, httpOptions);
    }

    markJobCancel  (jobId): Observable<any> {
        return this.http.post<any>('rest/project/markJobCancel?jobId='+jobId, httpOptions);
    }

    generatejobReport  (jobId: any): Observable<any> {
        return this.http.post<any>('rest/dataTransfer/excelGenerator', httpOptions);
    }
}