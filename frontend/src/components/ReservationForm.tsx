import { useEffect, useState } from 'react'
import api from '../api'
import type { Room, User, Reservation } from '../types'
import { toast } from 'react-hot-toast'

type Props = { onCreated: (r: Reservation) => void }

export default function ReservationForm({ onCreated }: Props) {
    const [rooms, setRooms] = useState<Room[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [roomId, setRoomId] = useState<number>(0)
    const [userId, setUserId] = useState<number>(0)
    const [startAt, setStartAt] = useState<string>('')
    const [endAt, setEndAt] = useState<string>('')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        Promise.all([api.get('/rooms'), api.get('/users')])
            .then(([rRooms, rUsers]) => {
                setRooms(Array.isArray(rRooms.data) ? rRooms.data : [])
                setUsers(Array.isArray(rUsers.data) ? rUsers.data : [])
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!roomId || !userId || !startAt || !endAt) {
            toast.error('Preencha todos os campos')
            return
        }

        try {
            const payload = {
                room_id: roomId,
                user_id: userId,
                start_at: new Date(startAt).toISOString(),
                end_at: new Date(endAt).toISOString(),
            }
            const r = await api.post('/reservations', payload)
            onCreated(r.data.data as Reservation)
            setStartAt('')
            setEndAt('')
            toast.success('Reserva criada com sucesso!')
        } catch (err: any) {
            const apiMsg =
                err?.response?.data?.message ??
                    (err?.response?.data?.errors
                        ? (Object.values(err.response.data.errors).flat() as string[])[0]
                        : null) ??
                        err?.message

                        toast.error(String(apiMsg || 'Erro ao criar reserva'))
        }
    }

    if (loading) return <div>Carregando opções…</div>
    if (error) return <div className="text-danger">Erro: {error}</div>

    return (
        <form className="row g-2" onSubmit={submit}>
            <div className="col-md-3">
                <select
                    className="form-select"
                    value={roomId}
                    onChange={(e) => setRoomId(parseInt(e.target.value))}
                >
                    <option value={0}>Select room</option>
                    {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-3">
                <select
                    className="form-select"
                    value={userId}
                    onChange={(e) => setUserId(parseInt(e.target.value))}
                >
                    <option value={0}>Select user</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-3">
                <input
                    className="form-control"
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                />
            </div>

            <div className="col-md-3">
                <input
                    className="form-control"
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                />
            </div>

            <div className="col-12">
                <button
                    className="btn btn-primary"
                    disabled={!roomId || !userId || !startAt || !endAt}
                >
                    Create
                </button>
            </div>
        </form>
    )
}
