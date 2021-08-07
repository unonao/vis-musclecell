import { makeStyles } from '@material-ui/core/styles';
//import { Avatar } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Mask } from '../data'



const useStyles = makeStyles({
    table: {
        minWidth: 200,
    },
});

interface maskProps {
    maskObjects: Array<Mask> | null
}
export function MaskVis(props: maskProps) {
    const classes = useStyles();
    console.log(props)
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>番号</TableCell>
                        <TableCell align="right">ピクセル</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.maskObjects && props.maskObjects.map((mask, index) => {
                        return < TableRow key={mask.id} >
                            <TableCell style={{ backgroundColor: `rgb(${mask.rgb[0]},${mask.rgb[1]},${mask.rgb[2]})` }} component="th" scope="row">
                                {index}
                            </TableCell>
                            <TableCell align="right">{mask.pixelArea}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer >
    )
}
