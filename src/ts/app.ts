import Sky from "./Sky";
import { birdImage } from "./images";
import { user, getUserData, saveUserData } from "./User";
import "../css/style.css";

const app = document.getElementById("app")!;

class App {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    time: number;
    size: size;
    score: score;
    bird: bird;
    pipes: pipe[];
    gameover: boolean;
    pipeConf: pipeConf;
    difficulty: number;
    sky: Sky;
    gameStarted: boolean;
    constructor({ user }: { user: user }) {
        this.canvas = document.createElement("canvas");

        const { canvas } = this;
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error();
        }

        this.ctx = context;
        this.time = 0;
        this.difficulty = 0;

        const { x, y } = this.getSize();

        // Add Event Listener
        window.addEventListener("resize", this.handleResize.bind(this), {
            passive: true,
        });

        this.size = { x, y };
        canvas.width = x;
        canvas.height = y;

        canvas.addEventListener("click", this.handleClick.bind(this), {
            passive: true,
        });

        window.addEventListener("keydown", this.handleClick.bind(this), {
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

        this.pipes = [];

        // Create Score
        this.score = {
            current: 0,
            best: user.score,
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
            renderStars: user.renderStars,
        });

        // Render
        app.append(canvas);
        this.initialRender();
        this.gameover = false;
        this.gameStarted = false;
    }

    toggleStars() {
        return this.sky.toggleRenderStars();
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

    getSize() {
        return {
            x: app.clientWidth,
            y: app.clientHeight,
        };
    }

    handleResize() {
        const { canvas } = this;
        const { x, y } = this.getSize();

        this.size.x = x;
        this.size.y = y;

        canvas.width = this.size.x;
        canvas.height = this.size.y;

        this.createPipes();
        this.sky.update();
        this.render();
        this.gameover = true;
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
        } else if (!this.gameStarted) {
            this.gameStarted = true;
            this.render();
        }
    }

    handleGameOver() {
        const { best } = this.score;

        this.gameover = true;
        if (best > user.score) {
            user.score = best;
            saveUserData();
        }
    }

    initialRender() {
        const { ctx, size, pipeConf, bird } = this;

        // Sky
        this.sky.render(0);

        // Bird
        ctx.drawImage(bird.image, bird.x, bird.y, bird.size, bird.size);

        //  Pipe
        ctx.fillStyle = "#383838";
        this.pipes.forEach((pipe) => {
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
            }
        });

        // Score
        ctx.fillStyle = "#f1f1f1";
        ctx.font = "bold 20px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        ctx.fillText(`Score : ${this.score.current}`, 10, 20);
        ctx.fillText(`Best : ${this.score.best}`, 10, 45);
    }

    render(timeStamp: number = 16) {
        console.log("rendered");
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
                return this.handleGameOver();
            }
        });

        // Score
        ctx.fillStyle = "#f1f1f1";
        ctx.font = "bold 20px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        ctx.fillText(`Score : ${this.score.current}`, 10, 20);
        ctx.fillText(`Best : ${this.score.best}`, 10, 45);

        // Check Bird Died
        if (bird.y > size.y || this.gameover) {
            return this.handleGameOver();
        }
        window.requestAnimationFrame(this.render.bind(this));
    }
}

window.addEventListener("load", () => {
    getUserData();

    const starToggle = document.getElementById("star-toggle")!;
    const app = new App({ user });

    user.renderStars === false && starToggle.classList.remove("active");

    starToggle.addEventListener("click", () => {
        const status = app.toggleStars();

        starToggle.className = `${status ? "active" : ""}`;
        user.renderStars = status;
        saveUserData();
    });
});
