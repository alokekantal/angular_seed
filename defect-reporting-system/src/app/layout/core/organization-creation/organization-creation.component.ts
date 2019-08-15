import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { routerTransition } from '../../../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin} from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CustomValidator } from '../../../shared/validation/customValidator';

import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { AppConstant } from '../../../shared/constant/appConstant';
import { Organization } from '../../../model/organization';
import { UserDetail } from '../../../model/userDetail'

import { OrganizationCreationService } from './organization-creatiuon.service';
import { UtilityService } from '../../../shared/services/utility.service';


@Component({
  selector: 'app-organization-creation',
  templateUrl: './organization-creation.component.html',
  styleUrls: ['./organization-creation.component.scss'],
  animations: [routerTransition()],
  providers: [OrganizationCreationService]
})
export class OrganizationCreationComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_ORGANIZATION_CREATION;
  organizationForm: FormGroup;
  userDetail: UserDetail = new UserDetail();
  id: any;
  orgModel: Organization;
  isUserCodeExist = false;
  orgList: any = [];
  orgId: any = '';

  constructor(private translate:TranslateService,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private location: Location,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private orgService: OrganizationCreationService) { 
      this.id = +this.route.snapshot.paramMap.get('id');
    }

  saveOrganization(){  
    this.utilityService.showLoader();  
    if(this.id == 0){
      this.orgService.checkLoginCodeExists(this.organizationForm.value.userCode).subscribe(res =>{
        if(res!=null){
          this.utilityService.hideLoader();
          this.toastrService.warning('Login ID already present!');
          this.isUserCodeExist = true;
        }else{
          this.isUserCodeExist = false;          
          this.formToModelMapping();
          this.orgService.saveOrUpdateOrganization(this.orgModel).subscribe(res => {
            this.utilityService.hideLoader();
            this.location.back();
          },
          err => {
            console.log(err);
            this.utilityService.hideLoader();
          });
        }
      },
      err => {
        console.log(err);
        this.utilityService.hideLoader();
      });  
    }else{
      this.formToModelMapping();
       //this.orgModel.userDetail.roleList = [];
      this.orgService.saveOrUpdateOrganization(this.orgModel).subscribe(res => {
        this.utilityService.hideLoader();
        this.location.back();
      },
      err => {
        console.log(err);
        this.utilityService.hideLoader();
      });
  }  
  }

  formToModelMapping() {
    //this.orgModel['userDetail'] = this.userDetail;
    for (let key in this.organizationForm.value) {
      if(key == 'userCode' || key == 'passcode' || key == 'firstname' || key == 'lastname' || key == 'phonenumber' || key == 'personalMailid'){
        this.orgModel['userDetail'][key] = this.organizationForm.value[key];
      }else{
        this.orgModel[key] = this.organizationForm.value[key];
      }        
    }
  }

  prepareForm() {
    this.organizationForm.patchValue({
        orgName:    this.orgModel.orgName,
        orgMail:    this.orgModel.orgMail,
        address:    this.orgModel.address,
        phoneNo:    this.orgModel.phoneNo,
        faxNo:      this.orgModel.faxNo,
        orgRegNumber: this.orgModel.orgRegNumber,
        orgDesc: this.orgModel.orgDesc,
        email1: this.orgModel.email1,
        email2: this.orgModel.email2,
        phoneNo1: this.orgModel.phoneNo1,
        phoneNo2: this.orgModel.phoneNo2,

        userCode:     this.orgModel.userDetail.userCode,
        passcode:     this.orgModel.userDetail.passcode,
        firstname:    this.orgModel.userDetail.firstname,
        lastname:     this.orgModel.userDetail.lastname,
        phonenumber:  this.orgModel.userDetail.phonenumber,
        personalMailid: this.orgModel.userDetail.personalMailid
    });
    this.utilityService.hideLoader();
  }

  checkLoginCodeExists(loginCode){
    this.utilityService.showLoader();
    this.orgService.checkLoginCodeExists(loginCode).subscribe(res =>{
      if(res!=null){
        this.toastrService.warning('Login ID already present!');
        this.isUserCodeExist = true;
      }else{
        this.isUserCodeExist = false;
      }
      this.utilityService.hideLoader();
    }, error =>{
      console.log(error);
      this.utilityService.hideLoader();
    });
  }

  getOrganizationCofin(){
    this.orgModel.copyFromOrgId = this.orgId;
  }

  capital(userCode){
    this.organizationForm.controls['userCode'].setValue(userCode.trim().toUpperCase()); 
    this.isUserCodeExist = false;
  }

  ngOnInit() {
    this.utilityService.showLoader();
    this.organizationForm = new FormGroup({
        orgName:      new FormControl('', [Validators.required, CustomValidator.emptyStringValidator]),
        orgMail:      new FormControl('', [Validators.required, CustomValidator.emailValidator]),
        address:      new FormControl('', Validators.required),
        phoneNo:      new FormControl('', [Validators.required, CustomValidator.phoneValidator]),
        faxNo:        new FormControl(''),
        orgRegNumber: new FormControl(''),
        orgDesc:      new FormControl(''),
        email1:       new FormControl(null,[CustomValidator.emailValidator]),
        email2:       new FormControl(null, [CustomValidator.emailValidator]),
        phoneNo1:     new FormControl('', [CustomValidator.phoneValidator]),
        phoneNo2:     new FormControl('', [CustomValidator.phoneValidator]),

        userCode:     new FormControl({value: '', disabled: this.id != 0}, [Validators.required, CustomValidator.emptyStringValidator]),
        passcode:     new FormControl('', [Validators.required, Validators.minLength(8)]),
        firstname:    new FormControl('', [Validators.required]),
        lastname:     new FormControl('', [Validators.required]),
        phonenumber:  new FormControl('', [Validators.required, CustomValidator.phoneValidator]),
        personalMailid: new FormControl('', [Validators.required, CustomValidator.emailValidator])
    });

    let apiList = [];
    apiList.push(this.orgService.loadOrgList());    

    
    if (this.id == 0) {
      this.orgModel = new Organization();
      this.utilityService.hideLoader();
    } else {
      apiList.push(this.orgService.loadSAUser(this.id));
      apiList.push(this.orgService.getOrganizationDetail(this.id));     
    }

    forkJoin(apiList).subscribe(resList => {
      this.orgList = resList[0];        
      this.orgList = this.orgList.filter(org => { return org.org_id != this.id});  
      if (this.id != 0) {  
        this.userDetail = resList[1];  
        this.orgModel = resList[2];
        this.orgModel.userDetail = this.userDetail;
        this.prepareForm();
      }
      this.utilityService.hideLoader();
  });   

    
  }

}
