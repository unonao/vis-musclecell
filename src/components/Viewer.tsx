import React, { useState, useEffect } from "react"
var UTIF = require("utif")
var npyjs = require("npyjs")


function numpy2Uint8Array(data: Array<number>): Array<number> {
    let res = new Array(4 * data.length)
    let unique_len = Array.from(new Set(data)).length

    // 種類ごとにピクセル数をカウント
    let countmap = new Map();
    for (let i = 0; i < data.length; i++) {
        (countmap.has(data[i])) ? countmap.set(data[i], countmap.get(data[i]) + 1) : countmap.set(data[i], 0);
    }
    countmap.delete(0) // 0 は背景なので削除

    // 降順に255~0までの値を割り振る
    const orderlist = [...countmap.entries()].sort((a, b) => b[1] - a[1])
    let colormap = new Map()
    for (let i = 0; i < orderlist.length; i++) {
        colormap.set(orderlist[i][0], Math.round(i * (255 / unique_len / 2)))
    }
    colormap.set(0, 255)

    for (let i = 0; i < data.length; i++) {
        let val = colormap.get(data[i])
        res[4 * i] = val
        res[4 * i + 1] = val
        res[4 * i + 2] = val
        res[4 * i + 3] = (data[i] == 0) ? 0 : 255
    }
    return res
}


export interface ViewerProps {
    image: string,
    mask: string,
    idName: string,
}

const max_w = 500
const max_h = 400

const Viewer: React.FC<ViewerProps> = (props: ViewerProps) => {

    // contextを状態として持つ
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

    useEffect(() => {
        const canvas = document.getElementById(props.idName) as HTMLCanvasElement
        const canvasContext = canvas!.getContext("2d")
        setContext(canvasContext)
    }, [props.idName])

    // 状態にコンテキストが登録されたらそれに対して操作できる
    useEffect(() => {
        if (context !== null) {
            var extend: string = props.image.split("/").reverse()[0].split('.')[1]
            if (extend === 'tiff') {
                var xhr = new XMLHttpRequest()
                xhr.responseType = 'arraybuffer'
                xhr.open('GET', props.image)
                xhr.onload = function (e: any) {
                    var ifds = UTIF.decode(e.target.response)
                    UTIF.decodeImage(e.target.response, ifds[0])
                    var rgba = UTIF.toRGBA8(ifds[0])  // Uint8Array with RGBA pixels
                    var width = ifds[0].width
                    var height = ifds[0].height
                    var scale = Math.min(max_w / width, max_h / height, 1)
                    var dstWidth = width * scale
                    var dstHeight = height * scale
                    const imageData = context.createImageData(width, height)
                    for (let i = 0; i < rgba.length; i++) {
                        imageData.data[i] = rgba[i]
                    }
                    var canvasInvisible = document.createElement('canvas');
                    canvasInvisible.width = width;
                    canvasInvisible.height = height;
                    var context2 = canvasInvisible.getContext('2d');
                    context2!.putImageData(imageData, 0, 0);
                    context.drawImage(canvasInvisible, 0, 0, width, height, 0, 0, dstWidth, dstHeight)
                }
                xhr.send()
            } else if (extend === 'npy') {
                let n = new npyjs();
                n.load(props.image).then((res: any) => {
                    // dtype: string, data: Uint8Array, shape: Array<number>
                    var width = res.shape[1]
                    var height = res.shape[0]
                    var scale = Math.min(max_w / width, max_h / height, 1)
                    var dstWidth = width * scale
                    var dstHeight = height * scale
                    const imageData = context.createImageData(width, height)
                    var rgba = numpy2Uint8Array(res.data)
                    for (let i = 0; i < rgba.length; i++) {
                        imageData.data[i] = rgba[i]
                    }
                    var canvasInvisible = document.createElement('canvas');
                    canvasInvisible.width = width;
                    canvasInvisible.height = height;
                    var context2 = canvasInvisible.getContext('2d');
                    context2!.putImageData(imageData, 0, 0);
                    context.drawImage(canvasInvisible, 0, 0, width, height, 0, 0, dstWidth, dstHeight)
                });
            } else {
                const img = new Image()
                img.src = props.image // 描画する画像など
                img.onload = () => {
                    var width = img.width
                    var height = img.height
                    var scale = Math.min(max_w / width, max_h / height, 1)
                    var dstWidth = width * scale
                    var dstHeight = height * scale
                    console.log(width, height, dstWidth, dstHeight)
                    context.drawImage(img, 0, 0, width, height, 0, 0, dstWidth, dstHeight)
                    // 更にこれに続いて何か処理をしたい場合
                }
            }
        }
    }, [context, props.image])

    return <canvas height={max_h} width={max_w} id={props.idName}></canvas>
}

export default Viewer;
