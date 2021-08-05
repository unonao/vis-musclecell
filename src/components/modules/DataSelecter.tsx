import React, { useEffect } from "react"
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';

import {
    createBaseImageDataFromPath,
    createMaskImageDataFromNpy,
    createBaseImageDataFromFile,
    createMaskImageDataFromFile,
} from '../data'

// 元々のデータ
const baseAndMaskPairList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num: number) => {
    return {
        'id': num,
        'base': `${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/reference/reference/CapturedNo24L_2Wcont ST_HE_${num}.tiff`,
        'mask': `${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/referenceSegmentation/CapturedNo24L_2Wcont ST_HE_${num}.npy`
    }
})



interface DataSelecterProps {
    setBaseImageData: React.Dispatch<React.SetStateAction<ImageData | null>>,
    setMaskImageData: React.Dispatch<React.SetStateAction<ImageData | null>>,
}

export default function DataSelecter(props: DataSelecterProps) {
    const handleClick = (e: any) => {
        var id = e.currentTarget.value
        // base
        createBaseImageDataFromPath(baseAndMaskPairList[id]['base']).then((resImageData) => props.setBaseImageData(resImageData))
        // mask
        createMaskImageDataFromNpy(baseAndMaskPairList[id]['mask']).then((resImageData) => props.setMaskImageData(resImageData))
    };
    // tiff select
    const onBaseFileChange = (event: any) => {
        createBaseImageDataFromFile(event.target.files[0]).then((resImageData) => props.setBaseImageData(resImageData))
    };
    // npy select
    const onMaskFileChange = (event: any) => {
        createMaskImageDataFromFile(event.target.files[0]).then((resImageData) => props.setMaskImageData(resImageData))
    };

    useEffect(() => {
        // base
        createBaseImageDataFromPath(baseAndMaskPairList[0]['base']).then((resImageData) => props.setBaseImageData(resImageData))
        // mask
        createMaskImageDataFromNpy(baseAndMaskPairList[0]['mask']).then((resImageData) => props.setMaskImageData(resImageData))
    }, [])


    return (
        <Grid container>
            <Grid item xs={12} >
                <p>既にあるデータを表示(ロード遅め)</p>
                <ButtonGroup color="primary" aria-label="outlined primary button group">
                    {baseAndMaskPairList.map((baseAndMask) => {
                        return <Button onClick={handleClick} value={baseAndMask['id'] - 1} key={baseAndMask['id']}>No.{baseAndMask['id']}</Button>
                    })}
                </ButtonGroup>
            </Grid>

            <Grid item xs={12}>
                <Grid item xs={12}><p>ローカルのファイルを表示</p></Grid>
                <Grid item xs={12}>画像：<input type="file" onChange={onBaseFileChange} /></Grid>
                <Grid item xs={12}>アノテーション：<input type="file" onChange={onMaskFileChange} /></Grid>
            </Grid>
        </Grid>
    )
}
