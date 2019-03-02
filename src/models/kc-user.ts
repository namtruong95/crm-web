import { Deserializable } from 'shared/interfaces/deserializable';

interface KeyCloakUserInterface {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

export class KeyCloakUser implements Deserializable<KeyCloakUser> {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;

  deserialize(input: Partial<KeyCloakUserInterface>): KeyCloakUser {
    Object.assign(this, input);
    this.fullName = input.fullName || `${input.firstName || ''} ${input.lastName || ''}`.trim() || input.username;
    return this;
  }
}
