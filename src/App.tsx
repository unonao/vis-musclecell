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
import { Mask } from './components/data';

const useStyles = makeStyles({
  slider: {
    width: 300,
  },
});


function App() {
  const classes = useStyles()
  const [maskalpha, setMaskalpha] = React.useState(80) // OverlayのMask透過
  const [baseImageData, setBaseImageData] = React.useState<ImageData | null>(null) // base の画像データ
  const [maskImageData, setMaskImageData] = React.useState<ImageData | null>(null) // mask の画像データ
  const [maskObjects, setMaskObjects] = React.useState<Array<Mask> | null>(null) // mask のオブジェクトリスト

  const handleChange = (_event: any, newValue: any) => {
    setMaskalpha(newValue)
  }


  return (
    <div className="App">

      <h1>Muscle cell viewer</h1>

      <DataSelecter setBaseImageData={setBaseImageData} setMaskImageData={setMaskImageData} setMaskObjects={setMaskObjects} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <p>画像</p>
          <Canvas imageData={baseImageData} max_w={500} max_h={400} idName="base" />
        </Grid>
        <Grid item xs={12} md={6}>
          <p>アノテーション</p>
          <Canvas imageData={maskImageData} max_w={500} max_h={400} idName="mask" />
        </Grid>
        <Grid item xs={12}>
          <OverlayCanvas baseImageData={baseImageData} maskImageData={maskImageData} maskalpha={maskalpha} max_w={500} max_h={400} />
        </Grid>
        <Grid item xs={12}>
          <Slider className={classes.slider} value={maskalpha} onChange={handleChange} min={0} max={100} aria-labelledby="continuous-slider" />
        </Grid>
      </Grid>

      {maskObjects && maskObjects.map((mask, index) => {
        return <p>{index} {mask.rank}</p>
      })}
    </div >
  );
}

export default App;
