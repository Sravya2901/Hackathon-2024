import { useState, useEffect } from 'react';
// import { useTheme } from '@mui/material/styles';

// import Chart from 'react-apexcharts';
// import getDefaultChartsColors from '@helpers/getDefaultChartsColors';

// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import CardHeader from '@/components/cardHeader';
import { CardContent } from '@mui/material';

const AQI_API_KEY = '82d53f60ea35e44078e569a28d0b72ab5ec1ed6e';
function getAQICategoryAndRecommendation(aqi) {
	let data={}
    if (aqi <= 50) {
        data={category: 'Good', recommendation: `<div><p><strong>Health Implications:</strong> Air quality is considered excellent, posing virtually no risk to health.</p><p><strong>Recommended Activities:</strong></p><ul><li>Outdoor Sports: Ideal conditions for running, cycling, and team sports.</li><li>Gardening and Farming: Perfect air quality for spending extended periods outdoors with plants.</li><li>Outdoor Events: Encouraged to organize or participate in outdoor gatherings, festivals, and events.</li></ul><p>When the AQI falls within the 'Good' range, the air quality is excellent, offering a perfect opportunity to engage in a wide array of outdoor sports and activities. This is the ideal time to take advantage of the great outdoors, whether it be through rigorous physical exercises like jogging, cycling, or team sports such as soccer, basketball, or baseball. The negligible levels of pollutants in the air mean that respiratory and cardiovascular systems are not at risk, allowing for prolonged periods of high-intensity outdoor activities without concern. It's also a splendid time for outdoor enthusiasts to partake in hiking, exploring trails, or even challenging themselves with outdoor adventure sports like rock climbing and kayaking. The benefits of engaging in outdoor activities under such conditions extend beyond physical health, contributing significantly to mental well-being by reducing stress, enhancing mood, and improving overall happiness. Families and friends are encouraged to organize picnics, barbecues, or any form of outdoor gathering, fostering community bonds and making lasting memories in the fresh air.</p></div>` };
    } else if (aqi <= 100) {
        data={ category: 'Moderate', recommendation: `Health Implications: Air quality is acceptable, though there's a slight concern for some people who are extremely sensitive to certain types of air pollutants.
		Recommended Activities:
		Leisure Outdoor Activities: Such as walking, picnicking, and fishing, are still enjoyable, with caution advised for sensitive individuals.
		Indoor Exercise: People who are sensitive to air pollution might choose indoor activities with air filtration systems in place.
		Monitoring Health: Sensitive individuals should be observant of symptoms like coughing or shortness of breath during outdoor activities.
		In 'Moderate' AQI conditions, while the air quality is still acceptable, individuals, particularly those sensitive to pollutants, should start to be cautious about their outdoor activities. This period still allows for leisurely outdoor pursuits that do not demand heavy exertion. Activities such as walking, picnicking, and light fishing can be enjoyed without significant concern, offering a balance between enjoying the outdoors and maintaining health. Gardening is another rewarding activity during this time, allowing individuals to connect with nature at a relaxed pace. Photography enthusiasts might find this a suitable time to capture the beauty of the natural environment, focusing on landscapes, urban scenes, or wildlife. For those interested in more serene activities, bird watching or leisurely biking through parks can be exceptionally peaceful, offering both physical activity and mental relaxation without overexertion. It's a time to be mindful of air quality changes but still enjoy the vibrancy of outdoor life.` };
    } else if (aqi <= 150) {
        data={ category: 'Unhealthy for Sensitive Groups', recommendation: `Health Implications: Sensitive individuals, including people with lung diseases, older adults, and children, are at a higher risk of experiencing health effects.
		Recommended Activities:
		Indoor Activities: Engage in indoor exercises and recreational activities to minimize exposure.
		Short, Light Outdoor Activities: If outdoor activities are necessary, opt for shorter durations and less intense activities.
		Health Precautions: Sensitive groups should keep medication close if needed and consult with healthcare providers about outdoor activities.
		Once the AQI reaches levels considered 'Unhealthy for Sensitive Groups,' it becomes crucial for individuals with respiratory conditions, the elderly, and children to limit outdoor exposure. During such times, shifting focus towards indoor activities that promote physical health and mental well-being becomes essential. Engaging in indoor exercises such as yoga, pilates, or light home workouts can help maintain physical fitness without exposure to outdoor air pollutants. Creative hobbies such as painting, crafting, or playing musical instruments can also serve as therapeutic outlets, fostering creativity and relaxation. For those seeking light outdoor engagement, short walks in environments with abundant greenery, such as parks with dense trees, may offer some respite, provided that the duration is limited and physical exertion is minimal. It's a period for sensitive groups to prioritize health by choosing activities that minimize exposure to pollutants while still allowing for a degree of outdoor enjoyment and physical activity.`};
    } else if (aqi <= 200) {
        data={ category: 'Unhealthy', recommendation: `Health Implications: The general public may start to experience health effects, with members of sensitive groups experiencing more serious effects.
		Recommended Activities:
		Limit Outdoor Activities: Everyone should reduce outdoor exertion, choosing indoor alternatives like gym workouts, yoga, or indoor swimming.
		Air Quality Monitoring: Regularly check the AQI levels and stay indoors when levels are high.
		Health Measures: Using air purifiers indoors and wearing masks if needing to go outside can help reduce exposure.
		With the air quality entering the 'Unhealthy' range, the emphasis shifts significantly towards minimizing outdoor activities and finding indoor alternatives that cater to both physical fitness and leisure. This is a critical time for everyone, regardless of health status, to consider indoor environments with controlled air quality. Home-based fitness routines, including aerobic exercises, strength training, or using stationary exercise equipment like treadmills and stationary bikes, become invaluable. This period also presents an opportunity to explore new indoor hobbies or revisit old ones, such as cooking, baking, reading, or engaging in DIY projects that can be both fulfilling and stimulating. Virtual fitness classes or online learning can also provide structure and community engagement from the safety of home. It’s a period to creatively adapt to indoor settings, ensuring that both body and mind remain active and engaged while avoiding outdoor air pollution.` };
    } else if (aqi <= 300) {
        data={ category: 'Very Unhealthy', recommendation: `Health Implications: This triggers a health alert, indicating that the entire population is likely to be affected.
		Recommended Activities:
		Stay Indoors: Focus on indoor activities that do not require vigorous physical effort. Reading, indoor hobbies, and streaming movies or shows are good options.
		Use of Air Purifiers: Ensure the indoor environment is clean with air purifiers, especially those with HEPA filters.
		Avoid Outdoor Exercise: All forms of outdoor physical activity should be avoided to reduce health risks.
		When the AQI is 'Very Unhealthy,' the priority is to stay indoors and limit physical activity to reduce the intake of harmful pollutants. This period calls for activities that are not physically demanding yet keep individuals occupied and mentally active. Indoor air quality should be managed with air purifiers, particularly those equipped with HEPA filters, to remove pollutants from the indoor environment. Engaging in calm, sedentary activities such as reading, meditating, or practicing mindfulness can help maintain mental balance and reduce stress during times of restricted outdoor access. It's also an opportune time to indulge in hobbies that require more time and focus, such as model building, knitting, or writing. Online social interactions through video calls, online games, or virtual book clubs can help maintain social connections without physical meetings. The focus is on creating a safe and engaging indoor environment that compensates for the lack of outdoor access.` };
    } else {
        data={ category: 'Hazardous', recommendation: `Health Implications: This level poses a serious health risk for the entire population, with emergency conditions potentially triggering health alerts.
		Recommended Activities:
		Strict Indoor Confinement: Avoid leaving the house unless absolutely necessary. Ensure that indoor air quality is maintained at a healthy level.
		Emergency Plans: Be aware of and ready to execute any health or evacuation plans if the situation deteriorates or if advised by health officials.
		Health Safety Measures: Keep windows closed, use air purifiers continuously, and consider wearing respirators if indoor air quality cannot be maintained.
		In 'Hazardous' AQI conditions, the air quality poses severe health risks, necessitating strict indoor confinement. All efforts should be directed towards minimizing exposure to polluted air, emphasizing the importance of maintaining indoor air quality with continuous use of air purifiers and avoiding activities that could generate indoor pollutants, such as smoking or using candles. The objective during this period is to ensure safety and well-being through minimal physical exertion and engaging in low-energy activities. Puzzles, board games, or interactive video games can provide entertainment and mental stimulation without physical strain. It's also a time for personal development, perhaps through online courses, language learning, or exploring areas of interest that have been on the backburner. The emphasis is on protecting health by staying indoors, staying informed about air quality updates, and following health advisories closely.` };
    }
	return data
}
function CustomersOverviewCard() {
	const[AQI,setAQI]=useState([])
	const [recommendation, setRecommendation] = useState('');
	useEffect(()=>{
		async function fetchAQIForLocation() {
			const response = await fetch(`https://api.waqi.info/feed/geo:78.4867;17.3850/?token=${AQI_API_KEY}`);
			const data = await response.json();
			console.log(data)
			if (data.status === "ok") {
				setAQI(data.data.aqi);
                const { recommendation } = getAQICategoryAndRecommendation(data.data.aqi);
                setRecommendation(recommendation);
				console.log(recommendation)
				console.log(AQI)
                return data;
				
			} 
			return null
		  }
		  fetchAQIForLocation()
	},[])
	return (
		<Card>
			<CardHeader title="Recommended Exercises"/>
			<CardContent>
			<div style={{ fontSize: '15px', marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: recommendation }}/>
			</CardContent>
			{/* <CustomersChart activeView={viewBy} /> */}
		</Card>
	);
}

export default CustomersOverviewCard;
