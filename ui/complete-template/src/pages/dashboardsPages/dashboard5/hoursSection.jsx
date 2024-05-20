
import { useTheme } from '@mui/material/styles';

import Chart from 'react-apexcharts';
import getDefaultChartsColors from '@helpers/getDefaultChartsColors';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function HoursSection() {
	return (
		<section>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={12} md={12}>
					<HoursGraph />
				</Grid>
			</Grid>
		</section>
	);
}
const getHoursGraphConfig = (config) => ({
    options: {
        colors: getDefaultChartsColors(5),
        chart: {
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
			background: '#ffffff',
        },
        grid: {
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        yaxis: {
            seriesName: 'Hours quantity',
            min: 0,
            max: 80,
            tickAmount: 8,
        },
        xaxis: {
            categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'] ,
        },
    },
    series: [
        {
            name: 'FEV1 (%)',
            data: [10, 20, 30, 40, 50, 60, 72, 20, 60, 30, 70, 12],
        },
        {
            name: 'FVC',
            data: [20, 25, 40, 50, 65, 70, 28, 89, 30, 10, 20, 30],
        },
        {
            name: '6 minute walk test',
            data: [30, 40, 50, 60, 70, 80, 70, 60, 50, 40, 30, 20],
        },
    ],
});

function HoursGraph() {
	const theme = useTheme();

	return (
		<Chart
			options={getHoursGraphConfig({ mode: theme.palette.mode })?.options}
			series={getHoursGraphConfig()?.series}
			type="bar"
			width="100%"
			height={250}
		/>
	);
}

export default HoursSection;

