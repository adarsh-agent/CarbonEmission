import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

export const predictFootprint = async (payload) => {
  const { data } = await client.post('/api/predict', payload)
  return data
}

export const getHistory = async (limit = 12) => {
  const { data } = await client.get('/api/history', { params: { limit } })
  return data
}

export const getStats = async () => {
  const { data } = await client.get('/api/stats')
  return data
}

export const submitContact = async (payload) => {
  const { data } = await client.post('/api/contact', payload)
  return data
}

export default client
