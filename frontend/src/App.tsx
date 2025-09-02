import { useEffect, useState } from 'react'
import api from './api'
import type { Room, User } from './types'
import ReservationForm from './components/ReservationForm'
import ReservationList from './components/ReservationList'
import { Toaster } from 'react-hot-toast'

export default function App() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [roomId, setRoomId] = useState<number>(0)
    const [userId, setUserId] = useState<number>(0)
    const [listKey, setListKey] = useState(0)

    useEffect(() => {
        Promise.all([api.get('/rooms'), api.get('/users')]).then(([rRooms, rUsers]) => {
            const rs = Array.isArray(rRooms.data) ? rRooms.data : []
            const us = Array.isArray(rUsers.data) ? rUsers.data : []
            setRooms(rs)
            setUsers(us)
            if (rs[0]) setRoomId(rs[0].id)
            if (us[0]) setUserId(0)
        })
    }, [])

    const onCreated = () => {
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

                    <div className="col-12 col-md-4">
                        <label className="form-label">User</label>
                        <select
                            className="form-select"
                            value={userId}
                            onChange={(e) => setUserId(parseInt(e.target.value))}
                        >
                            <option value={0}>All users</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12">
                        <ReservationForm onCreated={onCreated} selectedRoomId={roomId} />
                    </div>

                    <div className="col-12">
                        <ReservationList
                            key={`${roomId}-${userId}-${listKey}`}
                            selectedRoomId={roomId}
                            selectedUserId={userId}
                            users={users}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
