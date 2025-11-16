# Dashboard Filter Testing Guide

## Overview
The dashboard now properly filters ALL data based on user role and office assignment. This ensures:
- **Admin users** see ALL data from all offices and locations
- **Office users** (PNP, MDRRMO, MSWDO) see ONLY their office's data
- **All charts and statistics** update when filters change

---

## Key Changes Made

### 1. Admin Role Check
- System now checks if user has 'admin' role
- Admin users bypass ALL office filtering
- Admin users see a green banner confirming full system access

### 2. Office User Filtering
- Non-admin users with office assignments (PNP, MDRRMO, MSWDO) see filtered data
- Filtering applies to:
  - Total statistics
  - All charts (monthly, weekly, top municipality)
  - Historical data (all years)
  - Today's incidents table
  
### 3. Dynamic Filter Updates
- When period changes (All Time / This Week / This Month), ALL data updates
- When year changes, ALL yearly data updates
- Charts automatically refresh with new filtered data

---

## Test Scenarios

### Scenario 1: Admin User (Full Access)
**Setup:**
```sql
-- Admin user example (from UserSeeder)
Email: kurth@ereportmo.com
Password: kurth@ereportmo.com
Role: admin
Office: MSWDO (VAWC) (has office but role overrides)
```

**Expected Behavior:**
1. ✅ Green banner appears: "Administrator View - Viewing All System Data"
2. ✅ Statistics show ALL incidents from ALL offices:
   - PNP incidents (theft, robbery, murder, etc.)
   - MDRRMO incidents (earthquakes, floods, fires, etc.)
   - MSWDO incidents (domestic violence, assault, etc.)
3. ✅ Charts display combined data from all offices
4. ✅ Top municipality charts show all municipalities
5. ✅ Today's incidents show all reports regardless of office

**Test Steps:**
1. Login as admin
2. Go to Dashboard
3. Verify green banner shows
4. Check "Total Reported Incidents" - should be sum of ALL offices
5. Look at charts - should show combined data
6. Change period to "This Week" - verify all data updates
7. Change year - verify historical charts update
8. Check incident table - should show mixed office types

---

### Scenario 2: PNP Office User (Filtered Access)
**Setup:**
Create a test user:
```sql
INSERT INTO users (name, email, municipality, barangay, role, office_id, password)
VALUES (
    'PNP Test User',
    'pnp@test.com',
    'Makilala',
    'Test Barangay',
    (SELECT id FROM roles WHERE role = 'pnp'),
    (SELECT id FROM offices WHERE office = 'PNP'),
    -- use bcrypt hash for 'password'
);
```

**Expected Behavior:**
1. ✅ Blue banner appears: "Viewing statistics for: PNP - Makilala"
2. ✅ Statistics show ONLY PNP incidents:
   - Theft, Robbery, Murder, Physical injury
   - Illegal drugs, Fraud, Hit-and-run
   - Violations, Missing persons, etc.
3. ✅ NO MDRRMO or MSWDO incidents visible
4. ✅ Charts filtered to PNP data only
5. ✅ Only incidents from Makilala municipality (location filter)

**Test Steps:**
1. Login as PNP user
2. Verify blue banner shows "PNP - Makilala"
3. Check statistics - should be smaller than admin view
4. Look at incident types in table - should only be crime-related
5. Change period filter:
   - Select "This Week" - counts update
   - Select "This Month" - counts update  
   - Select "All Time" - counts return to filtered totals
6. Change year - charts update with PNP data only
7. Verify NO disasters or VAWC cases appear

---

### Scenario 3: MDRRMO Office User (Filtered Access)
**Setup:**
Create a test user:
```sql
INSERT INTO users (name, email, municipality, barangay, role, office_id, password)
VALUES (
    'MDRRMO Test User',
    'mdrrmo@test.com',
    'Kabacan',
    'Test Barangay',
    (SELECT id FROM roles WHERE role = 'mdrrmo'),
    (SELECT id FROM offices WHERE office = 'MDRRMO'),
    -- use bcrypt hash
);
```

**Expected Behavior:**
1. ✅ Blue banner: "Viewing statistics for: MDRRMO - Kabacan"
2. ✅ Statistics show ONLY MDRRMO incidents:
   - Earthquakes, Typhoons, Floods, Landslides
   - Volcanic eruptions, Fire incidents
   - Road accidents, Evacuations, etc.
3. ✅ NO PNP or MSWDO incidents visible
4. ✅ Only Kabacan location data

**Test Steps:**
1. Login as MDRRMO user
2. Verify blue banner shows "MDRRMO - Kabacan"
3. Check incident types - should only be disaster-related
4. Test all filter combinations
5. Verify crime and VAWC incidents don't appear

---

### Scenario 4: MSWDO (VAWC) Office User (Filtered Access)
**Setup:**
Create a test user:
```sql
INSERT INTO users (name, email, municipality, barangay, role, office_id, password)
VALUES (
    'MSWDO Test User',
    'mswdo@test.com',
    'Makilala',
    'Test Barangay',
    (SELECT id FROM roles WHERE role = 'vawc'),
    (SELECT id FROM offices WHERE office = 'MSWDO (VAWC)'),
    -- use bcrypt hash
);
```

**Expected Behavior:**
1. ✅ Blue banner: "Viewing statistics for: MSWDO (VAWC) - Makilala"
2. ✅ Statistics show ONLY VAWC incidents:
   - Domestic violence, Battery, Assault, Rape
   - Harassment, Molestation, Emotional abuse
   - Verbal abuse, Threats, Manipulation, etc.
3. ✅ NO PNP or MDRRMO incidents visible

**Test Steps:**
1. Login as MSWDO user
2. Verify blue banner shows "MSWDO (VAWC) - Makilala"
3. Check incident types - should only be VAWC-related
4. Test filter updates
5. Verify crimes and disasters don't appear

---

## Filter Interaction Testing

### Period Filter Testing
Test with BOTH admin and office users:

**All Time Period:**
1. Select "All Time"
2. Verify "Total Registered Users" shows cumulative count
3. Verify "Total Reported Incidents" shows cumulative count
4. Description should show "All-time"

**Weekly Period:**
1. Select "This Week"
2. Verify counts update to current week only
3. Description changes to "This Week"
4. For office users: still filtered to their office

**Monthly Period:**
1. Select "This Month"
2. Verify counts update to current month only
3. Description changes to "This Month"
4. For office users: still filtered to their office

### Year Filter Testing
1. Change year dropdown
2. Verify ALL four charts in bottom section update:
   - Monthly Reports (line chart)
   - Weekly Reports (line chart)
   - Top Municipality per Month (bar chart)
   - Top Municipality per Week (bar chart)
3. For office users: data still filtered to their office

### Combined Filter Testing
1. As PNP user, select year 2024 + "This Month"
2. Verify stats show PNP incidents from current month only
3. Verify charts show PNP data for 2024 only
4. Switch to "This Week" - verify immediate update
5. Switch to "All Time" - verify return to broader dataset

---

## Chart Data Verification

### Charts That Update with Filters

**Period-Sensitive (updates with period filter):**
- Total Registered Users stat card
- Total Reported Incidents stat card

**Year-Sensitive (updates with year filter):**
- Monthly Reports chart (year {selectedYear})
- Weekly Reports chart (year {selectedYear})
- Top Municipality per Month (year {selectedYear})
- Top Municipality per Week (year {selectedYear})

**Always Shows All Years (doesn't change with year filter):**
- Monthly Incidents by Year (line chart - shows all historical)
- Municipality Incidents by Year (pie chart - shows all historical)

**Office-Sensitive (filters by office for non-admin):**
- ALL charts
- ALL statistics
- ALL data tables

---

## Visual Indicators

### Green Banner (Admin)
```
┌─────────────────────────────────────────────────────┐
│ ✓ Administrator View - Viewing All System Data     │
│ You're viewing complete statistics across all       │
│ offices (PNP, MDRRMO, MSWDO) and all locations.    │
└─────────────────────────────────────────────────────┘
```

### Blue Banner (Office User)
```
┌─────────────────────────────────────────────────────┐
│ Viewing statistics for: PNP - Makilala              │
│ The dashboard shows data filtered specifically      │
│ for your office and location.                       │
└─────────────────────────────────────────────────────┘
```

---

## Database Queries for Testing

### Check User Setup
```sql
SELECT 
    u.name,
    u.email,
    u.municipality,
    o.office as user_office,
    r.role as user_role
FROM users u
LEFT JOIN offices o ON u.office_id = o.id
LEFT JOIN roles r ON u.role = r.id
WHERE u.email = 'your-test-email@test.com';
```

### Count Incidents by Office
```sql
SELECT 
    o.office,
    COUNT(i.id) as incident_types,
    COUNT(DISTINCT r.id) as total_reports
FROM offices o
LEFT JOIN incidents i ON o.id = i.office_id
LEFT JOIN reports r ON i.id = r.incident_id
GROUP BY o.office;
```

### Verify Admin Sees All, Office User Sees Filtered
```sql
-- What an Admin should see (all reports)
SELECT COUNT(*) as admin_count
FROM reports;

-- What a PNP user should see (only PNP reports)
SELECT COUNT(*) as pnp_count
FROM reports r
JOIN incidents i ON r.incident_id = i.id
JOIN offices o ON i.office_id = o.id
WHERE o.office = 'PNP';

-- Compare the numbers
```

---

## Troubleshooting

### Issue: Admin User Seeing Filtered Data
**Problem:** Admin sees blue banner or filtered statistics

**Solution:**
1. Check user's role in database:
   ```sql
   SELECT r.role FROM users u 
   JOIN roles r ON u.role = r.id 
   WHERE u.email = 'admin@email.com';
   ```
2. Should return 'admin'
3. If not, update:
   ```sql
   UPDATE users 
   SET role = (SELECT id FROM roles WHERE role = 'admin')
   WHERE email = 'admin@email.com';
   ```

### Issue: Office User Seeing All Data
**Problem:** PNP user sees MDRRMO and MSWDO incidents

**Solution:**
1. Check office assignment:
   ```sql
   SELECT o.office FROM users u
   JOIN offices o ON u.office_id = o.id
   WHERE u.email = 'pnp@email.com';
   ```
2. Verify role is NOT 'admin'
3. Check role is correct for office (pnp, mdrrmo, or vawc)

### Issue: Charts Not Updating
**Problem:** Period or year filter doesn't update charts

**Solution:**
1. Hard refresh browser (Ctrl + Shift + R)
2. Clear browser cache
3. Check browser console for errors
4. Verify JavaScript is enabled

### Issue: No Data Showing
**Problem:** Office user sees zero incidents

**Solution:**
1. Check if reports exist for that office:
   ```sql
   SELECT COUNT(*) FROM reports r
   JOIN incidents i ON r.incident_id = i.id
   WHERE i.office_id = (
       SELECT office_id FROM users WHERE email = 'user@email.com'
   );
   ```
2. If zero, seed more data or reassign office

---

## Summary of Filters

| Filter Type | Affects | Updates |
|------------|---------|---------|
| **Role (Admin vs Office)** | All data | Static (based on login) |
| **Office Assignment** | All incident data | Static (based on user) |
| **Municipality** | Geographic filtering | Static (based on user) |
| **Period (All/Week/Month)** | Stat cards only | Dynamic (dropdown) |
| **Year** | Year-specific charts | Dynamic (dropdown) |

---

## Files Modified

- `app/Http/Controllers/DashboardController.php` - Admin check, filtering logic
- `app/Models/User.php` - Added userRole relationship
- `resources/js/pages/dashboard.tsx` - Admin banner, props update

---

**Last Updated:** November 16, 2025
**Testing Status:** Ready for QA
