<x-app-layout>

    <x-slot name="header">

        <!-- =================================================
             PROFILE HEADER
             SAME GLOBAL HEADER DESIGN AS DASHBOARD
        ================================================== -->

        <div class="profile-page-header-content">

            <div class="profile-page-header-text">

                <p class="eyebrow">
                    HYDROSMART ACCOUNT
                </p>

                <h1>
                    Profile
                </h1>

                <p>
                    Manage your account information and security settings.
                </p>

            </div>

        </div>

    </x-slot>


    <!-- =====================================================
         PROFILE PAGE
    ====================================================== -->

    <div class="profile-page">

        <!-- =================================================
             PROFILE CONTENT
        ================================================== -->

        <div class="profile-content">


            <!-- =================================================
                 PROFILE INFORMATION CARD
            ================================================== -->

            <section class="profile-card">

                <!-- CARD HEADER -->

                <div class="profile-card-header">

                    <div class="profile-card-icon">

                        <span class="material-icons">
                            person
                        </span>

                    </div>

                    <div class="profile-card-title">

                        <h2>
                            Profile Information
                        </h2>

                        <p>
                            Update your account name and email address.
                        </p>

                    </div>

                </div>


                <!-- =================================================
                     EMAIL VERIFICATION FORM
                ================================================== -->

                <form
                    id="send-verification"
                    method="post"
                    action="{{ route('verification.send') }}"
                >

                    @csrf

                </form>


                <!-- =================================================
                     PROFILE UPDATE FORM
                ================================================== -->

                <form
                    method="post"
                    action="{{ route('profile.update') }}"
                    class="profile-form"
                >

                    @csrf

                    @method('patch')


                    <!-- =================================================
                         NAME
                    ================================================== -->

                    <div class="profile-field">

                        <label for="name">
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value="{{ old('name', $user->name) }}"
                            required
                            autofocus
                            autocomplete="name"
                        >


                        @if ($errors->get('name'))

                            @foreach ($errors->get('name') as $message)

                                <p class="profile-error">
                                    {{ $message }}
                                </p>

                            @endforeach

                        @endif

                    </div>


                    <!-- =================================================
                         EMAIL
                    ================================================== -->

                    <div class="profile-field">

                        <label for="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value="{{ old('email', $user->email) }}"
                            required
                            autocomplete="username"
                        >


                        @if ($errors->get('email'))

                            @foreach ($errors->get('email') as $message)

                                <p class="profile-error">
                                    {{ $message }}
                                </p>

                            @endforeach

                        @endif


                        <!-- =================================================
                             EMAIL VERIFICATION
                        ================================================== -->

                        @if (
                            $user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail
                            && ! $user->hasVerifiedEmail()
                        )

                            <div class="profile-verification">

                                <p>

                                    Your email address is currently unverified.

                                    <button
                                        form="send-verification"
                                        type="submit"
                                    >
                                        Resend verification email
                                    </button>

                                </p>


                                @if (session('status') === 'verification-link-sent')

                                    <p class="profile-verification-success">

                                        A new verification link has been sent
                                        to your email address.

                                    </p>

                                @endif

                            </div>

                        @endif

                    </div>


                    <!-- =================================================
                         SAVE ACTION
                    ================================================== -->

                    <div class="profile-actions">

                        <button
                            type="submit"
                            class="profile-save-button"
                        >

                            <span class="material-icons">
                                save
                            </span>

                            Save Changes

                        </button>


                        @if (session('status') === 'profile-updated')

                            <span class="profile-saved">
                                Saved successfully.
                            </span>

                        @endif

                    </div>

                </form>

            </section>


            <!-- =================================================
                 UPDATE PASSWORD
            ================================================== -->

            <section class="profile-card profile-password-card">

                <!-- CARD HEADER -->

                <div class="profile-card-header">

                    <div class="profile-card-icon green">

                        <span class="material-icons">
                            lock
                        </span>

                    </div>

                    <div class="profile-card-title">

                        <h2>
                            Update Password
                        </h2>

                        <p>
                            Keep your HYDROSMART account secure.
                        </p>

                    </div>

                </div>


                <!-- =================================================
                     PASSWORD FORM
                ================================================== -->

                <form
                    method="post"
                    action="{{ route('password.update') }}"
                    class="profile-form"
                >

                    @csrf

                    @method('put')


                    <!-- =================================================
                         CURRENT PASSWORD
                    ================================================== -->

                    <div class="profile-field">

                        <label for="update_password_current_password">
                            Current Password
                        </label>

                        <input
                            id="update_password_current_password"
                            name="current_password"
                            type="password"
                            autocomplete="current-password"
                        >


                        @if ($errors->updatePassword->get('current_password'))

                            @foreach (
                                $errors->updatePassword->get('current_password')
                                as $message
                            )

                                <p class="profile-error">
                                    {{ $message }}
                                </p>

                            @endforeach

                        @endif

                    </div>


                    <!-- =================================================
                         NEW PASSWORD
                    ================================================== -->

                    <div class="profile-field">

                        <label for="update_password_password">
                            New Password
                        </label>

                        <input
                            id="update_password_password"
                            name="password"
                            type="password"
                            autocomplete="new-password"
                        >


                        @if ($errors->updatePassword->get('password'))

                            @foreach (
                                $errors->updatePassword->get('password')
                                as $message
                            )

                                <p class="profile-error">
                                    {{ $message }}
                                </p>

                            @endforeach

                        @endif

                    </div>


                    <!-- =================================================
                         CONFIRM PASSWORD
                    ================================================== -->

                    <div class="profile-field">

                        <label for="update_password_password_confirmation">
                            Confirm New Password
                        </label>

                        <input
                            id="update_password_password_confirmation"
                            name="password_confirmation"
                            type="password"
                            autocomplete="new-password"
                        >


                        @if (
                            $errors->updatePassword->get(
                                'password_confirmation'
                            )
                        )

                            @foreach (
                                $errors->updatePassword->get(
                                    'password_confirmation'
                                ) as $message
                            )

                                <p class="profile-error">
                                    {{ $message }}
                                </p>

                            @endforeach

                        @endif

                    </div>


                    <!-- =================================================
                         PASSWORD ACTION
                    ================================================== -->

                    <div class="profile-actions">

                        <button
                            type="submit"
                            class="profile-save-button"
                        >

                            <span class="material-icons">
                                lock_reset
                            </span>

                            Update Password

                        </button>


                        @if (session('status') === 'password-updated')

                            <span class="profile-saved">
                                Password updated.
                            </span>

                        @endif

                    </div>

                </form>

            </section>


            <!-- =================================================
                 DELETE ACCOUNT
            ================================================== -->

            <section class="profile-card profile-delete-card">

                <!-- CARD HEADER -->

                <div class="profile-card-header">

                    <div class="profile-card-icon red">

                        <span class="material-icons">
                            warning
                        </span>

                    </div>

                    <div class="profile-card-title">

                        <h2>
                            Delete Account
                        </h2>

                        <p>
                            Permanently remove your HYDROSMART account.
                        </p>

                    </div>

                </div>


                <!-- =================================================
                     DELETE WARNING
                ================================================== -->

                <div class="profile-delete-warning">

                    Once your account is deleted, all of its resources
                    and data will be permanently deleted.

                </div>


                <!-- =================================================
                     DELETE ACCOUNT BUTTON
                ================================================== -->

                <button
                    type="button"
                    class="profile-delete-button"
                    x-data
                    x-on:click.prevent="$dispatch(
                        'open-modal',
                        'confirm-user-deletion'
                    )"
                >

                    <span class="material-icons">
                        delete
                    </span>

                    Delete Account

                </button>


                <!-- =================================================
                     DELETE MODAL
                ================================================== -->

                <x-modal
                    name="confirm-user-deletion"
                    :show="$errors->userDeletion->isNotEmpty()"
                    focusable
                >

                    <form
                        method="post"
                        action="{{ route('profile.destroy') }}"
                        class="profile-modal"
                    >

                        @csrf

                        @method('delete')


                        <!-- =================================================
                             MODAL TITLE
                        ================================================== -->

                        <h2>
                            Are you sure you want to delete your account?
                        </h2>


                        <!-- =================================================
                             MODAL DESCRIPTION
                        ================================================== -->

                        <p>

                            Once your account is deleted, all of its
                            resources and data will be permanently deleted.

                            Please enter your password to confirm.

                        </p>


                        <!-- =================================================
                             DELETE PASSWORD
                        ================================================== -->

                        <div class="profile-field">

                            <label for="delete_password">
                                Password
                            </label>

                            <input
                                id="delete_password"
                                name="password"
                                type="password"
                                autocomplete="current-password"
                                placeholder="Enter your password"
                            >


                            @if ($errors->userDeletion->get('password'))

                                @foreach (
                                    $errors->userDeletion->get('password')
                                    as $message
                                )

                                    <p class="profile-error">
                                        {{ $message }}
                                    </p>

                                @endforeach

                            @endif

                        </div>


                        <!-- =================================================
                             MODAL ACTIONS
                        ================================================== -->

                        <div class="profile-modal-actions">

                            <!-- CANCEL -->

                            <button
                                type="button"
                                class="profile-cancel-button"
                                x-on:click="$dispatch('close')"
                            >

                                Cancel

                            </button>


                            <!-- CONFIRM DELETE -->

                            <button
                                type="submit"
                                class="profile-delete-button"
                            >

                                <span class="material-icons">
                                    delete_forever
                                </span>

                                Delete Account

                            </button>

                        </div>

                    </form>

                </x-modal>

            </section>

        </div>

    </div>

</x-app-layout>
