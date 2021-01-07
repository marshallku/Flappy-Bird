interface bird {
    image: HTMLImageElement;
    x: number;
    y: number;
    dy: number;
    size: number;
}

interface size {
    x: number;
    y: number;
}

interface score {
    current: number;
    best: number;
}

interface pipe {
    x: number;
    width: number;
    gap: number;
    topEnds: number;
}
