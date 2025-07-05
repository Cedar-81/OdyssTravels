import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }: any) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "black",
          "--normal-border": "#e5e7eb",
          "--success-bg": "#f0fdf4",
          "--success-text": "#166534",
          "--success-border": "#bbf7d0",
          "--error-bg": "#fef2f2",
          "--error-text": "#dc2626",
          "--error-border": "#fecaca",
          "--warning-bg": "#fffbeb",
          "--warning-text": "#d97706",
          "--warning-border": "#fed7aa",
          "--info-bg": "#eff6ff",
          "--info-text": "#1d4ed8",
          "--info-border": "#bfdbfe",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          borderRadius: '12px',
          border: '1px solid var(--normal-border)',
          fontSize: '14px',
          fontWeight: '500',
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

export { Toaster }
