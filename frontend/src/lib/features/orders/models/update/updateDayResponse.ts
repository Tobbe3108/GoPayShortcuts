import type { UpdateDayOrder } from './updateDayOrder';

export interface UpdateDayResponse {
	canceled: UpdateDayOrder[];
	created: UpdateDayOrder[];
}
