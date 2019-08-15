import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../router.animations';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { OrganizationComponent } from '../model/organizationComponent';

import { AppConstant } from '../shared/constant/appConstant';
import { CustomValidator } from '../shared/validation/customValidator';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { PreviewJobService } from '../previewJob/previewJob.service';

import { JobListModalService } from './joblistModal.service';

import { CommonService } from '../shared/services/common.service';
import { UtilityService } from '../shared/services/utility.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'joblist-modal',
  templateUrl: './joblistModal.component.html',
  styleUrls: ['./joblistModal.component.css'],
  providers: [CommonService, UtilityService, JobListModalService]
})
// tslint:disable-next-line:component-class-suffix
export class JoblistModal implements OnInit {
  @Input() title: string;
  @Input() inputModel: any;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  jobLibraryList: any = [];

  constructor(private activeModal: NgbActiveModal,
              private jobListModalService: JobListModalService,
              private confirmationDialogService: ConfirmationDialogService,
              private previewJobService: PreviewJobService,
              private modalService: NgbModal,
              private toastrService: ToastrService,
              private commonService: CommonService,
              private utilityService: UtilityService) { }

  previewJob(job: any) {
    const title = 'Job Detail';
    // tslint:disable-next-line:max-line-length
    this.previewJobService.confirm(title, { shipId: this.inputModel.shipid, jobSelectFrom: this.inputModel.jobSelectFrom, id: job.id }, 'Select', 'Cancel', 'lg')
      .then((res) => {
        //console.log(res);
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  ngOnInit() {
    this.utilityService.showLoader();
    const loadDataList = [];
    loadDataList.push(this.jobListModalService.loadMyJobList(this.inputModel.shipId));
    forkJoin(loadDataList).subscribe(res => {
      this.jobLibraryList = res[0];
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });

  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
