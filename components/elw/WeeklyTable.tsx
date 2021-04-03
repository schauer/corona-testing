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
        canceled: number,
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
        canceled: 0,
    };

    weeks.forEach(week => {
        aggregated.count += week.count;
        aggregated.positiv += week.positiv;
        aggregated.invalid += week.invalid;
        aggregated.negativ += week.negativ;
        aggregated.unknown += week.unknown;
        aggregated.canceled += week.canceled;
    });

    const aggregatedTestedCount = aggregated.positiv + aggregated.invalid + aggregated.negativ;

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
                        <TableCell>Storniert</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weeks.map(week => {
                        const testedCount = week.positiv + week.invalid + week.negativ;
                        return (
                            <TableRow key={week.week}>
                                <TableCell>{week.week}</TableCell>
                                <TableCell>{week.count} <em>({testedCount})</em></TableCell>
                                <TableCell>{week.positiv} {testedCount > 0 && <em>({(week.positiv / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                <TableCell>{week.invalid} {testedCount > 0 && <em>({(week.invalid / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                <TableCell>{week.negativ} {testedCount > 0 && <em>({(week.negativ / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                <TableCell>{week.unknown} <em>({(week.unknown / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.canceled} <em>({(week.canceled / week.count * 100).toFixed(2)}%)</em></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>{aggregated.count} <em>({aggregatedTestedCount})</em></TableCell>
                        <TableCell>{aggregated.positiv} {aggregatedTestedCount > 0 && <em>({(aggregated.positiv / aggregatedTestedCount * 100).toFixed(2)}%)</em>}</TableCell>
                        <TableCell>{aggregated.invalid} {aggregatedTestedCount > 0 && <em>({(aggregated.invalid / aggregatedTestedCount * 100).toFixed(2)}%)</em>}</TableCell>
                        <TableCell>{aggregated.negativ} {aggregatedTestedCount > 0 && <em>({(aggregated.negativ / aggregatedTestedCount * 100).toFixed(2)}%)</em>}</TableCell>
                        <TableCell>{aggregated.unknown} <em>({(aggregated.unknown / aggregated.count * 100).toFixed(2)}%)</em></TableCell>
                        <TableCell>{aggregated.canceled} <em>({(aggregated.canceled / aggregated.count * 100).toFixed(2)}%)</em></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default WeeklyTable;