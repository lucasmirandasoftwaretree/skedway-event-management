import { useEffect, useState } from 'react'
import api from '../api'
import type { User } from '../types'
import { isAxiosError } from 'axios'
import { toast } from 'react-hot-toast'

type Props = {
    onCreated: () => void
    selectedRoomId: number
}

type ApiErrorData = { message?: string; errors?: Record<string, string[] | string> }

export default function ReservationForm({ onCreated, selectedRoomId }: Props) {
    const [users, setUsers] = useState<User[]>([])
    const [userId, setUserId] = useState<number>(0)
    const [startAt, setStartAt] = useState<string>('')
    const [endAt, setEndAt] = useState<string>('')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        api
            .get('/users')
            .then((r) => {
                const list = Array.isArray(r.data) ? r.data : []
                setUsers(list)
                if (list[0]) setUserId(list[0].id)
            })
            .catch((e: unknown) => {
                const msg = e instanceof Error ? e.message : 'Erro ao carregar usuários'
                setError(msg)
            })
            .finally(() => setLoading(false))
    }, [])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedRoomId || !userId || !startAt || !endAt) {
            toast.error('Preencha todos os campos')
            return
        }

        try {
            const payload = {
                room_id: selectedRoomId,
                user_id: userId,
                start_at: new Date(startAt).toISOString(),
                end_at: new Date(endAt).toISOString(),
            }
            await api.post('/reservations', payload)
            onCreated()
            setStartAt('')
            setEndAt('')
            toast.success('Reserva criada com sucesso!')
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
                    value={userId}
                    onChange={(e) => setUserId(parseInt(e.target.value))}
                >
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

            <div className="col-12 col-md-3">
                <button
                    className="btn btn-primary w-100"
                    disabled={!selectedRoomId || !userId || !startAt || !endAt}
                >
                    Create
                </button>
            </div>
        </form>
    )
}
