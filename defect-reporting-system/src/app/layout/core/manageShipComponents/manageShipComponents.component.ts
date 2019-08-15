import { Component, OnInit, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { OrganizationComponent } from '../../../model/organizationComponent'

import { AppConstant } from '../../../shared/constant/appConstant';
import { CustomValidator } from '../../../shared/validation/customValidator';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { ManageShipComponentsService } from './manageShipComponents.service';
import { ShipComponentDetail } from '../../../model/shipComponentDetails';

import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'tree',
  templateUrl: './manageShipComponents.component.html',
  styleUrls: ['./manageShipComponents.component.scss'],
  animations: [routerTransition()],
  providers: [ManageShipComponentsService, CommonService]
})
export class ManageShipComponentsComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_MANAGE_SHIP_COMPONENTS;
  shipComponemtDetailForm: FormGroup;
  myTree: any = [];
  componentModel: OrganizationComponent;
  config: object;
  updatedComponent: any = [];
  deletedComponentList: any = [];
  tobeSaveComponentPromiseList: any = [];
  tobeDeleteComponentPromiseList: any =[]; 
  shipId: number = null; 
  shipComponentDetailModel: ShipComponentDetail = new ShipComponentDetail();
  selectedComponent: any = null;
  searchKeyword: any = '';
  constructor(private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private manageShipComponentsService: ManageShipComponentsService,
    private commonService: CommonService,
    private utilityService: UtilityService
  ) { 
    this.shipId = +this.route.snapshot.paramMap.get('id');
  } 

  saveComponemtDetail(){
    this.utilityService.showLoader();
    this.formToModelMapping();
    this.shipComponentDetailModel.shipid = this.shipId;
    this.manageShipComponentsService.saveComponentDetail(this.shipComponentDetailModel).subscribe(res =>{      
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
    this.manageShipComponentsService.getComponentDetail(event.element.id, this.shipId).subscribe(res =>{
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
        model:        new FormControl('', [Validators.maxLength(100),CustomValidator.emptyStringValidator]),
        description:  new FormControl('', [Validators.maxLength(100),CustomValidator.emptyStringValidator])
    });
    this.utilityService.showLoader();
    let loadDataList = [];
    this.myTree = this.utilityService.getComponentTree();
    if(this.myTree.length == 0) {
      loadDataList.push(this.manageShipComponentsService.getOrganizationComponemtList());
    } 


    if(loadDataList.length) {
      forkJoin(loadDataList).subscribe(resList => {
        this.myTree = resList[0];
        this.myTree = this.utilityService.getNestedChildren(this.myTree, 0);
        this.config = this.utilityService.configComponemtList();
        this.utilityService.hideLoader();
      }, err => {
        console.log(err);
        this.utilityService.hideLoader();
      });
    } else {
      this.config = this.utilityService.configComponemtList();
      this.utilityService.hideLoader();
    }    
  }
}
