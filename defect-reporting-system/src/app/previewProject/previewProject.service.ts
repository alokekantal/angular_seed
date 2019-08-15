import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PreviewProject } from './previewProject.component';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PreviewProjectService {

  constructor(private modalService: NgbModal,
              private http: HttpClient) { }

  public confirm(
    title: string,
    inputModel: any,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(PreviewProject, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.inputModel = inputModel;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

  loadApplicationJobList (): Observable<any> {
      return this.http.post<any>('rest/project/loadApplicationJobList', httpOptions);
  }

  loadMyJobList (shipId: any): Observable<any> {
      return this.http.post<any>('rest/project/loadMyJobList?shipId=' + shipId, httpOptions);
  }

}
