// ========================================
// WATER TEMPERATURE SENSOR
// HYDROSMART
// ========================================

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    database,
    firebaseLogin
} from "../firebase.js";


// ========================================
// TEMPERATURE GRAPH COLOR
// ========================================

const TEMP_COLOR = "#ea580c";

const TEMP_BACKGROUND =
    "rgba(234, 88, 12, 0.12)";


// ========================================
// TEMPERATURE GAUGE
// ========================================

const tempGauge = new Chart(
    document.getElementById("tempGauge"),
    {
        type: "doughnut",

        data: {
            datasets: [
                {
                    data: [0, 40],

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

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    }
);


// ========================================
// TEMPERATURE GRAPH
// ========================================

const tempLabels = [];
const tempData = [];

const tempChart = new Chart(
    document.getElementById("tempChart"),
    {
        type: "line",

        data: {
            labels: tempLabels,

            datasets: [
                {
                    label: "Water Temperature °C",

                    data: tempData,

                    // ========================================
                    // GRAPH COLOR
                    // ========================================

                    borderColor:
                        TEMP_COLOR,

                    backgroundColor:
                        TEMP_BACKGROUND,

                    tension: 0.3,

                    fill: true
                }
            ]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            animation: false,

            scales: {
                y: {
                    title: {
                        display: true,
                        text: "Temperature °C"
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


// ========================================
// TEMPERATURE STATUS FUNCTION
// ========================================

function updateTemperatureStatus(temp) {

    const status =
        document.getElementById(
            "temperatureStatus"
        );

    if (!status) {
        return;
    }


    // Remove old status classes

    status.classList.remove(
        "status-normal",
        "status-warning",
        "status-critical",
        "status-connecting"
    );


    // ========================================
    // NORMAL
    // 18°C - 26°C
    // ========================================

    if (
        temp >= 18 &&
        temp <= 26
    ) {

        status.classList.add(
            "status-normal"
        );

        status.innerHTML = `
            <span class="status-dot"></span>
            Normal
        `;

    }


    // ========================================
    // WARNING
    // 16°C - 17.99°C
    // 26.01°C - 28°C
    // ========================================

    else if (
        (
            temp >= 16 &&
            temp < 18
        )
        ||
        (
            temp > 26 &&
            temp <= 28
        )
    ) {

        status.classList.add(
            "status-warning"
        );

        status.innerHTML = `
            <span class="status-dot"></span>
            Warning
        `;

    }


    // ========================================
    // CRITICAL
    // BELOW 16°C
    // ABOVE 28°C
    // ========================================

    else {

        status.classList.add(
            "status-critical"
        );

        status.innerHTML = `
            <span class="status-dot"></span>
            Critical
        `;

    }

}


// ========================================
// FIREBASE LOGIN
// ========================================

firebaseLogin

.then(() => {

    console.log(
        "HYDROSMART Firebase Login Successful"
    );


    // ========================================
    // TEMPERATURE DATABASE PATH
    // ========================================

    const temperatureRef =
        ref(
            database,
            "sensors/water_temperature"
        );


    // ========================================
    // REAL-TIME LISTENER
    // ========================================

    onValue(

        temperatureRef,

        (snapshot) => {

            const temperature =
                snapshot.val();


            if (temperature === null) {

                console.warn(
                    "Water temperature data is null."
                );

                return;

            }


            const temp =
                Number(temperature);


            // ========================================
            // VALIDATE TEMPERATURE
            // ========================================

            if (
                Number.isNaN(temp)
            ) {

                console.error(
                    "Invalid temperature value:",
                    temperature
                );

                return;

            }


            console.log(
                "Water Temperature:",
                temp,
                "°C"
            );


            // ========================================
            // UPDATE TEMPERATURE TEXT
            // ========================================

            const temperatureValue =
                document.getElementById(
                    "temperatureValue"
                );


            if (temperatureValue) {

                temperatureValue.textContent =
                    temp.toFixed(2);

            }


            // ========================================
            // UPDATE STATUS
            // ========================================

            updateTemperatureStatus(
                temp
            );


            // ========================================
            // UPDATE GAUGE
            // ========================================

            const gaugeValue =
                Math.max(
                    0,
                    Math.min(
                        temp,
                        40
                    )
                );


            tempGauge.data.datasets[0]
                .data = [
                    gaugeValue,
                    40 - gaugeValue
                ];


            // Change gauge color according to status

            if (
                temp >= 18 &&
                temp <= 26
            ) {

                tempGauge.data.datasets[0]
                    .backgroundColor = [
                        "#34a853",
                        "#eeeeee"
                    ];

            }

            else if (
                (
                    temp >= 16 &&
                    temp < 18
                )
                ||
                (
                    temp > 26 &&
                    temp <= 28
                )
            ) {

                tempGauge.data.datasets[0]
                    .backgroundColor = [
                        "#eab308",
                        "#eeeeee"
                    ];

            }

            else {

                tempGauge.data.datasets[0]
                    .backgroundColor = [
                        "#ef4444",
                        "#eeeeee"
                    ];

            }


            tempGauge.update();


            // ========================================
            // UPDATE GRAPH
            // ========================================

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


            tempLabels.push(time);

            tempData.push(temp);


            // Keep latest 20 readings

            if (
                tempLabels.length > 20
            ) {

                tempLabels.shift();

                tempData.shift();

            }


            tempChart.update();

        },


        (error) => {

            console.error(
                "Firebase Database Error:",
                error
            );


            const status =
                document.getElementById(
                    "temperatureStatus"
                );


            if (status) {

                status.className =
                    "status-badge status-critical";

                status.innerHTML =
                    `
                    <span class="status-dot"></span>
                    Database Error
                    `;

            }

        }

    );

})


.catch((error) => {

    console.error(
        "Firebase Authentication Error:",
        error
    );


    const status =
        document.getElementById(
            "temperatureStatus"
        );


    if (status) {

        status.className =
            "status-badge status-critical";

        status.innerHTML =
            `
            <span class="status-dot"></span>
            Firebase Login Error
            `;

    }

});
