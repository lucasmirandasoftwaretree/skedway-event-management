export type Room = { id: number; name: string }

export type User = { id: number; name: string }

export type Reservation = {
    id: number
    room_id: number
    user_id: number
    start_at: string
    end_at: string
}
