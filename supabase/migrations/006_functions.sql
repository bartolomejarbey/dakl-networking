-- =========================================================================
-- DATABASE FUNCTIONS
-- =========================================================================

-- Atomic spot reservation: prevents race conditions when booking
CREATE OR REPLACE FUNCTION reserve_spots(p_event_id UUID, p_quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_capacity INTEGER;
  v_sold INTEGER;
BEGIN
  -- Lock the event row to prevent concurrent modifications
  SELECT capacity INTO v_capacity
    FROM events
    WHERE id = p_event_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Count actual paid + pending orders
  SELECT COALESCE(SUM(quantity), 0) INTO v_sold
    FROM orders
    WHERE event_id = p_event_id
    AND payment_status IN ('pending', 'paid');

  IF (v_capacity - v_sold) >= p_quantity THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get next order number atomically
CREATE OR REPLACE FUNCTION next_order_number()
RETURNS TEXT AS $$
DECLARE
  v_current INTEGER;
  v_prefix TEXT;
BEGIN
  SELECT
    (value->>'current')::INTEGER,
    value->>'prefix'
  INTO v_current, v_prefix
  FROM settings
  WHERE key = 'invoice_series'
  FOR UPDATE;

  v_current := v_current + 1;

  UPDATE settings
    SET value = jsonb_set(value, '{current}', to_jsonb(v_current)),
        updated_at = NOW()
    WHERE key = 'invoice_series';

  RETURN v_prefix || LPAD(v_current::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get available spots for an event
CREATE OR REPLACE FUNCTION get_availability(p_event_id UUID)
RETURNS TABLE(capacity INTEGER, sold BIGINT, available BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.capacity,
    COALESCE(SUM(o.quantity), 0)::BIGINT AS sold,
    (e.capacity - COALESCE(SUM(o.quantity), 0))::BIGINT AS available
  FROM events e
  LEFT JOIN orders o ON o.event_id = e.id
    AND o.payment_status IN ('pending', 'paid')
  WHERE e.id = p_event_id
  GROUP BY e.id, e.capacity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
