import React from 'react';
import logo from './logo.svg';
import './App.css';
import Viewer from './components/Viewer';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  slider: {
    width: 300,
  },
});

// /input/mnes-muscle-cell-area/reference/reference/CapturedNo24L_2Wcont ST_HE_1.tiff
function App() {
  const classes = useStyles();
  const [maskalpha, setMaskalpha] = React.useState(80);
  const handleChange = (_event: any, newValue: any) => {
    setMaskalpha(newValue)
  };

  return (
    <div className="App">
      <h1>Muscle cell viewer</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <p>画像</p>
          <Viewer image={`${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/reference/reference/CapturedNo24L_2Wcont ST_HE_2.tiff`} mask={logo} idName='original' />
        </Grid>
        <Grid item xs={12} md={6}>
          <p>アノテーション</p>
          <Viewer image={`${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/referenceSegmentation/CapturedNo24L_2Wcont ST_HE_2.npy`} mask={logo} idName='mask' />
        </Grid>
        <Grid item xs={12}>
          <div className="outsideWrapper">
            <p>画像＋アノテーション</p>
            <div className="insideWrapper">
              <Viewer image={`${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/reference/reference/CapturedNo24L_2Wcont ST_HE_2.tiff`} mask={logo} idName='image_over' />
              <div style={{ opacity: maskalpha * 0.01 }}>
                <Viewer image={`${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/referenceSegmentation/CapturedNo24L_2Wcont ST_HE_2.npy`} mask={logo} idName='mask_over' />
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
