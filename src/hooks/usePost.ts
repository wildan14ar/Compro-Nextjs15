import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/store'
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  type Post,
} from '@/feature/postSlice'


export function usePosts() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error } = useSelector((state: RootState) => state.post)

  const loadPosts = () => {
    dispatch(fetchPosts())
  }

  const addPost = (payload: Post) => {
    dispatch(createPost(payload))
  }

  const editPost = (payload: Post) => {
    dispatch(updatePost(payload))
  }

  const removePost = (id: string) => {
    dispatch(deletePost(id))
  }

  return {
    items,
    loading,
    error,
    loadPosts,
    addPost,
    editPost,
    removePost,
  }
}
