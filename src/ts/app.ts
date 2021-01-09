import Sky from "./Sky";
import { birdImage } from "./images";

class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    time: number;
    size: size;
    score: score;
    bird: bird;
    pipes: pipe[];
    start: number;
    gameover: boolean;
    pipeConf: pipeConf;
    difficulty: number;
    sky: Sky;
    constructor() {
        this.canvas = document.createElement("canvas");

        const { canvas } = this;

        this.ctx = canvas.getContext("2d");
        this.time = 0;
        this.difficulty = 0;

        // Add Event Listener
        window.addEventListener("resize", this.handleResize.bind(this), {
            passive: true,
        });
        this.handleResize(false);

        canvas.addEventListener("click", this.handleClick.bind(this), {
            passive: true,
        });

        // Create Bird
        this.bird = {
            image: birdImage,
            x: 10,
            y: this.size.y / 2,
            dy: 0,
            size: 50,
        };

        // Create Score
        this.score = {
            current: 0,
            best: 0,
        };

        // Create Pipe Configuration
        this.pipeConf = {
            width: 120,
            xGap: 600,
        };

        // Create pipe
        this.createPipes();

        // Create gradient for sky
        this.sky = new Sky({
            ctx: this.ctx,
            size: this.size,
        });

        // Render
        document.getElementById("app").append(canvas);
        this.render();
        this.gameover = true;
    }

    createPipes() {
        // Create Pipe
        const { pipeConf } = this;
        this.pipes = [];
        for (
            let i = 0, max = Math.max(this.size.x / pipeConf.xGap + 1, 2);
            i < max;
            i++
        ) {
            this.pipes.push({
                x: pipeConf.xGap + i * pipeConf.xGap,
                gap: this.size.y / 2.5,
                topEnds: Math.random() * (this.size.y / 2),
            });
        }
    }

    handleResize(isInitialized?: boolean) {
        const { canvas } = this;
        const app = document.getElementById("app");

        if (this.size) {
            this.size.x = app.clientWidth;
            this.size.y = app.clientHeight;
        } else {
            this.size = {
                x: app.clientWidth,
                y: app.clientHeight,
            };
        }

        canvas.width = this.size.x;
        canvas.height = this.size.y;

        if (isInitialized !== false) {
            this.createPipes();
            this.sky.update();
            this.render();
            this.gameover = true;
        }
    }

    handleClick() {
        this.bird.dy = 10;

        if (this.gameover) {
            const { size, pipeConf } = this;
            this.gameover = false;
            this.score.current = 0;
            this.difficulty = 0;

            this.bird.x = 10;
            this.bird.y = size.y / 2;

            this.pipes.forEach((pipe, index) => {
                pipe.x = pipeConf.xGap + index * pipeConf.xGap;
                pipe.topEnds = Math.random() * (size.y / 2);
            });

            this.time = performance.now();
            this.render();
        }
    }

    render(timeStamp: number = 16) {
        let timeGap = timeStamp - this.time;
        this.time = timeStamp;
        (timeGap > 32 || timeGap < -32) && (timeGap = 16);
        const { ctx, size, pipeConf } = this;

        this.score.current += Math.floor(timeGap / 16);
        const { score } = this;
        this.score.best =
            score.best > score.current ? score.best : score.current;
        this.difficulty = Math.min(score.current / 3000, 1.5);

        // Sky
        this.sky.render(timeStamp);

        // Bird
        this.bird.y -= this.bird.dy -= timeGap / 32;
        const { bird } = this;
        ctx.drawImage(bird.image, bird.x, bird.y, bird.size, bird.size);

        //  Pipe
        ctx.fillStyle = "#383838";
        this.pipes.forEach((pipe) => {
            pipe.x -= timeGap / (2 - this.difficulty);
            if (
                pipe.x >= -pipeConf.width &&
                pipe.x <= size.x + pipeConf.width
            ) {
                ctx.fillRect(pipe.x, 0, pipeConf.width, pipe.topEnds);
                ctx.fillRect(
                    pipe.x,
                    pipe.topEnds + pipe.gap,
                    pipeConf.width,
                    size.y
                );
            } else if (pipe.x < -pipeConf.width) {
                pipe.x =
                    (Math.ceil(size.x / pipeConf.xGap) + 1) * pipeConf.xGap -
                    pipeConf.width;
                pipe.topEnds = Math.random() * pipe.gap;
            }

            // Check Collison
            if (
                (bird.y < pipe.topEnds || bird.y > pipe.topEnds + pipe.gap) &&
                pipe.x < bird.size
            ) {
                this.gameover = true;
                return;
            }
        });

        // Score
        ctx.fillStyle = "#f1f1f1";
        ctx.font = "bold 20px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        ctx.fillText(`Score : ${this.score.current}`, 10, 20);
        ctx.fillText(`Best : ${this.score.best}`, 10, 45);

        // Check Bird Died
        if (bird.y > size.y || this.gameover) {
            this.gameover = true;
            return;
        }
        window.requestAnimationFrame(this.render.bind(this));
    }
}

window.addEventListener("load", () => {
    new App();
});
