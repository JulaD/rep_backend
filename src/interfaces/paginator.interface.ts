export default interface Paginator<T> {
  count: number;
  rows: T[];
}
