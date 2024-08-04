import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'add', component: AddEditComponent },
    { path: 'edit/:id', component: AddEditComponent }
  ];
