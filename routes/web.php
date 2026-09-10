<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('/monitoring', 'monitoring')->name('monitoring');
    Route::view('/control', 'control')->name('control');
    Route::view('/analytics', 'analytics')->name('analytics');
    Route::view('/alerts', 'alerts')->name('alerts');
    Route::view('/systemstatus', 'systemstatus')->name('systemstatus');
    Route::view('/reports', 'reports')->name('reports');
    Route::view('/user-management', 'user-management')->name('user-management');

    Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/'); // redirect to login or welcome page
})->name('logout');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__.'/auth.php';


