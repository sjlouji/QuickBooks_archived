import React, {lazy} from 'react';
import LoginPage from './Pages/Auth/LoginPage/LoginPage';
import RegisterPage from './Pages/Auth/RegisterPage/RegisterPage';
import ForgotPasswordPage from './Pages/Auth/PasswordResetPage/ForgotPasswordPage';
import ResetPasswordPage from './Pages/Auth/PasswordResetPage/ResetPassword';
import HomePage from './Pages/Books/Home';

const routes = [
  {
    path: '/auth/login',
    exact: true,
    component: () => <LoginPage />
  },
  {
    path: '/auth/register',
    exact: true,
    component: () => <RegisterPage />
  },
  {
    path: '/auth/reset',
    exact: true,
    component: () => <ForgotPasswordPage />
  },
  {
    path: '/auth/password/:token',
    exact: true,
    component: () => <ResetPasswordPage />
  },
  {
    route: '*',
    component: HomePage,
    exact: true,
    routes: [
        {
          path: '/',
          exact: true,
          component: lazy(() => import('./Pages/Books/Dashboard/Dashboard'))
        },
        {
          path: '/accounts',
          exact: true,
          component: lazy(() => import('./Pages/Books/Accounts/Accounts'))
        },
        {
          path: '/profile',
          exact: true,
          component: lazy(() => import('./Pages/Books/ProfilePage/ProfilePage'))
        },
    ]
  },
];

export default routes;