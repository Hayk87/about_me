import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import * as adminPages from '../admin-pages';
import * as webPages from '../web-pages';
import { AuthController } from './auth-controller';
import GlobalLayout from '../Layouts/GlobalLayout';
import { checkPermission, applicationBaseURL } from '../utils';

interface IPath {
    path: string;
    element: React.ReactElement
}

const privatePages = [
  adminPages.DashboardPage,
];
const privatePagesByPermission = [
  adminPages.TranslatesPage,
  adminPages.TranslatesCreateNewPage,
  adminPages.TranslatesUpdateExistsPage,
  adminPages.StaffsPage,
  adminPages.StaffsCreateNewPage,
  adminPages.StaffsUpdateExistsPage,
  adminPages.SystemUsersPage,
  adminPages.SystemUsersCreateNewPage,
  adminPages.SystemUsersUpdateExistsPage,
  adminPages.OfferPage,
  adminPages.OfferUpdateExistsPage,
  // adminPages.MeasurementPage,
  // adminPages.MeasurementCreateNewPage,
  // adminPages.MeasurementUpdateExistsPage,
  // adminPages.ProductCategoriesPage,
  // adminPages.ProductCategoriesCreateNewPage,
  // adminPages.ProductCategoriesUpdateExistsPage,
  // adminPages.ProductsPage,
  // adminPages.ProductsCreateNewPage,
  // adminPages.ProductsUpdateExistsPage,
  // adminPages.TransactionImportsPage,
  // adminPages.TransactionImportsCreateNewPage,
  // adminPages.TransactionImportsUpdateExistsPage,
  // adminPages.TransactionExportsPage,
  // adminPages.TransactionExportsCreateNewPage,
  // adminPages.TransactionExportsUpdateExistsPage,
  // adminPages.ReportsPage,
];
let authPaths: IPath[] = [];

for (const Page of privatePages) {
    authPaths.push({
        path: Page.path,
        element: <Page.default />
    });
}

const webPagesList = [
  webPages.MainPage,
  webPages.AboutMePage,
];

export default function(authData: any) {
    const isLogin = !!authData?.id;
    const paths = [];
    if (!isLogin) {
        // Not Authorized
        paths.push(
            {
                path: adminPages.LoginPage.path,
                element: <adminPages.LoginPage.default />
            },
            ...([...privatePages, ...privatePagesByPermission].map(Page => ({
                path: Page.path,
                element: <AuthController redirectTo={`/${applicationBaseURL ? `${applicationBaseURL}/` : ''}${adminPages.LoginPage.path}`} />
            }))),
            {
                path: '',
                element: <AuthController redirectTo={`/${applicationBaseURL ? `${applicationBaseURL}/` : ''}${adminPages.LoginPage.path}`} withoutQueryParams />
            },
            {
                path: '*',
                element: <adminPages.PageNotFoundPage.default />
            }
        );
    } else {
        // Authorized
        paths.push(...authPaths);
        for (const Page of privatePagesByPermission) {
          paths.push({
            path: `${Page.path}`,
            element: Page.viewPagePermission && checkPermission(authData, Page.viewPagePermission) ?
                      <Page.default /> : <adminPages.RequestForbiddenPage.default />
          });
        }
        paths.push(
            {
                path: adminPages.LoginPage.path,
                element: (
                    <AuthController redirectTo={`/${applicationBaseURL ? `${applicationBaseURL}/` : ''}${adminPages.DashboardPage.path}`} checkRedirect />
                )
            },
            {
              path: '',
              element: <AuthController redirectTo={`/${applicationBaseURL ? `${applicationBaseURL}/` : ''}${adminPages.DashboardPage.path}`} checkRedirect />
            },
            {
                path: '*',
                element: <adminPages.PageNotFoundPage.default />
            }
        );
    }

    return createBrowserRouter([
        {
            path: `/${applicationBaseURL ? `${applicationBaseURL}/` : ''}`,
            element: <GlobalLayout />,
            children: paths
        },
        ...webPagesList.map(Page => ({
          path: `/${Page.path}`,
          element: <Page.default />
        }))
        // {
        //     path: '',
        //     element: <Navigate to={`/${applicationBaseURL}`} />
        // }
    ]);
}
