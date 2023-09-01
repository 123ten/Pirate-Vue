type TypeSearchType = "input" | "select" | "radio";
interface IOptions<T> {
  label: string;
  value: T<value>;
}

export { TypeSearchType, IOptions };
