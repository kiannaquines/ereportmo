<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Office;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['office'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'municipality' => $user->municipality,
                    'barangay' => $user->barangay,
                    'office' => $user->office->office ?? Str::upper('Public User'),
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $user->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        $offices = Office::get()->map(function ($office) {
            return [
                'id' => $office->id,
                'office' => $office->office,
            ];
        });

        $roles = Role::get()->map(function ($role) {
            return [
                'id' => $role->id,
                'role' => $role->role,
            ];
        });

        return Inertia::render('user/users', [
            'users' => $users,
            'offices' => $offices,
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|string|min:8|same:password',
            'municipality' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'office' => 'required|exists:offices,id',
            'role' => 'required|string|max:255',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'municipality' => $request->municipality,
            'barangay' => $request->barangay,
            'office_id' => $request->office,
            'role' => $request->role,
        ]);
        return back()->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return view('users.edit', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $user->update($request->all());
        return redirect()->route('users.index');
    }
}
