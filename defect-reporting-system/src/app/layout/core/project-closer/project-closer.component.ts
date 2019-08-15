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
import { ProjectCloserService } from './project-closer.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { Project } from '../../../model/project';
import { ProjectAttachment } from '../../../model/projectAttachment';
import { Report } from '../../../model/Report';

@Component({
  selector: 'app-project-closer',
  templateUrl: './project-closer.component.html',
  styleUrls: ['./project-closer.component.scss'],
  animations: [routerTransition()],
  providers: [ProjectCloserService, CommonService]
})
export class ProjectCloserComponent implements OnInit {
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
    private projectCloserService: ProjectCloserService) { 
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });
    } 

    handleFileInput(files: FileList, attachmentFrom: string) {
      this.attachmentModel.shipid = this.selectedProject.shipid;
      this.attachmentModel.projectid = this.selectedProject.id;
      this.attachmentModel.orgid = this.orgId; 
      for (let i = 0; i < files.length; i++) {
        this.attachmentModel.attachmentName = files[i].name;   
        if (attachmentFrom === 'closer') {
          this.attachmentModel.attachmentType = 'closer';
        }
        if(attachmentFrom === 'closer'){
          this.selectedProject.projectAttachmentList = [];
          this.selectedProject.projectAttachmentList.push(Object.assign({}, this.attachmentModel));        
        }      
      }
      if (files.length > 0) {
        if(attachmentFrom === 'closer'){
          this.uploadImageFile(files);
        }
      }
    }
  
    uploadImageFile(files: any) {
      this.utilityService.showLoader();
      const attachmentUrlList = [];
      for (let i = 0; i < files.length; i++) {
        // tslint:disable-next-line:max-line-length
        attachmentUrlList.push(this.projectCloserService.uploadProjectDocument(files[i], this.orgId, this.selectedProject.shipid, this.selectedProject.id));
      }
  
      forkJoin(attachmentUrlList).subscribe(res => {
        this.utilityService.hideLoader();
        this.selectedProject.projectAttachmentList[0].relativepath = res[0][0];
      }, err => {
        this.utilityService.hideLoader();
      });
    }


    markProjectComplete(content, project, index){
      this.selectedProject = project;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
              this.utilityService.showLoader();
              this.projectCloserService.markProjectComplete(this.selectedProject.id, this.selectedProject.projectAttachmentList[0].relativepath, this.selectedProject.projectAttachmentList[0].attachmentName, this.selectedProject.closerComment).subscribe(res => {
                this.projectList[index].status = 'COM';
                this.selectedProject = null;
                this.utilityService.hideLoader();
                this.toastrService.success('Data save successfully!');
              }, err => {
                this.utilityService.hideLoader();
              });
      }, (reason) => {
        this.selectedProject = null;
        //do nothing
      });      
    }

  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    //ship id
    let shipId = (this.utilityService.getLoginInfo())[2];    
    loadDataList.push(this.projectCloserService.loadProjectList(shipId));
    loadDataList.push(this.projectCloserService.loadShipList());

    forkJoin(loadDataList).subscribe(resList => {
      this.projectList = resList[0];
      this.shipList = resList[1];
      this.projectList.forEach(project => {
        if(project.projectAttachmentList != null){
          project.projectAttachmentList.forEach(attachment => {
            attachment['isSelect'] = true;
          });
        }        
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
