# Enhanced Database Seeders with Multiple Users and Municipalities

## Overview
Updated database seeders to create a comprehensive dataset with multiple users from different municipalities, office types, and roles. This provides realistic data for testing role-based filtering, municipality filtering, and dashboard visualizations.

## Changes Made

### 1. UserSeeder.php - Added 23 Users Total

#### Admin Users (1)
```php
'Kurt Lugagay' - Admin from Makilala
```

#### Office Users (6)
**PNP Officers (2):**
- Officer Juan Dela Cruz - Kidapawan City, Poblacion
- Officer Maria Santos - Mlang, Poblacion

**MDRRMO Officers (2):**
- Officer Pedro Reyes - Kabacan, Poblacion
- Officer Ana Garcia - Matalam, Bangbang

**MSWDO (VAWC) Officers (2):**
- Officer Rosa Martinez - Tulunan, Poblacion
- Officer Carmen Lopez - Antipas, Poblacion

#### Regular Users (16)
Users from 7 different municipalities who will report incidents:

| Name | Email | Municipality | Barangay |
|------|-------|--------------|----------|
| Kian Naquines | kurt@ereportmo.com | Makilala | Kisante |
| Mark Johnson | mark.johnson@example.com | Kidapawan City | Lanao |
| Sarah Williams | sarah.williams@example.com | Mlang | Gaunan |
| David Brown | david.brown@example.com | Kabacan | Cuyapon |
| Lisa Anderson | lisa.anderson@example.com | Matalam | Kilada |
| James Taylor | james.taylor@example.com | Tulunan | Batang |
| Jennifer Garcia | jennifer.garcia@example.com | Antipas | Malangag |
| Robert Martinez | robert.martinez@example.com | Makilala | Malabuan |
| Maria Rodriguez | maria.rodriguez@example.com | Kidapawan City | Perez |
| Michael Lee | michael.lee@example.com | Mlang | Libungan |
| Jessica Wang | jessica.wang@example.com | Kabacan | Magatos |
| Christopher Santos | chris.santos@example.com | Matalam | Arakan |
| Amanda Cruz | amanda.cruz@example.com | Tulunan | Damawato |
| Daniel Ramos | daniel.ramos@example.com | Antipas | Luhib |
| Emily Torres | emily.torres@example.com | Makilala | Bulakanon |
| Matthew Reyes | matthew.reyes@example.com | Kidapawan City | Indangan |

**Municipality Coverage:**
- ✅ Kidapawan City (4 users)
- ✅ Mlang (3 users)
- ✅ Kabacan (3 users)
- ✅ Matalam (3 users)
- ✅ Tulunan (3 users)
- ✅ Antipas (3 users)
- ✅ Makilala (4 users)

### 2. ReportSeeder.php - Enhanced Report Generation

**Total Reports:** 295 (increased from 100)

**Date Distribution:**
```php
// 2022: 50 reports
Report::factory(50)->create([
    'created_at' => fake()->dateTimeBetween('2022-01-01', '2022-12-31'),
]);

// 2023: 60 reports
Report::factory(60)->create([
    'created_at' => fake()->dateTimeBetween('2023-01-01', '2023-12-31'),
]);

// 2024: 70 reports
Report::factory(70)->create([
    'created_at' => fake()->dateTimeBetween('2024-01-01', '2024-12-31'),
]);

// 2025: 80 reports
Report::factory(80)->create([
    'created_at' => fake()->dateTimeBetween('2025-01-01', '2025-11-16'),
]);

// This Week: 15 reports
Report::factory(15)->create([
    'created_at' => fake()->dateTimeBetween('monday this week', 'now'),
]);

// This Month: 20 reports
Report::factory(20)->create([
    'created_at' => fake()->dateTimeBetween('first day of this month', 'now'),
]);
```

**Benefits:**
- ✅ Historical data for trend analysis (2022-2025)
- ✅ Increasing trend (50 → 60 → 70 → 80 reports per year)
- ✅ Recent data for "This Week" filter testing
- ✅ Monthly data for "This Month" filter testing
- ✅ Better chart visualization with multi-year data

### 3. ReportFactory.php - Improved Data Quality

**Changes:**
- Removed hardcoded 2022 date range
- Improved coordinates to North Cotabato area
- Date control moved to seeder for flexibility

**Before:**
```php
'latitude' => $this->faker->latitude(), // Global coordinates
'longitude' => $this->faker->longitude(), // Global coordinates
'created_at' => Carbon::createFromTimestamp(
    $this->faker->dateTimeBetween('2022-01-01', '2022-12-31')->getTimestamp()
), // Only 2022 data
```

**After:**
```php
'latitude' => $this->faker->latitude(6.5, 7.5), // North Cotabato area
'longitude' => $this->faker->longitude(124.5, 125.5), // North Cotabato area
// created_at controlled by seeder for better date distribution
```

## Data Distribution Analysis

### By Municipality (Expected Distribution)

With 23 users across 7 municipalities and 295 reports:
- **Kidapawan City:** ~42 reports (4 users)
- **Mlang:** ~32 reports (3 users)
- **Kabacan:** ~32 reports (3 users)
- **Matalam:** ~32 reports (3 users)
- **Tulunan:** ~32 reports (3 users)
- **Antipas:** ~32 reports (3 users)
- **Makilala:** ~42 reports (4 users)

### By Office (Expected Distribution)

Based on 36 incident types:
- **MSWDO (VAWC):** ~33% of reports (13 incident types)
- **PNP:** ~39% of reports (14 incident types)
- **MDRRMO:** ~28% of reports (9 incident types)

### By Status (Random Distribution)

Each report randomly assigned:
- New: ~20%
- Assigned: ~20%
- In Progress: ~20%
- Resolved: ~20%
- Closed: ~20%

## Testing Scenarios

### Scenario 1: Admin Dashboard
**Login as:** kurth@ereportmo.com

**Expected Results:**
- ✅ See ALL 295 reports across all municipalities
- ✅ Charts show data from all 7 municipalities
- ✅ Year selector shows 2022, 2023, 2024, 2025
- ✅ Monthly/weekly charts populated for all years
- ✅ Top municipality charts show all locations

### Scenario 2: PNP Officer from Kidapawan City
**Login as:** juan.pnp@ereportmo.com

**Expected Results:**
- ✅ See only PNP incidents from Kidapawan City (~16 reports)
- ✅ Charts filtered to PNP + Kidapawan City
- ✅ Total users card shows only Kidapawan City users
- ✅ Municipality charts show only Kidapawan City

### Scenario 3: MDRRMO Officer from Matalam
**Login as:** ana.mdrrmo@ereportmo.com

**Expected Results:**
- ✅ See only MDRRMO incidents from Matalam (~9 reports)
- ✅ Charts show disaster-related incidents only
- ✅ Filtered by Matalam municipality
- ✅ User count limited to Matalam users

### Scenario 4: MSWDO Officer from Tulunan
**Login as:** rosa.vawc@ereportmo.com

**Expected Results:**
- ✅ See only VAWC incidents from Tulunan (~10 reports)
- ✅ Charts show domestic violence, assault, etc.
- ✅ Filtered by Tulunan municipality
- ✅ Top municipality charts show only Tulunan

### Scenario 5: Period Filtering
**Any user, select "This Week":**

**Expected Results:**
- ✅ Cards update to show ~15 reports (or fewer based on user role)
- ✅ Charts update to weekly data
- ✅ "No Data" messages if no reports this week for that office

**Any user, select "This Month":**

**Expected Results:**
- ✅ Cards update to show ~20+ reports
- ✅ Monthly statistics reflected
- ✅ Current month highlighted in charts

## How to Seed the Database

### Fresh Migration with New Seeds
```bash
# Reset database and run all migrations + seeders
php artisan migrate:fresh --seed
```

### Manual Seeding (Without Migration)
```bash
# Run seeders only (requires existing migrations)
php artisan db:seed
```

### Seed Specific Seeder
```bash
# Seed only users
php artisan db:seed --class=UserSeeder

# Seed only reports
php artisan db:seed --class=ReportSeeder
```

## Login Credentials

### Admin Access
```
Email: kurth@ereportmo.com
Password: kurth@ereportmo.com
```

### PNP Officers
```
Email: juan.pnp@ereportmo.com
Password: password123

Email: maria.pnp@ereportmo.com
Password: password123
```

### MDRRMO Officers
```
Email: pedro.mdrrmo@ereportmo.com
Password: password123

Email: ana.mdrrmo@ereportmo.com
Password: password123
```

### MSWDO (VAWC) Officers
```
Email: rosa.vawc@ereportmo.com
Password: password123

Email: carmen.vawc@ereportmo.com
Password: password123
```

### Regular Users
```
All regular users:
Password: password123

Examples:
- mark.johnson@example.com
- sarah.williams@example.com
- david.brown@example.com
```

## Validation Checklist

After seeding, verify:

- [ ] **User Count:** 23 total users created
  - [ ] 1 admin
  - [ ] 6 office users (2 PNP, 2 MDRRMO, 2 VAWC)
  - [ ] 16 regular users

- [ ] **Municipality Distribution:** 7 municipalities represented
  - [ ] Kidapawan City
  - [ ] Mlang
  - [ ] Kabacan
  - [ ] Matalam
  - [ ] Tulunan
  - [ ] Antipas
  - [ ] Makilala

- [ ] **Report Count:** ~295 reports
  - [ ] 2022: ~50 reports
  - [ ] 2023: ~60 reports
  - [ ] 2024: ~70 reports
  - [ ] 2025: ~80 reports
  - [ ] This week: ~15 reports
  - [ ] This month: ~20 reports

- [ ] **Incident Types:** 36 incident types across 3 offices
  - [ ] MSWDO (VAWC): 13 types
  - [ ] PNP: 14 types
  - [ ] MDRRMO: 9 types

- [ ] **Dashboard Tests:**
  - [ ] Admin sees all data
  - [ ] PNP users see only PNP incidents from their municipality
  - [ ] MDRRMO users see only MDRRMO incidents from their municipality
  - [ ] VAWC users see only VAWC incidents from their municipality
  - [ ] Charts populate correctly
  - [ ] Year selector shows 2022-2025
  - [ ] Period filter (All/Week/Month) works

## Data Quality Improvements

### Before
- ❌ Only 2 users (admin + 1 regular user)
- ❌ Only 100 reports
- ❌ All from same municipality (Makilala)
- ❌ Only 2022 data
- ❌ Global random coordinates
- ❌ Limited testing scenarios

### After
- ✅ 23 users with diverse roles
- ✅ 295 reports with better distribution
- ✅ 7 different municipalities
- ✅ 4 years of data (2022-2025)
- ✅ North Cotabato-specific coordinates
- ✅ Comprehensive testing scenarios
- ✅ Recent data for period filtering
- ✅ Office diversity (PNP, MDRRMO, VAWC users)

## Benefits

1. **🎯 Realistic Testing:** Multiple users from different locations
2. **📊 Better Charts:** Multi-year data creates meaningful visualizations
3. **🔐 Security Testing:** Verify role-based filtering works correctly
4. **📍 Location Filtering:** Test municipality-based access control
5. **📅 Period Testing:** Current week/month data for filter testing
6. **👥 User Diversity:** Different office types and roles
7. **🗺️ Geographic Coverage:** 7 municipalities across North Cotabato

## Next Steps

1. **Run Migrations:**
   ```bash
   php artisan migrate:fresh --seed
   ```

2. **Test Dashboard:**
   - Login as different users
   - Check role-based filtering
   - Verify municipality filtering
   - Test period selectors

3. **Generate PDF Reports:**
   - Test as admin (should see all data)
   - Test as office users (should see filtered data)
   - Verify PDF matches dashboard

4. **Chart Validation:**
   - Check year selector (2022-2025)
   - Verify top municipality charts
   - Test "No Data" messages for empty periods

---

**Summary:** Database seeders now create 23 diverse users across 7 municipalities and 295 reports spanning 2022-2025, providing comprehensive data for testing role-based filtering, municipality filtering, and all dashboard features.
