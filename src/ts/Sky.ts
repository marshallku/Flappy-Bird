export default class Sky {
    props: SkyProps;
    skyGradient?: CanvasGradient;
    constructor(props: SkyProps) {
        this.props = props;
        this.skyGradient = this.props.ctx.createLinearGradient(
            0,
            0,
            0,
            this.props.size.y
        );
        this.skyGradient.addColorStop(0, "#00111e");
        this.skyGradient.addColorStop(1, "#0a2342");
    }

    render() {
        const { ctx } = this.props;

        if (!this.skyGradient) return;

        ctx.fillStyle = this.skyGradient;
        ctx.fillRect(0, 0, this.props.size.x, this.props.size.y);
    }
}
