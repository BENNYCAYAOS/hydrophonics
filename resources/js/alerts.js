// =========================================================
// HYDROSMART - ALERTS FIREBASE CONNECTION
// =========================================================

import {
    onValue,
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    database,
    firebaseLogin
} from "./firebase.js";


// =========================================================
// FIREBASE PATHS
// =========================================================

const EC_PATH =
    "sensors/ec";

const PH_PATH =
    "sensors/ph";

const TEMPERATURE_PATH =
    "sensors/water_temperature";

const WATER_LEVEL_PATH =
    "sensors/waterLevel";

const ALERT_HISTORY_PATH =
    "alertHistory";


// =========================================================
// ALERT LIMITS
// =========================================================

// EC
const EC_MIN = 1700;
const EC_MAX = 2000;

// pH
const PH_CRITICAL_LOW = 5.0;
const PH_NORMAL_LOW = 5.5;
const PH_NORMAL_HIGH = 6.5;
const PH_CRITICAL_HIGH = 7.0;

// Temperature
const TEMP_CRITICAL_LOW = 16;
const TEMP_NORMAL_LOW = 18;
const TEMP_NORMAL_HIGH = 26;
const TEMP_CRITICAL_HIGH = 28;

// Water Level
const WATER_LEVEL_CRITICAL = 30;
const WATER_LEVEL_WARNING = 60;


// =========================================================
// CURRENT VALUES
// =========================================================

const currentValues = {

    ec: null,

    ph: null,

    temperature: null,

    waterLevel: null

};


// =========================================================
// LAST ALERT STATE
// =========================================================

const lastAlertState = {};


// =========================================================
// UTILITY
// =========================================================

function getDate() {

    return new Date().toLocaleDateString(
        "en-CA"
    );

}


function getTime() {

    return new Date().toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

}


function formatNumber(
    value,
    decimals = 2
) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {

        return "--";

    }

    return number.toFixed(
        decimals
    );

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =========================================================
// EXTRACT SENSOR VALUE
// =========================================================
//
// Supports:
//
// sensors/ec = 1800
//
// OR
//
// sensors/ec = {
//     value: 1800
// }
//
// OR
//
// sensors/ec = {
//     reading: 1800
// }
//
// =========================================================

function extractSensorValue(data) {

    console.log(
        "Firebase raw data:",
        data
    );


    // -------------------------------
    // NULL
    // -------------------------------

    if (
        data === null ||
        data === undefined
    ) {

        return null;

    }


    // -------------------------------
    // NUMBER
    // -------------------------------

    if (
        typeof data === "number"
    ) {

        return Number.isFinite(data)
            ? data
            : null;

    }


    // -------------------------------
    // STRING
    // -------------------------------

    if (
        typeof data === "string"
    ) {

        const number =
            Number(data);

        return Number.isFinite(number)
            ? number
            : null;

    }


    // -------------------------------
    // OBJECT
    // -------------------------------

    if (
        typeof data === "object"
    ) {

        const possibleKeys = [

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
            const key of possibleKeys
        ) {

            if (
                data[key] !== undefined &&
                data[key] !== null
            ) {

                const number =
                    Number(data[key]);

                if (
                    Number.isFinite(number)
                ) {

                    return number;

                }

            }

        }

    }


    return null;

}


// =========================================================
// EC ALERT
// =========================================================

function getECAlert(value) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return {

            severity: "normal",

            label: "NO DATA",

            description:
                "Waiting for EC sensor data."

        };

    }


    if (
        value > EC_MAX
    ) {

        return {

            severity: "critical",

            label: "CRITICAL",

            description:
                "EC level is above the configured safe range."

        };

    }


    if (
        value < EC_MIN
    ) {

        return {

            severity: "warning",

            label: "WARNING",

            description:
                "EC level is below the configured range."

        };

    }


    return {

        severity: "normal",

        label: "NORMAL",

        description:
            "EC level is within the configured range."

    };

}


// =========================================================
// PH ALERT
// =========================================================

function getPHAlert(value) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return {

            severity: "normal",

            label: "NO DATA",

            description:
                "Waiting for pH sensor data."

        };

    }


    if (
        value < PH_CRITICAL_LOW ||
        value > PH_CRITICAL_HIGH
    ) {

        return {

            severity: "critical",

            label: "CRITICAL",

            description:
                "pH level is outside the critical range."

        };

    }


    if (
        (
            value >= PH_CRITICAL_LOW &&
            value < PH_NORMAL_LOW
        )
        ||
        (
            value > PH_NORMAL_HIGH &&
            value <= PH_CRITICAL_HIGH
        )
    ) {

        return {

            severity: "warning",

            label: "WARNING",

            description:
                "pH level requires monitoring."

        };

    }


    return {

        severity: "normal",

        label: "NORMAL",

        description:
            "pH level is within the recommended range."

    };

}


// =========================================================
// TEMPERATURE ALERT
// =========================================================

function getTemperatureAlert(value) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return {

            severity: "normal",

            label: "NO DATA",

            description:
                "Waiting for temperature sensor data."

        };

    }


    if (
        value < TEMP_CRITICAL_LOW ||
        value > TEMP_CRITICAL_HIGH
    ) {

        return {

            severity: "critical",

            label: "CRITICAL",

            description:
                "Water temperature is outside the critical range."

        };

    }


    if (
        (
            value >= TEMP_CRITICAL_LOW &&
            value < TEMP_NORMAL_LOW
        )
        ||
        (
            value > TEMP_NORMAL_HIGH &&
            value <= TEMP_CRITICAL_HIGH
        )
    ) {

        return {

            severity: "warning",

            label: "WARNING",

            description:
                "Water temperature requires monitoring."

        };

    }


    return {

        severity: "normal",

        label: "NORMAL",

        description:
            "Water temperature is within the recommended range."

    };

}


// =========================================================
// WATER LEVEL ALERT
// =========================================================

function getWaterLevelAlert(value) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return {

            severity: "normal",

            label: "NO DATA",

            description:
                "Waiting for water-level sensor data."

        };

    }


    if (
        value <= WATER_LEVEL_CRITICAL
    ) {

        return {

            severity: "critical",

            label: "CRITICAL",

            description:
                "Water level is critically low."

        };

    }


    if (
        value < WATER_LEVEL_WARNING
    ) {

        return {

            severity: "warning",

            label: "WARNING",

            description:
                "Water level is below the recommended level."

        };

    }


    return {

        severity: "normal",

        label: "NORMAL",

        description:
            "Water level is within the safe range."

    };

}


// =========================================================
// SENSOR INFO
// =========================================================

function getSensorInfo(
    sensor
) {

    switch (sensor) {

        case "ec":

            return {

                name: "EC / TDS",

                icon: "bolt",

                unit: "µS/cm"

            };


        case "ph":

            return {

                name: "pH",

                icon: "science",

                unit: ""

            };


        case "temperature":

            return {

                name: "Water Temperature",

                icon: "thermostat",

                unit: "°C"

            };


        case "waterLevel":

            return {

                name: "Water Level",

                icon: "water_drop",

                unit: "%"

            };


        default:

            return {

                name: sensor,

                icon: "sensors",

                unit: ""

            };

    }

}


// =========================================================
// FORMAT SENSOR VALUE
// =========================================================

function formatSensorValue(
    sensor,
    value
) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return "--";

    }


    switch (sensor) {

        case "ec":

            return `${formatNumber(value, 0)} µS/cm`;


        case "ph":

            return formatNumber(
                value,
                2
            );


        case "temperature":

            return `${formatNumber(value, 2)} °C`;


        case "waterLevel":

            return `${formatNumber(value, 1)} %`;


        default:

            return formatNumber(
                value,
                2
            );

    }

}


// =========================================================
// RECOMMENDED VALUE
// =========================================================

function getRecommendedValue(
    sensor
) {

    switch (sensor) {

        case "ec":

            return "1700–2000 µS/cm";


        case "ph":

            return "5.5–6.5";


        case "temperature":

            return "18–26 °C";


        case "waterLevel":

            return "60–100 %";


        default:

            return "--";

    }

}


// =========================================================
// CREATE ALERT OBJECT
// =========================================================

function createAlert(
    sensor,
    value,
    status
) {

    const info =
        getSensorInfo(sensor);


    return {

        sensor,

        sensorName:
            info.name,

        value,

        formattedValue:
            formatSensorValue(
                sensor,
                value
            ),

        severity:
            status.severity,

        label:
            status.label,

        description:
            status.description,

        date:
            getDate(),

        time:
            getTime()

    };

}


// =========================================================
// SAVE ALERT HISTORY
// =========================================================

async function saveAlertHistory(
    alert
) {

    try {

        const historyRef =
            push(
                ref(
                    database,
                    ALERT_HISTORY_PATH
                )
            );


        await set(
            historyRef,
            alert
        );


        console.log(
            "Alert history saved:",
            alert
        );

    } catch (error) {

        console.error(
            "Failed to save alert history:",
            error
        );

    }

}


// =========================================================
// PROCESS ALERT
// =========================================================

function processAlert(
    sensor,
    value,
    status
) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return;

    }


    const previous =
        lastAlertState[sensor];


    const current =
        status.severity;


    console.log(
        `${sensor} status:`,
        current
    );


    // First reading
    if (
        previous === undefined
    ) {

        lastAlertState[sensor] =
            current;


        if (
            current === "critical" ||
            current === "warning"
        ) {

            const alert =
                createAlert(
                    sensor,
                    value,
                    status
                );


            saveAlertHistory(
                alert
            );

        }

        return;

    }


    // Severity changed
    if (
        previous !== current
    ) {

        lastAlertState[sensor] =
            current;


        if (
            current === "critical" ||
            current === "warning"
        ) {

            const alert =
                createAlert(
                    sensor,
                    value,
                    status
                );


            saveAlertHistory(
                alert
            );

        }

    }

}


// =========================================================
// RENDER CURRENT ALERTS
// =========================================================

function renderCurrentAlerts() {

    const container =
        document.querySelector(
            ".current-alerts-grid"
        );


    if (!container) {

        console.error(
            "Current alerts container not found."
        );

        return;

    }


    const sensors = [

        {
            key: "ec",

            value:
                currentValues.ec,

            status:
                getECAlert(
                    currentValues.ec
                )

        },

        {
            key: "ph",

            value:
                currentValues.ph,

            status:
                getPHAlert(
                    currentValues.ph
                )

        },

        {
            key: "temperature",

            value:
                currentValues.temperature,

            status:
                getTemperatureAlert(
                    currentValues.temperature
                )

        },

        {
            key: "waterLevel",

            value:
                currentValues.waterLevel,

            status:
                getWaterLevelAlert(
                    currentValues.waterLevel
                )

        }

    ];


    container.innerHTML =
        sensors.map(
            sensor => {

                const info =
                    getSensorInfo(
                        sensor.key
                    );


                const formattedValue =
                    formatSensorValue(
                        sensor.key,
                        sensor.value
                    );


                const severity =
                    sensor.status.severity;


                const title =
                    sensor.value === null
                        ? `Waiting for ${info.name}`
                        : info.name;


                const description =
                    sensor.value === null
                        ? "No reading received from Firebase yet."
                        : sensor.status.description;


                return `

                    <div class="alert-card alert-card-${severity}">

                        <div class="alert-card-header">

                            <div class="alert-card-main">

                                <div class="alert-card-icon">

                                    <span class="material-icons">

                                        ${info.icon}

                                    </span>

                                </div>


                                <div>

                                    <h3 class="alert-card-title">

                                        ${escapeHtml(title)}

                                    </h3>


                                    <p class="alert-card-description">

                                        ${escapeHtml(description)}

                                    </p>

                                </div>

                            </div>


                            <span class="alert-severity">

                                ${escapeHtml(
                                    sensor.status.label
                                )}

                            </span>

                        </div>


                        <div class="alert-value-row">

                            <div>

                                <span class="alert-value-label">

                                    Current Reading

                                </span>


                                <p class="alert-value">

                                    ${escapeHtml(
                                        formattedValue
                                    )}

                                </p>

                            </div>


                            <div class="alert-value-right">

                                <span class="alert-value-label">

                                    Recommended

                                </span>


                                <p class="alert-value">

                                    ${escapeHtml(
                                        getRecommendedValue(
                                            sensor.key
                                        )
                                    )}

                                </p>

                            </div>

                        </div>


                        <div class="alert-action">

                            <p class="alert-action-title">

                                Status

                            </p>


                            <p class="alert-action-text">

                                ${
                                    sensor.value === null

                                    ?

                                    "Waiting for real-time Firebase sensor data."

                                    :

                                    escapeHtml(
                                        sensor.status.description
                                    )
                                }

                            </p>

                        </div>

                    </div>

                `;

            }
        ).join("");


    updateSummary(
        sensors
    );

}


// =========================================================
// UPDATE SUMMARY
// =========================================================

function updateSummary(
    sensors
) {

    let critical = 0;

    let warning = 0;

    let normal = 0;


    sensors.forEach(
        sensor => {

            if (
                sensor.value === null
            ) {

                return;

            }


            if (
                sensor.status.severity ===
                "critical"
            ) {

                critical++;

            }
            else if (
                sensor.status.severity ===
                "warning"
            ) {

                warning++;

            }
            else {

                normal++;

            }

        }
    );


    const criticalElement =
        document.getElementById(
            "criticalCount"
        );


    const warningElement =
        document.getElementById(
            "warningCount"
        );


    const normalElement =
        document.getElementById(
            "normalCount"
        );


    if (criticalElement) {

        criticalElement.textContent =
            critical;

    }


    if (warningElement) {

        warningElement.textContent =
            warning;

    }


    if (normalElement) {

        normalElement.textContent =
            normal;

    }

}


// =========================================================
// RENDER ALERT HISTORY
// =========================================================

function renderAlertHistory(
    data
) {

    const tbody =
        document.getElementById(
            "alertHistoryBody"
        );


    if (!tbody) {

        return;

    }


    if (!data) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >

                    No alert history yet.

                </td>

            </tr>

        `;

        return;

    }


    const entries =
        Object.entries(
            data
        );


    entries.reverse();


    const latest =
        entries.slice(
            0,
            5
        );


    if (
        latest.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >

                    No alert history yet.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        latest.map(
            ([id, alert]) => {

                return `

                    <tr>

                        <td>

                            ${escapeHtml(
                                alert.date ?? "--"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                alert.time ?? "--"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                alert.sensorName ??
                                alert.sensor ??
                                "--"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                alert.formattedValue ??
                                alert.value ??
                                "--"
                            )}

                        </td>


                        <td>

                            <span class="alert-severity">

                                ${escapeHtml(
                                    alert.label ??
                                    alert.severity ??
                                    "--"
                                )}

                            </span>

                        </td>


                        <td>

                            ${escapeHtml(
                                alert.description ??
                                "Monitor sensor condition."
                            )}

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


// =========================================================
// LISTEN TO SENSOR
// =========================================================

function listenToSensor(
    path,
    key,
    alertFunction
) {

    console.log(
        `Starting Firebase listener: ${path}`
    );


    const sensorRef =
        ref(
            database,
            path
        );


    onValue(
        sensorRef,

        snapshot => {

            const rawData =
                snapshot.val();


            console.log(
                `Firebase [${path}] raw value:`,
                rawData
            );


            const value =
                extractSensorValue(
                    rawData
                );


            console.log(
                `Firebase [${path}] parsed value:`,
                value
            );


            currentValues[key] =
                value;


            const status =
                alertFunction(
                    value
                );


            processAlert(
                key,
                value,
                status
            );


            renderCurrentAlerts();

        },

        error => {

            console.error(
                `Firebase listener error [${path}]:`,
                error
            );

        }
    );

}


// =========================================================
// START FIREBASE LISTENERS
// =========================================================

function startFirebaseListeners() {

    console.log(
        "========================================"
    );

    console.log(
        "HYDROSMART ALERTS"
    );

    console.log(
        "Starting Firebase listeners..."
    );

    console.log(
        "========================================"
    );


    // EC
    listenToSensor(
        EC_PATH,
        "ec",
        getECAlert
    );


    // pH
    listenToSensor(
        PH_PATH,
        "ph",
        getPHAlert
    );


    // Temperature
    listenToSensor(
        TEMPERATURE_PATH,
        "temperature",
        getTemperatureAlert
    );


    // Water Level
    listenToSensor(
        WATER_LEVEL_PATH,
        "waterLevel",
        getWaterLevelAlert
    );


    // Alert History
    console.log(
        `Starting Firebase listener: ${ALERT_HISTORY_PATH}`
    );


    onValue(

        ref(
            database,
            ALERT_HISTORY_PATH
        ),

        snapshot => {

            console.log(
                "Firebase alert history:",
                snapshot.val()
            );


            renderAlertHistory(
                snapshot.val()
            );

        },

        error => {

            console.error(
                "Alert history listener error:",
                error
            );

        }

    );

}


// =========================================================
// FIREBASE BOOT
// =========================================================

async function bootAlerts() {

    try {

        console.log(
            "HydroSmart Alerts booting..."
        );


        console.log(
            "Database object:",
            database
        );


        // firebaseLogin from your firebase.js
        // is already a Promise.

        if (
            firebaseLogin &&
            typeof firebaseLogin.then === "function"
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


    } catch (error) {

        console.error(
            "Firebase authentication failed:",
            error
        );


        const container =
            document.querySelector(
                ".current-alerts-grid"
            );


        if (container) {

            container.innerHTML = `

                <div class="alert-card alert-card-critical">

                    <div class="alert-card-header">

                        <div class="alert-card-main">

                            <div class="alert-card-icon">

                                <span class="material-icons">

                                    error

                                </span>

                            </div>


                            <div>

                                <h3 class="alert-card-title">

                                    Firebase Connection Failed

                                </h3>


                                <p class="alert-card-description">

                                    Unable to authenticate with Firebase.

                                </p>

                            </div>

                        </div>


                        <span class="alert-severity">

                            ERROR

                        </span>

                    </div>


                    <div class="alert-value-row">

                        <div>

                            <span class="alert-value-label">

                                System Status

                            </span>


                            <p class="alert-value">

                                Offline

                            </p>

                        </div>

                    </div>


                    <div class="alert-action">

                        <p class="alert-action-title">

                            Error

                        </p>


                        <p class="alert-action-text">

                            Check Firebase Authentication and Realtime Database rules.

                        </p>

                    </div>

                </div>

            `;

        }

    }

}


// =========================================================
// START
// =========================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        bootAlerts
    );

}
else {

    bootAlerts();

}


console.log(
    "HydroSmart Alerts module loaded."
);
