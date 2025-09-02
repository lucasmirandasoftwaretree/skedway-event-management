import { useEffect, useState } from 'react'
import api from './api'
import type { Room, Reservation } from './types'
import ReservationForm from './components/ReservationForm'
import ReservationList from './components/ReservationList'
import { Toaster } from 'react-hot-toast'

export default function App() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [roomId, setRoomId] = useState<number>(0)
    const [listKey, setListKey] = useState(0)

    useEffect(() => {
        api.get('/rooms').then((r) => {
            setRooms(r.data)
            if (r.data[0]) setRoomId(r.data[0].id)
        })
    }, [])

    const onCreated = (_r: Reservation) => {
        setListKey((k) => k + 1)
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="container py-4">
                <h3>Meeting Room Reservations</h3>

                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <label className="form-label">Room</label>
                        <select
                            className="form-select"
                            value={roomId}
                            onChange={(e) => setRoomId(parseInt(e.target.value))}
                        >
                            {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12">
                        <ReservationForm onCreated={onCreated} selectedRoomId={roomId} />
                    </div>

                    <div className="col-12">
                        <ReservationList key={`${roomId}-${listKey}`} selectedRoomId={roomId} />
                    </div>
                </div>
            </div>
        </>
    )
}
