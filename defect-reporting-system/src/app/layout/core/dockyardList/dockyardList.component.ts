import { Component, OnInit, ElementRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { AppConstant } from '../../../shared/constant/appConstant';
import { DockyardListService } from './dockyardList.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './dockyardList.component.html',
  styleUrls: ['./dockyardList.component.scss'],
  animations: [routerTransition()],
  providers: [DockyardListService, UtilityService]
})
export class DockyardListComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_DOCKYARD_LIST;
  @ViewChild('errorModal') private errorModal;
  @ViewChild('userUpload') myInputVariable: ElementRef;
  dockyardList: any = [];
  searchText: any = '';
  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private utilityService: UtilityService,
    private dockyardListService: DockyardListService) {

  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFile(files.item(0));
    }
  }
  errMsg: any = [];
  uploadFile(userFile: any) {
    this.utilityService.showLoader();
    this.dockyardListService.uploadFile(userFile).subscribe(data => {
      this.myInputVariable.nativeElement.value = "";
      if (data.length == 0) {
        this.toastrService.success('Data uploaded successfully!');
        this.ngOnInit();
      } else {
        this.errMsg = data[0];
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
    let userTemplate = await this.dockyardListService.downloadUserTemplate();
    let urlCreator = window.URL;
    var url = window.URL.createObjectURL(userTemplate);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = "Department_Upload";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
    this.utilityService.hideLoader();
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
    this.dockyardListService.loadDockyardList().subscribe(res => {
      if(res == null){
        this.dockyardList = [];
      }else{
        this.dockyardList = res;
      }
      
      this.utilityService.hideLoader();
    }, err => {
      this.utilityService.hideLoader();
      console.log(err);
    });
  }

}
