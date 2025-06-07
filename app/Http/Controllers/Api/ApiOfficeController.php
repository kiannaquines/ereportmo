<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Office;

class ApiOfficeController extends Controller
{
    /**
     * Summary of get all offices
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getOffices(){
        $offices = Office::select('id', 'office')->get();
        return response()->json([
            'offices' => $offices
        ]);
    }
}