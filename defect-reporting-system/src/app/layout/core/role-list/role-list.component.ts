import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin} from 'rxjs';

import { AppConstant } from '../../../shared/constant/appConstant';
import { RoleListService } from './role-list.service'
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService} from '../../../shared/services/utility.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  animations: [routerTransition()],
  providers: [RoleListService, CommonService, UtilityService]
})
export class RoleListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_ROLE_LIST;
  searchText: any = '';
  roleList: any = [];
  departmentList: any = [];
  functionList: any =[];
  constructor(private translate:  TranslateService,
              private router: Router,
              private utilityService: UtilityService,
              private roleListService: RoleListService,
              private commonService: CommonService) { }

  roleFunctionMapping(id){
    this.router.navigate(['/core/role-function-mapping/'+id]);	
  }

  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];    
    loadDataList.push(this.commonService.loadDepartmentList());
    loadDataList.push(this.roleListService.loadRoleList());
    loadDataList.push(this.commonService.loadFunctionList());

    forkJoin(loadDataList).subscribe(resList => {
      this.departmentList = resList[0];
      this.roleList = resList[1];
      this.functionList = resList[2];
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

}
