import { createHashRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageView } from '@/routes/PageView';
import { AlertsView } from '@/routes/AlertsView';
import { NewTabView } from '@/routes/NewTabView';

const router = createHashRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <PageView pageId="home" /> },
        { path: 'p/:pageId', element: <PageView /> },
        { path: 'p/:pageId/:tabId', element: <PageView /> },
        { path: 'new-tab', element: <NewTabView /> },
        { path: 'alerts', element: <AlertsView /> },
        { path: 'alerts/:subPage', element: <AlertsView /> },
      ],
    },
  ],
  { basename: '/' }
);

export default function App() {
  return <RouterProvider router={router} />;
}
