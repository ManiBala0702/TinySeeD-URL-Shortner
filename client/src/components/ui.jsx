import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ─── Toast System ──────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = "info", duration = 3500 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast }) {
  const icons = {
    success: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  const colors = {
    success: "text-[#00d4aa] bg-[#00d4aa]/10 border-[#00d4aa]/20",
    error: "text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20",
    info: "text-[#7c6ff7] bg-[#7c6ff7]/10 border-[#7c6ff7]/20",
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl
        bg-[#0d1322]/95 border-[#1e2d45] ${toast.exiting ? "toast-exit" : "toast-enter"}`}
    >
      <span className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ${colors[toast.type]}`}>
        {icons[toast.type]}
      </span>
      <p className="text-sm font-medium text-[#f0f4ff]">{toast.message}</p>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} />;
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

export function StatCard({ title, value, subtitle, icon, accent = "teal", trend }) {
  const accents = {
    teal: {
      icon: "bg-[#00d4aa]/10 text-[#00d4aa]",
      value: "gradient-text-teal",
      glow: "hover:shadow-[0_0_30px_rgba(0,212,170,0.08)]",
    },
    violet: {
      icon: "bg-[#7c6ff7]/10 text-[#7c6ff7]",
      value: "gradient-text-violet",
      glow: "hover:shadow-[0_0_30px_rgba(124,111,247,0.08)]",
    },
    blue: {
      icon: "bg-[#3b82f6]/10 text-[#3b82f6]",
      value: "text-[#3b82f6]",
      glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]",
    },
  };
  const a = accents[accent] || accents.teal;

  return (
    <div className={`glass-card gradient-border rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 ${a.glow} cursor-default`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#4a5a76]">{title}</span>
        <span className={`flex items-center justify-center w-9 h-9 rounded-xl ${a.icon}`}>{icon}</span>
      </div>
      <div className={`text-4xl font-bold tracking-tight ${a.value}`}>{value}</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#8b9cba]">{subtitle}</span>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend > 0 ? "bg-[#00d4aa]/10 text-[#00d4aa]" : "bg-[#f87171]/10 text-[#f87171]"}`}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center text-[#4a5a76] mb-5">
        {icon || (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 015.656 0l1 1a4 4 0 01-5.657 5.657l-1-1" />
          </svg>
        )}
      </div>
      <h3 className="text-base font-semibold text-[#f0f4ff] mb-2">{title}</h3>
      <p className="text-sm text-[#8b9cba] max-w-xs leading-relaxed mb-6">{description}</p>
      {action}
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────────

export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-[#1e2d45] text-[#8b9cba]",
    teal: "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20",
    violet: "bg-[#7c6ff7]/10 text-[#7c6ff7] border border-[#7c6ff7]/20",
    red: "bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20",
    amber: "bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ─── Button ────────────────────────────────────────────────────────────────────

export function Button({ children, variant = "primary", size = "md", className = "", loading, ...props }) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "bg-transparent text-[#8b9cba] hover:text-[#f0f4ff] hover:bg-[#111827] border border-transparent hover:border-[#1e2d45]",
    danger: "bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20 hover:bg-[#f87171]/20",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200
        ${sizes[size]} ${variants[variant]} ${loading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────────

export function Input({ label, error, icon, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-semibold text-[#8b9cba] uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5a76]">{icon}</span>
        )}
        <input
          className={`input-dark w-full h-11 ${icon ? "pl-10" : "pl-4"} pr-4 text-sm ${error ? "border-[#f87171]/50 focus:border-[#f87171]/70" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#f87171]">{error}</p>}
    </div>
  );
}
