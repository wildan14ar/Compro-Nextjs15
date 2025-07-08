// src/store/postSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Post {
  id: string
  authorId: string
  title: string
  slug: string
  description: string
  content: string
  thumbnail?: string
  tags: string[]
  categories: { id: string; name: string }[]
  createdAt: string
  updatedAt: string
}

interface PostState {
  items: Post[]
  loading: boolean
  error: string | null
}

const initialState: PostState = {
  items: [],
  loading: false,
  error: null,
}

// — Thunks dengan inline fetch
export const fetchPosts = createAsyncThunk<Post[]>(
  'post/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/post')
      if (!res.ok) throw new Error('Failed to fetch post')
      return (await res.json()) as Post[]
    } catch (e: unknown) {
      if (e instanceof Error) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const fetchPostById = createAsyncThunk<Post, string>(
  'post/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/post/${id}`)
      if (!res.ok) throw new Error('Failed to fetch post by ID')
      return (await res.json()) as Post
    } catch (e: unknown) {
      if (e instanceof Error) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const createPost = createAsyncThunk<Post,
  {
    title: string
    content: string
    thumbnail?: string
    tags?: string[]
    categoryIds?: string[]
  }
>(
  'post/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create post')
      }
      return (await res.json()) as Post
    } catch (e: unknown) {
      if (e instanceof Error) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const updatePost = createAsyncThunk<Post,
  {
    id: string
    title: string
    content: string
    thumbnail?: string
    tags?: string[]
    categoryIds?: string[]
  }
>(
  'post/update',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/post/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update post')
      }
      return (await res.json()) as Post
    } catch (e: unknown) {
      if (e instanceof Error) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const deletePost = createAsyncThunk<string, string>(
  'post/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/post/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete post')
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

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // FETCH
      .addCase(fetchPosts.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = payload
      })
      .addCase(fetchPosts.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })

      // FETCH BY ID
      .addCase(fetchPostById.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPostById.fulfilled, (state, { payload }) => {
        state.loading = false
        const index = state.items.findIndex(p => p.id === payload.id)
        if (index >= 0) {
          state.items[index] = payload // Update existing post
        } else {
          state.items.push(payload) // Add new post if not found
        }
      })
      .addCase(fetchPostById.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })

      // CREATE
      .addCase(createPost.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items.unshift(payload)
      })
      .addCase(createPost.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })

      // UPDATE
      .addCase(updatePost.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePost.fulfilled, (state, { payload }) => {
        state.loading = false
        const index = state.items.findIndex(p => p.id === payload.id)
        if (index >= 0) {
          state.items[index] = payload // Update existing post
        } else {
          state.items.push(payload) // Add new post if not found
        }
      })
      .addCase(updatePost.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })

      // DELETE
      .addCase(deletePost.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePost.fulfilled, (state, { payload }) => {
        state.loading = false
        state.items = state.items.filter(p => p.id !== payload)
      })
      .addCase(deletePost.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
  },
})

export default postSlice.reducer
