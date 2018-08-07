interface FieldChange<T> {
  name: string,
  prev: T,
  curr: T
}

export class Field {
  private subscribers: Array<(change: FieldChange<any>) => void> = [];

  constructor(private name: string,
              private value: any) {
  }

  public subscribe<T>(subscriber: (change: FieldChange<T>) => void): void {
    this.subscribers.push(subscriber);
  }


}