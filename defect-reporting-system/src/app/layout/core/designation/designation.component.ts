import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AppConstant } from '../../../shared/constant/appConstant';
import { Designation } from '../../../model/designation'
import { DesignationService } from './designation.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { CustomValidator } from '../../../shared/validation/customValidator';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss'],
  animations: [routerTransition()],
  providers: [DesignationService]
})
export class DesignationComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_DESIGNATION_CREATION;
  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
  designationForm: FormGroup;

  id: any;
  designationModel: Designation;

  constructor(private translate:TranslateService,
    private route: ActivatedRoute,
    private location: Location,
    private utilityService: UtilityService,
    private designationService: DesignationService) {
      this.id = +this.route.snapshot.paramMap.get('id');
     }

  saveDesignation(){
    this.utilityService.showLoader();
    this.formToModelMapping();
    this.designationService.saveOrUpdateDesignation(this.designationModel).subscribe(res => {
      this.utilityService.hideLoader();
      this.location.back();
    },
    err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

  formToModelMapping() {
    for (let key in this.designationForm.value) {      
        this.designationModel[key] = this.designationForm.value[key].trim();
    }
  }

  prepareForm() {
    this.designationForm.patchValue({
      code:    this.designationModel.code,
      designation: this.designationModel.designation,
      description:    this.designationModel.description
    });
    this.utilityService.hideLoader();
  }

  ngOnInit() {
    this.utilityService.showLoader();
    this.designationForm = new FormGroup({
      code:         new FormControl('', [Validators.required, CustomValidator.emptyStringValidator]),
      designation:  new FormControl('', [Validators.required, CustomValidator.emptyStringValidator]),
      description:  new FormControl('')
    });

    if (this.id == 0) {
      this.designationModel = new Designation();
      this.designationModel.designation_id = this.id;
      this.utilityService.hideLoader();
    } else {
      this.designationService.getDesignationDetail(this.id).subscribe(res => {
        this.designationModel = res;
        this.prepareForm();
      },
        err => {
          console.log(err);
          this.utilityService.hideLoader();
        });
    }
  }

}
