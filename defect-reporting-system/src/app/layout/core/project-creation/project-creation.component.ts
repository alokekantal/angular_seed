import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, CurrencyPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { CustomValidator } from '../../../shared/validation/customValidator';
import { AlertDialogService } from '../../../alert-dialog/alert-dialog.service';
import { AppConstant } from '../../../shared/constant/appConstant';
import { Project } from '../../../model/project';
import { ProjectAttachment } from '../../../model/projectAttachment';
import { ProjectDockyard } from '../../../model/projectDockyard';
import { ProjectCurrencyConversion } from '../../../model/projectCurrencyConversion';
import { Ship } from '../../../model/ship';
import { ProjectJobCostLineitem } from '../../../model/projectJobCostLineitem';
import { ProjectJobCostLineitemDetails } from '../../../model/projectJobCostLineitemDetails';

import { SelectAttachmentFromVesselService } from '../../../selectAttachmentFromVessel/selectAttachmentFromVessel.service';
import { ProjectCreationService } from './project-creation.service'
import { ShipDashboardService } from '../ship-dashboard/ship-dashboard.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { CommonService } from '../../../shared/services/common.service';
import { NewPreviewJobService } from '../../../newPreviewJob/newPreviewJob.service';

@Component({
  selector: 'app-department-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.scss'],
  animations: [routerTransition()],
  providers: [ProjectCreationService, ShipDashboardService, UtilityService, CommonService, NewPreviewJobService]
})
export class ProjectCreationComponent implements OnInit {
  limit: number = 5;
  BREADCRUMB: any = AppConstant.BREADCRUMB_PROJECT_CREATION;
  //projectForm: FormGroup;
  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
  shipId: number = null;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  projectList: any = [];
  shipDetail: Ship = new Ship();
  jobList: any = [];
  activeProjectDetail: Project = new Project();
  vesselTypeList: any = [];
  dockyardList: any = [];

  id: any;
  projectModel: Project = new Project();
  editoeOptions: any;
  currencyMasterList: any = [];
  imagePath: any = {
    'excel': 'assets/images/excel-icon.ico',
    'pdf': 'assets/images/pdf.jpg'
  }

  attachmentModel: any = new ProjectAttachment();
  dateTimeFormat: any = AppConstant.dateTimeFormat;
  dateFormat: any = AppConstant.dateFormat;
  selectedJob: any = null;
  jobYardTotalList = [];
  jobYardQuoteCurrencyList = [];
  constructor(private translate:TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private location: Location,
    private alertDialogService: AlertDialogService,
    private newPreviewJobService: NewPreviewJobService,
    private confirmationDialogService: ConfirmationDialogService,
    private selectAttachmentFromVesselService: SelectAttachmentFromVesselService,
    private modalService: NgbModal,
    private utilityService: UtilityService,
    private commonService: CommonService,
    private shipDashboardService: ShipDashboardService,
    private projectCreationService: ProjectCreationService) {
      this.id = +this.route.snapshot.paramMap.get('id');
      this.shipId = +this.route.snapshot.paramMap.get('shipId');

      this.editoeOptions = AppConstant.editorConfig;
  }

  handleFileInput(files: FileList, attachmentFrom: string) {
    this.attachmentModel.shipid = this.projectModel.shipid;
    this.attachmentModel.projectid = this.projectModel.id;
    this.attachmentModel.orgid = this.orgId; 
    for (let i = 0; i < files.length; i++) {
      this.attachmentModel.attachmentName = files[i].name;   
      if (attachmentFrom === 'document') {
        this.attachmentModel.attachmentType = 'document';
      }
      if(attachmentFrom === 'document'){
        this.projectModel.projectAttachmentList.push(Object.assign({}, this.attachmentModel));        
      }      
    }
    if (files.length > 0) {
      if(attachmentFrom === 'document'){
        this.uploadImageFile(files);
      }
    }
  }

  uploadImageFile(files: any) {
    this.utilityService.showLoader();
    const attachmentUrlList = [];
    for (let i = 0; i < files.length; i++) {
      // tslint:disable-next-line:max-line-length
      attachmentUrlList.push(this.projectCreationService.uploadProjectDocument(files[i], this.orgId, this.projectModel.shipid, this.projectModel.id));
    }

    forkJoin(attachmentUrlList).subscribe(res => {
      this.utilityService.hideLoader();
      for (let i = 0; i < res.length; i++) {
          this.projectModel.projectAttachmentList[(this.projectModel.projectAttachmentList.length) - (res.length - i)].relativepath = res[i][0];
      }
    }, err => {
      this.utilityService.hideLoader();
    });
  }

  async downloadFile(attachment) {
    this.utilityService.showLoader();
    // tslint:disable-next-line:max-line-length
    const imageData = await this.projectCreationService.downloadDocument(attachment.relativepath, this.orgId, this.projectModel.shipid, this.projectModel.id);
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

async downloadShipFile(attachment) {
    this.utilityService.showLoader();
    // tslint:disable-next-line:max-line-length
    const imageData = await this.shipDashboardService.downloadDocument(attachment.relativepath, this.orgId, this.projectModel.shipid);
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
          this.projectModel.projectAttachmentList.splice(index, 1);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
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

  open(content, jobIndex) {
    this.selectedJob = Object.assign({},this.projectModel.projectJobList[jobIndex]);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.selectedJob.approvalLastUpdatedByName = this.utilityService.getLoginInfo()[0].userFirstName;
      this.selectedJob.approvalLastUpdatedBy = this.utilityService.getLoginInfo()[0].userId;
      this.selectedJob.approvalLastUpdatedOn = new Date();
      this.projectModel.projectJobList[jobIndex] = Object.assign({}, this.selectedJob);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getApprovedJobCount(){
    let jobList = this.projectModel.projectJobList.filter(job => job.approvalFlag == 'Y');
    return jobList.length;
  }

  jobClick(job) {
    // if (job.status === 'A') {
    //   // tslint:disable-next-line:max-line-length
    //   this.router.navigate(['/core/job-creation/' + job.id], {queryParams: {name: this.shipDetail.name, shipId: job.shipid, projectId: job.projectid}});
    // } else {
      const title = 'Job Detail';
      // tslint:disable-next-line:max-line-length
      this.newPreviewJobService.confirm(title, { shipId: job.shipid, jobSelectFrom: 'previous', id: job.id }, 'Select', 'Cancel', 'lg')
        .then((res) => {
          console.log(res);
        })
        // tslint:disable-next-line:max-line-length
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    //}
  }
  
  ngOnInit() {
    this.utilityService.showLoader();
    let promiseList = [];    
    // ship dashboard 
    promiseList.push(this.shipDashboardService.loadProjectList(this.shipId));
    promiseList.push(this.shipDashboardService.getShipDetail(this.shipId));
    promiseList.push(this.shipDashboardService.loadJobList(this.shipId));
    promiseList.push(this.commonService.getMasterVesselTypeList());
    promiseList.push(this.shipDashboardService.loadActiveProjectDetail(this.shipId));
    promiseList.push(this.commonService.loadDockyardList());
    // ship dashboard 
    promiseList.push(this.projectCreationService.loadProjectDetails(this.id));
    promiseList.push(this.commonService.loadCurrencyMaster());

    forkJoin(promiseList).subscribe(resList => {
      this.projectList = resList[0];
      this.shipDetail = resList[1];
      this.jobList = resList[2];
      this.vesselTypeList = resList[3];
      this.activeProjectDetail = resList[4];
      this.dockyardList = resList[5];

      this.projectModel = resList[6];
      this.currencyMasterList = resList[7];

      if(this.jobList.length < 5){
        this.limit = this.jobList.length;
      }
      
      //project data config
      if(this.projectModel.projectAttachmentList == null){
        this.projectModel.projectAttachmentList = [];
      }
      this.projectModel.projectJobList.forEach(job => {
        job.approvalLastUpdatedOn = job.approvalLastUpdatedOn == 0 ? new Date() : new Date(job.approvalLastUpdatedOn)
      });

      //project data config

      //configur yard list
      let yardList = Array.from(this.projectModel.projectDockyardList == null ? [] : this.projectModel.projectDockyardList);
      this.projectModel.projectDockyardList = [];
      this.dockyardList.forEach(yard => {
        let projectYard: any  = yardList.find((projectYard: any) => {return projectYard.dockyardId == yard.id});
        if(projectYard !== undefined){
          projectYard.isSelected = true;
          this.projectModel.projectDockyardList.push(projectYard);
        }else{
          let yardMap = new ProjectDockyard(this.projectModel.shipid, this.projectModel.id, yard.id, yard.dockyard, false);
          this.projectModel.projectDockyardList.push(yardMap);
        }        
      });

      this.projectModel.estimatedStart = this.utilityService.javascriptDateToObj(new Date(this.projectModel.estimatedStart));
      this.projectModel.actualStart = this.utilityService.javascriptDateToObj(new Date(this.projectModel.actualStart));
      this.projectModel.estimatedfinish = this.utilityService.javascriptDateToObj(new Date(this.projectModel.estimatedfinish));
      this.projectModel.actualfinish = this.utilityService.javascriptDateToObj(new Date(this.projectModel.actualfinish));

      if(this.projectModel.projectCurrencyConversionList == null){
        this.projectModel.projectCurrencyConversionList = [];
      }
      this.projectModel.projectCurrencyConversionList.forEach(currencyDetail => {
        if(currencyDetail.tocurrencyid === this.projectModel.currencyMasterId){
          currencyDetail.isSelected = true;
        }else{
          currencyDetail.isSelected = false;
        }
      });
      //configur yard list

      this.configurCoseTab();
      if(this.shipDetail.shipAttachmentList == null){
        this.shipDetail.shipAttachmentList = [];
      }

      this.shipDetail.shipAttachmentList.forEach(attachment => {
        if(attachment.vesselDocTypeId == null || attachment.vesselDocTypeId == 0){
          attachment.vesselDocTypeId = '0';
        }
        attachment['ext'] = this.utilityService.getFileType(attachment);            
      });
      //sort job by date
      this.jobList = this.jobList.sort((a, b) => {                
          return b.update - a.update;
      });
      this.jobList.forEach(job => {
        job['meterialList'] = [1,2,3,4,5,6];
      });
      
      if (this.shipDetail.shipAttachmentList == null) {
        this.shipDetail.shipAttachmentList = [];
      } else {
        this.getImages();
      }
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

  configurCoseTab(){
    if(this.projectModel.lineitemList == null){
      this.projectModel.lineitemList = [];
    }
    //prepare preamble data start
    let checkPreambleItemExist = this.projectModel.lineitemList.findIndex(item => {return item.jobid === 1}); //1 for preamble
    if(checkPreambleItemExist === -1){
      let itemDetail = this.prepareItemDetailAndPushtoItem(1);//1 for preamble
      this.projectModel.lineitemList.splice(0,0,itemDetail);
    }
    //prepare preamble data end
    //prepare job data start
    this.projectModel.projectJobList.forEach(job => {      
      let checkJobItemExist = this.projectModel.lineitemList.findIndex(item => {return item.jobid === job.id});
      if(checkJobItemExist === -1){
        let itemDetail = this.prepareItemDetailAndPushtoItem(job.id);
        this.projectModel.lineitemList.push(itemDetail);
      }
    });
    //prepare job data end

    //prepare other data start
    let checkOtherItemExist = this.projectModel.lineitemList.findIndex(item => {return item.jobid === 2}); //2 for other
    if(checkOtherItemExist === -1){
      let itemDetail = this.prepareItemDetailAndPushtoItem(2);//1 for other
      this.projectModel.lineitemList.push(itemDetail);
    }
    //prepare other data end

    //prepare Vendor data start
    if(this.projectModel.lineitemList.length !== 0 && this.projectModel.lineitemList[0].detailsList != null){
      let yardIndexInCost = this.projectModel.lineitemList[0].detailsList.findIndex(yardData => {return yardData.dockyardId === 1});
      if(yardIndexInCost === -1){
        this.projectModel.lineitemList.forEach(item => {
          item.detailsList.push(new ProjectJobCostLineitemDetails(this.projectModel.shipid, this.projectModel.id, item.jobid, 1, item.id)); //1 for vendor
          item.detailsList.sort((a,b) => (a.dockyardId > b.dockyardId) ? 1 : ((b.dockyardId > a.dockyardId) ? -1 : 0)); 
          let firstElement = item.detailsList[0];
          item.detailsList.shift(); //remove 1st elememt from array
          item.detailsList.push(firstElement);
        });
      }      
    }
    //prepare Vendor data start

    this.prepareJobYardWiseTotalAndCurrencyOnPageLoad();
  }

  prepareJobYardWiseTotalAndCurrencyOnPageLoad(){
    let calculateAndSet = (jobId) => {
      this.projectModel.lineitemList[0].detailsList.forEach((detail, detailIndex) => {
        let sum = 0;
        this.projectModel.lineitemList.forEach(item => {
          if(item.detailsList !== null && item.detailsList[detailIndex] !== undefined){
            if(item.jobid == jobId){
              sum += item.detailsList[detailIndex].costQuoteCurrency;

              //set quote currency
              let index = this.jobYardQuoteCurrencyList.findIndex(quoteCurrency => {return quoteCurrency.key == jobId+'@'+item.detailsList[detailIndex].dockyardId});
              if(index === -1){
                let quoteCurrency = {
                  key: jobId+'@'+item.detailsList[detailIndex].dockyardId,
                  value: item.detailsList[detailIndex].quoteCurrencyid
                };
                this.jobYardQuoteCurrencyList.push(quoteCurrency);
              }
            }
          }            
        });
        let index = this.jobYardTotalList.findIndex(total => {return total.key == jobId+'@'+detail.dockyardId});
        if(index === -1){
          let jobYardTotal = {
            key: jobId+'@'+detail.dockyardId,
            value: sum
          };
          this.jobYardTotalList.push(jobYardTotal);
        }else{
          this.jobYardTotalList[index].value = sum;
        }
      });
    }
    
    calculateAndSet(1); //for preamble
    calculateAndSet(2);//for other
    this.projectModel.projectJobList.forEach(job => {
      calculateAndSet(job.id);
    });
    
  }

  prepareItemDetailAndPushtoItem(jobid){
    let lineItem = new ProjectJobCostLineitem(this.projectModel.shipid, this.projectModel.id, jobid);
    this.projectModel.projectDockyardList.forEach(yard => {
      if(yard.isSelected){
        let itemDetail = new ProjectJobCostLineitemDetails(this.projectModel.shipid, this.projectModel.id, lineItem.jobid, yard.dockyardId, lineItem.id);
        lineItem.detailsList.push(itemDetail);
      }
    });
    return lineItem;
  }

  addItemToJob(job){
    let lineItem = new ProjectJobCostLineitem(this.projectModel.shipid, this.projectModel.id, job.id);
    this.projectModel.projectDockyardList.forEach(yard => {
      if(yard.isSelected){
        let itemDetail = new ProjectJobCostLineitemDetails(this.projectModel.shipid, this.projectModel.id, lineItem.jobid, yard.dockyardId, lineItem.id);
        let index = this.jobYardQuoteCurrencyList.findIndex(quoteCurrency => {return quoteCurrency.key == lineItem.jobid+'@'+yard.dockyardId});
        itemDetail.quoteCurrencyid = this.jobYardQuoteCurrencyList[index].value;
        lineItem.detailsList.push(itemDetail);
      }
    });
    // add vendor data start
    lineItem.detailsList.push(new ProjectJobCostLineitemDetails(this.projectModel.shipid, this.projectModel.id, lineItem.jobid, 1, lineItem.id)); //1 for vendor
    lineItem.detailsList.sort((a,b) => (a.dockyardId > b.dockyardId) ? 1 : ((b.dockyardId > a.dockyardId) ? -1 : 0)); 
    let firstElement = lineItem.detailsList[0];
    lineItem.detailsList.shift(); //remove 1st elememt from array
    lineItem.detailsList.push(firstElement);
    // add vendor data end
    this.projectModel.lineitemList.push(lineItem);
  }

  addDockyardToCost(dockyard){
    if(dockyard.isSelected){
      this.projectModel.lineitemList.forEach(item => {
        item.detailsList.push(new ProjectJobCostLineitemDetails(this.projectModel.shipid, this.projectModel.id, item.jobid, dockyard.dockyardId, item.id));
        item.detailsList.sort((a,b) => (a.dockyardId > b.dockyardId) ? 1 : ((b.dockyardId > a.dockyardId) ? -1 : 0)); 
        let firstElement = item.detailsList[0];
        item.detailsList.shift(); //remove 1st elememt from array
        item.detailsList.push(firstElement);

        //initialize quote currency for new dockyard added to cost start
        let index = this.jobYardQuoteCurrencyList.findIndex(quoteCurrency => {return quoteCurrency.key == item.jobid+'@'+dockyard.dockyardId});
        if(index === -1){
        let quoteCurrency = {
          key: item.jobid+'@'+dockyard.dockyardId,
          value: ""
        };
        this.jobYardQuoteCurrencyList.push(quoteCurrency);
        }
              
        index = this.jobYardTotalList.findIndex(total => {return total.key == item.jobid+'@'+dockyard.dockyardId});
        if(index === -1){
          let jobYardTotal = {
          key: item.jobid+'@'+dockyard.dockyardId,
          value: 0
          };
          this.jobYardTotalList.push(jobYardTotal);
        }
        //initialize quote currency for new dockyard added to cost end
      });
    }else{
      let yardIndexInCost = this.projectModel.lineitemList[0].detailsList.findIndex(yard => {return yard.dockyardId === dockyard.dockyardId});
      this.projectModel.lineitemList.forEach(item => {
        item.detailsList.splice(yardIndexInCost, 1);        
      });
    }
  }

  resetYard(index, dockyard){    
    this.projectModel.projectDockyardList[index].contactDetails = '';
    this.projectModel.projectDockyardList[index].remarks = '';
    this.projectModel.projectDockyardList[index].defaultCurrencyId = '';
    this.prepareCurrencyConversionList();
  }

  getDistinctCurrency(){
    this.projectModel.projectCurrencyConversionList.forEach(currencyDetail => {
      currencyDetail.isSelected = false;
    });
    let selectedYardList =  this.projectModel.projectDockyardList.filter(yard => yard.isSelected === true);    
    let distinctCurrencyList = []
    selectedYardList.forEach(yard => {
      if(yard.defaultCurrencyId != ''){
        let index  = distinctCurrencyList.indexOf(yard.defaultCurrencyId);
        if(index === -1){
          distinctCurrencyList.push(+yard.defaultCurrencyId);          
        }
      }      
    });
    return distinctCurrencyList;
  }

  //prepare currency conversion List
  prepareCurrencyConversionList(dockyard: any = undefined){
    if(dockyard !== undefined){
      this.updateCostYaedCurrency(dockyard);
    }
    
    let distinctCurrencyList = this.getDistinctCurrency();
    distinctCurrencyList.forEach(currency => {
      let convertCurrency = this.projectModel.projectCurrencyConversionList.find(currencyConvert =>{
        return currencyConvert.fromcurrencyid == currency && currencyConvert.tocurrencyid == this.projectModel.currencyMasterId;
      });      

      if(convertCurrency != undefined){
        let index = this.projectModel.projectCurrencyConversionList.findIndex(currencyConvert =>{
          return currencyConvert.fromcurrencyid == currency && currencyConvert.tocurrencyid == this.projectModel.currencyMasterId;
        });
        this.projectModel.projectCurrencyConversionList[index].isSelected = true;
      }else{
        this.projectModel.projectCurrencyConversionList.push(new ProjectCurrencyConversion(this.projectModel.shipid, this.projectModel.id, +currency, +this.projectModel.currencyMasterId, true));
        let lastCurrencyIndex = this.projectModel.projectCurrencyConversionList.length - 1;
        if(this.projectModel.projectCurrencyConversionList[lastCurrencyIndex].fromcurrencyid === +this.projectModel.currencyMasterId){
          this.projectModel.projectCurrencyConversionList[lastCurrencyIndex].conversionRate = 1;
        }
      }
    });
  }

  changeToCurrencyForConversionList(){    
    this.prepareCurrencyConversionList();
  }

  updateCostYaedCurrency(dockyard){
    console.log(this.jobYardQuoteCurrencyList);
    let yardIndexInCost = this.projectModel.lineitemList[0].detailsList.findIndex(yard => {return yard.dockyardId === dockyard.dockyardId});
    if(yardIndexInCost == -1){
      this.addDockyardToCost(dockyard);
    }    
    this.projectModel.lineitemList.forEach(item => {
      item.detailsList.forEach(detail => {
        if(detail.dockyardId == dockyard.dockyardId){
          detail.quoteCurrencyid = dockyard.defaultCurrencyId;
          //set quote currency
          let index = this.jobYardQuoteCurrencyList.findIndex(quoteCurrency => {return quoteCurrency.key == detail.jobid+'@'+detail.dockyardId});
          this.jobYardQuoteCurrencyList[index].value = dockyard.defaultCurrencyId;
         this.setQuoteCurrencyForJobDockyardItem(this.jobYardQuoteCurrencyList[index]);
        }
      });
    });
    console.log(this.projectModel.lineitemList);
    console.log(this.jobYardQuoteCurrencyList);
  }
  
  calculateCostInProjectCurrency(itemIndex, detailIndex, detail){
    let currencyConversion = this.projectModel.projectCurrencyConversionList.find(currencyConversion =>{
      return currencyConversion.fromcurrencyid == detail.quoteCurrencyid;
    });
    if(currencyConversion != undefined){
      this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].costProjectCurrency = (this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].unitPrice * currencyConversion.conversionRate) * this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].unitQuantity;
    }else {
      this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].costProjectCurrency = this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].unitPrice * this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].unitQuantity;
    }
  }

  calculateQuoteCurrency(itemIndex, detailIndex, detail){
    this.calculateCostInProjectCurrency(itemIndex, detailIndex, detail);
    this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].costQuoteCurrency = this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].unitPrice * this.projectModel.lineitemList[itemIndex].detailsList[detailIndex].unitQuantity;
    let sum = 0;
    this.projectModel.lineitemList.forEach(item => {
        if(item.jobid == detail.jobid){
          sum += item.detailsList[detailIndex].costQuoteCurrency;
        }
    });

    let index = this.jobYardTotalList.findIndex(total => {return total.key == detail.jobid+'@'+detail.dockyardId});
    if(index === -1){
      let jobYardTotal = {
        key: detail.jobid+'@'+detail.dockyardId,
        value: sum
      };
      this.jobYardTotalList.push(jobYardTotal);
    }else{
      this.jobYardTotalList[index].value = sum;
    }
  }

  //set Quote Currency For JobDockyard Item when change the currency
  setQuoteCurrencyForJobDockyardItem(jobYardCurrency){
    let jobid = jobYardCurrency.key.split('@')[0];
    let yardId = jobYardCurrency.key.split('@')[1];

    for(let itemIndex = 0; itemIndex < this.projectModel.lineitemList.length; itemIndex++){
      if(this.projectModel.lineitemList[itemIndex].jobid == jobid){
        this.projectModel.lineitemList[itemIndex].detailsList.forEach((detail, detailIndex) => {
          if(detail.dockyardId == yardId){
            detail.quoteCurrencyid = +jobYardCurrency.value;
            this.calculateCostInProjectCurrency(itemIndex, detailIndex, detail);
          }
        });
      }
    }
    console.log(this.projectModel.lineitemList);
  }

  getVesselAttachmentForCopy(attachmentType: any) {
    this.selectAttachmentFromVesselService.confirm("Select Vessel Doc", { shipId: this.projectModel.shipid}, 'Attach', 'Cancel', 'lg')
      .then((attachmentList) => {
       this.projectCreationService.attachVesselDocWithJob(attachmentList, this.projectModel.id, attachmentType, 0).subscribe(res => {
        if(attachmentType == 'document'){
          this.projectModel.projectAttachmentList = this.projectModel.projectAttachmentList.concat(res);
        }
       });
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  saveProject(){
    if(this.utilityService.checkEditorContentIsValid(this.projectModel.preamble)){
      this.utilityService.showLoader();
      let toBesaveData = this.prepareDataForSave(Object.assign({},this.projectModel));
      this.utilityService.hideLoader();
      this.projectCreationService.updateProject(toBesaveData).subscribe(res => {
        this.ngOnInit();
      },
      err => {
        this.utilityService.hideLoader();
      });
    }else{
      this.alertDialogService.alert('Alert!', 'Invalid content in "Preamble". Image or any attachment found.', 'OK', 'lg');
    }
    
  }

  prepareDataForSave(model){
    model.estimatedStart = this.utilityService.datePickerObjectTodatetimestamp(model.estimatedStart);
    model.estimatedfinish = this.utilityService.datePickerObjectTodatetimestamp(model.estimatedfinish);
    model.actualStart = this.utilityService.datePickerObjectTodatetimestamp(model.actualStart);
    model.actualfinish = this.utilityService.datePickerObjectTodatetimestamp(model.actualfinish );

    //save only selected Dockyard
    model.projectDockyardList = model.projectDockyardList.filter(yard => yard.isSelected === true);

    //change date for project job list
    model.projectJobList.forEach(job => {
      if (!isNaN(job.approvalLastUpdatedOn.getTime())) {
        job.approvalLastUpdatedOn = job.approvalLastUpdatedOn.getTime();
      }      
    });

    return model;
  }

  loadMoreJob(){
    if((this.limit + 5) > this.jobList.length) {
      this.limit = this.jobList.length;
    }else{
      this.limit += 5;
    }
  }
}
