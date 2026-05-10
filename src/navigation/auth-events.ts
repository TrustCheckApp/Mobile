type VoidFn = () => void;

let unauthorizedHandler: VoidFn | null = null;

/** Registado no `_layout` raiz — em 401/403 navega para login. */
export function setUnauthorizedHandler(fn: VoidFn | null): void {
  unauthorizedHandler = fn;
}

export function notifyUnauthorized(): void {
  try {
    unauthorizedHandler?.();
  } catch {
    /* evita crash se router ainda não estiver pronto */
  }
}
