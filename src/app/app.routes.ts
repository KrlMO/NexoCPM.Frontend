import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { PublicLayout } from './layout/public-layout/public-layout';

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
            },
            {
                path: 'verify-email',
                loadComponent: () => import('./features/auth/pages/verify-email/verify-email').then(m => m.VerifyEmail)
            }
        ]
    },
    {
        path: '',
        component: PublicLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/public/pages/home/home').then(m => m.Home)
            },
            {
                path: '404',
                loadComponent: () => import('./features/public/pages/not-found/not-found').then(m => m.NotFound)
            }
        ]
    },
    {
        path: 'app',
        component: PublicLayout,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./features/app/pages/home/home').then(m => m.Home)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }
];
