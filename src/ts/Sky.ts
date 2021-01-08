export default class Sky {
    props: skyProps;
    skyGradient: CanvasGradient;
    stars: star[];
    constructor(props: skyProps) {
        this.props = props;
        this.update();
    }

    random(max: number) {
        return Math.floor(Math.random() * max);
    }

    createStars(spacing: number): star[] {
        const arr = [];
        const { size } = this.props;

        for (let x = 0; x < size.x; x += spacing) {
            for (let y = 0; y < size.y; y += spacing) {
                const star = {
                    x: x + this.random(spacing),
                    y: y + this.random(spacing),
                    r: Math.random() * 1.5,
                };
                arr.push(star);
            }
        }

        return arr;
    }

    getStarOpacity(factor: number) {
        const opacityIncrement = 0.6 * Math.abs(Math.sin(factor));
        const opacity = 0.1 + opacityIncrement;

        return opacity;
    }

    fillCircle(x: number, y: number, r: number, fillStyle: string) {
        const { ctx } = this.props;

        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.skyGradient = this.props.ctx.createLinearGradient(
            0,
            0,
            0,
            this.props.size.y
        );
        this.skyGradient.addColorStop(0, "#00111e");
        this.skyGradient.addColorStop(1, "#0a2342");

        this.stars = this.createStars(30);
    }

    render(timeStamp: number) {
        const { ctx } = this.props;
        const time = timeStamp / 180;

        ctx.fillStyle = this.skyGradient;
        ctx.fillRect(0, 0, this.props.size.x, this.props.size.y);

        this.stars.forEach((star, index) => {
            this.fillCircle(
                star.x,
                star.y,
                star.r,
                `hsla(${Math.floor(
                    Math.random() * 360 + 1
                )}, 30%, 80%, ${this.getStarOpacity(time + index)})`
            );
        });
    }
}
