import { Component, OnInit, ElementRef, ViewEncapsulation  } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { AlertDialogService } from '../../../alert-dialog/alert-dialog.service';
import { SelectComponentService } from '../../../selectComponent/selectComponent.service';
import { SelectJobService } from '../../../selectJob/selectJob.service';
import { SelectAttachmentFromVesselService } from '../../../selectAttachmentFromVessel/selectAttachmentFromVessel.service';
import { CustomValidator } from '../../../shared/validation/customValidator';
import { AppConstant } from '../../../shared/constant/appConstant';
import { JobCreationService } from './job-creation.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { CommonService } from '../../../shared/services/common.service';

import { OrganizationComponent } from '../../../model/organizationComponent';
import { JobComment } from '../../../model/jobComment';
import { UserDetail } from '../../../model/userDetail';
import { ShipComponentDetail } from '../../../model/shipComponentDetails';
import { Job } from '../../../model/job';
import { JobAttachment } from '../../../model/jobAttachment';
import { MeterialDetail } from '../../../model/meterialDetail';
import { JobProgressReport } from '../../../model/jobProgressReport';


import * as _ from 'lodash';

@Component({
  selector: 'app-department-creation',
  templateUrl: './job-creation.component.html',
  styleUrls: ['./job-creation.component.scss'],
  animations: [routerTransition()],
  providers: [JobCreationService, UtilityService, CommonService],
  encapsulation: ViewEncapsulation.None
})
export class JobCreationComponent implements OnInit {
  checkbocCollapse = {  
                        isCollapsedToBeInclude: true,
                        isCollapsedMeterials: true,
                        isCollapsedTheWorkToBeSurvedAlsoBy: true
                    };
  @ViewChild('fileUpload') myInputVariable: ElementRef;
  BREADCRUMB: any = AppConstant.BREADCRUMB_JOB_CREATION;
  selectedComponent: any = new OrganizationComponent();
  jobForm: FormGroup;
  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  checkboxList: any = {};
  id: any;
  shipname: any = '';
  jobModel: Job = new Job();
  imageList: any;
  attachmentModel: JobAttachment = new JobAttachment();
  componentList: any = [];
  userDetail: any = new UserDetail();
  shipId: any;
  projectId: any;
  shipComponentDetail: any = new ShipComponentDetail();
  progressReport: any = new JobProgressReport();
  dateTimeFormat: any = 'yyyy-MM-dd HH:mm';
  dateFormat: any = 'yyyy-MM-dd';
  interval: any = 1000;
  jobDataForSave: any = null;
  imagePath: any = {
    'excel': 'assets/images/excel-icon.ico',
    'pdf': 'assets/images/pdf.jpg'
  }
  externalReferenceEditable: any= false;
  options: any;
  constructor(private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private toastrService: ToastrService,
    private alertDialogService: AlertDialogService,
    private confirmationDialogService: ConfirmationDialogService,
    private selectComponentService: SelectComponentService,
    private selectJobService: SelectJobService,
    private selectAttachmentFromVesselService: SelectAttachmentFromVesselService,
    private route: ActivatedRoute,
    private location: Location,
    private utilityService: UtilityService,
    private commonService: CommonService,
    private jobCreationService: JobCreationService) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(queryParams => {
      // this.shipname = queryParams.name;
      this.shipId = queryParams.shipId;
      this.projectId = queryParams.projectId;
      this.jobModel.shipid = queryParams.shipId;
      this.jobModel.projectid = queryParams.projectId;

      this.attachmentModel.shipid = queryParams.shipId;
      this.attachmentModel.projectid = queryParams.projectId;
      this.attachmentModel.orgid = this.orgId;      
    });
    this.shipname = this.utilityService.getShipNameForJob();
    this.options = AppConstant.editorConfig;
  }

  saveJob() {
    if(this.utilityService.checkEditorContentIsValid(this.jobModel.detailedSpecification)){
      this.utilityService.showLoader();
      this.jobDataForSave = Object.assign({}, this.jobModel);
      this.formToModelMapping();
      this.addJobProgressReport();
      if (this.jobDataForSave.shipcomponentid === 0 || this.jobDataForSave.shipcomponentid == null) {
        this.utilityService.hideLoader();
        this.alertDialogService.alert('Alert!', 'Please select a component', 'OK', 'lg');
        return;
      }
      this.jobCreationService.saveOrUpdateJob(this.jobDataForSave).subscribe(res => {
        this.utilityService.hideLoader();
        this.toastrService.success('Data save successfully!');
        this.id = res.id;
        this.ngOnInit();
      },err => {
          this.utilityService.hideLoader();
      });
    }else{
      this.alertDialogService.alert('Alert!', 'Invalid content in "Detailed Specification". Image or any attachment found.', 'OK', 'lg');
    }
  }

  formToModelMapping() {
    for (const key in this.jobDataForSave) {
      if (key === 'jobdate') {
        if (this.jobDataForSave[key] != null && this.jobDataForSave[key] !== '') {
          const date = this.jobDataForSave[key].year + '-' + this.jobDataForSave[key].month + '-' + this.jobDataForSave[key].day;
          this.jobDataForSave[key] = new Date(date).getTime();
        }
      } else {
        if (typeof this.jobDataForSave[key] === 'string') {
          this.jobDataForSave[key] = this.jobDataForSave[key].trim();
        } else {
          this.jobDataForSave[key] = this.jobDataForSave[key];
        }
      }
    }
    const checkBoxes = [];
    // tslint:disable-next-line:forin
    for (const key in this.checkboxList) {
      this.checkboxList[key].forEach(element => {
        if (element.isSelected) {
          checkBoxes.push(element.id);
        }
      });
    }
    this.jobDataForSave.checkboxes = checkBoxes.join();
    const comment = new JobComment();
    comment.jobComment = this.jobDataForSave.jobComment;
    this.jobDataForSave.jobComment = comment;
  }

  addJobProgressReport(){
    if(this.progressReport.reportingDate !== null && this.progressReport.reportingDate !== ''
      && this.progressReport.executionDate !== null && this.progressReport.executionDate !== ''
      && this.progressReport.workDone !== null && this.progressReport.workDone !== ''){
        this.progressReport.createdate = (new Date()).getTime();
        // let expireOn: any = new Date(this.progressReport.createdate.getTime());;
        // expireOn.setDate(expireOn.getDate() + 1);
        // this.progressReport.counter = (expireOn - this.progressReport.createdate)/1000;
        let tempReport = Object.assign({}, this.progressReport);
        if(tempReport.reportingDate !== null){
          tempReport.reportingDate = new Date(this.utilityService.javascriptDateToString(tempReport.reportingDate)).getTime();
        }
        if(tempReport.executionDate !== null){
          tempReport.executionDate = new Date(this.utilityService.datePickerObjectTodate(tempReport.executionDate)).getTime();
        }    
        this.jobDataForSave.jobProgressReport = tempReport;
        this.progressReport = new JobProgressReport();
    }  
    
    this.jobDataForSave.jobProgressReportList.forEach(report => {
      if(report.createdate !== null){
        report.createdate = new Date(this.utilityService.javascriptDateToString(report.createdate)).getTime();
      }
      if(report.reportingDate !== null){
        report.reportingDate = new Date(this.utilityService.javascriptDateToString(report.reportingDate)).getTime();
      }
      if(report.executionDate !== null){
        report.executionDate = new Date(this.utilityService.datePickerObjectTodate(report.executionDate)).getTime();
      }  
    });
  }

  prepareForm() {
    if (this.jobModel.jobdate) {
      const date = new Date(this.jobModel.jobdate);
      this.jobModel.jobdate = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };
    }
    // tslint:disable-next-line:forin
    for (const key in this.checkboxList) {
      this.checkboxList[key].forEach(element => {
        if(this.jobModel.checkboxes !== null){
          const index = this.jobModel.checkboxes.split(',').indexOf('' + element.id);
          if (index !== -1) {
            element.isSelected = true;
          }
        }        
      });
    }
    this.utilityService.hideLoader();
  }

  readURL(file: any, fileIndex: any, isProgressReportAttachment: boolean): void {
    const reader = new FileReader();
    if(isProgressReportAttachment){
      reader.onload = e => this.progressReport.jobAttachmentList[fileIndex]['src'] = reader.result;
      reader.readAsDataURL(file);
    }else{
      reader.onload = e => this.jobModel.jobAttachmentList[fileIndex]['src'] = reader.result;
      reader.readAsDataURL(file);
    }   
  }

  handleFileInput(files: FileList, attachmentFrom: string) {
    this.attachmentModel.jobid = this.jobModel.id;
    for (let i = 0; i < files.length; i++) {
      this.attachmentModel.attachmentName = files[i].name;
      let ext = this.attachmentModel.attachmentName.substring(this.attachmentModel.attachmentName.lastIndexOf('.') + 1).toLowerCase();
          if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
            this.attachmentModel['ext'] = 'image';
          }else if(ext == 'xls' || ext == 'xlsx') {
            this.attachmentModel['ext'] = 'excel';
          }else if(ext == 'pdf') {
            this.attachmentModel['ext'] = 'pdf';
          }
      if (attachmentFrom === 'specification') {
        this.attachmentModel.attachmentType = 'SPEC';
      } else if(attachmentFrom === 'progress-report'){
        this.attachmentModel.attachmentType = 'JPR';
      } else if(attachmentFrom === 'exp-report') {
        this.attachmentModel.attachmentType = 'JER';
      }
      if(attachmentFrom === 'progress-report'){
        this.progressReport.jobAttachmentList.push(Object.assign({}, this.attachmentModel));
        if (files[i].type.indexOf('image') != -1) {
          this.readURL(files[i], this.progressReport.jobAttachmentList.length - 1, true);
        }
      }else{
        this.jobModel.jobAttachmentList.push(Object.assign({}, this.attachmentModel));
        if (files[i].type.indexOf('image') != -1) {
          this.readURL(files[i], this.jobModel.jobAttachmentList.length - 1, false);
        }
      }
      
    }
    if (files.length > 0) {
      if(attachmentFrom === 'progress-report'){
        this.uploadImageFile(files, true);
      }else{
        this.uploadImageFile(files, false);
      }
      
    }
  }

  uploadImageFile(files: any, isProgressReportAttachment: boolean) {
    this.utilityService.showLoader();
    const attachmentUrlList = [];
    for (let i = 0; i < files.length; i++) {
      // tslint:disable-next-line:max-line-length
      attachmentUrlList.push(this.jobCreationService.uploadImageFileBulk(files[i], this.orgId, this.jobModel.shipid, this.jobModel.projectid, this.jobModel.id));
    }

    forkJoin(attachmentUrlList).subscribe(res => {
      this.utilityService.hideLoader();
      for (let i = 0; i < res.length; i++) {
        if(isProgressReportAttachment){
          this.progressReport.jobAttachmentList[(this.progressReport.jobAttachmentList.length) - (res.length - i)].relativepath = res[i][0];
        }else{
          this.jobModel.jobAttachmentList[(this.jobModel.jobAttachmentList.length) - (res.length - i)].relativepath = res[i][0];
        }
      }
    }, err => {
      this.utilityService.hideLoader();
    });
  }

  async getImages() {
    for (let i = 0; i < this.jobModel.jobAttachmentList.length; i++) {
      let ext = this.jobModel.jobAttachmentList[i].attachmentName.substring(this.jobModel.jobAttachmentList[i].attachmentName.lastIndexOf('.') + 1).toLowerCase();
      if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
      //if (this.jobModel.jobAttachmentList[i].attachmentType === 'image') {
        // tslint:disable-next-line:max-line-length
        const imageData = await this.jobCreationService.downloadDocument(this.jobModel.jobAttachmentList[i].relativepath, this.orgId, this.jobModel.shipid, this.jobModel.projectid, this.jobModel.id);
        const blob = new Blob([imageData], {
          type: 'image/jpg'
        });
        const urlCreator = window.URL;
        this.jobModel.jobAttachmentList[i]['src'] = this.sanitizer.bypassSecurityTrustUrl(
          urlCreator.createObjectURL(blob));
      }
    }

    for (let i = 1; i <= this.jobModel.jobProgressReportList.length; i++) {
      for(let j = 1; j <= this.jobModel.jobProgressReportList[i-1].jobAttachmentList.length; j++){
        let ext = this.jobModel.jobProgressReportList[i-1].jobAttachmentList[j-1].attachmentName.substring(this.jobModel.jobProgressReportList[i-1].jobAttachmentList[j-1].attachmentName.lastIndexOf('.') + 1).toLowerCase();
        if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
        //if (this.jobModel.jobAttachmentList[i].attachmentType === 'image') {
          // tslint:disable-next-line:max-line-length
          const imageData = await this.jobCreationService.downloadDocument(this.jobModel.jobProgressReportList[i-1].jobAttachmentList[j-1].relativepath, this.orgId, this.jobModel.shipid, this.jobModel.projectid, this.jobModel.id);
          const blob = new Blob([imageData], {
            type: 'image/jpg'
          });
          const urlCreator = window.URL;
          this.jobModel.jobProgressReportList[i-1].jobAttachmentList[j-1]['src'] = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob));
        }
      }
      
    }
  }

  async downloadFile(attachment) {
    this.utilityService.showLoader();
    // tslint:disable-next-line:max-line-length
    const imageData = await this.jobCreationService.downloadDocument(attachment.relativepath, this.orgId, this.jobModel.shipid, this.jobModel.projectid, this.jobModel.id);
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

  deleteFile(index) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete the attachment... ?')
      .then((confirmed) => {
        if (confirmed) {
          this.jobModel.jobAttachmentList.splice(index, 1);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  selectComponent() {
    // tslint:disable-next-line:max-line-length
    this.selectComponentService.confirm('Select Component', { shipId: this.jobModel.shipid, shipcomponentid: this.jobModel.shipcomponentid }, 'Select', 'Cancel', 'lg')
      .then((component) => {
        this.selectedComponent = component;
        this.jobModel.shipcomponentid = this.selectedComponent.id;
        this.utilityService.showLoader();
        this.commonService.getComponentDetail(this.jobModel.shipcomponentid, this.jobModel.shipid).subscribe(res => {
          if(res != null){
            this.shipComponentDetail = res[0];
            this.jobModel.make = this.shipComponentDetail.make;
            this.jobModel.model = this.shipComponentDetail.model;
            this.jobModel.makeModelDescription = this.shipComponentDetail.description;
          }          
          this.utilityService.hideLoader();
        }, err => {
          this.utilityService.hideLoader();
        });
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  selectJobForCopy(jobSelectFrom) {
    const title = jobSelectFrom === 'library' ? 'Job Library' : 'Previous Job List';
    this.selectJobService.confirm(title, { shipId: this.jobModel.shipid, jobSelectFrom: jobSelectFrom }, 'Select', 'Cancel', 'lg')
      .then((job) => {
        this.utilityService.showLoader();
        let attachmentTypes = ['SPEC'];
        this.jobCreationService.copyJob(this.projectId, job.id, jobSelectFrom, this.jobModel.shipid, this.orgId, attachmentTypes).subscribe(res => {
          this.id = res.id;
          this.ngOnInit();
          console.log("job copy successfully");
          this.utilityService.hideLoader();
        }, err => {
          this.utilityService.hideLoader();
        });
        // this.jobModel.shipcomponentid = job.shipcomponentid === undefined ? null : job.shipcomponentid;
        // this.jobModel.jobdate = job.jobdate === undefined ? this.jobModel.jobdate : job.jobdate;
        // this.jobModel.description = job.description;
        // this.jobModel.accountno = job.accountno;
        // this.jobModel.specification = job.specification;
        // this.jobModel.location = job.location;
        // this.jobModel.detailedSpecification = job.detailedSpecification;
        // this.jobModel.totalArea = job.totalArea;
        // this.jobModel.estimatedBudget = job.estimatedBudget;
        // this.jobModel.currency = job.currency;
        // this.jobModel.checkboxes = job.checkboxes;
        // // tslint:disable-next-line:no-shadowed-variable
        // const component = this.componentList.find(component => component.id === this.jobModel.shipcomponentid);
        // this.selectedComponent =  component === undefined ? new OrganizationComponent : component;
        this.prepareForm();
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  getVesselAttachmentForCopy(attachmentType: any) {
    this.selectAttachmentFromVesselService.confirm("Select Vessel Doc", { shipId: this.jobModel.shipid}, 'Attach', 'Cancel', 'lg')
      .then((attachmentList) => {
       this.jobCreationService.attachVesselDocWithJob(attachmentList, this.jobModel.id, this.jobModel.projectid, attachmentType, 0).subscribe(res => {
        res.forEach(attachment => {
          let ext = attachment.attachmentName.substring(attachment.attachmentName.lastIndexOf('.') + 1).toLowerCase();
          if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
            attachment['ext'] = 'image';
          }else if(ext == 'xls' || ext == 'xlsx') {
            attachment['ext'] = 'excel';
          }else if(ext == 'pdf') {
            attachment['ext'] = 'pdf';
          }
        });
        if(attachmentType == 'SPEC'){
          this.jobModel.jobAttachmentList = this.jobModel.jobAttachmentList.concat(res);
        }
        this.getImages(); 
       });
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  focusOnMeterialRow(index){
    if(index !== 0 && (this.jobModel.jobMaterialDetailsList[index].make === '' || this.jobModel.jobMaterialDetailsList[index].make === null)
        && (this.jobModel.jobMaterialDetailsList[index].model === '' || this.jobModel.jobMaterialDetailsList[index].model === null)
        && (this.jobModel.jobMaterialDetailsList[index].uom === '' || this.jobModel.jobMaterialDetailsList[index].uom === null)
        && (this.jobModel.jobMaterialDetailsList[index].drawingNo === '' || this.jobModel.jobMaterialDetailsList[index].drawingNo === null)){
      let meterialDetailOfPreviousRow = this.jobModel.jobMaterialDetailsList[index - 1];
      this.jobModel.jobMaterialDetailsList[index].make = meterialDetailOfPreviousRow.make;
      this.jobModel.jobMaterialDetailsList[index].model = meterialDetailOfPreviousRow.model;
      this.jobModel.jobMaterialDetailsList[index].uom = meterialDetailOfPreviousRow.uom;
      this.jobModel.jobMaterialDetailsList[index].drawingNo = meterialDetailOfPreviousRow.drawingNo;
    }
  }

  addRowInMeterialList(){
    for(let i = 1; i <= 10; i++){
      this.jobModel.jobMaterialDetailsList.push(new MeterialDetail());            
    }
    let sequence = 1;
    this.jobModel.jobMaterialDetailsList.forEach(material => {
      if(material.isactive == 1){
        material.index = sequence;
        sequence++;
      }      
    });
  }

  deleteRowInMeterialList(index){
    if(this.jobModel.jobMaterialDetailsList[index].id == 0){
      this.jobModel.jobMaterialDetailsList.splice(index, 1);
    }else{
      this.jobModel.jobMaterialDetailsList[index].isactive = 0;
    }   
    let sequence = 1;
    this.jobModel.jobMaterialDetailsList.forEach(material => {
      if(material.isactive == 1){
        material.index = sequence;
        sequence++;
      }      
    });
  }

  gotoJobList(){
    this.location.back()
  }

  // addToProgressReportList(){
  //   if (this.progressReport.executionDate != null && this.progressReport.executionDate !== '') {
  //     const date = this.progressReport.executionDate.year + '-' + this.progressReport.executionDate.month + '-' + this.progressReport.executionDate.day;
      
  //   }
  // }

  editProgressReport(reportIndex){
    this.progressReport = Object.assign({}, this.jobModel.jobProgressReportList[reportIndex]);
    this.progressReport.executionDate = this.utilityService.javascriptDateToObj(this.progressReport.reportingDate);
  }

  ngOnInit() {
    this.utilityService.showLoader();
    const date = {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      };
    this.componentList = this.utilityService.getComponentLinear();
    let PromiseList = [];
    PromiseList.push(this.commonService.loadCheckboxesList());
    if (this.id === 0) {
      this.utilityService.hideLoader();
    } else {
      PromiseList.push(this.jobCreationService.loadJobDetails(this.id));
    }
    forkJoin(PromiseList).subscribe(res => {
      this.checkboxList = res[0];
      this.checkboxList = _.mapValues(_.groupBy(this.checkboxList, 'key'), clist => clist.map(group => _.omit(group, 'key')));
      if (this.id !== 0) {
        this.jobModel = res[1];        
        if (this.jobModel.jobAttachmentList == null) {
          this.jobModel.jobAttachmentList = [];
        }
        if(this.jobModel.jobProgressReportList == null) {
          this.jobModel.jobProgressReportList = [];
        }
        if(this.jobModel.jobCommentList == null) {
          this.jobModel.jobCommentList = [];
        }
        if(this.jobModel.jobProgressReportList == null) {
          this.jobModel.jobProgressReportList = [];
        }
        if(this.jobModel.externalReference !== null && this.jobModel.externalReference.length != 0){
          this.externalReferenceEditable == false;
        }else{
          this.externalReferenceEditable == true;
        }
        this.jobModel.jobAttachmentList.forEach(attachment => {
          let ext = attachment.attachmentName.substring(attachment.attachmentName.lastIndexOf('.') + 1).toLowerCase();
          if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
            attachment['ext'] = 'image';
          }else if(ext == 'xls' || ext == 'xlsx') {
            attachment['ext'] = 'excel';
          }else if(ext == 'pdf') {
            attachment['ext'] = 'pdf';
          }
        });
        this.prepareForm();        
        // tslint:disable-next-line:no-shadowed-variable
        PromiseList = [];
        PromiseList.push(this.jobCreationService.getUserDetail(this.jobModel.updateid));
        PromiseList.push(this.commonService.getComponentDetail(this.jobModel.shipcomponentid, this.jobModel.shipid));
        forkJoin(PromiseList).subscribe(res => {
            this.userDetail = res[0];
            if(res[1] != null){
              this.shipComponentDetail = res[1][0];
            }
            this.jobModel.specification = this.shipComponentDetail.make +" "+this.shipComponentDetail.model+" "+this.shipComponentDetail.description;

            // merial setup start            
            if(this.jobModel.jobMaterialDetailsList === null){
              this.jobModel.jobMaterialDetailsList = [];
            }
            if(this.jobModel.jobMaterialDetailsList.length < 10){
              for(let i = this.jobModel.jobMaterialDetailsList.length; i < 10; i++){
                this.jobModel.jobMaterialDetailsList.push(new MeterialDetail());            
              }
            }
            let index = 1;
            this.jobModel.jobMaterialDetailsList.forEach(material => {
              material.index = index;
              index++;
            });
            if(this.jobModel.jobMaterialDetailsList[0].make == '' && this.jobModel.jobMaterialDetailsList[0].model == ''){
              this.jobModel.jobMaterialDetailsList[0].make = this.shipComponentDetail.make;
              this.jobModel.jobMaterialDetailsList[0].model = this.shipComponentDetail.model;
            }
             // merial setup end

             //progress report setup start
            this.progressReport.reportingDate = new Date();
            if(this.jobModel.jobProgressReportList == null){
              this.jobModel.jobProgressReportList = [];
            } else {
              this.jobModel.jobProgressReportList.reverse();
              this.jobModel.jobProgressReportList.forEach(progressReport => {
                progressReport.isOpen = false;
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
                progressReport.createdate = new Date(progressReport.createdate);
                let currentDate = new Date();
                let diff = currentDate.getTime() - progressReport.createdate.getTime();
                if(diff/1000 > 86400){
                  progressReport.counter = 0;
                } else {
                  progressReport.counter = 86400 - Math.round(diff/1000);
                }
                if(progressReport.reportingDate !== null){
                  progressReport.reportingDate = new Date(progressReport.reportingDate);
                }
                if(progressReport.executionDate !== null){
                  progressReport.executionDate = new Date(progressReport.executionDate);
                }
              });
            }
             //progress report setup end
             //download all images
             this.getImages();
        }, err => {
          this.utilityService.hideLoader();
        });
        this.jobCreationService.getUserDetail(this.jobModel.updateid).subscribe(res => {
          this.userDetail = res;
        }, err => {
          this.utilityService.hideLoader();
        });
      } else {
        this.jobModel.jobdate = date;
      }
      // tslint:disable-next-line:no-shadowed-variable
      const component = this.componentList.find(component => component.id === this.jobModel.shipcomponentid);
      this.selectedComponent =  component === undefined ? new OrganizationComponent : component;
    }, err => {
      this.utilityService.hideLoader();
    });
  }

}
