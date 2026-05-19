
/*
  # PLANTORA - Smart Plantation Management Platform Schema

  ## Overview
  Full database schema for PLANTORA platform supporting Owner and Manager roles.

  ## Tables Created
  1. `profiles` - Extended user profiles with role (owner/manager)
  2. `workers` - Worker registry with IDs and details
  3. `labor_logs` - Daily labor management records
  4. `attendance` - Worker attendance (present/absent/half-day/overtime)
  5. `expenses` - Expense tracker (owner-only)
  6. `harvest_logs` - Crop harvest records
  7. `fertilizer_schedules` - Fertilizer planning and rounds
  8. `buyer_seller_records` - Buyer/seller transaction records (owner-only)
  9. `weather_observations` - Weather data and alerts
  10. `plantation_zones` - Plantation zone definitions

  ## Security
  - RLS enabled on all tables
  - Owner has full access
  - Manager has limited access (no expenses, buyer/seller, financial data)
*/

-- Profiles table extending auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'manager' CHECK (role IN ('owner', 'manager')),
  avatar_url text DEFAULT '',
  plantation_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Plantation zones
CREATE TABLE IF NOT EXISTS plantation_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  area_hectares numeric(10,2) DEFAULT 0,
  crop_type text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plantation_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their zones"
  ON plantation_zones FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner'
  ));

CREATE POLICY "Owners can insert zones"
  ON plantation_zones FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update zones"
  ON plantation_zones FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete zones"
  ON plantation_zones FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Workers registry
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id text NOT NULL,
  full_name text NOT NULL,
  work_type text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  joined_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view workers"
  ON workers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can insert workers"
  ON workers FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update workers"
  ON workers FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete workers"
  ON workers FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Labor logs
CREATE TABLE IF NOT EXISTS labor_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES workers(id) ON DELETE SET NULL,
  worker_name text NOT NULL,
  work_type text NOT NULL DEFAULT '',
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time time,
  end_time time,
  total_hours numeric(5,2) DEFAULT 0,
  supervisor_name text DEFAULT '',
  zone text DEFAULT '',
  notes text DEFAULT '',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view labor logs"
  ON labor_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert labor logs"
  ON labor_logs FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Authenticated users can update labor logs"
  ON labor_logs FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR owner_id = auth.uid())
  WITH CHECK (created_by = auth.uid() OR owner_id = auth.uid());

CREATE POLICY "Owners can delete labor logs"
  ON labor_logs FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES workers(id) ON DELETE SET NULL,
  worker_name text NOT NULL,
  attendance_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half-day', 'overtime')),
  overtime_hours numeric(5,2) DEFAULT 0,
  notes text DEFAULT '',
  marked_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(worker_id, attendance_date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (marked_by = auth.uid());

CREATE POLICY "Authenticated users can update attendance"
  ON attendance FOR UPDATE
  TO authenticated
  USING (marked_by = auth.uid() OR owner_id = auth.uid())
  WITH CHECK (marked_by = auth.uid() OR owner_id = auth.uid());

CREATE POLICY "Owners can delete attendance"
  ON attendance FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Expenses (owner only)
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text NOT NULL DEFAULT 'miscellaneous',
  quantity numeric(10,2) DEFAULT 1,
  unit text DEFAULT 'unit',
  amount numeric(12,2) NOT NULL DEFAULT 0,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  supplier text DEFAULT '',
  payment_method text DEFAULT 'cash',
  receipt_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Harvest logs
CREATE TABLE IF NOT EXISTS harvest_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  harvest_quantity numeric(12,2) NOT NULL DEFAULT 0,
  unit text DEFAULT 'kg',
  harvest_date date NOT NULL DEFAULT CURRENT_DATE,
  zone text DEFAULT '',
  workers_involved text DEFAULT '',
  quality_grade text DEFAULT 'A',
  quality_notes text DEFAULT '',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE harvest_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view harvest logs"
  ON harvest_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert harvest logs"
  ON harvest_logs FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Authenticated users can update harvest logs"
  ON harvest_logs FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR owner_id = auth.uid())
  WITH CHECK (created_by = auth.uid() OR owner_id = auth.uid());

CREATE POLICY "Owners can delete harvest logs"
  ON harvest_logs FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Fertilizer schedules
CREATE TABLE IF NOT EXISTS fertilizer_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fertilizer_name text NOT NULL,
  quantity_kg numeric(10,2) DEFAULT 0,
  mixing_ratio text DEFAULT '',
  scheduled_date date NOT NULL,
  completed_date date,
  zone text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  notes text DEFAULT '',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fertilizer_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view fertilizer schedules"
  ON fertilizer_schedules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert fertilizer schedules"
  ON fertilizer_schedules FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Authenticated users can update fertilizer schedules"
  ON fertilizer_schedules FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR owner_id = auth.uid())
  WITH CHECK (created_by = auth.uid() OR owner_id = auth.uid());

CREATE POLICY "Owners can delete fertilizer schedules"
  ON fertilizer_schedules FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Buyer/Seller records (owner only)
CREATE TABLE IF NOT EXISTS buyer_seller_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_name text NOT NULL,
  crop_type text NOT NULL,
  quantity_sold numeric(12,2) NOT NULL DEFAULT 0,
  unit text DEFAULT 'kg',
  sale_amount numeric(12,2) NOT NULL DEFAULT 0,
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  location text DEFAULT '',
  transport_cost numeric(10,2) DEFAULT 0,
  final_profit numeric(12,2) DEFAULT 0,
  payment_status text DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'partial')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE buyer_seller_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their buyer seller records"
  ON buyer_seller_records FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert buyer seller records"
  ON buyer_seller_records FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update buyer seller records"
  ON buyer_seller_records FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete buyer seller records"
  ON buyer_seller_records FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Weather observations
CREATE TABLE IF NOT EXISTS weather_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  observation_date date NOT NULL DEFAULT CURRENT_DATE,
  temperature_celsius numeric(5,2),
  humidity_percent numeric(5,2),
  wind_speed_kmh numeric(6,2),
  rainfall_mm numeric(8,2) DEFAULT 0,
  condition text DEFAULT 'clear',
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  alert_message text DEFAULT '',
  recorded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weather_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view weather observations"
  ON weather_observations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert weather observations"
  ON weather_observations FOR INSERT
  TO authenticated
  WITH CHECK (recorded_by = auth.uid());

CREATE POLICY "Authenticated users can update weather observations"
  ON weather_observations FOR UPDATE
  TO authenticated
  USING (recorded_by = auth.uid() OR owner_id = auth.uid())
  WITH CHECK (recorded_by = auth.uid() OR owner_id = auth.uid());

CREATE POLICY "Owners can delete weather observations"
  ON weather_observations FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_labor_logs_date ON labor_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_labor_logs_owner ON labor_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_owner ON attendance(owner_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_owner ON expenses(owner_id);
CREATE INDEX IF NOT EXISTS idx_harvest_date ON harvest_logs(harvest_date);
CREATE INDEX IF NOT EXISTS idx_fertilizer_scheduled ON fertilizer_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_buyer_sale_date ON buyer_seller_records(sale_date);
