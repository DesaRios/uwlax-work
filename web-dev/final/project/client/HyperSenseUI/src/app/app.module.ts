import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { SidebarRightComponent } from './sidebar-right/sidebar-right.component';
import { SidebarLeftComponent } from './sidebar-left/sidebar-left.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHistoryComponent } from './dashboard-history/dashboard-history.component';
import { DashboardRoutinesComponent } from './dashboard-routines/dashboard-routines.component';
import { DashboardCurrentComponent } from './dashboard-current/dashboard-current.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DashboardRoutinesNewComponent } from './dashboard-routines-new/dashboard-routines-new.component';
import { WorkoutSidebarComponent } from './workout-sidebar/workout-sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from './auth-guard.service';
import { inject } from '@angular/core';
import { AdminComponent } from './admin/admin.component';
import { AdminWorkoutsComponent } from './admin-workouts/admin-workouts.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
 

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: "dashboard/history", component: DashboardHistoryComponent},
  { path: "dashboard/routines", component: DashboardRoutinesComponent},
  { path: "dashboard/current", component: DashboardCurrentComponent},
  { path: "user-settings", component: UserSettingsComponent},
  { path: "create-account", component: CreateAccountComponent},
  { path: "dashboard/routines/new", component: DashboardRoutinesNewComponent},
  { path: "admin", component: AdminComponent},
  { path: "admin/workouts", component: AdminWorkoutsComponent},
  { path: "admin/users", component: AdminUsersComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SidebarRightComponent,
    SidebarLeftComponent,
    DashboardComponent,
    DashboardHistoryComponent,
    DashboardRoutinesComponent,
    DashboardCurrentComponent,
    UserSettingsComponent,
    CreateAccountComponent,
    DashboardRoutinesNewComponent,
    WorkoutSidebarComponent,
    AdminComponent,
    AdminWorkoutsComponent,
    AdminUsersComponent,
    WorkoutFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [RouterModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
