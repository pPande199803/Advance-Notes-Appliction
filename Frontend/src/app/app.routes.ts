import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', redirectTo: 'notes', pathMatch: 'full' },
    { path: 'notes', loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then((m) => m.RegisterComponent) },
    { path: 'forget-password', loadComponent: () => import('./components/forget-password/forget-password.component').then((m) => m.ForgetPasswordComponent) },
    { path: 'reset-password/:token', loadComponent: () => import('./components/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent) },


];


