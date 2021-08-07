import { hsl2rgb } from "./hsl2rgb";
import { getPixelScale } from "./getPixelScale"

// image, mask に対するクラスの定義
var UTIF = require("utif")
var npyjs = require("npyjs")
var Tiff = require('tiff.js');



/*
// tiffから画像を表示
*/
export async function createBaseImageData(image: string | File): Promise<[ImageData, number]> {
    let imagedata: ImageData
    if (typeof (image) == 'string') {
        imagedata = await createBaseImageDataFromPath(image)
    } else {
        imagedata = await createBaseImageDataFromFile(image)
    }
    return [imagedata, getPixelScale(imagedata)]
}
// localのtiffから画像を表示
export async function createBaseImageDataFromFile(imageFile: File): Promise<ImageData> {
    var imageData: ImageData;
    var extend: string = imageFile.name.split("/").reverse()[0].split('.')[1]
    if (extend === 'tiff' || extend === 'tif') {
        imageData = await loadTifFilefWrapper(imageFile)
    } else {
        throw new Error('Not tiff file');
    }
    return imageData
}
function loadTifFilefWrapper(imageFile: File): Promise<ImageData> {
    return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = (e: any) => {
            Tiff.initialize({
                TOTAL_MEMORY: 100000000
            });
            var tiff = new Tiff({
                buffer: e.target.result
            });
            var rgba = tiff.readRGBAImage();
            var imageData = new ImageData(new Uint8ClampedArray(rgba), tiff.width(), tiff.height())
            return resolve(imageData);
        }
        reader.readAsArrayBuffer(imageFile);
    })
}


// tiff か png,jpegなどから画像を表示
async function createBaseImageDataFromPath(imagePath: string): Promise<ImageData> {
    var imageData: ImageData;
    var extend: string = imagePath.split("/").reverse()[0].split('.')[1]
    if (extend === 'tiff' || extend === 'tif') {
        imageData = await loadTiffWrapper(imagePath)
    } else {
        imageData = await loadImageWrapper(imagePath)
    }
    return imageData
}
function loadTiffWrapper(imagePath: string): Promise<ImageData> {
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest()
        xhr.responseType = 'arraybuffer'
        xhr.open('GET', imagePath)
        xhr.onload = (e: any) => {
            var ifds = UTIF.decode(e.target.response)
            UTIF.decodeImage(e.target.response, ifds[0])
            var rgba = UTIF.toRGBA8(ifds[0])  // Uint8Array with RGBA pixels
            var imageData = new ImageData(new Uint8ClampedArray(rgba), ifds[0].width, ifds[0].height)
            resolve(imageData)
        }
        xhr.send()
    })
}
function loadImageWrapper(imagePath: string): Promise<ImageData> {
    return new Promise(function (resolve) {
        const img = new Image()
        img.src = imagePath // 描画する画像など
        img.onload = async () => {
            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")
            var data = await imageToUint8Array(img, context)
            var imageData = new ImageData(data, img.width, img.height)
            resolve(imageData)
        }
    })
}

async function imageToUint8Array(image: any, context: any): Promise<Uint8ClampedArray> {
    return new Promise((resolve, reject) => {
        context.width = image.width;
        context.height = image.height;
        context.drawImage(image, 0, 0);
        context.canvas.toBlob((blob: Blob) => blob.arrayBuffer()
            .then(buffer => resolve(new Uint8ClampedArray(buffer))).catch(reject)
        )
    });
}






/*
// npyから画像を表示
*/



export class Mask {
    id: number
    pixelArea: number
    rgb: Array<number>
    constructor(id: number, pixelArea: number, rgb: Array<number>) {
        this.id = id
        this.pixelArea = pixelArea
        this.rgb = rgb
    }

}


export async function createMaskImageData(image: string | File): Promise<[ImageData, Array<Mask>]> {
    if (typeof (image) == 'string') {
        return await createMaskImageDataFromPath(image)
    } else {
        return await createMaskImageDataFromFile(image)
    }
}



// localのnpyから画像を表示
async function createMaskImageDataFromFile(imageFile: File): Promise<[ImageData, Array<Mask>]> {
    var extend: string = imageFile.name.split("/").reverse()[0].split('.')[1]
    if (extend === 'npy') {
        var [imageData, masks] = await loadNpyFilefWrapper(imageFile)
    } else {
        throw new Error('Not npy file');
    }
    return [imageData, masks]
}
async function loadNpyFilefWrapper(imageFile: File): Promise<[ImageData, Array<Mask>]> {
    return new Promise(function (resolve) {
        let n = new npyjs()
        n.readFileAsync(imageFile).then((res: any) => {
            // dtype: string, data: Uint8Array, shape: Array<number>
            var result = n.parse(res);
            var width = result.shape[1]
            var height = result.shape[0]
            var [rgba, masks] = numpy2Uint8ClampedArray(result.data)
            resolve([new ImageData(rgba, width, height), masks])
        })
    })
}

// 元々
async function createMaskImageDataFromPath(imagePath: string): Promise<[ImageData, Array<Mask>]> {
    var extend: string = imagePath.split("/").reverse()[0].split('.')[1]
    if (extend === 'npy') {
        var [imageData, masks] = await loadNpyWrapper(imagePath)
    } else {
        throw new Error('Not npy file');
    }
    return [imageData, masks]
}
function loadNpyWrapper(imagePath: string): Promise<[ImageData, Array<Mask>]> {
    return new Promise(function (resolve) {
        let n = new npyjs();
        n.load(imagePath).then((res: any) => {
            // dtype: string, data: Uint8Array, shape: Array<number>
            var width = res.shape[1]
            var height = res.shape[0]
            var [rgba, masks] = numpy2Uint8ClampedArray(res.data)
            resolve([new ImageData(rgba, width, height), masks])
        });
    })
}


function numpy2Uint8ClampedArray(data: Array<number>): [Uint8ClampedArray, Array<Mask>] {
    let res = new Uint8ClampedArray(4 * data.length)
    let unique_len = Array.from(new Set(data)).length

    let masks = new Array<Mask>(0)

    // 種類ごとにピクセル数をカウント
    let countmap = new Map();
    for (let i = 0; i < data.length; i++) {
        (countmap.has(data[i])) ? countmap.set(data[i], countmap.get(data[i]) + 1) : countmap.set(data[i], 0);
    }
    countmap.delete(0) // 0 は背景なので削除

    // 降順に255~0までの値を割り振る
    const orderlist = [...countmap.entries()].sort((a, b) => b[1] - a[1])
    let idmap = new Map() // アノテーションidと降順に並べた時の番号の対応
    for (let i = 0; i < orderlist.length; i++) {
        idmap.set(orderlist[i][0], i)
        let val: Array<number> = hsl2rgb(Math.round(i * (255 / unique_len)) / 255 / 2 * 1.5, 0.5, 0.5)
        masks.push(new Mask(orderlist[i][0], orderlist[i][1], val))
    }
    for (let i = 0; i < data.length; i++) {
        let val: Array<number>
        if (data[i] > 0) {
            val = masks[idmap.get(data[i])].rgb
        } else {
            val = new Array(3)
        }
        res[4 * i] = val[0]
        res[4 * i + 1] = val[1]
        res[4 * i + 2] = val[2]
        res[4 * i + 3] = (data[i] === 0) ? 0 : 255
    }
    return [res, masks]
}
