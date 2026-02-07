import type { ZyntraAction } from "./action.interface";
import type { ZyntraBaseContext } from "./context.interface";
import type { ZyntraPlugin } from "./plugin.interface";
import type { HTTPMethod, ZyntraActionHandler } from "./action.interface";

/**
 * Constraint que valida estrutura de action sem achatar tipos específicos
 */
export type ZyntraControllerBaseAction = {
  name?: string;
  type: "query" | "mutation";
  path: string;
  method: HTTPMethod;
  description?: string;
  body?: any;
  query?: any;
  use?: readonly any[];
  handler: ZyntraActionHandler<any, any>;
  $Infer: any; // Esta é a chave - preservamos o tipo específico aqui
};

/**
 * Constraint inteligente que valida sem perder tipos
 */
type ValidateActions<T> = {
  [K in keyof T]: T[K] extends ZyntraControllerBaseAction 
    ? T[K]  // ✅ Mantém o tipo específico se é válido
    : never // ❌ Erro se não é uma action válida
};

export type ZyntraControllerConfig<
  TControllerActions extends Record<string, ZyntraControllerBaseAction> // 🔄 Nova constraint
> = {
  name: string;
  path: string;
  description?: string;
  actions: ValidateActions<TControllerActions>; // 🔄 Validação com preservação de tipos
}