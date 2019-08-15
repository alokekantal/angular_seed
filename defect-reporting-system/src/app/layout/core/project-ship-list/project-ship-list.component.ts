import { Component, OnInit,ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ProjectShipListService } from './project-ship-list.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-ship-list',
  templateUrl: './project-ship-list.component.html',
  styleUrls: ['./project-ship-list.component.scss'],
  animations: [routerTransition()],
  providers: [ProjectShipListService, CommonService]
})
export class ProjectShipListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_SHIP_LIST;
  searchText: any = '';  
  shipList: any = [];
  constructor(private router: Router,
    private translate:TranslateService,
    private commonService: CommonService,
	  private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private projectShipListService: ProjectShipListService) { }

    gotoProjectList(ship){
      this.router.navigate(['/core/project-list/'+ship.ship_id], {queryParams: {name: ship.name}});	
    }

  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    loadDataList.push(this.projectShipListService.loadShipList());

    forkJoin(loadDataList).subscribe(resList => {
      this.shipList = resList[0];
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

}
