import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            '& th': {
                fontWeight: 'bold',
            }
        },
    }),
)

type Props = {
    weeks: {
        week: number,
        age: number,
        stdAge: number,
        count: number,
        positiv: number,
        invalid: number,
        negativ: number,
        unknown: number,
    }[]
}

const WeeklyTable: React.FC<Props> = ({ weeks }) => {
    const classes = useStyles();
    const aggregated = {
        count: 0,
        positiv: 0,
        invalid: 0,
        negativ: 0,
        unknown: 0,
    };

    weeks.forEach(week => {
        aggregated.count += week.count;
        aggregated.positiv += week.positiv;
        aggregated.invalid += week.invalid;
        aggregated.negativ += week.negativ;
        aggregated.unknown += week.unknown;
    })

    return (
        <TableContainer>
            <Table>
                <TableHead className={classes.header}>
                    <TableRow>
                        <TableCell>Woche</TableCell>
                        <TableCell>Anzahl</TableCell>
                        <TableCell>Positiv</TableCell>
                        <TableCell>Ungültig</TableCell>
                        <TableCell>Negativ</TableCell>
                        <TableCell>Unbekannt</TableCell>
                        <TableCell>Alter</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weeks.map(week => {
                        return (
                            <TableRow key={week.week}>
                                <TableCell>{week.week}</TableCell>
                                <TableCell>{week.count} <em>({week.positiv + week.invalid + week.negativ})</em></TableCell>
                                <TableCell>{week.positiv} <em>({(week.positiv / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.invalid} <em>({(week.invalid / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.negativ} <em>({(week.negativ / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.unknown} <em>({(week.unknown / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.age.toFixed(2)} <em>({week.stdAge.toFixed(2)})</em></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>{aggregated.count} <em>({aggregated.positiv + aggregated.invalid + aggregated.negativ})</em></TableCell>
                        <TableCell>{aggregated.positiv} <em>({(aggregated.positiv / aggregated.count * 100).toFixed(2)}%)</em></TableCell>
                        <TableCell>{aggregated.invalid} <em>({(aggregated.invalid / aggregated.count * 100).toFixed(2)}%)</em></TableCell>
                        <TableCell>{aggregated.negativ} <em>({(aggregated.negativ / aggregated.count * 100).toFixed(2)}%)</em></TableCell>
                        <TableCell>{aggregated.unknown} <em>({(aggregated.unknown / aggregated.count * 100).toFixed(2)}%)</em></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default WeeklyTable;