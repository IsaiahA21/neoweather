import React, { useState } from 'react';
import {ChakraProvider,Box,Text,Link,VStack, Code,Grid,theme,Button, chakra, SimpleGrid, Input, Select, HStack, Stat, useColorModeValue, StatLabel, Flex, Card, CardBody, CardFooter, CardHeader, Heading} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import axios from 'axios';

export const App = () => {

  //useState hook in React always returns an array with two elements: the state value and the function to update that state value.
  const [selectedUnit, updateUnit] = useState('c');
  const [city, setCity] = useState("Calgary");
  // to show the card
  const [showCard, setShowCard] = useState(false);

  // set weather
  const [todayWeather, setTodayWeather] = useState({
    dataCity: "NAN",
    temp: "-1000 °C",
    sky: "NAN",
    time: "NAN",
    humidity: NaN,
    precip: NaN,
  });
  const [nextDayWeather, setNextDayWeather] = useState({
    temp: "-1000 °C",
    sky: "NAN",
    time: "NAN",
    humidity: NaN,
    sunHours: NaN,
  });
  const [twoDaysAwayWeather, setTwoDaysAwayWeather] = useState({
    temp: "-1000 °C",
    sky: "NAN",
    time: "NAN",
    humidity: NaN,
    sunHours: NaN,
  });

  const testApi = async () => {
    console.log(city, selectedUnit);
    let res = null;
    
    try {
      res = await axios.get(`https://wttr.in/${city}?format=j1`);
    }catch(e: any){
      console.log("Error retrieving data ",e.message);
      alert(`Error retrieving data ${e.message}`);
      return;
    }
 
    let currentDate = res.data.weather[0].date;
    
    
    console.log(res.data)
    let current_condition = res.data['current_condition']; // array
    let currentTemp, nextDayTemp, twoDaysAwayTemp;

    //check if the user wants to see the temperature in Celsius or Fahrenheit
    if (selectedUnit === 'f') {
      currentTemp = current_condition[0].temp_F + "°F";
      nextDayTemp = res.data.weather[1].maxtempF + "°F";
      twoDaysAwayTemp = res.data.weather[2].maxtempF + "°F";
    }
    else{
    // current_condition[0]  is an object
     currentTemp = current_condition[0].temp_C + "°C";
     nextDayTemp = res.data.weather[1].maxtempC  + "°C";
     twoDaysAwayTemp = res.data.weather[2].maxtempC + "°C";
    }

    // current conditions
    let currentSky = current_condition[0].weatherDesc[0].value;
    let currentTime = current_condition[0].localObsDateTime;
    let currentHumidity = current_condition[0].humidity;
    let precip =current_condition[0].precipMM;

    // next day conditions
    let nextDaySky = res.data.weather[1].hourly[0].weatherDesc[0].value;
    let nextDayTime = res.data.weather[1].date;
    let nextDayHumidity = res.data.weather[1].hourly[0].humidity;
    let nextDaysunHours = res.data.weather[1].sunHour;

    // two days away conditions
    let twoDaysAwaySky = res.data.weather[2].hourly[0].weatherDesc[0].value;
    let twoDaysAwayTime = res.data.weather[2].date;
    let twoDaysAwayHumidity = res.data.weather[2].hourly[0].humidity;
    let twoDaysAwaysunHours = res.data.weather[2].sunHour;
    
  // set the weather
  setTodayWeather({
    dataCity: res.data.nearest_area[0].areaName[0].value,
    temp: currentTemp,
    sky: currentSky,
    time: currentTime,
    humidity: currentHumidity,
    precip: precip,
  });

  setNextDayWeather({
    temp: nextDayTemp,
    sky: nextDaySky,
    time: nextDayTime,
    humidity: nextDayHumidity,
    sunHours: nextDaysunHours,
  });

  setTwoDaysAwayWeather({
    temp: twoDaysAwayTemp,
    sky: twoDaysAwaySky,
    time: twoDaysAwayTime,
    humidity: twoDaysAwayHumidity,
    sunHours: twoDaysAwaysunHours,
  });

    // show the card
    setShowCard(true);

};
  return (
    
  <ChakraProvider theme={theme}>
    <Box maxW="7x1" mx={'auto'} pt={5} px={{base: 2, sm:12, md: 17}} backgroundColor={"lightskyblue"} marginBottom={'2'}>
      <chakra.h1 textAlign={"center"} fontSize={"40px"} py={3} fontWeight={"bold"}>Find the weather</chakra.h1>
    </Box>

    <Box backgroundColor={"whie"} alignContent={"center"} alignItems={"center"} width={"50%"} mx={"auto"}>
      <HStack spacing={"24px"} >
        <Input variant={"outline"} placeholder="Calgary" w={"sm"} 
          onChange={(e) => {setCity(e.target.value)}}
        />
        
        // idk what 'ld' but it works and makes the select box small 
        <Select size={"md"} w={"ld"} 
          value={selectedUnit} 
          onChange={(e)=> updateUnit(e.target.value) } >

          <option value="c" selected>Celsius</option>
          <option value="f">Fahrenheit</option>
        </Select>

        <Button onClick={() => testApi()}>Click</Button>
      </HStack>
    </Box>

    {/*Shows the weather*/}


{/* // if there is no error and showCard is true, then show the cards */}
  {showCard && ( // Only render the cards when showCards is true
  <Box marginTop={"8em"} backgroundColor={"white"} alignContent={"center"} alignItems={"center"} width={"50em"} mx={"auto"}>
    <Text>Result for <span style={{fontWeight:"bold"}}>{todayWeather.dataCity} on {todayWeather.time}</span></Text>
    <SimpleGrid marginTop={"1em"} spacing={7} templateColumns='repeat(auto-fill, minmax(13em, 1fr))'>
          <Card>
            <CardHeader>
              <Heading size='sm'> Current Temperature: {todayWeather.temp}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{todayWeather.sky}</Text>
             <Text>Humidity: {todayWeather.humidity}%</Text>
              <Text>Precipitation: {todayWeather.precip} mm</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Heading size='sm'> {nextDayWeather.time}: {nextDayWeather.temp}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{nextDayWeather.sky}</Text>
             <Text>Humidity: {nextDayWeather.humidity}%</Text>
              <Text>Sun time: {nextDayWeather.sunHours} hours</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Heading size='sm'> {twoDaysAwayWeather.time}: {todayWeather.temp}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{twoDaysAwayWeather.sky}</Text>
             <Text>Humidity: {twoDaysAwayWeather.humidity}%</Text>
              <Text>Sun time: {twoDaysAwayWeather.sunHours} hours</Text>
            </CardBody>
          </Card>
    </SimpleGrid>
  </Box>
  )}

  </ChakraProvider>

  );
};

export default App;

