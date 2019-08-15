import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';

import { AppConstant } from '../../../shared/constant/appConstant';
import { ShipMappingService } from './ship-user-mapping.service'
import { CommonService } from '../../../shared/services/common.service';
import { UtilityService } from '../../../shared/services/utility.service';


@Component({
    selector: 'app-ship-user-mapping',
    templateUrl: './ship-user-mapping.component.html',
    styleUrls: ['./ship-user-mapping.component.scss'],
    animations: [routerTransition()],
    providers: [ShipMappingService, CommonService, UtilityService]
})
export class ShipUserMappingComponent implements OnInit {
    BREADCRUMB: any = AppConstant.BREADCRUMB_SHIP_ALLOTMENT;
    orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;
    userUnderLoggedInUser: any = [];
    userAssignedToShip: any = [];
    shipList: any = [];
    shipUserMapping: FormGroup;
    isCopy: boolean = false;
    selectedShipId: any = null;
    existingShipUserList: any = [];
    id: any;
    shipname: any;
    constructor(private route: ActivatedRoute,
        private location: Location,
        private modalService: NgbModal,
        private toastrService: ToastrService,
        private confirmationDialogService: ConfirmationDialogService,
        private shipMappingService: ShipMappingService,
        private commonService: CommonService,
        private utilityService: UtilityService) {
        this.id = +this.route.snapshot.paramMap.get('id');
        this.route.queryParams.subscribe(queryParams => {
            this.shipname = queryParams.name;
        });
    }

    getTobeAddUserList(userId){
        let userObj = this.userUnderLoggedInUser.find(user => user.user_id == userId);
        if(userObj !== undefined) {
            this.toBeAdd.push(userObj);
            if(userObj.currentReportTo !== null)
                this.getTobeAddUserList(userObj.currentReportTo);
        }        
    }

    assignUserToShip() {
        let userList = this.shipUserMapping.value.userList;
        userList.forEach(userId => {
            this.getTobeAddUserList(userId);
            this.toBeAdd.forEach(user => {
                let index = this.userUnderLoggedInUser.indexOf(user);
                this.userUnderLoggedInUser.splice(index, 1);
                this.userAssignedToShip.push(user);
            });
        });
        this.toBeAdd = [];
        this.shipUserMapping.patchValue({
            userList: ''
        });
    }

    getTobeRemoveUserList(userId){
        let userObj = this.userAssignedToShip.find(user => user.user_id == userId);
        if(userObj !== undefined) {
            this.toBeRemove.push(userObj);
            let userList = this.userAssignedToShip.filter(user => user.currentReportTo == userId);
            userList.forEach(user => {
                this.getTobeRemoveUserList(user.user_id);
            });
        }        
    }

    unassignUserToShip() {
        let userList = this.shipUserMapping.value.assignedUserList;
        userList.forEach(userId => {
            this.getTobeRemoveUserList(userId);
            this.toBeRemove.forEach(user => {
                let index = this.userAssignedToShip.indexOf(user);
                this.userAssignedToShip.splice(index, 1);
                this.userUnderLoggedInUser.push(user);
            });
        });
        this.toBeRemove = [];
        this.shipUserMapping.patchValue({
            assignedUserList: ''
        });
    }

    saveShipUserMapping() {
        this.utilityService.showLoader();
          let shipId = this.id;
          let removedUserIdList = this.userUnderLoggedInUser.map(user => user.user_id);
          let addedUserIdList = this.userAssignedToShip.map(user => user.user_id);

          this.shipMappingService.saveShipUserMapping(shipId, removedUserIdList, addedUserIdList).subscribe(res => {
            this.utilityService.hideLoader();
            this.location.back();
          },
          err => {
            console.log(err);
            this.utilityService.hideLoader();
          });
    }

    getShipUserMapByShipId(){
        if(this.selectedShipId != ''){
            this.utilityService.showLoader();
            this.shipMappingService.loadUserAssignedToShip(this.selectedShipId).subscribe(res => {
                this.existingShipUserList = res;
                for(let i = 0; i < this.existingShipUserList.length; i++){
                    this.existingShipUserList[i]['isSelected'] = true;
                }
                this.utilityService.hideLoader();
            }, err => {
                this.utilityService.hideLoader();
            });
        }else{
            this.existingShipUserList = [];
        }        
    }

    prepareAssignedUser() {
        this.userAssignedToShip.forEach(user => user['name'] = user.firstname + " " + user.lastname);
        this.userAssignedToShip.forEach(user => {
            let index = this.userUnderLoggedInUser.findIndex(lUser => lUser.user_id == user.user_id);
            if (index != -1) {
                user['isDisabled'] = false;
                this.userUnderLoggedInUser.splice(index, 1);
            } else {
                user['isDisabled'] = true;
            }

            if (user.user_id == JSON.parse(localStorage.getItem('loginInfo'))[0].userId) {
                user['isDisabled'] = true;
            }
        });
    }

    ngOnInit() {
        this.utilityService.showLoader();
        this.shipUserMapping = new FormGroup({
            userList: new FormControl(''),
            assignedUserList: new FormControl('')
        });

        let apiList = [];
        apiList.push(this.shipMappingService.loadUserUnderLoggedInUser());
        apiList.push(this.shipMappingService.loadUserAssignedToShip(this.id));
        apiList.push(this.shipMappingService.loadShipListByUserId());

        forkJoin(apiList).subscribe(resList => {
            this.userUnderLoggedInUser = resList[0];
            this.userUnderLoggedInUser.forEach(user => user['name'] = user.firstname + " " + user.lastname);

            this.userAssignedToShip = resList[1];
            this.prepareAssignedUser();

            this.shipList = resList[2];
            this.shipList = this.shipList.filter(ship => { return ship.ship_id != this.id });
            this.utilityService.hideLoader();
        });
    }

    copyUserToShip(userIdList) {
        if (userIdList.length != 0) {
            this.utilityService.showLoader();
            this.shipMappingService.addUserToShip(this.id, userIdList).subscribe(res => {
                this.ngOnInit();
            }, error => {
                console.log(error);
                this.utilityService.hideLoader();
            });
        } else {
            this.toastrService.warning('Please select at least one user!');
        }
    }

    removeUserFromShip(userIdList) {
        if (userIdList.length != 0) {
            this.utilityService.hideLoader();
            this.shipMappingService.removeUserFromShip(this.id, userIdList).subscribe(res => {
                if (this.toBeAdd.length > 0) {
                    this.copyUserToShip(this.toBeAdd);
                } else {
                    this.ngOnInit();
                }
            }, error => {
                console.log(error);
                this.utilityService.hideLoader();
            });
        } else {
            this.toastrService.warning('Please select at least one user!');
        }
    }

    toBeAdd = [];
    toBeRemove = [];
    open(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            if (result == 'Save') {
                this.shipMappingService.loadUserUnderLoggedInUser().subscribe(res => {
                    this.userUnderLoggedInUser = res;
                    for (let i = 0; i < this.userUnderLoggedInUser.length; i++) {
                        let index1 = this.existingShipUserList.findIndex(user => user.user_id === this.userUnderLoggedInUser[i].user_id);
                        let index2 = this.userAssignedToShip.findIndex(user => user.user_id === this.userUnderLoggedInUser[i].user_id);
                        if (index1 !== -1 && index2 == -1) {
                            this.toBeAdd.push(this.userUnderLoggedInUser[i].user_id);
                        }
                        if (index1 === -1 && index2 !== -1) {
                            this.toBeRemove.push(this.userUnderLoggedInUser[i].user_id);
                        }
                    }
                    if (this.toBeRemove.length > 0) {
                        this.removeUserFromShip(this.toBeRemove);
                    } else if (this.toBeAdd.length > 0) {
                        this.copyUserToShip(this.toBeAdd);
                    } else {
                        this.ngOnInit();
                    }
                });

            }
        }, (reason) => {
            this.getDismissReason(reason);
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            this.existingShipUserList = [];
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            this.existingShipUserList = [];
            return 'by clicking on a backdrop';
        } else {
            this.existingShipUserList = [];
            return `with: ${reason}`;
        }
    }
}
