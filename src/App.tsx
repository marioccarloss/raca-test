import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ErrorBoundary } from './components/organisms/error-boundary/error-boundary';
import { Layout } from './components/templates/layout/layout';
import { store } from './store';
import './styles/global.scss';

function AppSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#6c757d',
      }}
    >
      Cargando raca store...
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Suspense fallback={<AppSkeleton />}>
          <Layout />
        </Suspense>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
