<x-app-layout>

    <x-slot name="header">

        <!-- =====================================================
             SYSTEM-STATUS STYLE HEADER
             MATCHES SYSTEM STATUS HEADER
        ====================================================== -->

        <div class="reports-page-header">

            <div class="reports-page-header-content">

                <div class="reports-page-header-title">

                    <p class="reports-page-eyebrow">
                        HYDROSMART
                    </p>

                    <h1>
                        Reports
                    </h1>

                    <p class="reports-page-description">
                        Water Quality Monitoring & System Records
                    </p>

                </div>


                <div
                    id="reportingStatus"
                    class="reports-live"
                >

                    <span class="reports-live-dot"></span>

                    <span>
                        REPORTING SYSTEM
                    </span>

                </div>

            </div>

        </div>

    </x-slot>


    <div class="reports-page">


        <!-- =====================================================
             REPORT FILTER
        ====================================================== -->

        <section class="report-section filter-section">

            <div class="report-section-header">

                <div>

                    <h2>
                        Generate Report
                    </h2>

                    <p>
                        Select a date range and report type.
                    </p>

                </div>

            </div>


            <div class="report-filter-grid">


                <!-- FROM DATE -->

                <div class="filter-field">

                    <label for="fromDate">
                        From Date
                    </label>

                    <input
                        type="date"
                        id="fromDate"
                    >

                </div>


                <!-- TO DATE -->

                <div class="filter-field">

                    <label for="toDate">
                        To Date
                    </label>

                    <input
                        type="date"
                        id="toDate"
                    >

                </div>


                <!-- REPORT TYPE -->

                <div class="filter-field">

                    <label for="reportType">
                        Report Type
                    </label>

                    <select id="reportType">

                        <option value="all">
                            Complete Report
                        </option>

                        <option value="sensor">
                            Sensor Records
                        </option>

                        <option value="dosing">
                            Dosing Records
                        </option>

                        <option value="alerts">
                            Alerts
                        </option>

                        <option value="summary">
                            Daily Summary
                        </option>

                    </select>

                </div>


                <!-- GENERATE BUTTON -->

                <div class="filter-action">

                    <button
                        type="button"
                        id="generateReport"
                        class="generate-button"
                    >

                        <span class="material-icons">
                            assessment
                        </span>

                        Generate Report

                    </button>

                </div>

            </div>

        </section>



        <!-- =====================================================
             REPORT ACTIONS
        ====================================================== -->

        <section class="report-actions-section">

            <button
                type="button"
                id="printReport"
                class="report-action print-action"
            >

                <span class="material-icons">
                    print
                </span>

                Print Report

            </button>


            <button
                type="button"
                id="savePdf"
                class="report-action pdf-action"
            >

                <span class="material-icons">
                    picture_as_pdf
                </span>

                Save as PDF

            </button>


            <button
                type="button"
                id="exportExcel"
                class="report-action excel-action"
            >

                <span class="material-icons">
                    table_view
                </span>

                Export Excel

            </button>

        </section>



        <!-- =====================================================
             PRINT RECORD SELECTOR
             SCREEN = LATEST 5
             PRINT = USER SELECTED NUMBER
        ====================================================== -->

        <div class="print-record-selector">

            <label for="printRecordCount">
                Print Records
            </label>

            <select id="printRecordCount">

                <option value="5">
                    Latest 5
                </option>

                <option value="10">
                    Latest 10
                </option>

                <option value="20">
                    Latest 20
                </option>

                <option value="all">
                    All Records
                </option>

            </select>

        </div>



        <!-- =====================================================
             PRINTABLE REPORT
        ====================================================== -->

        <div id="printableReport">


            <!-- =================================================
                 REPORT COVER
            ================================================== -->

            <section class="report-cover">

                <div class="report-brand">

                    <img
                        src="{{ asset('images/hydrosmart4.png') }}"
                        alt="HYDROSMART"
                    >

                    <div>

                        <h1>
                            HYDROSMART
                        </h1>

                        <p>
                            Water Quality Monitoring System
                        </p>

                    </div>

                </div>


                <div class="report-title">

                    <h2>
                        System Report
                    </h2>

                    <p id="reportPeriod">
                        Report Period: --
                    </p>

                </div>

            </section>



            <!-- =================================================
                 SUMMARY
            ================================================== -->

            <section
                id="summarySection"
                class="report-section summary-section"
            >

                <div class="report-section-header">

                    <div>

                        <h2>
                            Report Summary
                        </h2>

                        <p>
                            Overview of the selected monitoring period.
                        </p>

                    </div>

                </div>


                <div class="summary-grid">


                    <!-- =================================================
                         AVERAGE PH
                    ================================================== -->

                    <div class="summary-card">

                        <div class="summary-icon ph-summary">

                            <span class="material-icons">
                                science
                            </span>

                        </div>

                        <div class="summary-content">

                            <span>
                                Average pH
                            </span>

                            <strong id="avgPh">
                                --
                            </strong>

                        </div>

                    </div>



                    <!-- =================================================
                         AVERAGE EC
                    ================================================== -->

                    <div class="summary-card">

                        <div class="summary-icon ec-summary">

                            <span class="material-icons">
                                bolt
                            </span>

                        </div>

                        <div class="summary-content">

                            <span>
                                Average EC
                            </span>

                            <strong id="avgEc">
                                --
                            </strong>

                        </div>

                    </div>



                    <!-- =================================================
                         AVERAGE TEMPERATURE
                    ================================================== -->

                    <div class="summary-card">

                        <div class="summary-icon temp-summary">

                            <span class="material-icons">
                                thermostat
                            </span>

                        </div>

                        <div class="summary-content">

                            <span>
                                Average Temperature
                            </span>

                            <strong id="avgTemperature">
                                --
                            </strong>

                        </div>

                    </div>



                    <!-- =================================================
                         OPTIMAL READINGS
                    ================================================== -->

                    <div class="summary-card">

                        <div class="summary-icon optimal-summary">

                            <span class="material-icons">
                                check_circle
                            </span>

                        </div>

                        <div class="summary-content">

                            <span>
                                Optimal Readings
                            </span>

                            <strong id="optimalPercentage">
                                --
                            </strong>

                        </div>

                    </div>



                    <!-- =================================================
                         PUMP ACTIVATIONS
                    ================================================== -->

                    <div class="summary-card">

                        <div class="summary-icon pump-summary">

                            <span class="material-icons">
                                local_drink
                            </span>

                        </div>

                        <div class="summary-content">

                            <span>
                                Pump Activations
                            </span>

                            <strong id="pumpActivations">
                                --
                            </strong>

                        </div>

                    </div>



                    <!-- =================================================
                         TOTAL ALERTS
                    ================================================== -->

                    <div class="summary-card">

                        <div class="summary-icon alert-summary">

                            <span class="material-icons">
                                warning
                            </span>

                        </div>

                        <div class="summary-content">

                            <span>
                                Total Alerts
                            </span>

                            <strong id="totalAlerts">
                                --
                            </strong>

                        </div>

                    </div>


                </div>

            </section>



            <!-- =================================================
                 SENSOR RECORDS
                 ONE SENSOR PER ROW
            ================================================== -->

            <section
                id="sensorSection"
                class="report-section"
            >

                <div class="report-section-header">

                    <div>

                        <h2>
                            Sensor Records
                        </h2>

                        <p>
                            Water quality monitoring history.
                        </p>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table class="report-table sensor-table">

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
                                    Reading
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody id="sensorRecordsBody">
                        </tbody>

                    </table>

                </div>

            </section>



            <!-- =================================================
                 DOSING RECORDS
            ================================================== -->

            <section
                id="dosingSection"
                class="report-section"
            >

                <div class="report-section-header">

                    <div>

                        <h2>
                            Dosing Records
                        </h2>

                        <p>
                            Manual and automatic dosing activities.
                        </p>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table class="report-table pump-table">

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Time
                                </th>

                                <th>
                                    Pump
                                </th>

                                <th>
                                    Mode
                                </th>

                                <th>
                                    Reason
                                </th>

                                <th>
                                    Duration
                                </th>

                                <th>
                                    Result
                                </th>

                            </tr>

                        </thead>


                        <tbody id="dosingRecordsBody">
                        </tbody>

                    </table>

                </div>

            </section>



            <!-- =================================================
                 ALERT RECORDS
            ================================================== -->

            <section
                id="alertsSection"
                class="report-section"
            >

                <div class="report-section-header">

                    <div>

                        <h2>
                            Alerts & Notifications
                        </h2>

                        <p>
                            System alerts and actions taken.
                        </p>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table class="report-table alert-table">

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Time
                                </th>

                                <th>
                                    Alert
                                </th>

                                <th>
                                    Value
                                </th>

                                <th>
                                    Severity
                                </th>

                                <th>
                                    Action Taken
                                </th>

                                <th>
                                    Result
                                </th>

                            </tr>

                        </thead>


                        <tbody id="alertRecordsBody">
                        </tbody>

                    </table>

                </div>

            </section>



            <!-- =================================================
                 DAILY SUMMARY
            ================================================== -->

            <section
                id="dailySection"
                class="report-section"
            >

                <div class="report-section-header">

                    <div>

                        <h2>
                            Daily Summary
                        </h2>

                        <p>
                            Daily monitoring performance.
                        </p>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table class="report-table tank-table">

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Average pH
                                </th>

                                <th>
                                    Average EC
                                </th>

                                <th>
                                    Average Temperature
                                </th>

                                <th>
                                    Optimal %
                                </th>

                                <th>
                                    Pump Activations
                                </th>

                                <th>
                                    Alerts
                                </th>

                            </tr>

                        </thead>


                        <tbody id="dailyRecordsBody">
                        </tbody>

                    </table>

                </div>

            </section>



            <!-- =================================================
                 REPORT FOOTER
            ================================================== -->

            <section class="report-footer">

                <div>

                    <strong>
                        HYDROSMART
                    </strong>

                    <span>
                        Water Quality Monitoring System
                    </span>

                </div>


                <div>

                    <span>
                        Generated:
                    </span>

                    <strong id="generatedDate">
                        --
                    </strong>

                </div>

            </section>


        </div>

    </div>


    <!-- =====================================================
         REPORT ASSETS
    ====================================================== -->

    @vite([
        'resources/css/reports.css',
        'resources/js/reports.js'
    ])

</x-app-layout>
