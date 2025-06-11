import React from "react";

export const Table = ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <table style={{ width: "100%", borderCollapse: "collapse" }} {...props}>{children}</table>
);

export const Thead = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...props}>{children}</thead>
);

export const Tbody = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props}>{children}</tbody>
);

export const Tr = ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props}>{children}</tr>
);

export const Th = ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th style={{ borderBottom: "2px solid #eee", padding: 8, textAlign: "left" }} {...props}>{children}</th>
);

export const Td = ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td style={{ borderBottom: "1px solid #eee", padding: 8 }} {...props}>{children}</td>
);