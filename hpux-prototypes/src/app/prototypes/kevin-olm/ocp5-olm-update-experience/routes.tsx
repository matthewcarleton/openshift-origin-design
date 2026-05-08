/**
 * OCP 5.x OLM update experience — routes
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteConfig } from '@app/core/types';
import { OlmUpdateExperiencePage } from './pages/OlmUpdateExperiencePage';

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/core/home/overview" replace />,
    title: 'Home',
  },
  {
    path: '/core/home/overview',
    element: <OlmUpdateExperiencePage />,
    label: 'Overview',
    title: 'OLM update experience',
    navigation: {
      group: 'Home',
      order: 1,
    },
  },
];
