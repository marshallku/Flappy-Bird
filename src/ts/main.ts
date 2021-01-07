class App {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.getElementById("app").append(this.canvas);
    }
}

window.addEventListener("load", () => {
    new App();
});
