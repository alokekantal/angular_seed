import { Component, OnInit,ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { routerTransition } from '../../../router.animations';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ReportService } from './report.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { Project } from '../../../model/project';
import { ProjectAttachment } from '../../../model/projectAttachment';
import { Report } from '../../../model/Report';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [routerTransition()],
  providers: [ReportService, CommonService]
})
export class ReportComponent implements OnInit {
  navigationSubscription;
  BREADCRUMB: any = AppConstant.BREADCRUMB_PROJECT_LIST;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  searchText: any = '';  
  id: any;
  applicationType: any = AppConstant.APPLICATION_TYPE;
  projectList: any =[];
  shipList: any = [];
  selectedProject: Project;
  attachmentModel: any = new ProjectAttachment();
  reportFields: any = new Report();;
  reportHeader: any = {
    jobGeneralInfo: true,
    jobSpecificationDetail: true,
    jobSpecificationAttachment: true,
    meterialDetail: true,
    progressReport: true,
    progressReportAttachments: true,
    execPhotosReps: true,
    jobComment: true
  };
  constructor(private router: Router,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private translate:TranslateService,
    private commonService: CommonService,
	  private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private reportService: ReportService) { 
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });
    } 

    openReportModal(content, project){
      //this.reportFields = new Report();
      //console.log(this.reportFields);
      this.selectedProject = project;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
        this.generateProjectReportIText(this.selectedProject.id);          
      }, (reason) => {
        this.selectedProject = null;
        //do nothing
      });      
    }

    async generateProjectReportIText(projectId){
      this.utilityService.showLoaderMsg();
      if(this.selectedProject.projectAttachmentList != null){
        this.selectedProject.projectAttachmentList.forEach(element => {
          if (element.isSelect) {
            this.reportFields.projectAttachmentList.push(element.id);
          }
        });
      }

      let pipe = new DatePipe('en-US');
      const now = Date.now();
      const myFormattedDate = pipe.transform(now, 'medium');
      //tslint:disable-next-line:max-line-length
      const reportzip = await this.reportService.generateProjectReportIText(projectId, this.reportFields);
      const blob = new Blob([reportzip], {
        type: 'application/zip'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "project_report_"+ new Date().getTime()+".zip";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove(); // remove the element
      this.utilityService.hideLoaderMsg();
    }


    projectAttachmentsVisibility(isCheck){
      this.reportFields.projectAttachmentList = []; 
      this.selectedProject.projectAttachmentList.forEach(attachment => {attachment.isSelect = isCheck});
      
    }

    //Report Job Header Visibility
    ReportJobHeaderVisibility(isChecked, tabName){
      this.reportFields.jobList.forEach((job) => {
        if(job.specificationOfRepairs){
          job[tabName] = isChecked;
        }
      });
    }

    //vessel detail visibility
    vesselVisibility(isChecked){
        this.reportFields.v_imo_no = isChecked;
        this.reportFields.vesselname = isChecked;
        this.reportFields.description = isChecked;
        this.reportFields.mmsi_no = isChecked;
        this.reportFields.call_sign = isChecked;
        this.reportFields.official_no = isChecked;
        this.reportFields.v_type = isChecked;
        this.reportFields.owner_imo_no = isChecked;
        this.reportFields.owner_name = isChecked;
        this.reportFields.sat_f_77 = isChecked;
        this.reportFields.sat_c = isChecked;
        this.reportFields.fleet_broadband = isChecked;
        this.reportFields.sat_c_emailID = isChecked;
        this.reportFields.emailID = isChecked;
        this.reportFields.shipClass = isChecked;
        this.reportFields.class_notations = isChecked;
        this.reportFields.Classi_Id_No = isChecked;
        this.reportFields.flag = isChecked;
        this.reportFields.port_of_registry = isChecked;
        this.reportFields.year_built = isChecked;
        this.reportFields.keel_laying_date = isChecked;
        this.reportFields.vessel_delivery_date = isChecked;
        this.reportFields.hull_type = isChecked;
        this.reportFields.length_overall = isChecked;
        this.reportFields.breadth_MLD = isChecked;
        this.reportFields.depth = isChecked;
        this.reportFields.summer_draft_M = isChecked;
        this.reportFields.summer_DWT_MT = isChecked;
        this.reportFields.international_GRT = isChecked;
        this.reportFields.international_NRT = isChecked;
        this.reportFields.life_boat_cap = isChecked;
        this.reportFields.v_short_name = isChecked;
        this.reportFields.account_code_old = isChecked;
        this.reportFields.account_code_new = isChecked;
        this.reportFields.tel_fac_code = isChecked;
        this.reportFields.maxEmailSizeInMB = isChecked;
        this.reportFields.dailyDataLimitInMB = isChecked;
        this.reportFields.email1 = isChecked;
        this.reportFields.email2 = isChecked;
        this.reportFields.phoneNo = isChecked;
        this.reportFields.phoneNo1 = isChecked;
        this.reportFields.phoneNo2 = isChecked;
    }

    //select Deselect All Job 
    selectDeselectAllJob(isAllJobSelected){
      this.reportFields.jobList.forEach((job, index) => {
        job.specificationOfRepairs = isAllJobSelected;
        this.specificationOfRepairsVisibility(job.specificationOfRepairs, index);
      });
    }

    //project detail visibility
    projectDetailVisibility(isChecked){ 
      this.reportFields.isCollapsed = true;
      this.reportFields.preamble = isChecked;
      this.reportFields.ddParameter = isChecked;
      this.reportFields.projectAttachments = isChecked;
      this.projectAttachmentsVisibility(this.reportFields.projectAttachments);
    }

    //job detail visibility
    specificationOfRepairsVisibility(isChecked, jobindex){
      this.reportFields.isAllJobSelected = this.reportFields.jobList.every((job) => {
        return job.specificationOfRepairs;
      });
      this.reportFields.isCollapsed = true;
      if(this.reportHeader.jobGeneralInfo){
        this.reportFields.jobList[jobindex].jobGeneralInfo = isChecked;
        this.generalInfoVisibility(this.reportFields.jobList[jobindex].jobGeneralInfo, jobindex);
      }
      
      
      if(this.reportHeader.meterialDetail){
        this.reportFields.jobList[jobindex].meterialDetail = isChecked;
        this.meterialDetailVisibility(this.reportFields.jobList[jobindex].meterialDetail, jobindex);
      }
      
      
      if(this.reportHeader.progressReport){
        this.reportFields.jobList[jobindex].progressReport = isChecked;
        this.progressReportVisibility(this.reportFields.jobList[jobindex].progressReport, jobindex);
      }
      
      if(this.reportHeader.progressReportAttachments){
        this.reportFields.jobList[jobindex].progressReportAttachments = isChecked;
      }
      
      
      if(this.reportHeader.execPhotosReps){
        this.reportFields.jobList[jobindex].execPhotosReps = isChecked;
      }
      
      if(this.reportHeader.jobComment){
        this.reportFields.jobList[jobindex].jobComment = isChecked;
      }
    }

    //meterial detail on off section
    generalInfoVisibility(isChecked, jobindex){
      this.reportFields.jobList[jobindex].jobno = isChecked;
      this.reportFields.jobList[jobindex].make = isChecked;
      this.reportFields.jobList[jobindex].component = isChecked;
      this.reportFields.jobList[jobindex].model = isChecked;
      this.reportFields.jobList[jobindex].location = isChecked;
      this.reportFields.jobList[jobindex].equipment = isChecked;
      this.reportFields.jobList[jobindex].jobDescription = isChecked;
      this.reportFields.jobList[jobindex].makeModelDescription = isChecked;
      this.reportFields.jobList[jobindex].externalReference = isChecked;
      this.reportFields.jobList[jobindex].jobDate = isChecked;
      if(this.reportHeader.jobSpecificationDetail){
        this.reportFields.jobList[jobindex].jobSpecificationDetail = isChecked;
      }

      if(this.reportHeader.jobSpecificationAttachment){
        this.reportFields.jobList[jobindex].jobSpecificationAttachment = isChecked;
      }      
      
      this.reportFields.jobList[jobindex].checkBox = isChecked;
      this.checkBoxVisibility(this.reportFields.jobList[jobindex].checkBox, jobindex);
    }

    //meterial detail on off section
    meterialDetailVisibility(isChecked, jobindex){
      this.reportFields.jobList[jobindex].meterialDetailMake = isChecked;
      this.reportFields.jobList[jobindex].meterialDetailModel = isChecked;
      this.reportFields.jobList[jobindex].meterialDetailPartNo = isChecked;
      this.reportFields.jobList[jobindex].meterialDetailPartName = isChecked;
      this.reportFields.jobList[jobindex].meterialDetailQuantity = isChecked;
      this.reportFields.jobList[jobindex].meterialDetailUOM = isChecked;
      this.reportFields.jobList[jobindex].meterialDetailDrawingNo = isChecked;
      this.reportFields.jobList[jobindex].meterialDetailRemark = isChecked;
    }

    //check box on off secton
    checkBoxVisibility(isChecked, jobindex){
      this.reportFields.jobList[jobindex].toBeInclude = isChecked;
      this.reportFields.jobList[jobindex].materials = isChecked;
      this.reportFields.jobList[jobindex].theWorkToBeSurveyedAlsoBy = isChecked;
    }

    //progress report on off section
    progressReportVisibility(isChecked, jobindex){
      this.reportFields.jobList[jobindex].progressReportReportingDate = isChecked;
      this.reportFields.jobList[jobindex].progressReportExecutionDate = isChecked;
      this.reportFields.jobList[jobindex].progressReportWorkDoneForTheDay = isChecked;
      this.reportFields.jobList[jobindex].progressReportWorkDoneForTheDay = isChecked;
    }

  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    //ship id
    let shipId = (this.utilityService.getLoginInfo())[2];    
    loadDataList.push(this.reportService.loadProjectList(shipId));
    loadDataList.push(this.reportService.loadShipList());
    loadDataList.push(this.reportService.loadJobList(shipId));

    forkJoin(loadDataList).subscribe(resList => {
      this.projectList = resList[0];
      this.shipList = resList[1];
      this.reportFields = new Report();
      this.projectList.forEach(project => {
        if(project.projectAttachmentList != null){
          project.projectAttachmentList.forEach(attachment => {
            attachment['isSelect'] = true;
          });
        }        
      });
      resList[2].forEach(job => {
        let jobField = new Report();
        jobField.selectedJobNo = job.jobno;
        jobField.shortDescription = job.description;
        this.reportFields.jobList.push(jobField);
      });
      this.projectList.forEach(project => {
        let ship = this.shipList.find(ship => project.shipid === ship.ship_id);
        if(ship !== undefined){
          project.shipName = ship.name;
        }
      });
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

}
