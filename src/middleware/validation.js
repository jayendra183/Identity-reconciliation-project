import { z } from 'zod';

const identifySchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).optional()
}).refine(data => data.email || data.phoneNumber, {
  message: "At least one of email or phoneNumber must be provided"
});

export function validateIdentifyRequest(req, res, next) {
  try {
    identifySchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: {
        message: "Invalid request data",
        details: error.errors
      }
    });
  }
}