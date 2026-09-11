
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    database,
    firebaseLogin
} from "./firebase.js";


// =========================================================
// ANALYTICS SKELETON LOADING
// =========================================================

const ANALYTICS_MIN_LOADING_TIME = 1500;

let analyticsLoadingStartedAt = Date.now();

let analyticsFirebaseReady = false;

let analyticsSensorReady = false;

let analyticsLogsReady = false;

let analyticsAlertsReady = false;

let analyticsLoadingFinished = false;


// =========================================================
// START ANALYTICS SKELETON
// =========================================================

function startAnalyticsSkeleton() {

    analyticsLoadingStartedAt = Date.now();

    analyticsFirebaseReady = false;

    analyticsSensorReady = false;

    analyticsLogsReady = false;

    analyticsAlertsReady = false;

    analyticsLoadingFinished = false;


    const analyticsPage =
        document.querySelector(".analytics-page");


    if (analyticsPage) {

        analyticsPage.classList.add(
            "analytics-loading"
        );

    }


    document.body.classList.add(
        "analytics-page-loading"
    );


    const analyticsHeader =
        document.querySelector(".analytics-header");


    if (analyticsHeader) {

        analyticsHeader.classList.add(
            "analytics-header-loading"
        );

    }


    console.log(
        "Analytics skeleton loading started."
    );

}


// =========================================================
// CHECK ANALYTICS LOADING
// =========================================================

function checkAnalyticsLoading() {

    if (analyticsLoadingFinished) {

        return;

    }


    const allFirebaseReady =
        analyticsFirebaseReady &&
        analyticsSensorReady &&
        analyticsLogsReady &&
        analyticsAlertsReady;


    if (!allFirebaseReady) {

        return;

    }


    const elapsed =
        Date.now() -
        analyticsLoadingStartedAt;


    const remaining =
        Math.max(
            0,
            ANALYTICS_MIN_LOADING_TIME -
            elapsed
        );


    setTimeout(
        finishAnalyticsSkeleton,
        remaining
    );

}


// =========================================================
// FINISH ANALYTICS SKELETON
// =========================================================

function finishAnalyticsSkeleton() {

    if (analyticsLoadingFinished) {

        return;

    }


    analyticsLoadingFinished = true;


    const analyticsPage =
        document.querySelector(".analytics-page");


    if (analyticsPage) {

        analyticsPage.classList.remove(
            "analytics-loading"
        );

    }


    document.body.classList.remove(
        "analytics-page-loading"
    );


    const analyticsHeader =
        document.querySelector(".analytics-header");


    if (analyticsHeader) {

        analyticsHeader.classList.remove(
            "analytics-header-loading"
        );

    }


    console.log(
        "Analytics skeleton loading finished."
    );

}


// =========================================================
// START SKELETON IMMEDIATELY
// =========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startAnalyticsSkeleton,
        {
            once: true
        }
    );

}

else {

    startAnalyticsSkeleton();

}


// =========================================================
// TARGET VALUES
// =========================================================

const EC_MIN = 1700;

const EC_MAX = 2000;

const PH_MIN = 5.5;

const PH_MAX = 6.5;

const TEMP_MIN = 18;

const TEMP_MAX = 26;

const WATER_LEVEL_NORMAL = 60;

const WATER_LEVEL_WARNING = 30;


// =========================================================
// FIREBASE PATHS
// =========================================================

const PH_PATH =
    "sensors/ph";

const EC_PATH =
    "sensors/ec";

const TEMPERATURE_PATH =
    "sensors/water_temperature";

const WATER_LEVEL_PATH =
    "sensors/waterLevel";

const LOGS_PATH =
    "logs";

const ALERT_HISTORY_PATH =
    "alertHistory";


// =========================================================
// SENSOR VALUES
// =========================================================

let currentPH = null;

let currentEC = null;

let currentTemperature = null;

let currentWaterLevel = null;


// =========================================================
// SENSOR HISTORY
// =========================================================

const MAX_HISTORY = 30;

let sensorHistory = {

    labels: [],

    ph: [],

    ec: [],

    temperature: [],

    waterLevel: []

};


// =========================================================
// ALERT COUNTERS
// =========================================================

let phAlertCount = 0;

let ecAlertCount = 0;

let tempAlertCount = 0;

let waterAlertCount = 0;


// =========================================================
// PUMP COUNTERS
// =========================================================

let pumpUsage = {

    nutrientA: 0,

    nutrientB: 0,

    phDown: 0

};


// =========================================================
// DOM ELEMENTS
// =========================================================

const sensorCanvas =
    document.getElementById("sensorChart");

const pumpCanvas =
    document.getElementById("pumpChart");

const performanceCanvas =
    document.getElementById("performanceChart");


const analyticsPh =
    document.getElementById("analyticsPh");

const analyticsEc =
    document.getElementById("analyticsEc");

const analyticsTemp =
    document.getElementById("analyticsTemp");

const analyticsWater =
    document.getElementById("analyticsWater");


const pumpAUsage =
    document.getElementById("pumpAUsage");

const pumpBUsage =
    document.getElementById("pumpBUsage");

const pumpPHUsage =
    document.getElementById("pumpPHUsage");


const normalPercent =
    document.getElementById("normalPercent");

const warningPercent =
    document.getElementById("warningPercent");

const criticalPercent =
    document.getElementById("criticalPercent");


const phAlerts =
    document.getElementById("phAlerts");

const ecAlerts =
    document.getElementById("ecAlerts");

const tempAlerts =
    document.getElementById("tempAlerts");

const waterAlerts =
    document.getElementById("waterAlerts");


// =========================================================
// CHART OBJECTS
// =========================================================

let sensorChart = null;

let pumpChart = null;

let performanceChart = null;


// =========================================================
// FIREBASE REFERENCES
// =========================================================

const phReference =
    ref(
        database,
        PH_PATH
    );


const ecReference =
    ref(
        database,
        EC_PATH
    );


const temperatureReference =
    ref(
        database,
        TEMPERATURE_PATH
    );


const waterLevelReference =
    ref(
        database,
        WATER_LEVEL_PATH
    );


const logsReference =
    ref(
        database,
        LOGS_PATH
    );


const alertHistoryReference =
    ref(
        database,
        ALERT_HISTORY_PATH
    );


// =========================================================
// EXTRACT FIREBASE VALUE
// =========================================================

function extractSensorValue(data) {

    if (
        data === null ||
        data === undefined
    ) {

        return null;

    }


    if (
        typeof data === "number"
    ) {

        return Number.isFinite(data)
            ? data
            : null;

    }


    if (
        typeof data === "string"
    ) {

        const value =
            Number(data);

        return Number.isFinite(value)
            ? value
            : null;

    }


    if (
        typeof data === "object"
    ) {

        const keys = [

            "value",

            "reading",

            "val",

            "ec",

            "ph",

            "temperature",

            "water_temperature",

            "waterLevel",

            "water_level",

            "level",

            "percentage",

            "percent"

        ];


        for (
            const key of keys
        ) {

            if (
                data[key] !== undefined &&
                data[key] !== null
            ) {

                const value =
                    Number(data[key]);

                if (
                    Number.isFinite(value)
                ) {

                    return value;

                }

            }

        }

    }


    return null;

}


// =========================================================
// CREATE SENSOR CHART
// =========================================================

if (sensorCanvas) {

    sensorChart =
        new Chart(
            sensorCanvas,
            {

                type: "line",

                data: {

                    labels: [],

                    datasets: [

                        {

                            label: "pH",

                            data: [],

                            borderColor: "#2563eb",

                            backgroundColor:
                                "rgba(37,99,235,0.08)",

                            tension: 0.35,

                            fill: false

                        },

                        {

                            label: "EC",

                            data: [],

                            borderColor: "#7c3aed",

                            backgroundColor:
                                "rgba(124,58,237,0.08)",

                            tension: 0.35,

                            fill: false

                        },

                        {

                            label: "Temperature",

                            data: [],

                            borderColor: "#f59e0b",

                            backgroundColor:
                                "rgba(245,158,11,0.08)",

                            tension: 0.35,

                            fill: false

                        },

                        {

                            label: "Water Level",

                            data: [],

                            borderColor: "#06b6d4",

                            backgroundColor:
                                "rgba(6,182,212,0.08)",

                            tension: 0.35,

                            fill: false

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        mode: "index",

                        intersect: false

                    },

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        x: {

                            grid: {

                                display: false

                            }

                        },

                        y: {

                            beginAtZero: false

                        }

                    }

                }

            }
        );

}


// =========================================================
// CREATE PUMP CHART
// =========================================================

if (pumpCanvas) {

    pumpChart =
        new Chart(
            pumpCanvas,
            {

                type: "bar",

                data: {

                    labels: [

                        "Nutrient A",

                        "Nutrient B",

                        "Phosphoric Acid"

                    ],

                    datasets: [

                        {

                            label:
                                "Activations",

                            data: [

                                0,
                                0,
                                0

                            ],

                            backgroundColor: [

                                "#3b82f6",
                                "#6366f1",
                                "#10b981"

                            ],

                            borderRadius: 8,

                            barThickness: 45

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        x: {

                            grid: {

                                display: false

                            }

                        },

                        y: {

                            beginAtZero: true,

                            ticks: {

                                stepSize: 1

                            }

                        }

                    }

                }

            }
        );

}


// =========================================================
// CREATE PERFORMANCE CHART
// =========================================================

if (performanceCanvas) {

    performanceChart =
        new Chart(
            performanceCanvas,
            {

                type: "doughnut",

                data: {

                    labels: [

                        "Normal",
                        "Warning",
                        "Critical"

                    ],

                    datasets: [

                        {

                            data: [

                                0,
                                0,
                                0

                            ],

                            backgroundColor: [

                                "#22c55e",
                                "#f59e0b",
                                "#ef4444"

                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "70%",

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }

            }
        );

}


// =========================================================
// UPDATE SENSOR CHART
// =========================================================

function updateSensorChart() {

    if (!sensorChart) {

        return;

    }


    sensorChart.data.labels =
        sensorHistory.labels;


    sensorChart.data.datasets[0].data =
        sensorHistory.ph;


    sensorChart.data.datasets[1].data =
        sensorHistory.ec;


    sensorChart.data.datasets[2].data =
        sensorHistory.temperature;


    sensorChart.data.datasets[3].data =
        sensorHistory.waterLevel;


    sensorChart.update();

}


// =========================================================
// ADD SENSOR HISTORY
// =========================================================

function addSensorHistory() {

    if (
        currentPH === null &&
        currentEC === null &&
        currentTemperature === null &&
        currentWaterLevel === null
    ) {

        return;

    }


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "en-US",
            {

                hour: "2-digit",

                minute: "2-digit",

                second: "2-digit"

            }
        );


    sensorHistory.labels.push(
        time
    );


    sensorHistory.ph.push(
        currentPH
    );


    sensorHistory.ec.push(
        currentEC
    );


    sensorHistory.temperature.push(
        currentTemperature
    );


    sensorHistory.waterLevel.push(
        currentWaterLevel
    );


    if (
        sensorHistory.labels.length >
        MAX_HISTORY
    ) {

        sensorHistory.labels.shift();

        sensorHistory.ph.shift();

        sensorHistory.ec.shift();

        sensorHistory.temperature.shift();

        sensorHistory.waterLevel.shift();

    }


    updateSensorChart();

}


// =========================================================
// UPDATE ANALYTICS SUMMARY
// =========================================================

function updateSummary() {

    if (analyticsPh) {

        analyticsPh.textContent =
            currentPH === null
                ? "--"
                : currentPH.toFixed(2);

    }


    if (analyticsEc) {

        analyticsEc.textContent =
            currentEC === null
                ? "--"
                : `${Math.round(
                    currentEC
                ).toLocaleString()} µS/cm`;

    }


    if (analyticsTemp) {

        analyticsTemp.textContent =
            currentTemperature === null
                ? "-- °C"
                : `${currentTemperature.toFixed(
                    1
                )} °C`;

    }


    if (analyticsWater) {

        analyticsWater.textContent =
            currentWaterLevel === null
                ? "--"
                : `${Math.round(
                    currentWaterLevel
                )}%`;

    }

}


// =========================================================
// GET SENSOR SEVERITY
// SAME LOGIC AS ALERTS.JS
// =========================================================

function getPHSeverity(value) {

    if (value === null) {

        return null;

    }


    if (
        value < 5.0 ||
        value > 7.0
    ) {

        return "critical";

    }


    if (
        value < PH_MIN ||
        value > PH_MAX
    ) {

        return "warning";

    }


    return "normal";

}


function getECSeverity(value) {

    if (value === null) {

        return null;

    }


    if (
        value < 1500 ||
        value > 2200
    ) {

        return "critical";

    }


    if (
        value < EC_MIN ||
        value > EC_MAX
    ) {

        return "warning";

    }


    return "normal";

}


function getTemperatureSeverity(value) {

    if (value === null) {

        return null;

    }


    if (
        value < 16 ||
        value > 28
    ) {

        return "critical";

    }


    if (
        value < TEMP_MIN ||
        value > TEMP_MAX
    ) {

        return "warning";

    }


    return "normal";

}


function getWaterLevelSeverity(value) {

    if (value === null) {

        return null;

    }


    if (
        value <= WATER_LEVEL_WARNING
    ) {

        return "critical";

    }


    if (
        value < WATER_LEVEL_NORMAL
    ) {

        return "warning";

    }


    return "normal";

}


// =========================================================
// WATER QUALITY PERFORMANCE
// =========================================================

function updatePerformance() {

    let normal = 0;

    let warning = 0;

    let critical = 0;


    const values = [

        getPHSeverity(
            currentPH
        ),

        getECSeverity(
            currentEC
        ),

        getTemperatureSeverity(
            currentTemperature
        ),

        getWaterLevelSeverity(
            currentWaterLevel
        )

    ];


    values.forEach(
        severity => {

            if (
                severity === "normal"
            ) {

                normal++;

            }

            else if (
                severity === "warning"
            ) {

                warning++;

            }

            else if (
                severity === "critical"
            ) {

                critical++;

            }

        }
    );


    const total =
        normal +
        warning +
        critical;


    if (total === 0) {

        if (normalPercent) {

            normalPercent.textContent =
                "0%";

        }


        if (warningPercent) {

            warningPercent.textContent =
                "0%";

        }


        if (criticalPercent) {

            criticalPercent.textContent =
                "0%";

        }


        if (performanceChart) {

            performanceChart
                .data
                .datasets[0]
                .data = [
                    0,
                    0,
                    0
                ];


            performanceChart.update();

        }


        return;

    }


    const normalValue =
        Math.round(
            normal /
            total *
            100
        );


    const warningValue =
        Math.round(
            warning /
            total *
            100
        );


    const criticalValue =
        100 -
        normalValue -
        warningValue;


    if (normalPercent) {

        normalPercent.textContent =
            `${normalValue}%`;

    }


    if (warningPercent) {

        warningPercent.textContent =
            `${warningValue}%`;

    }


    if (criticalPercent) {

        criticalPercent.textContent =
            `${criticalValue}%`;

    }


    if (performanceChart) {

        performanceChart
            .data
            .datasets[0]
            .data = [

                normalValue,

                warningValue,

                criticalValue

            ];


        performanceChart.update();

    }

}


// =========================================================
// START SENSOR LISTENERS
// =========================================================

function startSensorListeners() {

    console.log(
        "Starting Analytics Firebase sensor listeners..."
    );


    let phLoaded = false;

    let ecLoaded = false;

    let temperatureLoaded = false;

    let waterLevelLoaded = false;


    function checkSensorReady() {

        if (
            phLoaded &&
            ecLoaded &&
            temperatureLoaded &&
            waterLevelLoaded
        ) {

            analyticsSensorReady = true;

            checkAnalyticsLoading();

        }

    }


    // =====================================================
    // pH
    // =====================================================

    onValue(

        phReference,

        snapshot => {

            const raw =
                snapshot.val();


            console.log(
                "Analytics Firebase pH RAW:",
                raw
            );


            currentPH =
                extractSensorValue(
                    raw
                );


            if (
                currentPH !== null
            ) {

                currentPH =
                    Math.max(
                        0,
                        Math.min(
                            14,
                            currentPH
                        )
                    );

            }


            console.log(
                "Analytics pH:",
                currentPH
            );


            phLoaded = true;


            updateSummary();

            updatePerformance();

            checkSensorReady();

        },

        error => {

            console.error(
                "Analytics pH Firebase error:",
                error
            );

        }

    );


    // =====================================================
    // EC
    // =====================================================

    onValue(

        ecReference,

        snapshot => {

            const raw =
                snapshot.val();


            console.log(
                "Analytics Firebase EC RAW:",
                raw
            );


            currentEC =
                extractSensorValue(
                    raw
                );


            if (
                currentEC !== null
            ) {

                currentEC =
                    Math.max(
                        0,
                        currentEC
                    );

            }


            console.log(
                "Analytics EC:",
                currentEC
            );


            ecLoaded = true;


            updateSummary();

            updatePerformance();

            checkSensorReady();

        },

        error => {

            console.error(
                "Analytics EC Firebase error:",
                error
            );

        }

    );


    // =====================================================
    // WATER TEMPERATURE
    // =====================================================

    onValue(

        temperatureReference,

        snapshot => {

            const raw =
                snapshot.val();


            console.log(
                "Analytics Firebase Temperature RAW:",
                raw
            );


            currentTemperature =
                extractSensorValue(
                    raw
                );


            console.log(
                "Analytics Temperature:",
                currentTemperature
            );


            temperatureLoaded = true;


            updateSummary();

            updatePerformance();

            checkSensorReady();

        },

        error => {

            console.error(
                "Analytics Temperature Firebase error:",
                error
            );

        }

    );


    // =====================================================
    // WATER LEVEL
    // =====================================================

    onValue(

        waterLevelReference,

        snapshot => {

            const raw =
                snapshot.val();


            console.log(
                "Analytics Firebase Water Level RAW:",
                raw
            );


            currentWaterLevel =
                extractSensorValue(
                    raw
                );


            if (
                currentWaterLevel !== null
            ) {

                currentWaterLevel =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            currentWaterLevel
                        )
                    );

            }


            console.log(
                "Analytics Water Level:",
                currentWaterLevel
            );


            waterLevelLoaded = true;


            updateSummary();

            updatePerformance();

            checkSensorReady();

        },

        error => {

            console.error(
                "Analytics Water Level Firebase error:",
                error
            );

        }

    );

}


// =========================================================
// PUMP LOGS
// =========================================================

function startLogsListener() {

    onValue(

        logsReference,

        snapshot => {

            const data =
                snapshot.val();


            pumpUsage = {

                nutrientA: 0,

                nutrientB: 0,

                phDown: 0

            };


            if (!data) {

                updatePumpUsage();

                analyticsLogsReady = true;

                checkAnalyticsLoading();

                return;

            }


            Object.values(data).forEach(
                log => {

                    if (!log) {

                        return;

                    }


                    const wasOff =
                        log.old === "OFF";


                    const isOn =
                        log.new === "ON";


                    if (
                        wasOff &&
                        isOn
                    ) {

                        if (
                            log.pump ===
                            "Nutrient Pump A"
                        ) {

                            pumpUsage.nutrientA++;

                        }


                        if (
                            log.pump ===
                            "Nutrient Pump B"
                        ) {

                            pumpUsage.nutrientB++;

                        }


                        if (
                            log.pump ===
                            "pH Down Pump"
                        ) {

                            pumpUsage.phDown++;

                        }

                    }

                }
            );


            updatePumpUsage();


            analyticsLogsReady = true;

            checkAnalyticsLoading();

        },

        error => {

            console.error(
                "Analytics Logs Firebase error:",
                error
            );

        }

    );

}


// =========================================================
// ALERT HISTORY
// CONNECTED TO ALERTS.JS
// =========================================================

function startAlertHistoryListener() {

    console.log(
        "Starting Analytics Alert History listener..."
    );


    onValue(

        alertHistoryReference,

        snapshot => {

            const data =
                snapshot.val();


            phAlertCount = 0;

            ecAlertCount = 0;

            tempAlertCount = 0;

            waterAlertCount = 0;


            if (!data) {

                updateAlertUsage();

                analyticsAlertsReady = true;

                checkAnalyticsLoading();

                return;

            }


            Object.values(data).forEach(
                alert => {

                    if (!alert) {

                        return;

                    }


                    const sensor =
                        String(
                            alert.sensorName ??
                            alert.sensor ??
                            ""
                        ).toLowerCase();


                    // =================================================
                    // pH
                    // =================================================

                    if (
                        sensor ===
                        "pH".toLowerCase() ||
                        sensor.includes("ph")
                    ) {

                        phAlertCount++;

                    }


                    // =================================================
                    // EC
                    // =================================================

                    if (
                        sensor.includes("ec")
                    ) {

                        ecAlertCount++;

                    }


                    // =================================================
                    // TEMPERATURE
                    // =================================================

                    if (
                        sensor.includes("temperature")
                    ) {

                        tempAlertCount++;

                    }


                    // =================================================
                    // WATER LEVEL
                    // =================================================

                    if (
                        sensor.includes("water level")
                    ) {

                        waterAlertCount++;

                    }

                }
            );


            console.log(
                "Analytics Alert Counts:",
                {

                    ph: phAlertCount,

                    ec: ecAlertCount,

                    temperature:
                        tempAlertCount,

                    waterLevel:
                        waterAlertCount

                }
            );


            updateAlertUsage();


            analyticsAlertsReady = true;

            checkAnalyticsLoading();

        },

        error => {

            console.error(
                "Analytics Alert History Firebase error:",
                error
            );

        }

    );

}


// =========================================================
// UPDATE PUMP USAGE
// =========================================================

function updatePumpUsage() {

    if (pumpAUsage) {

        pumpAUsage.textContent =
            `${pumpUsage.nutrientA} activations`;

    }


    if (pumpBUsage) {

        pumpBUsage.textContent =
            `${pumpUsage.nutrientB} activations`;

    }


    if (pumpPHUsage) {

        pumpPHUsage.textContent =
            `${pumpUsage.phDown} activations`;

    }


    if (pumpChart) {

        pumpChart
            .data
            .datasets[0]
            .data = [

                pumpUsage.nutrientA,

                pumpUsage.nutrientB,

                pumpUsage.phDown

            ];


        pumpChart.update();

    }

}


// =========================================================
// UPDATE ALERT USAGE
// =========================================================

function updateAlertUsage() {

    if (phAlerts) {

        phAlerts.textContent =
            phAlertCount;

    }


    if (ecAlerts) {

        ecAlerts.textContent =
            ecAlertCount;

    }


    if (tempAlerts) {

        tempAlerts.textContent =
            tempAlertCount;

    }


    if (waterAlerts) {

        waterAlerts.textContent =
            waterAlertCount;

    }

}


// =========================================================
// START ALL FIREBASE LISTENERS
// =========================================================

function startFirebaseListeners() {

    console.log(
        "========================================"
    );

    console.log(
        "HYDROSMART ANALYTICS FIREBASE"
    );

    console.log(
        "Firebase authentication successful."
    );

    console.log(
        "Starting real-time listeners..."
    );

    console.log(
        "========================================"
    );


    analyticsFirebaseReady = true;


    startSensorListeners();

    startLogsListener();

    startAlertHistoryListener();

}


// =========================================================
// SENSOR HISTORY
// EVERY 5 SECONDS
// =========================================================

setInterval(

    () => {

        addSensorHistory();

    },

    5000

);


// =========================================================
// INITIAL UI
// =========================================================

updateSummary();

updatePerformance();

updatePumpUsage();

updateAlertUsage();


// =========================================================
// FIREBASE AUTHENTICATION
// =========================================================

async function bootAnalytics() {

    try {

        console.log(
            "HydroSmart Analytics booting..."
        );


        if (
            firebaseLogin &&
            typeof firebaseLogin.then ===
            "function"
        ) {

            console.log(
                "Waiting for Firebase Authentication..."
            );


            await firebaseLogin;


            console.log(
                "Firebase authentication successful."
            );

        }


        startFirebaseListeners();

    }

    catch (error) {

        console.error(
            "Analytics Firebase authentication failed:",
            error
        );

    }

}


// =========================================================
// START
// =========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        bootAnalytics
    );

}

else {

    bootAnalytics();

}


// =========================================================
// READY
// =========================================================

console.log(
    "========================================"
);

console.log(
    "HYDROSMART ANALYTICS READY"
);

console.log(
    "========================================"
);

console.log(
    "pH:",
    PH_PATH
);

console.log(
    "EC:",
    EC_PATH
);

console.log(
    "Temperature:",
    TEMPERATURE_PATH
);

console.log(
    "Water Level:",
    WATER_LEVEL_PATH
);

console.log(
    "Logs:",
    LOGS_PATH
);

console.log(
    "Alert History:",
    ALERT_HISTORY_PATH
);

console.log(
    "========================================"
);

