import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { routerTransition } from '../../../router.animations';
import { Defect } from '../../../model/defect'
import { AppConstant } from '../../../shared/constant/appConstant';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-defect-list',
  templateUrl: './defect-list.component.html',
  styleUrls: ['./defect-list.component.scss'],
  animations: [routerTransition()],
})
export class DefectListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_DEFECT_LIST;
  searchDropdownConfig: any = AppConstant.searchDropdownConfig;
  @ViewChild('searchModal') private searchModal;
  defectForm: FormGroup;
  id: any;
  defectModel: Defect = new Defect();

  constructor(private utilityService: UtilityService,
              private modalService: NgbModal,) { 
    this.prepareForm();
  }

  prepareForm() {
    this.defectForm = new FormGroup({
      shipName:             new FormControl(''),
      defId:                new FormControl(''),
      component:            new FormControl(''),
      raisedOn:             new FormControl(''),
      severity:             new FormControl(''),
      defectDetail:         new FormControl(''),
      raisedBy:             new FormControl(''),
      system:               new FormControl(''),
      repairCriteria:       new FormControl(''),
      status:               new FormControl(''),
      targetDate:           new FormControl('')       
    });

  }

  openSearchModal() {
    this.modalService.open(this.searchModal, { ariaLabelledBy: 'modal-basic-title',size: 'lg' }).result.then((result) => {
      console.log("search");
    }, (reason) => {
      
    });
  }

  ngOnInit() {
  }

}
