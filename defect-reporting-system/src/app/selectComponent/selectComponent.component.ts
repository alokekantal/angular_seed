import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../router.animations';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { OrganizationComponent } from '../model/organizationComponent'

import { AppConstant } from '../shared/constant/appConstant';
import { CustomValidator } from '../shared/validation/customValidator';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

import { ShipComponentDetail } from '../model/shipComponentDetails';

import { CommonService } from '../shared/services/common.service';
import { UtilityService } from '../shared/services/utility.service';

import { ManageShipComponentsService } from '../layout/core/manageShipComponents/manageShipComponents.service'

@Component({
  selector: 'select-component',
  templateUrl: './selectComponent.component.html',
  styles: ['./selectComponent.component.css'],
  providers: [ManageShipComponentsService, CommonService, UtilityService]
})
export class SelectComponent implements OnInit {
  @Input() title: string;
  @Input() inputModel: any;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  shipComponemtDetailForm: FormGroup;
  myTree: any = [];
  componentModel: OrganizationComponent;
  config: object;
  updatedComponent: any = [];
  deletedComponentList: any = [];
  tobeSaveComponentPromiseList: any = [];
  tobeDeleteComponentPromiseList: any =[]; 
  shipComponentDetailModel: ShipComponentDetail = new ShipComponentDetail();
  selectedComponent: any = null;
  searchKeyword: any = '';
  constructor(private activeModal: NgbActiveModal,
              private confirmationDialogService: ConfirmationDialogService,
              private modalService: NgbModal,
              private toastrService: ToastrService,
              private manageShipComponentsService: ManageShipComponentsService,
              private commonService: CommonService,
              private utilityService: UtilityService) { }

  saveComponemtDetail(){
    this.utilityService.showLoader();
    this.formToModelMapping();
    this.shipComponentDetailModel.shipid = this.inputModel.shipId;
    this.manageShipComponentsService.saveComponentDetail(this.shipComponentDetailModel).subscribe(res =>{   
      this.shipComponentDetailModel = res;   
      this.utilityService.hideLoader();
      this.toastrService.success("Data save successfully!");
    }, err => {
      this.utilityService.hideLoader();
    });
  }

  formToModelMapping() {
    for (let key in this.shipComponemtDetailForm.value) {      
        this.shipComponentDetailModel[key] = this.shipComponemtDetailForm.value[key].trim();
    }
  }

  prepareForm() {
    this.shipComponemtDetailForm.patchValue({
      make:       this.shipComponentDetailModel.make,
      model:      this.shipComponentDetailModel.model,
      description:this.shipComponentDetailModel.description
    });
    this.utilityService.hideLoader();
  }

  onSelectItem(event) {
    this.shipComponemtDetailForm.reset();
    this.utilityService.showLoader();
    this.selectedComponent = event.element;
    this.manageShipComponentsService.getComponentDetail(event.element.id, this.inputModel.shipId).subscribe(res =>{
      if(res == null){
        this.shipComponentDetailModel = new ShipComponentDetail;
        this.shipComponentDetailModel.orgcomponentid = this.selectedComponent.id;
        this.utilityService.hideLoader();
      }else{
        this.shipComponentDetailModel = res[0];
        this.prepareForm();
      }
    }, err => {
      this.utilityService.hideLoader();
    });
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
    this.componentModel = new OrganizationComponent();
    this.shipComponemtDetailForm = new FormGroup({
        make:         new FormControl('', [Validators.maxLength(100),CustomValidator.emptyStringValidator]),
        model:         new FormControl('', [Validators.maxLength(100),CustomValidator.emptyStringValidator]),
        description:  new FormControl('', [Validators.maxLength(100),CustomValidator.emptyStringValidator])
    });
    this.utilityService.showLoader();
    this.myTree = this.utilityService.getComponentTree();
    this.config = this.utilityService.configComponemtList();
    this.utilityService.hideLoader();
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
