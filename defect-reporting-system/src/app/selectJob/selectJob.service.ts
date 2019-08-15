import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { SelectJob } from './selectJob.component';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SelectJobService {

  constructor(private modalService: NgbModal, 
              private http: HttpClient) { }
 
  public confirm(
    title: string,
    inputModel: any,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<any> {
    const modalRef = this.modalService.open(SelectJob, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.inputModel = inputModel;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

  loadApplicationJobList (): Observable<any> {
      return this.http.post<any>('rest/project/loadOrganizationJobList', httpOptions);
  }

  loadMyJobList (shipId: any): Observable<any> {
      return this.http.post<any>('rest/project/loadMyJobList?shipId=0', httpOptions);
  }

}
