import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { WeatherForecast } from '@/app/homePage'
import dayjs from 'dayjs'
import { BlurView } from 'expo-blur'

const ForecastItem = ({ forecast }: { forecast: WeatherForecast }) => {
    return (
        (
            <BlurView intensity={50} style={styles.container}>
                <Text style={styles.temp}>{Math.round(forecast.main.temp)}℃</Text>
                <Text style={styles.date}>{dayjs(forecast.dt * 1000).format('ddd ha')}</Text>
            </BlurView>
        )
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        aspectRatio: 3 / 4,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor: 'gainsboro',
        borderWidth: StyleSheet.hairlineWidth
    },
    temp: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 10,
    },
    date: {
        fontWeight: 'bold',
        color: 'ghostwhite',
        fontSize: 15,
    }
})
export default ForecastItem