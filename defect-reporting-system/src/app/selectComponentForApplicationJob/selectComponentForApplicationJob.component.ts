import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../router.animations';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ApplicationComponent } from '../model/applicationComponemt'

import { AppConstant } from '../shared/constant/appConstant';
import { CustomValidator } from '../shared/validation/customValidator';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

import { CommonService } from '../shared/services/common.service';
import { UtilityService } from '../shared/services/utility.service';



@Component({
  selector: 'selectComponentForApplicationJob',
  templateUrl: './selectComponentForApplicationJob.component.html',
  styles: ['./selectComponentForApplicationJob.component.css'],
  providers: [CommonService, UtilityService]
})
export class SelectComponentForApplicationJob implements OnInit {
  @Input() title: string;
  @Input() inputModel: any;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  selectedComponent: any = null;
  myTree: any = [];
  config: any = {};
  searchKeyword: any = '';

  constructor(private activeModal: NgbActiveModal,
              private confirmationDialogService: ConfirmationDialogService,
              private modalService: NgbModal,
              private toastrService: ToastrService,
              private commonService: CommonService,
              private utilityService: UtilityService) {
                this.config = {
                  showActionButtons: false,
                  showAddButtons: true,
                  showRenameButtons: true,
                  showDeleteButtons: true,
                  enableExpandButtons: true,
                  enableDragging: false,
                  rootTitle: 'Components',
                  validationText: 'Enter valid company',
                  minCharacterLength: 5,
                  setItemsAsLinks: false,
                  setFontSize: 15,
                  setIconSize: 12,
                  //codeList: this.codeList
                };
               }

  
  onSelectItem(event) {
    this.selectedComponent = event.element;    
  }

  searchOnEnter(event) {
    if (event.key === "Enter"  ||  this.searchKeyword.length == 0) {
      this.searchComponent();
    }
  }
  
  searchComponent(){
    let tempTree = {
      description: 'root',
      id: 0,
      code: '0', 
      parentcode: '0',
      options: Object.assign({}, AppConstant.COMPONENT_OPTIONS),
      childrens: Object.assign([], this.myTree)
    }; 
    this.myTree = this.utilityService.search(tempTree, this.searchKeyword).childrens;
  }

  ngOnInit() {
      this.myTree = this.inputModel.tree;
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(this.selectedComponent);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
