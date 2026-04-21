// Token'ı header'a otomatik ekleyen base API wrapper
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const getHeaders = (): Record<string, string> => {
    if (import.meta.client) {
      const token = localStorage.getItem('access_token')
      return token ? { Authorization: `Bearer ${token}` } : {}
    }
    return {}
  }

  const get = <T>(path: string) =>
    $fetch<T>(path, {
      baseURL,
      headers: getHeaders(),
    })

  const post = <T>(path: string, body?: Record<string, any>) =>
    $fetch<T>(path, {
      method: 'POST',
      baseURL,
      headers: getHeaders(),
      body,
    })

  const patch = <T>(path: string, body?: Record<string, any>) =>
    $fetch<T>(path, {
      method: 'PATCH',
      baseURL,
      headers: getHeaders(),
      body,
    })

  return { get, post, patch }
}
