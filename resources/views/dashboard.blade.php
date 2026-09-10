<x-app-layout>

    {{-- =========================================================
         DASHBOARD HEADER
         SAME DESIGN AS CONTROL PANEL
         SKELETON LOADING RETAINED
    ========================================================== --}}

    <x-slot name="header">

        <div class="dashboard-header control-dashboard-header dashboard-header-loading">

            <div>

                <p class="dashboard-eyebrow skeleton-text skeleton-eyebrow">
                    HYDROSMART
                </p>

                <h1 class="skeleton-text skeleton-title">
                    Dashboard
                </h1>

                <p class="skeleton-text skeleton-subtitle">
                    Water Quality Monitoring Overview
                </p>

            </div>


            <div class="dashboard-live skeleton-live">

                <span></span>

                LIVE MONITORING

            </div>

        </div>

    </x-slot>


    <!-- =================================================
         SENSOR OVERVIEW
    ================================================= -->

    <div class="dashboard-grid">


        <!-- =================================================
             WATER LEVEL
             TEAL / GREEN
        ================================================= -->

        <div class="sensor-card water-card is-loading">

            <div class="sensor-card-top">

                <div class="sensor-card-heading">

                    <h2>
                        Water Level
                    </h2>

                    <p>
                        Tank level
                    </p>

                </div>


                <div class="sensor-icon water-icon">

                    <span class="material-icons">
                        water_drop
                    </span>

                </div>

            </div>


            <div class="gauge-container">

                <canvas
                    id="waterGauge"
                    width="120"
                    height="120"
                ></canvas>

            </div>


            <div class="sensor-reading">

                <span
                    id="waterLevelValue"
                    class="sensor-value"
                >
                    75
                </span>

                <span class="sensor-unit">
                    %
                </span>

            </div>


            <p class="safe-range">
                Safe Range: 60% – 90%
            </p>


            <span
                id="waterLevelStatus"
                class="status-badge status-normal"
            >

                <span class="status-dot"></span>

                Normal

            </span>

        </div>


        <!-- =================================================
             PH
             PURPLE
        ================================================= -->

        <div class="sensor-card ph-card is-loading">

            <div class="sensor-card-top">

                <div class="sensor-card-heading">

                    <h2>
                        pH Level
                    </h2>

                    <p>
                        Water acidity
                    </p>

                </div>


                <div class="sensor-icon ph-icon">

                    <span class="material-icons">
                        science
                    </span>

                </div>

            </div>


            <div class="gauge-container">

                <canvas
                    id="phGauge"
                    width="120"
                    height="120"
                ></canvas>

            </div>


            <div class="sensor-reading">

                <span
                    id="phValue"
                    class="sensor-value"
                >
                    --
                </span>

                <span class="sensor-unit">
                    pH
                </span>

            </div>


            <p class="safe-range">
                Safe Range: 5.5 – 6.0
            </p>


            <span
                id="phStatus"
                class="status-badge status-connecting"
            >

                <span class="status-dot"></span>

                Connecting...

            </span>

        </div>


        <!-- =================================================
             EC
             BLUE
        ================================================= -->

        <div class="sensor-card ec-card is-loading">

            <div class="sensor-card-top">

                <div class="sensor-card-heading">

                    <h2>
                        EC
                    </h2>

                    <p>
                        Nutrient concentration
                    </p>

                </div>


                <div class="sensor-icon ec-icon">

                    <span class="material-icons">
                        bolt
                    </span>

                </div>

            </div>


            <div class="gauge-container">

                <canvas
                    id="ecGauge"
                    width="120"
                    height="120"
                ></canvas>

            </div>


            <div class="sensor-reading">

                <span
                    id="ecValue"
                    class="sensor-value"
                >
                    --
                </span>

                <span class="sensor-unit">
                    mS/cm
                </span>

            </div>


            <p class="safe-range">
                Safe Range: 1.7 – 2.0 mS/cm
            </p>


            <span
                id="ecStatus"
                class="status-badge status-connecting"
            >

                <span class="status-dot"></span>

                Connecting...

            </span>

        </div>


        <!-- =================================================
             WATER TEMPERATURE
             ORANGE
        ================================================= -->

        <div class="sensor-card temp-card is-loading">

            <div class="sensor-card-top">

                <div class="sensor-card-heading">

                    <h2>
                        Water Temp
                    </h2>

                    <p>
                        Water temperature
                    </p>

                </div>


                <div class="sensor-icon temp-icon">

                    <span class="material-icons">
                        thermostat
                    </span>

                </div>

            </div>


            <div class="gauge-container">

                <canvas
                    id="tempGauge"
                    width="120"
                    height="120"
                ></canvas>

            </div>


            <div class="sensor-reading">

                <span
                    id="temperatureValue"
                    class="sensor-value"
                >
                    --
                </span>

                <span class="sensor-unit">
                    °C
                </span>

            </div>


            <p class="safe-range">
                Safe Range: 18°C – 26°C
            </p>


            <span
                id="temperatureStatus"
                class="status-badge status-connecting"
            >

                <span class="status-dot"></span>

                Connecting...

            </span>

        </div>

    </div>


    <!-- =================================================
         MAIN TANK
    ================================================= -->

    <section class="dashboard-section main-tank-loading">

        <div class="section-card">


            <!-- =================================================
                 MAIN TANK HEADER
            ================================================= -->

            <div class="section-header">

                <div class="section-title">

                    <div class="section-icon">

                        <span class="material-icons">
                            water_damage
                        </span>

                    </div>


                    <div>

                        <h2>
                            Main Tank Water Level
                        </h2>

                        <p>
                            1000 Liter Main Tank • Float Switch Monitoring
                        </p>

                    </div>

                </div>


                <span
                    id="mainTankStatus"
                    class="main-status"
                >
                    Connecting...
                </span>

            </div>


            <!-- =================================================
                 MAIN TANK INFORMATION
            ================================================= -->

            <div class="tank-grid">


                <!-- LEVEL -->

                <div class="info-card tank-level-card">

                    <div class="tank-circle">

                        <span id="mainTankValue">
                            --
                        </span>

                    </div>


                    <h3>
                        Water Level
                    </h3>


                    <p>
                        Based on Float Switch
                    </p>

                </div>


                <!-- FLOAT SWITCH -->

                <div class="info-card">

                    <div class="info-card-title">

                        <span class="material-icons">
                            toggle_on
                        </span>

                        Float Switch

                    </div>


                    <div class="info-row">

                        <span>
                            Switch State
                        </span>

                        <strong id="mainTankFloat">
                            --
                        </strong>

                    </div>


                    <div class="info-row">

                        <span>
                            Condition
                        </span>

                        <strong id="mainTankCondition">
                            --
                        </strong>

                    </div>

                </div>


                <!-- TANK INFORMATION -->

                <div class="info-card">

                    <div class="info-card-title">

                        <span class="material-icons">
                            analytics
                        </span>

                        Tank Information

                    </div>


                    <div class="info-row">

                        <span>
                            Capacity
                        </span>

                        <strong>
                            1000 L
                        </strong>

                    </div>


                    <div class="info-row">

                        <span>
                            Critical Level
                        </span>

                        <strong>
                            30%
                        </strong>

                    </div>


                    <div class="info-row">

                        <span>
                            Critical Volume
                        </span>

                        <strong>
                            300 L
                        </strong>

                    </div>

                </div>

            </div>


            <!-- =================================================
                 TANK DETAILS
            ================================================= -->

            <div class="tank-details">

                <div class="detail-card">

                    <span>
                        Critical Condition
                    </span>

                    <strong id="mainTankCritical">
                        --
                    </strong>

                </div>


                <div class="detail-card">

                    <span>
                        Green Indicator
                    </span>

                    <strong id="mainTankGreenLED">
                        OFF
                    </strong>

                </div>


                <div class="detail-card">

                    <span>
                        Red Indicator
                    </span>

                    <strong id="mainTankRedLED">
                        OFF
                    </strong>

                </div>

            </div>


            <!-- =================================================
                 INFORMATION
            ================================================= -->

            <div class="monitoring-info">

                <div class="monitoring-info-icon">

                    <span class="material-icons">
                        info
                    </span>

                </div>


                <div>

                    <h3>
                        Main Tank Monitoring
                    </h3>


                    <p>
                        The float switch provides an ON/OFF water-level indication.
                        It does not measure the exact number of liters in the tank.
                    </p>


                    <p>
                        The critical point is set at
                        <strong>30%</strong> or
                        <strong>300 liters</strong>
                        of the 1000-liter tank.
                    </p>

                </div>

            </div>

        </div>

    </section>


    <!-- =================================================
         REAL-TIME GRAPHS
    ================================================= -->

    <section class="dashboard-section realtime-graphs-section">

        <div class="section-card">


            <!-- =================================================
                 REAL-TIME GRAPH HEADER
                 SKELETON RETAINED
            ================================================= -->

            <div class="section-header graph-header graph-header-loading">

                <div class="section-title">

                    <div class="section-icon">

                        <span class="material-icons">
                            show_chart
                        </span>

                    </div>


                    <div>

                        <h2>
                            Real-Time Sensor Graphs
                        </h2>

                        <p>
                            Live monitoring of system parameters
                        </p>

                    </div>

                </div>

            </div>


            <!-- =================================================
                 GRAPH GRID
            ================================================= -->

            <div class="graph-grid">


                <!-- =================================================
                     PH GRAPH
                     PURPLE
                ================================================= -->

                <div class="graph-card ph-graph is-loading">

                    <div class="graph-title">

                        <span class="material-icons">
                            science
                        </span>

                        <span>
                            pH Level
                        </span>

                    </div>


                    <div class="chart-container">

                        <canvas id="phChart"></canvas>

                    </div>

                </div>


                <!-- =================================================
                     EC GRAPH
                     BLUE
                ================================================= -->

                <div class="graph-card ec-graph is-loading">

                    <div class="graph-title">

                        <span class="material-icons">
                            bolt
                        </span>

                        <span>
                            EC / mS/cm
                        </span>

                    </div>


                    <div class="chart-container">

                        <canvas id="ecChart"></canvas>

                    </div>

                </div>


                <!-- =================================================
                     TEMPERATURE GRAPH
                     ORANGE
                ================================================= -->

                <div class="graph-card temp-graph is-loading">

                    <div class="graph-title">

                        <span class="material-icons">
                            thermostat
                        </span>

                        <span>
                            Water Temperature
                        </span>

                    </div>


                    <div class="chart-container">

                        <canvas id="tempChart"></canvas>

                    </div>

                </div>


                <!-- =================================================
                     WATER LEVEL GRAPH
                     TEAL / GREEN
                ================================================= -->

                <div class="graph-card water-graph is-loading">

                    <div class="graph-title">

                        <span class="material-icons">
                            water_drop
                        </span>

                        <span>
                            Water Level
                        </span>

                    </div>


                    <div class="chart-container">

                        <canvas id="waterChart"></canvas>

                    </div>

                </div>


            </div>

        </div>

    </section>


    <!-- =================================================
         DASHBOARD CSS + UI JS
    ================================================= -->

    @vite([
        'resources/css/dashboard.css',
        'resources/js/dashboard.js'
    ])


    <!-- =================================================
         SENSOR FILES
    ================================================= -->

    @vite([
        'resources/js/firebase.js',
        'resources/js/sensors/water-temperature.js',
        'resources/js/sensors/ph.js',
        'resources/js/sensors/water-level.js',
        'resources/js/sensors/ec.js',
        'resources/js/sensors/maintank.js'
    ])

</x-app-layout>
