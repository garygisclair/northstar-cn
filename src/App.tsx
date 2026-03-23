import { createHashRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageView } from '@/routes/PageView';
import { BrowseView } from '@/routes/BrowseView';

const router = createHashRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <PageView pageId="home" /> },
        { path: 'p/:pageId', element: <PageView /> },
        { path: 'p/:pageId/:tabId', element: <PageView /> },
        { path: 'browse', element: <BrowseView /> },
      ],
    },
  ],
  { basename: '/' }
);

export default function App() {
  return <RouterProvider router={router} />;
}
