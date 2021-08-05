import { makeStyles } from '@material-ui/core/styles';

import Canvas from "./Canvas"

export interface OverlayCanvasProps {
    baseImageData: ImageData | null,
    maskImageData: ImageData | null,
    maskalpha: number,
    max_w: number,
    max_h: number,
}

const useStyles = makeStyles({
    outsideWrapper: {
        width: (props: OverlayCanvasProps) => props.max_w,
        height: (props: OverlayCanvasProps) => props.max_h,
        margin: 'auto',
    },
    insideWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
})



export function OverlayCanvas(props: OverlayCanvasProps) {
    const classes = useStyles(props);
    return (
        <div className={classes.outsideWrapper}>
            <p>画像＋アノテーション</p>
            <div className={classes.insideWrapper}>
                <Canvas imageData={props.baseImageData} max_w={props.max_w} max_h={props.max_h} idName="image_over" />
                <div style={{ opacity: props.maskalpha * 0.01 }}>
                    <Canvas imageData={props.maskImageData} max_w={props.max_w} max_h={props.max_h} idName="mask_over" />
                </div>
            </div>
        </div>
    )
}
