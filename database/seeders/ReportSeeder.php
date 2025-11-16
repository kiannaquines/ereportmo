<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Report;
use Carbon\Carbon;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        // Create reports spanning from 2022 to 2025
        $years = [2022, 2023, 2024, 2025];
        $months = range(1, 12); // January to December
        
        foreach ($years as $year) {
            foreach ($months as $month) {
                // Skip future months in 2025
                if ($year === 2025 && $month > 11) {
                    continue;
                }
                
                // Random number of reports per month (between 3 and 15)
                $reportsPerYearMonth = rand(3, 15);
                
                // Create reports for each year-month combination
                Report::factory($reportsPerYearMonth)->create()->each(function ($report) use ($year, $month) {
                    // Set random date within the month
                    $daysInMonth = Carbon::create($year, $month, 1)->daysInMonth;
                    $randomDay = rand(1, $daysInMonth);
                    
                    $report->created_at = Carbon::create($year, $month, $randomDay)
                        ->setTime(rand(0, 23), rand(0, 59), rand(0, 59));
                    $report->updated_at = $report->created_at;
                    $report->save();
                });
            }
        }
    }
}
