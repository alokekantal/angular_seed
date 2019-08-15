import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin} from 'rxjs';

import { CustomValidator } from '../../../shared/validation/customValidator';
import { AppConstant } from '../../../shared/constant/appConstant';
import { UserDetail } from '../../../model/userDetail'

import { UserCreationService } from './user-creation.service'
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService} from '../../../shared/services/utility.service';

@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss'],
  animations: [routerTransition()],
  providers: [UserCreationService, CommonService, UtilityService]
})
export class UserCreationComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_USER_CREATION;
  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
  userForm: FormGroup;
  departmentList: any = [];
  designationList: any = [];
  roleList: any = [];
  reportingToUserList: any = [];
  shipList: any = [];
  isUserCodeExist = false;
  isPasswordMatch: boolean = true;
  selectedItems = [];  
  dropdownSettings = {};
  id: any;
  userModel: UserDetail = new UserDetail();

  constructor(private route: ActivatedRoute,
    private location: Location,
    private userCreationService: UserCreationService,
    private commonService: CommonService,
    private utilityService: UtilityService) {
    this.id = +this.route.snapshot.paramMap.get('id');
    //console.log(this.id);
  }

  saveUser() {
    this.utilityService.showLoader();  
    this.formToModelMapping();
    this.userCreationService.saveOrUpdate(this.userModel).subscribe(res => {
      this.utilityService.hideLoader();  
      this.location.back();
    },
    err => {
      console.log(err);
      this.utilityService.hideLoader();  
    });
  }

  formToModelMapping() {
    for (let key in this.userForm.value) {
      if (key == 'userType' || key == 'shipName' || key == 'currentReportTo' || key == 'deptId' || key == 'designationId') {
        this.userModel[key] = +this.userForm.value[key];
      } else if (key == 'shipid') {
        if (this.userForm.value[key] == '') {
          this.userModel[key] = null;
        }else{
          this.userModel[key] = +this.userForm.value[key];
        }
      } else if (key == 'roleList') {
        this.userModel[key] = this.userForm.value[key].map(a => a.id);
      } else {
        if(typeof this.userForm.value[key] === 'string')
          this.userModel[key] = this.userForm.value[key].trim();
        else
          this.userModel[key] = this.userForm.value[key];
      }
    }
    //console.log(this.userModel);
  }

  prepareForm() {
    this.userForm.patchValue({
      userType: this.userModel.userType,
      shipid: this.userModel.shipid,
      userCode: this.userModel.userCode,
      passcode: this.userModel.passcode,
      firstname: this.userModel.firstname,
      lastname: this.userModel.lastname,
      roleList:   this.userModel.roleList,
      phonenumber: this.userModel.phonenumber,
      personalMailid: this.userModel.personalMailid,
      deptId: this.userModel.deptId,
      designationId: this.userModel.designationId,
      email1: this.userModel.email1,
      isactive: this.userModel.isactive
    });
  }

  checkLoginCodeExists(loginCode){
    this.userCreationService.checkLoginCodeExists(loginCode).subscribe(res =>{
      if(res!=null){
        this.isUserCodeExist = true;
      }else{
        this.isUserCodeExist = false;
      }
    }, error =>{
      console.log(error);
    });
  }

  onBlurCPassword(){
      if(this.userForm.value.passcode != this.userForm.value.cPassword){
          this.isPasswordMatch = false;
      }else{
          this.isPasswordMatch = true;
      }
  }

  capital(userCode){
    this.userForm.controls['userCode'].setValue(userCode.trim().toUpperCase()); 
    //console.log(this.userForm.value);   
  }

  ngOnInit() {
    this.utilityService.showLoader();  
    this.userForm = new FormGroup({
      userType: new FormControl(''),
      shipid: new FormControl(''),
      userCode: new FormControl({value: '', disabled: this.id != -1}, [Validators.required]),
      passcode: new FormControl('', [Validators.required, Validators.minLength(8)]),
      firstname: new FormControl('', [Validators.required, CustomValidator.emptyStringValidator]),
      lastname: new FormControl('', [Validators.required, CustomValidator.emptyStringValidator]),
      deptId: new FormControl(''),
      phonenumber: new FormControl('', [CustomValidator.phoneValidator]),
      personalMailid: new FormControl('', [CustomValidator.emailValidator]),      
      designationId: new FormControl(''),
      roleList: new FormControl('', [Validators.required]),
      cPassword: new FormControl(''),
      email1: new FormControl(null,[CustomValidator.emailValidator]),
      isactive: new FormControl(this.userModel.isactive)
    });

    let loadDataList = [];
    loadDataList.push(this.commonService.loadDepartmentList());
    loadDataList.push(this.commonService.loadDesignationList());
    loadDataList.push(this.commonService.loadRoleList());
    loadDataList.push(this.commonService.loadUserList());
    loadDataList.push(this.commonService.loadShipList());

    if (this.id == -1) {
      this.userModel = new UserDetail();
      //this.utilityService.hideLoader();  
    } else {
      loadDataList.push(this.userCreationService.getUserDetail(this.id));
    }   

    forkJoin(loadDataList).subscribe(resList => {
        this.departmentList = resList[0];
        this.designationList = resList[1];
        this.roleList = this.utilityService.prepareDataForRole(resList[2], 'role_id', 'description');
        this.shipList = resList[4];
        if (this.id != -1) {
          this.userModel = resList[5];
          this.prepareForm();      
          if(this.userModel.roleList != null){
            this.selectedItems = this.roleList.filter(role => {
              return this.userModel.roleList.indexOf(role.id) >-1 ? role: null
            });
          }     
        }
        this.utilityService.hideLoader();  
    }); 
     
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Role",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      maxHeight: 200
    }; 
  }

  onItemSelect(item: any) {
    //console.log(item);
    //console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    //console.log(item);
    //console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  onDeSelectAll(items: any) {
    //console.log(items);
  }

}
