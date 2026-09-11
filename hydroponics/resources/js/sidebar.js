/* =========================================================
   HYDROSMART SIDEBAR JS
   RESPONSIVE SIDEBAR + LOGOUT MODAL
   MOBILE + TABLET + DESKTOP
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    const menuButton = document.getElementById('mobileMenuButton');
    const closeButton = document.getElementById('mobileCloseButton');

    const logoutButton = document.getElementById('logoutButton');
    const logoutModal = document.getElementById('logoutModal');

    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    const logoutForm = document.getElementById('logoutForm');


    /* =====================================================
       STATE
    ===================================================== */

    let lastFocusedElement = null;
    let resizeTimer = null;


    /* =====================================================
       HELPER
    ===================================================== */

    function isMobileOrTablet() {
        return window.innerWidth < 1024;
    }


    /* =====================================================
       OPEN SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (!sidebar) {
            return;
        }

        if (!isMobileOrTablet()) {
            return;
        }

        sidebar.classList.add('open');

        if (overlay) {
            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
        }

        document.body.classList.add('sidebar-locked');

        if (menuButton) {

            menuButton.setAttribute(
                'aria-expanded',
                'true'
            );

            menuButton.setAttribute(
                'aria-label',
                'Close menu'
            );
        }

    }


    /* =====================================================
       CLOSE SIDEBAR
    ===================================================== */

    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove('open');
        }

        if (overlay) {

            overlay.classList.remove('open');

            overlay.setAttribute(
                'aria-hidden',
                'true'
            );
        }

        /*
         * Only remove body lock when logout modal
         * is not currently open.
         */

        if (
            !logoutModal ||
            !logoutModal.classList.contains('show')
        ) {

            document.body.classList.remove(
                'sidebar-locked'
            );

        }

        if (menuButton) {

            menuButton.setAttribute(
                'aria-expanded',
                'false'
            );

            menuButton.setAttribute(
                'aria-label',
                'Open menu'
            );

        }

    }


    /* =====================================================
       MENU BUTTON
    ===================================================== */

    if (menuButton) {

        menuButton.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                if (
                    sidebar &&
                    sidebar.classList.contains('open')
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                closeSidebar();

            }
        );

    }


    /* =====================================================
       OVERLAY
    ===================================================== */

    if (overlay) {

        overlay.addEventListener(
            'click',
            function () {

                closeSidebar();

            }
        );

    }


    /* =====================================================
       NAVIGATION LINKS
       CLOSE SIDEBAR ON MOBILE/TABLET
    ===================================================== */

    if (sidebar) {

        const links = sidebar.querySelectorAll(
            '.sidebar-link'
        );

        links.forEach(function (link) {

            link.addEventListener(
                'click',
                function () {

                    if (isMobileOrTablet()) {
                        closeSidebar();
                    }

                }
            );

        });

    }


    /* =====================================================
       LOGOUT MODAL
    ===================================================== */

    function openLogoutModal() {

        lastFocusedElement = document.activeElement;

        closeSidebar();

        if (!logoutModal) {
            return;
        }

        logoutModal.classList.add('show');

        logoutModal.setAttribute(
            'aria-hidden',
            'false'
        );

        document.body.classList.add(
            'sidebar-locked'
        );

        /*
         * Focus confirm/cancel button
         */

        window.setTimeout(
            function () {

                if (cancelLogout) {
                    cancelLogout.focus();
                }

            },
            50
        );

    }


    /* =====================================================
       CLOSE LOGOUT MODAL
    ===================================================== */

    function closeLogoutModal() {

        if (!logoutModal) {
            return;
        }

        logoutModal.classList.remove('show');

        logoutModal.setAttribute(
            'aria-hidden',
            'true'
        );

        document.body.classList.remove(
            'sidebar-locked'
        );


        /*
         * Return focus to previous element
         */

        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === 'function'
        ) {

            try {

                lastFocusedElement.focus();

            } catch (error) {

                // Ignore focus errors.

            }

        }

        lastFocusedElement = null;

    }


    /* =====================================================
       LOGOUT BUTTON
    ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                openLogoutModal();

            }
        );

    }


    /* =====================================================
       CANCEL LOGOUT
    ===================================================== */

    if (cancelLogout) {

        cancelLogout.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                closeLogoutModal();

            }
        );

    }


    /* =====================================================
       CONFIRM LOGOUT
    ===================================================== */

    if (
        confirmLogout &&
        logoutForm
    ) {

        confirmLogout.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                if (confirmLogout.disabled) {
                    return;
                }

                confirmLogout.disabled = true;

                confirmLogout.innerHTML = `
                    <span class="material-icons">
                        hourglass_empty
                    </span>

                    <span>
                        Logging out...
                    </span>
                `;

                /*
                 * Submit Laravel logout form.
                 */

                logoutForm.submit();

            }
        );

    }


    /* =====================================================
       CLICK OUTSIDE LOGOUT MODAL
    ===================================================== */

    if (logoutModal) {

        logoutModal.addEventListener(
            'click',
            function (event) {

                if (
                    event.target === logoutModal
                ) {

                    closeLogoutModal();

                }

            }
        );

    }


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        'keydown',
        function (event) {

            if (event.key !== 'Escape') {
                return;
            }


            /* CLOSE LOGOUT MODAL FIRST */

            if (
                logoutModal &&
                logoutModal.classList.contains('show')
            ) {

                closeLogoutModal();

                return;

            }


            /* CLOSE SIDEBAR */

            if (
                sidebar &&
                sidebar.classList.contains('open')
            ) {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       RESIZE
       RESET SIDEBAR WHEN DESKTOP
    ===================================================== */

    window.addEventListener(
        'resize',
        function () {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(
                function () {

                    /*
                     * Desktop:
                     * sidebar must always be visible
                     * but no mobile overlay/lock.
                     */

                    if (window.innerWidth >= 1024) {

                        closeSidebar();

                    }

                },
                100
            );

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    if (sidebar) {
        sidebar.classList.remove('open');
    }

    if (overlay) {

        overlay.classList.remove('open');

        overlay.setAttribute(
            'aria-hidden',
            'true'
        );

    }

    if (menuButton) {

        menuButton.setAttribute(
            'aria-expanded',
            'false'
        );

        menuButton.setAttribute(
            'aria-label',
            'Open menu'
        );

    }

    if (logoutModal) {

        logoutModal.classList.remove('show');

        logoutModal.setAttribute(
            'aria-hidden',
            'true'
        );

    }


    /* =====================================================
       INITIAL BODY STATE
    ===================================================== */

    document.body.classList.remove(
        'sidebar-locked'
    );

});
