
<x-app-layout>

    <x-slot name="header">

        <!-- =====================================================
             SYSTEM STATUS HEADER
        ====================================================== -->

        <div class="system-page-header">

            <div class="system-page-header-content">

                <div class="system-page-header-title">

                    <p class="system-page-eyebrow">
                        HYDROSMART
                    </p>

                    <h1>
                        System Status
                    </h1>

                    <p class="system-page-description">
                        Device, Sensor & Dosing System Health
                    </p>

                </div>


                <div
                    id="overallStatus"
                    class="system-live"
                >

                    <span class="system-live-dot"></span>

                    <span>
                        SYSTEM CHECKING
                    </span>

                </div>

            </div>

        </div>

    </x-slot>


    <div class="system-status-page">


        <!-- =====================================================
             ESP32 & CONNECTIVITY
        ====================================================== -->

        <section class="system-section">

            <div class="system-section-header">

                <div class="system-section-title">

                    <div class="system-icon blue">

                        <span class="material-icons">
                            wifi
                        </span>

                    </div>

                    <div>

                        <h2>
                            ESP32 & Connectivity
                        </h2>

                        <p>
                            Microcontroller and communication status
                        </p>

                    </div>

                </div>


                <span
                    id="espStatusBadge"
                    class="system-badge connecting"
                >
                    Connecting...
                </span>

            </div>


            <div class="system-info-grid">

                <div class="system-info-card">

                    <div class="system-info-label">
                        ESP32
                    </div>

                    <div
                        id="esp32Status"
                        class="system-info-value"
                    >
                        --
                    </div>

                    <span class="system-info-description">
                        Device connection
                    </span>

                </div>


                <div class="system-info-card">

                    <div class="system-info-label">
                        Wi-Fi
                    </div>

                    <div
                        id="wifiStatus"
                        class="system-info-value"
                    >
                        --
                    </div>

                    <span class="system-info-description">
                        Network connection
                    </span>

                </div>


                <div class="system-info-card">

                    <div class="system-info-label">
                        Firebase
                    </div>

                    <div
                        id="firebaseStatus"
                        class="system-info-value"
                    >
                        --
                    </div>

                    <span class="system-info-description">
                        Database connection
                    </span>

                </div>


                <div class="system-info-card">

                    <div class="system-info-label">
                        Last Sync
                    </div>

                    <div
                        id="lastSync"
                        class="system-info-value"
                    >
                        --
                    </div>

                    <span class="system-info-description">
                        Latest device update
                    </span>

                </div>

            </div>

        </section>



        <!-- =====================================================
             SENSOR HEALTH
        ====================================================== -->

        <section class="system-section">

            <div class="system-section-header">

                <div class="system-section-title">

                    <div class="system-icon green">

                        <span class="material-icons">
                            sensors
                        </span>

                    </div>

                    <div>

                        <h2>
                            Sensor Health
                        </h2>

                        <p>
                            Current condition of monitoring sensors
                        </p>

                    </div>

                </div>

            </div>


            <div class="health-grid">

                <!-- PH -->

                <div class="health-card">

                    <div class="health-card-top">

                        <div class="health-icon">

                            <span class="material-icons">
                                science
                            </span>

                        </div>

                        <span
                            id="phHealthBadge"
                            class="health-badge connecting"
                        >
                            --
                        </span>

                    </div>

                    <h3>
                        pH Sensor
                    </h3>

                    <p>
                        Current Reading
                    </p>

                    <strong id="phSensorValue">
                        --
                    </strong>

                </div>


                <!-- EC -->

                <div class="health-card">

                    <div class="health-card-top">

                        <div class="health-icon">

                            <span class="material-icons">
                                bolt
                            </span>

                        </div>

                        <span
                            id="ecHealthBadge"
                            class="health-badge connecting"
                        >
                            --
                        </span>

                    </div>

                    <h3>
                        EC Sensor
                    </h3>

                    <p>
                        Current Reading
                    </p>

                    <strong id="ecSensorValue">
                        --
                    </strong>

                </div>


                <!-- TEMPERATURE -->

                <div class="health-card">

                    <div class="health-card-top">

                        <div class="health-icon">

                            <span class="material-icons">
                                thermostat
                            </span>

                        </div>

                        <span
                            id="temperatureHealthBadge"
                            class="health-badge connecting"
                        >
                            --
                        </span>

                    </div>

                    <h3>
                        Water Temperature
                    </h3>

                    <p>
                        Current Reading
                    </p>

                    <strong id="temperatureSensorValue">
                        --
                    </strong>

                </div>


                <!-- WATER LEVEL -->

                <div class="health-card">

                    <div class="health-card-top">

                        <div class="health-icon">

                            <span class="material-icons">
                                water_drop
                            </span>

                        </div>

                        <span
                            id="levelHealthBadge"
                            class="health-badge connecting"
                        >
                            --
                        </span>

                    </div>

                    <h3>
                        Water Level
                    </h3>

                    <p>
                        Ultrasonic Level
                    </p>

                    <strong id="waterLevelSensorValue">
                        --
                    </strong>

                </div>

            </div>

        </section>



        <!-- =====================================================
             DOSING SYSTEM
        ====================================================== -->

        <section class="system-section">

            <div class="system-section-header">

                <div class="system-section-title">

                    <div class="system-icon yellow">

                        <span class="material-icons">
                            medication
                        </span>

                    </div>

                    <div>

                        <h2>
                            Dosing System
                        </h2>

                        <p>
                            Relay and dosing pump status
                        </p>

                    </div>

                </div>


                <div
                    id="dosingModeBadge"
                    class="system-badge manual"
                >
                    Manual Mode
                </div>

            </div>


            <div class="pump-status-grid">

                <!-- NUTRIENT A -->

                <div class="pump-status-card">

                    <div class="pump-status-icon">

                        <span class="material-icons">
                            science
                        </span>

                    </div>

                    <div class="pump-status-content">

                        <h3>
                            Nutrient Pump A
                        </h3>

                        <p>
                            Nutrient A solution
                        </p>

                        <strong id="nutrientAStatus">
                            OFF
                        </strong>

                    </div>

                    <span
                        id="nutrientAIndicator"
                        class="pump-status-indicator off"
                    ></span>

                </div>


                <!-- NUTRIENT B -->

                <div class="pump-status-card">

                    <div class="pump-status-icon">

                        <span class="material-icons">
                            science
                        </span>

                    </div>

                    <div class="pump-status-content">

                        <h3>
                            Nutrient Pump B
                        </h3>

                        <p>
                            Nutrient B solution
                        </p>

                        <strong id="nutrientBStatus">
                            OFF
                        </strong>

                    </div>

                    <span
                        id="nutrientBIndicator"
                        class="pump-status-indicator off"
                    ></span>

                </div>


                <!-- PH DOWN -->

                <div class="pump-status-card">

                    <div class="pump-status-icon">

                        <span class="material-icons">
                            water_drop
                        </span>

                    </div>

                    <div class="pump-status-content">

                        <h3>
                            pH Down Pump
                        </h3>

                        <p>
                            Phosphoric acid
                        </p>

                        <strong id="phDownStatus">
                            OFF
                        </strong>

                    </div>

                    <span
                        id="phDownIndicator"
                        class="pump-status-indicator off"
                    ></span>

                </div>

            </div>


            <!-- DOSING SUMMARY -->

            <div class="dosing-summary">

                <div>

                    <span>
                        Current Mode
                    </span>

                    <strong id="currentDosingMode">
                        Manual
                    </strong>

                </div>


                <div>

                    <span>
                        Automatic Dosing
                    </span>

                    <strong id="automaticDosingStatus">
                        INACTIVE
                    </strong>

                </div>


                <div>

                    <span>
                        Active Pumps
                    </span>

                    <strong id="activePumpCount">
                        0
                    </strong>

                </div>

            </div>

        </section>



        <!-- =====================================================
             MAIN TANK
        ====================================================== -->

        <section class="system-section">

            <div class="system-section-header">

                <div class="system-section-title">

                    <div class="system-icon blue">

                        <span class="material-icons">
                            water_damage
                        </span>

                    </div>

                    <div>

                        <h2>
                            Main Tank
                        </h2>

                        <p>
                            1000-liter tank monitoring
                        </p>

                    </div>

                </div>


                <span
                    id="tankStatusBadge"
                    class="system-badge connecting"
                >
                    Checking...
                </span>

            </div>


            <div class="tank-status-grid">

                <div class="tank-status-card">

                    <span>
                        Tank Capacity
                    </span>

                    <strong>
                        1000 L
                    </strong>

                </div>


                <div class="tank-status-card">

                    <span>
                        Critical Level
                    </span>

                    <strong>
                        30%
                    </strong>

                </div>


                <div class="tank-status-card">

                    <span>
                        Critical Volume
                    </span>

                    <strong>
                        300 L
                    </strong>

                </div>


                <div class="tank-status-card">

                    <span>
                        Level Sensor
                    </span>

                    <strong id="floatSwitchStatus">
                        Ultrasonic
                    </strong>

                </div>

            </div>

        </section>



        <!-- =====================================================
             DEVICE RESOURCES
        ====================================================== -->

        <section class="system-section">

            <div class="system-section-header">

                <div class="system-section-title">

                    <div class="system-icon purple">

                        <span class="material-icons">
                            memory
                        </span>

                    </div>

                    <div>

                        <h2>
                            Device Resources
                        </h2>

                        <p>
                            Current monitoring and device activity
                        </p>

                    </div>

                </div>

            </div>


            <div class="power-grid">

                <!-- SENSOR MONITORING -->

                <div class="power-card">

                    <span class="material-icons">
                        sensors
                    </span>

                    <div>

                        <span>
                            Sensor Monitoring
                        </span>

                        <strong id="sensorMonitoringStatus">
                            Waiting
                        </strong>

                    </div>

                </div>


                <!-- DOSING PUMPS -->

                <div class="power-card">

                    <span class="material-icons">
                        local_drink
                    </span>

                    <div>

                        <span>
                            Dosing Pumps
                        </span>

                        <strong id="devicePumpStatus">
                            0 Active
                        </strong>

                    </div>

                </div>


                <!-- MAIN TANK -->

                <div class="power-card">

                    <span class="material-icons">
                        water
                    </span>

                    <div>

                        <span>
                            Main Tank
                        </span>

                        <strong id="deviceTankStatus">
                            Waiting
                        </strong>

                    </div>

                </div>

            </div>

        </section>



        <!-- =====================================================
             SYSTEM OVERVIEW
        ====================================================== -->

        <section class="system-section">

            <div class="system-section-header">

                <div class="system-section-title">

                    <div class="system-icon gray">

                        <span class="material-icons">
                            dashboard
                        </span>

                    </div>

                    <div>

                        <h2>
                            System Overview
                        </h2>

                        <p>
                            Real-time operational summary
                        </p>

                    </div>

                </div>

            </div>


            <div class="summary-grid">

                <!-- SYSTEM MODE -->

                <div class="summary-card">

                    <span class="material-icons">
                        settings
                    </span>

                    <div>

                        <span>
                            System Mode
                        </span>

                        <strong id="systemMode">
                            Manual
                        </strong>

                    </div>

                </div>


                <!-- WATER CONDITION -->

                <div class="summary-card">

                    <span class="material-icons">
                        water_drop
                    </span>

                    <div>

                        <span>
                            Water Condition
                        </span>

                        <strong id="waterCondition">
                            Checking...
                        </strong>

                    </div>

                </div>


                <!-- DOSING STATUS -->

                <div class="summary-card">

                    <span class="material-icons">
                        medication
                    </span>

                    <div>

                        <span>
                            Dosing Status
                        </span>

                        <strong id="autoDosingSummary">
                            Inactive
                        </strong>

                    </div>

                </div>


                <!-- OVERALL HEALTH -->

                <div class="summary-card">

                    <span class="material-icons">
                        health_and_safety
                    </span>

                    <div>

                        <span>
                            Overall Health
                        </span>

                        <strong id="overallHealth">
                            Checking...
                        </strong>

                    </div>

                </div>

            </div>

        </section>

    </div>


    @vite([
        'resources/css/systemstatus.css',
        'resources/js/systemstatus.js'
    ])

</x-app-layout>

