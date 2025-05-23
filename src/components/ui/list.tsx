import React from "react";

interface CustomListProps {
  items: React.ReactNode[];
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
}

const CustomList: React.FC<CustomListProps> = ({ items, style, itemStyle }) => (
  <ul style={style}>
    {items.map((item, idx) => (
      <li key={idx} style={itemStyle}>
        {item}
      </li>
    ))}
  </ul>
);

export default CustomList;