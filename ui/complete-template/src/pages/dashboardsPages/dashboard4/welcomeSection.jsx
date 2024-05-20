import Stack from '@mui/material/Stack';
// import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import  { useState, useEffect } from 'react';
import axios from 'axios';
import CardHeader from '@/components/cardHeader';

// function WelcomeSection() {
// 	return (
// 		<section>
// 			<Grid container spacing={3}>
// 				<Grid item xs={12} sm={12} md={12}>
// 					<SideCard />
// 				</Grid>
// 			</Grid>
// 		</section>
// 	);
// }
function WelcomeSection() {
	const [aqiData, setAqiData] = useState(null);
	const sendAlertToBackend = async () => {
		try {
		  const response = await fetch('http://localhost:5000/send', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({ to: '+917801049826', body: 'hi' }),
		  });
		  
		  if (response) {
			console.log('Message sent successfully');
		  } else {
			console.error('Failed to send message:', response.statusText);
		  }
		} catch (error) {
		  console.error('Error sending message:', error.message);
		}
	  };
	useEffect(() => {
		const fetchAQI = async () => {
		  try {
			const response = await axios.get('https://api.waqi.info/feed/hyderabad/?token=5623bcaf76f66784071cbde1be0ba9abf4377a06');
			setAqiData(response.data);
		  } catch (error) {
			console.error('Error fetching AQI data:', error);
		  }
		};
		fetchAQI();
	  }, []);
	
	  useEffect(() => {
		if (aqiData && aqiData?.status === 'ok' && aqiData?.data?.aqi > 20) {
			// console.log('aqi')
		   sendAlertToBackend();
		}
	  });
	
	return (
		<Card>
			<CardHeader title="Air Quality Index" size="large" />
				<Typography variant="body2" fontSize={35} color="primary.main">
					{aqiData?.data?.aqi}
				</Typography>
		</Card>
	);
}

export default WelcomeSection;
