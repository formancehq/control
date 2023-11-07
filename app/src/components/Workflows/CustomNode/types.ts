export type CustomNodeProps = {
  data: {
    label: string;
    details: any; // TODO make type
    isHighLevel: boolean;
    isLowLevel: boolean;
  };
  isConnectable: boolean;
  id: string;
  width?: number;
  type: string;
};
