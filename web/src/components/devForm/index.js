import React, { useState, useEffect } from 'react'

export default function DevForm({ onSubmit }) {
    const [githubUsername, setGithubUsername] = useState('')
    const [techs, setTechs] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude: browserLatitude, longitude: browserLongitude } = position.coords
            setLatitude(browserLatitude)
            setLongitude(browserLongitude)
        }, error => {
            console.log(error)
        }, {
            timeout: 30000,
        })
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()

        await onSubmit({
            githubUsername,
            techs,
            latitude,
            longitude,
        })

        setGithubUsername('')
        setTechs('')
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <div className="input-block">
                <label htmlFor="githubUsername">Usuário do Github</label>
                <input
                    type="text"
                    name="githubUsername"
                    id="githubUsername"
                    required
                    value={githubUsername}
                    onChange={e => setGithubUsername(e.target.value)}
                />
            </div>

            <div className="input-block">
                <label htmlFor="techs">Tecnologias</label>
                <input
                    type="text"
                    name="techs"
                    id="techs"
                    required
                    value={techs}
                    onChange={e => setTechs(e.target.value)}
                />
            </div>

            <div className="input-group">
                <div className="input-block">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                        type="number"
                        name="latitude"
                        id="latitude"
                        required
                        value={latitude}
                        onChange={e => setLatitude(e.target.value)}
                    />
                </div>

                <div className="input-block">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                        type="number"
                        name="longitude"
                        id="longitude"
                        required
                        value={longitude}
                        onChange={e => setLongitude(e.target.value)}
                    />
                </div>
            </div>

            <button type="submit">Salvar</button>
        </form>
    )
}