import React from "react";

export interface HTMLElementProps {
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  role?: string;
}

export interface IAxis {
  x: number;
  y: number;
}

export interface ICacheSizes {
  sizes: (string | number)[];
  sashPosSizes: (string | number)[];
}

export interface ISplitProps extends HTMLElementProps {
  autoSaveId?: string;
  allowResize?: boolean;
  direction: "vertical" | "horizontal";
  sashRender?: (index: number, active: boolean) => React.ReactNode;
  onChange?: (sizes: number[]) => void;
  onDragStart?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDragEnd?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  sashClassName?: string;
  sashStyle?: React.CSSProperties;
  sashSize?: number;
}

export interface ISashProps {
  sashRef?: React.LegacyRef<HTMLDivElement>;
  className?: string;
  style: React.CSSProperties;
  render: (active: boolean) => React.ReactNode;
  onDragStart: React.MouseEventHandler<HTMLDivElement>;
  onDragging: React.MouseEventHandler<HTMLDivElement>;
  onDragEnd: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick: React.MouseEventHandler<HTMLDivElement>;
}

export interface ISashContentProps {
  className?: string;
  active?: boolean;
  children?: JSX.Element[];
}

export interface IPaneConfigs {
  id: string;
  paneRef?: React.LegacyRef<HTMLDivElement>;
  maxSize?: number | string;
  minSize?: number | string;
  snapSize?: number | string;
  initialSize?: number | string;
  collapsed?: boolean;
}
