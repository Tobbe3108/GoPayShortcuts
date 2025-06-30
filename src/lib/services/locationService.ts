import type { Location } from "$lib/types/orders"
import { api } from "$lib/services/apiService"

interface LocationApiResponse {
  name: string
  kitchens: Array<{
    id: number
    name: string
    webshops?: Array<{ uid: string }>
  }>
}

export const locationService = {
  async getLocations(): Promise<Location[]> {
    try {
      const response = await api<LocationApiResponse[]>(
        '/organization/company/user/locations'
      )
      console.log("Locations fetched raw: ", response)
      return response
        .map(location => {
          const primaryKitchen = location.kitchens?.[0]
          if (!primaryKitchen) return null
          const primaryWebshop = primaryKitchen.webshops?.[0]
          if (!primaryWebshop) return null
          return {
            displayName: location.name,
            name: primaryKitchen.name,
            kitchenId: primaryKitchen.id,
            webshopId: primaryWebshop.uid
          }
        })
        .filter(Boolean) as Location[]
    } catch (error) {
      console.error('Failed to fetch locations:', error)
      throw new Error('Failed to fetch locations')
    }
  }
}
