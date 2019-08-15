import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../shared';

import { OrganizationCreationComponent } from './organization-creation/organization-creation.component';
import { DepartmentCreationComponent } from './department-creation/department-creation.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { RoleFunctionMappingComponent } from './role-function-mapping/role-function-mapping.component';
import { DesignationComponent } from './designation/designation.component';
import { UserCreationComponent } from './user-creation/user-creation.component';

import { DepartmentListComponent } from './department-list/department-list.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { RoleListComponent } from './role-list/role-list.component';
//import { RoleFunctionMapingListComponent } from './role-function-mapping-list/role-function-mapping-list.component';
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
import { ProjectShipListComponent } from './project-ship-list/project-ship-list.component';
import { ProjectCreationComponent } from './project-creation/project-creation.component';
import { JobLibraryListComponent } from './jobLibraryList/jobLibraryList.component';
import { JobLibraryCreationComponent } from './jobLibraryCreation/jobLibraryCreation.component';
import { DockyardListComponent } from './dockyardList/dockyardList.component';
import { DockyardCreationComponent } from './dockyardCreation/dockyardCreation.component';
import { ProfileComponent } from './profile/profile.component';
import { OrganizationJobListComponent } from './organization-job-list/organization-job-list.component';
import { OrganizationJobLibraryCreationComponent } from './organizationJobLibraryCreation/organizationJobLibraryCreation.component';
import { ShipDashboardComponent } from './ship-dashboard/ship-dashboard.component';
import { VesselDocTypeListComponent } from './vesselDocTypeList/vesselDocTypeList.component';
import { CopyFromOldJobComponent } from './copy-from-old-job/copy-from-old-job.component';

import { ProjectCloserComponent } from './project-closer/project-closer.component';
import { ReportComponent } from './report/report.component';

import { DefectCreationComponent } from './defect-creation/defect-creation.component';
import { DefectListComponent } from './defect-list/defect-list.component';

const routes: Routes = [
    { path: 'organization-creation/:id', component: OrganizationCreationComponent, canActivate: [AuthGuard]},
    { path: 'department-creation/:id', component: DepartmentCreationComponent, canActivate: [AuthGuard]},
    { path: 'create-role/:id', component: CreateRoleComponent, canActivate: [AuthGuard]},
    { path: 'role-function-mapping/:id', component: RoleFunctionMappingComponent, canActivate: [AuthGuard]},
    { path: 'designation-master/:id', component: DesignationComponent, canActivate: [AuthGuard]},
    { path: 'user-creation/:id', component: UserCreationComponent, canActivate: [AuthGuard]},

    { path: 'department-list', component: DepartmentListComponent, canActivate: [AuthGuard]},
    { path: 'organization-list', component: OrganizationListComponent, canActivate: [AuthGuard]},
    { path: 'role-list', component: RoleListComponent, canActivate: [AuthGuard]},
    { path: 'designation-list', component: DesignationListComponent, canActivate: [AuthGuard]},
    { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
    { path: 'ship-list', component: ShipListComponent, canActivate: [AuthGuard]},
    { path: 'ship-creation/:id', component: ShipCreationComponent, canActivate: [AuthGuard]},
    { path: 'ship-user-mapping/:id', component: ShipUserMappingComponent, canActivate: [AuthGuard]},
    { path: 'ship-user-mapping-list', component: ShipUserMappingListComponent, canActivate: [AuthGuard]},
    { path: 'application-componemt-list', component: ApplicationComponemtListComponent, canActivate: [AuthGuard]},
    { path: 'organization-componemt-list', component: OrganizationComponemtListComponent, canActivate: [AuthGuard]},
    { path: 'ship-componemt-list', component: ShipComponentListComponent, canActivate: [AuthGuard]},
    { path: 'manage-ship-componemts/:id', component: ManageShipComponentsComponent, canActivate: [AuthGuard]},
    { path: 'job-ship-list', component: JobShipListComponent, canActivate: [AuthGuard]},
    { path: 'job-list/:id', component: JobListComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
    { path: 'job-creation/:id', component: JobCreationComponent, canActivate: [AuthGuard]},
    { path: 'project-ship-list', component: ProjectShipListComponent, canActivate: [AuthGuard]},
    // { path: 'project-list/:id', component: ProjectListComponent, canActivate: [AuthGuard]},
    { path: 'project-list', component: ProjectListComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
    { path: 'project-creation/:id/:shipId', component: ProjectCreationComponent, canActivate: [AuthGuard]},
    { path: 'job-library-list', component: JobLibraryListComponent, canActivate: [AuthGuard]},
    { path: 'job-library-creation/:id', component: JobLibraryCreationComponent, canActivate: [AuthGuard]}, 
    { path: 'dockyard-list', component: DockyardListComponent, canActivate: [AuthGuard]},
    { path: 'dockyard-creation/:id', component: DockyardCreationComponent, canActivate: [AuthGuard]},
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'organization-joblist-Component', component: OrganizationJobListComponent, canActivate: [AuthGuard]},
    { path: 'organization-job-creation/:id', component: OrganizationJobLibraryCreationComponent, canActivate: [AuthGuard]},
    { path: 'ship-dashboard', component: ShipDashboardComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
    { path: 'vessel-doc-type-list', component: VesselDocTypeListComponent, canActivate: [AuthGuard]},
    { path: 'project-closer', component: ProjectCloserComponent, canActivate: [AuthGuard]},
    { path: 'report', component: ReportComponent, canActivate: [AuthGuard]},
    { path: 'copy-from-old-job', component: CopyFromOldJobComponent, canActivate: [AuthGuard]},
    
    { path: 'defect-creation/:id', component: DefectCreationComponent, canActivate: [AuthGuard]},
    { path: 'defect-list', component: DefectListComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule {
}
