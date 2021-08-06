import { hsl2rgb } from "./hsl2rgb";
// image, mask に対するクラスの定義
var UTIF = require("utif")
var npyjs = require("npyjs")
var Tiff = require('tiff.js');




/*
// npyから画像を表示
*/
export async function createBaseImageData(image: string | File): Promise<ImageData> {
    if (typeof (image) == 'string') {
        return await createBaseImageDataFromPath(image)
    } else {
        return await createBaseImageDataFromFile(image)
    }
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
export async function createMaskImageData(image: string | File): Promise<ImageData> {
    if (typeof (image) == 'string') {
        return await createMaskImageDataFromPath(image)
    } else {
        return await createMaskImageDataFromFile(image)
    }
}


// localのtiffから画像を表示
async function createMaskImageDataFromFile(imageFile: File): Promise<ImageData> {
    var imageData: ImageData;
    var extend: string = imageFile.name.split("/").reverse()[0].split('.')[1]
    if (extend === 'npy') {
        imageData = await loadNpyFilefWrapper(imageFile)
    } else {
        throw new Error('Not npy file');
    }
    return imageData
}
async function loadNpyFilefWrapper(imageFile: File): Promise<ImageData> {
    return new Promise(function (resolve) {
        let n = new npyjs()
        n.readFileAsync(imageFile).then((res: any) => {
            // dtype: string, data: Uint8Array, shape: Array<number>
            var result = n.parse(res);
            var width = result.shape[1]
            var height = result.shape[0]
            var rgba = numpy2Uint8ClampedArray(result.data)
            resolve(new ImageData(rgba, width, height))
        })
    })
}

// 元々
async function createMaskImageDataFromPath(imagePath: string): Promise<ImageData> {
    var imageData: ImageData;
    var extend: string = imagePath.split("/").reverse()[0].split('.')[1]
    if (extend === 'npy') {
        imageData = await loadNpyWrapper(imagePath)
    } else {
        throw new Error('Not npy file');
    }
    return imageData
}
function loadNpyWrapper(imagePath: string): Promise<ImageData> {
    return new Promise(function (resolve) {
        let n = new npyjs();
        n.load(imagePath).then((res: any) => {
            // dtype: string, data: Uint8Array, shape: Array<number>
            var width = res.shape[1]
            var height = res.shape[0]
            var rgba = numpy2Uint8ClampedArray(res.data)
            resolve(new ImageData(rgba, width, height))
        });
    })
}

function numpy2Uint8ClampedArray(data: Array<number>): Uint8ClampedArray {
    let res = new Uint8ClampedArray(4 * data.length)
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
        colormap.set(orderlist[i][0], Math.round(i * (255 / unique_len)))
    }
    colormap.set(0, 255)

    for (let i = 0; i < data.length; i++) {
        let val: Array<number> = hsl2rgb(colormap.get(data[i]) / 255 / 2 * 1.5, 0.5, 0.5)
        res[4 * i] = val[0]
        res[4 * i + 1] = val[1]
        res[4 * i + 2] = val[2]
        /*
        let val = colormap.get(data[i])
        res[4 * i] = 125
        res[4 * i + 1] = val
        res[4 * i + 2] = val / 2 * 1.5
        */
        res[4 * i + 3] = (data[i] === 0) ? 0 : 255
    }
    return res
}
