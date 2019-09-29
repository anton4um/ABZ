import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { AquaintedComponent } from './aquainted/aquainted.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { CheerfulUsersComponent } from './cheerful-users/cheerful-users.component';
import {HttpService} from './shared/http.service';
import {HttpClientModule} from '@angular/common/http';



import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import {IMaskModule} from 'angular-imask';
import { FooterComponent } from './footer/footer.component';
import { AppMainNavComponent } from './app-main-nav/app-main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import {MatDialogModule} from '@angular/material/dialog';
import {AlertDialogComponent, DialogOverviewDialog} from './alert-dialog/alert-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AssignmentComponent,
    AquaintedComponent,
    RequirementsComponent,
    CheerfulUsersComponent,
    FooterComponent,
    AppMainNavComponent,
    AlertDialogComponent,
    DialogOverviewDialog,
  ],
  entryComponents: [DialogOverviewDialog],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    TextMaskModule,
    IMaskModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
  ],
  providers: [
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
