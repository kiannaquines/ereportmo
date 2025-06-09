<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Incident;

class ApiIncidentTypeController extends Controller
{
    /**
     * Summary of get all incident types
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getIncidentTypes(Request $request){
        $incidentTypes = Incident::with('office')->get();
        return response()->json([
            'types' => $incidentTypes,
        ]);
    }
}