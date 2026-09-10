<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        {{ config('app.name', 'HYDROSMART') }}
    </title>

    <meta
        name="csrf-token"
        content="{{ csrf_token() }}"
    >

    @vite([
        'resources/css/app.css',
        'resources/css/sidebar.css',
        'resources/js/app.js',
        'resources/js/sidebar.js'
    ])

    <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
    >

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>


<body class="min-h-screen overflow-hidden font-sans bg-gray-100">


    <!-- =====================================================
         MOBILE SIDEBAR OVERLAY
    ====================================================== -->

    <div
        id="sidebarOverlay"
        aria-hidden="true"
    ></div>


    <!-- =====================================================
         PAGE SHELL
    ====================================================== -->

    <div class="hydrosmart-app-shell">


        <!-- =================================================
             SIDEBAR
        ================================================== -->

        <aside
            id="mobileSidebar"
            aria-label="Main navigation"
        >


            <!-- =============================================
                 SIDEBAR BRAND
            ============================================== -->

            <div class="sidebar-brand">


                <!-- CLOSE BUTTON -->

                <button
                    id="mobileCloseButton"
                    type="button"
                    aria-label="Close menu"
                    aria-controls="mobileSidebar"
                >

                    <span class="material-icons">
                        close
                    </span>

                </button>


                <!-- BRAND CONTENT -->

                <div class="sidebar-brand-content">


                    <!-- LOGO -->

                    <div class="sidebar-logo-box">

                        <div
                            class="sidebar-logo-glow"
                            aria-hidden="true"
                        ></div>

                        <img
                            src="{{ asset('images/hydrosmart4.png') }}"
                            alt="HYDROSMART"
                            class="sidebar-logo"
                        >

                    </div>


                    <!-- BRAND INFO -->

                    <div class="sidebar-brand-info">

                        <h1>
                            HYDRO<span>SMART</span>
                        </h1>

                        <p>
                            SMART WATER MONITORING
                        </p>

                        <div
                            class="sidebar-accent"
                            aria-hidden="true"
                        >

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                    </div>

                </div>

            </div>


            <!-- =================================================
                 SIDEBAR NAVIGATION
            ================================================== -->

            <nav
                class="sidebar-nav"
                aria-label="Primary navigation"
            >

                <ul>


                    <!-- DASHBOARD -->

                    <li>

                        <a
                            href="{{ route('dashboard') }}"
                            class="sidebar-link {{ request()->routeIs('dashboard') ? 'active' : '' }}"
                            @if(request()->routeIs('dashboard'))
                                aria-current="page"
                            @endif
                        >

                            <span class="sidebar-icon">

                                <span class="material-icons">
                                    dashboard
                                </span>

                            </span>

                            <span class="sidebar-link-text">
                                Dashboard
                            </span>

                        </a>

                    </li>


                    <!-- CONTROL PANEL -->

                    <li>

                        <a
                            href="{{ route('control') }}"
                            class="sidebar-link {{ request()->routeIs('control') ? 'active' : '' }}"
                            @if(request()->routeIs('control'))
                                aria-current="page"
                            @endif
                        >

                            <span class="sidebar-icon">

                                <span class="material-icons">
                                    tune
                                </span>

                            </span>

                            <span class="sidebar-link-text">
                                Control Panel
                            </span>

                        </a>

                    </li>


                    <!-- ANALYTICS -->

                    <li>

                        <a
                            href="{{ route('analytics') }}"
                            class="sidebar-link {{ request()->routeIs('analytics') ? 'active' : '' }}"
                            @if(request()->routeIs('analytics'))
                                aria-current="page"
                            @endif
                        >

                            <span class="sidebar-icon">

                                <span class="material-icons">
                                    insights
                                </span>

                            </span>

                            <span class="sidebar-link-text">
                                Analytics
                            </span>

                        </a>

                    </li>


                    <!-- ALERTS -->

                    <li>

                        <a
                            href="{{ route('alerts') }}"
                            class="sidebar-link {{ request()->routeIs('alerts') ? 'active' : '' }}"
                            @if(request()->routeIs('alerts'))
                                aria-current="page"
                            @endif
                        >

                            <span class="sidebar-icon">

                                <span class="material-icons">
                                    notifications_active
                                </span>

                            </span>

                            <span class="sidebar-link-text">
                                Alerts
                            </span>

                        </a>

                    </li>


                    <!-- SYSTEM STATUS -->

                    <li>

                        <a
                            href="{{ route('systemstatus') }}"
                            class="sidebar-link {{ request()->routeIs('systemstatus') ? 'active' : '' }}"
                            @if(request()->routeIs('systemstatus'))
                                aria-current="page"
                            @endif
                        >

                            <span class="sidebar-icon">

                                <span class="material-icons">
                                    eco
                                </span>

                            </span>

                            <span class="sidebar-link-text">
                                System Status
                            </span>

                        </a>

                    </li>


                    <!-- REPORTS -->

                    <li>

                        <a
                            href="{{ route('reports') }}"
                            class="sidebar-link {{ request()->routeIs('reports') ? 'active' : '' }}"
                            @if(request()->routeIs('reports'))
                                aria-current="page"
                            @endif
                        >

                            <span class="sidebar-icon">

                                <span class="material-icons">
                                    assessment
                                </span>

                            </span>

                            <span class="sidebar-link-text">
                                Reports
                            </span>

                        </a>

                    </li>

                </ul>

            </nav>


            <!-- =================================================
                 LOGOUT
            ================================================== -->

            <div class="sidebar-logout">

                <form
                    id="logoutForm"
                    method="POST"
                    action="{{ route('logout') }}"
                >

                    @csrf

                    <button
                        type="button"
                        id="logoutButton"
                        class="logout-button"
                    >

                        <span class="logout-icon">

                            <span class="material-icons">
                                logout
                            </span>

                        </span>

                        <span class="logout-text">
                            Logout
                        </span>

                    </button>

                </form>

            </div>

        </aside>


        <!-- =================================================
             MAIN AREA
        ================================================== -->

        <main
            id="mainContent"
            class="hydrosmart-main"
        >

            <div class="hydrosmart-main-inner">


                <!-- =================================================
                     GLOBAL HEADER
                ================================================== -->

                @isset($header)

                    <div class="dashboard-page-header">

                        <header class="dashboard-header-card">


                            <!-- RIGHT GLOW -->

                            <div
                                class="dashboard-header-glow dashboard-header-glow-right"
                                aria-hidden="true"
                            ></div>


                            <!-- LEFT GLOW -->

                            <div
                                class="dashboard-header-glow dashboard-header-glow-left"
                                aria-hidden="true"
                            ></div>


                            <!-- HEADER CONTENT -->

                            <div class="dashboard-header-content">


                                <!-- MOBILE MENU -->

                                <button
                                    id="mobileMenuButton"
                                    type="button"
                                    class="mobile-dashboard-menu"
                                    aria-label="Open menu"
                                    aria-expanded="false"
                                    aria-controls="mobileSidebar"
                                >

                                    <span class="material-icons">
                                        menu
                                    </span>

                                </button>


                                <!-- PAGE HEADER -->

                                <div class="dashboard-header-slot">

                                    {{ $header }}

                                </div>


                                <!-- PROFILE -->

                                <a
                                    href="{{ route('profile.edit') }}"
                                    class="dashboard-profile-button"
                                    title="Profile"
                                    aria-label="Open Profile"
                                >

                                    <span class="material-icons">
                                        account_circle
                                    </span>

                                </a>

                            </div>

                        </header>

                    </div>

                @endisset


                <!-- =================================================
                     PAGE CONTENT
                ================================================== -->

                <div class="hydrosmart-page-content">

                    {{ $slot }}

                </div>

            </div>

        </main>

    </div>


    <!-- =====================================================
         LOGOUT MODAL
    ====================================================== -->

    <div
        id="logoutModal"
        class="logout-modal"
        aria-hidden="true"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logoutModalTitle"
    >

        <div
            class="logout-modal-box"
            role="document"
        >


            <!-- ICON -->

            <div class="logout-modal-icon">

                <span class="material-icons">
                    logout
                </span>

            </div>


            <!-- TITLE -->

            <h2
                id="logoutModalTitle"
                class="logout-modal-title"
            >
                Confirm Logout
            </h2>


            <!-- TEXT -->

            <p class="logout-modal-text">

                Are you sure you want to log out of
                <strong>HYDROSMART</strong>?

            </p>


            <!-- ACTIONS -->

            <div class="logout-modal-actions">


                <!-- CANCEL -->

                <button
                    type="button"
                    id="cancelLogout"
                    class="logout-cancel"
                >

                    Cancel

                </button>


                <!-- CONFIRM -->

                <button
                    type="button"
                    id="confirmLogout"
                    class="logout-confirm"
                >

                    <span class="material-icons">
                        logout
                    </span>

                    <span>
                        Yes, Logout
                    </span>

                </button>

            </div>

        </div>

    </div>


</body>

</html>
