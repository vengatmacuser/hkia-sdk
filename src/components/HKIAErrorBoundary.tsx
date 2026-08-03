import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HKIAErrorCard } from './HKIAErrorCard';
import { HKIAErrorReport } from '../types/error';
import { HKIALogger } from '../native/logger';

interface Props {
  children: ReactNode;
  onError?: (report: HKIAErrorReport) => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorReport: HKIAErrorReport | null;
}

export class HKIAErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorReport: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    const report: HKIAErrorReport = {
      errorCode: 'ERR_JS_RENDER_CRASH',
      errorMessage: error.message || 'An unexpected rendering error occurred in HKIA SDK',
      userFacingSummary: 'An unexpected component rendering error occurred. Please tap Retry to reload the feature.',
      nativeSource: 'JavaScript',
      timestamp: new Date().toISOString(),
      callStack: error.stack,
    };
    return { hasError: true, errorReport: report };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    HKIALogger.error('HKIA:UI', 'ERROR_BOUNDARY', `Caught JS render crash: ${error.message}`, {
      componentStack: errorInfo.componentStack,
    });
    if (this.props.onError && this.state.errorReport) {
      this.props.onError(this.state.errorReport);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorReport: null });
  };

  public render() {
    if (this.state.hasError && this.state.errorReport) {
      if (this.props.fallback) return this.props.fallback;
      return <HKIAErrorCard errorReport={this.state.errorReport} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
