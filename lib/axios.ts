import axios from "axios"
import { toast } from "react-hot-toast"

const api = axios.create({
  baseURL: "https://apiv2.coobet.app/",
})

// Detect if a message from API is in French
function detectLang(text: string): "fr" | "en" {
  const frenchWords = ["le", "la", "une", "pas", "de", "pour", "avec", "et", "sur"]
  const lower = text?.toLowerCase() || ""
  const score = frenchWords.filter((w) => lower.includes(w)).length
  return score > 2 ? "fr" : "en"
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  const url = config.url || ""
  const isLoginRequest = url.includes("/auth/login")
  const isRefreshRequest = url.includes("/auth/refresh")
  if (token && !isLoginRequest && !isRefreshRequest) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // 🚫 Handle permission errors - redirect to login
    const permissionErrorMsg = error.response?.data?.details || error.response?.data?.detail || error.response?.data?.error || ""
    if (permissionErrorMsg.includes("You do not have permission to perform this action")) {
      import("@/lib/auth").then(({ clearAuthTokens }) => clearAuthTokens())
      window.location.href = "/login"
      return Promise.reject(error)
    }

    // 🔁 Handle token refresh for 401 errors
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refresh = localStorage.getItem("refresh_token")

        if (!refresh) {
          throw new Error("No refresh token available")
        }

        const res = await axios.post(`https://apiv2.coobet.app/auth/refresh`, { refresh })
        const newToken = res.data.access

        // Update both localStorage and cookies
        localStorage.setItem("access_token", newToken)
        const isProduction = process.env.NODE_ENV === "production"
        const cookieOptions = isProduction ? "path=/; max-age=604800; secure; samesite=strict" : "path=/; max-age=604800; samesite=strict"
        document.cookie = `access_token=${newToken}; ${cookieOptions}`

        api.defaults.headers.Authorization = `Bearer ${newToken}`
        original.headers.Authorization = `Bearer ${newToken}`

        return api(original)
      } catch (refreshError) {
        // Token refresh failed - clear tokens and redirect to login
        import("@/lib/auth").then(({ clearAuthTokens }) => clearAuthTokens())
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    // 🌍 Smart language-aware error display with specific status code handling
    let errorMessage = ""

    // Handle specific status codes with default French messages
    if (error.response?.status >= 500) {
      errorMessage = "Erreur serveur interne. Veuillez réessayer plus tard."
    } else if (error.response?.status === 404) {
      errorMessage = "Ressource non trouvée."
    } else if (error.response?.status) {
      // For other status codes, try to get backend message
      errorMessage =
        error.response?.data?.details ||
        error.response?.data?.detail ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        (typeof error.response?.data === "string" ? error.response.data : "")
    }

    // If no specific message was set (unrecognized error), use default
    if (!errorMessage) {
      errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer."
    }

    // Don't show toast for authentication errors that are being handled or permission errors (redirecting)
    const isPermissionError = errorMessage.includes("You do not have permission to perform this action")
    if ((error.response?.status !== 401 || !original._retry) && !isPermissionError) {
      toast.error(errorMessage, {
        style: {
          direction: "ltr",
          fontFamily: "sans-serif",
        },
      })
    }

    return Promise.reject(error)
  },
)

export default api
