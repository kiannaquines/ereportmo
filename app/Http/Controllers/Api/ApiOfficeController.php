<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Office;

class ApiOfficeController extends Controller
{
    /**
     * Summary of get all offices
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getOffices(Request $request){
        $offices = Office::all();
        return response()->json($offices);
    }
}