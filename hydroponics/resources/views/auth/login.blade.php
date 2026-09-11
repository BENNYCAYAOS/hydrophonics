<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    >

    <title>Login | HYDROSMART</title>

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <!-- Login CSS + JS -->
    @vite([
        'resources/css/login.css',
        'resources/js/login.js'
    ])

</head>


<body class="login-page">


    <!-- =====================================================
         BACKGROUND DECORATIONS
         ===================================================== -->

    <div class="floating-circle circle-one"></div>

    <div class="floating-circle circle-two"></div>

    <div class="floating-circle circle-three"></div>


    <!-- =====================================================
         MAIN CONTAINER
         ===================================================== -->

    <main class="login-container">


        <!-- =================================================
             LOGIN CARD
             ================================================= -->

        <div class="login-card">


            <!-- =================================================
                 SKELETON LOADING
                 ================================================= -->

            <div
                id="loginSkeleton"
                class="login-skeleton"
            >

                <div
                    class="skeleton-shimmer skeleton-logo"
                ></div>


                <div
                    class="skeleton-shimmer skeleton-title"
                ></div>


                <div
                    class="skeleton-shimmer skeleton-text"
                ></div>


                <div
                    class="skeleton-shimmer skeleton-label"
                ></div>


                <div
                    class="skeleton-shimmer skeleton-input"
                ></div>


                <div
                    class="skeleton-shimmer skeleton-label"
                ></div>


                <div
                    class="skeleton-shimmer skeleton-input"
                ></div>


                <div
                    class="skeleton-shimmer skeleton-options"
                ></div>


                <div
                    class="skeleton-shimmer skeleton-button"
                ></div>

            </div>


            <!-- =================================================
                 LOGO
                 ================================================= -->

            <div class="logo-section">

                <div class="logo-wrapper">

                    <div class="logo-background"></div>


                    <img
                        src="{{ asset('images/hydrosmart4.png') }}"
                        alt="HYDROSMART Logo"
                    >

                </div>

            </div>


            <!-- =================================================
                 HEADING
                 ================================================= -->

            <div class="login-heading">

                <h1>
                    Welcome Back
                </h1>


                <p>
                    Sign in to access your
                    <span>HYDROSMART</span>
                    dashboard.
                </p>

            </div>


            <!-- =================================================
                 SESSION STATUS
                 ================================================= -->

            <x-auth-session-status
                class="w-full mb-5"
                :status="session('status')"
            />


            <!-- =================================================
                 LOGIN FORM
                 ================================================= -->

            <form
                method="POST"
                action="{{ route('login') }}"
                id="loginForm"
                class="login-form"
            >

                @csrf


                <!-- =================================================
                     EMAIL
                     ================================================= -->

                <div class="form-group">

                    <label for="email">
                        Email Address
                    </label>


                    <div class="input-wrapper">

                        <i
                            data-lucide="mail"
                            class="input-icon"
                        ></i>


                        <input
                            id="email"
                            type="email"
                            name="email"
                            value="{{ old('email') }}"
                            required
                            autofocus
                            autocomplete="username"
                            autocapitalize="none"
                            spellcheck="false"
                            placeholder="Enter your email"
                        >

                    </div>


                    <x-input-error
                        :messages="$errors->get('email')"
                        class="input-error"
                    />

                </div>


                <!-- =================================================
                     PASSWORD
                     ================================================= -->

                <div class="form-group">

                    <label for="password">
                        Password
                    </label>


                    <div class="input-wrapper">

                        <i
                            data-lucide="lock"
                            class="input-icon"
                        ></i>


                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            autocomplete="current-password"
                            placeholder="Enter your password"
                        >


                        <!-- Password Toggle -->

                        <button
                            type="button"
                            id="togglePassword"
                            class="password-toggle"
                            aria-label="Show password"
                        >

                            <i
                                id="eyeIcon"
                                data-lucide="eye"
                            ></i>

                        </button>

                    </div>


                    <x-input-error
                        :messages="$errors->get('password')"
                        class="input-error"
                    />

                </div>


                <!-- =================================================
                     LOGIN OPTIONS
                     ================================================= -->

                <div class="login-options">


                    <!-- Remember Me -->

                    <label
                        for="remember"
                        class="remember-label"
                    >

                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            value="1"
                        >


                        <span>
                            Remember me
                        </span>

                    </label>


                    <!-- Forgot Password -->

                    @if (Route::has('password.request'))

                        <a
                            href="{{ route('password.request') }}"
                            class="forgot-link"
                        >
                            Forgot password?
                        </a>

                    @endif

                </div>


                <!-- =================================================
                     LOGIN BUTTON
                     ================================================= -->

                <button
                    type="submit"
                    id="loginBtn"
                    class="login-button"
                >


                    <!-- Spinner -->

                    <svg
                        id="spinner"
                        class="hidden spinner"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >

                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                            class="spinner-circle"
                        ></circle>


                        <path
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>

                    </svg>


                    <!-- Login Icon -->

                    <i
                        id="loginIcon"
                        data-lucide="log-in"
                    ></i>


                    <!-- Login Text -->

                    <span id="loginText">
                        Login
                    </span>

                </button>

            </form>


            <!-- =================================================
                 SECURITY FOOTER
                 ================================================= -->

            <div class="secure-footer">

                <i data-lucide="shield-check"></i>


                <span>
                    Secure HYDROSMART Access
                </span>

            </div>


        </div>


        <!-- =================================================
             COPYRIGHT
             ================================================= -->

        <p class="copyright">

            © {{ date('Y') }} HYDROSMART

        </p>


    </main>


</body>

</html>
