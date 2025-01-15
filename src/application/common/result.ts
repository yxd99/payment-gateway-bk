export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly error: string | null,
    public readonly value?: T,
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result(true, null, value);
  }

  static fail<T>(error: string): Result<T> {
    return new Result(false, error);
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get the value from a failed result');
    }
    return this.value!;
  }

  getError(): string {
    if (this.isSuccess) {
      throw new Error('No error in a successful result');
    }
    return this.error!;
  }
}
