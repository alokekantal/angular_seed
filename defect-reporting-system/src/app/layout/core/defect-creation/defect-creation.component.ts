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
import { Defect } from '../../../model/defect'
import { DefectCreationService } from './defect-creation.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-ship-creation',
  templateUrl: './defect-creation.component.html',
  styleUrls: ['./defect-creation.component.scss'],
  animations: [routerTransition()],
  providers: [DefectCreationService, CommonService]
})
export class DefectCreationComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_DEFECT_CREATION;
  searchDropdownConfig: any = AppConstant.searchDropdownConfig;
  options = AppConstant.editorConfig;

  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  defectForm: FormGroup;
  id: any;
  defectModel: Defect = new Defect();

  constructor(private translate:TranslateService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private location: Location,
    private utilityService: UtilityService,
    private defectCreationService: DefectCreationService,
    private confirmationDialogService: ConfirmationDialogService,
    private commonService: CommonService) {
      this.id = +this.route.snapshot.paramMap.get('id');
    }

  saveDifect(){
    this.utilityService.showLoader();
    this.formToModelMapping();
    this.defectCreationService.saveOrUpdateShip(this.defectModel).subscribe(res => {
      this.utilityService.hideLoader();
      this.location.back();
    },
    err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

  formToModelMapping() {
    for (let key in this.defectForm.value) { 
      if (key == 'raisedOn' || key == 'target') {
        if(this.defectForm.value[key] != null && this.defectForm.value[key] != ''){
          let date = this.defectForm.value[key].year+"-"+this.defectForm.value[key].month+"-"+this.defectForm.value[key].day;
          this.defectModel[key] = new Date(date).getTime();
        }        
      }else{
        if(typeof this.defectForm.value[key] === 'string')
          this.defectModel[key] = this.defectForm.value[key].trim();
        else
          this.defectModel[key] = this.defectForm.value[key];
      }
    }
  }

  prepareForm() {
    this.defectForm.patchValue({
      shipName:             this.defectModel.shipName,
      defId:                this.defectModel.defId,
      component:            this.defectModel.component,
      raisedOn:             this.defectModel.raisedOn,
      severity:             this.defectModel.severity,
      defectDetail:         this.defectModel.defectDetail,
      raisedBy:             this.defectModel.raisedBy,
      system:               this.defectModel.system,
      repairCriteria:       this.defectModel.repairCriteria,
      status:               this.defectModel.status,
      target:               this.defectModel.targetDate,
    });
    this.utilityService.hideLoader();
  }

  
  ngOnInit() {
    this.utilityService.showLoader();
    this.defectForm = new FormGroup({
      shipName:             new FormControl('', [Validators.required]),
      defId:                new FormControl(''),
      component:            new FormControl(''),
      raisedOn:             new FormControl('', [Validators.required]),
      severity:             new FormControl('', [Validators.required]),
      defectDetail:         new FormControl('', [Validators.required]),
      raisedBy:             new FormControl('', [Validators.required]),
      system:               new FormControl(''),
      repairCriteria:       new FormControl(''),
      status:               new FormControl('', [Validators.required]),
      targetDate:               new FormControl('')
      // v_imo_no:             new FormControl('', [Validators.required]),
      // name:                 new FormControl('', [Validators.required, CustomValidator.emptyStringValidator]),        
    });

    let loadDataList = [];
    loadDataList.push();

    if (this.id == 0) {
      this.defectModel = new Defect();
      this.utilityService.hideLoader();
    } else {
      loadDataList.push(this.defectCreationService.getShipDetail(this.id));
    }

    forkJoin(loadDataList).subscribe(resList => {
      
        for (let key in this.defectModel) { 
          if (key == 'raisedOn' || key == 'target') {
            if(this.defectModel[key] != null){
              var date = new Date(this.defectModel[key]);
              this.defectModel[key] = {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
              }              
            }        
          }
        }
        //console.log(this.defectModel);
        this.prepareForm();
        //console.log(this.defectModel);
        this.utilityService.hideLoader(); 
    });
  }
}
