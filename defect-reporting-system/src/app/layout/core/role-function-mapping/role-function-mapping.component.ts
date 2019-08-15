import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';

import { RoleFunction } from '../../../model/roleFunction';

import { AppConstant } from '../../../shared/constant/appConstant';
import { RoleFunctionMappingService } from './role-function-mapping.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service'

@Component({
  selector: 'app-role-function-mapping',
  templateUrl: './role-function-mapping.component.html',
  styleUrls: ['./role-function-mapping.component.scss'],
  animations: [routerTransition()],
  providers: [RoleFunctionMappingService, CommonService, UtilityService]
})
export class RoleFunctionMappingComponent implements OnInit {
    BREADCRUMB: any = AppConstant.BREADCRUMB_ROLE_MAPPING;
    orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
    functionList = [];
    assignedFunctionList = [];
    selectedItems = [];
    departmentList: any = [];
    dropdownSettings = {};

    roleMaqppinfFormForm: FormGroup;
    id: any;
    roleFunctionModel: any = {};
    constructor(private translate:TranslateService,
        private route: ActivatedRoute,
        private location: Location,
        private roleFunctionMappingService: RoleFunctionMappingService,
        private commonService: CommonService,
        private utilityService: UtilityService) { 
          this.id = +this.route.snapshot.paramMap.get('id');
    }

    saveRoleMapping() {
      this.utilityService.showLoader();
        this.formToModelMapping();
        this.roleFunctionModel.roleId = this.id;
        let data = Object.assign({}, this.roleFunctionModel);
        delete data.deptIdList;
        this.roleFunctionMappingService.saveOrUpdateRoleFunctionMapping(data).subscribe(res => {
          this.utilityService.hideLoader();
          this.location.back();
        },
        err => {
          console.log(err);
          this.utilityService.hideLoader();
        });
      }
    
      formToModelMapping() {
        for (let key in this.roleMaqppinfFormForm.value) {
          if (key == 'funcIdList') {
            this.roleFunctionModel[key] =  this.assignedFunctionList.map(a => a.function_id);            
          } else {
            this.roleFunctionModel[key] = this.roleMaqppinfFormForm.value[key];
          }
        }
        //console.log(this.roleFunctionModel);
      }
    
      prepareForm() {
        this.roleMaqppinfFormForm.patchValue({
            funcIdList: this.roleFunctionModel.funcIdList,
        });
      }

      assignFunction(){
          let functionList = this.roleMaqppinfFormForm.value.functionListMaster;
          functionList.forEach(functionId => {
            let funcObj = this.functionList.find(func => func.function_id == functionId);
            let index = this.functionList.indexOf(funcObj);
            this.functionList.splice(index, 1);
            this.assignedFunctionList.push(funcObj);                    
        }); 
        this.roleMaqppinfFormForm.patchValue({
          functionListMaster: ''
        });
      }

      unassignFunction(){
        let functionList = this.roleMaqppinfFormForm.value.funcIdList;
          functionList.forEach(functionId => {
            let funcObj = this.assignedFunctionList.find(func => func.function_id == functionId);
            let index = this.assignedFunctionList.indexOf(funcObj);
            this.assignedFunctionList.splice(index, 1);
            this.functionList.push(funcObj);                    
        }); 
        this.roleMaqppinfFormForm.patchValue({
          funcIdList: ''
        });
      }

    ngOnInit(){
        this.utilityService.showLoader();
        this.roleMaqppinfFormForm = new FormGroup({
            funcIdList: new FormControl('', Validators.required),
            functionListMaster: new FormControl('', Validators.required)
        });

        let urlList = [];
        urlList.push(this.roleFunctionMappingService.getRoleDetail(this.id));        
        urlList.push(this.commonService.loadFunctionList());
        urlList.push(this.commonService.loadDepartmentList());

        forkJoin(urlList).subscribe(res => {
            this.roleFunctionModel = res[0];             
            this.functionList = res[1]; //this.utilityService.prepareDataForRole(res[1], 'function_id', 'functionKey');
            this.departmentList = res[2];
            if(this.roleFunctionModel.funcIdList != null){
              this.roleFunctionModel.funcIdList.forEach(funcId => {
                let funcObj = this.functionList.find(func => funcId === func.function_id);
                let index = this.functionList.indexOf(funcObj);
                this.functionList.splice(index, 1);
                this.assignedFunctionList.push(funcObj);  
              });
            }
            // if(this.roleFunctionModel.funcIdList != null){
            //   this.selectedItems = this.functionList.filter(menu => {
            //     return this.roleFunctionModel.funcIdList.indexOf(menu.id) >-1 ? menu: null
            //   });
            // }
            this.utilityService.hideLoader();
        }, error => {
          this.utilityService.hideLoader();
        });
        // this.selectedItems = [];
        // this.dropdownSettings = { 
        //                           singleSelection: false, 
        //                           text:"Select Function",
        //                           selectAllText:'Select All',
        //                           unSelectAllText:'UnSelect All',
        //                           enableSearchFilter: true,
        //                           classes:"myclass custom-class",
        //                           maxHeight: 200
        //                         };            
    }
    // onItemSelect(item:any){
    //     console.log(item);
    //     console.log(this.selectedItems);
    // }
    // OnItemDeSelect(item:any){
    //     console.log(item);
    //     console.log(this.selectedItems);
    // }
    // onSelectAll(items: any){
    //     console.log(items);
    // }
    // onDeSelectAll(items: any){
    //     console.log(items);
    // }
}
