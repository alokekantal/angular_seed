import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTooltipModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { SelectDropDownModule } from 'ngx-select-dropdown'


import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { CoreRoutingModule } from './core-routing.module';
import { PageHeaderModule } from './../../shared';

import { NgxTreeDndModule } from '../../../../projects/ngx-tree-dnd/src/public_api';
import { ChatComponent } from '../dashboard/components/chat/chat.component';

import { DepartmentCreationComponent } from './department-creation/department-creation.component';
import { OrganizationCreationComponent } from './organization-creation/organization-creation.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { RoleFunctionMappingComponent } from './role-function-mapping/role-function-mapping.component';
import { DesignationComponent } from './designation/designation.component';
import { UserCreationComponent } from './user-creation/user-creation.component';

import { DepartmentListComponent } from './department-list/department-list.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { RoleListComponent } from './role-list/role-list.component';
// import { RoleFunctionMapingListComponent } from './role-function-mapping-list/role-function-mapping-list.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { ShipListComponent } from './ship-list/ship-list.component';
import { ShipCreationComponent } from './ship-creation/ship-creation.component';
import { ShipUserMappingComponent } from './ship-user-mapping/ship-user-mapping.component';
import { ShipUserMappingListComponent } from './ship-user-mapping-list/ship-user-mapping-list.component';
import { ApplicationComponemtListComponent } from './applicationComponemtList/applicationComponemtList.component';
import { OrganizationComponemtListComponent } from './organizationComponemtList/organizationComponemtList.component';
import { ShipComponentListComponent } from './shipComponentList/shipComponentList.component';
import { ManageShipComponentsComponent } from './manageShipComponents/manageShipComponents.component';
import { JobShipListComponent } from './job-ship-list/job-ship-list.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobCreationComponent } from './job-creation/job-creation.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';
import { ProjectShipListComponent } from './project-ship-list/project-ship-list.component';
import { JobLibraryListComponent } from './jobLibraryList/jobLibraryList.component';
import { JobLibraryCreationComponent } from './jobLibraryCreation/jobLibraryCreation.component';
import { DockyardListComponent } from './dockyardList/dockyardList.component';
import { DockyardCreationComponent } from './dockyardCreation/dockyardCreation.component';
import { ProfileComponent } from './profile/profile.component';
import { OrganizationJobListComponent } from './organization-job-list/organization-job-list.component';
import { OrganizationJobLibraryCreationComponent } from './organizationJobLibraryCreation/organizationJobLibraryCreation.component';
import { ShipDashboardComponent } from './ship-dashboard/ship-dashboard.component';
import { VesselDocTypeListComponent } from './vesselDocTypeList/vesselDocTypeList.component';
import { ProjectCloserComponent } from './project-closer/project-closer.component';
import { ReportComponent } from './report/report.component';

import { UtilityService } from '../../shared/services/utility.service';
import { Uppercase } from '../../shared/directive/textCapitalize.directive';
import { CounterDirective } from '../../shared/directive/countdown.directive';
import { CopyFromOldJobComponent } from './copy-from-old-job/copy-from-old-job.component';
import { DefectCreationComponent } from './defect-creation/defect-creation.component';
import { DefectListComponent } from './defect-list/defect-list.component';

@NgModule({
  imports: [
    CommonModule, 
    PageHeaderModule, 
    CoreRoutingModule,
    AngularMultiSelectModule,
    FormsModule,
    NgbModule.forRoot(),
    NgbTooltipModule.forRoot(),
    NgbAlertModule.forRoot(),
    ReactiveFormsModule,
    TranslateModule,
    NgxTreeDndModule,   // add  NgxTreeDndModule to imports
    SharedPipesModule,
    CKEditorModule,
    SelectDropDownModule
  ],
  declarations: [
                  ChatComponent,
                  DepartmentCreationComponent,
                  OrganizationCreationComponent,
                  CreateRoleComponent,
                  RoleFunctionMappingComponent,
                  DesignationComponent,
                  UserCreationComponent,
                  RoleListComponent,
                  DepartmentListComponent,
                  OrganizationListComponent,
                  //RoleFunctionMapingListComponent,
                  DesignationListComponent,
                  UserListComponent,
                  ShipListComponent,
                  ShipCreationComponent,
                  ShipUserMappingComponent,
                  ShipUserMappingListComponent,
                  ApplicationComponemtListComponent,
                  OrganizationComponemtListComponent,
                  ShipComponentListComponent,
                  ManageShipComponentsComponent,
                  JobShipListComponent,
                  JobListComponent,
                  JobCreationComponent,
                  ProjectListComponent,
                  ProjectShipListComponent,
                  ProjectCreationComponent,
                  JobLibraryListComponent,
                  JobLibraryCreationComponent,
                  DockyardListComponent,
                  DockyardCreationComponent,
                  ProfileComponent,
                  OrganizationJobListComponent,
                  OrganizationJobLibraryCreationComponent,
                  ShipDashboardComponent,
                  VesselDocTypeListComponent,
                  ProjectCloserComponent,
                  ReportComponent,
                  Uppercase,
                  CounterDirective,
                  CopyFromOldJobComponent,
                  DefectCreationComponent,
                  DefectListComponent                  
                ],
    providers:[UtilityService]    
})
export class CoreModule { }
