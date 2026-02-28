import { apiError } from "./apiError"
import { Context } from "hono"

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof apiError) {
    return c.json(
      {
        success: false,
        message: err.message,
        errors: err.errors,
      },
      err.statusCode as any
    )
  }

  console.error("UNEXPECTED ERROR:", err)

  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500
  )
}