function app() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
        const { clientWidth } = document.getElementById("app");

        canvas.width = clientWidth;
        canvas.height = clientWidth;
    };

    handleResize();
    window.addEventListener("resize", handleResize, {
        passive: true,
    });

    document.getElementById("app").append(canvas);
}

window.addEventListener("load", () => {
    app();
});
