import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../router.animations';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AppConstant } from '../shared/constant/appConstant';
import { CustomValidator } from '../shared/validation/customValidator';

import { CommonService } from '../shared/services/common.service';
import { UtilityService } from '../shared/services/utility.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-component',
  templateUrl: './selectAttachmentFromVessel.component.html',
  styleUrls: ['./selectAttachmentFromVessel.component.css'],
  providers: [CommonService, UtilityService]
})
// tslint:disable-next-line:component-class-suffix
export class SelectAttachmentFromVessel implements OnInit {
  @Input() title: string;
  @Input() inputModel: any;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  shipAttachmentList: any = [];
  docTypeList: any = [];

  constructor(private activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private toastrService: ToastrService,
              private commonService: CommonService,
              private utilityService: UtilityService) { }

  ngOnInit() {
    this.utilityService.showLoader();
    const loadDataList = [];    
    loadDataList.push(this.commonService.loadShipAttachmentListList(this.inputModel.shipId));
    loadDataList.push(this.commonService.loadOrganizationVesselDocTypeList());

    forkJoin(loadDataList).subscribe(res => {
      this.shipAttachmentList = res[0];
      this.docTypeList = res[1];
      this.shipAttachmentList.forEach(attachment => {
        attachment.isSelected = false;
        let doc = this.docTypeList.find(doc => {return doc.id == attachment.vesselDocTypeId});        
        attachment['docType'] = doc !== undefined ? doc.vesselDocDescription : '';
      });

      console.log(this.shipAttachmentList);
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });

  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.shipAttachmentList = this.shipAttachmentList.filter(attachment => { return attachment.isSelected});
    this.activeModal.close(this.shipAttachmentList);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
