import { useEffect, useState } from 'react'
import api from '../api'
import type { Reservation } from '../types'

type Props = { selectedRoomId: number }

export default function ReservationList({ selectedRoomId }: Props) {
    const [reservations, setReservations] = useState<Reservation[]>([])

    const load = () => {
        const q = selectedRoomId ? `?room_id=${selectedRoomId}` : ''
        api.get('/reservations' + q).then((r) => setReservations(r.data.data))
    }

    useEffect(() => {
        load()
    }, [selectedRoomId])

    const cancel = async (id: number) => {
        await api.delete(`/reservations/${id}`)
        load()
    }

    return (
        <div className="mt-3">
            <ul className="list-group">
                {reservations.map((r) => (
                    <li
                        key={r.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
            <span>
              #{r.id}{' '}
                {new Date(r.start_at).toLocaleString()} →{' '}
                {new Date(r.end_at).toLocaleString()} | user {r.user_id}
            </span>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => cancel(r.id)}
                        >
                            Cancel
                        </button>
                    </li>
                ))}
            </ul>
            {reservations.length === 0 && (
                <div className="text-muted">No reservations</div>
            )}
        </div>
    )
}
