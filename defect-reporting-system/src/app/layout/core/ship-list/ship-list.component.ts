import { Component, OnInit,ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ShipListService } from './ship-list.service';
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-ship-list',
  templateUrl: './ship-list.component.html',
  styleUrls: ['./ship-list.component.scss'],
  animations: [routerTransition()],
  providers: [ShipListService, CommonService]
})
export class ShipListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_SHIP_LIST;
  searchText: any = '';
  @ViewChild('shipUpload') myInputVariable: ElementRef;
  @ViewChild('errorModal') private errorModal;
  shipList: any = [];
  orgList: any = [];
  orgId: any = JSON.parse(localStorage.getItem('orgInfo')).org_id;
  constructor(private router: Router,
    private translate:TranslateService,
    private commonService: CommonService,
	  private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private shipListService: ShipListService) { }

  shipUserMapping(){
    this.router.navigate(['/core/ship-user-mapping']);	
  }
  
  
  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFile(files.item(0));
    }
  }
  errMsg: any = [];
  uploadFile(shipFile: any) {
    this.utilityService.showLoader();
    this.shipListService.uploadFile(shipFile).subscribe(data => {
      this.myInputVariable.nativeElement.value = "";
      //if (data.length == 0) {
        this.toastrService.success('Data uploaded successfully!');
        this.ngOnInit();  
      // } else {
      //   this.errMsg = data[0];
      //  // this.buildForm()
      //  this.openError(this.errorModal);
      // }
      this.utilityService.hideLoader();
    }, error => {
      this.utilityService.hideLoader();
      this.myInputVariable.nativeElement.value = "";
      console.log(error);
    });
  }
  
  public async downloadShipTemplate(): Promise<void> {
    this.utilityService.showLoader();
    let shipTemplate = await this.shipListService.downloadShipTemplate();
    let urlCreator = window.URL;
    var url = window.URL.createObjectURL(shipTemplate);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = "Ship_Upload";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
    this.utilityService.hideLoader();
  }
  
  

 
 openError(errorContent) {
    this.modalService.open(errorContent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == 'reset') {
        //console.log("mbvh");
      }
    }, (reason) => {
      this.getDismissReason(reason);
    });
  }
  
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  ngOnInit() {
    this.utilityService.showLoader();
    let loadDataList = [];
    loadDataList.push(this.commonService.loadOrganizationList());
    loadDataList.push(this.shipListService.loadShipList());

    forkJoin(loadDataList).subscribe(resList => {
      this.orgList = resList[0];
      this.shipList = resList[1];
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
    });

    // this.shipListService.loadShipList().subscribe(res => {
    //   this.shipList = res;
    //   this.utilityService.hideLoader();
    // }, err => {
    //   console.log(err);
    //   this.utilityService.hideLoader();
    // });
  }

}
