import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ApplicationVesselDocType } from '../../../model/applicationVesselDocType';
import { OrganizationVesselDocType } from '../../../model/OrganizationVesselDocType';
import { AppConstant } from '../../../shared/constant/appConstant';
import { VesselDocTypeListService } from './vesselDocTypeList.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { AlertDialogService } from '../../../alert-dialog/alert-dialog.service';

@Component({
  selector: 'app-designation-list',
  templateUrl: './vesselDocTypeList.component.html',
  styleUrls: ['./vesselDocTypeList.component.scss'],
  animations: [routerTransition()],
  providers: [VesselDocTypeListService, UtilityService, CommonService]
})
export class VesselDocTypeListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_VESSEL_DOC_TYPE_LIST;
  searchText: any = '';
  orgId: any = null;
  vesselDocTypeList: any = [];
  errorMsg: any = '';
  constructor(private translate:TranslateService,
              private toastrService: ToastrService,
              private alertDialogService: AlertDialogService,
              private utilityService: UtilityService,
              private commonService: CommonService,
              private vesselDocTypeListService: VesselDocTypeListService) {
      this.orgId = this.utilityService.getOrgInfo().org_id;
  }

  validateDocType(){
    let row = 1;
    for(let i = 1; i <= this.vesselDocTypeList.length; i++){
      if(this.vesselDocTypeList[i - 1].isactive == 1){
        if(this.vesselDocTypeList[i - 1].vesselDocDescription.trim().length == 0){
          this.errorMsg = `${this.errorMsg} <li>'Vessel Doc Type' can not blank in row ${row}</li>`;         
        }
        row++;
      }
      
    }     
  }

  saveVesselDocType(){
    this.validateDocType();
    if(this.errorMsg.length > 0){
      this.errorMsg = `<ul> ${this.errorMsg} </ul>`;
      this.alertDialogService.alert('Error!', this.errorMsg, 'OK', 'lg')
      .then((alert) => this.errorMsg = '')
      .catch(() => this.errorMsg = '');
    }else{
      if(this.orgId == 0){
        this.vesselDocTypeListService.saveApplicationVesselDocTypeList(this.vesselDocTypeList).subscribe(res => {
          this.toastrService.success('Data save successfully!');
          this.ngOnInit();
        }, err => {
          console.log(err);
          this.utilityService.hideLoader();
        });
      }else{
        this.vesselDocTypeListService.saveOrganizationVesselDocTypeList(this.vesselDocTypeList).subscribe(res => {
          this.toastrService.success('Data save successfully!');
          this.ngOnInit();
        }, err => {
          console.log(err);
          this.utilityService.hideLoader();
        });
      }
    }    
  }

  addVesselDocType(){
    if(this.orgId == 0){
      this.vesselDocTypeList.push(new ApplicationVesselDocType());
    } else {
      this.vesselDocTypeList.push(new OrganizationVesselDocType());
    }
  }
  deleteDocType(index){
    this.vesselDocTypeList[index].isactive = 0;
  }
  ngOnInit() {
    this.utilityService.showLoader();
    let promiseList = [];
    if(this.orgId == 0){
      promiseList.push(this.vesselDocTypeListService.loadApplicationVesselDocTypeList());
    }else{
      promiseList.push(this.vesselDocTypeListService.loadOrganizationVesselDocTypeList());
    }

    forkJoin(promiseList).subscribe(resList => {
      this.vesselDocTypeList = resList[0] != null ? resList[0] : [];
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }
}
