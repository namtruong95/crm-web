export interface Deserializable<T> {
  deserialize(input: Partial<T>): T;
}
