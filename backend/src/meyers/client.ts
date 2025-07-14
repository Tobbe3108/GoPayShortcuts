import type { MeyersMenuResponse } from "./types";
import { MenuDataProcessor } from "./MenuDataProcessor";

export class MeyersClient {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getMenu(): Promise<MeyersMenuResponse | Response> {
    const url: string = `${this.apiUrl}/internal/load/frontend`;

    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    const payload = {
      userId: null,
      schoolId: "CxnRNYOtBo6VrqiCb4AA",
      url: "meyers",
      _reloader: 0,
      language: "en",
      path: "load/frontend",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      cf: {
        cacheTtlByStatus: {
          "200-299": 86400 * 7, // 7 days
        },
      },
    });
    if (!response.ok) return response;

    const data: any = await response.json();
    return MenuDataProcessor.extractMenuItems(data);
  }
}
