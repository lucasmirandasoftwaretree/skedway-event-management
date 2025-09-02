import { useEffect, useMemo, useState } from 'react'
import api from '../api'
import type { Reservation, User } from '../types'

type Props = {
    selectedRoomId: number
    selectedUserId: number
    users: User[]
}

export default function ReservationList({ selectedRoomId, selectedUserId, users }: Props) {
    const [reservations, setReservations] = useState<Reservation[]>([])

    const usersById = useMemo(() => {
        const m = new Map<number, string>()
        users.forEach(u => m.set(u.id, u.name))
        return m
    }, [users])

    const load = () => {
        const params: string[] = []
        if (selectedRoomId) params.push(`room_id=${selectedRoomId}`)
        if (selectedUserId) params.push(`user_id=${selectedUserId}`)
        const q = params.length ? `?${params.join('&')}` : ''
        api.get('/reservations' + q).then(r => setReservations(r.data.data))
    }

    useEffect(() => {
        load()
    }, [selectedRoomId, selectedUserId])

    const cancel = async (id: number) => {
        await api.delete(`/reservations/${id}`)
        load()
    }

    return (
        <div className="mt-3">
            <ul className="list-group">
                {reservations.map(r => {
                    const uname = usersById.get(r.user_id) ?? `user ${r.user_id}`
                    return (
                        <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                #{r.id}{' '}
                                {new Date(r.start_at).toLocaleString()} → {new Date(r.end_at).toLocaleString()} | {uname}
                            </span>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => cancel(r.id)}>Cancel</button>
                        </li>
                    )
                })}
            </ul>
            {reservations.length === 0 && <div className="text-muted">No reservations</div>}
        </div>
    )
}
