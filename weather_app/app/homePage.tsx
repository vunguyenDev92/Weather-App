import { ActivityIndicator, FlatList, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import * as Location from 'expo-location';
import ForecastItem from '@/components/ForecastItem';
import { Stack } from 'expo-router';
import LottieView from 'lottie-react-native';


// https://api.openweathermap.org/data/3.0/onecall?lat=21.0245&lon=105.84117&exclude={part}&appid=a4086bc3eae61f90cb5d219ccac3437e
const BASE_URL = `https://api.openweathermap.org/data/2.5`;
const OPEN_WEATHER_API_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY;
const bgImage = 'https://images.unsplash.com/photo-1696215104653-1e0ca2d423d2?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

//api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
type MainWeather = {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number,
    sea_level: number,
    grnd_level: number,
};
type Weather = {
    name: string;
    main: MainWeather;
    weather: [
        {
            id: string;
            main: string;
            description: string;
            icon: string;

        }
    ];
};

export type WeatherForecast = {
    main: MainWeather;
    dt: number;
};

const homePage = () => {
    // why use state<Weather> ?
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [weather, setWeather] = useState<Weather>();
    const [forecast, setForecast] = useState<WeatherForecast[]>();



    useEffect(() => {
        if (location) {
            fetchWeather();
            fetchForecast();
        }
    }, [location]);

    useEffect(() => {
        async function getCurrentLocation() {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log("Location: ", location);
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    const fetchWeather = async () => {
        //fetch data from api
        if (!location) return;
        // const lat = 34.0200392;
        // const lon = -118.7413956;
        const results = await fetch(`${BASE_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`);
        // const results = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`);

        const data = await results.json();
        //console.log(JSON.stringify(data, null, 2));
        setWeather(data);
    }

    const fetchForecast = async () => {
        if (!location) return;
        const results = await fetch(`${BASE_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`);
        const data = await results.json();
        console.log(JSON.stringify(data, null, 2));
        setForecast(data.list);
    }

    if (!weather) {
        return <ActivityIndicator />
    }


    return (
        <ScreenWrapper bg="#fff">
            <ImageBackground source={{ uri: bgImage }} style={styles.container}>
                <View style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }} />

                <Stack.Screen options={{ headerShown: false }} />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <LottieView
                        source={weather.weather[0].main == 'Rain'
                            ? require('../assets/animation/rain.json')
                            : require('../assets/animation/sunny.json')}
                        autoPlay
                        loop
                        style={{
                            width: 200,
                            aspectRatio: 1,
                            marginBottom: 50,

                        }}
                    />
                    <Text style={styles.location}>{weather.name}</Text>
                    <Text style={styles.temp}>{Math.round(weather.main.temp)}℃</Text>
                    <Text style={styles.location}>{weather.weather[0].main}</Text>
                </View>

                <FlatList
                    data={forecast}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        flexGrow: 0,
                        height: 150,
                        marginBottom: 40,
                    }}
                    contentContainerStyle={{
                        gap: 10,
                        paddingHorizontal: 10,
                    }}
                    renderItem={({ item }) => <ForecastItem forecast={item} />}
                />
            </ImageBackground>
        </ScreenWrapper>
    )
}

export default homePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    location: {
        fontSize: 30,
        marginBottom: 20,
        //fontFamily: 'Inter',
        color: 'lightgray',
    },
    temp: {
        fontSize: 100,
        //fontFamily: 'InterBlack',
        color: 'snow',
    }
})