import { Component, OnInit, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

import { AppConstant } from '../../../shared/constant/appConstant';
import { JobLibraryListService } from './jobLibraryList.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './jobLibraryList.component.html',
  styleUrls: ['./jobLibraryList.component.scss'],
  animations: [routerTransition()],
  providers: [JobLibraryListService, UtilityService]
})
export class JobLibraryListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_JOB_LIBRARY_LIST;
  // @ViewChild('errorModal') private errorModal;
  // @ViewChild('userUpload') myInputVariable: ElementRef;
  jobLibraryList: any = [];
  searchText: any = '';
  vesselList: any = [];
  vesselType: any = '';
  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private commonService: CommonService,
    private jobLibraryListService: JobLibraryListService) {

  }

  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    loadDataList.push(this.jobLibraryListService.loadApplicationJobList());
    loadDataList.push(this.commonService.getMasterVesselTypeList());
    forkJoin(loadDataList).subscribe(resList => {
      this.jobLibraryList = resList[0];
      this.vesselList = resList[1];
      this.jobLibraryList.forEach(job => {
        let component = this.utilityService.getComponentLinear().find(component => component.id === job.shipcomponentid);
        job.componentName = component !== undefined ? component.description : '';
      });
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });
  }

}
