import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProjectCreationService {
    constructor(private http: HttpClient) {

    }
    
    updateProject (model: any): Observable<any> {
        return this.http.post<any>('rest/project/saveProject', model, httpOptions);
    }

    loadProjectDetails (projectId): Observable<any> {
        return this.http.post<any>('rest/project/loadProjectDetails?projectId='+projectId, httpOptions);
    }

    loadShipList  (): Observable<any> {
        return this.http.post<any>('rest/core/shipListForAssignment', httpOptions);
    }

    loadDockyardList (): Observable<any> {
        return this.http.post<any>('rest/core/loadDockyardList', httpOptions);
    }

    uploadProjectDocument(file: any, orgId: any, shipId: any, projectId: any): Observable<any> {
        const HttpUploadOptions = {            
        } 
        var formData = new FormData(); 
        formData.append("file", file);
        formData.append('orgId', orgId);
        formData.append('shipId', shipId);
        formData.append('projectId', projectId);
        return this.http.post<any>('rest/resource/uploadProjectDocument', formData, HttpUploadOptions);
    }

    async downloadDocument  (path: any, orgId: any, shipId: any, projectId: any): Promise<Blob> {
        const file =  await this.http.get<Blob>('rest/resource/downloadProjectDocument?orgId='+orgId+"&shipId="+shipId+'&projectId='+projectId+'&path='+path,{responseType: 'blob' as 'json'}).toPromise();
        return file;
    }

    attachVesselDocWithJob (attachmentList, projectId, attachmentType, progressReportId): Observable<any> {
        return this.http.post<any>('rest/project/attachVesselDocWithProject?projectId='+projectId+'&attachmentType='+attachmentType, attachmentList, httpOptions);
    }
}