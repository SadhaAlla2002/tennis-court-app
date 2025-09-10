import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { EmptyState } from './EmptyState';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <EmptyState
          icon={<AlertTriangle />}
          title="Something went wrong"
          description="An unexpected error occurred. Please try refreshing the page."
          action={{
            label: "Try Again",
            onClick: this.handleRetry
          }}
        />
      );
    }

    return this.props.children;
  }
}