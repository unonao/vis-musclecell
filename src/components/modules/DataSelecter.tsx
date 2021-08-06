import React, { useEffect } from "react"
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';

import {
    createBaseImageData,
    createMaskImageData,
    Mask
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
    setMaskObjects: React.Dispatch<React.SetStateAction<Array<Mask> | null>>
}

export default function DataSelecter(props: DataSelecterProps) {
    const handleClick = (e: any) => {
        var id = e.currentTarget.value
        // base
        createBaseImageData(baseAndMaskPairList[id]['base']).then((resImageData) => props.setBaseImageData(resImageData))
        // mask
        createMaskImageData(baseAndMaskPairList[id]['mask']).then(([resImageData, masks]) => {
            props.setMaskImageData(resImageData)
            props.setMaskObjects(masks)
        })
    };
    // tiff select
    const onBaseFileChange = (event: any) => {
        createBaseImageData(event.target.files[0]).then((resImageData) => props.setBaseImageData(resImageData))
    };
    // npy select
    const onMaskFileChange = (event: any) => {
        createMaskImageData(event.target.files[0]).then(([resImageData, masks]) => {
            props.setMaskImageData(resImageData)
            props.setMaskObjects(masks)
        })
    };

    useEffect(() => {
        // base
        createBaseImageData(baseAndMaskPairList[0]['base']).then((resImageData) => props.setBaseImageData(resImageData))
        // mask
        createMaskImageData(baseAndMaskPairList[0]['mask']).then(([resImageData, masks]) => {
            props.setMaskImageData(resImageData)
            props.setMaskObjects(masks)
        })
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
                <Grid item xs={12}>画像(tiff)：<input type="file" onChange={onBaseFileChange} /></Grid>
                <Grid item xs={12}>アノテーション(npy)：<input type="file" onChange={onMaskFileChange} /></Grid>
            </Grid>
        </Grid>
    )
}
