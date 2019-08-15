import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProjectCloserService {
    constructor(private http: HttpClient) {}

    loadProjectList  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadProjectListForCloser?shipId='+shipId, httpOptions);
    }

    loadShipList  (): Observable<any> {
        return this.http.post<any>('rest/core/shipListForAssignment', httpOptions);
    }

    markProjectComplete  (projectId, closerAttachmentRelativePath, closerAttachmentName, closerComment): Observable<any> {
        return this.http.post<any>('rest/project/markProjectComplete?projectId='+projectId+"&closerAttachmentRelativePath="+closerAttachmentRelativePath+"&closerAttachmentName="+closerAttachmentName+"&closerComment="+closerComment, httpOptions);
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
}