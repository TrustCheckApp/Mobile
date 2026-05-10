/** Extrai mensagem segura para o utilizador (sem ecoar corpo sensível). */
export function userFacingMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiClientError) {
    return err.userMessage;
  }
  if (err instanceof Error && err.message && !looksSensitive(err.message)) {
    return err.message;
  }
  return fallback;
}

function looksSensitive(s: string): boolean {
  const lower = s.toLowerCase();
  return (
    lower.includes('token') ||
    lower.includes('bearer') ||
    lower.includes('otp') ||
    lower.includes('password') ||
    lower.includes('refresh')
  );
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly userMessage: string;

  constructor(status: number, code: string | undefined, userMessage: string) {
    super(userMessage);
    this.status = status;
    this.code = code;
    this.userMessage = userMessage;
  }
}

type NestErrBody = {
  message?: string | { code?: string; message?: string };
  statusCode?: number;
};

export function parseNestError(status: number, body: unknown): ApiClientError {
  const b = body as NestErrBody;
  let code: string | undefined;
  let msg = 'Não foi possível concluir o pedido.';

  if (typeof b?.message === 'string') {
    msg = b.message;
  } else if (b?.message && typeof b.message === 'object') {
    code = b.message.code;
    if (typeof b.message.message === 'string') {
      msg = b.message.message;
    }
  }

  if (status === 401) {
    msg = 'Sessão expirada ou credenciais inválidas. Inicie sessão novamente.';
  } else if (status === 403) {
    msg = 'Não tem permissão para esta ação.';
  } else if (status === 409) {
    msg = msg || 'Conflito: o recurso já existe ou está num estado incompatível.';
  } else if (status === 422) {
    msg = msg || 'Dados inválidos. Verifique os campos.';
  }

  return new ApiClientError(status, code, msg);
}
