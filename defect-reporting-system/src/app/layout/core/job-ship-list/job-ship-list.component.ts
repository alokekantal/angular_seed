import { Component, OnInit,ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AppConstant } from '../../../shared/constant/appConstant';
import { JobShipListService } from './job-ship-list.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-ship-list',
  templateUrl: './job-ship-list.component.html',
  styleUrls: ['./job-ship-list.component.scss'],
  animations: [routerTransition()],
  providers: [JobShipListService, CommonService]
})
export class JobShipListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_SHIP_LIST;
  searchText: any = '';  
  shipList: any = [];
  orgList: any = [];
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  constructor(private router: Router,
    private translate:TranslateService,
    private commonService: CommonService,
	  private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private jobShipListService: JobShipListService) { }

    gotoJobList(ship){
      this.utilityService.setShipNameForJob(ship.name);
      this.router.navigate(['/core/job-list/'+ship.ship_id]);	
    }

  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    loadDataList.push(this.commonService.loadOrganizationList());
    loadDataList.push(this.jobShipListService.loadShipList());

    forkJoin(loadDataList).subscribe(resList => {
      this.orgList = resList[0];
      this.shipList = resList[1];
      let shipId = JSON.parse(localStorage.getItem('loginInfo'))[2];
      if(shipId != 0 && shipId != null && shipId != ''){
        let ship = this.shipList.find(ship => {
          return ship.ship_id == +shipId;
        });
        if(ship !== undefined){
          this.gotoJobList(ship);
        }
      }
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

}
