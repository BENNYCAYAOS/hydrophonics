/* =========================================================
   HYDROSMART REPORTS
   FIREBASE CONNECTED VERSION
   SENSOR RECORDS = ONE SENSOR PER ROW
   RESPONSIVE RECORD DISPLAY + PRINT SUPPORT
   SKELETON LOADING = UI ONLY
========================================================= */

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    database,
    firebaseLogin
} from "./firebase.js";


/* =========================================================
   FIREBASE PATHS
========================================================= */

const PH_PATH =
    "sensors/ph";

const EC_PATH =
    "sensors/ec";

const TEMPERATURE_PATH =
    "sensors/water_temperature";

const WATER_LEVEL_PATH =
    "sensors/waterLevel";

const DOSING_MODE_PATH =
    "control/dosingMode";

const PUMP_A_PATH =
    "control/pumps/nutrientA";

const PUMP_B_PATH =
    "control/pumps/nutrientB";

const PH_DOWN_PATH =
    "control/pumps/phDown";

const LOGS_PATH =
    "logs";

const ALERT_HISTORY_PATH =
    "alertHistory";


/* =========================================================
   REPORTS SKELETON LOADING
   UI ONLY
========================================================= */

let reportsPageLoading = true;

const REPORTS_SKELETON_DURATION = 1500;


function hideReportsSkeleton() {

    if (!reportsPageLoading) {

        return;

    }


    reportsPageLoading = false;


    document.body.classList.remove(
        "reports-page-loading"
    );

}


/* =========================================================
   DATA
========================================================= */

/*
   IMPORTANT:

   sensorRecords stores COMPLETE sensor snapshots.

   Example:

   {
       date: "2026-09-11",
       time: "02:17:16",
       ph: 8.15,
       ec: 1.28,
       temperature: 26.4,
       waterLevel: 75.7
   }

   The Sensor Records table will convert each snapshot
   into individual sensor rows.
*/

let sensorRecords = [];

let dosingRecords = [];

let alertRecords = [];

let currentSensorValues = {

    ph: null,

    ec: null,

    temperature: null,

    waterLevel: null

};

let firebaseReady = false;


/* =========================================================
   DISPLAY SETTINGS
========================================================= */

const SCREEN_RECORD_LIMIT = 5;


/*
   Print selector:

   Latest 5
   Latest 10
   Latest 20
   All Records
*/

let printRecordLimit = 5;


/* =========================================================
   ELEMENTS
========================================================= */

const fromDate =
    document.getElementById("fromDate");

const toDate =
    document.getElementById("toDate");

const reportType =
    document.getElementById("reportType");

const generateButton =
    document.getElementById("generateReport");

const printButton =
    document.getElementById("printReport");

const pdfButton =
    document.getElementById("savePdf");

const excelButton =
    document.getElementById("exportExcel");

const printRecordCount =
    document.getElementById("printRecordCount");


/* =========================================================
   HELPERS
========================================================= */

function isValidNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return false;

    }

    const number =
        Number(value);

    return Number.isFinite(number);

}


function numberValue(
    value,
    fallback = null
) {

    if (
        isValidNumber(value)
    ) {

        return Number(value);

    }

    return fallback;

}


function pad(value) {

    return String(value)
        .padStart(2, "0");

}


function getToday() {

    const now =
        new Date();

    return (
        now.getFullYear() +
        "-" +
        pad(now.getMonth() + 1) +
        "-" +
        pad(now.getDate())
    );

}


function getCurrentTime() {

    const now =
        new Date();

    return (
        pad(now.getHours()) +
        ":" +
        pad(now.getMinutes()) +
        ":" +
        pad(now.getSeconds())
    );

}


function formatDate(dateString) {

    if (!dateString) {

        return "--";

    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }

    return date.toLocaleDateString(
        "en-US",
        {

            year:
                "numeric",

            month:
                "short",

            day:
                "2-digit"

        }
    );

}


/* =========================================================
   EXTRACT FIREBASE VALUE
========================================================= */

function extractValue(
    data,
    keys = []
) {

    if (
        data === null ||
        data === undefined
    ) {

        return null;

    }


    if (
        typeof data === "number"
    ) {

        return data;

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


/* =========================================================
   FIREBASE DATA -> SENSOR SNAPSHOT
========================================================= */

function buildSensorRecord() {

    const now =
        new Date();

    return {

        date:
            now.getFullYear() +
            "-" +
            pad(now.getMonth() + 1) +
            "-" +
            pad(now.getDate()),

        time:
            getCurrentTime(),

        ph:
            currentSensorValues.ph,

        ec:
            currentSensorValues.ec,

        temperature:
            currentSensorValues.temperature,

        waterLevel:
            currentSensorValues.waterLevel

    };

}


/* =========================================================
   UPDATE LIVE SENSOR SNAPSHOT
========================================================= */

function updateSensorRecord() {

    const record =
        buildSensorRecord();


    if (
        !isValidNumber(record.ph) &&
        !isValidNumber(record.ec) &&
        !isValidNumber(record.temperature) &&
        !isValidNumber(record.waterLevel)
    ) {

        return;

    }


    const last =
        sensorRecords[
            sensorRecords.length - 1
        ];


    if (last) {

        const same =

            Number(last.ph) ===
                Number(record.ph) &&

            Number(last.ec) ===
                Number(record.ec) &&

            Number(last.temperature) ===
                Number(record.temperature) &&

            Number(last.waterLevel) ===
                Number(record.waterLevel);


        if (same) {

            return;

        }

    }


    sensorRecords.push(
        record
    );


    if (
        sensorRecords.length > 1000
    ) {

        sensorRecords =
            sensorRecords.slice(-1000);

    }


    if (firebaseReady) {

        generateReport();

    }

}


/* =========================================================
   SENSOR LISTENERS
========================================================= */

function listenToSensors() {

    /* =====================================================
       pH
    ===================================================== */

    onValue(
        ref(
            database,
            PH_PATH
        ),
        snapshot => {

            const value =
                extractValue(
                    snapshot.val(),
                    [
                        "value",
                        "reading",
                        "val",
                        "ph"
                    ]
                );


            if (
                isValidNumber(value)
            ) {

                currentSensorValues.ph =
                    value;

                updateSensorRecord();

            }

        }
    );


    /* =====================================================
       EC
    ===================================================== */

    onValue(
        ref(
            database,
            EC_PATH
        ),
        snapshot => {

            let value =
                extractValue(
                    snapshot.val(),
                    [
                        "value",
                        "reading",
                        "val",
                        "ec"
                    ]
                );


            /*
               Convert µS/cm to mS/cm
               when value is clearly µS/cm.
            */

            if (
                isValidNumber(value)
            ) {

                if (
                    value > 20
                ) {

                    value =
                        value / 1000;

                }


                currentSensorValues.ec =
                    value;

                updateSensorRecord();

            }

        }
    );


    /* =====================================================
       WATER TEMPERATURE
    ===================================================== */

    onValue(
        ref(
            database,
            TEMPERATURE_PATH
        ),
        snapshot => {

            const value =
                extractValue(
                    snapshot.val(),
                    [
                        "value",
                        "reading",
                        "val",
                        "temperature",
                        "water_temperature"
                    ]
                );


            if (
                isValidNumber(value)
            ) {

                currentSensorValues.temperature =
                    value;

                updateSensorRecord();

            }

        }
    );


    /* =====================================================
       WATER LEVEL
    ===================================================== */

    onValue(
        ref(
            database,
            WATER_LEVEL_PATH
        ),
        snapshot => {

            const value =
                extractValue(
                    snapshot.val(),
                    [
                        "value",
                        "reading",
                        "val",
                        "waterLevel",
                        "water_level",
                        "level",
                        "percentage",
                        "percent"
                    ]
                );


            if (
                isValidNumber(value)
            ) {

                currentSensorValues.waterLevel =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            value
                        )
                    );

                updateSensorRecord();

            }

        }
    );

}


/* =========================================================
   FIREBASE OBJECT -> ARRAY
========================================================= */

function firebaseObjectToArray(data) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        return [];

    }


    return Object.entries(data)
        .map(
            ([key, value]) => {

                if (
                    value &&
                    typeof value === "object"
                ) {

                    return {

                        id:
                            key,

                        ...value

                    };

                }


                return {

                    id:
                        key,

                    value

                };

            }
        );

}


/* =========================================================
   DATE/TIME EXTRACTION
========================================================= */

function getRecordDate(record) {

    if (
        record.date
    ) {

        return String(
            record.date
        )
        .substring(
            0,
            10
        );

    }


    if (
        record.timestamp
    ) {

        const date =
            new Date(
                Number(
                    record.timestamp
                )
            );


        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {

            return (

                date.getFullYear() +
                "-" +
                pad(
                    date.getMonth() + 1
                ) +
                "-" +
                pad(
                    date.getDate()
                )

            );

        }

    }


    if (
        record.datetime
    ) {

        return String(
            record.datetime
        )
        .substring(
            0,
            10
        );

    }


    return getToday();

}


function getRecordTime(record) {

    if (
        record.time
    ) {

        return String(
            record.time
        );

    }


    if (
        record.timestamp
    ) {

        const date =
            new Date(
                Number(
                    record.timestamp
                )
            );


        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {

            return (

                pad(
                    date.getHours()
                ) +
                ":" +
                pad(
                    date.getMinutes()
                ) +
                ":" +
                pad(
                    date.getSeconds()
                )

            );

        }

    }


    return "--";

}


/* =========================================================
   DOSING RECORD NORMALIZER
========================================================= */

function normalizeDosingRecord(record) {

    const pumpRaw =
        String(
            record.pump ||
            record.pumpId ||
            record.device ||
            ""
        );


    let pump =
        pumpRaw;


    if (
        pumpRaw
            .toLowerCase()
            .includes("nutrienta") ||
        pumpRaw === "nutrientA"
    ) {

        pump =
            "Nutrient Pump A";

    }

    else if (
        pumpRaw
            .toLowerCase()
            .includes("nutrientb") ||
        pumpRaw === "nutrientB"
    ) {

        pump =
            "Nutrient Pump B";

    }

    else if (
        pumpRaw
            .toLowerCase()
            .includes("phdown") ||
        pumpRaw === "phDown"
    ) {

        pump =
            "pH Down Pump";

    }


    let oldState =
        record.old ??
        record.previous ??
        record.previousState ??
        "OFF";


    let newState =
        record.new ??
        record.state ??
        record.newState ??
        record.status ??
        "ON";


    oldState =
        String(
            oldState
        )
        .toUpperCase();


    newState =
        String(
            newState
        )
        .toUpperCase();


    if (
        newState !== "ON" &&
        record.result === undefined
    ) {

        return null;

    }


    let mode =
        record.mode ||
        record.controlType ||
        record.status ||
        "Automatic";


    mode =
        String(mode);


    if (
        mode
            .toLowerCase()
            .includes("manual")
    ) {

        mode =
            "Manual";

    }

    else {

        mode =
            "Automatic";

    }


    let reason =
        record.reason ||
        record.controlReason ||
        "";


    if (!reason) {

        if (
            pump === "Nutrient Pump A" ||
            pump === "Nutrient Pump B"
        ) {

            reason =
                "Low EC";

        }

        else if (
            pump === "pH Down Pump"
        ) {

            reason =
                "High pH";

        }

        else {

            reason =
                "Pump activation";

        }

    }


    let duration =
        record.duration ??
        record.durationSeconds ??
        record.runTime ??
        "--";


    if (
        isValidNumber(duration)
    ) {

        duration =
            `${Number(duration)} sec`;

    }


    const result =
        record.result ||
        "Activated";


    return {

        date:
            getRecordDate(record),

        time:
            getRecordTime(record),

        pump,

        mode,

        reason,

        duration,

        result

    };

}


/* =========================================================
   LOAD DOSING LOGS
========================================================= */

function listenToDosingLogs() {

    onValue(
        ref(
            database,
            LOGS_PATH
        ),
        snapshot => {

            const data =
                snapshot.val();


            const records =
                firebaseObjectToArray(
                    data
                );


            dosingRecords =
                records
                    .map(
                        normalizeDosingRecord
                    )
                    .filter(
                        record =>
                            record !== null
                    )
                    .sort(
                        (a, b) => {

                            const aa =
                                `${a.date} ${a.time}`;

                            const bb =
                                `${b.date} ${b.time}`;


                            return bb.localeCompare(
                                aa
                            );

                        }
                    );


            generateReport();

        }
    );

}


/* =========================================================
   ALERT NORMALIZER
========================================================= */

function normalizeAlertRecord(record) {

    const severityRaw =
        record.severity ||
        record.level ||
        record.type ||
        "Warning";


    let severity =
        String(
            severityRaw
        );


    if (
        severity
            .toLowerCase()
            .includes("critical")
    ) {

        severity =
            "Critical";

    }

    else if (
        severity
            .toLowerCase()
            .includes("normal")
    ) {

        severity =
            "Normal";

    }

    else {

        severity =
            "Warning";

    }


    const alert =
        record.alert ||
        record.title ||
        record.message ||
        record.sensor ||
        "System Alert";


    const value =
        record.value ??
        record.reading ??
        record.sensorValue ??
        "--";


    const action =
        record.action ||
        record.actionTaken ||
        record.response ||
        "Monitoring";


    const result =
        record.result ||
        record.status ||
        "Recorded";


    return {

        date:
            getRecordDate(record),

        time:
            getRecordTime(record),

        alert:
            String(alert),

        value:
            String(value),

        severity,

        action:
            String(action),

        result:
            String(result)

    };

}


/* =========================================================
   LOAD ALERT HISTORY
========================================================= */

function listenToAlerts() {

    onValue(
        ref(
            database,
            ALERT_HISTORY_PATH
        ),
        snapshot => {

            const data =
                snapshot.val();


            const records =
                firebaseObjectToArray(
                    data
                );


            alertRecords =
                records
                    .map(
                        normalizeAlertRecord
                    )
                    .sort(
                        (a, b) => {

                            const aa =
                                `${a.date} ${a.time}`;

                            const bb =
                                `${b.date} ${b.time}`;


                            return bb.localeCompare(
                                aa
                            );

                        }
                    );


            generateReport();

        }
    );

}


/* =========================================================
   SENSOR STATUS
========================================================= */

function getSensorStatus(
    sensor,
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {

        return {

            text:
                "No Data",

            className:
                "status-warning"

        };

    }


    /* =====================================================
       pH
    ===================================================== */

    if (
        sensor === "pH"
    ) {

        if (
            number >= 5.5 &&
            number <= 6.5
        ) {

            return {

                text:
                    "Normal",

                className:
                    "status-normal"

            };

        }


        if (
            number < 5.0 ||
            number > 7.0
        ) {

            return {

                text:
                    "Critical",

                className:
                    "status-critical"

            };

        }


        return {

            text:
                "Warning",

            className:
                "status-warning"

        };

    }


    /* =====================================================
       EC
    ===================================================== */

    if (
        sensor === "EC"
    ) {

        if (
            number >= 0.8 &&
            number <= 1.2
        ) {

            return {

                text:
                    "Normal",

                className:
                    "status-normal"

            };

        }


        if (
            number < 0.6 ||
            number > 2.5
        ) {

            return {

                text:
                    "Critical",

                className:
                    "status-critical"

            };

        }


        return {

            text:
                "Warning",

            className:
                "status-warning"

        };

    }


    /* =====================================================
       WATER TEMPERATURE
    ===================================================== */

    if (
        sensor === "Water Temperature"
    ) {

        if (
            number >= 18 &&
            number <= 26
        ) {

            return {

                text:
                    "Normal",

                className:
                    "status-normal"

            };

        }


        if (
            number < 15 ||
            number > 30
        ) {

            return {

                text:
                    "Critical",

                className:
                    "status-critical"

            };

        }


        return {

            text:
                "Warning",

            className:
                "status-warning"

        };

    }


    /* =====================================================
       WATER LEVEL
    ===================================================== */

    if (
        sensor === "Water Level"
    ) {

        if (
            number <= 30
        ) {

            return {

                text:
                    "Critical",

                className:
                    "status-critical"

            };

        }


        if (
            number <= 40
        ) {

            return {

                text:
                    "Warning",

                className:
                    "status-warning"

            };

        }


        return {

            text:
                "Normal",

            className:
                "status-normal"

        };

    }


    return {

        text:
            "Warning",

        className:
            "status-warning"

    };

}


/* =========================================================
   SNAPSHOT OVERALL STATUS
========================================================= */

function getSnapshotOverallStatus(record) {

    const statuses = [];


    if (
        isValidNumber(record.ph)
    ) {

        statuses.push(
            getSensorStatus(
                "pH",
                record.ph
            )
        );

    }


    if (
        isValidNumber(record.ec)
    ) {

        statuses.push(
            getSensorStatus(
                "EC",
                record.ec
            )
        );

    }


    if (
        isValidNumber(record.temperature)
    ) {

        statuses.push(
            getSensorStatus(
                "Water Temperature",
                record.temperature
            )
        );

    }


    if (
        isValidNumber(record.waterLevel)
    ) {

        statuses.push(
            getSensorStatus(
                "Water Level",
                record.waterLevel
            )
        );

    }


    if (!statuses.length) {

        return {

            text:
                "No Data",

            className:
                "status-warning"

        };

    }


    if (
        statuses.some(
            status =>
                status.text === "Critical"
        )
    ) {

        return {

            text:
                "Critical",

            className:
                "status-critical"

        };

    }


    if (
        statuses.some(
            status =>
                status.text === "Warning"
        )
    ) {

        return {

            text:
                "Warning",

            className:
                "status-warning"

        };

    }


    return {

        text:
            "Normal",

        className:
            "status-normal"

    };

}


/* =========================================================
   DATE FILTER
========================================================= */

function filterByDate(records) {

    const start =
        fromDate?.value ||
        "0000-01-01";


    const end =
        toDate?.value ||
        "9999-12-31";


    return records.filter(
        record => {

            return (
                record.date >= start &&
                record.date <= end
            );

        }
    );

}


/* =========================================================
   SORT NEWEST FIRST
========================================================= */

function sortNewestFirst(records) {

    return records
        .slice()
        .sort(
            (a, b) => {

                const aa =
                    `${a.date} ${a.time || ""}`;

                const bb =
                    `${b.date} ${b.time || ""}`;


                return bb.localeCompare(
                    aa
                );

            }
        );

}


/* =========================================================
   CREATE INDIVIDUAL SENSOR ROWS
========================================================= */

function flattenSensorRecords(records) {

    const rows = [];


    sortNewestFirst(
        records
    )
    .forEach(
        record => {

            /* =============================================
               pH
            ============================================== */

            if (
                isValidNumber(record.ph)
            ) {

                rows.push({

                    date:
                        record.date,

                    time:
                        record.time,

                    sensor:
                        "pH",

                    reading:
                        Number(
                            record.ph
                        ).toFixed(2),

                    rawValue:
                        Number(
                            record.ph
                        )

                });

            }


            /* =============================================
               EC
            ============================================== */

            if (
                isValidNumber(record.ec)
            ) {

                rows.push({

                    date:
                        record.date,

                    time:
                        record.time,

                    sensor:
                        "EC",

                    reading:
                        Number(
                            record.ec
                        ).toFixed(2) +
                        " mS/cm",

                    rawValue:
                        Number(
                            record.ec
                        )

                });

            }


            /* =============================================
               WATER TEMPERATURE
            ============================================== */

            if (
                isValidNumber(record.temperature)
            ) {

                rows.push({

                    date:
                        record.date,

                    time:
                        record.time,

                    sensor:
                        "Water Temperature",

                    reading:
                        Number(
                            record.temperature
                        ).toFixed(1) +
                        " °C",

                    rawValue:
                        Number(
                            record.temperature
                        )

                });

            }


            /* =============================================
               WATER LEVEL
            ============================================== */

            if (
                isValidNumber(record.waterLevel)
            ) {

                rows.push({

                    date:
                        record.date,

                    time:
                        record.time,

                    sensor:
                        "Water Level",

                    reading:
                        Number(
                            record.waterLevel
                        ).toFixed(1) +
                        "%",

                    rawValue:
                        Number(
                            record.waterLevel
                        )

                });

            }

        }
    );


    return rows;

}


/* =========================================================
   APPLY TABLE DISPLAY CLASSES
========================================================= */

function applyTableDisplayClasses() {

    const sensorBody =
        document.getElementById(
            "sensorRecordsBody"
        );


    const dosingBody =
        document.getElementById(
            "dosingRecordsBody"
        );


    const alertBody =
        document.getElementById(
            "alertRecordsBody"
        );


    const dailyBody =
        document.getElementById(
            "dailyRecordsBody"
        );


    if (sensorBody) {

        const table =
            sensorBody.closest(
                "table"
            );


        if (table) {

            table.classList.add(
                "report-table",
                "sensor-table"
            );

        }

    }


    if (dosingBody) {

        const table =
            dosingBody.closest(
                "table"
            );


        if (table) {

            table.classList.add(
                "report-table",
                "pump-table"
            );

        }

    }


    if (alertBody) {

        const table =
            alertBody.closest(
                "table"
            );


        if (table) {

            table.classList.add(
                "report-table",
                "alert-table"
            );

        }

    }


    if (dailyBody) {

        const table =
            dailyBody.closest(
                "table"
            );


        if (table) {

            table.classList.add(
                "report-table",
                "tank-table"
            );

        }

    }

}


/* =========================================================
   SUMMARY
========================================================= */

function generateSummary(
    filteredSensors
) {

    const avgPhElement =
        document.getElementById(
            "avgPh"
        );


    const avgEcElement =
        document.getElementById(
            "avgEc"
        );


    const avgTempElement =
        document.getElementById(
            "avgTemperature"
        );


    const optimalElement =
        document.getElementById(
            "optimalPercentage"
        );


    const pumpElement =
        document.getElementById(
            "pumpActivations"
        );


    const alertElement =
        document.getElementById(
            "totalAlerts"
        );


    if (!filteredSensors.length) {

        avgPhElement.textContent =
            "--";

        avgEcElement.textContent =
            "--";

        avgTempElement.textContent =
            "--";

        optimalElement.textContent =
            "--";

    }

    else {

        const validPh =
            filteredSensors.filter(
                record =>
                    isValidNumber(
                        record.ph
                    )
            );


        const validEc =
            filteredSensors.filter(
                record =>
                    isValidNumber(
                        record.ec
                    )
            );


        const validTemp =
            filteredSensors.filter(
                record =>
                    isValidNumber(
                        record.temperature
                    )
            );


        /* -----------------------------------------
           AVERAGE pH
        ----------------------------------------- */

        if (
            validPh.length
        ) {

            const total =
                validPh.reduce(
                    (sum, record) =>
                        sum +
                        Number(
                            record.ph
                        ),
                    0
                );


            avgPhElement.textContent =
                (
                    total /
                    validPh.length
                ).toFixed(2);

        }

        else {

            avgPhElement.textContent =
                "--";

        }


        /* -----------------------------------------
           AVERAGE EC
        ----------------------------------------- */

        if (
            validEc.length
        ) {

            const total =
                validEc.reduce(
                    (sum, record) =>
                        sum +
                        Number(
                            record.ec
                        ),
                    0
                );


            avgEcElement.textContent =
                (
                    total /
                    validEc.length
                ).toFixed(2) +
                " mS/cm";

        }

        else {

            avgEcElement.textContent =
                "--";

        }


        /* -----------------------------------------
           AVERAGE TEMPERATURE
        ----------------------------------------- */

        if (
            validTemp.length
        ) {

            const total =
                validTemp.reduce(
                    (sum, record) =>
                        sum +
                        Number(
                            record.temperature
                        ),
                    0
                );


            avgTempElement.textContent =
                (
                    total /
                    validTemp.length
                ).toFixed(1) +
                " °C";

        }

        else {

            avgTempElement.textContent =
                "--";

        }


        /* -----------------------------------------
           OPTIMAL PERCENTAGE
        ----------------------------------------- */

        const completeRecords =
            filteredSensors.filter(
                record =>

                    isValidNumber(
                        record.ph
                    ) &&

                    isValidNumber(
                        record.ec
                    ) &&

                    isValidNumber(
                        record.temperature
                    )
            );


        if (
            completeRecords.length
        ) {

            const optimal =
                completeRecords.filter(
                    record =>

                        getSnapshotOverallStatus(
                            record
                        ).text ===
                        "Normal"
                ).length;


            optimalElement.textContent =
                (
                    optimal /
                    completeRecords.length *
                    100
                ).toFixed(0) +
                "%";

        }

        else {

            optimalElement.textContent =
                "--";

        }

    }


    const filteredDosing =
        filterByDate(
            dosingRecords
        );


    const filteredAlerts =
        filterByDate(
            alertRecords
        );


    pumpElement.textContent =
        filteredDosing.length;


    alertElement.textContent =
        filteredAlerts.length;

}


/* =========================================================
   SENSOR TABLE
========================================================= */

function renderSensorRecords(
    records,
    recordLimit = SCREEN_RECORD_LIMIT
) {

    const tbody =
        document.getElementById(
            "sensorRecordsBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        "";


    const sensorRows =
        flattenSensorRecords(
            records
        );


    let rowsToDisplay =
        sensorRows;


    if (
        recordLimit !== "all"
    ) {

        rowsToDisplay =
            sensorRows.slice(
                0,
                Number(recordLimit)
            );

    }


    if (!rowsToDisplay.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-record"
                >

                    No sensor records found
                    for the selected period.

                </td>

            </tr>

        `;


        applyTableDisplayClasses();

        return;

    }


    rowsToDisplay.forEach(
        record => {

            const status =
                getSensorStatus(
                    record.sensor,
                    record.rawValue
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${formatDate(
                        record.date
                    )}
                </td>

                <td>
                    ${record.time || "--"}
                </td>

                <td>
                    <strong>
                        ${record.sensor}
                    </strong>
                </td>

                <td>
                    ${record.reading}
                </td>

                <td class="${status.className}">
                    ${status.text}
                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );


    applyTableDisplayClasses();

}


/* =========================================================
   DOSING TABLE
========================================================= */

function renderDosingRecords(
    records,
    recordLimit = SCREEN_RECORD_LIMIT
) {

    const tbody =
        document.getElementById(
            "dosingRecordsBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        "";


    let rowsToDisplay =
        sortNewestFirst(
            records
        );


    if (
        recordLimit !== "all"
    ) {

        rowsToDisplay =
            rowsToDisplay.slice(
                0,
                Number(recordLimit)
            );

    }


    if (!rowsToDisplay.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-record"
                >

                    No dosing records found
                    for the selected period.

                </td>

            </tr>

        `;


        applyTableDisplayClasses();

        return;

    }


    rowsToDisplay.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${formatDate(
                        record.date
                    )}
                </td>

                <td>
                    ${record.time || "--"}
                </td>

                <td>
                    ${record.pump || "--"}
                </td>

                <td>
                    ${record.mode || "--"}
                </td>

                <td>
                    ${record.reason || "--"}
                </td>

                <td>
                    ${record.duration || "--"}
                </td>

                <td class="status-normal">
                    ${record.result || "--"}
                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );


    applyTableDisplayClasses();

}


/* =========================================================
   ALERT TABLE
========================================================= */

function renderAlertRecords(
    records,
    recordLimit = SCREEN_RECORD_LIMIT
) {

    const tbody =
        document.getElementById(
            "alertRecordsBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        "";


    let rowsToDisplay =
        sortNewestFirst(
            records
        );


    if (
        recordLimit !== "all"
    ) {

        rowsToDisplay =
            rowsToDisplay.slice(
                0,
                Number(recordLimit)
            );

    }


    if (!rowsToDisplay.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-record"
                >

                    No alerts found
                    for the selected period.

                </td>

            </tr>

        `;


        applyTableDisplayClasses();

        return;

    }


    rowsToDisplay.forEach(
        record => {

            let severityClass =
                "status-warning";


            if (
                record.severity ===
                "Critical"
            ) {

                severityClass =
                    "status-critical";

            }

            else if (
                record.severity ===
                "Normal"
            ) {

                severityClass =
                    "status-normal";

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${formatDate(
                        record.date
                    )}
                </td>

                <td>
                    ${record.time || "--"}
                </td>

                <td>
                    ${record.alert || "--"}
                </td>

                <td>
                    ${record.value || "--"}
                </td>

                <td class="${severityClass}">
                    ${record.severity || "--"}
                </td>

                <td>
                    ${record.action || "--"}
                </td>

                <td class="status-normal">
                    ${record.result || "--"}
                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );


    applyTableDisplayClasses();

}


/* =========================================================
   DAILY SUMMARY
========================================================= */

function renderDailySummary(
    records,
    recordLimit = SCREEN_RECORD_LIMIT
) {

    const tbody =
        document.getElementById(
            "dailyRecordsBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML =
        "";


    if (!records.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-record"
                >

                    No daily records found.

                </td>

            </tr>

        `;


        applyTableDisplayClasses();

        return;

    }


    const grouped = {};


    records.forEach(
        record => {

            if (
                !grouped[
                    record.date
                ]
            ) {

                grouped[
                    record.date
                ] = [];

            }


            grouped[
                record.date
            ].push(
                record
            );

        }
    );


    let dates =
        Object.keys(grouped)
            .sort()
            .reverse();


    if (
        recordLimit !== "all"
    ) {

        dates =
            dates.slice(
                0,
                Number(recordLimit)
            );

    }


    dates.forEach(
        date => {

            const dayRecords =
                grouped[
                    date
                ];


            const validPh =
                dayRecords.filter(
                    r =>
                        isValidNumber(
                            r.ph
                        )
                );


            const validEc =
                dayRecords.filter(
                    r =>
                        isValidNumber(
                            r.ec
                        )
                );


            const validTemp =
                dayRecords.filter(
                    r =>
                        isValidNumber(
                            r.temperature
                        )
                );


            const avgPh =
                validPh.length
                    ? validPh.reduce(
                        (sum, r) =>
                            sum +
                            Number(
                                r.ph
                            ),
                        0
                    ) /
                    validPh.length
                    : null;


            const avgEc =
                validEc.length
                    ? validEc.reduce(
                        (sum, r) =>
                            sum +
                            Number(
                                r.ec
                            ),
                        0
                    ) /
                    validEc.length
                    : null;


            const avgTemp =
                validTemp.length
                    ? validTemp.reduce(
                        (sum, r) =>
                            sum +
                            Number(
                                r.temperature
                            ),
                        0
                    ) /
                    validTemp.length
                    : null;


            const complete =
                dayRecords.filter(
                    r =>

                        isValidNumber(
                            r.ph
                        ) &&

                        isValidNumber(
                            r.ec
                        ) &&

                        isValidNumber(
                            r.temperature
                        )
                );


            const optimal =
                complete.filter(
                    r =>

                        getSnapshotOverallStatus(
                            r
                        ).text ===
                        "Normal"
                ).length;


            const optimalPercentage =
                complete.length
                    ? (
                        optimal /
                        complete.length *
                        100
                    )
                    : null;


            const pumpCount =
                dosingRecords.filter(
                    record =>
                        record.date ===
                        date
                ).length;


            const alertCount =
                alertRecords.filter(
                    record =>
                        record.date ===
                        date
                ).length;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${formatDate(
                        date
                    )}
                </td>

                <td>
                    ${
                        avgPh !== null
                            ? avgPh.toFixed(2)
                            : "--"
                    }
                </td>

                <td>
                    ${
                        avgEc !== null
                            ? avgEc.toFixed(2) +
                              " mS/cm"
                            : "--"
                    }
                </td>

                <td>
                    ${
                        avgTemp !== null
                            ? avgTemp.toFixed(1) +
                              " °C"
                            : "--"
                    }
                </td>

                <td>
                    ${
                        optimalPercentage !== null
                            ? optimalPercentage
                                .toFixed(0) +
                              "%"
                            : "--"
                    }
                </td>

                <td>
                    ${pumpCount}
                </td>

                <td>
                    ${alertCount}
                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );


    applyTableDisplayClasses();

}


/* =========================================================
   REPORT PERIOD
========================================================= */

function updateReportPeriod() {

    const element =
        document.getElementById(
            "reportPeriod"
        );


    if (!element) {

        return;

    }


    const start =
        fromDate?.value
            ? formatDate(
                fromDate.value
            )
            : "All Dates";


    const end =
        toDate?.value
            ? formatDate(
                toDate.value
            )
            : "All Dates";


    element.textContent =
        `Report Period: ${start} – ${end}`;

}


/* =========================================================
   SECTION VISIBILITY
========================================================= */

function updateSections() {

    const type =
        reportType?.value ||
        "all";


    const summary =
        document.getElementById(
            "summarySection"
        );


    const sensor =
        document.getElementById(
            "sensorSection"
        );


    const dosing =
        document.getElementById(
            "dosingSection"
        );


    const alerts =
        document.getElementById(
            "alertsSection"
        );


    const daily =
        document.getElementById(
            "dailySection"
        );


    if (summary) {

        summary.style.display =
            type === "all" ||
            type === "summary"
                ? ""
                : "none";

    }


    if (sensor) {

        sensor.style.display =
            type === "all" ||
            type === "sensor"
                ? ""
                : "none";

    }


    if (dosing) {

        dosing.style.display =
            type === "all" ||
            type === "dosing"
                ? ""
                : "none";

    }


    if (alerts) {

        alerts.style.display =
            type === "all" ||
            type === "alerts"
                ? ""
                : "none";

    }


    if (daily) {

        daily.style.display =
            type === "all" ||
            type === "summary"
                ? ""
                : "none";

    }

}


/* =========================================================
   GET SELECTED PRINT LIMIT
========================================================= */

function getSelectedPrintLimit() {

    if (!printRecordCount) {

        return "all";

    }


    const value =
        printRecordCount.value;


    if (
        value === "all"
    ) {

        return "all";

    }


    const number =
        Number(value);


    if (
        Number.isFinite(number) &&
        number > 0
    ) {

        return number;

    }


    return 5;

}


/* =========================================================
   GENERATE REPORT
========================================================= */

function generateReport(
    recordLimit = SCREEN_RECORD_LIMIT
) {

    const filteredSensors =
        filterByDate(
            sensorRecords
        );


    const filteredDosing =
        filterByDate(
            dosingRecords
        );


    const filteredAlerts =
        filterByDate(
            alertRecords
        );


    generateSummary(
        filteredSensors
    );


    renderSensorRecords(
        filteredSensors,
        recordLimit
    );


    renderDosingRecords(
        filteredDosing,
        recordLimit
    );


    renderAlertRecords(
        filteredAlerts,
        recordLimit
    );


    renderDailySummary(
        filteredSensors,
        recordLimit
    );


    updateReportPeriod();


    updateSections();


    applyTableDisplayClasses();

}


/* =========================================================
   PREPARE CLONE FOR PRINTING
========================================================= */

function prepareCloneForPrinting(
    clonedReport
) {

    if (!clonedReport) {

        return;

    }


    const tables =
        clonedReport.querySelectorAll(
            ".report-table"
        );


    tables.forEach(
        table => {

            table.classList.remove(
                "show-latest-5"
            );


            table.classList.add(
                "print-all-records"
            );


            const rows =
                table.querySelectorAll(
                    "tbody tr"
                );


            rows.forEach(
                row => {

                    row.style.display =
                        "table-row";

                }
            );

        }
    );

}


/* =========================================================
   STANDALONE PRINT WINDOW
========================================================= */

function openStandalonePrintWindow() {

    printRecordLimit =
        getSelectedPrintLimit();


    generateReport(
        printRecordLimit
    );


    updateSections();


    const report =
        document.getElementById(
            "printableReport"
        );


    if (!report) {

        alert(
            "Printable report was not found."
        );

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=1000,height=1200"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups for HYDROSMART to print the report."
        );


        generateReport(
            SCREEN_RECORD_LIMIT
        );

        return;

    }


    const clonedReport =
        report.cloneNode(true);


    prepareCloneForPrinting(
        clonedReport
    );


    const styles =
        Array.from(
            document.querySelectorAll(
                'link[rel="stylesheet"], style'
            )
        )
        .map(
            element =>
                element.outerHTML
        )
        .join("\n");


    const printStyles = `

        <style>

            @page {

                size: A4 portrait;

                margin: 10mm;

            }


            *,
            *::before,
            *::after {

                box-sizing:
                    border-box !important;

            }


            html,
            body {

                width:
                    100% !important;

                height:
                    auto !important;

                min-height:
                    0 !important;

                max-height:
                    none !important;

                margin:
                    0 !important;

                padding:
                    0 !important;

                overflow:
                    visible !important;

                position:
                    static !important;

                transform:
                    none !important;

            }


            body {

                background:
                    #ffffff !important;

            }


            .reports-page {

                width:
                    100% !important;

                max-width:
                    none !important;

                height:
                    auto !important;

                min-height:
                    0 !important;

                max-height:
                    none !important;

                margin:
                    0 !important;

                padding:
                    0 !important;

                overflow:
                    visible !important;

                position:
                    static !important;

                transform:
                    none !important;

            }


            #printableReport {

                width:
                    100% !important;

                max-width:
                    none !important;

                height:
                    auto !important;

                min-height:
                    0 !important;

                max-height:
                    none !important;

                margin:
                    0 !important;

                padding:
                    0 !important;

                overflow:
                    visible !important;

                position:
                    static !important;

                transform:
                    none !important;

            }


            .report-section {

                width:
                    100% !important;

                height:
                    auto !important;

                min-height:
                    0 !important;

                max-height:
                    none !important;

                overflow:
                    visible !important;

                position:
                    static !important;

                transform:
                    none !important;

                break-inside:
                    auto !important;

                page-break-inside:
                    auto !important;

            }


            .table-wrapper {

                width:
                    100% !important;

                height:
                    auto !important;

                min-height:
                    0 !important;

                max-height:
                    none !important;

                overflow:
                    visible !important;

                position:
                    static !important;

            }


            .report-table {

                width:
                    100% !important;

                max-width:
                    100% !important;

                min-width:
                    0 !important;

                table-layout:
                    fixed !important;

                border-collapse:
                    collapse !important;

                page-break-inside:
                    auto !important;

                break-inside:
                    auto !important;

            }


            .report-table.print-all-records
            tbody tr {

                display:
                    table-row !important;

            }


            .report-table thead {

                display:
                    table-header-group !important;

            }


            .report-table tbody {

                display:
                    table-row-group !important;

            }


            .report-table tr {

                page-break-inside:
                    avoid !important;

                break-inside:
                    avoid !important;

            }


            .report-table th,
            .report-table td {

                white-space:
                    normal !important;

                overflow-wrap:
                    anywhere !important;

                word-break:
                    break-word !important;

            }


            img {

                max-width:
                    100% !important;

                height:
                    auto !important;

            }


            .reports-page-header,
            .reports-toolbar,
            .reports-filters,
            .report-actions,
            .filter-section,
            .action-section,
            .print-record-selector,
            button {

                display:
                    none !important;

            }


            [style*="display: none"] {

                display:
                    none !important;

            }


            div,
            section,
            article,
            main {

                max-height:
                    none;

            }


            @media print {

                html,
                body {

                    width:
                        100% !important;

                    height:
                        auto !important;

                    max-height:
                        none !important;

                    overflow:
                        visible !important;

                }


                .reports-page,
                #printableReport,
                .report-section,
                .table-wrapper {

                    height:
                        auto !important;

                    max-height:
                        none !important;

                    overflow:
                        visible !important;

                }


                .report-table.print-all-records
                tbody tr {

                    display:
                        table-row !important;

                }

            }

        </style>

    `;


    printWindow.document.open();


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>
                HYDROSMART Report
            </title>

            ${styles}

            ${printStyles}

        </head>


        <body>

            <div class="reports-page">

                ${clonedReport.outerHTML}

            </div>

        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.addEventListener(
        "load",
        async () => {

            try {

                if (
                    printWindow.document.fonts &&
                    printWindow.document.fonts.ready
                ) {

                    await
                        printWindow.document.fonts.ready;

                }


                const images =
                    Array.from(
                        printWindow.document.images
                    );


                await Promise.all(

                    images.map(
                        image => {

                            if (
                                image.complete
                            ) {

                                return Promise.resolve();

                            }


                            return new Promise(
                                resolve => {

                                    image.onload =
                                        resolve;

                                    image.onerror =
                                        resolve;

                                }
                            );

                        }
                    )

                );


                setTimeout(
                    () => {

                        printWindow.focus();

                        printWindow.print();

                    },
                    500
                );

            }

            catch (error) {

                console.error(
                    "HYDROSMART Print Error:",
                    error
                );


                printWindow.focus();

                printWindow.print();

            }

        }
    );


    printWindow.addEventListener(
        "afterprint",
        () => {

            setTimeout(
                () => {

                    printWindow.close();


                    generateReport(
                        SCREEN_RECORD_LIMIT
                    );

                },
                300
            );

        }
    );

}


/* =========================================================
   PRINT
========================================================= */

function printReport() {

    openStandalonePrintWindow();

}


/* =========================================================
   SAVE PDF
========================================================= */

function savePdf() {

    openStandalonePrintWindow();

}


/* =========================================================
   CSV ESCAPE
========================================================= */

function csvEscape(value) {

    const string =
        String(
            value ?? ""
        );


    return `"${string.replace(
        /"/g,
        '""'
    )}"`;

}


/* =========================================================
   EXPORT CSV
========================================================= */

function exportExcel() {

    const filteredSensors =
        filterByDate(
            sensorRecords
        );


    const filteredDosing =
        filterByDate(
            dosingRecords
        );


    const filteredAlerts =
        filterByDate(
            alertRecords
        );


    let csv =
        "";


    /* =========================================
       SENSOR RECORDS
    ========================================== */

    csv +=
        "SENSOR RECORDS\n";


    csv +=
        "Date,Time,Sensor,Reading,Status\n";


    const sensorRows =
        flattenSensorRecords(
            filteredSensors
        );


    sensorRows.forEach(
        record => {

            const status =
                getSensorStatus(
                    record.sensor,
                    record.rawValue
                );


            csv +=

                csvEscape(
                    record.date
                ) + "," +

                csvEscape(
                    record.time
                ) + "," +

                csvEscape(
                    record.sensor
                ) + "," +

                csvEscape(
                    record.reading
                ) + "," +

                csvEscape(
                    status.text
                ) +

                "\n";

        }
    );


    csv +=
        "\n";


    /* =========================================
       DOSING RECORDS
    ========================================== */

    csv +=
        "DOSING RECORDS\n";


    csv +=
        "Date,Time,Pump,Mode,Reason,Duration,Result\n";


    filteredDosing.forEach(
        record => {

            csv +=

                csvEscape(
                    record.date
                ) + "," +

                csvEscape(
                    record.time
                ) + "," +

                csvEscape(
                    record.pump
                ) + "," +

                csvEscape(
                    record.mode
                ) + "," +

                csvEscape(
                    record.reason
                ) + "," +

                csvEscape(
                    record.duration
                ) + "," +

                csvEscape(
                    record.result
                ) +

                "\n";

        }
    );


    csv +=
        "\n";


    /* =========================================
       ALERT RECORDS
    ========================================== */

    csv +=
        "ALERT RECORDS\n";


    csv +=
        "Date,Time,Alert,Value,Severity,Action Taken,Result\n";


    filteredAlerts.forEach(
        record => {

            csv +=

                csvEscape(
                    record.date
                ) + "," +

                csvEscape(
                    record.time
                ) + "," +

                csvEscape(
                    record.alert
                ) + "," +

                csvEscape(
                    record.value
                ) + "," +

                csvEscape(
                    record.severity
                ) + "," +

                csvEscape(
                    record.action
                ) + "," +

                csvEscape(
                    record.result
                ) +

                "\n";

        }
    );


    /* =========================================
       DOWNLOAD
    ========================================== */

    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `hydrosmart-report-${getToday()}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   GENERATED DATE
========================================================= */

function setGeneratedDate() {

    const element =
        document.getElementById(
            "generatedDate"
        );


    if (!element) {

        return;

    }


    const now =
        new Date();


    element.textContent =
        now.toLocaleString(
            "en-US",
            {

                dateStyle:
                    "medium",

                timeStyle:
                    "short"

            }
        );

}


/* =========================================================
   FIREBASE CONNECTION
========================================================= */

async function initializeFirebaseReports() {

    try {

        /*
           Wait for Firebase authentication.
        */

        await firebaseLogin;


        firebaseReady =
            true;


        console.log(
            "HYDROSMART Reports: Firebase connected."
        );


        listenToSensors();

        listenToDosingLogs();

        listenToAlerts();


        generateReport(
            SCREEN_RECORD_LIMIT
        );

    }

    catch (error) {

        console.error(
            "HYDROSMART Reports: Firebase connection failed.",
            error
        );


        firebaseReady =
            false;


        const sensorBody =
            document.getElementById(
                "sensorRecordsBody"
            );


        if (sensorBody) {

            sensorBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty-record"
                    >

                        Unable to connect to Firebase.

                    </td>

                </tr>

            `;

        }

    }

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =========================================
           START REPORTS SKELETON
           UI ONLY
        ========================================== */

        document.body.classList.add(
            "reports-page-loading"
        );


        /*
           Skeleton automatically disappears
           after 1500ms.

           This timer is independent from
           Firebase/report functionality.
        */

        setTimeout(
            hideReportsSkeleton,
            REPORTS_SKELETON_DURATION
        );


        const today =
            getToday();


        /* =========================================
           DEFAULT DATE
        ========================================== */

        if (fromDate) {

            fromDate.value =
                today;

        }


        if (toDate) {

            toDate.value =
                today;

        }


        /* =========================================
           PRINT RECORD DEFAULT
        ========================================== */

        if (printRecordCount) {

            printRecordCount.value =
                "5";

        }


        printRecordLimit =
            5;


        /* =========================================
           INITIAL UI
        ========================================== */

        setGeneratedDate();

        updateSections();

        applyTableDisplayClasses();


        /* =========================================
           GENERATE REPORT
        ========================================== */

        if (generateButton) {

            generateButton.addEventListener(
                "click",
                () => {

                    generateReport(
                        SCREEN_RECORD_LIMIT
                    );

                }
            );

        }


        /* =========================================
           PRINT
        ========================================== */

        if (printButton) {

            printButton.addEventListener(
                "click",
                printReport
            );

        }


        /* =========================================
           PDF
        ========================================== */

        if (pdfButton) {

            pdfButton.addEventListener(
                "click",
                savePdf
            );

        }


        /* =========================================
           CSV / EXCEL
        ========================================== */

        if (excelButton) {

            excelButton.addEventListener(
                "click",
                exportExcel
            );

        }


        /* =========================================
           PRINT RECORD COUNT
        ========================================== */

        if (printRecordCount) {

            printRecordCount.addEventListener(
                "change",
                () => {

                    printRecordLimit =
                        getSelectedPrintLimit();

                }
            );

        }


        /* =========================================
           REPORT TYPE
        ========================================== */

        if (reportType) {

            reportType.addEventListener(
                "change",
                () => {

                    updateSections();

                }
            );

        }


        /* =========================================
           FROM DATE
        ========================================== */

        if (fromDate) {

            fromDate.addEventListener(
                "change",
                () => {

                    generateReport(
                        SCREEN_RECORD_LIMIT
                    );

                }
            );

        }


        /* =========================================
           TO DATE
        ========================================== */

        if (toDate) {

            toDate.addEventListener(
                "change",
                () => {

                    generateReport(
                        SCREEN_RECORD_LIMIT
                    );

                }
            );

        }


        /* =========================================
           FIREBASE
        ========================================== */

        initializeFirebaseReports();

    }
);
