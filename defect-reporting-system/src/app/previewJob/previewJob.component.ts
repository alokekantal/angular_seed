import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../router.animations';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Job } from '../model/job';
import { OrganizationComponent } from '../model/OrganizationComponent';

import { AppConstant } from '../shared/constant/appConstant';
import { CustomValidator } from '../shared/validation/customValidator';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

import { CommonService } from '../shared/services/common.service';
import { UtilityService } from '../shared/services/utility.service';

import * as _ from 'lodash';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'previewJob-component',
  templateUrl: './previewJob.component.html',
  styleUrls: ['./previewJob.component.css'],
  providers: [CommonService, UtilityService],
  encapsulation: ViewEncapsulation.None
})
// tslint:disable-next-line:component-class-suffix
export class PreviewJob implements OnInit {
  @Input() title: string;
  @Input() inputModel: any;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  jobDetail: Job = new Job();
  checkboxList: any = {};
  componentList: any = [];
  vesselList: any = [];
  checkbocCollapse = {
    isCollapsedToBeInclude: true,
    isCollapsedMeterials: true,
    isCollapsedTheWorkToBeSurvedAlsoBy: true
  };
  selectedComponent: OrganizationComponent = new OrganizationComponent();

  constructor(private activeModal: NgbActiveModal,
              private confirmationDialogService: ConfirmationDialogService,
              private modalService: NgbModal,
              private toastrService: ToastrService,
              private commonService: CommonService,
              private utilityService: UtilityService) { }

  ngOnInit() {
    this.utilityService.showLoader();
    const loadDataList = [];
    if (this.inputModel.jobSelectFrom === 'library') {
      loadDataList.push(this.commonService.loadOrganizationJobDetail(this.inputModel.id));
    } else {
      loadDataList.push(this.commonService.loadMyJobList(this.inputModel.id));
    }
    loadDataList.push(this.commonService.getOrganizationComponemtList());
    loadDataList.push(this.commonService.loadCheckboxesList());
    loadDataList.push(this.commonService.getMasterVesselTypeList());

    forkJoin(loadDataList).subscribe(res => {
      this.jobDetail = res[0];
      this.componentList = res[1];
      this.checkboxList = res[2];
      this.vesselList = res[3];
      this.checkboxList = _.mapValues(_.groupBy(this.checkboxList, 'key'), clist => clist.map(group => _.omit(group, 'key')));

      if (this.jobDetail.jobdate) {
        const date = new Date(this.jobDetail.jobdate);
        this.jobDetail.jobdate = {
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear()
        };
      }
      // tslint:disable-next-line:forin
      for (const key in this.checkboxList) {
        this.checkboxList[key].forEach(element => {
          if (this.jobDetail.checkboxes !== null) {
            const index = this.jobDetail.checkboxes.split(',').indexOf('' + element.id);
            if (index !== -1) {
              element.isSelected = true;
            }
          }
        });
      }

      // tslint:disable-next-line:no-shadowed-variable
      const component = this.componentList.find(component => component.id === this.jobDetail.shipcomponentid);
      this.selectedComponent =  component === undefined ? new OrganizationComponent : component;
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
    this.activeModal.close();
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
