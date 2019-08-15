import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AlertDialogComponent } from './alert-dialog.component';

@Injectable()
export class AlertDialogService {

  constructor(private modalService: NgbModal) { }

  public alert(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(AlertDialogComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;

    return modalRef.result;
  }

}
