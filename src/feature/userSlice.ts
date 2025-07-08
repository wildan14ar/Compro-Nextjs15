// src/store/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface User {
  id: string
  userName: string
  fullName: string
  email: string
  role: string | string[] // Bisa string atau array string
  profile?: UserProfile
}

export interface UserProfile {
  firstName: string
  lastName: string
  bio: string
  location: string
  dateOfBirth: string
  phoneNumber: string
  avatarUrl: string
  SosialLinks: JSON
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
export const fetchUsers = createAsyncThunk<User[]>(
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

export const fetchUserByName = createAsyncThunk<User, string>(
  'user/fetchByName',
  async (userName, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/user/${userName}`)
      if (!res.ok) throw new Error('Failed to fetch user')
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
      const res = await fetch(`/api/user`, {
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = payload
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
      // FETCH BY NAME
      .addCase(fetchUserByName.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserByName.fulfilled, (state, { payload }) => {
        state.loading = false
        const existingUser = state.items.find(u => u.id === payload.id)
        if (existingUser) {
          Object.assign(existingUser, payload)
        } else {
          state.items.push(payload)
        }
      })
      .addCase(fetchUserByName.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
      // UPDATE
      .addCase(updateUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.loading = false
        const existingUser = state.items.find(u => u.id === payload.id)
        if (existingUser) {
          Object.assign(existingUser, payload)
        } else {
          state.items.push(payload)
        }
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
  },
})

export default userSlice.reducer
