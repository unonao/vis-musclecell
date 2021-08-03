import React, { useEffect } from "react"
import './App.css';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Canvas from "./components/modules/Canvas";
import {
  createBaseImageDataFromPath,
  createMaskImageDataFromNpy
} from './components/data'

const useStyles = makeStyles({
  slider: {
    width: 300,
  },
});

// 元々のデータ
const baseAndMaskPairList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num: number) => {
  return {
    'id': num,
    'base': `${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/reference/reference/CapturedNo24L_2Wcont ST_HE_${num}.tiff`,
    'mask': `${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/referenceSegmentation/CapturedNo24L_2Wcont ST_HE_${num}.npy`
  }
})

// /input/mnes-muscle-cell-area/reference/reference/CapturedNo24L_2Wcont ST_HE_1.tiff
function App() {
  const classes = useStyles()
  const [maskalpha, setMaskalpha] = React.useState(80)
  const [selectedBaseFile, setSelectedBaseFile] = React.useState()
  const [baseImageData, setBaseImageData] = React.useState<ImageData | null>(null)
  const [maskImageData, setMaskImageData] = React.useState<ImageData | null>(null)
  const handleChange = (_event: any, newValue: any) => {
    setMaskalpha(newValue)
  }

  // On file select (from the pop up)
  const onFileChange = (event: any) => {
    setSelectedBaseFile(event.target.files[0]);
  };

  useEffect(() => {
    // base
    createBaseImageDataFromPath(baseAndMaskPairList[0]['base']).then((resImageData) => setBaseImageData(resImageData))
    // mask
    createMaskImageDataFromNpy(baseAndMaskPairList[0]['mask']).then((resImageData) => setMaskImageData(resImageData))
  }, [])


  const handleClick = (e: any) => {
    var id = e.currentTarget.value
    // base
    createBaseImageDataFromPath(baseAndMaskPairList[id]['base']).then((resImageData) => setBaseImageData(resImageData))
    // mask
    createMaskImageDataFromNpy(baseAndMaskPairList[id]['mask']).then((resImageData) => setMaskImageData(resImageData))
  };

  return (
    <div className="App">

      <h1>Muscle cell viewer</h1>

      <Grid container spacing={3}>
        <Grid item xs={12} spacing={5}>
          <p>既にあるデータを表示する</p>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            {
              baseAndMaskPairList.map((baseAndMask) => {
                return <Button onClick={handleClick} value={baseAndMask['id'] - 1} key={baseAndMask['id']}>No.{baseAndMask['id']}</Button>
              })
            }
          </ButtonGroup>
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={12}><p>自分でアップロード</p></Grid>
          <Grid item xs={12}>画像：<input type="file" onChange={onFileChange} /></Grid>
          <Grid item xs={12}>アノテーション：<input type="file" onChange={onFileChange} /></Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <p>画像</p>
          <Canvas imageData={baseImageData} max_w={500} max_h={400} idName="base" />
        </Grid>
        <Grid item xs={12} md={6}>
          <p>アノテーション</p>
          <Canvas imageData={maskImageData} max_w={500} max_h={400} idName="mask" />
        </Grid>
        <Grid item xs={12}>
          <div className="outsideWrapper">
            <p>画像＋アノテーション</p>
            <div className="insideWrapper">
              <Canvas imageData={baseImageData} max_w={500} max_h={400} idName="image_over" />
              <div style={{ opacity: maskalpha * 0.01 }}>
                <Canvas imageData={maskImageData} max_w={500} max_h={400} idName="mask_over" />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Slider
            className={classes.slider}
            value={maskalpha}
            onChange={handleChange}
            min={0}
            max={100}
            aria-labelledby="continuous-slider" />
        </Grid>
      </Grid>
    </div >
  );
}

export default App;
