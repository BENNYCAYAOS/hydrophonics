<x-app-layout>

    <x-slot name="header">

        <div class="analytics-header">

            <div>

                <p class="analytics-eyebrow">
                    HYDROSMART
                </p>

                <h1>
                    Analytics
                </h1>

                <p>
                    Water Quality & System Performance
                </p>

            </div>


            <div class="analytics-live">

                <span></span>

                LIVE ANALYTICS

            </div>

        </div>

    </x-slot>


    <div class="analytics-page">


        <!-- ================================================= -->
        <!-- SENSOR TRENDS -->
        <!-- ================================================= -->

        <section class="analytics-card sensor-trends-card">

            <div class="analytics-card-header">

                <div class="analytics-title">

                    <div class="analytics-icon blue">

                        <span class="material-icons">
                            show_chart
                        </span>

                    </div>

                    <div>

                        <h2>
                            Sensor Trends
                        </h2>

                        <p>
                            Real-time monitoring of all water parameters
                        </p>

                    </div>

                </div>

            </div>


            <div class="sensor-legend">

                <div>
                    <span class="legend-dot ph"></span>
                    pH
                </div>

                <div>
                    <span class="legend-dot ec"></span>
                    EC
                </div>

                <div>
                    <span class="legend-dot temp"></span>
                    Temperature
                </div>

                <div>
                    <span class="legend-dot water"></span>
                    Water Level
                </div>

            </div>


            <div class="analytics-chart-large">

                <canvas id="sensorChart"></canvas>

            </div>

        </section>



        <!-- ================================================= -->
        <!-- QUICK SENSOR SUMMARY -->
        <!-- ================================================= -->

        <section class="analytics-card">

            <div class="analytics-card-header">

                <div class="analytics-title">

                    <div class="analytics-icon green">

                        <span class="material-icons">
                            sensors
                        </span>

                    </div>

                    <div>

                        <h2>
                            Current Sensor Summary
                        </h2>

                        <p>
                            Latest recorded system values
                        </p>

                    </div>

                </div>

            </div>


            <div class="sensor-summary-grid">


                <div class="summary-item">

                    <div class="summary-icon ph-bg">

                        <span class="material-icons">
                            science
                        </span>

                    </div>

                    <div>

                        <span>
                            pH Level
                        </span>

                        <strong id="analyticsPh">
                            --
                        </strong>

                    </div>

                </div>


                <div class="summary-item">

                    <div class="summary-icon ec-bg">

                        <span class="material-icons">
                            bolt
                        </span>

                    </div>

                    <div>

                        <span>
                            EC
                        </span>

                        <strong id="analyticsEc">
                            --
                        </strong>

                    </div>

                </div>


                <div class="summary-item">

                    <div class="summary-icon temp-bg">

                        <span class="material-icons">
                            thermostat
                        </span>

                    </div>

                    <div>

                        <span>
                            Temperature
                        </span>

                        <strong id="analyticsTemp">
                            -- °C
                        </strong>

                    </div>

                </div>


                <div class="summary-item">

                    <div class="summary-icon water-bg">

                        <span class="material-icons">
                            water_drop
                        </span>

                    </div>

                    <div>

                        <span>
                            Water Level
                        </span>

                        <strong id="analyticsWater">
                            --
                        </strong>

                    </div>

                </div>

            </div>

        </section>



        <!-- ================================================= -->
        <!-- DOSING PUMP USAGE -->
        <!-- ================================================= -->

        <section class="analytics-card">

            <div class="analytics-card-header">

                <div class="analytics-title">

                    <div class="analytics-icon purple">

                        <span class="material-icons">
                            local_drink
                        </span>

                    </div>

                    <div>

                        <h2>
                            Dosing Pump Usage
                        </h2>

                        <p>
                            Activation frequency of the three dosing pumps
                        </p>

                    </div>

                </div>

            </div>


            <div class="pump-chart-container">

                <canvas id="pumpChart"></canvas>

            </div>


            <div class="pump-summary">

                <div class="pump-stat">

                    <span class="pump-a"></span>

                    <div>

                        <small>
                            Nutrient A
                        </small>

                        <strong id="pumpAUsage">
                            0 activations
                        </strong>

                    </div>

                </div>


                <div class="pump-stat">

                    <span class="pump-b"></span>

                    <div>

                        <small>
                            Nutrient B
                        </small>

                        <strong id="pumpBUsage">
                            0 activations
                        </strong>

                    </div>

                </div>


                <div class="pump-stat">

                    <span class="pump-ph"></span>

                    <div>

                        <small>
                            Phosphoric Acid
                        </small>

                        <strong id="pumpPHUsage">
                            0 activations
                        </strong>

                    </div>

                </div>

            </div>

        </section>



        <!-- ================================================= -->
        <!-- WATER QUALITY PERFORMANCE -->
        <!-- ================================================= -->

        <section class="analytics-card">

            <div class="analytics-card-header">

                <div class="analytics-title">

                    <div class="analytics-icon green">

                        <span class="material-icons">
                            verified
                        </span>

                    </div>

                    <div>

                        <h2>
                            Water Quality Performance
                        </h2>

                        <p>
                            Overall condition of monitored water parameters
                        </p>

                    </div>

                </div>

            </div>


            <div class="performance-layout">

                <div class="performance-chart">

                    <canvas id="performanceChart"></canvas>

                </div>


                <div class="performance-info">

                    <div class="performance-row normal">

                        <span>

                            <i></i>

                            Normal

                        </span>

                        <strong id="normalPercent">
                            0%
                        </strong>

                    </div>


                    <div class="performance-row warning">

                        <span>

                            <i></i>

                            Warning

                        </span>

                        <strong id="warningPercent">
                            0%
                        </strong>

                    </div>


                    <div class="performance-row critical">

                        <span>

                            <i></i>

                            Critical

                        </span>

                        <strong id="criticalPercent">
                            0%
                        </strong>

                    </div>

                </div>

            </div>

        </section>



        <!-- ================================================= -->
        <!-- ALERT SUMMARY -->
        <!-- ================================================= -->

        <section class="analytics-card">

            <div class="analytics-card-header">

                <div class="analytics-title">

                    <div class="analytics-icon red">

                        <span class="material-icons">
                            notifications_active
                        </span>

                    </div>

                    <div>

                        <h2>
                            Alerts Summary
                        </h2>

                        <p>
                            Recorded water quality alerts
                        </p>

                    </div>

                </div>

            </div>


            <div class="alert-grid">


                <div class="alert-item">

                    <span class="material-icons alert-red">
                        science
                    </span>

                    <div>

                        <span>
                            pH Alerts
                        </span>

                        <strong id="phAlerts">
                            0
                        </strong>

                    </div>

                </div>


                <div class="alert-item">

                    <span class="material-icons alert-yellow">
                        bolt
                    </span>

                    <div>

                        <span>
                            EC Alerts
                        </span>

                        <strong id="ecAlerts">
                            0
                        </strong>

                    </div>

                </div>


                <div class="alert-item">

                    <span class="material-icons alert-blue">
                        thermostat
                    </span>

                    <div>

                        <span>
                            Temperature Alerts
                        </span>

                        <strong id="tempAlerts">
                            0
                        </strong>

                    </div>

                </div>


                <div class="alert-item">

                    <span class="material-icons alert-purple">
                        water_drop
                    </span>

                    <div>

                        <span>
                            Water Level Alerts
                        </span>

                        <strong id="waterAlerts">
                            0
                        </strong>

                    </div>

                </div>

            </div>

        </section>

    </div>



    <!-- ================================================= -->
    <!-- ANALYTICS CSS -->
    <!-- ================================================= -->

    @vite([
        'resources/css/analytics.css'
    ])


    <!-- ================================================= -->
    <!-- ANALYTICS JS -->
    <!-- ================================================= -->

    @vite([
        'resources/js/analytics.js'
    ])

</x-app-layout>
