import React, { useState, useEffect } from "react"

export interface CanvasProps {
    imageData: ImageData | null,
    idName: string,
    max_w: number,
    max_h: number,
}

const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = document.getElementById(props.idName) as HTMLCanvasElement
        setCanvas(canvas)
    }, [props.idName])

    useEffect(() => {
        if (canvas !== null && props.imageData !== null) {
            const context = canvas!.getContext("2d")
            if (context !== null) {
                context.clearRect(0, 0, canvas!.width, canvas!.height);
                var width = props.imageData.width
                var height = props.imageData.height
                var scale = Math.min(props.max_w / width, props.max_h / height, 1)
                var dstWidth = width * scale
                var dstHeight = height * scale
                var canvasInvisible = document.createElement('canvas');
                canvasInvisible.width = width;
                canvasInvisible.height = props.imageData.height;
                var context2 = canvasInvisible.getContext('2d');
                context2!.putImageData(props.imageData, 0, 0);
                context.drawImage(canvasInvisible, 0, 0, width, height, 0, 0, dstWidth, dstHeight)
            }
        }
    }, [canvas, props.imageData, props.max_h, props.max_w])

    return <canvas height={props.max_h} width={props.max_w} id={props.idName}></canvas>
}

export default Canvas;
