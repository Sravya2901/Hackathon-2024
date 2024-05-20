import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {TextField, Grid, Typography, Paper} from '@mui/material';
import CardHeader from '@/components/cardHeader';
// import { Typography,Paper} from '@mui/material';
import HoursSection from './hoursSection';

function Dashboard5() {
	return (
		<>
			<Header />
			{/* <TabsNav /> */}
			<HoursSection />
			<StatsRow/>
			{/* <Divider
				sx={{
					my: 8,
				}}
			/>
			<ReportSection />
			<Divider
				sx={{
					my: 8,
				}}
			/>
			<PopularProductsSection /> */}
		</>
	);
}
function StatCard({ title, value , color}) {
	return (
	  <Paper elevation={3} sx={ {padding: 2, backgroundColor: color || 'default', textAlign: 'center' }}><Stack  spacing={1} alignItems="center"><Typography variant="h5">{title}</Typography><Typography variant="h3">{value}</Typography></Stack></Paper>
	);
  }
  
  // Adjusting StatsRow to use function declaration
  function StatsRow() {
	return (
	  <Grid container spacing={2} marginTop={1} marginBottom={2}><Grid item xs={3} ><StatCard title="" value="Music Therapy & VR Simulators" color="#c8e6c9"/></Grid><Grid item xs={3} ><StatCard title="" value="Community And Support Groups" color="#58abf3"/></Grid><Grid item xs={3}><StatCard title="" value="Pranayama Yoga For Breath Control" color="#f9e593"/></Grid><Grid item xs={3}><StatCard title="" value="Exercise Routine & Dietary Needs" color="#de98f2" /></Grid></Grid>
	);
  }
function Header() {
	return (
		<CardHeader
			sx={{
				mt: 4,
			}}
			size="large"
			title="Good morning, Elizabeth!"
			subtitle={`Today is ${new Date().toLocaleDateString('default', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}`}
		>
			<Stack
				pt={{ xs: 5, sm: 0 }}
				divider={<Divider orientation="vertical" flexItem />}
				direction="row"
				alignItems="center"
				spacing={3}
			>
				<Grid item xs={6} sm={3} md={3}><TextField label="FEV1 (%)" variant="outlined" fullWidth value={0}  /></Grid><Grid item xs={6} sm={3} md={3}><TextField label="BMI (kg/m²)" variant="outlined" fullWidth  value={0}  /></Grid>
						<Grid item xs={6} sm={3} md={3}><TextField label="alpha-1 level" variant="outlined" fullWidth  value={0} /></Grid><Grid item xs={6} sm={3} md={3}><TextField label="6 minute walk test(m)" variant="outlined" fullWidth  value={0} /></Grid>
				{/* <Stack direction="row" spacing={2} alignItems="center">
					<Typography variant="subtitle1" fontSize={35} display="inline">
						$1,433
					</Typography>
					<Typography variant="caption" textTransform="uppercase">
						Earnings <br />
						for today
					</Typography>
				</Stack>
				<Stack direction="row" spacing={2} alignItems="center">
					<Typography variant="subtitle1" fontSize={35} display="inline">
						$296
					</Typography>
					<Typography variant="caption" textTransform="uppercase">
						Expenses <br />
						for today
					</Typography>
				</Stack> */}
			</Stack>
			{/* <StatsRow/> */}
		</CardHeader>
	);
}

function TabsNav() {
	const [value, setValue] = useState(0);
	const [slot, setSlot] = useState('Today');

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<Box
			sx={{
				borderBottom: 1,
				borderColor: 'divider',
			}}
		>
			<Tabs
				value={value}
				onChange={handleChange}
				variant="scrollable"
				aria-label="grap type"
				scrollButtons="auto"
				allowScrollButtonsMobile
			>
				<Tab label="Overview" />
				<Tab label="Employee" />
				<Tab label="Products" />
				<Tab label="Misc" />
				<Box flexGrow={1} />
				{/* <Stack
					spacing={0}
					direction="row"
					divider={<Divider orientation="vertical" flexItem />}
				>
					{['Today', 'This Week', 'This Month'].map((tab, i) => (
						<Button key={i} size="small">
							{tab}
						</Button>
					))}
				</Stack> */}
				<Stack direction="row" alignItems="center" spacing={0}>
					{['Today', 'This Week', 'This Month'].map((tab, i) => (
						<Button
							key={i}
							size="small"
							onClick={() => setSlot(tab)}
							variant={slot === tab ? 'outlined' : 'text'}
							sx={{
								color: slot === tab ? 'primary.main' : 'text.secondary',
							}}
						>
							{tab}
						</Button>
					))}
				</Stack>
			</Tabs>
		</Box>
	);
}

export default Dashboard5;


