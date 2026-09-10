/* =====================================================
   HYDROSMART DASHBOARD
   UI ONLY

   DOES NOT CONTROL:
   - Firebase
   - Sensors
   - Sensor values
   - Charts
   - Gauges
   - Main tank logic
===================================================== */

document.addEventListener('DOMContentLoaded', () => {


    /* =================================================
       CARD HOVER
    ================================================= */

    document
        .querySelectorAll(
            '.sensor-card, .graph-card, .info-card'
        )
        .forEach(card => {

            card.addEventListener('mouseenter', () => {

                card.classList.add(
                    'dashboard-hover'
                );

            });


            card.addEventListener('mouseleave', () => {

                card.classList.remove(
                    'dashboard-hover'
                );

            });

        });


    /* =================================================
       GRAPH COLOR THEMES

       These colors match the sensor themes:

       pH              = Purple
       EC              = Blue
       Water Temp      = Orange
       Water Level     = Teal / Green
    ================================================= */

    const graphColorMap = {

        '.ph-graph': {
            color: '#7c3aed',
            background: 'rgba(124, 58, 237, 0.12)'
        },

        '.ec-graph': {
            color: '#2563eb',
            background: 'rgba(37, 99, 235, 0.12)'
        },

        '.temp-graph': {
            color: '#ea580c',
            background: 'rgba(234, 88, 12, 0.12)'
        },

        '.water-graph': {
            color: '#0f766e',
            background: 'rgba(15, 118, 110, 0.12)'
        }

    };


    /* =================================================
       APPLY GRAPH COLOR VARIABLES
    ================================================= */

    Object.entries(graphColorMap).forEach(
        ([selector, theme]) => {

            document
                .querySelectorAll(selector)
                .forEach(graph => {

                    /*
                     * Main graph color
                     */

                    graph.style.setProperty(
                        '--graph-color',
                        theme.color
                    );


                    /*
                     * Light graph background
                     */

                    graph.style.setProperty(
                        '--graph-background',
                        theme.background
                    );


                    /*
                     * Legend indicator color
                     */

                    graph.style.setProperty(
                        '--legend-color',
                        theme.color
                    );

                });

        }
    );


    /* =================================================
       GRAPH LEGEND COLOR ELEMENTS

       This handles normal HTML legend elements
       if they exist inside the graph cards.

       It does NOT modify Chart.js data.
    ================================================= */

    document
        .querySelectorAll('.graph-card')
        .forEach(graph => {

            const color =
                getComputedStyle(graph)
                    .getPropertyValue('--legend-color')
                    .trim();


            if (!color) {
                return;
            }


            /*
             * Common custom legend selectors
             */

            graph
                .querySelectorAll(
                    '.legend-color, .legend-box, .chart-legend-color'
                )
                .forEach(indicator => {

                    indicator.style.backgroundColor = color;

                });


            /*
             * Legend span elements
             */

            graph
                .querySelectorAll(
                    '.chartjs-legend-item span'
                )
                .forEach(indicator => {

                    indicator.style.backgroundColor = color;

                });

        });


    /* =================================================
       SKELETON ELEMENTS
    ================================================= */


    /* ---------------------------------------------
       DASHBOARD HEADER
    --------------------------------------------- */

    const header = document.querySelector(
        '.dashboard-header-loading'
    );


    /* ---------------------------------------------
       SENSOR CARDS
    --------------------------------------------- */

    const sensorCards = document.querySelectorAll(
        '.sensor-card.is-loading'
    );


    /* ---------------------------------------------
       GRAPH HEADER
    --------------------------------------------- */

    const graphHeader = document.querySelector(
        '.graph-header-loading'
    );


    /* ---------------------------------------------
       GRAPH CARDS
    --------------------------------------------- */

    const graphCards = document.querySelectorAll(
        '.graph-card.is-loading'
    );


    /* ---------------------------------------------
       MAIN TANK
    --------------------------------------------- */

    const mainTank = document.querySelector(
        '.main-tank-loading'
    );


    /* =================================================
       FINISH LOADING
    ================================================= */

    const finishLoading = () => {


        /* ---------------------------------------------
           DASHBOARD HEADER
        --------------------------------------------- */

        if (header) {

            header.classList.remove(
                'dashboard-header-loading'
            );

        }


        /* ---------------------------------------------
           SENSOR CARDS
        --------------------------------------------- */

        sensorCards.forEach(card => {

            card.classList.remove(
                'is-loading'
            );

        });


        /* ---------------------------------------------
           GRAPH HEADER
        --------------------------------------------- */

        if (graphHeader) {

            graphHeader.classList.remove(
                'graph-header-loading'
            );

        }


        /* ---------------------------------------------
           GRAPH CARDS
        --------------------------------------------- */

        graphCards.forEach(card => {

            card.classList.remove(
                'is-loading'
            );

        });


        /* ---------------------------------------------
           MAIN TANK
        --------------------------------------------- */

        if (mainTank) {

            mainTank.classList.remove(
                'main-tank-loading'
            );

        }

    };


    /* =================================================
       INITIAL UI LOADING

       1500ms skeleton display.

       DOES NOT TOUCH:
       - Firebase
       - Sensor values
       - Sensor listeners
       - Charts
       - Gauges
       - maintank.js
    ================================================= */

    setTimeout(() => {

        finishLoading();

    }, 1500);

});
