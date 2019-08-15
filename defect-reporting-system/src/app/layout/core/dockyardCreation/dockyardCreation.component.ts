import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CustomValidator } from '../../../shared/validation/customValidator';
import { AppConstant } from '../../../shared/constant/appConstant';
import { Dockryard } from '../../../model/dockyard'
import { DockyardCreationService } from './dockyardCreation.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-department-creation',
  templateUrl: './dockyardCreation.component.html',
  styleUrls: ['./dockyardCreation.component.scss'],
  animations: [routerTransition()],
  providers: [DockyardCreationService, UtilityService]
})
export class DockyardCreationComponent implements OnInit {
  BREADCRUMB: any = AppConstant.BREADCRUMB_DOCKYARD_CREATION;
  dockyardForm: FormGroup;
  orgName: any = JSON.parse(localStorage.getItem('orgInfo')).orgName;

  id: any;
  dockyardModel: Dockryard;

  constructor(private translate:TranslateService,
    private route: ActivatedRoute,
    private location: Location,
    private utilityService: UtilityService,
    private dockyardCreationService: DockyardCreationService) {
      this.id = +this.route.snapshot.paramMap.get('id');
     }

  saveDepartment(){
    this.utilityService.showLoader();
    this.formToModelMapping();
    this.dockyardCreationService.saveOrUpdateDockyard(this.dockyardModel).subscribe(res => {
      this.utilityService.hideLoader();
      this.location.back();
    },
    err => {
      console.log(err);
      this.utilityService.hideLoader();
    });
  }

  formToModelMapping() {
    for (let key in this.dockyardForm.value) {      
        this.dockyardModel[key] = this.dockyardForm.value[key].trim();
    }
  }

  prepareForm() {
    this.dockyardForm.patchValue({
      dockyard:    this.dockyardModel.dockyard
    });
    this.utilityService.hideLoader();
  }
  
  ngOnInit() {
    this.utilityService.showLoader();
    this.dockyardForm = new FormGroup({
      dockyard:    new FormControl('', [Validators.required, Validators.maxLength(100),CustomValidator.emptyStringValidator])
    });

    if (this.id == 0) {
      this.dockyardModel = new Dockryard();
      this.utilityService.hideLoader();
    } else {
        this.dockyardCreationService.getDockyardDetail(this.id).subscribe(res => {
          this.dockyardModel = res;
          this.prepareForm();
        },
        err => {
          console.log(err);
          this.utilityService.hideLoader();
        });
    }
  }

}
