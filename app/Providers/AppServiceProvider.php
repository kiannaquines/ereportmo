<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Dedoc\Scramble\Scramble;
use Illuminate\Routing\Route;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;

use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Scramble::configure()
        ->routes(function (Route $route) {
            return Str::startsWith($route->uri, 'api/');
        });

        Gate::define('viewApiDocs', function (User $user) {
            return in_array($user->email, ['admin@ereportmo.com']);
        });
    }
}
