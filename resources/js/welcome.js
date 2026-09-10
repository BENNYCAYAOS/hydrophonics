document.addEventListener("DOMContentLoaded", function () {

    /*
     * Feather Icons
     */

    if (typeof feather !== "undefined") {
        feather.replace();
    }


    /*
     * Skeleton Loading
     */

    const skeleton =
        document.getElementById("skeletonPage");

    const content =
        document.getElementById("actualContent");


    setTimeout(function () {

        if (skeleton) {
            skeleton.classList.add("hide");
        }

        if (content) {
            content.classList.add("show");
        }

    }, 900);

});
