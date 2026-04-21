declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const AlertCircle: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Check: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Download: LucideIcon;
  export const FileMinus2: LucideIcon;
  export const FileImage: LucideIcon;
  export const FileStack: LucideIcon;
  export const FileText: LucideIcon;
  export const FolderSearch: LucideIcon;
  export const GitMerge: LucideIcon;
  export const GripVertical: LucideIcon;
  export const Infinity: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const Lock: LucideIcon;
  export const Menu: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const RotateCw: LucideIcon;
  export const Scissors: LucideIcon;
  export const Search: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Square: LucideIcon;
  export const Trash2: LucideIcon;
  export const UploadCloud: LucideIcon;
  export const X: LucideIcon;
  export const Zap: LucideIcon;
}
