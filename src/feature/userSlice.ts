// src/store/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface User {
  id: string
  userName: string
  fullName: string
  email: string
}

interface UserState {
  items: User[]
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  items: [],
  loading: false,
  error: null,
}

// — Thunks dengan inline fetch
export const fetchUser = createAsyncThunk<User[]>(
  'user/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/user')
      if (!res.ok) throw new Error('Failed to fetch user')
      return (await res.json()) as User[]
    } catch (e: unknown) {
      if (e instanceof Error) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const createUser = createAsyncThunk<User,
  { userName: string; fullName: string; email: string }
>(
  'user/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create user')
      }
      return (await res.json()) as User
    } catch (e: unknown) {
      if (e instanceof Error) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const updateUser = createAsyncThunk<User,
  { id: string; userName: string; fullName: string; email: string }
>(
  'user/update',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/user/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update user')
      }
      return (await res.json()) as User
    } catch (e: unknown) {
      if (e instanceof Error) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const deleteUser = createAsyncThunk<string, string>(
  'user/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/user/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete user')
      }
      return id
    } catch (e: unknown) {
      if (e instanceof Error) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // FETCH
      .addCase(fetchUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = payload
      })
      .addCase(fetchUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
      // CREATE
      .addCase(createUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items.push(payload)
      })
      .addCase(createUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
      // DELETE
      .addCase(deleteUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = state.items.filter(u => u.id !== payload)
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
  },
})

export default userSlice.reducer
    