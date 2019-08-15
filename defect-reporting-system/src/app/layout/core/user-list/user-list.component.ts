import { Component, OnInit, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { UserListService } from './user-list.service'

import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [routerTransition()],
  providers: [UserListService, CommonService]
})
export class UserListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_USER_LIST;
  searchText: any = '';
  @ViewChild('errorModal') private errorModal;
  @ViewChild('userUpload') myInputVariable: ElementRef;
  userList: any = [];
  departmentList: any = [];
  designationList: any = [];
  resetPasswordsForm: FormGroup;

  resetPasswordModel: any = {
    userId: '',
    password: '',
    cPassword: ''
  };
  selectedUserId: number = null;
  isPasswordMatch: boolean = true;
  isPasswordMatchOnBlur: boolean = true;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private userListService: UserListService,
    private commonService: CommonService,
    private utilityService: UtilityService
  ) { }

  public deleteUser() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete the user... ?')
      .then((confirmed) => console.log('User confirmed:', confirmed))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFile(files.item(0));
    }
  }
  errMsg: any = [];
  uploadFile(userFile: any) {
    this.utilityService.showLoader();
    this.userListService.uploadFile(userFile).subscribe(data => {
      this.myInputVariable.nativeElement.value = "";
      if (data.length == 0) {
        this.toastrService.success('Data uploaded successfully!'); 
        this.ngOnInit(); 
      } else {
        this.errMsg = data[0];
        this.buildForm()
        this.openError(this.errorModal);
      }
      this.utilityService.hideLoader();
    }, error => {
      this.utilityService.hideLoader();
      this.myInputVariable.nativeElement.value = "";
      console.log(error);

    });
  }

  public async downloadUserTemplate(): Promise<void> {
    this.utilityService.showLoader();
    let userTemplate = await this.userListService.downloadUserTemplate();
    let urlCreator = window.URL;
    var url = window.URL.createObjectURL(userTemplate);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = "User_Upload";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
    this.utilityService.hideLoader();
  }

  buildForm() {
    this.resetPasswordsForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      cPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  onBlurCPassword() {
    if (this.resetPasswordsForm.value.password != this.resetPasswordsForm.value.cPassword) {
      this.isPasswordMatch = false;
    } else {
      this.isPasswordMatch = true;
    }
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

  open(content, userId) {
    this.selectedUserId = userId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == 'reset') {
        this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to reset the password... ?')
          .then((confirmed) => {
            if (confirmed) {
              this.utilityService.showLoader();
              let data = this.resetPasswordsForm.value;
              this.userListService.resetPassword(this.selectedUserId, data.password).subscribe(res => {
                this.resetPasswordsForm.reset();
                this.utilityService.hideLoader();
                this.toastrService.success('Password reset successfully!'); 
              }, err => {
                this.utilityService.hideLoader();
                console.log(err);
              });
            }
          })
          .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
      }
    }, (reason) => {
      this.resetPasswordsForm.reset();
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
    loadDataList.push(this.commonService.loadDepartmentList());
    loadDataList.push(this.commonService.loadDesignationList());
    loadDataList.push(this.userListService.getUserList());

    forkJoin(loadDataList).subscribe(resList => {
      this.departmentList = resList[0];
      this.designationList = resList[1];
      this.userList = resList[2];
      this.userList = this.userList.filter(user => user.user_id != JSON.parse(localStorage.getItem('loginInfo'))[0].userId)
      this.utilityService.hideLoader();
    }, err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

}
