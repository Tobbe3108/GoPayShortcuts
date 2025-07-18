import { ProductsResponse } from "../../goPay/types";
import { formatAmount } from "../Shared/priceUtils";

export type GetProductsResponse = {
  id: number;
  name: string;
  price: number;
};

export function extractProducts(response: ProductsResponse): GetProductsResponse[] {
  // Check if menus exist
  if (!response.menues || response.menues.length === 0) {
    return [];
  }

  // Get the first menu
  const menu = response.menues[0];
  
  // Check if product groups exist
  if (!menu.productGroups || menu.productGroups.length === 0) {
    return [];
  }

  // Try to find the "Kantinemad" group, or fall back to the first group
  const productGroup = menu.productGroups.find((group) => group.name === "Kantinemad") || menu.productGroups[0];
  
  // If no product group was found, return empty array
  if (!productGroup || !productGroup.products) {
    return [];
  }

  // Map the products
  return productGroup.products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatAmount(product.price?.amount, product.price?.scale),
  }));
}
