<x-app-layout>

{{-- =========================================================
     CONTROL PANEL HEADER
========================================================== --}}

<x-slot name="header">

    <div class="dashboard-header control-dashboard-header">

        <div>

            <p class="dashboard-eyebrow">
                HYDROSMART
            </p>

            <h1>
                Control Panel
            </h1>

            <p>
                Water Quality & Dosing Control
            </p>

        </div>

        <div class="dashboard-live">
            <span></span>
            SYSTEM READY
        </div>

    </div>

</x-slot>


{{-- =========================================================
     CONTROL PAGE
========================================================== --}}

<div class="control-page">


    {{-- =====================================================
         MAIN TANK CONDITION
    ====================================================== --}}

    <section class="control-section">

        <div class="control-section-header">

            <div>

                <h2>
                    Main Tank Water Condition
                </h2>

                <p>
                    Monitor EC and pH before controlling the dosing pumps.
                </p>

            </div>

            <div
                id="statusMsg"
                class="water-status status-danger"
            >
                ⚠️ Water Not Balanced
            </div>

        </div>


        <div class="condition-grid">


            {{-- EC --}}

            <div class="condition-card">

                <div class="condition-icon ec-icon">

                    <span class="material-icons">
                        bolt
                    </span>

                </div>

                <div class="condition-info">

                    <h3>
                        EC
                    </h3>

                    <p class="condition-description">
                        Nutrient concentration
                    </p>

                    <div class="condition-value">

                        <span id="ecValue">
                            --
                        </span>

                        <small>
                            µS/cm
                        </small>

                    </div>

                    <p class="condition-range">
                        Recommended: 1700 – 2000 µS/cm
                    </p>

                </div>

            </div>


            {{-- pH --}}

            <div class="condition-card">

                <div class="condition-icon ph-icon">

                    <span class="material-icons">
                        science
                    </span>

                </div>

                <div class="condition-info">

                    <h3>
                        pH
                    </h3>

                    <p class="condition-description">
                        Water acidity
                    </p>

                    <div class="condition-value">

                        <span id="phValue">
                            --
                        </span>

                    </div>

                    <p class="condition-range">
                        Recommended: 5.5 – 6.5
                    </p>

                </div>

            </div>

        </div>

    </section>



    {{-- =====================================================
         DOSING MODE
    ====================================================== --}}

    <section class="control-section">

        <div class="control-section-header">

            <div>

                <h2>
                    Dosing Control Mode
                </h2>

                <p>
                    Choose how the dosing pumps will be controlled.
                </p>

            </div>

            <div class="mode-status">

                <span class="mode-dot"></span>

                <span id="modeStatusText">
                    Manual Mode
                </span>

            </div>

        </div>


        <div class="mode-grid">


            {{-- AUTOMATIC --}}

            <button
                type="button"
                id="automaticModeButton"
                class="mode-card"
            >

                <div class="mode-icon automatic-icon">

                    <span class="material-icons">
                        auto_mode
                    </span>

                </div>

                <div class="mode-content">

                    <h3>
                        Automatic Dosing
                    </h3>

                    <p>
                        Automatically controls the pumps based on
                        EC and pH readings.
                    </p>

                </div>

                <div
                    id="automaticModeIndicator"
                    class="mode-select-indicator"
                ></div>

            </button>


            {{-- MANUAL --}}

            <button
                type="button"
                id="manualModeButton"
                class="mode-card active"
            >

                <div class="mode-icon manual-icon">

                    <span class="material-icons">
                        touch_app
                    </span>

                </div>

                <div class="mode-content">

                    <h3>
                        Manual Control
                    </h3>

                    <p>
                        Manually control each dosing pump
                        using the ON/OFF switches.
                    </p>

                </div>

                <div
                    id="manualModeIndicator"
                    class="mode-select-indicator"
                ></div>

            </button>

        </div>


        <div
            id="automaticInfo"
            class="hidden automatic-info"
        >

            <span class="material-icons">
                auto_mode
            </span>

            <div>

                <strong>
                    Automatic Dosing Active
                </strong>

                <p>
                    The ESP32 controls dosing automatically.
                    The Control Panel only monitors the process.
                </p>

            </div>

        </div>

    </section>



    {{-- =====================================================
         DOSING CALIBRATION
    ====================================================== --}}

    <section class="control-section">

        <div class="control-section-header">

            <div>

                <h2>
                    Dosing Calibration
                </h2>

                <p>
                    Enter the actual measured pump flow rate and
                    the amount to dispense per automatic dosing step.
                </p>

            </div>

            <div class="pump-system-status">

                <span
                    id="calibrationStatusDot"
                    class="status-dot"
                ></span>

                <span id="calibrationStatus">
                    Loading calibration...
                </span>

            </div>

        </div>


        <div class="calibration-grid">


            {{-- =================================================
                 NUTRIENT A
            ================================================== --}}

            <div class="calibration-card">

                <div class="calibration-card-header">

                    <div class="calibration-icon">
                        <span class="material-icons">
                            science
                        </span>
                    </div>

                    <div>

                        <h3>
                            Nutrient A
                        </h3>

                        <p>
                            EC correction
                        </p>

                    </div>

                </div>


                <div class="calibration-field">

                    <label for="nutrientAFlow">
                        Actual Flow Rate
                    </label>

                    <div class="input-with-unit">

                        <input
                            type="number"
                            id="nutrientAFlow"
                            min="0"
                            max="200"
                            step="0.1"
                            placeholder="e.g. 80"
                        >

                        <span>
                            mL/min
                        </span>

                    </div>

                </div>


                <div class="calibration-field">

                    <label for="nutrientADose">
                        Automatic Dose Step
                    </label>

                    <div class="input-with-unit">

                        <input
                            type="number"
                            id="nutrientADose"
                            min="0.1"
                            max="100"
                            step="0.1"
                            placeholder="e.g. 10"
                        >

                        <span>
                            mL
                        </span>

                    </div>

                </div>


                <div class="calibration-runtime">

                    <span>
                        Calculated Runtime
                    </span>

                    <strong id="nutrientARuntime">
                        --
                    </strong>

                </div>

            </div>



            {{-- =================================================
                 NUTRIENT B
            ================================================== --}}

            <div class="calibration-card">

                <div class="calibration-card-header">

                    <div class="calibration-icon">
                        <span class="material-icons">
                            science
                        </span>
                    </div>

                    <div>

                        <h3>
                            Nutrient B
                        </h3>

                        <p>
                            EC correction
                        </p>

                    </div>

                </div>


                <div class="calibration-field">

                    <label for="nutrientBFlow">
                        Actual Flow Rate
                    </label>

                    <div class="input-with-unit">

                        <input
                            type="number"
                            id="nutrientBFlow"
                            min="0"
                            max="200"
                            step="0.1"
                            placeholder="e.g. 80"
                        >

                        <span>
                            mL/min
                        </span>

                    </div>

                </div>


                <div class="calibration-field">

                    <label for="nutrientBDose">
                        Automatic Dose Step
                    </label>

                    <div class="input-with-unit">

                        <input
                            type="number"
                            id="nutrientBDose"
                            min="0.1"
                            max="100"
                            step="0.1"
                            placeholder="e.g. 10"
                        >

                        <span>
                            mL
                        </span>

                    </div>

                </div>


                <div class="calibration-runtime">

                    <span>
                        Calculated Runtime
                    </span>

                    <strong id="nutrientBRuntime">
                        --
                    </strong>

                </div>

            </div>



            {{-- =================================================
                 PH DOWN
            ================================================== --}}

            <div class="calibration-card">

                <div class="calibration-card-header">

                    <div class="calibration-icon">
                        <span class="material-icons">
                            water_drop
                        </span>
                    </div>

                    <div>

                        <h3>
                            pH Down
                        </h3>

                        <p>
                            pH correction
                        </p>

                    </div>

                </div>


                <div class="calibration-field">

                    <label for="phDownFlow">
                        Actual Flow Rate
                    </label>

                    <div class="input-with-unit">

                        <input
                            type="number"
                            id="phDownFlow"
                            min="0"
                            max="200"
                            step="0.1"
                            placeholder="e.g. 80"
                        >

                        <span>
                            mL/min
                        </span>

                    </div>

                </div>


                <div class="calibration-field">

                    <label for="phDownDose">
                        Automatic Dose Step
                    </label>

                    <div class="input-with-unit">

                        <input
                            type="number"
                            id="phDownDose"
                            min="0.1"
                            max="100"
                            step="0.1"
                            placeholder="e.g. 5"
                        >

                        <span>
                            mL
                        </span>

                    </div>

                </div>


                <div class="calibration-runtime">

                    <span>
                        Calculated Runtime
                    </span>

                    <strong id="phDownRuntime">
                        --
                    </strong>

                </div>

            </div>

        </div>


        {{-- =================================================
             GLOBAL DOSING SETTINGS
        ================================================== --}}

        <div class="dosing-global-settings">

            <div class="calibration-field">

                <label for="mixTimeSeconds">
                    Mixing / Stabilization Wait
                </label>

                <div class="input-with-unit">

                    <input
                        type="number"
                        id="mixTimeSeconds"
                        min="10"
                        max="300"
                        step="1"
                        placeholder="60"
                    >

                    <span>
                        seconds
                    </span>

                </div>

            </div>


            <div class="calibration-field">

                <label for="maxTotalDoseML">
                    Maximum Automatic Dose / Session
                </label>

                <div class="input-with-unit">

                    <input
                        type="number"
                        id="maxTotalDoseML"
                        min="10"
                        max="5000"
                        step="10"
                        placeholder="250"
                    >

                    <span>
                        mL
                    </span>

                </div>

            </div>

        </div>


        <div class="calibration-actions">

            <button
                type="button"
                id="saveCalibrationButton"
                class="calibration-save-button"
            >

                <span class="material-icons">
                    save
                </span>

                Save Dosing Calibration

            </button>


            <span
                id="calibrationMessage"
                class="calibration-message"
            ></span>

        </div>


        <div class="calibration-note">

            <span class="material-icons">
                info
            </span>

            <p>
                Measure the actual output of each pump using the final
                tubing and hose installation. Do not rely only on the
                product listing flow rate. The dose step should be kept
                small and adjusted after observing the EC/pH response.
            </p>

        </div>

    </section>



    {{-- =====================================================
         DOSING PUMPS
    ====================================================== --}}

    <section class="control-section">

        <div class="control-section-header">

            <div>

                <h2>
                    Dosing Pumps
                </h2>

                <p>
                    Nutrient A, Nutrient B and Phosphoric Acid
                </p>

            </div>

            <div class="pump-system-status">

                <span class="status-dot"></span>

                <span id="pumpControlStatus">
                    Manual Control
                </span>

            </div>

        </div>


        <div class="pump-grid">

            @php

                $pumps = [

                    [
                        'id' => 'nutrientA',
                        'label' => 'Nutrient Pump A',
                        'icon' => 'science',
                        'description' => 'Nutrient A solution',
                        'type' => 'EC'
                    ],

                    [
                        'id' => 'nutrientB',
                        'label' => 'Nutrient Pump B',
                        'icon' => 'science',
                        'description' => 'Nutrient B solution',
                        'type' => 'EC'
                    ],

                    [
                        'id' => 'phDown',
                        'label' => 'pH Down Pump',
                        'icon' => 'water_drop',
                        'description' => 'Phosphoric acid',
                        'type' => 'pH'
                    ]

                ];

            @endphp


            @foreach ($pumps as $pump)

                <div
                    id="{{ $pump['id'] }}Card"
                    class="pump-card"
                >

                    <div class="pump-card-top">

                        <div class="pump-icon">

                            <span class="material-icons">
                                {{ $pump['icon'] }}
                            </span>

                        </div>

                        <span
                            id="{{ $pump['id'] }}Indicator"
                            class="pump-indicator"
                        ></span>

                    </div>


                    <div class="pump-title">

                        <h3>
                            {{ $pump['label'] }}
                        </h3>

                        <p>
                            {{ $pump['description'] }}
                        </p>

                    </div>


                    <div class="pump-target">

                        <span>
                            Used for
                        </span>

                        <strong>
                            {{ $pump['type'] }}
                        </strong>

                    </div>


                    <div class="pump-control">

                        <span class="pump-control-label">
                            Pump
                        </span>

                        <label class="pump-switch">

                            <input
                                type="checkbox"
                                id="{{ $pump['id'] }}Switch"
                            >

                            <span class="pump-slider"></span>

                        </label>

                    </div>


                    <div
                        id="{{ $pump['id'] }}Label"
                        class="pump-state"
                    >
                        OFF
                    </div>


                    <div
                        id="{{ $pump['id'] }}Msg"
                        class="hidden pump-message"
                    >
                        Dosing...
                    </div>

                </div>

            @endforeach

        </div>

    </section>



    {{-- =====================================================
         DOSING GUIDELINES
    ====================================================== --}}

    <section class="control-section">

        <div class="control-section-header">

            <div>

                <h2>
                    Dosing Guidelines
                </h2>

                <p>
                    Reference for pump operation
                </p>

            </div>

        </div>


        <div class="guideline-grid">

            <div class="guideline-card">

                <span class="material-icons">
                    bolt
                </span>

                <div>

                    <strong>
                        Nutrient A
                    </strong>

                    <p>
                        Used when EC is below the desired
                        nutrient concentration.
                    </p>

                </div>

            </div>


            <div class="guideline-card">

                <span class="material-icons">
                    bolt
                </span>

                <div>

                    <strong>
                        Nutrient B
                    </strong>

                    <p>
                        Used during the sequential EC dosing process.
                    </p>

                </div>

            </div>


            <div class="guideline-card">

                <span class="material-icons">
                    water_drop
                </span>

                <div>

                    <strong>
                        Phosphoric Acid
                    </strong>

                    <p>
                        Used to lower pH when the water pH
                        is above the target range.
                    </p>

                </div>

            </div>

        </div>

    </section>



    {{-- =====================================================
         SYSTEM LOGS
    ====================================================== --}}

    <section class="control-section">

        <div class="control-section-header">

            <div>

                <h2>
                    System Logs
                </h2>

                <p>
                    Pump activation and water-condition history
                </p>

            </div>

        </div>


        <div class="logs-wrapper">

            <table
                id="logsTable"
                class="logs-table"
            >

                <thead>

                    <tr>

                        <th>Date</th>
                        <th>Time</th>
                        <th>Pump</th>
                        <th>Old</th>
                        <th>New</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody></tbody>

            </table>

        </div>

    </section>


</div>


{{-- =========================================================
     CONTROL CSS + JS
========================================================== --}}

@vite([
    'resources/css/control.css',
    'resources/js/control.js'
])

</x-app-layout>
