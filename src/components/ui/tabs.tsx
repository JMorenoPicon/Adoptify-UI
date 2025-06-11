import React from "react";

export const TabsRoot = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);

export const TabList = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 16 }} {...props}>{children}</div>
);

export const Tab = ({ children, selected, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) => (
  <button
    style={{
      padding: "8px 16px",
      background: selected ? "#FF7F1E" : "#FFF4E6",
      color: selected ? "white" : "#E66F1A",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      fontWeight: selected ? "bold" : "normal",
    }}
    {...props}
  >
    {children}
  </button>
);

export const TabPanels = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);

export const TabPanel = ({ children, hidden, ...props }: React.HTMLAttributes<HTMLDivElement> & { hidden?: boolean }) =>
  hidden ? null : <div {...props}>{children}</div>;