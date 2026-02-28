import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const healthCheck = asyncHandler(async (c) => {
  return c.json(new apiResponse(200, "OK", "Health check passed"), 200);
});

export { healthCheck };


// res.data.statusCode = 200
// res.data.data = ok
// res.data.message = health check passed
// res.data.success = true