// =====================================================
// HYDROSMART
// EC / PPM SENSOR
// FIREBASE REAL-TIME MONITORING
// =====================================================

import {
    onValue,
    ref
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    database
} from "../firebase.js";


// =====================================================
// EC RANGE
// =====================================================

// Lettuce target:
//
// 1.70 - 2.00 mS/cm
//
// Equivalent:
//
// 1700 - 2000 µS/cm

const EC_MIN = 1700;
const EC_MAX = 2000;


// =====================================================
// EC GRAPH COLOR
// =====================================================

const EC_COLOR = "#2563eb";


// =====================================================
// ELEMENTS
// =====================================================

const ecValueElement =
    document.getElementById("ecValue");

const ecStatusElement =
    document.getElementById("ecStatus");


// =====================================================
// EC GAUGE
// =====================================================

let ecGauge = null;


const ecGaugeCanvas =
    document.getElementById("ecGauge");


if (ecGaugeCanvas) {

    ecGauge =
        new Chart(
            ecGaugeCanvas,
            {
                type: "doughnut",

                data: {

                    datasets: [

                        {
                            data: [
                                0,
                                EC_MAX
                            ],

                            backgroundColor: [
                                "#f9ab00",
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
// UPDATE GAUGE
// =====================================================

function updateECGauge(value) {

    if (!ecGauge) {
        return;
    }


    const displayValue =
        Math.max(
            0,
            Math.min(
                value,
                EC_MAX
            )
        );


    ecGauge.data.datasets[0].data = [

        displayValue,

        Math.max(
            0,
            EC_MAX - displayValue
        )

    ];


    ecGauge.update(
        "none"
    );
}


// =====================================================
// FORMAT EC
// =====================================================

function formatEC(value) {

    return Math.round(value)
        .toLocaleString();
}


// =====================================================
// UPDATE STATUS
// =====================================================

function updateECStatus(value) {

    if (!ecStatusElement) {
        return;
    }


    ecStatusElement.classList.remove(
        "status-normal",
        "status-warning",
        "status-critical",
        "status-connecting"
    );


    if (
        value >= EC_MIN &&
        value <= EC_MAX
    ) {

        ecStatusElement.classList.add(
            "status-normal"
        );

        ecStatusElement.innerHTML = `
            <span class="status-dot"></span>
            Normal
        `;

        return;
    }


    if (value < EC_MIN) {

        ecStatusElement.classList.add(
            "status-warning"
        );

        ecStatusElement.innerHTML = `
            <span class="status-dot"></span>
            Low
        `;

        return;
    }


    ecStatusElement.classList.add(
        "status-critical"
    );

    ecStatusElement.innerHTML = `
        <span class="status-dot"></span>
        High
    `;
}


// =====================================================
// FIREBASE EC LISTENER
// =====================================================

const ecReference =
    ref(
        database,
        "sensors/ec"
    );


onValue(
    ecReference,
    (snapshot) => {

        const value =
            snapshot.val();


        if (
            value === null ||
            value === undefined ||
            Number.isNaN(
                Number(value)
            )
        ) {

            if (ecValueElement) {

                ecValueElement.textContent =
                    "--";
            }

            return;
        }


        const ec =
            Number(value);


        // ---------------------------------------------
        // DISPLAY VALUE
        // ---------------------------------------------

        if (ecValueElement) {

            ecValueElement.textContent =
                formatEC(ec);
        }


        // ---------------------------------------------
        // GAUGE
        // ---------------------------------------------

        updateECGauge(
            ec
        );


        // ---------------------------------------------
        // STATUS
        // ---------------------------------------------

        updateECStatus(
            ec
        );
    },

    (error) => {

        console.error(
            "EC Firebase error:",
            error
        );


        if (ecStatusElement) {

            ecStatusElement.classList.remove(
                "status-normal",
                "status-warning",
                "status-critical"
            );

            ecStatusElement.classList.add(
                "status-connecting"
            );

            ecStatusElement.innerHTML = `
                <span class="status-dot"></span>
                Connection Error
            `;
        }
    }
);


// =====================================================
// EC GRAPH
// =====================================================

const ecChartCanvas =
    document.getElementById(
        "ecChart"
    );


let ecChart = null;

const ecLabels = [];

const ecData = [];


// =====================================================
// CREATE CHART
// =====================================================

if (ecChartCanvas) {

    ecChart =
        new Chart(
            ecChartCanvas,
            {

                type: "line",

                data: {

                    labels: ecLabels,

                    datasets: [

                        {

                            label:
                                "EC (µS/cm)",

                            data:
                                ecData,

                            // ---------------------------------
                            // EC GRAPH COLOR
                            // ---------------------------------

                            borderColor:
                                EC_COLOR,

                        

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

                    responsive: true,

                    maintainAspectRatio: false,

                    animation: false,

                    scales: {

                        y: {

                            beginAtZero:
                                false,

                            suggestedMin:
                                1500,

                            suggestedMax:
                                2200
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
}


// =====================================================
// UPDATE GRAPH
// =====================================================

function updateECChart(value) {

    if (!ecChart) {
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


    ecLabels.push(
        time
    );

    ecData.push(
        value
    );


    // Keep latest 20 readings

    if (
        ecLabels.length > 20
    ) {

        ecLabels.shift();

        ecData.shift();
    }


    ecChart.update(
        "none"
    );
}


// =====================================================
// REAL-TIME GRAPH LISTENER
// =====================================================

onValue(
    ecReference,
    (snapshot) => {

        const value =
            snapshot.val();


        if (
            value === null ||
            value === undefined
        ) {
            return;
        }


        const ec =
            Number(value);


        if (
            Number.isNaN(ec)
        ) {
            return;
        }


        updateECChart(
            ec
        );
    }
);
