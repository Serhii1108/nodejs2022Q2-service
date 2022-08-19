import { ValueTransformer } from 'typeorm';

export class IntTransformer implements ValueTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseInt(data);
  }
}
