import type { OrderLine } from './orderLine';

export interface TemplateOrder {
  id: string; // unique id for this template-order
  locationId: number; // single kitchen/location id
  orderlines: OrderLine[]; // same shape as SimplifiedOrder.orderlines
  notes?: string;
}

export interface DefaultTemplate {
  id: string;
  name?: string;
  orders: TemplateOrder[]; // one or many
  createdAt: string;
  updatedAt: string;
}

export default {} as unknown as {
  TemplateOrder: TemplateOrder;
  DefaultTemplate: DefaultTemplate;
};
