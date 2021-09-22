interface DAO<T> {
  exists(t: T): Promise<boolean>;
  delete(t: T): Promise<T>;
  getById(id: string): Promise<T>;
  save(t: T): Promise<T>;
}

export default DAO;
