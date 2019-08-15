import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
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
import { NewPreviewJobService } from '../newPreviewJob/newPreviewJob.service';

import { SelectJobService } from './selectJob.service';

import { CommonService } from '../shared/services/common.service';
import { UtilityService } from '../shared/services/utility.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-component',
  templateUrl: './selectJob.component.html',
  styleUrls: ['./selectJob.component.css'],
  providers: [CommonService, UtilityService, SelectJobService]
})
// tslint:disable-next-line:component-class-suffix
export class SelectJob implements OnInit {
  @Input() title: string;
  @Input() inputModel: any;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  jobLibraryList: any = [];
  searchText: any = '';
  vesselList: any = [];
  vesselType: any = '';

  constructor(private activeModal: NgbActiveModal,
              private selectJobService: SelectJobService,
              private confirmationDialogService: ConfirmationDialogService,
              private previewJobService: PreviewJobService,
              private newPreviewJobService: NewPreviewJobService,
              private modalService: NgbModal,
              private toastrService: ToastrService,
              private commonService: CommonService,
              private utilityService: UtilityService) { }

  previewJob(job: any) {
    const title = this.inputModel.jobSelectFrom === 'library' ? 'Job Library' : 'Previous Job List';
    // tslint:disable-next-line:max-line-length
    if(this.inputModel.jobSelectFrom === 'library'){
      this.previewJobService.confirm(title, { shipId: this.inputModel.shipid, jobSelectFrom: this.inputModel.jobSelectFrom, id: job.id }, 'Select', 'Cancel', 'lg')
      .then((res) => {
        console.log(res);
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }else{
      this.newPreviewJobService.confirm(title, { shipId: this.inputModel.shipid, jobSelectFrom: this.inputModel.jobSelectFrom, id: job.id }, 'Select', 'Cancel', 'lg')
      .then((res) => {
        console.log(res);
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
    
  }

  ngOnInit() {
    this.utilityService.showLoader();
    const loadDataList = [];
    if (this.inputModel.jobSelectFrom === 'library') {
      loadDataList.push(this.selectJobService.loadApplicationJobList());
    } else {
      loadDataList.push(this.selectJobService.loadMyJobList(this.inputModel.shipId));
    }
    loadDataList.push(this.commonService.getMasterVesselTypeList());

    forkJoin(loadDataList).subscribe(res => {
      this.jobLibraryList = res[0];
      this.vesselList = res[1];
      this.jobLibraryList.forEach(job => {
        let component = this.utilityService.getComponentLinear().find(component => component.id === job.shipcomponentid);
        job.componentName = component !== undefined ? component.description : '';
      });
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });

  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept(job) {
    this.activeModal.close(job);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}