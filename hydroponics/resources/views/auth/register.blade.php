<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register | ePUMP</title>

    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        /* Card Highlight on focus */
        .highlight-card:focus-within {
            border-color: #3b82f6; /* blue-500 */
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        /* Hero Logo Shadow */
        .hero-logo {
            box-shadow: 0 10px 30px rgba(0, 128, 255, 0.3), 0 0 20px rgba(0, 255, 128, 0.2);
            border-radius: 50%;
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen font-sans bg-gray-100">

    <!-- Register Card (smaller width & padding) -->
    <div class="w-full max-w-md p-8 bg-white border-2 border-transparent shadow-2xl rounded-3xl highlight-card">

        <!-- Hero Logo -->
        <div class="flex justify-center mb-8">
            <div class="flex items-center justify-center w-40 h-40 overflow-hidden bg-white hero-logo">
                <img src="{{ asset('images/hydrosmart4.png') }}" alt="ePUMP Logo" class="object-contain w-36 h-36">
            </div>
        </div>

        <!-- Register Title -->
        <h2 class="mb-6 text-2xl font-bold text-center text-gray-800">
            Create your ePUMP Account
        </h2>

        <!-- Status -->
        <x-auth-session-status class="w-full mb-4" :status="session('status')" />

        <!-- Register Form -->
        <form method="POST" action="{{ route('register') }}" class="space-y-4" id="registerForm">
            @csrf

            <!-- Name -->
            <div>
                <input type="text" name="name" required autofocus
                    value="{{ old('name') }}"
                    class="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Full Name">
                <x-input-error :messages="$errors->get('name')" class="mt-1 text-xs text-red-500" />
            </div>

            <!-- Email -->
            <div>
                <input type="email" name="email" required
                    value="{{ old('email') }}"
                    class="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Email">
                <x-input-error :messages="$errors->get('email')" class="mt-1 text-xs text-red-500" />
            </div>

            <!-- Password -->
            <div>
                <input type="password" name="password" required
                    class="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Password">
                <x-input-error :messages="$errors->get('password')" class="mt-1 text-xs text-red-500" />
            </div>

            <!-- Confirm Password -->
            <div>
                <input type="password" name="password_confirmation" required
                    class="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Confirm Password">
                <x-input-error :messages="$errors->get('password_confirmation')" class="mt-1 text-xs text-red-500" />
            </div>

            <!-- Register Button -->
            <button type="submit"
                class="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl hover:from-blue-700 hover:to-green-600">
                Register
            </button>
        </form>

        <!-- Login Link -->
        <p class="mt-6 text-xs text-center text-gray-500">
            Already have an account?
            <a href="{{ route('login') }}" class="font-medium text-blue-600 hover:underline">
                Login
            </a>
        </p>

    </div>

</body>
</html>
