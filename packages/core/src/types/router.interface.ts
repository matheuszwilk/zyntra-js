import type { ZyntraControllerConfig } from "./controller.interface";
import type { DocsConfig, ZyntraBaseConfig } from "./builder.interface";
import type { ContextCallback } from "./context.interface";
import type { MutationActionCallerResult, QueryActionCallerResult } from "./client.interface";
import type { ZyntraAction } from "./action.interface";
import type { Prettify } from "./utils.interface";

export type ZyntraRouterCaller<
  TControllers extends Record<string, ZyntraControllerConfig<any>>, // ✅ Simplificado
> = {
  [C in keyof TControllers]: {
    [A in keyof TControllers[C]['actions']]:
    TControllers[C]['actions'][A]['type'] extends 'query' ? {
      type: 'query';
      query: (input: any) => Promise<TControllers[C]['actions'][A]['$Infer']['$Response']>
    } : {
      type: 'mutation';
      useMutation: (...args: any[]) => MutationActionCallerResult<TControllers[C]['actions'][A]>
      mutation: (input: any) => Promise<TControllers[C]['actions'][A]['$Infer']['$Response']>
    }
  }
}

export type ServerExtraCallerInput = {
  headers?: Record<string, string> | undefined;
  cookies?: Record<string, string>;
  credentials?: RequestCredentials;
}

export type InferServerRouterCallerAction<
  TAction extends ZyntraAction<any, any, any, any, any, any, any, any, any, any>,
  TCaller = TAction['$Infer']['$Caller'],
  TCallerParams = TCaller extends (input: infer P) => any ? P : never,
  TCallerReturn = TCaller extends (input: any) => Promise<infer R> ? R : never
> = TAction extends { method: "GET" }
  ? {
      type: 'query';
      query: (input: TCallerParams) => Promise<TCallerReturn>;
    }
  : {
      type: 'mutation';
      mutate: (input: TCallerParams) => Promise<TCallerReturn>;
    };

export type InferServerRouterCaller<
  TRouter extends ZyntraRouter<any, any, any, any, any>,
> =
  TRouter extends ZyntraRouter<any, infer TControllers, any, any, any>
    ? {
        [TControllerName in keyof TControllers]: {
          [TActionName in keyof TControllers[TControllerName]["actions"]]: InferServerRouterCallerAction<
            TControllers[TControllerName]["actions"][TActionName]
          >;
        };
      }
    : never;

export type ZyntraRouterConfig<
  TContext extends object | ContextCallback,
  TControllers extends Record<string, ZyntraControllerConfig<any>>, // ✅ Simplificado
  TConfig extends ZyntraBaseConfig,
  TPlugins extends Record<string, any>,
  TDocs extends DocsConfig
> = {
  config: TConfig;
  controllers: TControllers;
  context: TContext;  
  plugins: TPlugins;
  docs: TDocs;
}

export type ZyntraRouter<
  TContext extends object | ContextCallback,
  TControllers extends Record<string, ZyntraControllerConfig<any>>, // ✅ Simplificado
  TConfig extends ZyntraBaseConfig,
  TPlugins extends Record<string, any>,
  TDocs extends DocsConfig,
> = {
  config: TConfig & { docs?: TDocs };
  controllers: TControllers;
  handler: (request: Request) => Promise<Response>;
  caller: InferServerRouterCaller<ZyntraRouter<TContext, TControllers, TConfig, TPlugins, TDocs>>;
  $Infer: {
    $context: TContext;
    $plugins: TPlugins;
  }
}