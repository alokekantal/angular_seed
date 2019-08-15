import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SelectComponentForApplicationJob } from './selectComponentForApplicationJob.component';

@Injectable()
export class SelectComponentForApplicationJobService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    inputModel: any,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(SelectComponentForApplicationJob, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.inputModel = inputModel;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
