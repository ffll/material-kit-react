import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import ProtectedRoute from 'src/components/ProtectedRoute';  // Asegúrate de que esta ruta es correcta

const IndexPage = lazy(() => import('src/pages/app'));
const BlogPage = lazy(() => import('src/pages/contenidos'));
const UserPage = lazy(() => import('src/pages/user'));
const LoginPage = lazy(() => import('src/pages/login'));
const ProductsPage = lazy(() => import('src/pages/products'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <ProtectedRoute element={IndexPage} />, index: true },
        { path: 'user', element: <ProtectedRoute element={UserPage} /> },
        { path: 'products', element: <ProtectedRoute element={ProductsPage} /> },
        { path: 'contenidos', element: <ProtectedRoute element={BlogPage} /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

