import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../shared/constant/appConstant'; 
import { OrganizationListService } from './organization-list.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  animations: [routerTransition()],
  providers: [OrganizationListService]
})
export class OrganizationListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_ORGANIZATION_LIST;
  searchText: any = '';
  organizationList: any = [];
  constructor(private translate:TranslateService,
    private utilityService: UtilityService,
    private organizationListService: OrganizationListService
    ) { }

  ngOnInit() {
    this.utilityService.showLoader();
    this.organizationListService.loadOrganizationList().subscribe(res => {
      this.organizationList = res;
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

}
