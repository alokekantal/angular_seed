import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { DesignationService } from './sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [DesignationService]
})
export class SidebarComponent {
    userName: any = JSON.parse(localStorage.getItem('loginInfo'))[0].userFirstName;
    isActive: boolean = true;
    collapsed: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';
    menuList: any = [];
    shipId = '0';

    @Output() collapsedEvent = new EventEmitter<boolean>();
    
    constructor(private translate: TranslateService, 
                public router: Router, 
                private designationService: DesignationService) {
        router.events.subscribe((val) => {
            this.shipId = JSON.parse(localStorage.getItem('loginInfo'))[2];
            //console.log(this.shipId);           
        });

        this.designationService.getFunctionList().subscribe(res => {
            this.menuList = res;
        }, err => {
            console.log(err);
        });
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'hindi']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|hindi/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                //this.toggleSidebar();
            }
        });
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
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

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }
}
