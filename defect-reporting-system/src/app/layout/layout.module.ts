import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthIntercepter } from '../auth.intercepter';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        HttpClientModule,
        NgbDropdownModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
    providers: [{provide: HTTP_INTERCEPTORS,useClass: AuthIntercepter,multi: true }],
})
export class LayoutModule {}
