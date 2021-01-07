class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.createElement("canvas");

        const { canvas } = this;

        this.ctx = canvas.getContext("2d");

        window.addEventListener("resize", this.handleResize.bind(this), {
            passive: true,
        });
        this.handleResize();

        document.getElementById("app").append(canvas);
    }

    handleResize() {
        const { canvas } = this;
        const { clientWidth } = document.getElementById("app");

        canvas.width = clientWidth;
        canvas.height = clientWidth;
    }
}

window.addEventListener("load", () => {
    new App();
});
