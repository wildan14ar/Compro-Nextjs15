// features/companyProfile/companyProfileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Tipe data CompanyProfile sesuai schema Prisma
export interface CompanyProfile {
  id: string
  name: string
  description?: string
  logoUrl?: string
  address?: string
  phone?: string
  email?: string
  socialLinks?: Record<string, string>
  gallery?: string[]
  isUserRegistrationEnabled: boolean
  isBlogEnabled: boolean
  isProductEnabled: boolean
  isCommentEnabled: boolean
  isLikeEnabled: boolean
  isReviewEnabled: boolean
  createdAt: string
  updatedAt: string
}

interface ProfileState {
  data: CompanyProfile | null
  loading: boolean
  error: string | null
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
}

// FETCH Thunks

export const fetchCompanyProfile = createAsyncThunk<
  CompanyProfile,
  void,
  { rejectValue: string }
>(
  'companyProfile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/company-profile')
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to fetch profile')
      }
      return (await res.json()) as CompanyProfile
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error')
    }
  }
)

export const createCompanyProfile = createAsyncThunk<
  CompanyProfile,
  Omit<Partial<CompanyProfile>, 'id' | 'createdAt' | 'updatedAt'>,
  { rejectValue: string }
>(
  'companyProfile/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/company-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to create profile')
      }
      return (await res.json()) as CompanyProfile
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error')
    }
  }
)

export const updateCompanyProfile = createAsyncThunk<
  CompanyProfile,
  Partial<CompanyProfile>,
  { rejectValue: string }
>(
  'companyProfile/update',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/company-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to update profile')
      }
      return (await res.json()) as CompanyProfile
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error')
    }
  }
)

const companyProfileSlice = createSlice({
  name: 'companyProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchCompanyProfile.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchCompanyProfile.fulfilled, (s, a: PayloadAction<CompanyProfile>) => {
        s.loading = false; s.data = a.payload
      })
      .addCase(fetchCompanyProfile.rejected, (s, a) => {
        s.loading = false; s.error = a.payload as string
      })

    // create
    builder
      .addCase(createCompanyProfile.pending, (s) => { s.loading = true; s.error = null })
      .addCase(createCompanyProfile.fulfilled, (s, a: PayloadAction<CompanyProfile>) => {
        s.loading = false; s.data = a.payload
      })
      .addCase(createCompanyProfile.rejected, (s, a) => {
        s.loading = false; s.error = a.payload as string
      })

    // update
    builder
      .addCase(updateCompanyProfile.pending, (s) => { s.loading = true; s.error = null })
      .addCase(updateCompanyProfile.fulfilled, (s, a: PayloadAction<CompanyProfile>) => {
        s.loading = false; s.data = a.payload
      })
      .addCase(updateCompanyProfile.rejected, (s, a) => {
        s.loading = false; s.error = a.payload as string
      })
  },
})

export default companyProfileSlice.reducer
