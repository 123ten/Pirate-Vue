import {Rule} from "ant-design-vue/es/form";

type TypeSearchType = "input" | "select" | "radio" | 'date';

interface IOptions {
  label?: string;
  value?: any;
}

type Rules = Record<string, Rule[] | undefined>

export {
  TypeSearchType,
  IOptions,
  Rules
};
