import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { SelectAttachmentFromVessel } from './selectAttachmentFromVessel.component';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SelectAttachmentFromVesselService {

  constructor(private modalService: NgbModal, 
              private http: HttpClient) { }
 
  public confirm(
    title: string,
    inputModel: any,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<any> {
    const modalRef = this.modalService.open(SelectAttachmentFromVessel, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.inputModel = inputModel;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

  

}
