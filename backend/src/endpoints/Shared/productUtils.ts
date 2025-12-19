import { ProductsResponse } from "../../goPay/types";
import { formatAmount } from "../Shared/priceUtils";

export type GetProductsResponse = {
  id: number;
  name: string;
  price: number;
};

export function extractProducts(
  response: ProductsResponse
): GetProductsResponse[] {
  if (!response.menues || response.menues.length === 0) {
    return [];
  }

  const menu = response.menues[0];
  if (!menu.productGroups || menu.productGroups.length === 0) {
    return [];
  }

  const productGroups = menu.productGroups.filter(
    (group) => group.name === "Kantinemad" || group.name === "Gæster"
  );
  if (!productGroups || productGroups.length === 0) {
    return [];
  }

  const products = productGroups.flatMap((group) => group.products);

  const mapped = products.map(
    (product) =>
      ({
        id: product.id,
        name: product.name,
        price: formatAmount(product.price?.amount, product.price?.scale),
      } as GetProductsResponse)
  );

  return mapped;
}
