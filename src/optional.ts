export class Optional<K> {

  public static of<T>(target: T | undefined | null) {
    return new Optional(target);
  }

  private constructor(private readonly target?: K) {
  }

  public ifPresent(fn: (target: NonNullable<K>) => any) {
    if (this.isPresent()) fn(this.target!);
  }

  public isPresent() {
    return this.target !== undefined && this.target !== null;
  }

  public map<T>(fn: (target: NonNullable<K>) => T): Optional<T> {
    if (!this.isPresent()) {
      return new Optional<T>(undefined);
    }
    const value = fn(this.target!);
    return new Optional<T>(value);
  }

  public mapTo<T>(fn: (target: NonNullable<K>) => T): T | undefined {
    if (this.isPresent()) {
      return fn(this.target!);
    }
  }

  public value(): NonNullable<K> {
    return this.target!;
  }

  public orElse(value: K | null | undefined): NonNullable<K> {
    return this.isPresent() ? this.target! : value!;
  }
}