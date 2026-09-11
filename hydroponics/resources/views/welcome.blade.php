<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>HYDROSMART | Smart Hydroponics Monitoring</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>

    @vite(['resources/css/welcome.css', 'resources/js/welcome.js'])
</head>

<body>

<!-- =====================================================
     SKELETON LOADING
====================================================== -->

<div id="skeletonPage" class="skeleton-page">

    <div class="skeleton-navbar">
        <div class="skeleton skeleton-logo"></div>
    </div>

    <section class="skeleton-hero">

        <div class="skeleton skeleton-circle"></div>

        <div class="skeleton skeleton-title"></div>

        <div class="skeleton skeleton-subtitle"></div>

        <div class="skeleton skeleton-text"></div>

        <div class="skeleton skeleton-button"></div>

    </section>

    <section class="skeleton-section">

        <div class="skeleton skeleton-heading"></div>

        <div class="skeleton-grid">

            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>
            <div class="skeleton skeleton-card"></div>

        </div>

    </section>

</div>


<!-- =====================================================
     ACTUAL CONTENT
====================================================== -->

<div id="actualContent">


    <!-- =================================================
         NAVBAR
    ================================================== -->

    <header class="navbar">

        <div class="navbar-inner">

            <a href="{{ route('login') }}" class="navbar-link">

                <img
                    src="{{ asset('images/hydrosmart1.png') }}"
                    alt="HYDROSMART"
                    class="navbar-logo"
                >

            </a>

        </div>

    </header>


    <!-- =================================================
         HERO
    ================================================== -->

    <main class="hero">

        <div class="hero-background"></div>

        <div class="bubble bubble-1"></div>
        <div class="bubble bubble-2"></div>
        <div class="bubble bubble-3"></div>
        <div class="bubble bubble-4"></div>

        <div class="hero-content">

            <div class="hero-logo-wrapper">

                <div class="logo-glow"></div>

                <img
                    src="{{ asset('images/hydrosmart4.png') }}"
                    alt="HYDROSMART Logo"
                    class="hero-logo"
                >

            </div>


            <div class="system-badge">

                <span class="live-dot"></span>

                SMART HYDROPONICS MONITORING SYSTEM

            </div>


            <h1 class="hero-title">
                Monitor. Understand. Grow.
            </h1>


            <h2 class="hero-subtitle">
                Smarter Water Quality Management for Hydroponics
            </h2>


            <p class="hero-description">

                <strong>HYDROSMART</strong> is a web-based
                monitoring and control platform designed to make
                hydroponic system management
                <span class="blue-text">smarter</span>,
                <span class="green-text">easier</span>,
                and more
                <span class="cyan-text">efficient</span>.

            </p>


            <a
                href="{{ route('login') }}"
                class="dashboard-button"
            >

                <span>Access Dashboard</span>

                <i data-feather="arrow-right"></i>

            </a>


            <div class="scroll-hint">

                <span>EXPLORE HYDROSMART</span>

                <i data-feather="chevron-down"></i>

            </div>

        </div>

    </main>


    <!-- =================================================
         CLIENT / ORGANIZATION
    ================================================== -->

    <section class="organization-section">

        <div class="section-container">

            <div class="organization-grid">


                <!-- CLIENT LOGO -->

                <div class="organization-logo-card">

                    <span class="section-label">
                        IMPLEMENTATION PARTNER
                    </span>


                    <div class="client-logo-wrapper">

                        <img
                            src="{{ asset('images/client logo.jpg') }}"
                            alt="Client Organization Logo"
                            class="client-logo"
                        >

                    </div>


                    <div class="logo-caption">

                        <i data-feather="check-circle"></i>

                        <span>
                            Partner Organization
                        </span>

                    </div>

                </div>


                <!-- ORGANIZATION INFORMATION -->

                <div class="organization-content">

                    <span class="section-label">
                        ABOUT THE ORGANIZATION
                    </span>


                    <h2>

                        Smart Monitoring
                        <span>for Real-World Farming</span>

                    </h2>


                    <p>

                        HYDROSMART is designed to support
                        hydroponic farming through centralized
                        monitoring of important water-quality
                        conditions.

                    </p>


                    <p>

                        By connecting the physical monitoring
                        environment with a web-based dashboard,
                        the system provides a more convenient
                        way to observe the condition of the
                        hydroponic system.

                    </p>


                    <div class="organization-points">

                        <div class="organization-point">

                            <div class="point-icon blue-point">

                                <i data-feather="activity"></i>

                            </div>

                            <div>

                                <strong>
                                    Smart Monitoring
                                </strong>

                                <span>
                                    Centralized system information
                                </span>

                            </div>

                        </div>


                        <div class="organization-point">

                            <div class="point-icon green-point">

                                <i data-feather="leaf"></i>

                            </div>

                            <div>

                                <strong>
                                    Hydroponic Focus
                                </strong>

                                <span>
                                    Designed for crop production
                                </span>

                            </div>

                        </div>


                        <div class="organization-point">

                            <div class="point-icon purple-point">

                                <i data-feather="monitor"></i>

                            </div>

                            <div>

                                <strong>
                                    Web-Based Platform
                                </strong>

                                <span>
                                    Accessible monitoring interface
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </section>


    <!-- =================================================
         FARM SECTION
    ================================================== -->

    <section class="farm-section">

        <div class="section-container">


            <div class="farm-intro">

                <div class="farm-text">

                    <span class="section-label">
                        IMPLEMENTATION SITE
                    </span>


                    <h2>

                        Built Around a
                        <span>Real Growing Environment</span>

                    </h2>


                    <p>

                        The HYDROSMART platform connects
                        digital monitoring with the physical
                        hydroponic environment where water
                        quality and system conditions matter.

                    </p>


                    <p>

                        The implementation site can be
                        showcased through actual photographs,
                        allowing visitors to see the environment
                        where the monitoring system is applied.

                    </p>


                    <div class="farm-highlights">

                        <div class="farm-highlight">

                            <div class="highlight-icon">

                                <i data-feather="map-pin"></i>

                            </div>

                            <div>

                                <strong>
                                    Actual Implementation Site
                                </strong>

                                <span>
                                    Real-world agricultural environment
                                </span>

                            </div>

                        </div>


                        <div class="farm-highlight">

                            <div class="highlight-icon green-highlight">

                                <i data-feather="sun"></i>

                            </div>

                            <div>

                                <strong>
                                    Sustainable Growing
                                </strong>

                                <span>
                                    Supporting smarter hydroponic management
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- MAIN FARM PHOTO -->

                <div class="farm-main-photo">

                    <img
                        src="{{ asset('images/farm6.jpg') }}"
                        alt="Hydroponic Farm"
                    >

                    <div class="photo-overlay">

                        <span>
                            HYDROSMART
                        </span>

                        <strong>
                            Smart Farming Environment
                        </strong>

                    </div>

                </div>

            </div>


            <!-- GALLERY -->

            <div class="gallery-header">

                <div>

                    <span class="section-label">
                        FARM GALLERY
                    </span>

                    <h2>

                        Explore the
                        <span>Growing Environment</span>

                    </h2>

                </div>


                <p>

                    Take a closer look at the agricultural
                    environment where HYDROSMART can be
                    implemented and utilized.

                </p>

            </div>


            <div class="farm-gallery">


                <div class="gallery-item gallery-large">

                    <img
                        src="{{ asset('images/farm5.jpg') }}"
                        alt="Hydroponic Farm"
                    >

                    <div class="gallery-caption">
                        Hydroponic Growing Area
                    </div>

                </div>


                <div class="gallery-item">

                    <img
                        src="{{ asset('images/water.jpg') }}"
                        alt="Hydroponic Farm"
                    >

                    <div class="gallery-caption">
                        Farm Environment
                    </div>

                </div>


                <div class="gallery-item">

                    <img
                        src="{{ asset('images/farm2.jpg') }}"
                        alt="Hydroponic Farm"
                    >

                    <div class="gallery-caption">
                        Production Area
                    </div>

                </div>

            </div>

        </div>

    </section>


    <!-- =================================================
         MONITORING
    ================================================== -->

    <section class="monitoring-section">

        <div class="section-container">

            <div class="section-heading">

                <span class="section-label">
                    SMART MONITORING
                </span>

                <h2>
                    Everything in One Dashboard
                </h2>

                <div class="section-line"></div>

                <p>

                    Monitor essential hydroponic conditions
                    through one centralized platform.

                </p>

            </div>


            <div class="monitor-grid">


                <div class="monitor-card">

                    <div class="monitor-icon water-icon">

                        <i data-feather="droplet"></i>

                    </div>

                    <span class="monitor-small">
                        WATER LEVEL
                    </span>

                    <h3>
                        Real-Time
                    </h3>

                    <p>
                        Monitor the available water
                        level in the system.
                    </p>

                </div>


                <div class="monitor-card">

                    <div class="monitor-icon ph-icon">

                        <i data-feather="activity"></i>

                    </div>

                    <span class="monitor-small">
                        pH
                    </span>

                    <h3>
                        Monitored
                    </h3>

                    <p>
                        Observe the acidity condition
                        of the monitored water.
                    </p>

                </div>


                <div class="monitor-card">

                    <div class="monitor-icon ec-icon">

                        <i data-feather="bar-chart-2"></i>

                    </div>

                    <span class="monitor-small">
                        EC / TDS
                    </span>

                    <h3>
                        Monitored
                    </h3>

                    <p>
                        Track indicators related to
                        nutrient concentration.
                    </p>

                </div>


                <div class="monitor-card">

                    <div class="monitor-icon temp-icon">

                        <i data-feather="thermometer"></i>

                    </div>

                    <span class="monitor-small">
                        TEMPERATURE
                    </span>

                    <h3>
                        Monitored
                    </h3>

                    <p>
                        Observe the water temperature
                        condition.
                    </p>

                </div>

            </div>

        </div>

    </section>


    <!-- =================================================
         WHY HYDROSMART
    ================================================== -->

    <section class="why-section">

        <div class="section-container">

            <div class="why-grid">


                <div class="why-content">

                    <span class="section-label blue-label">
                        WHY HYDROSMART?
                    </span>


                    <h2>

                        Turning Farm Data Into
                        <span>Useful Information</span>

                    </h2>


                    <p>

                        HYDROSMART brings important monitoring
                        information together in one accessible
                        web platform, making system observation
                        more convenient.

                    </p>


                    <div class="benefit">

                        <div class="benefit-icon">

                            <i data-feather="eye"></i>

                        </div>

                        <div>

                            <h3>
                                Better Visibility
                            </h3>

                            <p>
                                Quickly view important system
                                conditions through the dashboard.
                            </p>

                        </div>

                    </div>


                    <div class="benefit">

                        <div class="benefit-icon green-benefit">

                            <i data-feather="clock"></i>

                        </div>

                        <div>

                            <h3>
                                Convenient Monitoring
                            </h3>

                            <p>
                                Access monitoring information
                                from a centralized interface.
                            </p>

                        </div>

                    </div>


                    <div class="benefit">

                        <div class="benefit-icon purple-benefit">

                            <i data-feather="sliders"></i>

                        </div>

                        <div>

                            <h3>
                                Remote Control
                            </h3>

                            <p>
                                Control connected equipment
                                through the web interface.
                            </p>

                        </div>

                    </div>

                </div>


                <!-- DASHBOARD PREVIEW -->

                <div class="dashboard-preview">

                    <div class="preview-header">

                        <div>

                            <small>
                                HYDROSMART
                            </small>

                            <h3>
                                Monitoring Center
                            </h3>

                        </div>


                        <span class="ready">

                            <span></span>

                            System Ready

                        </span>

                    </div>


                    <div class="preview-grid">


                        <div class="preview-card">

                            <i data-feather="droplet"></i>

                            <span>
                                Water Level
                            </span>

                            <strong>
                                Monitoring
                            </strong>

                        </div>


                        <div class="preview-card">

                            <i data-feather="activity"></i>

                            <span>
                                pH
                            </span>

                            <strong>
                                Monitoring
                            </strong>

                        </div>


                        <div class="preview-card">

                            <i data-feather="bar-chart-2"></i>

                            <span>
                                EC / TDS
                            </span>

                            <strong>
                                Monitoring
                            </strong>

                        </div>


                        <div class="preview-card">

                            <i data-feather="thermometer"></i>

                            <span>
                                Temperature
                            </span>

                            <strong>
                                Monitoring
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </section>


    <!-- =================================================
         FEATURES
    ================================================== -->

    <section class="features-section">

        <div class="section-container">

            <div class="section-heading">

                <span class="section-label">
                    KEY FEATURES
                </span>

                <h2>
                    Built for Smarter Hydroponics
                </h2>

                <div class="section-line"></div>

            </div>


            <div class="feature-grid">


                <div class="feature-card blue-card">

                    <div class="feature-icon">

                        <i data-feather="monitor"></i>

                    </div>

                    <h3>
                        Real-Time Monitoring
                    </h3>

                    <p>

                        View important sensor information
                        through one centralized dashboard.

                    </p>

                </div>


                <div class="feature-card green-card">

                    <div class="feature-icon">

                        <i data-feather="trending-up"></i>

                    </div>

                    <h3>
                        Data Tracking
                    </h3>

                    <p>

                        Observe system conditions and
                        support better monitoring decisions.

                    </p>

                </div>


                <div class="feature-card purple-card">

                    <div class="feature-icon">

                        <i data-feather="sliders"></i>

                    </div>

                    <h3>
                        Remote Control
                    </h3>

                    <p>

                        Manage connected equipment through
                        the web-based control interface.

                    </p>

                </div>

            </div>

        </div>

    </section>


    <!-- =================================================
         HOW IT WORKS
    ================================================== -->

    <section class="process-section">

        <div class="section-container">

            <div class="section-heading dark-heading">

                <span class="section-label cyan-label">
                    HOW IT WORKS
                </span>

                <h2>
                    From Sensors to Your Screen
                </h2>

                <div class="section-line"></div>

            </div>


            <div class="process-grid">


                <div class="process-card">

                    <span>01</span>

                    <h3>
                        Sensors
                    </h3>

                    <p>
                        Sensors collect important
                        system information.
                    </p>

                </div>


                <div class="process-card">

                    <span>02</span>

                    <h3>
                        Processing
                    </h3>

                    <p>
                        Sensor readings are processed
                        by the monitoring system.
                    </p>

                </div>


                <div class="process-card">

                    <span>03</span>

                    <h3>
                        Data
                    </h3>

                    <p>
                        Information becomes available
                        through the platform.
                    </p>

                </div>


                <div class="process-card">

                    <span>04</span>

                    <h3>
                        Dashboard
                    </h3>

                    <p>
                        The administrator can monitor
                        and control the system.
                    </p>

                </div>

            </div>

        </div>

    </section>


    <!-- =================================================
         FINAL CTA
    ================================================== -->

    <section class="final-cta">

        <div>

            <div class="final-icon">

                <i data-feather="activity"></i>

            </div>


            <h2>
                Ready to Monitor Smarter?
            </h2>


            <p>

                Access HYDROSMART and manage your
                hydroponic monitoring system from
                one centralized platform.

            </p>


            <a
                href="{{ route('login') }}"
                class="final-button"
            >

                <span>Access Dashboard</span>

                <i data-feather="arrow-right"></i>

            </a>

        </div>

    </section>


    <!-- =================================================
         FOOTER
    ================================================== -->

    <footer class="footer">

        <p>
            Smart Hydroponics Monitoring & Control
        </p>


        <span>
            © {{ date('Y') }} HYDROSMART Monitoring Platform
        </span>

    </footer>

</div>


</body>
</html>
