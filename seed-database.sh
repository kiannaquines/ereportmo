#!/bin/bash

# Enhanced Database Seeder - Quick Setup Script
# This script resets the database and runs all seeders with enhanced data

echo "🔄 Resetting database and running enhanced seeders..."
echo ""

# Run fresh migrations with seeders
php artisan migrate:fresh --seed

echo ""
echo "✅ Database seeded successfully!"
echo ""
echo "📊 Data Summary:"
echo "   - 23 Users (1 admin, 6 office users, 16 regular users)"
echo "   - 7 Municipalities (Kidapawan City, Mlang, Kabacan, Matalam, Tulunan, Antipas, Makilala)"
echo "   - 3 Offices (PNP, MDRRMO, MSWDO VAWC)"
echo "   - 36 Incident Types"
echo "   - ~295 Reports (2022-2025)"
echo ""
echo "🔐 Login Credentials:"
echo ""
echo "Admin:"
echo "   Email: kurth@ereportmo.com"
echo "   Password: kurth@ereportmo.com"
echo ""
echo "PNP Officers:"
echo "   Email: juan.pnp@ereportmo.com (Kidapawan City)"
echo "   Email: maria.pnp@ereportmo.com (Mlang)"
echo "   Password: password123"
echo ""
echo "MDRRMO Officers:"
echo "   Email: pedro.mdrrmo@ereportmo.com (Kabacan)"
echo "   Email: ana.mdrrmo@ereportmo.com (Matalam)"
echo "   Password: password123"
echo ""
echo "MSWDO (VAWC) Officers:"
echo "   Email: rosa.vawc@ereportmo.com (Tulunan)"
echo "   Email: carmen.vawc@ereportmo.com (Antipas)"
echo "   Password: password123"
echo ""
echo "Regular Users (examples):"
echo "   Email: kurt@ereportmo.com"
echo "   Email: mark.johnson@example.com"
echo "   Email: sarah.williams@example.com"
echo "   Password: password123"
echo ""
echo "🚀 Ready to test! Visit http://localhost:8000/dashboard"
