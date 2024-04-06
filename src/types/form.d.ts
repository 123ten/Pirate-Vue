import {Rule} from "ant-design-vue/es/form";

export type FormSearchType = "input" | "select" | "radio" | 'date';

export interface IOptions {
  label?: string;
  value?: any;
}

export type Rules = Record<string, Rule[] | undefined>
