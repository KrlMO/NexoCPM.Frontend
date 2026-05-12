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
            },
            {
                path: 'syllabi',
                loadComponent: () => import('./features/curriculum/pages/syllabi/syllabi').then(m => m.Syllabi)
            },
            {
                path:'me',
                loadComponent: () => import('./features/users/pages/profile/profile').then(m => m.Profile)
            },
            {
                path: 'progress',
                loadComponent: () => import('./features/dashboard/pages/preparation-dashboard/preparation-dashboard').then(m => m.PreparationDashboard)
            },
            {
                path: 'my-syllabi/:learningContextId/:slug',
                loadComponent: () => import('./features/curriculum/pages/syllabus-detail/syllabus-detail').then(m => m.SyllabusDetail)
            },
            {
                path: 'my-syllabi',
                loadComponent: () => import('./features/curriculum/pages/my-syllabi/my-syllabi').then(m => m.MySyllabi)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }
];
