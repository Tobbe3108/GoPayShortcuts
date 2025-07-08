import { contentJson, Str } from "chanfana";
import { z } from "zod";

export class Schemas {
  static InternalServerError() {
    return {
      "500": {
        description: "Internal Server Error",
        ...contentJson(
          z.object({
            message: Str({ example: "Internal Server Error" }),
            error: z.any(),
          })
        ),
      },
    };
  }
}
