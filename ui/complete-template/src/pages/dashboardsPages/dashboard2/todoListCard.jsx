import { useState } from 'react';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { Grid,Stack, Typography, Paper, Button, Alert} from '@mui/material';
import CardHeader from '@/components/cardHeader';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function TodoListCard() {
    const items = [
        "Chest Pain", "Lips are Blue", "Shortness of breath", "Swollen feet or ankles",
        "Unable to speak", "Drowsy", "Fever and Chills", "More Phlegm"
    ];
    const [checkedItems, setCheckedItems] = useState({});
	const [severealertItems, setSevereAlertItems] = useState("");
	const [moderatealertItems, setModerateAlertItems] = useState("");
	const [counter, setCounter] = useState(0);
    const handleCheck = (item, isChecked) => {
        setCheckedItems(prev => ({ ...prev, [item]: isChecked }));
    };
    const getCheckedItemsArray = () => Object.entries(checkedItems).filter(([, value]) => value).map(([key]) => key);

    console.log(getCheckedItemsArray()); // This will log checked items as an array

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
    return (
        <Card><CardHeader title="Chronic Pain and Breathing issues Emergency Checklist" sx={{ mb: 1 }} /><FormGroup><Grid container spacing={1}>
                    {items.map((item, index) => (
                        <Grid item xs={3} key={index}><TodoItem text={item} onCheckChange={handleCheck} /></Grid>
                    ))}
                </Grid></FormGroup>
				<StatsRow/>
				{severealertItems !== '' && (
  <Alert
    variant="filled"
    severity="error"
    action={
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => {
			setCounter(counter+1);
          setSevereAlertItems('');
		  console.log(counter)
        }}
      ><CloseIcon fontSize="inherit" /></IconButton>}
  >
    {severealertItems}
  </Alert>
)}
{moderatealertItems !== '' && (
  <Alert
    variant="filled"
    severity="info"
    action={
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => {
			setCounter(counter+1);
          setModerateAlertItems('');
		  console.log(counter)
        }}
      ><CloseIcon fontSize="inherit" /></IconButton>
    }
  >
    {moderatealertItems}
  </Alert>)}
				{/* { severealertItems!== '' &&  <Alert variant="filled" severity="error"> {severealertItems}</Alert>}
				{ moderatealertItems!== '' && <Alert variant="filled" severity="info"> {moderatealertItems}</Alert>} */}
				<Grid container spacing={2} marginTop={1}>
				<Grid item xs={12}>
				<Button fullWidth onClick={() => { 
					if(counter%2!==0) {
						console.log(counter)
						setSevereAlertItems("Based on your metrics and symptoms your situation has been identified as SERIOUS, an ALERT has been sent to your emergency contacts and an ambulance has been dispatched to your location.")
						sendAlertToBackend("The condition of the patient Elizabeth is Serious. Please take necessary action");
					} else {
						console.log(counter)
						setModerateAlertItems ("Based on your metrics and symptoms your situation has been identified as MODERATE, please follow the suggested measures if issue still persists schedule a call with you doctor")
						// sendAlertToBackend("param2");
					}
				}} variant='contained'>Check Symptoms</Button>
				</Grid>
				{ moderatealertItems !== '' && <Grid item xs={12}><Button fullWidth onClick={() => sendAlertToBackend('message') } variant='contained'>Schedule Call</Button></Grid>}
				</Grid>
				</Card>
    );
}

function StatCard({ title, value , color}) {
	return (
	  <Paper elevation={3} sx={ {padding: 2, backgroundColor: color || 'default' }}><Stack  spacing={1} alignItems="center"><Typography variant="h5">{title}</Typography><Typography variant="h3">{value}</Typography></Stack></Paper>
	);
  }
  
  // Adjusting StatsRow to use function declaration
  function StatsRow() {
	return (
	  <Grid container spacing={2} marginTop={1} marginBottom={2}><Grid item xs={3} ><StatCard title="FEV1 (%) " value="80" color="#c8e6c9"/></Grid><Grid item xs={3} ><StatCard title="BMI (kg/m²) " value="24.5" color="#c8e6c9"/></Grid><Grid item xs={3}><StatCard title="alpha-1 level" value="60" color="#c8e6c9"/></Grid><Grid item xs={3}><StatCard title="6 minute walk test" value="12m" color="#c8e6c9" /></Grid></Grid>
	);
  }

function TodoItem({ text, onCheckChange }) {
    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        const isChecked = e.target.checked;
        setChecked(isChecked);
        onCheckChange(text, isChecked);
    };

    return (
        <FormControlLabel
            control={
                <Checkbox
                    onChange={handleChange}
                    checked={checked}
                    size="small"
                    sx={{ p: 0.5, px: 1 }}
                />
            }
            label={text}
        />
    );
}


export default TodoListCard;
