import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../shared/constant/appConstant';
import { DesignationListService } from './designation-list.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.scss'],
  animations: [routerTransition()],
  providers: [DesignationListService]
})
export class DesignationListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_DESIGNATION_LIST;
  searchText: any = '';
  designationList: any = [];
  constructor(private translate:TranslateService,
              private utilityService: UtilityService,
              private designationListService: DesignationListService) { }

  ngOnInit() {
    this.utilityService.showLoader();
    this.designationListService.loadDesignationList().subscribe(res => {
      this.designationList = res;
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }
}
