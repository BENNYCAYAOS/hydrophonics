// ========================================
// HYDROSMART - MAIN TANK FLOAT SWITCH
// FIREBASE REAL-TIME CONNECTION
// UPDATED RGB LED STATUS LOGIC
// ========================================

import { database } from "../firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


// ========================================
// FIREBASE REFERENCE
// ========================================

const mainTankRef = ref(database, "mainTank");


// ========================================
// DOM ELEMENTS
// ========================================

const mainTankValue =
    document.getElementById("mainTankValue");

const mainTankStatus =
    document.getElementById("mainTankStatus");

const mainTankFloat =
    document.getElementById("mainTankFloat");

const mainTankCondition =
    document.getElementById("mainTankCondition");

const mainTankCritical =
    document.getElementById("mainTankCritical");

const mainTankGreenLED =
    document.getElementById("mainTankGreenLED");

const mainTankRedLED =
    document.getElementById("mainTankRedLED");

// Optional:
// Add <strong id="mainTankBlueLED">OFF</strong>
// to your Blade if you want BLUE displayed separately.
const mainTankBlueLED =
    document.getElementById("mainTankBlueLED");


// ========================================
// FIREBASE REAL-TIME LISTENER
// ========================================

onValue(
    mainTankRef,

    (snapshot) => {

        const data = snapshot.val();

        if (!data) {

            console.log(
                "Main Tank: No Firebase data."
            );

            return;
        }


        // ========================================
        // MAIN TANK DATA
        // ========================================

        const floatSwitch =
            data.floatSwitch ?? "--";

        const waterCondition =
            data.waterCondition ?? "--";

        const waterLevelStatus =
            data.waterLevelStatus ?? "--";

        const criticalCondition =
            data.criticalCondition === true;

        const tankCapacity =
            data.tankCapacity ?? 1000;

        const criticalVolume =
            data.criticalVolume ?? 300;


        // ========================================
        // DEVICE / RGB LED STATUS
        // ========================================

        const online =
            data.online === true;

        const rgbColor =
            data.rgbColor ?? "--";

        const blueLED =
            data.rgbBlue === true;

        const greenLED =
            data.rgbGreen === true;

        const redLED =
            data.rgbRed === true;


        // ========================================
        // MAIN TANK VALUE
        // ========================================
        //
        // Critical  = ≤ 300 L
        // Normal    = > 300 L
        //
        // Float switch does not measure exact liters.
        // ========================================

        if (mainTankValue) {

            if (criticalCondition) {

                mainTankValue.textContent =
                    "≤ " + criticalVolume + " L";

            } else {

                mainTankValue.textContent =
                    "> " + criticalVolume + " L";
            }
        }


        // ========================================
        // MAIN TANK STATUS BADGE
        // ========================================

        if (mainTankStatus) {

            if (criticalCondition) {

                mainTankStatus.textContent =
                    "Critical";

                mainTankStatus.style.color =
                    "#991b1b";

                mainTankStatus.style.backgroundColor =
                    "#fecaca";

                mainTankStatus.style.borderColor =
                    "#fca5a5";

            } else {

                mainTankStatus.textContent =
                    "Normal";

                mainTankStatus.style.color =
                    "#166534";

                mainTankStatus.style.backgroundColor =
                    "#dcfce7";

                mainTankStatus.style.borderColor =
                    "#bbf7d0";
            }


            mainTankStatus.style.borderStyle =
                "solid";

            mainTankStatus.style.borderWidth =
                "1px";

            mainTankStatus.style.borderRadius =
                "9999px";

            mainTankStatus.style.padding =
                "6px 14px";

            mainTankStatus.style.fontWeight =
                "600";

            mainTankStatus.style.display =
                "inline-block";

            mainTankStatus.style.lineHeight =
                "1.2";

            mainTankStatus.style.transition =
                "all 0.25s ease";
        }


        // ========================================
        // FLOAT SWITCH
        // ========================================

        if (mainTankFloat) {

            mainTankFloat.textContent =
                floatSwitch;


            if (floatSwitch === "CLOSED") {

                mainTankFloat.className =
                    "text-sm font-semibold text-green-600";

            } else if (floatSwitch === "OPEN") {

                mainTankFloat.className =
                    "text-sm font-semibold text-red-600";

            } else {

                mainTankFloat.className =
                    "text-sm font-semibold text-gray-500";
            }
        }


        // ========================================
        // WATER CONDITION
        // ========================================

        if (mainTankCondition) {

            mainTankCondition.textContent =
                waterCondition;


            if (waterCondition === "NORMAL") {

                mainTankCondition.className =
                    "text-sm font-semibold text-green-600";

            } else if (waterCondition === "LOW") {

                mainTankCondition.className =
                    "text-sm font-semibold text-red-600";

            } else {

                mainTankCondition.className =
                    "text-sm font-semibold text-gray-500";
            }
        }


        // ========================================
        // CRITICAL CONDITION
        // ========================================

        if (mainTankCritical) {

            mainTankCritical.textContent =
                criticalCondition
                    ? "YES"
                    : "NO";


            if (criticalCondition) {

                mainTankCritical.className =
                    "text-sm font-semibold text-red-600";

            } else {

                mainTankCritical.className =
                    "text-sm font-semibold text-green-600";
            }
        }


        // ========================================
        // GREEN LED
        // ========================================
        //
        // IMPORTANT:
        // Green is NOT based on !criticalCondition anymore.
        //
        // Green is ON only when ESP32 activates
        // the 1-minute heartbeat.
        //
        // Firebase:
        // /mainTank/rgbGreen
        // ========================================

        if (mainTankGreenLED) {

            mainTankGreenLED.textContent =
                greenLED
                    ? "ON"
                    : "OFF";


            if (greenLED) {

                mainTankGreenLED.className =
                    "text-sm font-semibold text-green-600";

                mainTankGreenLED.style.color =
                    "#16a34a";

            } else {

                mainTankGreenLED.className =
                    "text-sm font-semibold text-gray-500";

                mainTankGreenLED.style.color =
                    "#6b7280";
            }
        }


        // ========================================
        // RED LED
        // ========================================
        //
        // Red is ON only when the float switch
        // is OPEN / critical.
        //
        // Firebase:
        // /mainTank/rgbRed
        // ========================================

        if (mainTankRedLED) {

            mainTankRedLED.textContent =
                redLED
                    ? "ON"
                    : "OFF";


            if (redLED) {

                mainTankRedLED.className =
                    "text-sm font-semibold text-red-600";

                mainTankRedLED.style.color =
                    "#dc2626";

            } else {

                mainTankRedLED.className =
                    "text-sm font-semibold text-gray-500";

                mainTankRedLED.style.color =
                    "#6b7280";
            }
        }


        // ========================================
        // BLUE LED
        // ========================================
        //
        // Blue is the normal ONLINE indicator.
        //
        // Firebase:
        // /mainTank/rgbBlue
        //
        // Blue is normally ON when:
        // - ESP32 is online
        // - Float switch is CLOSED
        // - Green heartbeat is not active
        //
        // If critical:
        // RED takes priority.
        //
        // If heartbeat:
        // GREEN temporarily takes priority.
        // ========================================

        if (mainTankBlueLED) {

            mainTankBlueLED.textContent =
                blueLED
                    ? "ON"
                    : "OFF";


            if (blueLED) {

                mainTankBlueLED.className =
                    "text-sm font-semibold";

                mainTankBlueLED.style.color =
                    "#2563eb";

            } else {

                mainTankBlueLED.className =
                    "text-sm font-semibold text-gray-500";

                mainTankBlueLED.style.color =
                    "#6b7280";
            }
        }


        // ========================================
        // CONSOLE STATUS
        // ========================================

        console.log(
            "========================================"
        );

        console.log(
            "HYDROSMART MAIN TANK UPDATED"
        );

        console.log(
            "========================================"
        );

        console.log(
            "Tank Capacity:",
            tankCapacity,
            "L"
        );

        console.log(
            "Critical Volume:",
            criticalVolume,
            "L"
        );

        console.log(
            "Float Switch:",
            floatSwitch
        );

        console.log(
            "Water Condition:",
            waterCondition
        );

        console.log(
            "Water Level Status:",
            waterLevelStatus
        );

        console.log(
            "Critical Condition:",
            criticalCondition
        );

        console.log(
            "ESP32 Online:",
            online
        );

        console.log(
            "RGB Color:",
            rgbColor
        );

        console.log(
            "BLUE LED:",
            blueLED
                ? "ON"
                : "OFF"
        );

        console.log(
            "GREEN LED:",
            greenLED
                ? "ON"
                : "OFF"
        );

        console.log(
            "RED LED:",
            redLED
                ? "ON"
                : "OFF"
        );

        console.log(
            "========================================"
        );
    },

    // ========================================
    // FIREBASE ERROR
    // ========================================

    (error) => {

        console.error(
            "Main Tank Firebase Error:",
            error
        );
    }
);
