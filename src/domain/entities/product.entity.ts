export class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
