
// =====================================================
// HYDROSMART
// WATER LEVEL DASHBOARD
// ULTRASONIC + FIREBASE REALTIME DATABASE
// =====================================================
//
// FIREBASE PATHS:
//
// sensors/waterLevel
// sensors/waterDistance
// sensors/waterVolume
//
// DASHBOARD ELEMENTS:
//
// waterLevelValue
// waterGauge
// waterLevelStatus
// waterChart
//
// NO MAINTANK.JS
// NO FLOAT SWITCH
//
// =====================================================

import {
    onValue,
    ref
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    database
} from "../firebase.js";


// =====================================================
// TANK SETTINGS
// =====================================================

const TANK_CAPACITY_LITERS = 1000;


// =====================================================
// FIREBASE REFERENCES
// =====================================================

const waterLevelRef = ref(
    database,
    "sensors/waterLevel"
);

const waterDistanceRef = ref(
    database,
    "sensors/waterDistance"
);

const waterVolumeRef = ref(
    database,
    "sensors/waterVolume"
);


// =====================================================
// DASHBOARD ELEMENTS
// =====================================================

const waterLevelValue =
    document.getElementById(
        "waterLevelValue"
    );

const waterGaugeCanvas =
    document.getElementById(
        "waterGauge"
    );

const waterLevelStatus =
    document.getElementById(
        "waterLevelStatus"
    );

const waterChartCanvas =
    document.getElementById(
        "waterChart"
    );


// =====================================================
// DEBUG
// =====================================================

console.log(
    "======================================"
);

console.log(
    "HYDROSMART WATER LEVEL"
);

console.log(
    "Firebase connection starting..."
);

console.log(
    "Water Level Ref:",
    "sensors/waterLevel"
);

console.log(
    "Water Distance Ref:",
    "sensors/waterDistance"
);

console.log(
    "Water Volume Ref:",
    "sensors/waterVolume"
);

console.log(
    "======================================"
);


// =====================================================
// WATER LEVEL GAUGE
// =====================================================

let waterGauge = null;


if (
    waterGaugeCanvas &&
    typeof Chart !== "undefined"
) {

    waterGauge =
        new Chart(
            waterGaugeCanvas,
            {

                type: "doughnut",

                data: {

                    datasets: [

                        {

                            data: [
                                0,
                                100
                            ],

                            backgroundColor: [
                                "#34a853",
                                "#eeeeee"
                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    rotation: 270,

                    circumference: 180,

                    cutout: "70%",

                    responsive: true,

                    maintainAspectRatio: true,

                    animation: false,

                    plugins: {

                        legend: {
                            display: false
                        },

                        tooltip: {
                            enabled: false
                        }

                    }

                }

            }
        );

}


// =====================================================
// GET STATUS
// =====================================================

function getWaterStatus(level) {

    if (level < 30) {

        return "Critical";

    }

    if (level < 60) {

        return "Low";

    }

    if (level <= 90) {

        return "Normal";

    }

    return "High";

}


// =====================================================
// GET STATUS CLASS
// =====================================================

function getStatusClass(level) {

    if (level < 30) {

        return "status-critical";

    }

    if (level < 60) {

        return "status-warning";

    }

    if (level <= 90) {

        return "status-normal";

    }

    return "status-normal";

}


// =====================================================
// UPDATE STATUS INDICATOR
// =====================================================

function updateWaterStatus(level) {

    if (!waterLevelStatus) {

        console.warn(
            "waterLevelStatus element not found."
        );

        return;

    }


    const status =
        getWaterStatus(level);


    const statusClass =
        getStatusClass(level);


    // Remove previous classes

    waterLevelStatus.classList.remove(
        "status-normal",
        "status-warning",
        "status-critical",
        "status-connecting"
    );


    // Add current class

    waterLevelStatus.classList.add(
        statusClass
    );


    // Update indicator

    waterLevelStatus.innerHTML = `

        <span class="status-dot"></span>

        ${status}

    `;


    console.log(
        "Water Status:",
        status
    );

}


// =====================================================
// UPDATE GAUGE
// =====================================================

function updateWaterGauge(level) {

    if (!waterGauge) {

        console.warn(
            "Water gauge not available."
        );

        return;

    }


    const safeLevel =
        Math.max(
            0,
            Math.min(
                100,
                Number(level)
            )
        );


    let gaugeColor =
        "#34a853";


    if (safeLevel < 30) {

        gaugeColor =
            "#dc3545";

    }

    else if (safeLevel < 60) {

        gaugeColor =
            "#f59e0b";

    }

    else if (safeLevel > 90) {

        gaugeColor =
            "#2563eb";

    }


    waterGauge.data.datasets[0].data = [

        safeLevel,

        100 - safeLevel

    ];


    waterGauge.data.datasets[0].backgroundColor = [

        gaugeColor,

        "#eeeeee"

    ];


    waterGauge.update(
        "none"
    );

}


// =====================================================
// WATER GRAPH
// =====================================================

let waterChart = null;

const waterLabels = [];

const waterData = [];


if (
    waterChartCanvas &&
    typeof Chart !== "undefined"
) {

    waterChart =
        new Chart(
            waterChartCanvas,
            {

                type: "line",

                data: {

                    labels:
                        waterLabels,

                    datasets: [

                        {

                            label:
                                "Water Level %",

                            data:
                                waterData,

                            borderColor:
                                "#34a853",

                            tension:
                                0.3,

                            fill:
                                false,

                            pointRadius:
                                2,

                            pointHoverRadius:
                                4

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    animation:
                        false,

                    scales: {

                        y: {

                            min:
                                0,

                            max:
                                100,

                            title: {

                                display:
                                    true,

                                text:
                                    "Level (%)"

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display:
                                true

                        }

                    }

                }

            }
        );

}


// =====================================================
// UPDATE GRAPH
// =====================================================

function updateWaterChart(level) {

    if (!waterChart) {

        return;

    }


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit"

            }
        );


    waterLabels.push(
        time
    );


    waterData.push(
        level
    );


    // Keep last 20 readings

    if (
        waterLabels.length > 20
    ) {

        waterLabels.shift();

        waterData.shift();

    }


    waterChart.update(
        "none"
    );

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateWaterLevelDashboard(
    level
) {

    if (
        level === null ||
        Number.isNaN(
            Number(level)
        )
    ) {

        return;

    }


    const safeLevel =
        Math.max(
            0,
            Math.min(
                100,
                Number(level)
            )
        );


    // =================================================
    // MAIN NUMBER
    // =================================================

    if (waterLevelValue) {

        waterLevelValue.textContent =
            Math.round(
                safeLevel
            );

    }


    // =================================================
    // GAUGE
    // =================================================

    updateWaterGauge(
        safeLevel
    );


    // =================================================
    // STATUS
    // =================================================

    updateWaterStatus(
        safeLevel
    );


    // =================================================
    // GRAPH
    // =================================================

    updateWaterChart(
        safeLevel
    );


    console.log(
        "Dashboard Water Level:",
        safeLevel.toFixed(1) + "%"
    );

}


// =====================================================
// FIREBASE WATER LEVEL
// =====================================================
//
// ESP32 uploads:
//
// /sensors/waterLevel
//
// Example:
//
// 75.3
//
// Dashboard displays:
//
// 75
//
// =====================================================

onValue(

    waterLevelRef,

    (snapshot) => {

        const value =
            snapshot.val();


        console.log(
            "Firebase waterLevel:",
            value
        );


        if (
            value === null ||
            value === undefined
        ) {

            console.warn(
                "No water level value in Firebase."
            );


            if (waterLevelValue) {

                waterLevelValue.textContent =
                    "--";

            }


            return;

        }


        const level =
            Number(value);


        if (
            Number.isNaN(level)
        ) {

            console.error(
                "Invalid water level:",
                value
            );

            return;

        }


        updateWaterLevelDashboard(
            level
        );

    },

    (error) => {

        console.error(
            "Firebase waterLevel error:",
            error
        );

    }

);


// =====================================================
// FIREBASE DISTANCE
// =====================================================

onValue(

    waterDistanceRef,

    (snapshot) => {

        const value =
            snapshot.val();


        console.log(
            "Firebase waterDistance:",
            value,
            "cm"
        );

    },

    (error) => {

        console.error(
            "Firebase waterDistance error:",
            error
        );

    }

);


// =====================================================
// FIREBASE VOLUME
// =====================================================

onValue(

    waterVolumeRef,

    (snapshot) => {

        const value =
            snapshot.val();


        console.log(
            "Firebase waterVolume:",
            value,
            "L"
        );

    },

    (error) => {

        console.error(
            "Firebase waterVolume error:",
            error
        );

    }

);


// =====================================================
// READY
// =====================================================

console.log(
    "======================================"
);

console.log(
    "HYDROSMART WATER LEVEL"
);

console.log(
    "Firebase listener ACTIVE"
);

console.log(
    "Dashboard listener ACTIVE"
);

console.log(
    "======================================"
);
