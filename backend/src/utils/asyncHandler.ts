import { Context } from "hono"

export const asyncHandler = (
  fn: (c: Context) => Promise<Response>
) => {
  return async (c: Context) => {
    try {
      return await fn(c)
    } catch (error) {
      throw error
    }
  }
}

