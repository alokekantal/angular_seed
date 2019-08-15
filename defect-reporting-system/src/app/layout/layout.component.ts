import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../shared/services/common.service';
import { UtilityService } from '../shared/services/utility.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    providers: [ CommonService, UtilityService]
})
export class LayoutComponent implements OnInit {    
    collapedSideBar: boolean = true;
    componentListLinear:any = [];
    componentList: any = [];
    constructor(public router: Router,
        private modalService: NgbModal,
        private toastrService: ToastrService,
        public utilityService: UtilityService,
        private commonService: CommonService) {
            let promiseList = [];
            if(this.utilityService.getLoginInfo()[0].orgId == 0){
                promiseList.push(this.commonService.getApplicationComponemtList());
            } else {
                promiseList.push(this.commonService.getOrganizationComponemtList());
            }                

            forkJoin(promiseList).subscribe(resList => {
                this.utilityService.setComponentLinear(resList[0]);
                this.componentList = this.utilityService.getNestedChildren(resList[0], 0);
                this.componentListLinear = resList[0];
                //AppConstant.APPLICATION_TYPE = this.utilityService.getLoginInfo();
                this.utilityService.setComponentTree(this.componentList);
            }, error => {
                console.log(error);
                //this.utilityService.hideLoader();
            });
        }

    ngOnInit() {}

    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
}
