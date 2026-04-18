import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/pages/register/register').then(m => m.Register)
            }
        ]
    }
];
