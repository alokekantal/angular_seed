import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AppConstant } from '../../../shared/constant/appConstant';
import { Role } from '../../../model/Role';

import { RoleCreationService } from './role-creation.service';
import { CommonService } from '../../../shared/services/common.service'
import { UtilityService} from '../../../shared/services/utility.service';
import { CustomValidator } from '../../../shared/validation/customValidator';


@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
  animations: [routerTransition()],
  providers: [RoleCreationService, CommonService, UtilityService]
})
export class CreateRoleComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_ROLE_CREATION;
  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
  departmentList = [];
  selectedItems = [];
  dropdownSettings = {};

  roleForm: FormGroup;
  id: any;
  roleModel: Role;

  constructor(private translate:TranslateService,
    private route: ActivatedRoute,
    private location: Location,
    private roleCreationService: RoleCreationService,
    private commonService: CommonService,
    private utilityService: UtilityService) { 
      this.id = +this.route.snapshot.paramMap.get('id');
    }

  saveRole(){
    this.utilityService.showLoader();
    this.formToModelMapping();
    this.roleModel.role_id = this.id;
    this.roleCreationService.saveOrUpdateRole(this.roleModel).subscribe(res => {
      this.utilityService.hideLoader();
      this.location.back();
    },
    err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

  formToModelMapping() {
    for (let key in this.roleForm.value) {      
      if (key == 'deptIdList') {
        this.roleModel[key] = this.roleForm.value[key].map(a => a.id); //+this.roleForm.value[key];
      }else{
        this.roleModel[key] = this.roleForm.value[key].trim();
      }      
    }
  }

  prepareForm() {
    this.roleForm.patchValue({
        code:    this.roleModel.code,
        description:    this.roleModel.description,
        deptIdList:    this.roleModel.deptIdList,
    });
  }

  loadDeptList(){
    this.commonService.loadDepartmentList().subscribe(res => {
        this.departmentList = this.utilityService.prepareDataForRole(res, 'dept_id', 'deptName');
        if(this.roleModel.deptIdList != null){
          this.selectedItems = this.departmentList.filter(dept => {
            return this.roleModel.deptIdList.indexOf(dept.id) >-1 ? dept: null
          });
        }        
        this.utilityService.hideLoader();
    }, err => {
        console.log(err);
        this.utilityService.hideLoader();
    });  
  }

  ngOnInit() {
      this.utilityService.showLoader();  
      this.roleForm = new FormGroup({
          code:       new FormControl('', [Validators.required, CustomValidator.emptyStringValidator]),
          description:new FormControl('', [Validators.required,  CustomValidator.emptyStringValidator]),
          deptIdList:     new FormControl('', [Validators.required])
      });

      if (this.id == 0) {
        this.roleModel = new Role();
        this.loadDeptList();
      } else {
        this.roleCreationService.getRoleDetail(this.id).subscribe(res => {
          this.roleModel = res;
          this.prepareForm();
          this.loadDeptList();
        },
          err => {
            console.log(err);
          });
      } 

    //multi select configuration
    // this.selectedItems = [{id: 0, itemName: "Application_Dept"},
    // {id: 2, itemName: "Department  1 update"}]
    this.dropdownSettings = { 
                              singleSelection: false, 
                              text:"Select Department",
                              selectAllText:'Select All',
                              unSelectAllText:'UnSelect All',
                              enableSearchFilter: true,
                              classes:"myclass custom-class",
                              maxHeight: 200
                            }; 
  }

  onItemSelect(item:any){
    //console.log(item);
    //console.log(this.selectedItems);
  }
  OnItemDeSelect(item:any){
      //console.log(item);
     //console.log(this.selectedItems);
  }
  onSelectAll(items: any){
      //console.log(items);
  }
  onDeSelectAll(items: any){
      //console.log(items);
  }

}
