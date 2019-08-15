import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';

import { UtilityService } from '../../../shared/services/utility.service';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    @Input() breadcrumb: any;
    @Input() icon: string;
    headingText: any = '';
    dashboardUrl = null;
    constructor(private translate:TranslateService, public router: Router, private utilityService: UtilityService ) {
        this.router.events.subscribe(val => {
            let loginInfo = this.utilityService.getLoginInfo();
            if (loginInfo[2] !== "0") {
                this.dashboardUrl = '/core/ship-dashboard';
            }else{
                this.dashboardUrl = '/dashboard';
            }
        });
    }

    ngOnInit() {
        this.headingText = this.breadcrumb[this.breadcrumb.length - 1].text;
    }
}
