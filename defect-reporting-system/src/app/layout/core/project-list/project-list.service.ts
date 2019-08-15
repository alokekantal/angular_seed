import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProjectListService {
    constructor(private http: HttpClient) {}

    loadProjectList  (shipId): Observable<any> {
        return this.http.post<any>('rest/project/loadProjectList?shipId='+shipId, httpOptions);
    }

    loadShipList  (): Observable<any> {
        return this.http.post<any>('rest/core/shipListForAssignment', httpOptions);
    }

    markProjectComplete  (projectId): Observable<any> {
        return this.http.post<any>('rest/project/markProjectComplete?projectId='+projectId, httpOptions);
    }

    loadProjectDetailForReportWithImageData  (projectId): Observable<any> {
        return this.http.get<any>('rest/project/loadProjectDetailForReportWithImageData?projectId='+projectId, httpOptions);
    }

    downloadAllReport (model: any): Observable<any> {
        return this.http.post<any>('rest/core/downloadAllReport ', model, httpOptions);
    }

    loadJobDetails (jobId: any): Observable<any> {
        return this.http.post<any>('rest/project/loadJobDetails?jobId='+jobId, httpOptions);
    }

    async downloadDocument  (path: any, orgId: any, shipId: any, projectId: any, jobId: any): Promise<Blob> {
        const file =  await this.http.get<Blob>('rest/resource/downloadDocument?orgId='+orgId+"&shipId="+shipId+'&projectId='+projectId+'&jobId='+jobId+'&path='+path,{responseType: 'blob' as 'json'}).toPromise();
        return file;
    }

    uploadAllReport(model: any): Observable<any> {
        const HttpUploadOptions = {}
        //var allJobIDs='';
		model.forEach(tempJob => {
        var formData = new FormData();
		//  allJobIDs=allJobIDs+tempJob.key+',';
        formData.append('jobId', tempJob.key);
        formData.append('identifier', tempJob.key);
		  formData.append('file', tempJob.value);
		  this.http.post<any>('rest/project/uploadSingleReport', formData, HttpUploadOptions);
        });
        return ;
    }
	
	uploadSingleReport(fileToUpload: any): Observable<any> {
        const HttpUploadOptions = {}
        var formData = new FormData();
        formData.append('jobId', fileToUpload.key);
        formData.append('identifier', fileToUpload.key);
		formData.append('file', fileToUpload.value);
        return this.http.post<any>('rest/project/uploadSingleReport', formData, HttpUploadOptions);
    }
	
	uploadFile(fileToUpload: any): Observable<any> {
        const HttpUploadOptions = {}
        var formData = new FormData();
        formData.append('file', fileToUpload);
        return this.http.post<any>('rest/core/downloadReport', formData, HttpUploadOptions);
    }

    async generateProjectReportIText  (projectId: any): Promise<Blob> {
        const file =  await this.http.get<Blob>('rest/project/generateProjectReportIText?projectId='+projectId,{responseType: 'blob' as 'json'}).toPromise();
        return file;
    }
}