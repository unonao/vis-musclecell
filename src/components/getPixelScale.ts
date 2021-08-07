/*
BaseのImageData をもとに、1pixelが何μmかを計算する
*/


export function getPixelScale(baseImage: ImageData): number {
    let ans = 0
    let cnt = 0
    for (let i = 0; i < baseImage.data.length; i += 4) {
        (baseImage.data[i] > 250) ? cnt++ : cnt = 0
        ans = Math.max(ans, cnt)
    }
    return 100 / ans  // ansピクセルで100μm → 1ピクセルで 100/ansμm
}
