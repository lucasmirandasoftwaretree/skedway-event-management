import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../api'
import type { Reservation, User } from '../types'
import { isAxiosError } from 'axios'
import { toast } from 'react-hot-toast'

type Props = {
    selectedRoomId: number
    selectedUserId: number
    users: User[]
}

type ReservationsResponse = { data: Reservation[] }
type ApiErrorData = { message?: string; errors?: Record<string, string[] | string> }

export default function ReservationList({ selectedRoomId, selectedUserId, users }: Props) {
    const [reservations, setReservations] = useState<Reservation[]>([])

    const userNameMap = useMemo(() => {
        const m = new Map<number, string>()
        users.forEach((u) => m.set(u.id, u.name))
        return m
    }, [users])

    const load = useCallback(() => {
        const qs = new URLSearchParams()
        if (selectedRoomId) qs.set('room_id', String(selectedRoomId))
        if (selectedUserId) qs.set('user_id', String(selectedUserId))
        const suffix = qs.toString() ? `?${qs.toString()}` : ''
        api.get<ReservationsResponse>('/reservations' + suffix).then((r) => {
            setReservations(r.data.data)
        })
    }, [selectedRoomId, selectedUserId])

    useEffect(() => {
        load()
    }, [load])

    const cancel = async (id: number) => {
        try {
            await api.delete(`/reservations/${id}`)
            toast.success('Reserva cancelada')
            load()
        } catch (err: unknown) {
            let apiMsg: string | null = null
            if (isAxiosError(err)) {
                const data = err.response?.data as ApiErrorData | undefined
                const firstErr =
                    data?.errors ? (Object.values(data.errors).flat()[0] as string) : null
                apiMsg = data?.message ?? firstErr ?? err.message
            } else if (err instanceof Error) {
                apiMsg = err.message
            }
            toast.error(String(apiMsg || 'Erro ao cancelar reserva'))
        }
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
                            {new Date(r.end_at).toLocaleString()} |{' '}
                            {userNameMap.get(r.user_id) ?? `user ${r.user_id}`}
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
            {reservations.length === 0 && <div className="text-muted">No reservations</div>}
        </div>
    )
}
