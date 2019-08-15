import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';

import { ShipMappingListService } from '../../core/ship-user-mapping-list/ship-user-mapping-list.service';
import { UserCreationService } from '../../core/user-creation/user-creation.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [ShipMappingListService, UserCreationService, UtilityService]
})
export class HeaderComponent implements OnInit {
    shipList: any;
    selectedShip: any = '';
    pushRightClass: string = 'push-right';
    userName: any = JSON.parse(localStorage.getItem('loginInfo'))[0].userFirstName;
    showShipSelection: boolean = false;
    shipid = '0';
    constructor(private translate: TranslateService,
                public location: Location, 
                public router: Router, 
                private route: ActivatedRoute,
                private utilityService: UtilityService,
                private shipMappingListService: ShipMappingListService,
                private userCreationService: UserCreationService) {
        let path = '';        
        router.events.subscribe((val) => {
            if(location.path() != ''){
              path = location.path();
              this.shipid = JSON.parse(localStorage.getItem('loginInfo'))[2]; 
              this.showShipSelection = ((path === '/dashboard' || path === '/core/ship-dashboard' || path === '/core/project-list' || path.indexOf('core/job-list/') !== -1) && JSON.parse(localStorage.getItem('loginInfo'))[0].orgId != 0 && JSON.parse(localStorage.getItem('loginInfo'))[0].userType == 2 && JSON.parse(localStorage.getItem('loginInfo'))[1] == 'OFFSHORE' )? true : false;
            }
        });
        
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de','hindi', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|hindi|zh-CHS/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    saveShipForUser(){
        this.utilityService.showLoader();
        this.userCreationService.updateUserCurrentShipEntry(this.shipid).subscribe(res => {
            this.utilityService.hideLoader();            
            let info = JSON.parse(localStorage.getItem('loginInfo'));
            info[2] =  this.shipid;
            localStorage.setItem('loginInfo', JSON.stringify(info));
            if(this.shipid != '0') {
                let shipName = (this.shipList.find(ship => {return ship.ship_id === +this.shipid})).name;
                this.utilityService.setShipNameForJob(shipName);
                 if(this.router.url == '/dashboard'){
                    this.router.navigate(['/core/ship-dashboard']);
                 } else {
                    this.router.navigate([this.router.url]);
                }                
            } else {
                this.router.navigate(['/dashboard']);
                localStorage.removeItem('shipNameForJob');
            }
        }, err =>{
            console.log(err);
        });
    }

    ngOnInit() {
        let logedinUserId = JSON.parse(localStorage.getItem('loginInfo'))[0].userId;
        let promiseList = [];
        promiseList.push(this.shipMappingListService.loadShipList());
        forkJoin(promiseList).subscribe(res => {
            this.shipList = res[0];
        }, err => {

        });
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
