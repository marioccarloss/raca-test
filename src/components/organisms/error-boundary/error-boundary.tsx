import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './error-boundary.module.scss';

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: ErrorInfo | undefined;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>Algo salió mal</h2>
            <p className={styles.message}>
              Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta
              recargar la página.
            </p>

            <div className={styles.actions}>
              <button className={styles.button} onClick={this.handleReset}>
                Intentar de nuevo
              </button>
              <button
                className={styles.button}
                onClick={() => window.location.reload()}
              >
                Recargar página
              </button>
            </div>

            {import.meta.env.MODE === 'development' && this.state.error && (
              <details className={styles.details}>
                <summary className={styles.summary}>Detalles del error</summary>
                <pre className={styles.error}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
