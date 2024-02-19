type TDisplay = "flex" | "block" | "inline-block" | "inline" | "grid";

type TStyle = {
  [property: string]: string;
  minWidth?: string;
  whiteSpace?: string;
  overflow?: string;
  display?: TDisplay;
  textOverflow?: string;
};

export { TStyle };
