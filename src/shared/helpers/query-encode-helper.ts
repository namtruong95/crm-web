import { QueryEncoder } from '@angular/http';

export class QueryEncodeHelper extends QueryEncoder {
  encodeKey(k: string): string {
    k = super.encodeKey(k);
    return k.replace(/\+/gi, '%2B').replace(/\_/gi, '%5F');
  }
  encodeValue(v: string): string {
    v = super.encodeValue(v);
    return v.replace(/\+/gi, '%2B').replace(/\_/gi, '%5F');
  }
}
