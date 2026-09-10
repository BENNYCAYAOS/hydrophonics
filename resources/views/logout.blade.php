@extends('layouts.app')

@section('content')

<div
    class="
        flex
        items-center
        justify-center

        min-h-[calc(100vh-64px)]

        p-4
    "
>

    <div
        class="w-full max-w-md p-8 text-center bg-white border border-gray-200 shadow-lg  rounded-2xl"
    >

        <div
            class="flex items-center justify-center w-16 h-16 mx-auto mb-5 text-red-600 rounded-full  bg-red-50"
        >

            <span class="text-3xl material-icons">
                logout
            </span>

        </div>


        <h1
            class="mb-3 text-2xl font-bold text-gray-800 "
        >
            Logging Out...
        </h1>


        <p
            class="mb-6 text-gray-600 "
        >
            You are being securely logged out.
            Redirecting to home page.
        </p>


        <form
            id="logout-form"

            method="POST"

            action="{{ route('logout') }}"
        >

            @csrf


            <button
                type="submit"

                class="
                    w-full

                    px-6
                    py-3

                    font-semibold

                    text-white

                    bg-blue-600

                    rounded-xl

                    transition

                    hover:bg-blue-700

                    active:scale-[0.98]
                "
            >
                Logout Now
            </button>

        </form>

    </div>

</div>


<script>

    document.addEventListener(
        'DOMContentLoaded',
        function () {

            const form =
                document.getElementById('logout-form');

            if (form) {

                setTimeout(
                    function () {

                        form.submit();

                    },
                    300
                );

            }

        }
    );

</script>

@endsection
