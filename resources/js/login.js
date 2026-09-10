/* =========================================================
   HYDROSMART LOGIN JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       ICONS
       ===================================================== */

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const form =
        document.getElementById('loginForm');

    const button =
        document.getElementById('loginBtn');

    const spinner =
        document.getElementById('spinner');

    const loginIcon =
        document.getElementById('loginIcon');

    const loginText =
        document.getElementById('loginText');

    const password =
        document.getElementById('password');

    const togglePassword =
        document.getElementById('togglePassword');

    const email =
        document.getElementById('email');

    const remember =
        document.getElementById('remember');

    const loginSkeleton =
        document.getElementById('loginSkeleton');


    /* =====================================================
       SKELETON LOADING
       ===================================================== */

    if (loginSkeleton) {

        window.addEventListener('load', () => {

            setTimeout(() => {

                loginSkeleton.classList.add('hidden');

            }, 450);

        });

    }


    /* =====================================================
       CHECK ELEMENTS
       ===================================================== */

    if (
        !form ||
        !button ||
        !spinner ||
        !password ||
        !togglePassword ||
        !email ||
        !remember
    ) {
        return;
    }


    /* =====================================================
       SAVED EMAIL
       =====================================================

       Saves ONLY the email.

       Password is NOT stored in localStorage.
       ===================================================== */

    const savedEmail =
        localStorage.getItem(
            'hydrosmart_email'
        );


    if (savedEmail) {

        email.value =
            savedEmail;

        remember.checked =
            true;

    }


    /* =====================================================
       PASSWORD SHOW / HIDE
       ===================================================== */

    togglePassword.addEventListener(
        'click',
        () => {

            const isPassword =
                password.type === 'password';


            password.type =
                isPassword
                    ? 'text'
                    : 'password';


            togglePassword.innerHTML =
                isPassword
                    ? '<i data-lucide="eye-off"></i>'
                    : '<i data-lucide="eye"></i>';


            togglePassword.setAttribute(
                'aria-label',
                isPassword
                    ? 'Hide password'
                    : 'Show password'
            );


            if (typeof lucide !== 'undefined') {

                lucide.createIcons();

            }

        }
    );


    /* =====================================================
       LOGIN SUBMIT
       ===================================================== */

    form.addEventListener(
        'submit',
        () => {

            /* ---------------------------------------------
               REMEMBER EMAIL
            --------------------------------------------- */

            if (remember.checked) {

                localStorage.setItem(
                    'hydrosmart_email',
                    email.value
                );

            } else {

                localStorage.removeItem(
                    'hydrosmart_email'
                );

            }


            /* ---------------------------------------------
               LOGIN LOADING STATE
            --------------------------------------------- */

            spinner.classList.remove(
                'hidden'
            );


            if (loginIcon) {

                loginIcon.classList.add(
                    'hidden'
                );

            }


            if (loginText) {

                loginText.textContent =
                    'Signing in...';

            }


            button.disabled =
                true;

        }
    );

});
