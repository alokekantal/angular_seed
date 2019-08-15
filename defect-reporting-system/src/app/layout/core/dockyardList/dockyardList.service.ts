import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DockyardListService {
    constructor(private http: HttpClient) {

    }

    loadDockyardList  (): Observable<any> {
        return this.http.post<any>('rest/core/loadDockyardList', httpOptions);
    }

    uploadFile(fileToUpload: any): Observable<any> {
        const HttpUploadOptions = {}
        var formData = new FormData();
        formData.append('file', fileToUpload);
        return this.http.post<any>('rest/core/uploadDepartmentExcel', formData, HttpUploadOptions);
    }

    async downloadUserTemplate  (): Promise<Blob> {
        const file =  await this.http.get<Blob>('rest/resource/loadDepartmentExcel',{responseType: 'blob' as 'json'}).toPromise();
        return file;
    } 
}