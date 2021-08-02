import logo from './logo.svg';
import './App.css';
import Viewer from './components/Viewer';
import Grid from '@material-ui/core/Grid';

// /input/mnes-muscle-cell-area/reference/reference/CapturedNo24L_2Wcont ST_HE_1.tiff
function App() {
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
        <div className="outsideWrapper">
          <p>画像＋アノテーション</p>
          <div className="insideWrapper">
            <Viewer image={`${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/reference/reference/CapturedNo24L_2Wcont ST_HE_2.tiff`} mask={logo} idName='image_over' />
            <Viewer image={`${process.env.PUBLIC_URL}/input/mnes-muscle-cell-area/referenceSegmentation/CapturedNo24L_2Wcont ST_HE_2.npy`} mask={logo} idName='mask_over' />
          </div>
        </div>
      </Grid>
    </div>
  );
}

export default App;
