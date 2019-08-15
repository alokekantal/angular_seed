import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CustomValidator } from '../shared/validation/customValidator';
import { LoginService } from './login.service';
import { CommonService } from '../shared/services/common.service';
import { UtilityService } from '../shared/services/utility.service';
import { AppConstant } from '../shared/constant/appConstant';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    providers: [LoginService, CommonService, UtilityService]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    forgotPasswordsForm: FormGroup;
    showToster: any = false;
    isPasswordMatch: boolean = true;
    isPasswordMatchOnBlur: boolean = true;
    componentListLinear:any = [];
    componentList: any = [];

    userExist: boolean = false;
    userNotExistValiadtion: boolean = false;
    constructor(public router: Router,
                private modalService: NgbModal,
                private toastrService: ToastrService,
                public utilityService: UtilityService,
                private loginService: LoginService, 
                private commonService: CommonService) {}

    ngOnInit() {
        //localStorage.removeItem('isLoggedin');
        localStorage.removeItem('loginInfo');
        localStorage.removeItem('orgInfo');
        localStorage.removeItem('componentListLinear');
        localStorage.removeItem('componentList');
        
        this.loginForm = new FormGroup({
            userCode: new FormControl('', Validators.required),
            passcode: new FormControl('', Validators.required)
        });

        this.forgotPasswordsForm = new FormGroup({
            userCode: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required,  CustomValidator.emailValidator])
        });
    }

    onBlurCPassword(){
        if(this.forgotPasswordsForm.value.password != this.forgotPasswordsForm.value.cPassword){
            this.isPasswordMatch = false;
        }else{
            this.isPasswordMatch = true;
        }
    }

    forgotPasswordCheck(){
        let data = this.forgotPasswordsForm.value;
        this.loginService.forgotPasswordCheck(data.userCode, data.email).subscribe(res => {
            this.userExist = true;
            this.userNotExistValiadtion = false;
            this.forgotPasswordsForm = new FormGroup({
                userCode: new FormControl('', Validators.required),
                email: new FormControl('', [Validators.required,  CustomValidator.emailValidator]),
                password: new FormControl('', [Validators.required, Validators.minLength(8)]),
                cPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
            });
            this.forgotPasswordsForm.patchValue({
                userCode: data.userCode,
                email: data.email
            });
        }, err => {
            this.userNotExistValiadtion = true;
            console.log(err);
        });
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            if(result == 'reset'){
                this.utilityService.showLoader();
                let data = this.forgotPasswordsForm.value;
                this.loginService.forgotPassword(data.userCode, data.email, data.password).subscribe(res => {
                    this.resetForgotPasswordModel();
                    this.toastrService.success('Password reset successfully!');
                    this.utilityService.hideLoader();
                }, err => {
                    this.utilityService.hideLoader();
                    console.log(err);
                });
            }
        }, (reason) => {
            this.getDismissReason(reason);
        });
      }

      resetForgotPasswordModel(){
        this.userExist = false;
        this.forgotPasswordsForm = new FormGroup({
            userCode: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required,  CustomValidator.emailValidator])
        });
      }
    
      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            this.resetForgotPasswordModel();
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            this.resetForgotPasswordModel();
          return 'by clicking on a backdrop';
        } else {
            this.resetForgotPasswordModel();
          return  `with: ${reason}`;
        }
      }

    login(){
        this.utilityService.showLoader();
        this.loginService.userLogin(this.loginForm.value).subscribe(res=>{
            if(res.length != 0){
                if(res[2] === null){
                    res[2] = '0';
                }
                this.utilityService.setLoginInfo(res);
                let promiseList = [];
                promiseList.push(this.commonService.loadOrganization());
                // if(res[0].orgId == 0){
                //     promiseList.push(this.commonService.getApplicationComponemtList());
                // } else {
                //     promiseList.push(this.commonService.getOrganizationComponemtList());
                // }                

                forkJoin(promiseList).subscribe(resList => {
                    this.utilityService.setOrgInfo(resList[0]);
                    // this.utilityService.setComponentLinear(resList[1]);
                    // this.componentList = this.utilityService.getNestedChildren(resList[1], 0);
                    // this.componentListLinear = resList[1];
                    AppConstant.APPLICATION_TYPE = JSON.parse(localStorage.getItem('loginInfo')) !== null ? JSON.parse(localStorage.getItem('loginInfo'))[1] : null;;
                    //this.utilityService.setComponentTree(this.componentList);
                    this.utilityService.hideLoader();

                    if(res[2] !== '0' && res[2] !== null) {
                        this.router.navigate(['/core/ship-dashboard']);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                }, error => {
                    console.log(error);
                    this.utilityService.hideLoader();
                });
            }else{
                this.showToster = true;
                this.utilityService.hideLoader();
            }            		
        },
        error=>{  
            this.showToster = true;          
            console.log(error);
            this.utilityService.hideLoader();
        })
    }
}
