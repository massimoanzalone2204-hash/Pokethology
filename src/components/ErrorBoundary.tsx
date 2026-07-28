import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 m-4 bg-slate-900 border border-red-900/50 rounded-xl shadow-lg text-center max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
          <h2 className="text-xl font-black text-red-400 uppercase tracking-widest font-hud mb-2">System Error</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {this.state.error?.message || "A critical UI component encountered an unexpected fault."}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-cyan-400 font-bold uppercase tracking-wider text-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reboot Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
