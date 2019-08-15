import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { CustomValidator } from '../../../shared/validation/customValidator';
import { AppConstant } from '../../../shared/constant/appConstant';
import { Ship } from '../../../model/ship'
import { ShipCreationService } from './ship-creation.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import { ShipAttachment } from '../../../model/shipAttachment';

@Component({
  selector: 'app-ship-creation',
  templateUrl: './ship-creation.component.html',
  styleUrls: ['./ship-creation.component.scss'],
  animations: [routerTransition()],
  providers: [ShipCreationService, CommonService]
})
export class ShipCreationComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_SHIP_CREATION;
  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  shipMasterForm: FormGroup;
  orgList: any = [];
  vesselList: any = [];
  vesselDocTypeMaster: any = [];
  attachmentModel: ShipAttachment = new ShipAttachment();
  imagePath: any = {
    'excel': 'assets/images/excel-icon.ico',
    'pdf': 'assets/images/pdf.jpg'
  }
  id: any;
  shipModel: Ship = new Ship();

  date1: any;
  date2: any;

  constructor(private translate:TranslateService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private location: Location,
    private utilityService: UtilityService,
    private shipCreationService: ShipCreationService,
    private confirmationDialogService: ConfirmationDialogService,
    private commonService: CommonService) {
      this.id = +this.route.snapshot.paramMap.get('id');
    }

  saveShip(){
    this.utilityService.showLoader();
    this.formToModelMapping();
    this.shipCreationService.saveOrUpdateShip(this.shipModel).subscribe(res => {
      this.utilityService.hideLoader();
      this.location.back();
    },
    err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

  formToModelMapping() {
    for (let key in this.shipMasterForm.value) { 
      if (key == 'keel_laying_date' || key == 'vessel_delivery_date') {
        if(this.shipMasterForm.value[key] != null && this.shipMasterForm.value[key] != ''){
          let date = this.shipMasterForm.value[key].year+"-"+this.shipMasterForm.value[key].month+"-"+this.shipMasterForm.value[key].day;
          this.shipModel[key] = new Date(date).getTime();
        }        
      }else{
        if(typeof this.shipMasterForm.value[key] === 'string')
          this.shipModel[key] = this.shipMasterForm.value[key].trim();
        else
          this.shipModel[key] = this.shipMasterForm.value[key];
      }
    }
  }

  prepareForm() {
    this.shipMasterForm.patchValue({
        v_imo_no:             this.shipModel.v_imo_no,
        name:                 this.shipModel.name,
        mmsi_no:              this.shipModel.mmsi_no,
        call_sign:            this.shipModel.call_sign,
        v_type:               this.shipModel.v_type,
        official_no:          this.shipModel.official_no,
        owner_name:           this.shipModel.owner_name,
        emailID:              this.shipModel.emailID,
        shipClass:            this.shipModel.shipClass,
        class_notations:      this.shipModel.class_notations,
        Classi_Id_No:         this.shipModel.Classi_Id_No,
        flag:                 this.shipModel.flag,
        port_of_registry:     this.shipModel.port_of_registry,
        year_built:           this.shipModel.year_built,
        keel_laying_date:     this.shipModel.keel_laying_date == 0 ? null : this.shipModel.keel_laying_date,
        vessel_delivery_date: this.shipModel.vessel_delivery_date == 0 ? null : this.shipModel.vessel_delivery_date,
        hull_type:            this.shipModel.hull_type,
        length_overall:       this.shipModel.length_overall,
        breadth_MLD:          this.shipModel.breadth_MLD,
        depth:                this.shipModel.depth,
        summer_draft_M:       this.shipModel.summer_draft_M,
        summer_DWT_MT:        this.shipModel.summer_DWT_MT,
        international_GRT:    this.shipModel.international_GRT,
        international_NRT:    this.shipModel.international_NRT,
        life_boat_cap:        this.shipModel.life_boat_cap,
        v_short_name:         this.shipModel.v_short_name,
        email1:               this.shipModel.email1,
        email2:               this.shipModel.email2,
        phoneNo:              this.shipModel.phoneNo,
        phoneNo1:             this.shipModel.phoneNo1,
        phoneNo2:             this.shipModel.phoneNo2,
        shipGroup:             this.shipModel.shipGroup,
        isactive:             this.shipModel.isactive,
        techGroup:            this.shipModel.techGroup
    });
    this.utilityService.hideLoader();
  }


  readURL(file: any, fileIndex: any): void {
    const reader = new FileReader();
    reader.onload = e => this.shipModel.shipAttachmentList[fileIndex]['src'] = reader.result;
    reader.readAsDataURL(file);
  }

  handleFileInput(files: FileList, isImageFile: boolean) {
    this.attachmentModel.shipid = this.shipModel.ship_id;
    for (let i = 0; i < files.length; i++) {
      this.attachmentModel.attachmentName = files[i].name;
      this.attachmentModel['ext'] = this.getFileExt(this.attachmentModel);
      this.shipModel.shipAttachmentList.push(Object.assign({}, this.attachmentModel));
      if (isImageFile) {
        if (files[i].type.indexOf('image') != -1) {
          this.readURL(files[i], this.shipModel.shipAttachmentList.length - 1);
        }        
      }
    }
    if (files.length > 0) {
      this.uploadImageFile(files);
    }
  }

  uploadImageFile(files: any) {
    this.utilityService.showLoader();
    const attachmentUrlList = [];
    for (let i = 0; i < files.length; i++) {
      // tslint:disable-next-line:max-line-length
      attachmentUrlList.push(this.shipCreationService.uploadImageFileBulk(files[i], this.orgId, this.shipModel.ship_id));
    }

    forkJoin(attachmentUrlList).subscribe(res => {
      this.utilityService.hideLoader();
      for (let i = 0; i < res.length; i++) {
        this.shipModel.shipAttachmentList[(this.shipModel.shipAttachmentList.length) - (res.length - i)].relativepath = res[i][0];
      }
      // console.log(this.shipModel);
    }, err => {
      this.utilityService.hideLoader();
    });
  }

  async downloadFile(attachment) {
    this.utilityService.showLoader();
    // tslint:disable-next-line:max-line-length
    const imageData = await this.shipCreationService.downloadDocument(attachment.relativepath, this.orgId, this.shipModel.ship_id);
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

  async getImages() {
    for (let i = 0; i < this.shipModel.shipAttachmentList.length; i++) {
      // tslint:disable-next-line:max-line-length
      if(this.getFileExt(this.shipModel.shipAttachmentList[i]) == 'image'){
        const imageData = await this.shipCreationService.downloadDocument(this.shipModel.shipAttachmentList[i].relativepath, this.orgId, this.shipModel.ship_id);
        const blob = new Blob([imageData], {
          type: 'image/jpg'
        });
        const urlCreator = window.URL;
        this.shipModel.shipAttachmentList[i]['src'] = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
      }      
    }
  }

  deleteFile(index) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete the attachment... ?')
      .then((confirmed) => {
        if (confirmed) {
          this.shipModel.shipAttachmentList.splice(index, 1);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  getFileExt(attachment){
      let ext = attachment.attachmentName.substring(attachment.attachmentName.lastIndexOf('.') + 1).toLowerCase();
      if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
        ext = 'image';
      }else if(ext == 'xls' || ext == 'xlsx') {
        ext = 'excel';
      }else if(ext == 'pdf') {
        ext = 'pdf';
      }
    return ext;
  }

  
  ngOnInit() {
    this.utilityService.showLoader();
    this.shipMasterForm = new FormGroup({
        v_imo_no:             new FormControl('', [Validators.required]),
        name:                 new FormControl('', [Validators.required, CustomValidator.emptyStringValidator]),        
        mmsi_no:              new FormControl(''),
        call_sign:            new FormControl(''),
        v_type:               new FormControl('a'),
        official_no:          new FormControl(''),
        owner_name:           new FormControl(''),
        emailID:              new FormControl('',[CustomValidator.emailValidator]),
        shipClass:            new FormControl(''),
        class_notations:      new FormControl(''),
        Classi_Id_No:         new FormControl(''),
        flag:                 new FormControl(''),
        port_of_registry:     new FormControl(''),
        year_built:           new FormControl(''),
        keel_laying_date:     new FormControl(),
        vessel_delivery_date: new FormControl(),
        hull_type:            new FormControl(''),
        length_overall:       new FormControl(''),
        breadth_MLD:          new FormControl(''),
        depth:                new FormControl(''),
        summer_draft_M:       new FormControl(''),
        summer_DWT_MT:        new FormControl(''),
        international_GRT:    new FormControl(''),
        international_NRT:    new FormControl(''),
        life_boat_cap:        new FormControl(''),
        v_short_name:         new FormControl(''),
        email1:               new FormControl(null,[CustomValidator.emailValidator]),
        email2:               new FormControl(null, [CustomValidator.emailValidator]),
        phoneNo:              new FormControl(''),
        phoneNo1:             new FormControl(''),
        phoneNo2:             new FormControl(''),
        shipGroup:            new FormControl(''),
        isactive:             new FormControl(this.shipModel.isactive),
        techGroup:            new FormControl(''),  
    });

    let loadDataList = [];
    loadDataList.push(this.commonService.getMasterVesselTypeList());
    loadDataList.push(this.commonService.loadOrganizationList());
    loadDataList.push(this.commonService.loadOrganizationVesselDocTypeList());

    if (this.id == 0) {
      this.shipModel = new Ship();
      this.utilityService.hideLoader();
    } else {
      loadDataList.push(this.shipCreationService.getShipDetail(this.id));
    }

    forkJoin(loadDataList).subscribe(resList => {
      this.vesselList = resList[0];
      this.orgList = resList[1];
      this.vesselDocTypeMaster = resList[2];
      if (this.id != 0) {
          this.shipModel = resList[3];
          if (this.shipModel.shipAttachmentList == null) {
            this.shipModel.shipAttachmentList = [];
          }
          //get ext
          this.shipModel.shipAttachmentList.forEach(attachment => {
            if(attachment.vesselDocTypeId == null || attachment.vesselDocTypeId == 0){
              attachment.vesselDocTypeId = '0';
            }
            attachment['ext'] = this.getFileExt(attachment);            
          });
          this.getImages();
          this.prepareForm();
      }
        for (let key in this.shipModel) { 
          if (key == 'keel_laying_date' || key == 'vessel_delivery_date') {
            if(this.shipModel[key] != null && this.shipModel[key] != ''){
              var date = new Date(this.shipModel[key]);
              this.shipModel[key] = {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
              }              
            }        
          }
        }
        //console.log(this.shipModel);
        
        //console.log(this.shipModel);
        this.utilityService.hideLoader(); 
    });
  }

}
