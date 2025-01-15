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

  map<U>(fn: (value: T) => U): Result<U> {
    if (this.isSuccess) {
      try {
        const result = fn(this.value!);
        return Result.ok(result);
      } catch (error) {
        return Result.fail(`Error in map: ${error.message}`);
      }
    }
    return Result.fail(this.error!);
  }

  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isSuccess) {
      try {
        return fn(this.value!);
      } catch (error) {
        return Result.fail(`Error in flatMap: ${error.message}`);
      }
    }
    return Result.fail(this.error!);
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
