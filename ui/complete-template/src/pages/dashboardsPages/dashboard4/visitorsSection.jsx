import { useState, useEffect, useMemo, React, Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardHeader from '@/components/cardHeader';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Map, { Marker, NavigationControl, Source, Layer, Popup } from 'react-map-gl';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import 'mapbox-gl/dist/mapbox-gl.css';
import Alert from '@mui/material/Alert';
import Modal from '@/components/modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import { TransitionGroup, Transition as ReactTransition } from 'react-transition-group';
import { getDefaultTransitionStyles } from '@helpers/getTransitionStyles';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import useAutoCounter from '@hooks/useAutoCounter';
import TodoListCard from '../dashboard2/todoListCard';
import benchIcon from './bench.jpg'

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3JhdnlhMjkwMSIsImEiOiJjbHczZmEyaHkweWkxMnFwN2YyOXplM2UwIn0.lMLQpQNKaNfDI4kh77R3Hw'; // Add your Mapbox token here
const TIMEOUT = 300;
const transitionStyles = getDefaultTransitionStyles(TIMEOUT);
function VisitorsSection() {
  const [showRoutes, setShowRoutes] = useState(false); // State to track whether to show routes or not
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  // const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedPointInfo, setSelectedPointInfo] = useState(null);
  const [restingSpots, setRestingSpots] = useState([]);
  const [selectedRestingSpot, setSelectedRestingSpot] = useState(null);
  const [isBasicModal, setIsBasicModal] = useState(false);
  const [routesWithScores, setRoutesWithScores] = useState([])

  const fetchAutoCompleteOptions = async (input, setOptions) => {
    if (!input) {
      setOptions([]);
      return;
    }
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=${MAPBOX_TOKEN}`);
    const data = await response.json();
    setOptions(data.features.map(feature => ({
      label: feature.place_name,
      value: feature
    })));
  };

  const handleSourceChange = (event, value) => {
    setSource(value);
  };

  const handleDestinationChange = (event, value) => {
    setDestination(value);
  };

  const fetchAQIData = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=82d53f60ea35e44078e569a28d0b72ab5ec1ed6e`);
      const data = await response.json();
      console.log(data);
      if (data.status === 'ok') {
        return data.data.aqi; // Return AQI value
      }
      return null;
    } catch (error) {
      console.error('Error fetching AQI data:', error);
      return null;
    }
  };

  const fetchElevationData = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${longitude},${latitude}.json?layers=contour&limit=50&access_token=${MAPBOX_TOKEN}`);
      const data = await response.json();
      console.log(data);
      if (data.features && data.features.length > 0) {
        const elevation = data.features[0]?.properties?.ele;
        console.log('Elevation:', elevation); // Log elevation data
        return elevation; // Return elevation
      }
      console.error('No elevation data found in the response');
      return null;
    } catch (error) {
      console.error('Error fetching elevation data:', error);
      return null;
    }
  };

  const fetchPathData = async (path) => {
    const pathData = await Promise.all(path.map(async (point) => {
      const [longitude, latitude] = point;
      const aqiPromise = fetchAQIData(latitude, longitude);
      const elevationPromise = fetchElevationData(latitude, longitude);
      const [aqi, elevation] = await Promise.all([aqiPromise, elevationPromise]);
      return { latitude, longitude, aqi, elevation };
    }));
    console.log(pathData);
    return pathData;
  };

  const fetchRestingSpotsData = async (routeCoordinates) => {
    const restingSpotsData = await Promise.all(routeCoordinates.map(async (point) => {
        const [longitude, latitude] = point;
        try {
            const cafeResponse = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${latitude},${longitude})["amenity"="cafe"];out;`);
            const cafeData = await cafeResponse.json();

            const nonSmokingResponse = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${latitude},${longitude})["amenity"="cafe"]["non_smoking"="yes"];out;`);
            const nonSmokingData = await nonSmokingResponse.json();

            const benchResponse = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node(around:1000,${latitude},${longitude})["amenity"="bench"];out;`);
            const benchData = await benchResponse.json();
            console.log(benchData)
            const cafeSpot = cafeData.elements && cafeData.elements.length > 0 ? cafeData.elements[0] : null;
            const nonSmokingSpot = nonSmokingData.elements && nonSmokingData.elements.length > 0 ? nonSmokingData.elements[0] : null;
            const benchSpot = benchData.elements && benchData.elements.length > 0 ? benchData.elements[0] : null;

            const restingSpot = cafeSpot || nonSmokingSpot || benchSpot;

            if (restingSpot) {
                return {
                    latitude: restingSpot.lat,
                    longitude: restingSpot.lon,
                    name: restingSpot.tags.name || 'Resting Spot'
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching resting spots data:', error);
            return null;
        }
    }));
    setRestingSpots(restingSpotsData.filter(spot => spot !== null));
};


  const calculateScore = (avgAQI, avgElevation, totalDuration, numberOfRestingSpots) => {
    // Check if any input parameter is invalid
    if (Number.isNaN(avgAQI) || Number.isNaN(avgElevation) || Number.isNaN(totalDuration) || Number.isNaN(numberOfRestingSpots)) {
        return 0; // Return default score if any input is invalid
    }

    // Define weights for each factor
    const aqiWeight = 0.4;
    const elevationWeight = 0.3;
    const timeWeight = 0.2;
    const restingSpotsWeight = 0.1;
  
    // Normalize AQI to a scale of 0 to 1 (higher is better)
    const normalizedAQI = 1 - (avgAQI / 500); // Assuming maximum AQI is 500
  
    // Normalize elevation to a scale of 0 to 1 (lower is better)
    const normalizedElevation = 1 - (avgElevation / 8848); // Assuming Mount Everest as maximum elevation
  
    // Normalize time to a scale of 0 to 1 (lower is better)
    const normalizedTime = 1 - (totalDuration / (3600 * 5)); // Assuming 5 hours as maximum duration
  
    // Normalize number of resting spots to a scale of 0 to 1 (higher is better)
    const normalizedRestingSpots = numberOfRestingSpots / 10; // Assuming maximum 10 resting spots
  
    // Calculate weighted sum
    const weightedSum = (aqiWeight * normalizedAQI) + (elevationWeight * normalizedElevation) + (timeWeight * normalizedTime) + (restingSpotsWeight * normalizedRestingSpots);
  
    return weightedSum;
};

  const fetchRoutes = async () => {
    if (source && destination) {
      const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${source.value.center.join(',')};${destination.value.center.join(',')}?alternatives=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`);
      const data = await response.json();
      console.log('Route Data:', data);
      const routesWithAQIAndElevation = await Promise.all(data.routes.map(async (route) => {
        const pathData = await fetchPathData(route.geometry.coordinates);
        console.log('Path Data:', pathData);
        return { ...route, pathData };
      }));
      console.log('Routes with AQI and Elevation:', routesWithAQIAndElevation);
      const routesWithScores = routesWithAQIAndElevation.map(route => {
      const avgAQI = route.pathData.reduce((sum, point) => sum + point.aqi, 0) / route.pathData.length;
      const avgElevation = route.pathData.reduce((sum, point) => sum + point.elevation, 0) / route.pathData.length;
      const totalDuration = route.duration;
      const numberOfRestingSpots = restingSpots.length;

      // You can define your scoring mechanism here
      const score = calculateScore(avgAQI, avgElevation, totalDuration, numberOfRestingSpots);

      return { ...route, score };
    });
    routesWithScores.sort((a, b) => b.score - a.score);
    // setRoutes(routesWithAQIAndElevation);
    setRoutes(routesWithScores); 
    setRoutesWithScores(routesWithScores)
      setSelectedRoute(null);
      setShowRoutes(true);
      setRestingSpots([]);
      const restingSpotsCoordinates = routesWithAQIAndElevation.flatMap(route => route.pathData.map(point => [point.longitude, point.latitude]));
      await fetchRestingSpotsData(restingSpotsCoordinates);
    }
  };

  const handleRouteClick = (routeIndex) => {
    setSelectedRoute(routeIndex);
  };

  const handleShowRoutes = () => {
    fetchRoutes();
  };

  const handleMarkerClick = async (pointInfo) => {
    if (pointInfo != null) {
      console.log("hello");
      console.log(pointInfo);
      setSelectedPointInfo(pointInfo);
      setSelectedRestingSpot(pointInfo);
    } else {
      console.log("Getting null data");
    }
  };

  const openModal = () => {
		setIsBasicModal(true);
	};
	const closeModal = () => {
		setIsBasicModal(false);
	};

  const routeColors = ['#0000FF', '#00FF00', '#FF0000','#FFFF00', '#FF00FF', '#00FFFF'];

  const selectedRouteData = useMemo(() => {
    if (selectedRoute !== null) {
      return routes[selectedRoute].geometry;
    }
    return null;
  }, [selectedRoute, routes]);

  return (
    <Grid
      container
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: 26,
        '--Grid-borderWidth': '1px',
        borderTop: 'var(--Grid-borderWidth) solid',
        borderLeft: 'var(--Grid-borderWidth) solid',
        borderColor: 'border',
        '& > div': {
          borderRight: 'var(--Grid-borderWidth) solid',
          borderBottom: 'var(--Grid-borderWidth) solid',
          borderColor: 'border',
        },
      }}
      
    >
      <Grid item xs={12} sm={6} md={4} marginBottom={5}>
					<VisitorsOpratingCard />
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={8}
					sx={{
						p: 3,
					}}
          marginBottom={5}
				>
					<TodoListCard/>	
				</Grid>
      <Grid item xs={12} sm={6} md={4}>
      <Typography variant="h2" sx={{ fontWeight: 'bold', textAlign:'center' }}>
                AQI and Elevation Based Navigation
        </Typography>
        <Stack spacing={2} p={3}>
          <Autocomplete
            options={sourceOptions}
            onInputChange={(event, value) => fetchAutoCompleteOptions(value, setSourceOptions)}
            onChange={handleSourceChange}
            renderInput={(params) => <TextField {...params} label="Source" />}
          />
          <Autocomplete
            options={destinationOptions}
            onInputChange={(event, value) => fetchAutoCompleteOptions(value, setDestinationOptions)}
            onChange={handleDestinationChange}
            renderInput={(params) => <TextField {...params} label="Destination" />}
          />
          <Button variant="contained" color="primary" onClick={handleShowRoutes}>
            Find Routes
          </Button>
          <Stack spacing={1}>
            {showRoutes && routes.map((route, index) => (
              <Button
                key={index}
                color="success"
                variant="contained"
                onClick={() => handleRouteClick(index)}
              >
                Route {index + 1}: {route.duration < 3600 ? `${Math.round(route.duration / 60)} minutes` : `${(route.duration / 3600).toFixed(2)} hours`}
              </Button>
            ))}
          </Stack>
          {showRoutes && selectedRoute !== null && (
            <>
              <Button variant="contained" color="info" onClick={openModal}>
                Know Your Best Route
              </Button>
              <Modal openModal={isBasicModal} fnCloseModal={closeModal} title="Best Route Information" padding>
              {selectedRoute !== null && (
                <Box height="20vh" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {routesWithScores.length > 0 && (
                    <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Best Route:   Route {routes.findIndex(route => route.score === Math.max(...routes.map(route => route.score))) + 1} (Score: {Math.max(...routes.map(route => route.score)).toFixed(2)})
                      </Typography>
                      <Typography variant="subtitle1">
                     <b>Duration: </b>    {routesWithScores[0].duration < 3600 ? `${Math.round(routesWithScores[0].duration / 60)} minutes` : `${(routesWithScores[0].duration / 3600).toFixed(2)} hours`}
                      </Typography>
                      <Typography variant="subtitle1">
                       <b>Score For this Route:</b> {routes[selectedRoute].score.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  {/* <Typography variant="body1" sx={{ marginTop: '20px' }}>
                    Other relevant information...
                  </Typography> */}
                </Box>
              )}
            </Modal>

            </>
          )}
          {showRoutes && selectedRoute !== null && restingSpots.length > 0 && (
            <Stack spacing={1}>
              <Typography variant="h6">Resting Spots:</Typography>
              {restingSpots
                .filter((spot, index, self) => self.findIndex(s => s.name === spot.name) === index)
                .map((spot, index) => (
                  <Button variant="contained" color="secondary" key={`resting-spot-${index}`} onClick={() => handleMarkerClick(spot)}>
                    {spot.name}
                  </Button>
                ))
              }
            </Stack>
          )}
          {showRoutes && selectedRoute !== null && restingSpots.length === 0 && (
            <Typography variant="body1">Loading resting spots...</Typography>
          )}
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={8}>
        <Map
          initialViewState={{
            longitude: 78.4867,
            latitude: 17.3850,
            zoom: 10,
          }}
          style={{ width: '100%', height: '600px' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <NavigationControl showZoom showCompass />
          <Marker
            longitude='78.613677'
            latitude='17.4910112'
            color="blue"
          >
            <div style={{ background: 'blue', borderRadius: '50%', width: '10px', height: '10px' }} />
          </Marker>
          {showRoutes && selectedRoute !== null && (
            <>
              {restingSpots.map((spot, index) => (
                <Marker
                  key={`resting-spot-${index}`}
                  longitude={spot.longitude}
                  latitude={spot.latitude}
                  onClick={() => handleMarkerClick(spot)}
                >
                  {/* <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'yellow',
                      border: '2px solid white',
                      cursor: 'pointer',
                    }}
                  /> */}
                  <img
                    src={benchIcon}
                    alt='bench'
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                    }}
                  />
                </Marker>
              ))}
              {routes[selectedRoute].pathData.map((point, pointIndex) => (
                <Marker
                  key={`marker-${selectedRoute}-${pointIndex}`}
                  longitude={point.longitude}
                  latitude={point.latitude}
                  onClick={() => handleMarkerClick(point)}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: point.elevation > 600 ? 'red' : 'yellow',
                      border: '2px solid white',
                      cursor: 'pointer',
                    }}
                  />
                </Marker>
              ))}
              {selectedPointInfo && restingSpots.some(spot => spot.latitude === selectedPointInfo.latitude && spot.longitude === selectedPointInfo.longitude) && (
                <Popup
                  longitude={selectedPointInfo.longitude}
                  latitude={selectedPointInfo.latitude}
                  onClose={() => setSelectedPointInfo(null)}
                  closeButton
                  closeOnClick={false}
                >
                  <Alert severity="info"> You can rest here! Resting spot: <b>{selectedPointInfo.name}</b>. Take a break at this cafe and relax here for some time. And start whenever you feel you are okay!!</Alert>
                </Popup>
              )}
              {selectedPointInfo && !restingSpots.some(spot => spot.latitude === selectedPointInfo.latitude && spot.longitude === selectedPointInfo.longitude) && (
                <Popup style={{ maxWidth: '400px' }}
                  longitude={selectedPointInfo.longitude}
                  latitude={selectedPointInfo.latitude}
                  onClose={() => setSelectedPointInfo(null)}
                  closeButton
                  closeOnClick={false}
                >
                  <Card style={{ width: '300px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" style={{marginBottom: '10px'}}><b>AQI:</b> {selectedPointInfo.aqi}</Typography>
                      <Typography variant="subtitle1" style={{marginBottom: '10px'}}><b>Elevation:</b> {selectedPointInfo.elevation}</Typography>
                      {selectedPointInfo.elevation> 600 && (
                        <Alert severity="warning">Be careful! Altitude is high here, take necessary precautions as suggested. Rest if required</Alert>
                      )}
                    </CardContent>
                  </Card>
                </Popup>
              )}
              {source && (
                <Marker longitude={source.value.center[0]} latitude={source.value.center[1]} color="red">
                  <div style={{ background: 'orange', borderRadius: '50%', width: '10px', height: '10px' }} />
                </Marker>
              )}
              {destination && (
                <Marker longitude={destination.value.center[0]} latitude={destination.value.center[1]} color="blue">
                  <div style={{ background: 'orange', borderRadius: '50%', width: '10px', height: '10px' }} />
                </Marker>
              )}
            </>
          )}
          <Source
            id="route-source"
            type="geojson"
            data={selectedRouteData}
          >
            <Layer
              id="route-layer"
              type="line"
              paint={{
                'line-color': routeColors[selectedRoute % routeColors.length],
                'line-width': 3,
              }}
            />
          </Source>
        </Map>
      </Grid>
    </Grid>
  );
}

const VISITORS_DATA = {
	week: {
		count: 75,
		osData: [
			{
				os: 'Trigger 1 : pm10',
				progress: 35,
				color: 'warning',
				recommend: 'The particulate matter less than 10 micrometers is higher, please try to stay indoors as much as possible. This is especially important during times when pollution levels are at their peak, typically during midday and afternoon.'
			},
			{
				os: 'Trigger 2 : pm2.5',
				progress: 60,
				color: 'success',
				recommend: 'The particulate matter less than 2.5 micrometers is very high,consider wearing a mask that can filter out particulate matter. N95 respirators are effective in filtering out PM2.5 and PM10 particles.'
			},
			{
				os: 'Trigger 3 : O3',
				progress: 15,
				color: 'error',
				recommend: 'Keep your rescue inhaler or other prescribed medications with you at all times and use them as directed by your healthcare provider.'
			},
			{
				os: 'Trigger 4 : No2',
				progress: 10,
				color: 'error',
				recommend: 'If you commute, try to travel during hours when traffic is lighter to reduce exposure to NO2 and other vehicle-related pollutants. Consider using modes of transport that limit exposure, such as cars with closed windows and effective cabin air filters, or avoid congested routes.'
			},
			{
				os: 'Trigger 5 : Temperature',
				progress: 38,
				color: 'error',
				recommend: 'Drink plenty of water throughout the day. Staying hydrated helps keep the mucous membranes in your throat and lungs moist, which can help them trap and clear pollutants more effectively.'
			},
		],
	},
};
function VisitorsOpratingCard() {
	const [viewBy, setViewBy] = useState('week');
	const [aqiData, setAqiData] = useState(null);
	const sendAlertToBackend = async (message) => {
		try {
		  const response = await fetch('http://localhost:5000/send', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({ to: '+917801049826', body: message }),
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
			console.log('aqi')
		   sendAlertToBackend(`The current AQI vales is ${aqiData?.data?.aqi} which is very High. Please take necessary precautions `);
		}
	  });

	const changeTab = (tabKey) => {
		setViewBy(tabKey);
	};
	return (
		<Stack marginBottom={2} direction="column" spacing={2} p={2} justifyContent="center">
			<ButtonGroup variant="outlined" size="small" aria-label="temporaly button group">
				<TabButton changeTab={changeTab} tabKey="week" activeView={viewBy}>
				<Typography variant="h2" textTransform="uppercase">
				Environmental Trigger analysis
			</Typography>
				</TabButton>
			</ButtonGroup>
			<TransitionGroup
				style={{
					position: 'relative',
				}}
			>
				<ReactTransition
					key={viewBy}
					timeout={{
						enter: TIMEOUT,
						exit: TIMEOUT,
					}}
				>
					{(status) => (
            <div>
              <Typography
							variant="h2"
							fontSize={30}
							fontWeight={400}
							style={{
								...transitionStyles[status],
                textAlign: 'center'
							}}
						>
							Air Quality Index(AQI) : {aqiData?.data?.aqi || 0}
						</Typography>
            <Typography style={{textAlign: 'center'}}>
             Alert triggers when AQI is hazardous, greater than 300
            </Typography>
            </div>

					)}
				</ReactTransition>
			</TransitionGroup>
			<Divider />
			<Stack spacing={3} mt={2}>
				{VISITORS_DATA?.[viewBy]?.osData.map((sale, index) => (
					<SaleProgress key={`${viewBy}${index}`} saleData={sale} />
				))}
			</Stack>
		</Stack>
	);
}
function TabButton({ children, tabKey, changeTab, activeView }) {
	return (
		<Button
			fullWidth
			size="small"
			onClick={() => changeTab(tabKey)}
			sx={{
				...(activeView === tabKey && {
					color: (theme) => theme.palette.text.secondary,
				}),
			}}
		>
			{children}
		</Button>
	);
}
function SaleProgress({ saleData }) {
	const { progress, color, os , recommend } = saleData;
	const counter = useAutoCounter({
		limiter: progress,
		increment: 1,
		interval: 10,
	});
	const [isBasicModal, setIsBasicModal] = useState(false);

	const openModal = () => {
		setIsBasicModal(true);
	};
	const closeModal = () => {
		setIsBasicModal(false);
	};
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column'}}>
			<Box sx={ {display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="body2" color="text.secondary" gutterBottom>
          {os} ({counter})
        </Typography>
		<Modal openModal={isBasicModal} fnCloseModal={closeModal} title="Preventive Measures" padding>
				<Box height="10vh">{recommend}</Box>
		</Modal>
		<Button variant='contained' size='small' onClick={openModal}>Get Recommendation</Button></Box><LinearProgress
        variant="determinate"
        color={color}
        value={counter}
        sx={ {height: 5, marginTop: 1 }}
      /></Box>
	);
}
export default VisitorsSection;
