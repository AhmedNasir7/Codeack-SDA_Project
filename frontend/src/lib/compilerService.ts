import { API_BASE_URL } from './apiConfig'

export interface RunCodePayload {
  languageId: number
  sourceCode: string
  stdin?: string
}

export interface RunCodeResponse {
  stdout?: string | null
  stderr?: string | null
  compile_output?: string | null
  status?: {
    id: number
    description: string
  }
  time?: string | null
  memory?: number | null
}

export const compilerService = {
  async runCode(payload: RunCodePayload): Promise<RunCodeResponse> {
    const response = await fetch(`${API_BASE_URL}/compiler/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw new Error(
        errorBody?.message || 'Unable to execute code at the moment.'
      )
    }

    return response.json()
  },
}

