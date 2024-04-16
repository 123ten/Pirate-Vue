import {Rule} from "ant-design-vue/es/form";
import {Dayjs} from "dayjs";

export type QueryFormType = "input" | "select" | "radio" | 'date-picker' | 'range-picker';

export interface IOptions {
  label?: string;
  value?: any;
}

export type Rules = Record<string, Rule[] | undefined>

export type DateRangeTuple = [Dayjs?, Dayjs?]
