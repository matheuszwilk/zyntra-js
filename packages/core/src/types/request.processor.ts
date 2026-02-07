
import type { RouterContext } from 'rou3'
import type { ZyntraAction } from './action.interface'
import type { ZyntraRouter } from './router.interface'
import { DocsConfig } from './builder.interface'

export interface RequestProcessorConfig<TConfig extends ZyntraRouter<any, any, any, any, any>> {
  baseURL?: TConfig['config']['baseURL'];
  basePATH?: TConfig['config']['basePATH'];  
  controllers: TConfig['controllers'];
  context: TConfig['$Infer']['$context'];
  plugins?: Record<string, any>;
  docs?: DocsConfig;
}

export interface RequestProcessorInterface<TRouter extends ZyntraRouter<any, any, any, any, any>, TConfig extends RequestProcessorConfig<TRouter>> {
  router: RouterContext<ZyntraAction<any, any, any, any, any, any, any, any, any, any>>

  /**
   * Process an incoming HTTP request
   * @param request The incoming HTTP request
   */
  process(request: Request): Promise<Response>

  /**
   * Make a direct call to a specific controller action
   */
  call<
    TControllerKey extends keyof TConfig['controllers'],
    TActionKey extends keyof TConfig['controllers'][TControllerKey]["actions"],
    TAction extends TConfig['controllers'][TControllerKey]["actions"][TActionKey]
  >(
    controllerKey: TControllerKey,
    actionKey: TActionKey,
    input: TAction['$Infer']['$Input'] & { params?: Record<string, string | number> }
  ): Promise<TAction['$Infer']['$Output']>
}
