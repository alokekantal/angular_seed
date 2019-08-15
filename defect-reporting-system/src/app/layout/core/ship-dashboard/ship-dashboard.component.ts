import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ShipDashboardService } from './ship-dashboard.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { CommonService } from '../../../shared/services/common.service';
import { Ship } from '../../../model/ship';
import { Job } from '../../../model/job';
import { Project } from '../../../model/project';
import { forkJoin } from 'rxjs';

import { JobListModalService } from '../../../joblistModal/joblistModal.service';
import { NewPreviewJobService } from '../../../newPreviewJob/newPreviewJob.service';

import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-designation-list',
  templateUrl: './ship-dashboard.component.html',
  styleUrls: ['./ship-dashboard.component.scss'],
  animations: [routerTransition()],
  providers: [ShipDashboardService, UtilityService, CommonService]
})
export class ShipDashboardComponent implements OnInit, OnDestroy {
  navigationSubscription;
  limit: number = 5;
  BREADCRUMB: any = AppConstant.BREADCRUMB_SHIP_DASHBOARD;
  shipId: number = null;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  projectList: any = [];
  shipDetail: Ship = new Ship();
  jobList: any = [];
  activeProjectDetail: Project = new Project();
  vesselTypeList: any = [];
  dockyardList: any = [];
  imagePath: any = {
    'excel': 'assets/images/excel-icon.ico',
    'pdf': 'assets/images/pdf.jpg'
  }
  constructor(private translate: TranslateService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private newPreviewJobService: NewPreviewJobService,
              private jobListModalService: JobListModalService,
              private utilityService: UtilityService,
              private commonService: CommonService,
              private shipDashboardService: ShipDashboardService) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });

  }

  showJobList() {
    this.jobListModalService.confirm('Job List', { shipId: this.shipId, jobSelectFrom: 'previous' }, 'Select', 'Cancel', 'lg')
      .then((result) => {
        console.log(result);
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  jobClick(job) {
    if (job.status === 'A') {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['/core/job-creation/' + job.id], {queryParams: {name: this.shipDetail.name, shipId: job.shipid, projectId: job.projectid}});
    } else {
      const title = 'Job Detail';
      // tslint:disable-next-line:max-line-length
      this.newPreviewJobService.confirm(title, { shipId: job.shipid, jobSelectFrom: 'previous', id: job.id }, 'Select', 'Cancel', 'lg')
        .then((res) => {
          console.log(res);
        })
        // tslint:disable-next-line:max-line-length
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }

  gotoJobCreate() {
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/core/job-creation/' + 0], {queryParams: {name: this.shipDetail.name, shipId: this.activeProjectDetail.shipid, projectId: this.activeProjectDetail.id}});
  }

  gotoJobList() {
    const shipName =  this.shipDetail.name;
    this.router.navigate(['/core/job-list/' + this.activeProjectDetail.shipid], {queryParams: {name: shipName}});
  }

  manageComponent() {
    this.router.navigate(['/core/manage-ship-componemts/' + this.activeProjectDetail.shipid]);
  }

  async getImages() {
    for (let i = 0; i < this.shipDetail.shipAttachmentList.length; i++) {
      // tslint:disable-next-line:max-line-length
      const imageData = await this.shipDashboardService.downloadDocument(this.shipDetail.shipAttachmentList[i].relativepath, this.orgId, this.shipDetail.ship_id);
      const blob = new Blob([imageData], {
        type: 'image/jpg'
      });
      const urlCreator = window.URL;
      this.shipDetail.shipAttachmentList[i]['src'] = this.sanitizer.bypassSecurityTrustUrl(
        urlCreator.createObjectURL(blob));
    }
  }

  async downloadShipFile(attachment) {
    this.utilityService.showLoader();
    // tslint:disable-next-line:max-line-length
    const imageData = await this.shipDashboardService.downloadDocument(attachment.relativepath, this.orgId, this.shipDetail.ship_id);
    // tslint:disable-next-line:prefer-const
    let url = window.URL.createObjectURL(imageData);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = attachment.relativepath.split('/')[1];
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
    this.utilityService.hideLoader();
    
  }

  ngOnInit() {
    this.utilityService.showLoader();
    this.limit = 5;
    this.shipId = JSON.parse(localStorage.getItem('loginInfo'))[2];
    const promiseList = [];
    promiseList.push(this.shipDashboardService.loadProjectList(this.shipId));
    promiseList.push(this.shipDashboardService.getShipDetail(this.shipId));
    promiseList.push(this.shipDashboardService.loadJobList(this.shipId));
    promiseList.push(this.commonService.getMasterVesselTypeList());
    promiseList.push(this.shipDashboardService.loadActiveProjectDetail(this.shipId));
    promiseList.push(this.commonService.loadDockyardList());

    forkJoin(promiseList).subscribe(res => {
      this.projectList = res[0];
      this.shipDetail = res[1];
      this.jobList = res[2];
      this.vesselTypeList = res[3];
      this.activeProjectDetail = res[4];
      this.dockyardList = res[5];
      if(this.jobList.length < 5){
        this.limit = this.jobList.length;
      }
      if (this.shipDetail.shipAttachmentList == null) {
        this.shipDetail.shipAttachmentList = [];
      } else {
        this.shipDetail.shipAttachmentList.forEach(attachment => {
          let ext = attachment.attachmentName.substring(attachment.attachmentName.lastIndexOf('.') + 1).toLowerCase();
          if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
            attachment['ext'] = 'image';
          }else if(ext == 'xls' || ext == 'xlsx') {
            attachment['ext'] = 'excel';
          }else if(ext == 'pdf') {
            attachment['ext'] = 'pdf';
          }
        });
        this.getImages();
      }
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

  loadMoreJob(){
    if((this.limit + 5) > this.jobList.length) {
      this.limit = this.jobList.length;
    }else{
      this.limit += 5;
    }
  }

  loadAllJob(){
      this.limit = this.jobList.length;
  }



  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  download(){
    var data = document.getElementById('aaa'); 
    html2canvas(data).then(canvas => { 
      // Few necessary setting options 
      var imgWidth = 208; 
      var pageHeight = 295; 
      var imgHeight = canvas.height * imgWidth / canvas.width; 
      var heightLeft = imgHeight; 
      
      const contentDataURL = canvas.toDataURL('image/png') 
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF 
      var position = 0; 
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight) 
      //pdf.save('MYPdf.pdf'); // Generated PDF 
      var aa = pdf.output();
      this.shipDashboardService.uploadFile(aa).subscribe( res => {
        console.log("dhsgf");
      });
    }); 
  }
}
