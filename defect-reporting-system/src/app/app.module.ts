import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthIntercepter } from './auth.intercepter';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxTreeDndModule } from '../../projects/ngx-tree-dnd/src/public_api';

import { SharedPipesModule } from './shared/pipes/shared-pipes.module';

import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';

import { SelectComponent } from './selectComponent/selectComponent.component';
import { SelectComponentService } from './selectComponent/selectComponent.service';

import { SelectComponentForApplicationJob } from './selectComponentForApplicationJob/selectComponentForApplicationJob.component';
import { SelectComponentForApplicationJobService } from './selectComponentForApplicationJob/selectComponentForApplicationJob.service';

import { SelectJob } from './selectJob/selectJob.component';
import { SelectJobService } from './selectJob/selectJob.service';

import { SelectAttachmentFromVessel } from './selectAttachmentFromVessel/selectAttachmentFromVessel.component';
import { SelectAttachmentFromVesselService } from './selectAttachmentFromVessel/selectAttachmentFromVessel.service';

import { PreviewJob } from './previewJob/previewJob.component';
import { PreviewJobService } from './previewJob/previewJob.service';

import { PreviewProject } from './previewProject/previewProject.component';
import { PreviewProjectService } from './previewProject/previewProject.service';

import { NewPreviewJob } from './newPreviewJob/newPreviewJob.component';
import { NewPreviewJobService } from './newPreviewJob/newPreviewJob.service';

import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AlertDialogService } from './alert-dialog/alert-dialog.service';

import { JoblistModal } from './joblistModal/joblistModal.component';
import { JobListModalService } from './joblistModal/joblistModal.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    /* for development
    return new TranslateHttpLoader(
        http,
        '/start-angular/SB-Admin-BS4-Angular-6/master/dist/assets/i18n/',
        '.json'
    ); */
    return new TranslateHttpLoader(http, 'rest/resource/loadLanguageJSON/', '.json');
};

@NgModule({
    imports: [
        NgxTreeDndModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgbModule.forRoot(),
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedPipesModule
    ],
    // tslint:disable-next-line:max-line-length
    declarations: [AppComponent, ConfirmationDialogComponent, AlertDialogComponent, SelectComponent, SelectJob, SelectAttachmentFromVessel, SelectComponentForApplicationJob, PreviewJob, NewPreviewJob, PreviewProject, JoblistModal],
    providers: [
                {provide: HTTP_INTERCEPTORS, useClass: AuthIntercepter, multi: true },
                AuthGuard,
                ConfirmationDialogService,
                SelectComponentService,
                SelectComponentForApplicationJobService,
                SelectJobService,
                SelectAttachmentFromVesselService,
                PreviewJobService,
                PreviewProjectService,
                NewPreviewJobService,
                AlertDialogService,
                JobListModalService
                ],
    bootstrap: [AppComponent],
    // tslint:disable-next-line:max-line-length
    entryComponents: [ConfirmationDialogComponent, AlertDialogComponent, SelectComponent, SelectJob,SelectAttachmentFromVessel, SelectComponentForApplicationJob, PreviewJob, NewPreviewJob, PreviewProject, JoblistModal]
})
export class AppModule {}
