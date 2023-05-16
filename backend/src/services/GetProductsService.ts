import { client } from "../database/client";

export class GetProductsService {
  async getProducts() {
    const products = client.products.findMany();

    const serializedProducts = (await products).map((product) => {
      return { ...product, code: product.code.toString() };
    });

    return serializedProducts;
  }
}
