import { Marker } from 'interfaces/maker';

export class Helpers {
  public static origins(data: Marker): string {
    return `${data.lat},${data.lng}`;
  }

  public static destinations(data: Marker[]): string[] {
    return data.map((item) => {
      return this.origins(item);
    });
  }
}
