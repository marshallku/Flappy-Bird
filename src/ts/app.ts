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
    pipeXGap: number;
    difficulty: number;
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

        window.addEventListener("click", this.handleClick.bind(this), {
            passive: true,
        });

        // Create Bird
        this.bird = {
            image: new Image(),
            x: 10,
            y: this.size.y / 2,
            dy: 0,
            size: 50,
        };
        this.bird.image.src =
            "https://marshall-ku.com/wp-content/uploads/2020/02/rose.svg";

        // Create Score
        this.score = {
            current: 0,
            best: 0,
        };

        // Create pipe
        this.createPipes();

        // Render
        document.getElementById("app").append(canvas);
        this.render();
        this.gameover = true;
    }

    createPipes() {
        // Create Pipe
        this.pipeXGap = 600;
        const { pipeXGap } = this;
        this.pipes = [];
        for (
            let i = 0, max = Math.max(this.size.x / pipeXGap, 1);
            i < max;
            i++
        ) {
            this.pipes.push({
                x: pipeXGap + i * pipeXGap,
                width: 120,
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
            this.render();
            this.gameover = true;
        }
    }

    handleClick() {
        this.bird.dy = 10;

        if (this.gameover) {
            const { size, pipeXGap } = this;
            this.gameover = false;
            this.score.current = 0;
            this.difficulty = 0;

            this.bird.x = 10;
            this.bird.y = size.y / 2;

            this.pipes.forEach((pipe, index) => {
                pipe.x = pipeXGap + index * pipeXGap;
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
        const { ctx, size, pipeXGap } = this;

        this.score.current += Math.floor(timeGap / 16);
        const { score } = this;
        this.score.best =
            score.best > score.current ? score.best : score.current;
        this.difficulty = Math.min(score.current / 3000, 1.5);

        // Sky
        ctx.fillStyle = "skyblue";
        ctx.fillRect(0, 0, size.x, size.y);

        // Bird
        this.bird.y -= this.bird.dy -= timeGap / 32;
        const { bird } = this;
        ctx.drawImage(bird.image, bird.x, bird.y, bird.size, bird.size);

        // Score
        ctx.fillStyle = "#121212";
        ctx.font = "bold 20px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        ctx.fillText(`Score : ${this.score.current}`, 10, 20);
        ctx.fillText(`Best : ${this.score.best}`, 10, 45);

        //  Pipe
        ctx.fillStyle = "#2e7534";
        this.pipes.forEach((pipe) => {
            pipe.x -= timeGap / (2 - this.difficulty);
            if (pipe.x >= -pipe.width && pipe.x <= size.x + pipe.width) {
                ctx.fillRect(pipe.x, 0, pipe.width, pipe.topEnds);
                ctx.fillRect(
                    pipe.x,
                    pipe.topEnds + pipe.gap,
                    pipe.width,
                    size.y
                );
            } else if (pipe.x < -pipe.width) {
                pipe.x = Math.ceil(size.x / pipeXGap) * pipeXGap - pipe.width;
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
