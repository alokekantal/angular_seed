import { Component, OnInit,ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ProjectListService } from './project-list.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

import { PreviewProjectService } from '../../../previewProject/previewProject.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as _ from 'lodash';

@Component({
  selector: 'app-ship-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [routerTransition()],
  providers: [ProjectListService, CommonService],
  encapsulation: ViewEncapsulation.None
})
export class ProjectListComponent implements OnInit {
  @ViewChild('content') content : ElementRef;
  dateTimeFormat: any = 'yyyy-MM-dd HH:mm';
  dateFormat: any = 'yyyy-MM-dd';
  navigationSubscription;
  BREADCRUMB: any = AppConstant.BREADCRUMB_PROJECT_LIST;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  searchText: any = '';  
  id: any;
  applicationType: any = AppConstant.APPLICATION_TYPE;
  projectList: any =[];
  shipList: any = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private confirmationDialogService: ConfirmationDialogService,
    private translate:TranslateService,
    private commonService: CommonService,
	  private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private projectListService: ProjectListService,
    private previewProjectService: PreviewProjectService) { 
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });
    } 

    gotoJobList(project){
      this.utilityService.setShipNameForJob(this.shipList.find(ship => ship.ship_id == project.shipid).name);
      this.router.navigate(['/core/job-list/'+project.shipid]);
    }

    markProjectComplete(project, index){
      this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to mark the project as completed... ?')
          .then((confirmed) => {
            if (confirmed) {
              this.utilityService.showLoader();
              this.projectListService.markProjectComplete(project.id).subscribe(res => {
                this.projectList[index].status = 'COM';
                this.utilityService.hideLoader();
                this.toastrService.success('Data save successfully!');
              }, err => {
                this.utilityService.hideLoader();
              });
            }
          })
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

  previewProject(project){
    this.previewProjectService.confirm('Project Preview', { projectId: project.id }, 'Select', 'Cancel', 'lg')
      .then((data) => {
        this.utilityService.showLoader();
        
        this.utilityService.hideLoader();
       
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    //ship id
    let shipId = (this.utilityService.getLoginInfo())[2];    
    loadDataList.push(this.projectListService.loadProjectList(shipId));
    loadDataList.push(this.projectListService.loadShipList());

    forkJoin(loadDataList).subscribe(resList => {
      this.projectList = resList[0];
      this.shipList = resList[1];
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

  async generateProjectReportIText(projectId){
    this.utilityService.showLoader();
    // tslint:disable-next-line:max-line-length
    const imageData = await this.projectListService.generateProjectReportIText(projectId);
    // tslint:disable-next-line:prefer-const
    // let url = window.URL.createObjectURL(imageData);
    // const a = document.createElement('a');
    // document.body.appendChild(a);
    // a.setAttribute('style', 'display: none');
    // a.href = url;
    // a.download = "aaa.zip";
    // a.click();
    // window.URL.revokeObjectURL(url);
    // a.remove(); // remove the element
    this.utilityService.hideLoader();
    this.print(projectId);
  }


  checkboxList: any = {};
  jobDetailList: any = [];
  componentList: any = [];
  pdfArray: any = [];
  previewOriginalData: any = null;
  print(projectId){
    this.pdfArray = [];
    //this.utilityService.showLoader();
    this.jobDetailList = [];
    this.componentList = this.utilityService.getComponentLinear();
    let PromiseList = [];    
    PromiseList.push(this.commonService.loadCheckboxesList());
    PromiseList.push(this.projectListService.loadProjectDetailForReportWithImageData(projectId));
    forkJoin(PromiseList).subscribe(resList => {
      this.checkboxList = resList[0];
      this.previewOriginalData = resList[1];
      this.checkboxList = _.mapValues(_.groupBy(this.checkboxList, 'key'), clist => clist.map(group => _.omit(group, 'key')));
      for(let i = 0; i < resList[1].projectJobList.length; i++){
        this.jobDetailList.push(resList[1].projectJobList[i]); 
        if (this.jobDetailList[i].jobAttachmentList == null) {
          this.jobDetailList[i].jobAttachmentList = [];
        }
        if(this.jobDetailList[i].jobProgressReportList == null) {
          this.jobDetailList[i].jobProgressReportList = [];
        }
        if(this.jobDetailList[i].jobCommentList == null) {
          this.jobDetailList[i].jobCommentList = [];
        }
        if(this.jobDetailList[i].jobProgressReportList == null) {
          this.jobDetailList[i].jobProgressReportList = [];
        }
        if(this.jobDetailList[i].checkboxes == null) {
          this.jobDetailList[i].checkboxes = '';
        }
        //prepare Checkbox start
        for (const key in this.checkboxList) {
          this.checkboxList[key].forEach(element => {
            const index = this.jobDetailList[i].checkboxes.split(',').indexOf('' + element.id);
            if (index !== -1) {
              element.isSelected = true;
            }else{
              element.isSelected = false;
            }
          });
        }
        this.jobDetailList[i].checkboxesList = this.checkboxList;
        //prepare Checkbox end
        //prepare Imagec start
        this.jobDetailList[i].jobAttachmentList.forEach(attachment => {
          let ext = attachment.attachmentName.substring(attachment.attachmentName.lastIndexOf('.') + 1).toLowerCase();
          if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
            attachment['ext'] = 'image';
          }else if(ext == 'xls' || ext == 'xlsx') {
            attachment['ext'] = 'excel';
          }else if(ext == 'pdf') {
            attachment['ext'] = 'pdf';
          }
        });  
        //prepare Imagec end

        this.jobDetailList[i].jobProgressReportList.reverse();
          this.jobDetailList[i].jobProgressReportList.forEach(progressReport => {
            if(progressReport.jobAttachmentList == null){
              progressReport.jobAttachmentList = [];
            }else{
              progressReport.jobAttachmentList.forEach(attachment => {
                let ext = attachment.attachmentName.substring(attachment.attachmentName.lastIndexOf('.') + 1).toLowerCase();
                if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
                  attachment['ext'] = 'image';
                }else if(ext == 'xls' || ext == 'xlsx') {
                  attachment['ext'] = 'excel';
                }else if(ext == 'pdf') {
                  attachment['ext'] = 'pdf';
                }
              });
            }
          });
          const component = this.componentList.find(component => component.id === this.jobDetailList[i].shipcomponentid);
          this.jobDetailList[i].selectedComponent =  component === undefined ? null : component;
      }      
    });    
  }
  
  arrangePdfData(jobId){
    var checkExist = setInterval(() =>{
      if (document.getElementById(jobId) !== null) {
         console.log("Exists!"+jobId);
         var HTML_Width = document.getElementById(jobId).offsetWidth;// this.content.nativeElement.offsetWidth;
          var HTML_Height = document.getElementById(jobId).offsetHeight;
          var top_left_margin = 15;
          var PDF_Width = HTML_Width+(top_left_margin*2);
          var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
          var canvas_image_width = HTML_Width;
          var canvas_image_height = HTML_Height;
          var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
          html2canvas(document.getElementById(jobId),{allowTaint:true}).then((canvas) =>{
            canvas.getContext('2d');
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
          
            for (var i = 1; i <= totalPDFPages; i++) { 
              pdf.addPage(PDF_Width, PDF_Height);
              pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }            
            this.pdfArray.push({key: jobId, value: pdf.output()});
            pdf.save(jobId+".pdf")
          });
         clearInterval(checkExist);
      }
    }, 100); // check every 100ms
  }

  async getImages() {
    for(let i = 1; i< this.jobDetailList.length; i++){
      for (let j = 0; j < this.jobDetailList[i - 1].jobAttachmentList.length; j++) {
        let ext = this.jobDetailList[i - 1].jobAttachmentList[j].attachmentName.substring(this.jobDetailList[i - 1].jobAttachmentList[j].attachmentName.lastIndexOf('.') + 1).toLowerCase();
        if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
        //if (this.jobModel.jobAttachmentList[i].attachmentType === 'image') {
          // tslint:disable-next-line:max-line-length
          const imageData = await this.projectListService.downloadDocument(this.jobDetailList[i - 1].jobAttachmentList[j].relativepath, this.orgId, this.jobDetailList[i - 1].shipid, this.jobDetailList[i - 1].projectid, this.jobDetailList[i - 1].id);
          const blob = new Blob([imageData], {
            type: 'image/jpg'
          });
          const urlCreator = window.URL;
          this.jobDetailList[i - 1].jobAttachmentList[j]['src'] = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob));
        }
      }

      for (let k = 1; k <= this.jobDetailList[i - 1].jobProgressReportList.length; k++) {
        for(let j = 1; j <= this.jobDetailList[i - 1].jobProgressReportList[k-1].jobAttachmentList.length; j++){
          let ext = this.jobDetailList[i - 1].jobProgressReportList[k-1].jobAttachmentList[j-1].attachmentName.substring(this.jobDetailList[i - 1].jobProgressReportList[k-1].jobAttachmentList[j-1].attachmentName.lastIndexOf('.') + 1).toLowerCase();
          if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
          //if (this.jobModel.jobAttachmentList[i].attachmentType === 'image') {
            // tslint:disable-next-line:max-line-length
            const imageData = await this.projectListService.downloadDocument(this.jobDetailList[i - 1].jobProgressReportList[k-1].jobAttachmentList[j-1].relativepath, this.orgId, this.jobDetailList[i - 1].shipid, this.jobDetailList[i - 1].projectid, this.jobDetailList[i - 1].id);
            const blob = new Blob([imageData], {
              type: 'image/jpg'
            });
            const urlCreator = window.URL;
            this.jobDetailList[i - 1].jobProgressReportList[k-1].jobAttachmentList[j-1]['src'] = this.sanitizer.bypassSecurityTrustUrl(
              urlCreator.createObjectURL(blob));
          }
        }
        
      }
    }
  }
}
