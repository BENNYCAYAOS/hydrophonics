// =========================================================
// HYDROSMART - SYSTEM STATUS
// FIREBASE LIVE SYSTEM MONITORING
// =========================================================
//
// CURRENT FIREBASE SOURCES
//
// SENSORS
// /sensors/ph
// /sensors/ec
// /sensors/water_temperature
// /sensors/waterLevel
//
// CONTROL
// /control/dosingMode
// /control/pumps/nutrientA
// /control/pumps/nutrientB
// /control/pumps/phDown
//
// FIREBASE CONNECTION
// /.info/connected
//
// MAIN TANK
// /mainTank/floatSwitch
// /mainTank/criticalCondition
// /mainTank/waterCondition
// /mainTank/waterLevelStatus
// /mainTank/online
//
// DEVICE RESOURCE ONLINE INDICATOR
// ONLINE  = BLUE
// OFFLINE = GRAY
//
// NOTE
// Battery / Solar monitoring is NOT included because the
// current ESP32 does not upload battery/solar telemetry.
//
// =========================================================


import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    database,
    firebaseLogin
} from "./firebase.js";


// =========================================================
// START
// =========================================================

console.log("=================================");
console.log("HYDROSMART SYSTEM STATUS");
console.log("Firebase monitoring starting...");
console.log("=================================");


// =========================================================
// HELPERS
// =========================================================

const el = (id) => document.getElementById(id);


// =========================================================
// CURRENT SENSOR VALUES
// =========================================================

let currentPH = null;
let currentEC = null;
let currentTemperature = null;
let currentWaterLevel = null;


// =========================================================
// CURRENT PUMP VALUES
// =========================================================

let nutrientA = false;
let nutrientB = false;
let phDown = false;


// =========================================================
// CURRENT DOSING MODE
// =========================================================

let currentDosingMode = "manual";


// =========================================================
// LAST SENSOR UPDATE
// =========================================================

let lastSensorUpdate = null;


// =========================================================
// SENSOR UPDATE FLAGS
// =========================================================

let phReceived = false;
let ecReceived = false;
let temperatureReceived = false;
let waterLevelReceived = false;


// =========================================================
// FIREBASE CONNECTION
// =========================================================

let firebaseConnected = false;


// =========================================================
// MAIN TANK
// =========================================================

let mainTankReceived = false;
let mainTankOnline = false;
let mainTankCritical = false;
let mainTankFloatSwitch = "--";


// =========================================================
// ELEMENTS
// =========================================================

// HEADER

const overallStatusElement =
    el("overallStatus");


// CONNECTIVITY

const espStatusBadge =
    el("espStatusBadge");

const esp32Status =
    el("esp32Status");

const wifiStatus =
    el("wifiStatus");

const firebaseStatus =
    el("firebaseStatus");

const lastSync =
    el("lastSync");


// SENSOR HEALTH

const phHealthBadge =
    el("phHealthBadge");

const ecHealthBadge =
    el("ecHealthBadge");

const temperatureHealthBadge =
    el("temperatureHealthBadge");

const levelHealthBadge =
    el("levelHealthBadge");


const phSensorValue =
    el("phSensorValue");

const ecSensorValue =
    el("ecSensorValue");

const temperatureSensorValue =
    el("temperatureSensorValue");

const waterLevelSensorValue =
    el("waterLevelSensorValue");


// DOSING

const nutrientAStatus =
    el("nutrientAStatus");

const nutrientAIndicator =
    el("nutrientAIndicator");

const nutrientBStatus =
    el("nutrientBStatus");

const nutrientBIndicator =
    el("nutrientBIndicator");

const phDownStatus =
    el("phDownStatus");

const phDownIndicator =
    el("phDownIndicator");


const dosingModeBadge =
    el("dosingModeBadge");

const currentDosingModeElement =
    el("currentDosingMode");

const automaticDosingStatus =
    el("automaticDosingStatus");

const activePumpCount =
    el("activePumpCount");


// TANK

const floatSwitchStatus =
    el("floatSwitchStatus");

const tankStatusBadge =
    el("tankStatusBadge");


// DEVICE RESOURCES

const sensorMonitoringStatus =
    el("sensorMonitoringStatus");

const devicePumpStatus =
    el("devicePumpStatus");

const deviceTankStatus =
    el("deviceTankStatus");


// SYSTEM OVERVIEW

const systemMode =
    el("systemMode");

const waterCondition =
    el("waterCondition");

const autoDosingSummary =
    el("autoDosingSummary");

const overallHealth =
    el("overallHealth");


// =========================================================
// THRESHOLDS
// SAME LOGIC USED BY ALERTS
// =========================================================

const PH_MIN = 5.5;
const PH_MAX = 6.5;

const EC_MIN = 1700;
const EC_MAX = 2000;

const TEMP_MIN = 18;
const TEMP_MAX = 26;

const WATER_CRITICAL = 30;
const WATER_WARNING = 60;


// =========================================================
// DEVICE RESOURCE BLUE
// =========================================================

const ONLINE_BLUE = "#2563eb";
const ONLINE_BLUE_BG = "#eff6ff";
const ONLINE_BLUE_BORDER = "#bfdbfe";

const OFFLINE_GRAY = "#64748b";


// =========================================================
// FIND RESOURCE CONTAINER
// =========================================================

function findResourceContainer(
    statusElement
) {

    if (!statusElement) {
        return null;
    }


    // Try the most likely container classes first

    const selectors = [
        ".device-resource-item",
        ".device-resource-card",
        ".resource-item",
        ".resource-card",
        ".device-resource"
    ];


    for (
        const selector of selectors
    ) {

        const container =
            statusElement.closest(
                selector
            );


        if (container) {

            return container;

        }

    }


    // Fallback:
    // search a few parent levels

    let parent =
        statusElement.parentElement;


    for (
        let i = 0;
        i < 4 && parent;
        i++
    ) {

        const icon =
            parent.querySelector(
                "i, svg, .resource-icon, .device-resource-icon"
            );


        if (icon) {

            return parent;

        }


        parent =
            parent.parentElement;

    }


    return null;
}


// =========================================================
// FIND RESOURCE ICON
// =========================================================

function findResourceIcon(
    container
) {

    if (!container) {
        return null;
    }


    return container.querySelector(
        "i, svg, .resource-icon, .device-resource-icon"
    );

}


// =========================================================
// SET RESOURCE ICON ONLINE
// =========================================================

function setResourceIconState(
    statusElement,
    online
) {

    if (!statusElement) {
        return;
    }


    const container =
        findResourceContainer(
            statusElement
        );


    if (!container) {
        return;
    }


    const icon =
        findResourceIcon(
            container
        );


    if (!icon) {
        return;
    }


    // Remove previous state classes

    icon.classList.remove(
        "online",
        "offline",
        "active",
        "connected"
    );


    if (online) {

        // =========================================
        // BLUE ONLINE
        // =========================================

        icon.classList.add(
            "online"
        );


        icon.style.color =
            ONLINE_BLUE;

        icon.style.backgroundColor =
            ONLINE_BLUE_BG;

        icon.style.borderColor =
            ONLINE_BLUE_BORDER;

        icon.style.transition =
            "all 0.25s ease";


        // SVG support

        if (
            icon.tagName &&
            icon.tagName.toLowerCase() === "svg"
        ) {

            icon.style.fill =
                ONLINE_BLUE;

            icon.style.stroke =
                ONLINE_BLUE;

        }


        // Child SVG support

        const svg =
            icon.querySelector(
                "svg"
            );


        if (svg) {

            svg.style.color =
                ONLINE_BLUE;

            svg.style.fill =
                ONLINE_BLUE;

            svg.style.stroke =
                ONLINE_BLUE;

        }


        // Child icon support

        const iconChild =
            icon.querySelector(
                "i"
            );


        if (iconChild) {

            iconChild.style.color =
                ONLINE_BLUE;

        }

    }
    else {

        // =========================================
        // OFFLINE / WAITING
        // =========================================

        icon.classList.add(
            "offline"
        );


        icon.style.color =
            OFFLINE_GRAY;


        icon.style.transition =
            "all 0.25s ease";


        if (
            icon.tagName &&
            icon.tagName.toLowerCase() === "svg"
        ) {

            icon.style.fill =
                OFFLINE_GRAY;

            icon.style.stroke =
                OFFLINE_GRAY;

        }


        const svg =
            icon.querySelector(
                "svg"
            );


        if (svg) {

            svg.style.color =
                OFFLINE_GRAY;

            svg.style.fill =
                OFFLINE_GRAY;

            svg.style.stroke =
                OFFLINE_GRAY;

        }


        const iconChild =
            icon.querySelector(
                "i"
            );


        if (iconChild) {

            iconChild.style.color =
                OFFLINE_GRAY;

        }

    }

}


// =========================================================
// BADGE HELPER
// =========================================================

function setBadge(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.classList.remove(
        "connecting",
        "online",
        "warning",
        "danger",
        "manual",
        "automatic"
    );


    if (type) {

        element.classList.add(
            type
        );

    }

}


// =========================================================
// OVERALL HEADER STATUS
// =========================================================

function updateOverallStatus(
    status
) {

    if (!overallStatusElement) {
        return;
    }


    const dot =
        overallStatusElement.querySelector(
            ".system-live-dot"
        );


    const text =
        overallStatusElement.querySelector(
            "span:last-child"
        );


    if (status === "online") {

        if (text) {

            text.textContent =
                "SYSTEM ONLINE";

        }


        if (dot) {

            dot.style.background =
                "#22c55e";

        }


        return;

    }


    if (status === "warning") {

        if (text) {

            text.textContent =
                "SYSTEM WARNING";

        }


        if (dot) {

            dot.style.background =
                "#f59e0b";

        }


        return;

    }


    if (text) {

        text.textContent =
            "SYSTEM CHECKING";

    }


    if (dot) {

        dot.style.background =
            "#94a3b8";

    }

}


// =========================================================
// PUMP STATUS
// =========================================================

function setPumpStatus(
    id,
    isOn
) {

    const statusElement =
        el(`${id}Status`);

    const indicatorElement =
        el(`${id}Indicator`);


    if (statusElement) {

        statusElement.textContent =
            isOn
                ? "ON"
                : "OFF";

    }


    if (indicatorElement) {

        indicatorElement.classList.toggle(
            "on",
            isOn
        );

        indicatorElement.classList.toggle(
            "off",
            !isOn
        );

    }

}


// =========================================================
// PUMP COUNT
// =========================================================

function updateActivePumpCount() {

    const count =
        [
            nutrientA,
            nutrientB,
            phDown
        ]
        .filter(Boolean)
        .length;


    if (activePumpCount) {

        activePumpCount.textContent =
            count;

    }


    return count;

}


// =========================================================
// DEVICE RESOURCES
// =========================================================

function updateDeviceResources() {

    const sensorCount =
        [
            phReceived,
            ecReceived,
            temperatureReceived,
            waterLevelReceived
        ]
        .filter(Boolean)
        .length;


    const pumpCount =
        [
            nutrientA,
            nutrientB,
            phDown
        ]
        .filter(Boolean)
        .length;


    // =====================================================
    // SENSOR MONITORING
    // =====================================================

    if (sensorMonitoringStatus) {

        if (
            firebaseConnected &&
            sensorCount === 4
        ) {

            sensorMonitoringStatus.textContent =
                "4/4 Active";

        }
        else if (
            firebaseConnected &&
            sensorCount > 0
        ) {

            sensorMonitoringStatus.textContent =
                `${sensorCount}/4 Active`;

        }
        else if (
            firebaseConnected
        ) {

            sensorMonitoringStatus.textContent =
                "Online";

        }
        else {

            sensorMonitoringStatus.textContent =
                "Waiting";

        }


        sensorMonitoringStatus.style.color =
            firebaseConnected
                ? ONLINE_BLUE
                : OFFLINE_GRAY;

    }


    // =====================================================
    // DOSING PUMPS
    // =====================================================

    if (devicePumpStatus) {

        if (!firebaseConnected) {

            devicePumpStatus.textContent =
                "Offline";

        }
        else if (pumpCount === 0) {

            devicePumpStatus.textContent =
                "0 Active";

        }
        else {

            devicePumpStatus.textContent =
                `${pumpCount} Active`;

        }


        devicePumpStatus.style.color =
            firebaseConnected
                ? ONLINE_BLUE
                : OFFLINE_GRAY;

    }


    // =====================================================
    // MAIN TANK
    // =====================================================

    if (deviceTankStatus) {

        if (!firebaseConnected) {

            deviceTankStatus.textContent =
                "Offline";

        }
        else if (
            mainTankReceived &&
            mainTankOnline
        ) {

            deviceTankStatus.textContent =
                "Online";

        }
        else if (
            mainTankReceived
        ) {

            deviceTankStatus.textContent =
                "Monitoring";

        }
        else {

            deviceTankStatus.textContent =
                "Waiting";

        }


        deviceTankStatus.style.color =
            firebaseConnected
                ? ONLINE_BLUE
                : OFFLINE_GRAY;

    }


    // =====================================================
    // BLUE ICONS
    // =====================================================

    setResourceIconState(
        sensorMonitoringStatus,
        firebaseConnected
    );


    setResourceIconState(
        devicePumpStatus,
        firebaseConnected
    );


    setResourceIconState(
        deviceTankStatus,
        firebaseConnected
    );

}


// =========================================================
// PUMP UI
// =========================================================

function updateAllPumpStatus() {

    setPumpStatus(
        "nutrientA",
        nutrientA
    );


    setPumpStatus(
        "nutrientB",
        nutrientB
    );


    setPumpStatus(
        "phDown",
        phDown
    );


    updateActivePumpCount();

    updateAutomaticDosingStatus();

    updateDeviceResources();

}


// =========================================================
// AUTOMATIC DOSING STATUS
// =========================================================

function updateAutomaticDosingStatus() {

    const activeCount =
        [
            nutrientA,
            nutrientB,
            phDown
        ]
        .filter(Boolean)
        .length;


    if (
        currentDosingMode ===
        "automatic"
    ) {

        if (activeCount > 0) {

            if (automaticDosingStatus) {

                automaticDosingStatus.textContent =
                    "ACTIVE";

            }


            if (autoDosingSummary) {

                autoDosingSummary.textContent =
                    "Active";

            }

        }
        else {

            if (automaticDosingStatus) {

                automaticDosingStatus.textContent =
                    "INACTIVE";

            }


            if (autoDosingSummary) {

                autoDosingSummary.textContent =
                    "Inactive";

            }

        }


        return;

    }


    if (automaticDosingStatus) {

        automaticDosingStatus.textContent =
            "INACTIVE";

    }


    if (autoDosingSummary) {

        autoDosingSummary.textContent =
            "Inactive";

    }

}


// =========================================================
// pH SEVERITY
// =========================================================
//
// 0 = Normal
// 1 = Warning
// 2 = Critical
//
// =========================================================

function getPHSeverity(
    value
) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return 2;

    }


    if (
        value < 5.0 ||
        value > 7.0
    ) {

        return 2;

    }


    if (
        (
            value >= 5.0 &&
            value < PH_MIN
        )
        ||
        (
            value > PH_MAX &&
            value <= 7.0
        )
    ) {

        return 1;

    }


    return 0;

}


// =========================================================
// EC SEVERITY
// =========================================================

function getECSeverity(
    value
) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return 2;

    }


    if (
        value > EC_MAX
    ) {

        return 2;

    }


    if (
        value < EC_MIN
    ) {

        return 1;

    }


    return 0;

}


// =========================================================
// TEMPERATURE SEVERITY
// =========================================================

function getTemperatureSeverity(
    value
) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return 2;

    }


    if (
        value < 16 ||
        value > 28
    ) {

        return 2;

    }


    if (
        (
            value >= 16 &&
            value < TEMP_MIN
        )
        ||
        (
            value > TEMP_MAX &&
            value <= 28
        )
    ) {

        return 1;

    }


    return 0;

}


// =========================================================
// WATER LEVEL SEVERITY
// =========================================================

function getWaterLevelSeverity(
    value
) {

    if (
        value === null ||
        !Number.isFinite(value)
    ) {

        return 2;

    }


    if (
        value <= WATER_CRITICAL
    ) {

        return 2;

    }


    if (
        value < WATER_WARNING
    ) {

        return 1;

    }


    return 0;

}


// =========================================================
// SENSOR BADGE
// =========================================================

function applySensorBadge(
    element,
    severity
) {

    if (!element) {
        return;
    }


    if (severity === 0) {

        setBadge(
            element,
            "Normal",
            "online"
        );

        return;

    }


    if (severity === 1) {

        setBadge(
            element,
            "Warning",
            "warning"
        );

        return;

    }


    setBadge(
        element,
        "Critical",
        "danger"
    );

}


// =========================================================
// UPDATE SENSOR HEALTH
// =========================================================

function updateSensorHealth() {

    // =====================================================
    // pH
    // =====================================================

    if (
        currentPH !== null
    ) {

        if (phSensorValue) {

            phSensorValue.textContent =
                currentPH.toFixed(2);

        }


        applySensorBadge(
            phHealthBadge,
            getPHSeverity(
                currentPH
            )
        );

    }
    else {

        if (phSensorValue) {

            phSensorValue.textContent =
                "--";

        }


        setBadge(
            phHealthBadge,
            "No Data",
            "connecting"
        );

    }


    // =====================================================
    // EC
    // =====================================================

    if (
        currentEC !== null
    ) {

        if (ecSensorValue) {

            ecSensorValue.textContent =
                Math.round(
                    currentEC
                )
                .toLocaleString()
                + " µS/cm";

        }


        applySensorBadge(
            ecHealthBadge,
            getECSeverity(
                currentEC
            )
        );

    }
    else {

        if (ecSensorValue) {

            ecSensorValue.textContent =
                "--";

        }


        setBadge(
            ecHealthBadge,
            "No Data",
            "connecting"
        );

    }


    // =====================================================
    // TEMPERATURE
    // =====================================================

    if (
        currentTemperature !== null
    ) {

        if (temperatureSensorValue) {

            temperatureSensorValue.textContent =
                currentTemperature.toFixed(1)
                + " °C";

        }


        applySensorBadge(
            temperatureHealthBadge,
            getTemperatureSeverity(
                currentTemperature
            )
        );

    }
    else {

        if (temperatureSensorValue) {

            temperatureSensorValue.textContent =
                "--";

        }


        setBadge(
            temperatureHealthBadge,
            "No Data",
            "connecting"
        );

    }


    // =====================================================
    // WATER LEVEL
    // =====================================================

    if (
        currentWaterLevel !== null
    ) {

        if (waterLevelSensorValue) {

            waterLevelSensorValue.textContent =
                Number(
                    currentWaterLevel
                ).toFixed(1)
                + "%";

        }


        applySensorBadge(
            levelHealthBadge,
            getWaterLevelSeverity(
                currentWaterLevel
            )
        );

    }
    else {

        if (waterLevelSensorValue) {

            waterLevelSensorValue.textContent =
                "--";

        }


        setBadge(
            levelHealthBadge,
            "No Data",
            "connecting"
        );

    }


    updateWaterCondition();

    updateOverallHealth();

    updateDeviceResources();

}


// =========================================================
// WATER CONDITION
// =========================================================

function updateWaterCondition() {

    if (
        currentEC === null ||
        currentPH === null
    ) {

        if (waterCondition) {

            waterCondition.textContent =
                "Checking...";

        }

        return;

    }


    const ecNormal =
        currentEC >= EC_MIN &&
        currentEC <= EC_MAX;


    const phNormal =
        currentPH >= PH_MIN &&
        currentPH <= PH_MAX;


    if (
        ecNormal &&
        phNormal
    ) {

        if (waterCondition) {

            waterCondition.textContent =
                "Balanced";

        }

        return;

    }


    if (waterCondition) {

        waterCondition.textContent =
            "Needs Attention";

    }

}


// =========================================================
// OVERALL HEALTH
// =========================================================

function updateOverallHealth() {

    const severities = [

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


    const hasAnySensor =
        currentPH !== null ||
        currentEC !== null ||
        currentTemperature !== null ||
        currentWaterLevel !== null;


    if (!hasAnySensor) {

        if (overallHealth) {

            overallHealth.textContent =
                "Checking...";

        }


        updateOverallStatus(
            "warning"
        );

        return;

    }


    const worstSeverity =
        Math.max(
            ...severities
        );


    if (
        worstSeverity === 0
    ) {

        if (overallHealth) {

            overallHealth.textContent =
                "Healthy";

        }


        updateOverallStatus(
            "online"
        );

        return;

    }


    if (
        worstSeverity === 1
    ) {

        if (overallHealth) {

            overallHealth.textContent =
                "Warning";

        }


        updateOverallStatus(
            "warning"
        );

        return;

    }


    if (overallHealth) {

        overallHealth.textContent =
            "Critical";

    }


    updateOverallStatus(
        "warning"
    );

}


// =========================================================
// DOSING MODE UI
// =========================================================

function updateDosingModeUI() {

    const automatic =
        String(
            currentDosingMode
        ).toLowerCase() ===
        "automatic";


    if (automatic) {

        if (currentDosingModeElement) {

            currentDosingModeElement.textContent =
                "Automatic";

        }


        if (systemMode) {

            systemMode.textContent =
                "Automatic";

        }


        setBadge(
            dosingModeBadge,
            "Automatic Mode",
            "automatic"
        );


        updateAutomaticDosingStatus();

        return;

    }


    if (currentDosingModeElement) {

        currentDosingModeElement.textContent =
            "Manual";

    }


    if (systemMode) {

        systemMode.textContent =
            "Manual";

    }


    setBadge(
        dosingModeBadge,
        "Manual Mode",
        "manual"
    );


    updateAutomaticDosingStatus();

}


// =========================================================
// TANK STATUS
// =========================================================

function updateTankStatus() {

    if (floatSwitchStatus) {

        if (mainTankReceived) {

            floatSwitchStatus.textContent =
                mainTankFloatSwitch;

        }
        else {

            floatSwitchStatus.textContent =
                "Ultrasonic";

        }

    }


    // =====================================================
    // MAIN TANK HAS FLOAT DATA
    // =====================================================

    if (mainTankReceived) {

        if (
            mainTankCritical
        ) {

            setBadge(
                tankStatusBadge,
                "Critical Level",
                "danger"
            );

        }
        else {

            setBadge(
                tankStatusBadge,
                "Safe Level",
                "online"
            );

        }


        return;

    }


    // =====================================================
    // FALLBACK TO ULTRASONIC
    // =====================================================

    if (
        currentWaterLevel === null
    ) {

        setBadge(
            tankStatusBadge,
            "Checking...",
            "connecting"
        );

        return;

    }


    const severity =
        getWaterLevelSeverity(
            currentWaterLevel
        );


    if (
        severity === 2
    ) {

        setBadge(
            tankStatusBadge,
            "Critical Level",
            "danger"
        );

        return;

    }


    if (
        severity === 1
    ) {

        setBadge(
            tankStatusBadge,
            "Low Level",
            "warning"
        );

        return;

    }


    setBadge(
        tankStatusBadge,
        "Safe Level",
        "online"
    );

}


// =========================================================
// LAST SYNC
// =========================================================

function updateLastSync() {

    lastSensorUpdate =
        new Date();


    if (!lastSync) {
        return;
    }


    lastSync.textContent =
        lastSensorUpdate.toLocaleTimeString(
            "en-PH",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );

}


// =========================================================
// CONNECTIVITY STATUS
// =========================================================
//
// Firebase connection is the primary online state.
//
// Main Tank / ESP32 online telemetry is also read from
// /mainTank/online.
//
// =========================================================

function updateConnectivityStatus() {

    const sensorDataReceived =
        phReceived ||
        ecReceived ||
        temperatureReceived ||
        waterLevelReceived;


    // =====================================================
    // FIREBASE
    // =====================================================

    if (firebaseConnected) {

        if (firebaseStatus) {

            firebaseStatus.textContent =
                "Connected";

        }

    }
    else {

        if (firebaseStatus) {

            firebaseStatus.textContent =
                "Disconnected";

        }

    }


    // =====================================================
    // ESP32
    // =====================================================

    if (
        mainTankOnline ||
        sensorDataReceived
    ) {

        if (esp32Status) {

            esp32Status.textContent =
                "Online";

        }


        if (wifiStatus) {

            wifiStatus.textContent =
                "Connected";

        }


        setBadge(
            espStatusBadge,
            "Online",
            "online"
        );

    }
    else if (
        firebaseConnected
    ) {

        if (esp32Status) {

            esp32Status.textContent =
                "Waiting";

        }


        if (wifiStatus) {

            wifiStatus.textContent =
                "Connected";

        }


        setBadge(
            espStatusBadge,
            "Waiting",
            "connecting"
        );

    }
    else {

        if (esp32Status) {

            esp32Status.textContent =
                "Waiting";

        }


        if (wifiStatus) {

            wifiStatus.textContent =
                "Waiting";

        }


        setBadge(
            espStatusBadge,
            "Connecting...",
            "connecting"
        );

    }


    // =====================================================
    // DEVICE RESOURCE ICONS
    // =====================================================

    updateDeviceResources();

}


// =========================================================
// MARK FIREBASE CONNECTED
// =========================================================

function markFirebaseConnected() {

    firebaseConnected =
        true;


    updateConnectivityStatus();

}


// =========================================================
// VALUE EXTRACTION
// =========================================================

function extractSensorValue(
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

        return Number.isFinite(data)
            ? data
            : null;

    }


    if (
        typeof data === "string"
    ) {

        const number =
            Number(data);


        return Number.isFinite(number)
            ? number
            : null;

    }


    if (
        typeof data !== "object"
    ) {

        return null;

    }


    const possibleKeys = [

        "value",
        "reading",
        "val",

        ...keys

    ];


    for (
        const key of possibleKeys
    ) {

        if (
            data[key] !== undefined &&
            data[key] !== null
        ) {

            const number =
                Number(
                    data[key]
                );


            if (
                Number.isFinite(number)
            ) {

                return number;

            }

        }

    }


    return null;

}


// =========================================================
// SENSOR UPDATE HANDLER
// =========================================================

function processSensorUpdate() {

    updateLastSync();

    updateSensorHealth();

    updateTankStatus();

    updateDeviceResources();

    markFirebaseConnected();

    updateConnectivityStatus();

}


// =========================================================
// MAIN TANK UPDATE HANDLER
// =========================================================

function processMainTankUpdate(
    data
) {

    if (!data) {

        mainTankReceived =
            false;

        mainTankOnline =
            false;

        mainTankCritical =
            false;

        mainTankFloatSwitch =
            "--";

        updateTankStatus();

        updateDeviceResources();

        return;

    }


    mainTankReceived =
        true;


    // =====================================================
    // MAIN TANK ONLINE
    // =====================================================

    mainTankOnline =
        data.online === true;


    // =====================================================
    // CRITICAL CONDITION
    // =====================================================

    mainTankCritical =
        data.criticalCondition === true;


    // =====================================================
    // FLOAT SWITCH
    // =====================================================

    mainTankFloatSwitch =
        data.floatSwitch ??
        "--";


    // =====================================================
    // UPDATE
    // =====================================================

    updateTankStatus();

    updateDeviceResources();

    updateConnectivityStatus();

}


// =========================================================
// FIREBASE LISTENERS
// =========================================================
//
// Everything starts AFTER Firebase authentication.
//
// =========================================================

function startFirebaseMonitoring() {

    console.log(
        "Starting Firebase listeners..."
    );


    // =====================================================
    // pH
    // =====================================================

    const phReference =
        ref(
            database,
            "sensors/ph"
        );


    onValue(
        phReference,

        (snapshot) => {

            const value =
                extractSensorValue(
                    snapshot.val(),
                    [
                        "ph"
                    ]
                );


            console.log(
                "System Status Firebase pH:",
                value
            );


            if (
                value === null
            ) {

                phReceived =
                    false;

                currentPH =
                    null;

            }
            else {

                phReceived =
                    true;

                currentPH =
                    Math.max(
                        0,
                        Math.min(
                            14,
                            value
                        )
                    );

            }


            processSensorUpdate();

        },

        (error) => {

            console.error(
                "System Status pH error:",
                error
            );


            phReceived =
                false;

            currentPH =
                null;


            updateSensorHealth();

            updateConnectivityStatus();

        }

    );


    // =====================================================
    // EC
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
                extractSensorValue(
                    snapshot.val(),
                    [
                        "ec"
                    ]
                );


            console.log(
                "System Status Firebase EC:",
                value
            );


            if (
                value === null
            ) {

                ecReceived =
                    false;

                currentEC =
                    null;

            }
            else {

                ecReceived =
                    true;

                currentEC =
                    value;

            }


            processSensorUpdate();

        },

        (error) => {

            console.error(
                "System Status EC error:",
                error
            );


            ecReceived =
                false;

            currentEC =
                null;


            updateSensorHealth();

            updateConnectivityStatus();

        }

    );


    // =====================================================
    // WATER TEMPERATURE
    // =====================================================

    const temperatureReference =
        ref(
            database,
            "sensors/water_temperature"
        );


    onValue(
        temperatureReference,

        (snapshot) => {

            const value =
                extractSensorValue(
                    snapshot.val(),
                    [
                        "temperature",
                        "water_temperature",
                        "temp"
                    ]
                );


            console.log(
                "System Status Firebase Temperature:",
                value
            );


            if (
                value === null
            ) {

                temperatureReceived =
                    false;

                currentTemperature =
                    null;

            }
            else {

                temperatureReceived =
                    true;

                currentTemperature =
                    value;

            }


            processSensorUpdate();

        },

        (error) => {

            console.error(
                "System Status Temperature error:",
                error
            );


            temperatureReceived =
                false;

            currentTemperature =
                null;


            updateSensorHealth();

            updateConnectivityStatus();

        }

    );


    // =====================================================
    // WATER LEVEL
    // =====================================================

    const waterLevelReference =
        ref(
            database,
            "sensors/waterLevel"
        );


    onValue(
        waterLevelReference,

        (snapshot) => {

            const value =
                extractSensorValue(
                    snapshot.val(),
                    [
                        "waterLevel",
                        "water_level",
                        "level",
                        "percentage",
                        "percent"
                    ]
                );


            console.log(
                "System Status Firebase Water Level:",
                value
            );


            if (
                value === null
            ) {

                waterLevelReceived =
                    false;

                currentWaterLevel =
                    null;

            }
            else {

                waterLevelReceived =
                    true;

                currentWaterLevel =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            value
                        )
                    );

            }


            processSensorUpdate();

        },

        (error) => {

            console.error(
                "System Status Water Level error:",
                error
            );


            waterLevelReceived =
                false;

            currentWaterLevel =
                null;


            updateSensorHealth();

            updateConnectivityStatus();

        }

    );


    // =====================================================
    // MAIN TANK
    // =====================================================

    const mainTankReference =
        ref(
            database,
            "mainTank"
        );


    onValue(
        mainTankReference,

        (snapshot) => {

            const data =
                snapshot.val();


            console.log(
                "System Status Main Tank:",
                data
            );


            processMainTankUpdate(
                data
            );

        },

        (error) => {

            console.error(
                "Main Tank Firebase error:",
                error
            );


            mainTankReceived =
                false;

            mainTankOnline =
                false;

            mainTankCritical =
                false;

            mainTankFloatSwitch =
                "--";


            updateTankStatus();

            updateDeviceResources();

        }

    );


    // =====================================================
    // NUTRIENT A
    // =====================================================

    const nutrientAReference =
        ref(
            database,
            "control/pumps/nutrientA"
        );


    onValue(
        nutrientAReference,

        (snapshot) => {

            nutrientA =
                snapshot.val() === true;


            console.log(
                "System Status Nutrient A:",
                nutrientA
                    ? "ON"
                    : "OFF"
            );


            updateAllPumpStatus();

        },

        (error) => {

            console.error(
                "Nutrient A Firebase error:",
                error
            );

        }

    );


    // =====================================================
    // NUTRIENT B
    // =====================================================

    const nutrientBReference =
        ref(
            database,
            "control/pumps/nutrientB"
        );


    onValue(
        nutrientBReference,

        (snapshot) => {

            nutrientB =
                snapshot.val() === true;


            console.log(
                "System Status Nutrient B:",
                nutrientB
                    ? "ON"
                    : "OFF"
            );


            updateAllPumpStatus();

        },

        (error) => {

            console.error(
                "Nutrient B Firebase error:",
                error
            );

        }

    );


    // =====================================================
    // PH DOWN
    // =====================================================

    const phDownReference =
        ref(
            database,
            "control/pumps/phDown"
        );


    onValue(
        phDownReference,

        (snapshot) => {

            phDown =
                snapshot.val() === true;


            console.log(
                "System Status pH Down:",
                phDown
                    ? "ON"
                    : "OFF"
            );


            updateAllPumpStatus();

        },

        (error) => {

            console.error(
                "pH Down Firebase error:",
                error
            );

        }

    );


    // =====================================================
    // DOSING MODE
    // =====================================================

    const dosingModeReference =
        ref(
            database,
            "control/dosingMode"
        );


    onValue(
        dosingModeReference,

        (snapshot) => {

            const value =
                snapshot.val();


            if (
                typeof value === "string"
            ) {

                currentDosingMode =
                    value.toLowerCase();

            }
            else {

                currentDosingMode =
                    "manual";

            }


            console.log(
                "System Status Dosing Mode:",
                currentDosingMode
            );


            updateDosingModeUI();

            markFirebaseConnected();

            updateConnectivityStatus();

        },

        (error) => {

            console.error(
                "Dosing mode Firebase error:",
                error
            );

        }

    );


    // =====================================================
    // FIREBASE CONNECTION
    // =====================================================

    const firebaseConnectionReference =
        ref(
            database,
            ".info/connected"
        );


    onValue(
        firebaseConnectionReference,

        (snapshot) => {

            const connected =
                snapshot.val() === true;


            firebaseConnected =
                connected;


            console.log(
                "Firebase realtime connection:",
                connected
                    ? "CONNECTED"
                    : "DISCONNECTED"
            );


            if (firebaseStatus) {

                firebaseStatus.textContent =
                    connected
                        ? "Connected"
                        : "Disconnected";

            }


            updateDeviceResources();

            updateConnectivityStatus();

        },

        (error) => {

            console.error(
                "Firebase connection status error:",
                error
            );

        }

    );


    console.log(
        "Firebase listeners successfully started."
    );

}


// =========================================================
// INITIAL UI
// =========================================================

function initializeUI() {

    // =====================================================
    // SENSOR
    // =====================================================

    if (phSensorValue) {
        phSensorValue.textContent = "--";
    }

    if (ecSensorValue) {
        ecSensorValue.textContent = "--";
    }

    if (temperatureSensorValue) {
        temperatureSensorValue.textContent = "--";
    }

    if (waterLevelSensorValue) {
        waterLevelSensorValue.textContent = "--";
    }


    // =====================================================
    // TANK
    // =====================================================

    if (floatSwitchStatus) {

        floatSwitchStatus.textContent =
            "Waiting";

    }


    // =====================================================
    // DEVICE RESOURCES
    // =====================================================

    if (sensorMonitoringStatus) {

        sensorMonitoringStatus.textContent =
            "Waiting";

    }


    if (devicePumpStatus) {

        devicePumpStatus.textContent =
            "0 Active";

    }


    if (deviceTankStatus) {

        deviceTankStatus.textContent =
            "Waiting";

    }


    // =====================================================
    // CONNECTIVITY
    // =====================================================

    setBadge(
        espStatusBadge,
        "Connecting...",
        "connecting"
    );


    if (esp32Status) {

        esp32Status.textContent =
            "Waiting";

    }


    if (wifiStatus) {

        wifiStatus.textContent =
            "Waiting";

    }


    if (firebaseStatus) {

        firebaseStatus.textContent =
            "Connecting...";

    }


    if (lastSync) {

        lastSync.textContent =
            "--";

    }


    // =====================================================
    // DOSING
    // =====================================================

    updateDosingModeUI();

    updateAllPumpStatus();


    // =====================================================
    // SUMMARY
    // =====================================================

    if (waterCondition) {

        waterCondition.textContent =
            "Checking...";

    }


    if (overallHealth) {

        overallHealth.textContent =
            "Checking...";

    }


    // =====================================================
    // HEADER
    // =====================================================

    updateOverallStatus(
        "warning"
    );


    // =====================================================
    // TANK
    // =====================================================

    updateTankStatus();


    // =====================================================
    // DEVICE RESOURCES
    // =====================================================

    updateDeviceResources();

}


// =========================================================
// START APPLICATION
// =========================================================

initializeUI();


// =========================================================
// FIREBASE AUTHENTICATION
// =========================================================
//
// Wait for Firebase login before starting listeners.
//
// =========================================================

firebaseLogin
    .then(() => {

        console.log(
            "Firebase authentication successful."
        );


        startFirebaseMonitoring();

    })
    .catch((error) => {

        console.error(
            "Firebase authentication failed:",
            error
        );


        if (firebaseStatus) {

            firebaseStatus.textContent =
                "Authentication Failed";

        }


        if (esp32Status) {

            esp32Status.textContent =
                "Unavailable";

        }


        if (wifiStatus) {

            wifiStatus.textContent =
                "Unavailable";

        }


        setBadge(
            espStatusBadge,
            "Connection Failed",
            "danger"
        );


        updateOverallStatus(
            "warning"
        );


        updateDeviceResources();

    });


// =========================================================
// READY
// =========================================================

console.log("=================================");
console.log("HYDROSMART SYSTEM STATUS READY");
console.log("---------------------------------");
console.log("pH: /sensors/ph");
console.log("EC: /sensors/ec");
console.log(
    "Temperature: /sensors/water_temperature"
);
console.log(
    "Water Level: /sensors/waterLevel"
);
console.log(
    "Main Tank: /mainTank"
);
console.log(
    "Nutrient A: /control/pumps/nutrientA"
);
console.log(
    "Nutrient B: /control/pumps/nutrientB"
);
console.log(
    "pH Down: /control/pumps/phDown"
);
console.log(
    "Dosing Mode: /control/dosingMode"
);
console.log(
    "Firebase Connection: /.info/connected"
);
console.log("---------------------------------");
console.log(
    "Device Resources: ONLINE = BLUE"
);
console.log(
    "Main Tank: CONNECTED = BLUE"
);
console.log(
    "System Overview: ENABLED"
);
console.log("=================================");
