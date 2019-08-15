import { Component, OnInit,ElementRef, OnDestroy } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import { AppConstant } from '../../../shared/constant/appConstant';
import { JobListService } from './job-list.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { NewPreviewJobService } from '../../../newPreviewJob/newPreviewJob.service';

import { Project } from '../../../model/project';


@Component({
  selector: 'app-ship-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  animations: [routerTransition()],
  providers: [JobListService, CommonService]
})
export class JobListComponent implements OnInit, OnDestroy {
  navigationSubscription;
  BREADCRUMB: any = AppConstant.BREADCRUMB_JOB_LIST;
  id: any;
  shipname: any;
  searchText: any = '';  
  jobList: any = [];
  project: Project = new Project();
  applicationType: any = AppConstant.APPLICATION_TYPE;
  jobCloserRemark: string = "";
  selectedJob = null;
  selectedJobIndex = null;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private translate:TranslateService,
    private commonService: CommonService,
	  private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private newPreviewJobService: NewPreviewJobService,
    private jobListService: JobListService) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });      
    } 

  gotoJobCreate(job){
    this.router.navigate(['/core/job-creation/'+job.id], {queryParams: {shipId: this.id, projectId: this.project.id}});	
  }

  markJobComplete(content){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.utilityService.showLoader();
      this.jobListService.markJobComplete(this.selectedJob.id, this.jobCloserRemark).subscribe(res => {
        this.jobList[this.selectedJobIndex].status = 'COM';
        this.selectedJob = null;
        this.selectedJobIndex = null;
        this.jobCloserRemark = '';
        this.utilityService.hideLoader();
        this.toastrService.success('Data save successfully!'); 
      }, err => {
        this.utilityService.hideLoader();
      });
    }, (reason) => {
      this.jobCloserRemark = '';
      //do nothing
    });
  }

  async generatejobReport(jobId){
    // tslint:disable-next-line:max-line-length
    this.utilityService.showLoader();
    this.jobListService.generatejobReport(jobId).subscribe(res => {
      this.utilityService.hideLoader();
    }, () => {
      this.utilityService.hideLoader();
    });
  }


  previewJob(job: any) {
    this.newPreviewJobService.confirm('Job Preview', { shipId: this.id, jobSelectFrom: 'Job Preview', id: job.id }, 'Select', 'Cancel', 'lg')
    .then((res) => {
      console.log(res);
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));    
  }



  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.utilityService.showLoader();

    //ship id
    let shipId = (this.utilityService.getLoginInfo())[2];
    if(shipId !== undefined && shipId !== '0'){
      this.id = shipId; 
    }else{
      this.id = +this.route.snapshot.paramMap.get('id'); 
    }      
      
    this.shipname = this.utilityService.getShipNameForJob();
    let index = AppConstant.BREADCRUMB_JOB_CREATION[1].path.lastIndexOf('/');
    AppConstant.BREADCRUMB_JOB_CREATION[1].path = AppConstant.BREADCRUMB_JOB_CREATION[1].path.substring(0, index+1)+this.id;


    let loadDataList = [];
    loadDataList.push(this.jobListService.loadJobList(this.id));
    loadDataList.push(this.jobListService.loadProject(this.id));
    forkJoin(loadDataList).subscribe(resList => {
      this.jobList = resList[0];
      this.project = resList[1][0];
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

}
