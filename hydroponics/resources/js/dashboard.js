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

   RESPONSIBILITIES:
   - Card hover UI
   - Graph color themes
   - Skeleton loading UI
   - Loading state removal
===================================================== */

document.addEventListener('DOMContentLoaded', () => {


    /* =================================================
       CARD HOVER
    ================================================= */

    document
        .querySelectorAll(
            '.sensor-card, .graph-card, .info-card, .detail-card, .section-card'
        )
        .forEach(card => {

            card.addEventListener('mouseenter', () => {

                /*
                 * Do not activate hover while loading.
                 */
                if (
                    card.classList.contains('is-loading') ||
                    document.body.classList.contains('dashboard-loading')
                ) {
                    return;
                }

                card.classList.add('dashboard-hover');

            });


            card.addEventListener('mouseleave', () => {

                card.classList.remove('dashboard-hover');

            });

        });


    /* =================================================
       GRAPH COLOR THEMES
    ================================================= */

    const graphColorMap = {

        '.ph-graph': {

            color: '#7c3aed',

            background:
                'rgba(124, 58, 237, 0.12)'

        },


        '.ec-graph': {

            color: '#2563eb',

            background:
                'rgba(37, 99, 235, 0.12)'

        },


        '.temp-graph': {

            color: '#ea580c',

            background:
                'rgba(234, 88, 12, 0.12)'

        },


        '.water-graph': {

            color: '#0f766e',

            background:
                'rgba(15, 118, 110, 0.12)'

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

                    graph.style.setProperty(
                        '--graph-color',
                        theme.color
                    );


                    graph.style.setProperty(
                        '--graph-background',
                        theme.background
                    );


                    graph.style.setProperty(
                        '--legend-color',
                        theme.color
                    );

                });

        }
    );


    /* =================================================
       GRAPH LEGEND COLOR ELEMENTS
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


            graph
                .querySelectorAll(
                    '.legend-color, .legend-box, .chart-legend-color'
                )
                .forEach(indicator => {

                    indicator.style.backgroundColor =
                        color;

                });


            graph
                .querySelectorAll(
                    '.chartjs-legend-item span'
                )
                .forEach(indicator => {

                    indicator.style.backgroundColor =
                        color;

                });

        });


    /* =================================================
       SKELETON ELEMENTS
    ================================================= */

    const dashboardContent =
        document.querySelector(
            '#dashboardContent'
        );


    const header =
        document.querySelector(
            '.dashboard-header-loading'
        );


    const sensorCards =
        document.querySelectorAll(
            '.sensor-card.is-loading'
        );


    const graphHeader =
        document.querySelector(
            '.graph-header-loading'
        );


    const graphCards =
        document.querySelectorAll(
            '.graph-card.is-loading'
        );


    const mainTank =
        document.querySelector(
            '.main-tank-loading'
        );


    const graphSection =
        document.querySelector(
            '.realtime-graphs-section'
        );


    /* =================================================
       INITIAL LOADING STATE
    ================================================= */

    if (dashboardContent) {

        dashboardContent.classList.add(
            'dashboard-loading',
            'is-loading'
        );

    }


    if (header) {

        header.classList.add(
            'dashboard-header-loading',
            'is-loading'
        );

    }


    sensorCards.forEach(card => {

        card.classList.add(
            'is-loading'
        );

    });


    if (graphHeader) {

        graphHeader.classList.add(
            'graph-header-loading',
            'is-loading'
        );

    }


    graphCards.forEach(card => {

        card.classList.add(
            'is-loading'
        );

    });


    if (mainTank) {

        mainTank.classList.add(
            'main-tank-loading',
            'is-loading'
        );

    }


    if (graphSection) {

        graphSection.classList.add(
            'is-loading'
        );

    }


    /* =================================================
       FINISH LOADING
    ================================================= */

    const finishLoading = () => {


        /* =============================================
           GLOBAL DASHBOARD
        ============================================= */

        if (dashboardContent) {

            dashboardContent.classList.remove(
                'dashboard-loading',
                'is-loading'
            );

        }


        /* =============================================
           HEADER
        ============================================= */

        if (header) {

            header.classList.remove(
                'dashboard-header-loading',
                'is-loading'
            );

        }


        /* =============================================
           SENSOR CARDS
        ============================================= */

        sensorCards.forEach(card => {

            card.classList.remove(
                'is-loading'
            );

            card.classList.remove(
                'dashboard-hover'
            );

        });


        /* =============================================
           GRAPH HEADER
        ============================================= */

        if (graphHeader) {

            graphHeader.classList.remove(
                'graph-header-loading',
                'is-loading'
            );

        }


        /* =============================================
           GRAPH CARDS
        ============================================= */

        graphCards.forEach(card => {

            card.classList.remove(
                'is-loading'
            );

            card.classList.remove(
                'dashboard-hover'
            );

        });


        /* =============================================
           MAIN TANK
        ============================================= */

        if (mainTank) {

            mainTank.classList.remove(
                'main-tank-loading',
                'is-loading'
            );

        }


        /* =============================================
           GRAPH SECTION
        ============================================= */

        if (graphSection) {

            graphSection.classList.remove(
                'is-loading'
            );

        }


        /* =============================================
           RE-APPLY GRAPH LEGEND COLORS
           AFTER LOADING
        ============================================= */

        document
            .querySelectorAll('.graph-card')
            .forEach(graph => {

                const color =
                    getComputedStyle(graph)
                        .getPropertyValue(
                            '--legend-color'
                        )
                        .trim();


                if (!color) {

                    return;

                }


                graph
                    .querySelectorAll(
                        '.legend-color, .legend-box, .chart-legend-color'
                    )
                    .forEach(indicator => {

                        indicator.style.backgroundColor =
                            color;

                    });


                graph
                    .querySelectorAll(
                        '.chartjs-legend-item span'
                    )
                    .forEach(indicator => {

                        indicator.style.backgroundColor =
                            color;

                    });

            });

    };


    /* =================================================
       INITIAL UI LOADING
       1500ms
    ================================================= */

    setTimeout(() => {

        finishLoading();

    }, 1500);


});
