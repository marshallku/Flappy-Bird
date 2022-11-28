interface Bird {
    image: HTMLImageElement;
    x: number;
    y: number;
    dy: number;
    size: number;
}

interface Size {
    x: number;
    y: number;
}

interface Score {
    current: number;
    best: number;
}

interface Pipe {
    x: number;
    gap: number;
    topEnds: number;
}

interface PipeConf {
    width: number;
    xGap: number;
}
