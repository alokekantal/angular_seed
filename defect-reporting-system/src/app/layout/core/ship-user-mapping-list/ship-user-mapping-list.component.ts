import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin} from 'rxjs';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ShipMappingListService } from './ship-user-mapping-list.service'
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-ship-user-mapping-list',
  templateUrl: './ship-user-mapping-list.component.html',
  styleUrls: ['./ship-user-mapping-list.component.scss'],
  animations: [routerTransition()],
  providers: [ShipMappingListService, CommonService]
})
export class ShipUserMappingListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_SHIP_ALLOTMENT_LIST;
  searchText: any = '';
  shipList: any = [];
  userList: any = [];
  constructor(private router: Router,
              private translate:TranslateService,
              private utilityService: UtilityService,
              private shipMappingListService: ShipMappingListService,
              private commonService: CommonService) { }

  shipUserMapping(ship){
    this.router.navigate(['/core/ship-user-mapping/'+ship.ship_id], {queryParams: {name: ship.name}});	
  }

  ngOnInit() {
    this.utilityService.showLoader();  
    let loadDataList = [];
    loadDataList.push(this.commonService.loadUserList());
    loadDataList.push(this.shipMappingListService.loadShipList());
    forkJoin(loadDataList).subscribe(resList => {
      this.userList = resList[0];
      this.shipList = resList[1];
      this.utilityService.hideLoader();  
    });
  }

}
