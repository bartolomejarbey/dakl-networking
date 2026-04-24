import { z } from 'zod'

export const checkoutSchema = z.object({
  // Step 1: Quantity
  quantity: z.number().min(1).max(5),

  // Step 2: Contact
  firstName: z.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  lastName: z.string().min(2, 'Příjmení musí mít alespoň 2 znaky'),
  email: z.string().email('Zadej platný email'),
  phone: z.string().optional(),

  // Step 3: Billing
  billingType: z.enum(['person', 'company']),
  companyName: z.string().optional(),
  ico: z.string().optional(),
  dic: z.string().optional(),
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingZip: z.string().optional(),

  // Step 4: Extras
  dietaryRestrictions: z.string().optional(),
  source: z.string().optional(),
  customerNote: z.string().optional(),

  // Step 5: Consents
  agreedTerms: z.literal(true, { errorMap: () => ({ message: 'Musíš souhlasit s podmínkami' }) }),
  agreedGdpr: z.literal(true, { errorMap: () => ({ message: 'Musíš souhlasit se zpracováním údajů' }) }),
  agreedNewsletter: z.boolean().default(false),

  // Step 6: Payment
  paymentMethod: z.enum(['qr_comgate', 'bank_transfer']),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

// Per-step partial schemas for step-by-step validation
export const stepSchemas = {
  1: z.object({ quantity: checkoutSchema.shape.quantity }),
  2: z.object({
    firstName: checkoutSchema.shape.firstName,
    lastName: checkoutSchema.shape.lastName,
    email: checkoutSchema.shape.email,
    phone: checkoutSchema.shape.phone,
  }),
  3: z.object({
    billingType: checkoutSchema.shape.billingType,
    companyName: checkoutSchema.shape.companyName,
    ico: checkoutSchema.shape.ico,
    dic: checkoutSchema.shape.dic,
    billingStreet: checkoutSchema.shape.billingStreet,
    billingCity: checkoutSchema.shape.billingCity,
    billingZip: checkoutSchema.shape.billingZip,
  }),
  4: z.object({
    dietaryRestrictions: checkoutSchema.shape.dietaryRestrictions,
    source: checkoutSchema.shape.source,
    customerNote: checkoutSchema.shape.customerNote,
  }),
  5: z.object({
    agreedTerms: checkoutSchema.shape.agreedTerms,
    agreedGdpr: checkoutSchema.shape.agreedGdpr,
    agreedNewsletter: checkoutSchema.shape.agreedNewsletter,
  }),
  6: z.object({ paymentMethod: checkoutSchema.shape.paymentMethod }),
} as const
