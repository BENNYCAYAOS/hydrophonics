<x-app-layout>

    <x-slot name="header">

        <!-- =====================================================
             DASHBOARD-STYLE HEADER
        ====================================================== -->

        <div class="dashboard-header">

            <div>

                <p class="dashboard-eyebrow">
                    HYDROSMART
                </p>

                <h1>
                    Alerts & Notifications
                </h1>

                <p>
                    Real-time system alerts and recommended actions
                </p>

            </div>


            <div class="dashboard-live">

                <span></span>

                SYSTEM MONITORING

            </div>

        </div>

    </x-slot>


    <!-- =========================================================
         ALERTS PAGE
    ========================================================== -->

    <div class="alerts-page">


        <!-- =====================================================
             ALERT SUMMARY
        ====================================================== -->

        <section class="alert-summary-grid">


            <!-- CRITICAL -->

            <div class="alert-summary-card alert-critical">

                <div class="alert-summary-content">

                    <div>

                        <p class="alert-summary-label">
                            Critical
                        </p>

                        <p
                            id="criticalCount"
                            class="alert-summary-number"
                        >
                            0
                        </p>

                    </div>


                    <div class="alert-summary-icon">

                        <span class="material-icons">
                            error
                        </span>

                    </div>

                </div>


                <p class="alert-summary-description">
                    Requires immediate attention
                </p>

            </div>



            <!-- WARNING -->

            <div class="alert-summary-card alert-warning">

                <div class="alert-summary-content">

                    <div>

                        <p class="alert-summary-label">
                            Warning
                        </p>

                        <p
                            id="warningCount"
                            class="alert-summary-number"
                        >
                            0
                        </p>

                    </div>


                    <div class="alert-summary-icon">

                        <span class="material-icons">
                            warning
                        </span>

                    </div>

                </div>


                <p class="alert-summary-description">
                    Monitor system condition
                </p>

            </div>



            <!-- NORMAL -->

            <div class="alert-summary-card alert-normal">

                <div class="alert-summary-content">

                    <div>

                        <p class="alert-summary-label">
                            Normal
                        </p>

                        <p
                            id="normalCount"
                            class="alert-summary-number"
                        >
                            0
                        </p>

                    </div>


                    <div class="alert-summary-icon">

                        <span class="material-icons">
                            check_circle
                        </span>

                    </div>

                </div>


                <p class="alert-summary-description">
                    Parameters within range
                </p>

            </div>

        </section>



        <!-- =====================================================
             CURRENT ALERTS
        ====================================================== -->

        <section class="alert-section">

            <div class="alert-section-header">

                <div class="alert-section-title">

                    <h2>
                        Current Alerts
                    </h2>

                    <p>
                        Latest conditions detected by the monitoring system
                    </p>

                </div>


                <span class="alert-live">

                    <span class="alert-live-dot"></span>

                    LIVE

                </span>

            </div>



            <!-- =================================================
                 FIREBASE WILL RENDER CURRENT SENSOR ALERTS HERE
            ================================================== -->

            <div class="current-alerts-grid">

                <div class="alert-card alert-card-normal">

                    <div class="alert-card-header">

                        <div class="alert-card-main">

                            <div class="alert-card-icon">

                                <span class="material-icons">
                                    sensors
                                </span>

                            </div>


                            <div>

                                <h3 class="alert-card-title">
                                    Connecting to Firebase
                                </h3>

                                <p class="alert-card-description">
                                    Waiting for real-time sensor data...
                                </p>

                            </div>

                        </div>


                        <span class="alert-severity">
                            LIVE
                        </span>

                    </div>


                    <div class="alert-value-row">

                        <div>

                            <span class="alert-value-label">
                                System Status
                            </span>

                            <p class="alert-value">
                                Connecting
                            </p>

                        </div>


                        <div class="alert-value-right">

                            <span class="alert-value-label">
                                Firebase
                            </span>

                            <p class="alert-value">
                                Live
                            </p>

                        </div>

                    </div>


                    <div class="alert-action">

                        <p class="alert-action-title">
                            Status
                        </p>

                        <p class="alert-action-text">
                            The system is connecting to the HydroSmart Firebase database.
                        </p>

                    </div>

                </div>

            </div>

        </section>



        <!-- =====================================================
             ALERT HISTORY
        ====================================================== -->

        <section class="alert-section">

            <div class="alert-section-header">

                <div class="alert-section-title">

                    <h2>
                        Alert History
                    </h2>

                    <p>
                        Previous system alerts and their recommended actions
                    </p>

                </div>

            </div>


            <div class="alert-table-wrapper">

                <table class="alert-table">

                    <thead>

                        <tr>

                            <th>
                                Date
                            </th>

                            <th>
                                Time
                            </th>

                            <th>
                                Sensor
                            </th>

                            <th>
                                Value
                            </th>

                            <th>
                                Severity
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <!-- =================================================
                         FIREBASE WILL LOAD LATEST 5 ALERTS HERE
                    ================================================== -->

                    <tbody id="alertHistoryBody">

                        <tr>

                            <td
                                colspan="6"
                                style="text-align:center;"
                            >
                                Loading alert history...
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </section>



        <!-- =====================================================
             INFORMATION
        ====================================================== -->

        <section class="alert-information">

            <div class="alert-information-icon">

                <span class="material-icons">
                    info
                </span>

            </div>


            <div>

                <h3>
                    Alert Monitoring
                </h3>

                <p>
                    Alerts are generated when monitored water-quality
                    parameters move outside their configured ranges.
                    Critical alerts require immediate attention, while
                    warning alerts indicate that the condition should be
                    monitored.
                </p>

            </div>

        </section>


    </div>


    <!-- =========================================================
         ALERTS JAVASCRIPT
    ========================================================== -->

    @vite([
        'resources/js/alerts.js'
    ])


    <!-- =========================================================
         ALERTS CSS
    ========================================================== -->

    @vite([
        'resources/css/alerts.css'
    ])

</x-app-layout>

