import { Component, OnInit,ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import { AppConstant } from '../../../shared/constant/appConstant';
import { OrganizationJobListService } from './organization-job-list.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

import { Project } from '../../../model/project';


@Component({
  selector: 'organization-job-list',
  templateUrl: './organization-job-list.component.html',
  styleUrls: ['./organization-job-list.component.scss'],
  animations: [routerTransition()],
  providers: [OrganizationJobListService, CommonService]
})
export class OrganizationJobListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_JOB_LIBRARY_LIST;
  searchText: any = '';  
  jobList: any = [];
  vesselList: any = [];
  vesselType: any = '';
  constructor(private router: Router,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private translate:TranslateService,
    private commonService: CommonService,
	  private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private organizationJobListService: OrganizationJobListService) {

    } 

  gotoJobCreate(job){
    this.router.navigate(['/core/organization-job-creation/'+job.id]);	
  }

  
  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    loadDataList.push(this.organizationJobListService.loadJobList());
    loadDataList.push(this.commonService.getMasterVesselTypeList());
    forkJoin(loadDataList).subscribe(resList => {
      this.jobList = resList[0];
      this.vesselList = resList[1];
      this.jobList.forEach(job => {
        let component = this.utilityService.getComponentLinear().find(component => component.id === job.shipcomponentid);
        job.componentName = component !== undefined ? component.description : '';
      });
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

}
