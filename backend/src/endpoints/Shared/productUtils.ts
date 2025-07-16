import { ProductsResponse } from "../../goPay/types";
import { formatAmount } from "../Shared/priceUtils";

export type GetProductsResponse = {
  id: number;
  name: string;
  price: number;
};

export function extractProducts(response: ProductsResponse): GetProductsResponse[] {
  return response.menues[0].productGroups
    .find((group) => group.name === "Kantinemad")
    .products.map((product) => ({
      id: product.id,
      name: product.name,
      price: formatAmount(product.price?.amount, product.price?.scale),
    }));
}
