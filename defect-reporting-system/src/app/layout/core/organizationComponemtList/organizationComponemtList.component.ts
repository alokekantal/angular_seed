import { Component, OnInit, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { OrganizationComponent } from '../../../model/organizationComponent'

import { AppConstant } from '../../../shared/constant/appConstant';
import { CustomValidator } from '../../../shared/validation/customValidator';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { AlertDialogService } from '../../../alert-dialog/alert-dialog.service';
import { OrganizationComponemtListService } from './organizationComponemtList.service'

import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'tree',
  templateUrl: './organizationComponemtList.component.html',
  styleUrls: ['./organizationComponemtList.component.scss'],
  animations: [routerTransition()],
  providers: [OrganizationComponemtListService, CommonService]
})
export class OrganizationComponemtListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_TREE;
  componemtForm: FormGroup;
  myTree: any = [];
  componentModel: OrganizationComponent;
  config: any;
  updatedComponent: any = [];
  deletedComponentList: any = [];
  tobeSaveComponentPromiseList: any = [];
  tobeDeleteComponentPromiseList: any =[];  
  codeList: any = ["aaa"];
  searchKeyword: any = '';
  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private alertDialogService: AlertDialogService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private organizationComponemtListService: OrganizationComponemtListService,
    private commonService: CommonService,
    private utilityService: UtilityService
  ) { }

  updateId(object, component){
    if(object.code == component.code){        
      object.id = component.id;      
    }
    for(let child of object.childrens){      
      this.updateId(child, component);
    } 
    return object;     
  }

  saveComponent(component, forRoot){
    // duplicate check
    let temp = this.config.codeList.filter(com => com.code == component.code);
    if(temp.length > 0){
      this.alertDialogService.alert('Alert!', 'Code already exist!', 'OK', 'lg')
          .then((alert) => console.log('User confirmed:', alert))
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
      return
    }else{
      this.config.codeList.push(component);
    }
    // save data
    this.organizationComponemtListService.saveOrganizationComponemtList(component).subscribe(res => {
      if(component.id == 0 && forRoot){
        let temp = this.componentModel;    
        temp['childrens'] = [];
        this.myTree.push(temp);
        this.componemtForm.reset();
        this.componentModel = new OrganizationComponent();        

        if(component.id == 0 || component.id == null){
          let tempTree = {
            description: 'root',
            id: 0,
            code: '0', 
            parentcode: '0',
            childrens: this.myTree
          }; 
          tempTree = this.updateId(tempTree, res);
          this.myTree = tempTree.childrens;
          for(let i = 0; i < this.codeList.length; i++){
            if(this.codeList[i].code == res.code){
              this.codeList[i] = res;
            }
          } 
          this.utilityService.setComponentTree(this.myTree);
          this.utilityService.setComponentLinear(this.codeList);
          this.toastrService.success('Data save successfully!');
        }
        if(this.myTree.length == 2)
          this.ngOnInit();
      }
      
    });
  }

  addcomponent(){
    this.formToModelMapping();    
    this.saveComponent(this.componentModel, true);    
  }

  formToModelMapping() {
    for (let key in this.componemtForm.value) {      
        this.componentModel[key] = this.componemtForm.value[key].trim();
    }
  }

  updateParentCode(object){
    for(let child of object.childrens){
      if(child['parentcode'] !== object.code){        
        child['parentcode'] = object.code;  
        this.updatedComponent.push(child);      
      }
      this.updateParentCode(child);
    }
    return object;
  }

  prepareTree(){
    let tempTree = {
      description: 'root',
      id: 0,
      code: '0', 
      parentcode: '0',
      childrens: this.myTree
    };

    setTimeout(()=>{
      this.updatedComponent = [];
      tempTree = this.updateParentCode(tempTree);
      this.myTree = tempTree.childrens;
      this.updatedComponent.forEach(component => {
        let copy = Object.assign({}, component);
        delete copy.childrens;
        this.tobeSaveComponentPromiseList.push(this.organizationComponemtListService.saveOrganizationComponemtList(component));
      });
      if(this.tobeSaveComponentPromiseList.length > 0){
        forkJoin(this.tobeSaveComponentPromiseList).subscribe((res: OrganizationComponent[]) => {
          this.utilityService.hideLoader();
          
          let tempTree = {
            description: 'root',
            id: 0,
            code: '0', 
            parentcode: '0',
            childrens: this.myTree
          }; 
          tempTree = this.updateId(tempTree, res[0]);
          this.myTree = tempTree.childrens;
          for(let i = 0; i < this.codeList.length; i++){
            if(this.codeList[i].code == res[0].code){
              this.codeList[i] = res[0];
            }
          }
          this.utilityService.setComponentTree(this.myTree);
          this.utilityService.setComponentLinear(this.codeList);
          this.toastrService.success('Data save successfully!'); 
        }, err =>{
          this.utilityService.hideLoader();
        });
      }else{
        this.utilityService.hideLoader();
      }
      
    }, 1000);
  }

  getDeletedComponentList(object){
    this.deletedComponentList.push(object.id);
    for(let child of object.childrens){
      this.deletedComponentList.push(child.id);
      let index = this.config.codeList.indexOf(child.code);  
      if(index != -1){
        this.config.codeList.splice(index, 1);
      }
      this.getDeletedComponentList(child);
    }
    return;
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

  onDragStart(event) {}
  onDrop(event) {
    this.tobeSaveComponentPromiseList = [];
    this.utilityService.showLoader();
    this.prepareTree();
  }
  onAllowDrop(event) {}
  onDragEnter(event) {}
  onDragLeave(event) {}
  onAddItem(event) {}
  onclickItem(event) {}
  onSelectItem(event) {}
  onEditItem(event) {
    this.tobeSaveComponentPromiseList = [];
    this.utilityService.showLoader();
    this.tobeSaveComponentPromiseList.push(this.organizationComponemtListService.saveOrganizationComponemtList(event.element));
    this.prepareTree();
  }
  onDeleteItem(event) {
    this.utilityService.showLoader();
    this.getDeletedComponentList(event.parentWithChildrens);
    this.deletedComponentList.forEach(componentId => {     
      this.tobeDeleteComponentPromiseList.push(this.organizationComponemtListService.deleteComponent(componentId));
    });
    
    if(this.tobeDeleteComponentPromiseList.length > 0){
      forkJoin(this.tobeDeleteComponentPromiseList).subscribe(res => {
        this.utilityService.hideLoader();
        this.utilityService.setComponentTree(this.myTree);
        this.utilityService.setComponentLinear(this.codeList);
        this.toastrService.success('Data save successfully!'); 
      }, err =>{
        this.utilityService.hideLoader();
      });
    }else{
      this.utilityService.hideLoader();
    }
    
  }

  ngOnInit() {
    this.componentModel = new OrganizationComponent();
    this.componemtForm = new FormGroup({
        code:         new FormControl('', [Validators.required, Validators.maxLength(100),CustomValidator.emptyStringValidator]),
        description:  new FormControl('', [Validators.required, Validators.maxLength(100),CustomValidator.emptyStringValidator])
    });
    this.utilityService.showLoader();
    this.myTree = this.utilityService.getComponentTree();
    let loadDataList = [];    
    if(this.myTree.length == 0) {
      loadDataList.push(this.organizationComponemtListService.getOrganizationComponemtList());
    }    

    if(loadDataList.length) {
      forkJoin(loadDataList).subscribe(resList => {
        this.myTree = resList[0];
        this.codeList = this.myTree.slice();
        this.myTree = this.utilityService.getNestedChildren(this.myTree, 0);
        this.config = this.utilityService.configComponemtListWithEdit();
        this.utilityService.hideLoader();
      }, err => {
        console.log(err);
        this.utilityService.hideLoader();
      });
    } else {
      this.codeList = this.utilityService.getComponentLinear();
      this.config = this.utilityService.configComponemtListWithEdit();
      this.config.codeList = this.codeList;
      this.utilityService.hideLoader();
    }
    
  }

}
