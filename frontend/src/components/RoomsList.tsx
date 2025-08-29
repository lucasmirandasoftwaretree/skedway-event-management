import { useEffect, useState } from 'react'
import api from '../api'
import { Room } from '../types'

export default function RoomsList() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        api.get('/rooms')
            .then(r => setRooms(Array.isArray(r.data) ? r.data : []))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Carregando...</p>
    if (error)   return <p>Erro: {error}</p>

    return (
        <ul>
            {rooms.map((room) => (
                <li key={room.id}>{room.name}</li>
            ))}
        </ul>
    )
}
