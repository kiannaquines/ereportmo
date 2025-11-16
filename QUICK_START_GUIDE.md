# Quick Start Guide - Testing New Features

## Testing the Improvements

### 1. Test PDF Report Generation with Charts

**Steps:**
1. Navigate to Reports page: `/reports`
2. Click "Export All Reports" button
3. Wait for PDF to download (may take 8-10 seconds)
4. Open the PDF and verify:
   - All 7 charts are visible and rendered correctly
   - Charts show proper data with labels
   - Summary table is complete

**Alternative Test with Date Range:**
1. On Reports page, select a date range
2. Click "Export by Date Range"
3. Verify filtered data appears in PDF

**Expected Result:** 
✅ PDF contains fully rendered charts (not blank/broken)
✅ All data visualizations are clear and readable

---

### 2. Test Dashboard Period Filters

**Steps:**
1. Login as any user
2. Navigate to Dashboard
3. Look for the period dropdown (top right)
4. Select "This Week"
   - Watch "Total Registered Users" card update
   - Watch "Total Reported Incidents" card update
   - Description should change to "This Week"
5. Select "This Month"
   - Stats update to monthly data
   - Description shows "This Month"
6. Select "All Time"
   - Stats return to cumulative totals
   - Description shows "All-time"

**Expected Result:**
✅ Statistics dynamically update when changing periods
✅ Card descriptions match selected period
✅ Charts remain functional

---

### 3. Test Role-Based Dashboard (Office-Specific Views)

#### Test as PNP User:

**Setup:**
1. Create a test user with:
   - Office: PNP
   - Municipality: (any)
   - Role: pnp

**Steps:**
1. Login with PNP user credentials
2. Go to Dashboard
3. Observe blue banner at top showing: "Viewing statistics for: PNP - [Municipality]"
4. Verify statistics only show PNP-related incidents:
   - Theft, Robbery, Murder, Illegal drugs, etc.
5. Check charts show only PNP incident data

**Expected Result:**
✅ Blue banner appears with office info
✅ Only PNP incidents visible
✅ No MDRRMO or MSWDO incidents appear

---

#### Test as MDRRMO User:

**Setup:**
1. Create a test user with:
   - Office: MDRRMO
   - Municipality: (any)
   - Role: mdrrmo

**Steps:**
1. Login with MDRRMO user credentials
2. Go to Dashboard
3. Verify banner shows: "Viewing statistics for: MDRRMO - [Municipality]"
4. Check only disaster-related incidents appear:
   - Earthquakes, Typhoons, Floods, Landslides, Fire incidents, etc.

**Expected Result:**
✅ Banner shows MDRRMO office
✅ Only disaster/risk reduction incidents visible
✅ Statistics filtered to MDRRMO scope

---

#### Test as MSWDO (VAWC) User:

**Setup:**
1. Create a test user with:
   - Office: MSWDO (VAWC)
   - Municipality: (any)
   - Role: vawc

**Steps:**
1. Login with MSWDO user credentials
2. Go to Dashboard
3. Verify banner shows: "Viewing statistics for: MSWDO (VAWC) - [Municipality]"
4. Check only VAWC-related incidents appear:
   - Domestic violence, Battery, Assault, Rape, Harassment, etc.

**Expected Result:**
✅ Banner shows MSWDO (VAWC) office
✅ Only violence/abuse incidents visible
✅ Child protection cases visible

---

#### Test as Admin User:

**Steps:**
1. Login with admin credentials (kurth@ereportmo.com)
2. Go to Dashboard
3. Verify NO blue banner appears
4. Confirm ALL incidents from ALL offices are visible
5. Stats show combined totals

**Expected Result:**
✅ No office filter banner
✅ All incident types visible
✅ Complete system-wide statistics

---

## Quick Feature Reference

### Period Filter Options
| Option | Description | Use Case |
|--------|-------------|----------|
| All Time | Shows cumulative data since system start | Overall trends |
| This Week | Current week (Monday-Sunday) | Recent activity |
| This Month | Current calendar month | Monthly reporting |

### Office Types & Their Incidents

**PNP (Philippine National Police)**
- Criminal incidents
- Traffic violations
- Public disturbances
- Missing persons

**MDRRMO (Municipal Disaster Risk Reduction)**
- Natural disasters
- Fire incidents
- Evacuations
- Emergency response

**MSWDO (VAWC) (Municipal Social Welfare)**
- Violence against women/children
- Domestic abuse cases
- Child protection
- Social welfare concerns

---

## Common Test Scenarios

### Scenario 1: PNP Officer in Makilala
- Should ONLY see PNP incidents from Makilala
- Won't see disasters or VAWC cases
- Won't see incidents from other municipalities

### Scenario 2: MDRRMO Officer in Kabacan
- Should ONLY see disaster incidents from Kabacan
- Won't see crimes or VAWC cases
- Won't see incidents from other municipalities

### Scenario 3: System Administrator
- Sees ALL incidents from ALL offices
- Sees ALL municipalities
- No filtering applied

---

## Troubleshooting

### PDF Charts Not Showing
**Problem:** PDF downloads but charts are blank/missing

**Solutions:**
1. Clear browser cache
2. Check Browsershot is properly installed
3. Verify Node.js path in GenerateReportController.php (line 261-262)
4. Increase delay if needed (currently 8000ms)

### Period Filter Not Working
**Problem:** Stats don't update when changing period

**Solutions:**
1. Hard refresh the page (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify JavaScript is enabled
4. Clear application cache: `php artisan cache:clear`

### Office Filter Not Showing Correct Data
**Problem:** User sees wrong incidents or no incidents

**Solutions:**
1. Verify user has `office_id` set in database
2. Check user's `role` matches their office
3. Confirm incidents have correct `office_id` in database
4. Check Reports table has `incident_id` properly linked

### Blue Banner Not Appearing
**Problem:** Office user doesn't see context banner

**Solutions:**
1. Verify user has `office_id` assigned
2. Check office is one of: PNP, MDRRMO, or MSWDO (VAWC)
3. Refresh the dashboard page
4. Check console for React errors

---

## Database Quick Checks

### Check User Setup
```sql
SELECT id, name, email, office_id, municipality, role 
FROM users 
WHERE email = 'your-test-user@email.com';
```

### Check User's Office
```sql
SELECT u.name, o.office, o.location, r.role
FROM users u
LEFT JOIN offices o ON u.office_id = o.id
LEFT JOIN roles r ON u.role = r.id
WHERE u.email = 'your-test-user@email.com';
```

### Check Incident Counts by Office
```sql
SELECT o.office, COUNT(i.id) as incident_types
FROM offices o
LEFT JOIN incidents i ON o.id = i.office_id
GROUP BY o.office;
```

### Check Report Counts by Office
```sql
SELECT o.office, COUNT(r.id) as total_reports
FROM offices o
LEFT JOIN incidents i ON o.id = i.office_id
LEFT JOIN reports r ON i.id = r.incident_id
GROUP BY o.office;
```

---

## Performance Tips

1. **For Large Datasets:**
   - Use period filters to reduce data load
   - Year filter helps focus on specific timeframes

2. **PDF Generation:**
   - Avoid generating PDFs during peak hours
   - Large date ranges will take longer
   - Consider pagination for very large reports

3. **Dashboard Loading:**
   - Charts are lazy-loaded for better performance
   - Statistics are cached for 5 minutes
   - Filter changes trigger fresh data fetch

---

## Need Help?

**Files Modified in This Update:**
- `app/Http/Controllers/DashboardController.php`
- `app/Http/Controllers/Generate/GenerateReportController.php`
- `resources/views/report.blade.php`
- `resources/js/pages/dashboard.tsx`

**Documentation:**
- See `IMPROVEMENTS_SUMMARY.md` for detailed technical documentation
- Check Laravel logs: `storage/logs/laravel.log`
- Check browser console for frontend errors

**Contact:**
- System Administrator
- Development Team

---

**Last Updated:** November 16, 2025
