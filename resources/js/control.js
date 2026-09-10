// =========================================================
// HYDROSMART CONTROL PANEL
// FIREBASE MONITORING + MANUAL CONTROL + DOSING CALIBRATION
// =========================================================
//
// IMPORTANT:
//
// ESP32 IS THE AUTOMATIC DOSING AUTHORITY.
//
// CONTROL PANEL:
// 1. Displays sensor values
// 2. Changes dosing mode
// 3. Saves dosing calibration
// 4. Controls pumps manually
// 5. Displays pump state from Firebase
//
// AUTOMATIC DOSING IS NOT EXECUTED IN THE BROWSER.
//
// =========================================================


import {
    ref,
    onValue,
    set,
    push,
    get
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


import {
    database
} from "./firebase.js";


// =========================================================
// START
// =========================================================

console.log("=================================");
console.log("HYDROSMART CONTROL PANEL");
console.log("Firebase connection starting...");
console.log("ESP32 AUTOMATIC DOSING AUTHORITY");
console.log("=================================");


// =========================================================
// TARGET VALUES
// =========================================================

const EC_MIN = 1700;
const EC_MAX = 2000;

const PH_MIN = 5.5;
const PH_MAX = 6.5;


// =========================================================
// SENSOR VALUES
// =========================================================

let ec = null;
let ph = null;


// =========================================================
// DOSING MODE
// =========================================================

let dosingMode = "manual";


// =========================================================
// ELEMENTS
// =========================================================

const automaticModeButton =
    document.getElementById(
        "automaticModeButton"
    );


const manualModeButton =
    document.getElementById(
        "manualModeButton"
    );


const automaticInfo =
    document.getElementById(
        "automaticInfo"
    );


const modeStatusText =
    document.getElementById(
        "modeStatusText"
    );


const pumpControlStatus =
    document.getElementById(
        "pumpControlStatus"
    );


const ecValueElement =
    document.getElementById(
        "ecValue"
    );


const phValueElement =
    document.getElementById(
        "phValue"
    );


const statusMsg =
    document.getElementById(
        "statusMsg"
    );


const logsTableBody =
    document.querySelector(
        "#logsTable tbody"
    );


// Calibration elements

const nutrientAFlowInput =
    document.getElementById(
        "nutrientAFlow"
    );


const nutrientADoseInput =
    document.getElementById(
        "nutrientADose"
    );


const nutrientARuntime =
    document.getElementById(
        "nutrientARuntime"
    );


const nutrientBFlowInput =
    document.getElementById(
        "nutrientBFlow"
    );


const nutrientBDoseInput =
    document.getElementById(
        "nutrientBDose"
    );


const nutrientBRuntime =
    document.getElementById(
        "nutrientBRuntime"
    );


const phDownFlowInput =
    document.getElementById(
        "phDownFlow"
    );


const phDownDoseInput =
    document.getElementById(
        "phDownDose"
    );


const phDownRuntime =
    document.getElementById(
        "phDownRuntime"
    );


const mixTimeInput =
    document.getElementById(
        "mixTimeSeconds"
    );


const maxTotalDoseInput =
    document.getElementById(
        "maxTotalDoseML"
    );


const saveCalibrationButton =
    document.getElementById(
        "saveCalibrationButton"
    );


const calibrationMessage =
    document.getElementById(
        "calibrationMessage"
    );


const calibrationStatus =
    document.getElementById(
        "calibrationStatus"
    );


// =========================================================
// PUMPS
// =========================================================

const pumps = [

    {
        id: "nutrientA",
        label: "Nutrient Pump A"
    },

    {
        id: "nutrientB",
        label: "Nutrient Pump B"
    },

    {
        id: "phDown",
        label: "pH Down Pump"
    }

];


// =========================================================
// FIREBASE SENSOR REFERENCES
// =========================================================

const ecReference =
    ref(
        database,
        "sensors/ec"
    );


const phReference =
    ref(
        database,
        "sensors/ph"
    );


// =========================================================
// FIREBASE PUMP REFERENCES
// =========================================================

const pumpReferences = {

    nutrientA:
        ref(
            database,
            "control/pumps/nutrientA"
        ),

    nutrientB:
        ref(
            database,
            "control/pumps/nutrientB"
        ),

    phDown:
        ref(
            database,
            "control/pumps/phDown"
        )

};


// =========================================================
// DOSING MODE
// =========================================================

const dosingModeReference =
    ref(
        database,
        "control/dosingMode"
    );


// =========================================================
// CALIBRATION REFERENCES
// =========================================================

const calibrationReferences = {

    nutrientAFlow:
        ref(
            database,
            "config/dosing/nutrientA/flowRateMLMin"
        ),

    nutrientADose:
        ref(
            database,
            "config/dosing/nutrientA/doseVolumeML"
        ),

    nutrientBFlow:
        ref(
            database,
            "config/dosing/nutrientB/flowRateMLMin"
        ),

    nutrientBDose:
        ref(
            database,
            "config/dosing/nutrientB/doseVolumeML"
        ),

    phDownFlow:
        ref(
            database,
            "config/dosing/phDown/flowRateMLMin"
        ),

    phDownDose:
        ref(
            database,
            "config/dosing/phDown/doseVolumeML"
        ),

    mixTime:
        ref(
            database,
            "config/dosing/mixTimeSeconds"
        ),

    maxTotalDose:
        ref(
            database,
            "config/dosing/maxTotalDoseML"
        )

};


// =========================================================
// SYSTEM LOGS
// =========================================================

const logsReference =
    ref(
        database,
        "logs"
    );


// =========================================================
// FIREBASE CHECK
// =========================================================

console.log(
    "Firebase database:",
    database ? "CONNECTED" : "NOT CONNECTED"
);


// =========================================================
// EC LISTENER
// =========================================================

onValue(

    ecReference,

    (snapshot) => {

        const value =
            snapshot.val();


        if (
            value === null ||
            value === undefined
        ) {

            ec = null;

            if (ecValueElement) {
                ecValueElement.textContent = "--";
            }

            updateStatus();

            return;

        }


        const numericEC =
            Number(value);


        if (
            !Number.isFinite(
                numericEC
            )
        ) {

            ec = null;

            if (ecValueElement) {
                ecValueElement.textContent = "--";
            }

            updateStatus();

            return;

        }


        ec =
            numericEC;


        if (ecValueElement) {

            ecValueElement.textContent =
                Math.round(
                    ec
                ).toLocaleString();

        }


        updateStatus();

    },

    (error) => {

        console.error(
            "Firebase EC error:",
            error
        );

        ec = null;

        if (ecValueElement) {
            ecValueElement.textContent = "--";
        }

        updateStatus();

    }

);


// =========================================================
// pH LISTENER
// =========================================================

onValue(

    phReference,

    (snapshot) => {

        const value =
            snapshot.val();


        if (
            value === null ||
            value === undefined
        ) {

            ph = null;

            if (phValueElement) {
                phValueElement.textContent = "--";
            }

            updateStatus();

            return;

        }


        const numericPH =
            Number(value);


        if (
            !Number.isFinite(
                numericPH
            )
        ) {

            ph = null;

            if (phValueElement) {
                phValueElement.textContent = "--";
            }

            updateStatus();

            return;

        }


        ph =
            Math.max(
                0,
                Math.min(
                    14,
                    numericPH
                )
            );


        if (phValueElement) {

            phValueElement.textContent =
                ph.toFixed(2);

        }


        updateStatus();

    },

    (error) => {

        console.error(
            "Firebase pH error:",
            error
        );

        ph = null;

        if (phValueElement) {
            phValueElement.textContent = "--";
        }

        updateStatus();

    }

);


// =========================================================
// WATER STATUS
// =========================================================

function updateStatus() {

    if (
        ec === null ||
        ph === null
    ) {

        if (statusMsg) {

            statusMsg.textContent =
                "⏳ Waiting for sensor readings";

            statusMsg.className =
                "water-status status-warning";

        }

        return;

    }


    const ecNormal =
        ec >= EC_MIN &&
        ec <= EC_MAX;


    const phNormal =
        ph >= PH_MIN &&
        ph <= PH_MAX;


    if (
        ecNormal &&
        phNormal
    ) {

        if (statusMsg) {

            statusMsg.textContent =
                "✅ Water Balanced";

            statusMsg.className =
                "water-status status-success";

        }

        return;

    }


    if (statusMsg) {

        statusMsg.textContent =
            "⚠️ Water Not Balanced";

        statusMsg.className =
            "water-status status-danger";

    }

}


// =========================================================
// CALCULATE RUNTIME PREVIEW
// =========================================================

function calculateRuntime(
    flowRate,
    doseVolume
) {

    if (
        !Number.isFinite(flowRate) ||
        !Number.isFinite(doseVolume) ||
        flowRate <= 0 ||
        doseVolume <= 0
    ) {

        return null;

    }


    return (
        doseVolume /
        flowRate
    ) *
    60;

}


// =========================================================
// UPDATE RUNTIME DISPLAY
// =========================================================

function updateCalibrationRuntimePreview() {

    const aFlow =
        Number(
            nutrientAFlowInput?.value
        );


    const aDose =
        Number(
            nutrientADoseInput?.value
        );


    const aRuntime =
        calculateRuntime(
            aFlow,
            aDose
        );


    if (nutrientARuntime) {

        nutrientARuntime.textContent =
            aRuntime === null
                ? "--"
                : `${aRuntime.toFixed(2)} sec`;

    }


    const bFlow =
        Number(
            nutrientBFlowInput?.value
        );


    const bDose =
        Number(
            nutrientBDoseInput?.value
        );


    const bRuntime =
        calculateRuntime(
            bFlow,
            bDose
        );


    if (nutrientBRuntime) {

        nutrientBRuntime.textContent =
            bRuntime === null
                ? "--"
                : `${bRuntime.toFixed(2)} sec`;

    }


    const phFlow =
        Number(
            phDownFlowInput?.value
        );


    const phDose =
        Number(
            phDownDoseInput?.value
        );


    const phRuntime =
        calculateRuntime(
            phFlow,
            phDose
        );


    if (phDownRuntime) {

        phDownRuntime.textContent =
            phRuntime === null
                ? "--"
                : `${phRuntime.toFixed(2)} sec`;

    }

}


// =========================================================
// CALIBRATION INPUT EVENTS
// =========================================================

[
    nutrientAFlowInput,
    nutrientADoseInput,
    nutrientBFlowInput,
    nutrientBDoseInput,
    phDownFlowInput,
    phDownDoseInput
].forEach(

    input => {

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            updateCalibrationRuntimePreview
        );

    }

);


// =========================================================
// LOAD CALIBRATION
// =========================================================

async function loadCalibration() {

    try {

        const snapshot =
            await get(
                ref(
                    database,
                    "config/dosing"
                )
            );


        if (
            !snapshot.exists()
        ) {

            setCalibrationStatus(
                "Not configured"
            );

            return;

        }


        const data =
            snapshot.val();


        if (
            nutrientAFlowInput
        ) {

            nutrientAFlowInput.value =
                data?.nutrientA?.flowRateMLMin ??
                "";

        }


        if (
            nutrientADoseInput
        ) {

            nutrientADoseInput.value =
                data?.nutrientA?.doseVolumeML ??
                "";

        }


        if (
            nutrientBFlowInput
        ) {

            nutrientBFlowInput.value =
                data?.nutrientB?.flowRateMLMin ??
                "";

        }


        if (
            nutrientBDoseInput
        ) {

            nutrientBDoseInput.value =
                data?.nutrientB?.doseVolumeML ??
                "";

        }


        if (
            phDownFlowInput
        ) {

            phDownFlowInput.value =
                data?.phDown?.flowRateMLMin ??
                "";

        }


        if (
            phDownDoseInput
        ) {

            phDownDoseInput.value =
                data?.phDown?.doseVolumeML ??
                "";

        }


        if (
            mixTimeInput
        ) {

            mixTimeInput.value =
                data?.mixTimeSeconds ??
                60;

        }


        if (
            maxTotalDoseInput
        ) {

            maxTotalDoseInput.value =
                data?.maxTotalDoseML ??
                250;

        }


        updateCalibrationRuntimePreview();


        setCalibrationStatus(
            "Calibration loaded"
        );

    }

    catch (error) {

        console.error(
            "Calibration load error:",
            error
        );


        setCalibrationStatus(
            "Load failed"
        );

    }

}


// =========================================================
// CALIBRATION STATUS
// =========================================================

function setCalibrationStatus(
    text
) {

    if (
        calibrationStatus
    ) {

        calibrationStatus.textContent =
            text;

    }

}


// =========================================================
// SAVE CALIBRATION
// =========================================================

async function saveCalibration() {

    if (
        !nutrientAFlowInput ||
        !nutrientADoseInput ||
        !nutrientBFlowInput ||
        !nutrientBDoseInput ||
        !phDownFlowInput ||
        !phDownDoseInput ||
        !mixTimeInput ||
        !maxTotalDoseInput
    ) {

        return;

    }


    const values = {

        nutrientAFlow:
            Number(
                nutrientAFlowInput.value
            ),

        nutrientADose:
            Number(
                nutrientADoseInput.value
            ),

        nutrientBFlow:
            Number(
                nutrientBFlowInput.value
            ),

        nutrientBDose:
            Number(
                nutrientBDoseInput.value
            ),

        phDownFlow:
            Number(
                phDownFlowInput.value
            ),

        phDownDose:
            Number(
                phDownDoseInput.value
            ),

        mixTime:
            Number(
                mixTimeInput.value
            ),

        maxTotalDose:
            Number(
                maxTotalDoseInput.value
            )

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    if (
        !Number.isFinite(
            values.nutrientAFlow
        ) ||
        values.nutrientAFlow <= 0
    ) {

        showCalibrationMessage(
            "Enter a valid Nutrient A flow rate.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(
            values.nutrientADose
        ) ||
        values.nutrientADose <= 0
    ) {

        showCalibrationMessage(
            "Enter a valid Nutrient A dose step.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(
            values.nutrientBFlow
        ) ||
        values.nutrientBFlow <= 0
    ) {

        showCalibrationMessage(
            "Enter a valid Nutrient B flow rate.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(
            values.nutrientBDose
        ) ||
        values.nutrientBDose <= 0
    ) {

        showCalibrationMessage(
            "Enter a valid Nutrient B dose step.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(
            values.phDownFlow
        ) ||
        values.phDownFlow <= 0
    ) {

        showCalibrationMessage(
            "Enter a valid pH Down flow rate.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(
            values.phDownDose
        ) ||
        values.phDownDose <= 0
    ) {

        showCalibrationMessage(
            "Enter a valid pH Down dose step.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(
            values.mixTime
        ) ||
        values.mixTime < 10
    ) {

        showCalibrationMessage(
            "Mixing wait must be at least 10 seconds.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(
            values.maxTotalDose
        ) ||
        values.maxTotalDose < 10
    ) {

        showCalibrationMessage(
            "Maximum session dose is invalid.",
            true
        );

        return;

    }


    try {

        if (saveCalibrationButton) {

            saveCalibrationButton.disabled =
                true;

        }


        showCalibrationMessage(
            "Saving calibration...",
            false
        );


        await set(
            calibrationReferences.nutrientAFlow,
            values.nutrientAFlow
        );


        await set(
            calibrationReferences.nutrientADose,
            values.nutrientADose
        );


        await set(
            calibrationReferences.nutrientBFlow,
            values.nutrientBFlow
        );


        await set(
            calibrationReferences.nutrientBDose,
            values.nutrientBDose
        );


        await set(
            calibrationReferences.phDownFlow,
            values.phDownFlow
        );


        await set(
            calibrationReferences.phDownDose,
            values.phDownDose
        );


        await set(
            calibrationReferences.mixTime,
            values.mixTime
        );


        await set(
            calibrationReferences.maxTotalDose,
            values.maxTotalDose
        );


        updateCalibrationRuntimePreview();


        setCalibrationStatus(
            "Calibration saved"
        );


        showCalibrationMessage(
            "✅ Dosing calibration saved successfully.",
            false
        );

    }

    catch (error) {

        console.error(
            "Calibration save error:",
            error
        );


        showCalibrationMessage(
            "❌ Failed to save calibration.",
            true
        );

    }

    finally {

        if (saveCalibrationButton) {

            saveCalibrationButton.disabled =
                false;

        }

    }

}


// =========================================================
// CALIBRATION MESSAGE
// =========================================================

function showCalibrationMessage(
    message,
    error
) {

    if (!calibrationMessage) {
        return;
    }


    calibrationMessage.textContent =
        message;


    calibrationMessage.classList.toggle(
        "error",
        error
    );

}


// =========================================================
// SAVE CALIBRATION BUTTON
// =========================================================

if (
    saveCalibrationButton
) {

    saveCalibrationButton.addEventListener(
        "click",
        saveCalibration
    );

}


// =========================================================
// PUMP UI
// =========================================================

function updatePumpUI(
    pumpId,
    state
) {

    const sw =
        document.getElementById(
            `${pumpId}Switch`
        );


    const lbl =
        document.getElementById(
            `${pumpId}Label`
        );


    const msg =
        document.getElementById(
            `${pumpId}Msg`
        );


    const indicator =
        document.getElementById(
            `${pumpId}Indicator`
        );


    if (
        !sw ||
        !lbl ||
        !msg ||
        !indicator
    ) {

        return;

    }


    sw.checked =
        state;


    if (state) {

        lbl.textContent =
            "ON";


        lbl.classList.add(
            "on"
        );


        indicator.className =
            "pump-indicator active";


        msg.classList.remove(
            "hidden"
        );


        msg.textContent =
            dosingMode === "automatic"
                ? "Automatic dosing active"
                : "Manual control active";


        return;

    }


    lbl.textContent =
        "OFF";


    lbl.classList.remove(
        "on"
    );


    indicator.className =
        "pump-indicator";


    msg.classList.add(
        "hidden"
    );

}


// =========================================================
// PUMP FIREBASE LISTENERS
// =========================================================
//
// IMPORTANT:
// This allows the Control Panel to see pump activity
// initiated by the ESP32.
//
// =========================================================

pumps.forEach(

    pump => {

        const pumpReference =
            pumpReferences[
                pump.id
            ];


        onValue(

            pumpReference,

            snapshot => {

                const state =
                    snapshot.val() === true;


                updatePumpUI(
                    pump.id,
                    state
                );

            },

            error => {

                console.error(
                    `Pump listener error: ${pump.id}`,
                    error
                );

            }

        );

    }

);


// =========================================================
// SAVE SYSTEM LOG
// =========================================================

async function saveSystemLog(
    pumpId,
    oldState,
    newState,
    controlType
) {

    const pump =
        pumps.find(
            item =>
                item.id === pumpId
        );


    if (!pump) {
        return;
    }


    const now =
        new Date();


    const date =
        now.toLocaleDateString(
            "en-CA"
        );


    const time =
        now.toLocaleTimeString(
            "en-US",
            {
                hour12: false
            }
        );


    const logData = {

        date,

        time,

        pump:
            pump.label,

        old:
            oldState
                ? "ON"
                : "OFF",

        new:
            newState
                ? "ON"
                : "OFF",

        status:
            controlType ||
            "Manual"

    };


    try {

        const newLogReference =
            push(
                logsReference
            );


        await set(
            newLogReference,
            logData
        );

    }

    catch (error) {

        console.error(
            "SYSTEM LOG ERROR:",
            error
        );

    }

}


// =========================================================
// SET PUMP
// =========================================================

async function setPump(
    pumpId,
    state,
    controlType = "Manual"
) {

    const pumpReference =
        pumpReferences[pumpId];


    if (!pumpReference) {
        return false;
    }


    try {

        const snapshot =
            await get(
                pumpReference
            );


        const oldState =
            snapshot.exists()
                ? snapshot.val() === true
                : false;


        if (
            oldState === state
        ) {

            updatePumpUI(
                pumpId,
                state
            );

            return true;

        }


        await set(
            pumpReference,
            state
        );


        if (
            controlType === "Manual"
        ) {

            await saveSystemLog(
                pumpId,
                oldState,
                state,
                "Manual"
            );

        }


        updatePumpUI(
            pumpId,
            state
        );


        return true;

    }

    catch (error) {

        console.error(
            "Pump command failed:",
            pumpId,
            error
        );


        return false;

    }

}


// =========================================================
// TURN ALL PUMPS OFF
// =========================================================

async function turnAllPumpsOff(
    controlType = "System"
) {

    await setPump(
        "nutrientA",
        false,
        controlType
    );


    await setPump(
        "nutrientB",
        false,
        controlType
    );


    await setPump(
        "phDown",
        false,
        controlType
    );

}


// =========================================================
// MANUAL PUMP CONTROLS
// =========================================================

pumps.forEach(

    pump => {

        const sw =
            document.getElementById(
                `${pump.id}Switch`
            );


        if (!sw) {
            return;
        }


        sw.addEventListener(

            "change",

            async () => {

                if (
                    dosingMode !== "manual"
                ) {

                    sw.checked =
                        false;

                    return;

                }


                const state =
                    sw.checked;


                // -----------------------------------------
                // ONE PUMP ONLY
                // -----------------------------------------

                if (
                    state
                ) {

                    await turnAllPumpsOff(
                        "Manual Safety"
                    );

                }


                await setPump(
                    pump.id,
                    state,
                    "Manual"
                );

            }

        );

    }

);


// =========================================================
// ENABLE MANUAL PUMPS
// =========================================================

function enableManualPumps() {

    pumps.forEach(

        pump => {

            const sw =
                document.getElementById(
                    `${pump.id}Switch`
                );


            if (!sw) {
                return;
            }


            sw.disabled =
                false;


            const parent =
                sw.closest(
                    ".pump-switch"
                );


            if (parent) {

                parent.classList.remove(
                    "disabled"
                );

            }

        }

    );

}


// =========================================================
// DISABLE MANUAL PUMPS
// =========================================================

function disableManualPumps() {

    pumps.forEach(

        pump => {

            const sw =
                document.getElementById(
                    `${pump.id}Switch`
                );


            if (!sw) {
                return;
            }


            sw.disabled =
                true;


            sw.checked =
                false;


            const parent =
                sw.closest(
                    ".pump-switch"
                );


            if (parent) {

                parent.classList.add(
                    "disabled"
                );

            }

        }

    );

}


// =========================================================
// DOSING MODE LISTENER
// =========================================================

onValue(

    dosingModeReference,

    snapshot => {

        const mode =
            snapshot.val();


        if (
            mode === "automatic" ||
            mode === "manual"
        ) {

            applyDosingModeUI(
                mode
            );

        }

    },

    error => {

        console.error(
            "Dosing mode listener error:",
            error
        );

    }

);


// =========================================================
// APPLY DOSING MODE UI
// =========================================================

function applyDosingModeUI(
    mode
) {

    dosingMode =
        mode;


    if (
        mode === "automatic"
    ) {

        automaticModeButton?.classList.add(
            "active"
        );


        manualModeButton?.classList.remove(
            "active"
        );


        automaticInfo?.classList.remove(
            "hidden"
        );


        if (modeStatusText) {

            modeStatusText.textContent =
                "Automatic Mode";

        }


        if (pumpControlStatus) {

            pumpControlStatus.textContent =
                "ESP32 Automatic Control";

        }


        disableManualPumps();


        return;

    }


    manualModeButton?.classList.add(
        "active"
    );


    automaticModeButton?.classList.remove(
        "active"
    );


    automaticInfo?.classList.add(
        "hidden"
    );


    if (modeStatusText) {

        modeStatusText.textContent =
            "Manual Mode";

    }


    if (pumpControlStatus) {

        pumpControlStatus.textContent =
            "Manual Control";

    }


    enableManualPumps();

}


// =========================================================
// SET DOSING MODE
// =========================================================

async function setDosingMode(
    mode
) {

    try {

        // Always stop commands before changing authority.

        await turnAllPumpsOff(
            "Mode Change"
        );


        await set(
            dosingModeReference,
            mode
        );


        applyDosingModeUI(
            mode
        );


        console.log(
            "Dosing mode:",
            mode
        );

    }

    catch (error) {

        console.error(
            "Failed to change dosing mode:",
            error
        );

    }

}


// =========================================================
// MODE BUTTONS
// =========================================================

if (
    automaticModeButton
) {

    automaticModeButton.addEventListener(
        "click",
        () => {

            setDosingMode(
                "automatic"
            );

        }
    );

}


if (
    manualModeButton
) {

    manualModeButton.addEventListener(
        "click",
        () => {

            setDosingMode(
                "manual"
            );

        }
    );

}


// =========================================================
// SYSTEM LOGS
// =========================================================

onValue(

    logsReference,

    snapshot => {

        if (!logsTableBody) {
            return;
        }


        logsTableBody.innerHTML =
            "";


        const data =
            snapshot.val();


        if (!data) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `
                <td colspan="6">
                    No system logs yet.
                </td>
            `;


            logsTableBody.appendChild(
                row
            );


            return;

        }


        const logs =
            Object.entries(
                data
            );


        logs.reverse();


        const latestLogs =
            logs.slice(
                0,
                5
            );


        latestLogs.forEach(
            ([key, log]) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${log.date || "--"}
                    </td>

                    <td>
                        ${log.time || "--"}
                    </td>

                    <td>
                        ${log.pump || "--"}
                    </td>

                    <td>
                        ${log.old || "--"}
                    </td>

                    <td>
                        ${log.new || "--"}
                    </td>

                    <td>
                        ${log.status || "--"}
                    </td>

                `;


                logsTableBody.appendChild(
                    row
                );

            }
        );

    },

    error => {

        console.error(
            "Firebase logs READ ERROR:",
            error
        );

    }

);


// =========================================================
// INITIALIZATION
// =========================================================

loadCalibration();

updateCalibrationRuntimePreview();


// =========================================================
// DEFAULT MODE
// =========================================================
//
// We no longer force Firebase to manual on page load.
// This is important because doing so could unexpectedly
// disable automatic dosing every time the page is refreshed.
//
// =========================================================

onValue(

    dosingModeReference,

    snapshot => {

        const mode =
            snapshot.val();


        if (
            mode === "automatic" ||
            mode === "manual"
        ) {

            applyDosingModeUI(
                mode
            );

        }

    }

);


// =========================================================
// READY
// =========================================================

console.log(
    "================================="
);

console.log(
    "HYDROSMART Control Panel READY"
);

console.log(
    "Automatic dosing authority: ESP32"
);

console.log(
    "Calibration path: /config/dosing"
);

console.log(
    "Pump path: /control/pumps/"
);

console.log(
    "Mode path: /control/dosingMode"
);

console.log(
    "Logs path: /logs"
);

console.log(
    "================================="
);
