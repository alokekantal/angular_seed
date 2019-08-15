import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AppConstant } from '../../../shared/constant/appConstant';
import { NewPreviewJobService } from '../../../newPreviewJob/newPreviewJob.service';
import { CopyJobFromOldJobService } from './copy-job-from-old-job.service';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-copy-from-old-job',
  templateUrl: './copy-from-old-job.component.html',
  styleUrls: ['./copy-from-old-job.component.scss'],
  animations: [routerTransition()],
  providers: [CopyJobFromOldJobService, CommonService, UtilityService]
})
export class CopyFromOldJobComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_PREVIOUS_JOB_LIST;  
  applicationType: any = AppConstant.APPLICATION_TYPE;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  orgName: any = null;
  shipId: any;
  projectId: any;
  shipName: any;
  previousJobList: any = [];
  shipList: any = [];
  vesselTypeList: any = [];
  componentList: any =[];
  searchText:any = '';


  constructor(private router: Router,
              private confirmationDialogService: ConfirmationDialogService,
              private toastrService: ToastrService,
              private commonService: CommonService,
              private utilityService: UtilityService,
              private route: ActivatedRoute,
              private copyJobFromOldJobService: CopyJobFromOldJobService,
              private newPreviewJobService: NewPreviewJobService) {
                this.orgName = utilityService.getOrgInfo().orgName;
                this.componentList = utilityService.getComponentLinear();

                this.route.queryParams.subscribe(queryParams => {
                  debugger
                  this.shipId = queryParams.shipId;
                  this.projectId = queryParams.projectId;
                  this.shipName = queryParams.name;
                });
  }
  
  previewJob(job: any) {
    this.newPreviewJobService.confirm('Job Preview', { shipId: 0, jobSelectFrom: 'Job Preview', id: job.id }, 'Select', 'Cancel', 'lg')
    .then((res) => {
      console.log(res);
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));    
  }

  gotoJobList(){
    this.utilityService.setShipNameForJob(this.shipName);
    this.router.navigate(['/core/job-list/'+this.shipId]);	
  }

  copyJob(){
    this.confirmationDialogService.confirm('Please confirm..', 'Do you want copy the selected job... ?')
      .then((confirmed) => {
        if (confirmed) {
          this.utilityService.showLoader();
          let dataList = [];

          this.previousJobList.forEach(job => {
            if(job.isSelected){
              let attachmentTypes = ['SPEC'];
              dataList.push({
                orgId: this.orgId,
                projectId: +this.projectId,
                shipId: +this.shipId,          
                jobId: job.id,
                jobType: job.isOrgJob ? 'org' : 'previous',
                attachmentTypes: attachmentTypes
              });
            }
          });
          this.copyJobFromOldJobService.copyJob(dataList).subscribe(res =>{
            this.utilityService.hideLoader();
            this.toastrService.success('Job created successfully from previous job!');
            this.gotoJobList();
          }, err => {
            this.utilityService.hideLoader();
          });
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  ngOnInit() {
    this.utilityService.showLoader();
    const loadDataList = [];
    loadDataList.push(this.copyJobFromOldJobService.loadMyJobList(0));
    loadDataList.push(this.copyJobFromOldJobService.loadOrgJobList());
    loadDataList.push(this.copyJobFromOldJobService.loadShipList());
    loadDataList.push(this.commonService.getMasterVesselTypeList());
    forkJoin(loadDataList).subscribe(res => {
      let myPreviousJob = res[0];
      let orgJobList = res[1];
      this.shipList = res[2];
      this.vesselTypeList = res[3];
      myPreviousJob.forEach(job => {
        job['isSelected'] = false;
        job['isOrgJob'] = false;
      });

      orgJobList.forEach(job => {
        job['isSelected'] = false;
        job['isOrgJob'] = true;
      });
      this.previousJobList = myPreviousJob.concat(orgJobList);      
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

}
