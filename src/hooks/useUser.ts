import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import {
  fetchUsers,
  fetchUserByName,
  updateUser,
  type User,
} from '@/feature/userSlice'

export function useUsers() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.user)

  const loadUsers = () => {
    dispatch(fetchUsers())
  }

  const findUserByName = (name: string) => {
    dispatch(fetchUserByName(name))
  }

  const editUser = (payload: User) => {
    dispatch(updateUser(payload))
  }

  return {
    items,
    loading,
    error,
    loadUsers,
    findUserByName,
    editUser,
  }
}
