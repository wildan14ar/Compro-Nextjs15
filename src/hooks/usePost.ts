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
    // Ensure content is a string before dispatching
    const safePayload = {
      ...payload,
      content: typeof payload.content === 'string' ? payload.content : JSON.stringify(payload.content),
    }
    dispatch(createPost(safePayload))
  }

  const editPost = (payload: Post) => {
    // Ensure content is a string before dispatching
    const safePayload = {
      ...payload,
      content: typeof payload.content === 'string' ? payload.content : JSON.stringify(payload.content),
    }
    dispatch(updatePost(safePayload))
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
