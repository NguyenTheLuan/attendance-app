import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="page"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <h1>❌ Đã xảy ra lỗi</h1>
          <p style={{ color: "#888", margin: "16px 0" }}>
            {this.state.error?.message || "Vui lòng thử lại sau."}
          </p>
          <button
            className="btn-primary"
            style={{ maxWidth: 200, margin: "0 auto" }}
            onClick={this.handleRetry}
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
