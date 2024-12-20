import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import UsersAndGroups from './pages/identity/UsersAndGroups';
import ResourceGroups from './pages/identity/ResourceGroups';
import Subnets from './pages/networking/Subnets';
import DNS from './pages/networking/DNS';
import DataSources from './pages/system/DataSources';
import AuthLayout from './components/AuthLayout';

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AuthLayout />}>
            <Route path="identity">
              <Route path="users" element={<UsersAndGroups />} />
              <Route path="resource-groups" element={<ResourceGroups />} />
              <Route index element={<Navigate to="users" replace />} />
            </Route>
            <Route path="networking">
              <Route path="subnets" element={<Subnets />} />
              <Route path="dns" element={<DNS />} />
              <Route index element={<Navigate to="subnets" replace />} />
            </Route>
            <Route path="system">
              <Route path="data-sources" element={<DataSources />} />
              <Route index element={<Navigate to="data-sources" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard/identity/users" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}