import { Deserializable } from 'shared/interfaces/deserializable';

export interface BaseModelInterface {
  id: number;
  createdDate: string;
  updatedDate: string;
  userId: number;
}

export class BaseModel implements Deserializable<BaseModel> {
  id: number;
  createdDate: string;
  updatedDate: string;
  userId: number;

  deserialize(input: Partial<BaseModelInterface>): BaseModel {
    Object.assign(this, input);
    return this;
  }
}
