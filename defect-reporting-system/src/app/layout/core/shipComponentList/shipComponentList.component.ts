import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin} from 'rxjs';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ShipComponentListService } from './shipComponentList.service'
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'shipComponentList',
  templateUrl: './shipComponentList.component.html',
  styleUrls: ['./shipComponentList.component.scss'],
  animations: [routerTransition()],
  providers: [ShipComponentListService, CommonService]
})
export class ShipComponentListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_SHIP_COMPONENT_LIST;
  searchText: any = '';
  shipList: any = [];
  userList: any = [];
  constructor(private router: Router,
              private translate:TranslateService,
              private utilityService: UtilityService,
              private shipComponentListService: ShipComponentListService,
              private commonService: CommonService) { }

  manageComponent(ship){
    this.router.navigate(['/core/manage-ship-componemts/'+ship.ship_id]);	
  }

  ngOnInit() {
    this.utilityService.showLoader();  
    let loadDataList = [];
    loadDataList.push(this.commonService.loadUserList());
    loadDataList.push(this.shipComponentListService.loadShipList());
    forkJoin(loadDataList).subscribe(resList => {
      this.userList = resList[0];
      this.shipList = resList[1];

      let shipId = JSON.parse(localStorage.getItem('loginInfo'))[2];
      if(shipId != 0 && shipId != null && shipId != ''){
        let ship = this.shipList.find(ship => {
          return ship.ship_id == +shipId;
        });
        if(ship !== undefined){
          this.manageComponent(ship);
        }
      }
      this.utilityService.hideLoader();  
    });
  }

}
