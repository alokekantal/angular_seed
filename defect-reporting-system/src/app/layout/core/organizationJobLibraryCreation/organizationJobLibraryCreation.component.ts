import { Component, OnInit, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';

import { CustomValidator } from '../../../shared/validation/customValidator';
import { AlertDialogService } from '../../../alert-dialog/alert-dialog.service';
import { AppConstant } from '../../../shared/constant/appConstant';
import { OrganizationjobLibraryCreationService } from './organizationJobLibraryCreation.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { CommonService } from '../../../shared/services/common.service';
import { SelectComponentForApplicationJobService } from '../../../selectComponentForApplicationJob/selectComponentForApplicationJob.service';
import { Job } from '../../../model/job';
import { ApplicationComponent } from '../../../model/applicationComponemt';
import { MeterialDetail } from '../../../model/meterialDetail';
import { OrganizationComponemtListService } from '../organizationComponemtList/organizationComponemtList.service';

import * as _ from 'lodash';

@Component({
  selector: 'job-library-creation',
  templateUrl: './organizationjobLibraryCreation.component.html',
  styleUrls: ['./organizationjobLibraryCreation.component.scss'],
  animations: [routerTransition()],
  providers: [OrganizationjobLibraryCreationService, OrganizationComponemtListService, UtilityService, CommonService]
})
export class OrganizationJobLibraryCreationComponent implements OnInit {
  checkbocCollapse = {
    isCollapsedToBeInclude: true,
    isCollapsedMeterials: true,
    isCollapsedTheWorkToBeSurvedAlsoBy: true
  };
  BREADCRUMB: any = AppConstant.BREADCRUMB_ORGANIZATION_JOB_LIBRARY_CREATION;
  jobForm: FormGroup;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  checkboxList: any = {};
  id: any;
  jobModel: Job = new Job();
  selectedComponent: any = new ApplicationComponent();
  myTree: any = [];
  config: object;
  vesselList: any = [];
  jobDataForSave = null;

  selectedItems = [];  
  dropdownSettings = {
    singleSelection: false,
    text: "Vessel Type",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: "myclass custom-class",
    maxHeight: 200
  };
  vesselTypeList: any = [];
  options: any;
  constructor(private translate: TranslateService,
    private route: ActivatedRoute,
    private selectComponentForApplicationJobService: SelectComponentForApplicationJobService,
    private organizationComponemtListService: OrganizationComponemtListService,
    private location: Location,
    private utilityService: UtilityService,
    private commonService: CommonService,
    private alertDialogService: AlertDialogService,
    private organizationjobLibraryCreationService: OrganizationjobLibraryCreationService) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(queryParams => {
      this.jobModel.shipid = queryParams.shipId;
      this.jobModel.projectid = queryParams.projectId;
    });

    this.options = AppConstant.editorConfig;
  }

  saveJob() {
    if(this.utilityService.checkEditorContentIsValid(this.jobModel.detailedSpecification)){
      this.utilityService.showLoader();
      this.jobDataForSave = Object.assign({}, this.jobModel);
      this.formToModelMapping();
      //delete  this.jobDataForSave.jobMaterialDetailsList;
      this.organizationjobLibraryCreationService.saveOrUpdateJob(this.jobDataForSave).subscribe(res => {
        this.utilityService.hideLoader();
        this.location.back();
      },
        err => {
          console.log(err);
          this.utilityService.hideLoader();
        });
    }else{
      this.alertDialogService.alert('Alert!', 'Invalid content in "Details Job Desc". Image or any attachment found.', 'OK', 'lg');
    }
  }

  formToModelMapping() {
    for (let key in this.jobForm.value) {
      if (key === 'jobdate') {
        if (this.jobDataForSave.jobdate != null && this.jobDataForSave.jobdate !== '') {
          const date = this.jobDataForSave.jobdate.year + '-' + this.jobDataForSave.jobdate.month + '-' + this.jobDataForSave.jobdate.day;
          this.jobDataForSave.jobdate = new Date(date).getTime();
        }
      } else if (key == 'vesselType') {
        if(this.jobForm.value[key] !== null)
          this.jobDataForSave[key] = this.jobForm.value[key].map(a => a.id).join();
      } else {
        if (typeof this.jobForm.value[key] === 'string')
          this.jobDataForSave[key] = this.jobForm.value[key].trim();
        else
          this.jobDataForSave[key] = this.jobForm.value[key];
      }
    }
    let checkBoxes = []
    for (let key in this.checkboxList) {
      this.checkboxList[key].forEach(element => {
        if (element.isSelected) {
          checkBoxes.push(element.id);
        }
      });
    }
    this.jobDataForSave.checkboxes = checkBoxes.join();
  }

  prepareForm() {
    for (let key in this.checkboxList) {
      this.checkboxList[key].forEach(element => {
        if (this.jobModel.checkboxes != null) {
          let index = this.jobModel.checkboxes.split(',').indexOf('' + element.id);
          if (index != -1) {
            element.isSelected = true;
          }
        }
      });
    }

    if (this.jobModel.jobdate) {
      const date = new Date(this.jobModel.jobdate);
      this.jobModel.jobdate = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };
    }

    this.jobForm.patchValue({
      description: this.jobModel.description,
      jobdate: this.jobModel.jobdate == 0 ? null : this.jobModel.jobdate,
      accountno: this.jobModel.accountno,
      specification: this.jobModel.specification,
      location: this.jobModel.location,
      detailedSpecification: this.jobModel.detailedSpecification,
      totalArea: this.jobModel.totalArea,

      make: this.jobModel.make,
      model: this.jobModel.model,
      makeModelDescription: this.jobModel.makeModelDescription,
      equipment: this.jobModel.equipment,
      vesselType: this.jobModel.vesselType,
      vesselAge: this.jobModel.vesselAge
    });
    this.utilityService.hideLoader();
  }

  selectComponent() {
    this.selectComponentForApplicationJobService.confirm('Select Component', { tree: this.myTree }, 'Select', 'Cancel', 'lg')
      .then((component) => {
        if (component != false && component != null) {
          console.log(component);
          this.selectedComponent = component;
          this.jobModel.shipcomponentid = this.selectedComponent.id;
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  focusOnMeterialRow(index) {
    if (index !== 0 && (this.jobModel.jobMaterialDetailsList[index].make === '' || this.jobModel.jobMaterialDetailsList[index].make === null)
      && (this.jobModel.jobMaterialDetailsList[index].model === '' || this.jobModel.jobMaterialDetailsList[index].model === null)
      && (this.jobModel.jobMaterialDetailsList[index].uom === '' || this.jobModel.jobMaterialDetailsList[index].uom === null)
      && (this.jobModel.jobMaterialDetailsList[index].drawingNo === '' || this.jobModel.jobMaterialDetailsList[index].drawingNo === null)) {
      let meterialDetailOfPreviousRow = this.jobModel.jobMaterialDetailsList[index - 1];
      this.jobModel.jobMaterialDetailsList[index].make = meterialDetailOfPreviousRow.make;
      this.jobModel.jobMaterialDetailsList[index].model = meterialDetailOfPreviousRow.model;
      this.jobModel.jobMaterialDetailsList[index].uom = meterialDetailOfPreviousRow.uom;
      this.jobModel.jobMaterialDetailsList[index].drawingNo = meterialDetailOfPreviousRow.drawingNo;
    }
  }

  addRowInMeterialList() {
    for (let i = 1; i <= 10; i++) {
      this.jobModel.jobMaterialDetailsList.push(new MeterialDetail());
    }
    let sequence = 1;
    this.jobModel.jobMaterialDetailsList.forEach(material => {
      if (material.isactive == 1) {
        material.index = sequence;
        sequence++;
      }
    });
  }

  deleteRowInMeterialList(index) {
    if (this.jobModel.jobMaterialDetailsList[index].id == 0) {
      this.jobModel.jobMaterialDetailsList.splice(index, 1);
    } else {
      this.jobModel.jobMaterialDetailsList[index].isactive = 0;
    }
    let sequence = 1;
    this.jobModel.jobMaterialDetailsList.forEach(material => {
      if (material.isactive == 1) {
        material.index = sequence;
        sequence++;
      }
    });
  }

  ngOnInit() {
    this.utilityService.showLoader();
    this.jobForm = new FormGroup({
      description: new FormControl('', [Validators.required, Validators.maxLength(1000), CustomValidator.emptyStringValidator]),
      jobdate: new FormControl('', [Validators.maxLength(100)]),
      accountno: new FormControl('', [Validators.maxLength(100)]),
      specification: new FormControl('', [Validators.maxLength(100)]),
      location: new FormControl('', [Validators.maxLength(100)]),
      totalArea: new FormControl('', [Validators.maxLength(100)]),

      make: new FormControl('', [Validators.maxLength(100)]),
      model: new FormControl('', [Validators.maxLength(100)]),
      makeModelDescription: new FormControl('', [Validators.maxLength(300)]),
      equipment: new FormControl('', [Validators.maxLength(100)]),
      vesselType: new FormControl('', [Validators.maxLength(100)]),
      vesselAge: new FormControl(null, [CustomValidator.vesselAgeValidator])
    });
    this.myTree = this.utilityService.getComponentTree();
    let PromiseList = [];
    PromiseList.push(this.commonService.loadCheckboxesList());
    PromiseList.push(this.commonService.getMasterVesselTypeList());
    if (this.id == 0) {
      this.utilityService.hideLoader();
    } else {
      PromiseList.push(this.organizationjobLibraryCreationService.loadJobDetails(this.id));
    }

    forkJoin(PromiseList).subscribe(res => {
      this.checkboxList = res[0];
      this.vesselList = res[1];
      this.vesselTypeList = this.utilityService.prepareDataForVessel(this.vesselList, 'id', 'description');
      this.checkboxList = _.mapValues(_.groupBy(this.checkboxList, 'key'), clist => clist.map(group => _.omit(group, 'key')));
      this.config = this.utilityService.configComponemtList();
      if (this.id != 0) {
        this.jobModel = res[2];
        this.prepareForm();
        if(this.jobModel.vesselType != null){
          this.selectedItems = this.vesselTypeList.filter(role => {
            return this.jobModel.vesselType.indexOf(role.id) >-1 ? role: null
          });
        } 
      }
      let component = this.utilityService.getComponentLinear().find(component => component.id == this.jobModel.shipcomponentid);
      this.selectedComponent = component == undefined ? new ApplicationComponent() : component;

      // merial setup start 
      //this.jobModel['jobMaterialDetailsList'] = []; //have to delete        
      if (this.jobModel.jobMaterialDetailsList === null) {
        this.jobModel.jobMaterialDetailsList = [];
      }
      if (this.jobModel.jobMaterialDetailsList.length < 10) {
        for (let i = this.jobModel.jobMaterialDetailsList.length; i < 10; i++) {
          this.jobModel.jobMaterialDetailsList.push(new MeterialDetail());
        }
      }
      let index = 1;
      this.jobModel.jobMaterialDetailsList.forEach(material => {
        material.index = index;
        index++;
      });
      // merial setup end
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }
}
