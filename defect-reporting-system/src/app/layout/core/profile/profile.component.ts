import { Component, OnInit,ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ProfileService } from './profile.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { UserDetail } from '../../../model/userDetail';

@Component({
  selector: 'app-ship-list',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routerTransition()],
  providers: [ProfileService, CommonService]
})
export class ProfileComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_PROFILE;
  id: any;
  userDetail: UserDetail = new UserDetail();
  departmentList: any = [];
  designationList: any = [];
  roleList: any = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private translate:TranslateService,
    private commonService: CommonService,
	  private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private profileService: ProfileService) {
      this.id = JSON.parse(localStorage.getItem('loginInfo'))[0].userId;
    }

  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    loadDataList.push(this.profileService.getUserDetail(this.id));
    loadDataList.push(this.commonService.loadDepartmentList());
    loadDataList.push(this.commonService.loadDesignationList());
    loadDataList.push(this.commonService.loadRoleList());
    forkJoin(loadDataList).subscribe(resList => {
      this.userDetail = resList[0];
      this.departmentList = resList[1];
      this.designationList = resList[2];
      this.roleList = resList[3];
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

}
