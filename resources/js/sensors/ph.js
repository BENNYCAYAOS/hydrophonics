// =====================================================
// HYDROSMART
// pH SENSOR
// FIREBASE REAL-TIME DASHBOARD
// =====================================================

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    database
} from "../firebase.js";


// =====================================================
// START
// =====================================================

console.log("=================================");
console.log("HYDROSMART pH SENSOR");
console.log("pH dashboard loaded");
console.log("=================================");


// =====================================================
// ELEMENTS
// =====================================================

const phValue =
    document.getElementById("phValue");

const phStatus =
    document.getElementById("phStatus");

const phGaugeElement =
    document.getElementById("phGauge");

const phChartElement =
    document.getElementById("phChart");


// =====================================================
// VARIABLES
// =====================================================

let phGauge = null;
let phChart = null;


// =====================================================
// PH CHART SETTINGS
// =====================================================

const MAX_READINGS = 20;


// =====================================================
// PH GRAPH COLOR
// =====================================================

const PH_COLOR = "#7c3aed";

const PH_BACKGROUND =
    "rgba(124, 58, 237, 0.12)";


// =====================================================
// CREATE pH GAUGE
// =====================================================

function createPHGauge() {

    if (!phGaugeElement) {

        console.warn(
            "pH gauge canvas not found."
        );

        return;

    }


    if (typeof Chart === "undefined") {

        console.warn(
            "Chart.js not loaded. pH gauge skipped."
        );

        return;

    }


    phGauge =
        new Chart(
            phGaugeElement,
            {
                type: "doughnut",

                data: {

                    datasets: [

                        {
                            data: [
                                0,
                                14
                            ],

                            backgroundColor: [
                                "#4285f4",
                                "#eeeeee"
                            ],

                            borderWidth: 0
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: true,

                    rotation: 270,

                    circumference: 180,

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


// =====================================================
// CREATE pH GRAPH
// =====================================================

function createPHChart() {

    if (!phChartElement) {

        console.error(
            "pH chart canvas not found: #phChart"
        );

        return;

    }


    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is NOT loaded."
        );

        return;

    }


    phChart =
        new Chart(
            phChartElement,
            {
                type: "line",

                data: {

                    labels: [],

                    datasets: [

                        {

                            label:
                                "pH",

                            data:
                                [],

                            // ---------------------------------
                            // pH GRAPH COLOR
                            // ---------------------------------

                            borderColor:
                                PH_COLOR,

                           

                            borderWidth:
                                2,

                            tension:
                                0.3,

                            fill:
                                false,

                            pointRadius:
                                3,

                            pointHoverRadius:
                                5

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    animation: false,

                    interaction: {

                        intersect: false,

                        mode: "index"

                    },

                    scales: {

                        y: {

                            min: 0,

                            max: 14,

                            ticks: {

                                stepSize: 1

                            },

                            title: {

                                display: true,

                                text: "pH"

                            }

                        },

                        x: {

                            ticks: {

                                maxTicksLimit: 10

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display: true

                        }

                    }

                }

            }

        );


    console.log(
        "pH graph created successfully."
    );

}


// =====================================================
// WAIT FOR CHART.JS
// =====================================================

function initializeCharts() {

    if (
        typeof Chart !== "undefined"
    ) {

        createPHGauge();

        createPHChart();

        return;

    }


    console.log(
        "Waiting for Chart.js..."
    );


    let attempts = 0;

    const maxAttempts = 50;


    const interval =
        setInterval(
            () => {

                attempts++;


                if (
                    typeof Chart !== "undefined"
                ) {

                    clearInterval(interval);

                    console.log(
                        "Chart.js detected."
                    );

                    createPHGauge();

                    createPHChart();

                    return;

                }


                if (
                    attempts >= maxAttempts
                ) {

                    clearInterval(interval);

                    console.error(
                        "Chart.js failed to load."
                    );

                }

            },
            100
        );

}


// =====================================================
// FIREBASE REFERENCE
// =====================================================

const phRef =
    ref(
        database,
        "sensors/ph"
    );


// =====================================================
// UPDATE pH VALUE
// =====================================================

function updatePH(ph) {

    // =================================================
    // NO DATA
    // =================================================

    if (ph === null) {

        if (phValue) {

            phValue.textContent =
                "--";

        }


        if (phStatus) {

            setPHStatus(
                "connecting",
                "Connecting..."
            );

        }

        return;

    }


    // =================================================
    // VALUE
    // =================================================

    if (phValue) {

        phValue.textContent =
            ph.toFixed(2);

    }


    // =================================================
    // STATUS
    // =================================================

    if (phStatus) {

        if (
            ph >= 5.5 &&
            ph <= 6.5
        ) {

            setPHStatus(
                "normal",
                "Normal"
            );

        }

        else if (
            ph >= 5.0 &&
            ph <= 7.0
        ) {

            setPHStatus(
                "warning",
                "Warning"
            );

        }

        else {

            setPHStatus(
                "critical",
                "Critical"
            );

        }

    }

}


// =====================================================
// UPDATE GAUGE
// =====================================================

function updatePHGauge(ph) {

    if (!phGauge) {
        return;
    }


    phGauge.data.datasets[0].data = [

        ph,

        14 - ph

    ];


    phGauge.update(
        "none"
    );

}


// =====================================================
// UPDATE GRAPH
// =====================================================

function updatePHChart(ph) {

    if (!phChart) {

        console.warn(
            "pH chart is not initialized."
        );

        return;

    }


    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    phChart.data.labels.push(
        time
    );


    phChart.data.datasets[0].data.push(
        ph
    );


    // =================================================
    // KEEP ONLY LAST 20 READINGS
    // =================================================

    while (
        phChart.data.labels.length >
        MAX_READINGS
    ) {

        phChart.data.labels.shift();

        phChart.data.datasets[0].data.shift();

    }


    phChart.update(
        "none"
    );


    console.log(
        "pH graph updated:",
        ph,
        time
    );

}


// =====================================================
// STATUS
// =====================================================

function setPHStatus(
    status,
    text
) {

    if (!phStatus) {
        return;
    }


    phStatus.classList.remove(

        "status-normal",

        "status-warning",

        "status-critical",

        "status-connecting"

    );


    phStatus.classList.add(
        `status-${status}`
    );


    phStatus.innerHTML = `
        <span class="status-dot"></span>
        ${text}
    `;

}


// =====================================================
// FIREBASE REAL-TIME LISTENER
// =====================================================

console.log(
    "Listening:",
    "sensors/ph"
);


onValue(

    phRef,

    (snapshot) => {

        const value =
            snapshot.val();


        console.log(
            "================================="
        );


        console.log(
            "Firebase pH:",
            value
        );


        // =============================================
        // NO DATA
        // =============================================

        if (
            value === null ||
            value === undefined
        ) {

            console.warn(
                "No pH data in Firebase."
            );


            updatePH(
                null
            );


            return;

        }


        // =============================================
        // CONVERT
        // =============================================

        const numericPH =
            Number(value);


        if (
            !Number.isFinite(
                numericPH
            )
        ) {

            console.error(
                "Invalid pH:",
                value
            );


            updatePH(
                null
            );


            return;

        }


        // =============================================
        // LIMIT
        // =============================================

        const safePH =
            Math.max(
                0,
                Math.min(
                    14,
                    numericPH
                )
            );


        // =============================================
        // UPDATE DASHBOARD
        // =============================================

        updatePH(
            safePH
        );


        // =============================================
        // UPDATE GAUGE
        // =============================================

        updatePHGauge(
            safePH
        );


        // =============================================
        // UPDATE GRAPH
        // =============================================

        updatePHChart(
            safePH
        );


        console.log(
            "pH dashboard updated:",
            safePH
        );

    },


    (error) => {

        console.error(
            "Firebase pH error:",
            error
        );


        updatePH(
            null
        );

    }

);


// =====================================================
// INITIALIZE CHARTS
// =====================================================

initializeCharts();


// =====================================================
// READY
// =====================================================

console.log(
    "HYDROSMART pH module ready."
);


console.log(
    "Firebase path: /sensors/ph"
);
