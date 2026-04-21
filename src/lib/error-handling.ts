/**
 * Classe de erro customizada para Simulado
 * Fornece código de erro e mensagem padronizados
 */
export class SimuladoError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "SimuladoError";
    Object.setPrototypeOf(this, SimuladoError.prototype);
  }
}

/**
 * Tipos de erro conhecidos
 */
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  SERVER_ERROR = "SERVER_ERROR",
  ASYNC_ERROR = "ASYNC_ERROR",
  DATA_FETCH_ERROR = "DATA_FETCH_ERROR",
}

/**
 * Handler de erro com logging e tratamento uniforme
 * @param error - O erro capturado
 * @param context - Contexto onde o erro ocorreu
 */
export const handleError = (
  error: unknown,
  context?: string,
): SimuladoError => {
  if (error instanceof SimuladoError) {
    return error;
  }

  if (error instanceof Error) {
    console.error(`[${context || "APP"}] Erro:`, error.message);
    return new SimuladoError(error.message, ErrorCode.SERVER_ERROR, 500);
  }

  console.error(`[${context || "APP"}] Erro desconhecido:`, error);
  return new SimuladoError("Erro desconhecido", ErrorCode.SERVER_ERROR, 500);
};

/**
 * Wrapper seguro para operações assíncronas
 * @param asyncFn - Função assíncrona a executar
 * @param context - Contexto de erro
 */
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  context?: string,
): Promise<[T | null, SimuladoError | null]> => {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    const err = handleError(error, context);
    return [null, err];
  }
};
