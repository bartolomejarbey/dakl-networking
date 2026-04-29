-- =========================================================================
-- COMPANY ISSUERS — placeholders for VAT-payer + non-VAT-payer companies
-- =========================================================================
-- David has two companies: one VAT-registered (plátce DPH) and one not.
-- The customer's `customer_is_vat_payer` flag chooses which company issues
-- the invoice. Until David fills real data via /admin/settings, both stay
-- as placeholders so the pipeline can be built and tested end-to-end.

INSERT INTO settings (key, value) VALUES
  ('issuer_payer', '{
    "name": "FIRMA PLÁTCE — placeholder",
    "ico": "00000000",
    "dic": "CZ00000000",
    "address_street": "Náplavka 1",
    "address_city": "Praha",
    "address_zip": "120 00",
    "address_country": "CZ",
    "bank_account": "0000000000",
    "bank_code": "0100",
    "bank_iban": "CZ0001000000000000000000",
    "is_vat_payer": true,
    "vat_rate": 21,
    "email": "fakturace@daklnetworking.cz",
    "phone": "+420 601 348 249"
  }'::JSONB),
  ('issuer_nonpayer', '{
    "name": "FIRMA NEPLÁTCE — placeholder",
    "ico": "00000000",
    "dic": null,
    "address_street": "Náplavka 1",
    "address_city": "Praha",
    "address_zip": "120 00",
    "address_country": "CZ",
    "bank_account": "0000000000",
    "bank_code": "0100",
    "bank_iban": "CZ0001000000000000000000",
    "is_vat_payer": false,
    "vat_rate": 0,
    "email": "fakturace@daklnetworking.cz",
    "phone": "+420 601 348 249"
  }'::JSONB)
ON CONFLICT (key) DO NOTHING;
