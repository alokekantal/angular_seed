import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CustomValidator } from '../../../shared/validation/customValidator';
import { AppConstant } from '../../../shared/constant/appConstant';
import { Department } from '../../../model/department'
import { DepartmentCreationService } from './department-creation.service'
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-department-creation',
  templateUrl: './department-creation.component.html',
  styleUrls: ['./department-creation.component.scss'],
  animations: [routerTransition()],
  providers: [DepartmentCreationService, UtilityService]
})
export class DepartmentCreationComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_DEPARTMENT_CREATION;
  departmentForm: FormGroup;
  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;

  id: any;
  deptModel: Department;

  constructor(private translate:TranslateService,
    private route: ActivatedRoute,
    private location: Location,
    private utilityService: UtilityService,
    private deptCreationService: DepartmentCreationService) {
      this.id = +this.route.snapshot.paramMap.get('id');
     }

  saveDepartment(){
    this.utilityService.showLoader();
    this.formToModelMapping();
    this.deptCreationService.saveOrUpdateDepartment(this.deptModel).subscribe(res => {
      this.utilityService.hideLoader();
      this.location.back();
    },
    err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

  formToModelMapping() {
    for (let key in this.departmentForm.value) {      
        this.deptModel[key] = this.departmentForm.value[key].trim();
    }
  }

  prepareForm() {
    this.departmentForm.patchValue({
      deptName:    this.deptModel.deptName,
      deptMail:    this.deptModel.deptMail
    });
    this.utilityService.hideLoader();
  }
  
  ngOnInit() {
    this.utilityService.showLoader();
    this.departmentForm = new FormGroup({
        deptName:    new FormControl('', [Validators.required, Validators.maxLength(100),CustomValidator.emptyStringValidator]),
        deptMail:    new FormControl('', [Validators.required, CustomValidator.emailValidator, Validators.maxLength(100)])
    });

    if (this.id == 0) {
      this.deptModel = new Department();
      this.utilityService.hideLoader();
    } else {
        this.deptCreationService.getDepartmentDetail(this.id).subscribe(res => {
          this.deptModel = res;
          this.prepareForm();
        },
        err => {
          console.log(err);
          this.utilityService.hideLoader();
        });
    }
  }

}
