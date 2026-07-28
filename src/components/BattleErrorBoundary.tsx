import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorDetails?: string;
}

export class BattleErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorDetails: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("BattleArena uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorDetails: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-slate-950/90 border-2 border-cyan-500/40 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(6,182,212,0.15)] m-2 space-y-4">
          <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-hud font-extrabold tracking-widest text-cyan-300 uppercase">
              Combat Arena Re-Syncing
            </h3>
            <p className="text-[11px] font-mono text-slate-400 max-w-md mx-auto">
              Simulated telemetry recovered safely. Click below to restore full arena operational status.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-950 to-blue-900 hover:from-cyan-900 hover:to-blue-800 text-cyan-200 font-hud text-xs font-black uppercase tracking-wider rounded-xl border border-cyan-500/50 flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            REINITIALIZE ARENA
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

