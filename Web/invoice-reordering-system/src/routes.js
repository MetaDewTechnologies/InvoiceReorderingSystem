import React from "react";
import { Navigate } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import ManageInvoiceListing from "./views/ManageInvoice/Pages/Listing";
import DashboardLayout from "./layouts/DashboardLayout";
import InvoiceAddEdit from "./views/ManageInvoice/Pages/AddEdit";
import ReorderInvoice from "./views/ReorderInvoice/Pages/Listing";
import Invoices from "./views/Invoices/Pages/Listing";
import BillHistory from "./views/BillHistory/Pages/Listing";
import BillHistoryAddEdit from "./views/BillHistory/Pages/AddEdit";

const routes = (isLoggedIn, role) => [
  {
    path: "app",
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: "*", element: <Navigate to="/404" /> },
      {
        path: "manageInvoices",
        children: [
          { path: "listing", element: <ManageInvoiceListing /> },
          { path: "addEdit/:invoiceId", element: <InvoiceAddEdit /> },
        ],
      },
      {
        path: "reorderInvoices",
        children: [
          {
            path: "listing",
            element: role == "ACCOUNTANT" || "ADMIN" ? <ReorderInvoice /> : "",
          },
        ],
      },
      {
        path: "invoices",
        children: [
          {
            path: "listing",
            element: role == "ACCOUNTANT" || "ADMIN" ? <Invoices /> : "",
          },
        ],
      },
      {
        path: "billHistory",
        children: [
          {
            path: "listing",
            element: <BillHistory />,
          },
          { path: "addEdit/:invoiceId", element: <BillHistoryAddEdit /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <LoginView />,
    children: [
      { path: "login", element: <LoginView /> },
      //   {
      //     path: 'newLoader',
      //     element: <LottieLoadingComponent />
      //   },
      //   { path: '404', element: <NotFoundView /> },
      // { path: '/', element: <Navigate to="/newLoader" /> },
      //   { path: '*', element: <Navigate to="/404" /> }
      //   {path:'manageInvoiceListing', element:<Navigate to= "/manageInvoiceListing"/>}
    ],
  },
];
export default routes;
