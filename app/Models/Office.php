<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{   
    use HasFactory;
    protected $table = 'offices';
    /**
     * Summary of fillable
     * @var array
     */
    protected $fillable = [
        'office',
        'location',
        'status',
    ];

    /**
     * Summary of casts
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
