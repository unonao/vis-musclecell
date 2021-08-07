import React from 'react';
import './App.css';

// material ui
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';

// module
import Canvas from "./components/modules/Canvas";
import { OverlayCanvas } from "./components/modules/OverlayCanvas";
import DataSelecter from "./components/modules/DataSelecter";
import { Mask } from './components/loadData';
import { MaskVis } from './components/modules/MaskVis';

const useStyles = makeStyles({
  overlay: {
    width: 500,
    height: 400,
    marginBottom: 50,
    margin: 'auto',
  },
  slider: {
    width: 300,
  },
});


function App() {
  let max_w = 500
  let max_h = 400

  const classes = useStyles()
  const [maskalpha, setMaskalpha] = React.useState(80) // OverlayのMask透過
  const [baseImageData, setBaseImageData] = React.useState<ImageData | null>(null) // base の画像データ
  const [baseScale, setBaseScale] = React.useState<number | null>(null) // base のピクセルのスケール
  const [maskImageData, setMaskImageData] = React.useState<ImageData | null>(null) // mask の画像データ
  const [maskObjects, setMaskObjects] = React.useState<Array<Mask> | null>(null) // mask のオブジェクトリスト

  const handleChange = (_event: any, newValue: any) => {
    setMaskalpha(newValue)
  }


  return (
    <div className="App">

      <h1>Muscle cell viewer</h1>

      <DataSelecter setBaseImageData={setBaseImageData} setBaseScale={setBaseScale} setMaskImageData={setMaskImageData} setMaskObjects={setMaskObjects} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <p>画像</p>
          <Canvas imageData={baseImageData} max_w={max_w} max_h={max_h} idName="base" />
        </Grid>
        <Grid item xs={12} md={6}>
          <p>アノテーション</p>
          <Canvas imageData={maskImageData} max_w={max_w} max_h={max_h} idName="mask" />
        </Grid>
      </Grid>

      <Grid container justifyContent="center" >
        <Grid item xs={12} md={8}>
          <div className={classes.overlay}>
            <OverlayCanvas baseImageData={baseImageData} maskImageData={maskImageData} maskalpha={maskalpha} max_w={max_w} max_h={max_h} />
          </div>
          <Slider className={classes.slider} value={maskalpha} onChange={handleChange} min={0} max={100} aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MaskVis maskObjects={maskObjects} baseScale={baseScale} />
        </Grid>
      </Grid>
    </div >
  );
}

export default App;
