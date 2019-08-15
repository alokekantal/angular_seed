import { Injectable } from "@angular/core";
import { Http, Response, ResponseContentType } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class JobCreationService {
    constructor(private http: HttpClient) { }
    
    saveOrUpdateJob (model: any): Observable<any> {
        return this.http.post<any>('rest/project/saveJobWithAttachment ', model, httpOptions);
    }

    loadJobDetails (jobId: any): Observable<any> {
        return this.http.post<any>('rest/project/loadJobDetails?jobId='+jobId, httpOptions);
    }

    uploadImageFileBulk(file: any, orgId: any, shipId: any, projectId: any, jobId: any): Observable<any> {
        const HttpUploadOptions = {            
        } 
        var formData = new FormData(); 
        formData.append("file", file);
        formData.append('orgId', orgId);
        formData.append('shipId', shipId);
        formData.append('projectId', projectId);
        formData.append('jobId', jobId);
        return this.http.post<any>('rest/resource/uploadDocument', formData, HttpUploadOptions);
    }

    async downloadDocument  (path: any, orgId: any, shipId: any, projectId: any, jobId: any): Promise<Blob> {
        const file =  await this.http.get<Blob>('rest/resource/downloadDocument?orgId='+orgId+"&shipId="+shipId+'&projectId='+projectId+'&jobId='+jobId+'&path='+path,{responseType: 'blob' as 'json'}).toPromise();
        return file;
    }

    getOrganizationComponemtList (): Observable<any> {
        return this.http.post<any>('rest/project/loadOrganizationComponentList', httpOptions);
    }

    getUserDetail (user_id): Observable<any> {
        return this.http.post<any>('rest/core/loadUser?userId='+user_id, httpOptions);
    }

    attachVesselDocWithJob (attachmentList, jobId, projectId, attachmentType, progressReportId): Observable<any> {
        return this.http.post<any>('rest/project/attachVesselDocWithJob?jobId='+jobId+"&projectId="+projectId+"&attachmentType="+attachmentType+"&progressReportId="+progressReportId, attachmentList, httpOptions);
    }

    copyJob (projectId, jobId, JobType, shipid, orgId, attachmentTypes): Observable<any> {
        projectId = +projectId;
        shipid = +shipid;
        return this.http.post<any>('rest/project/copyJob?projectId='+projectId+'&jobId='+jobId+'&jobType='+JobType+"&shipId="+shipid+"&orgId="+orgId+"&attachmentTypes="+attachmentTypes, httpOptions);
    }
}