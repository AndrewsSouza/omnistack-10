import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

import api from "../services/api";
import { connect, disconnect, subscribeToNewDevs } from "../services/socket";

export default function Main({ navigation }) {
    const [devs, setDevs] = useState([])
    const [currentRegion, setCurrentRegion] = useState(null)
    const [techs, setTechs] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync()

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                })

                const { latitude, longitude } = coords

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                })
            }
        }

        loadInitialPosition()
    }, [])

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]))
    }, [devs])

    function setupWebsocket() {
        disconnect()

        const { latitude, longitude } = currentRegion

        connect(
            latitude,
            longitude,
            techs,
        )

    }

    async function loadDevs() {
        setIsLoading(true)

        const { latitude, longitude } = currentRegion

        try {
            const response = await api.get('/search', {
                params: {
                    latitude,
                    longitude,
                    techs,
                }
            })
            setDevs(response.data.devs)
            setupWebsocket()
        } catch (err) {
        }
        finally {
            setIsLoading(false)
        }
    }

    function handleRegionChange(region) {
        setCurrentRegion(region)
    }

    if (!currentRegion) {
        return null
    }

    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChange} initialRegion={currentRegion} style={styles.map} >
                {devs.map(dev => (
                    <Marker key={dev._id} coordinate={{
                        longitude: dev.location.coordinates[0],
                        latitude: dev.location.coordinates[1],
                    }}>
                        <Image style={styles.avatar} source={{
                            uri: dev.avatarUrl,
                        }} />
                        <Callout onPress={() => {
                            navigation.navigate('Profile', { githubUsername: dev.githubUsername })
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>

                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                    onChangeText={setTechs}
                    style={styles.searchInput}
                    placeholder='Search devs by technologies'
                    placeholderTextColor='#999'
                    autoCapitalize='words'
                    autoCorrect={false}
                />
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color='#FFF' />
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <View style={styles.loaderBg}>
                    <ActivityIndicator size='large' color='#8e4dff' />
                </View>
            ) : null}
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        right: 20,
        left: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    loaderBg: {
        backgroundColor: '#000',
        opacity: 0.8,
        position: 'absolute',
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        zIndex: 10,
    },
})