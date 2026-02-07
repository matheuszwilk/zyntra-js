import { createZyntraProcedure } from "./procedure.service";
import { createZyntraMutation, createZyntraQuery } from "./action.service";
import { createZyntraRouter } from "./router.service";
import { createZyntraController } from "./controller.service";
import type {
  StandardSchemaV1,
  ZyntraProcedure,
  ZyntraActionHandler,
  ZyntraActionContext,
  QueryMethod,
  InferEndpoint,
  ZyntraQueryOptions,
  MutationMethod,
  ZyntraMutationOptions,
  ZyntraControllerConfig,
  ContextCallback,
  Unwrap,
  ZyntraBaseConfig,
  ZyntraBuilderConfig,
  InferActionProcedureContext,
  InferZyntraContext,
  ZyntraControllerBaseAction,
  ZyntraRealtimeService as ZyntraRealtimeServiceType,
  DocsConfig,
  ZyntraRouter,
} from "../types";
import type { ZyntraStoreAdapter } from "../types/store.interface";
import type { ZyntraLogger } from "../types/logger.interface";
import type {
  JobsNamespaceProxy,
  MergedJobsExecutor,
} from "../types/jobs.interface";
import type { ZyntraTelemetryProvider } from "../types/telemetry.interface";
import { ZyntraRealtimeService } from "./realtime.service";

/**
 * Main builder class for the Zyntra Framework.
 * Provides a fluent interface for creating and configuring all framework components.
 *
 * @template TContext - The type of the application context
 * @template TMiddlewares - The global middleware procedures
 * @template TStore - The store adapter type
 * @template TLogger - The logger adapter type
 * @template TJobs - The job queue adapter type
 *
 * @example
 * // Initialize with custom context
 * const zyntra = Zyntra
 *   .context<{ db: Database }>()
 *   .middleware([authMiddleware])
 *   .store(redisStore)
 *   .create();
 *
 * // Create controllers and actions
 * const userController = zyntra.controller({
 *   path: 'users',
 *   actions: {
 *     list: zyntra.query({ ... }),
 *     create: zyntra.mutation({ ...  })
 *   }
 * });
 */
export class ZyntraBuilder<
  TContext extends object | ContextCallback,
  TConfig extends ZyntraBaseConfig,
  TStore extends ZyntraStoreAdapter,
  TLogger extends ZyntraLogger,
  TJobs extends JobsNamespaceProxy<any>,
  TTelemetry extends ZyntraTelemetryProvider,
  TRealtime extends ZyntraRealtimeServiceType<any>,
  TPlugins extends Record<string, any>,
  TDocs extends DocsConfig,
> {
  private _config: ZyntraBuilderConfig<
    TContext,
    TConfig,
    TStore,
    TLogger,
    TJobs,
    TTelemetry,
    TPlugins,
    TDocs
  > = {} as any;
  private _store: TStore;
  private _logger: TLogger;
  private _jobs: TJobs;
  private _telemetry: TTelemetry;
  private _realtime: TRealtime;
  private _plugins: TPlugins = {} as TPlugins;
  private _docs: TDocs = {} as TDocs;

  constructor(    
    config: ZyntraBuilderConfig<
      TContext,
      TConfig,
      TStore,
      TLogger,
      TJobs,
      TTelemetry,
      TPlugins,
      TDocs
    > = {} as any,
    store?: TStore,
    logger?: TLogger,
    jobs?: TJobs,
    telemetry?: TTelemetry,
    realtime?: TRealtime,
    plugins?: TPlugins,
    docs?: TDocs,
  ) {
    this._config = config;
    this._store = store || ({} as TStore);
    this._logger = logger || ({} as TLogger);
    this._jobs = jobs || ({} as TJobs);
    this._telemetry = telemetry || ({} as TTelemetry);
    this._realtime = realtime || ({} as TRealtime);
    this._plugins = plugins || ({} as TPlugins);
    this._docs = docs || ({} as TDocs);
  }

  /**
   * Configure the context function.
   */
  context<TNewContext extends object | ContextCallback>(
    contextFn: TNewContext,
  ): ZyntraBuilder<
    TNewContext,
    TConfig,
    TStore,
    TLogger,
    TJobs,
    TTelemetry,
    TRealtime,
    TPlugins,
    TDocs
  > {
    return new ZyntraBuilder(
      { ...this._config, context: contextFn },
      this._store,
      this._logger,
      this._jobs,
      this._telemetry,
      this._realtime,
      this._plugins,
      this._docs,
    );
  }

  /**
   * Configure router settings.
   */
  config<TNewConfig extends TConfig>(
    routerConfig: TNewConfig,
  ): ZyntraBuilder<
    TContext,
    TNewConfig,
    TStore,
    TLogger,
    TJobs,
    TTelemetry,
    TRealtime,
    TPlugins,
    TDocs
  > {
    return new ZyntraBuilder(
      { ...this._config, config: routerConfig },
      this._store,
      this._logger,
      this._jobs,
      this._telemetry,
      this._realtime,
      this._plugins,
      this._docs,
    );
  }

  /**
   * Configure a store adapter for caching, events, and more.
   */
  store(
    storeAdapter: ZyntraStoreAdapter,
  ): ZyntraBuilder<
    TContext,
    TConfig,
    ZyntraStoreAdapter,
    TLogger,
    TJobs,
    TTelemetry,
    ZyntraRealtimeServiceType,
    TPlugins,
    TDocs
  > {
    const realtime = new ZyntraRealtimeService(storeAdapter);

    return new ZyntraBuilder<
      TContext,
      TConfig,
      ZyntraStoreAdapter,
      TLogger,
      TJobs,
      TTelemetry,
      ZyntraRealtimeServiceType,
      TPlugins,
      TDocs
    >(
      { ...this._config, store: storeAdapter, realtime },
      storeAdapter,
      this._logger,
      this._jobs,
      this._telemetry,
      realtime,
      this._plugins,
      this._docs,
    );
  }

  /**
   * Configure a logger adapter for logging.
   */
  logger(
    loggerAdapter: ZyntraLogger,
  ): ZyntraBuilder<
    TContext,
    TConfig,
    TStore,
    ZyntraLogger,
    TJobs,
    TTelemetry,
    TRealtime,
    TPlugins,
    TDocs
  > {
    return new ZyntraBuilder<
      TContext,
      TConfig,
      TStore,
      ZyntraLogger,
      TJobs,
      TTelemetry,
      TRealtime,
      TPlugins,
      TDocs
    >(
      { ...this._config, logger: loggerAdapter },
      this._store,
      loggerAdapter,
      this._jobs,
      this._telemetry,
      this._realtime,
      this._plugins,
      this._docs,
    );
  }

  /**
   * Configure a job queue adapter for background processing.
   */
  jobs<
    TJobs extends MergedJobsExecutor<any>,
    TJobsProxy extends JobsNamespaceProxy<any> = ReturnType<Awaited<TJobs>["createProxy"]>
  >(jobsAdapter: TJobs) {
    const jobsProxy = jobsAdapter.createProxy() as TJobsProxy;

    return new ZyntraBuilder<
      TContext,
      TConfig,
      TStore,
      TLogger,
      TJobsProxy,
      TTelemetry,
      TRealtime,
      TPlugins,
      TDocs
    >(
      // @ts-expect-error - Expected
      { ...this._config, jobs: jobsProxy },
      this._store,
      this._logger,
      jobsProxy,
      this._telemetry,
      this._realtime,
      this._plugins,
      this._docs,
    );
  }

  /**
   * Configure a telemetry provider for observability.
   * Enables distributed tracing, metrics collection, and structured logging.
   */
  telemetry<TTelemetryProvider extends ZyntraTelemetryProvider>(
    telemetryProvider: TTelemetryProvider,
  ): ZyntraBuilder<
    TContext,
    TConfig,
    TStore,
    TLogger,
    TJobs,
    TTelemetryProvider,
    TRealtime,
    TPlugins,
    TDocs
  > {
    return new ZyntraBuilder<
      TContext,
      TConfig,
      TStore,
      TLogger,
      TJobs,
      TTelemetryProvider,
      TRealtime,
      TPlugins,
      TDocs
    >(
      // @ts-expect-error - Expected
      { ...this._config, telemetry: telemetryProvider },
      this._store,
      this._logger,
      this._jobs,
      telemetryProvider,
      this._realtime,
      this._plugins,
      this._docs,
    );
  }

  /**
   * Register plugins with the Zyntra Router
   *
   * Plugins provide self-contained functionality with actions, controllers, events, and lifecycle hooks.
   * They can access their own actions type-safely through the `self` parameter.
   *
   * @param pluginsRecord - Record of plugin name to plugin instance
   *
   * @example
   * ```typescript
   * const zyntra = Zyntra
   *   .context<MyContext>()
   *   .plugins({
   *     auth: authPlugin,
   *     email: emailPlugin,
   *     audit: auditPlugin
   *   })
   *   .create();
   *
   * // Usage in actions
   * const userController = zyntra.controller({
   *   actions: {
   *     create: zyntra.mutation({
   *       handler: async (ctx) => {
   *         await ctx.plugins.auth.actions.validateToken({ token });
   *         await ctx.plugins.email.actions.sendWelcome({ email });
   *         await ctx.plugins.audit.emit('user:created', { userId });
   *       }
   *     })
   *   }
   * });
   * ```
   */
  plugins<TNewPlugins extends Record<string, any>>(
    pluginsRecord: TNewPlugins,
  ): ZyntraBuilder<
    TContext,
    TConfig,
    TStore,
    TLogger,
    TJobs,
    TTelemetry,
    TRealtime,
    TNewPlugins,
    TDocs
  > {
    return new ZyntraBuilder<
      TContext,
      TConfig,
      TStore,
      TLogger,
      TJobs,
      TTelemetry,
      TRealtime,
      TNewPlugins,
      TDocs
    >(
      // Store plugins in config for RequestProcessor access
      { ...this._config, plugins: pluginsRecord },
      this._store,
      this._logger,
      this._jobs,
      this._telemetry,
      this._realtime,
      pluginsRecord,
      this._docs,
    );
  }

  docs<TNewDocs extends DocsConfig>(
    docsConfig: TNewDocs,
  ): ZyntraBuilder<
    TContext,
    TConfig,
    TStore,
    TLogger,
    TJobs,
    TTelemetry,
    TRealtime,
    TPlugins,
    TNewDocs
  > {
    return new ZyntraBuilder(
      { ...this._config, docs: docsConfig },
      this._store,
      this._logger,
      this._jobs,
      this._telemetry,
      this._realtime,
      this._plugins,
      docsConfig,
    );
  }

  /**
   * Creates the API with global middleware types inferred.
   */
  create() {
    type TContextCallback = Unwrap<TContext>;
    type TInferedContext = TContextCallback extends object
      ? TContextCallback
      : TContext;

    return {
      /**
       * Creates a query action for retrieving data.
       */
      /**
       * Creates a query action for retrieving data.
       */
      query: <
        TQueryPath extends string,
        TQueryQuery extends StandardSchemaV1 | undefined,
        TQueryMiddlewares extends ZyntraProcedure<any, any, unknown>[] | undefined,
        TQueryHandler extends ZyntraActionHandler<
          ZyntraActionContext<
            TInferedContext,
            TQueryPath,
            QueryMethod,
            undefined,
            TQueryQuery,
            TQueryMiddlewares,
            TPlugins
          >,
          unknown // 🔄 MUDANÇA: 'any' → 'unknown' para melhor inferência
        >,
        TQueryResponse extends ReturnType<TQueryHandler>,
        TQueryInfer extends InferEndpoint<
          TInferedContext,
          TQueryPath,
          QueryMethod,
          undefined,
          TQueryQuery,
          TQueryMiddlewares,
          TPlugins,
          TQueryHandler,
          TQueryResponse
        >,
      >(
        // 🔄 MUDANÇA: Remoção do constraint genérico no handler para permitir inferência livre
        options: ZyntraQueryOptions<
          TInferedContext,
          TQueryPath,
          TQueryQuery,
          TQueryMiddlewares,
          TPlugins,
          TQueryHandler
        >,
      ) =>
        createZyntraQuery<
          TInferedContext,
          TQueryPath,
          TQueryQuery,
          TQueryMiddlewares,
          TPlugins,
          TQueryHandler,
          TQueryResponse,
          TQueryInfer
        >(options),

      /**
       * Creates a mutation action for modifying data.
       */
      mutation: <
        TMutationPath extends string,
        TMutationMethod extends MutationMethod,
        TMutationBody extends StandardSchemaV1 | undefined,
        TMutationQuery extends StandardSchemaV1 | undefined,
        TMutationMiddlewares extends ZyntraProcedure<any, any, unknown>[] | undefined,
        TMutationHandler extends ZyntraActionHandler<
          ZyntraActionContext<
            TInferedContext,
            TMutationPath,
            TMutationMethod,
            TMutationBody,
            TMutationQuery,
            TMutationMiddlewares,
            TPlugins
          >,
          unknown // 🔄 MUDANÇA: 'any' → 'unknown' para melhor inferência
        >,
        TMutationResponse extends ReturnType<TMutationHandler>,
        TMutationInfer extends InferEndpoint<
          TInferedContext,
          TMutationPath,
          TMutationMethod,
          TMutationBody,
          TMutationQuery,
          TMutationMiddlewares,
          TPlugins,
          TMutationHandler,
          TMutationResponse
        >,
      >(
        // 🔄 MUDANÇA: Remoção do constraint genérico no handler para permitir inferência livre
        options: ZyntraMutationOptions<
          TInferedContext,
          TMutationPath,
          TMutationMethod,
          TMutationBody,
          TMutationQuery,
          TMutationMiddlewares,
          TPlugins,
          TMutationHandler
        >,
      ) =>
        createZyntraMutation<
          TInferedContext,
          TMutationPath,
          TMutationMethod,
          TMutationBody,
          TMutationQuery,
          TMutationMiddlewares,
          TPlugins,
          TMutationHandler,
          TMutationResponse,
          TMutationInfer
        >(options),

      /**
       * Creates a controller to group related actions.
       */
      controller: <TActions extends Record<string, ZyntraControllerBaseAction>>(
        config: ZyntraControllerConfig<TActions>,
      ) =>
        createZyntraController<TActions>(config),

      /**
       * Creates a router with enhanced configuration.
       */
      router: <
        TControllers extends Record<
          string,
          ZyntraControllerConfig<any>
        >,
      >(config: {
        controllers: TControllers;
      }) => {
        return createZyntraRouter<
          TInferedContext,
          TControllers,
          TConfig,
          TPlugins
        >({
          context: this._config.context as TInferedContext,
          controllers: config.controllers,
          config: { ...(this._config.config || ({} as TConfig)), docs: this._docs },
          plugins: this._plugins,
          docs: this._docs,
        });
      },

      /**
       * Creates a reusable middleware procedure.
       */
      procedure: <TOptions extends Record<string, any>, TOutput>(
        middleware: ZyntraProcedure<TInferedContext, TOptions, TOutput>,
      ) => createZyntraProcedure(middleware),

      store: this._store,
      logger: this._logger,
      jobs: this._jobs,
      telemetry: this._telemetry,
      realtime: this._realtime,
      plugins: this._plugins,

      $Infer: {
        context: {} as TInferedContext,
        config: {} as TConfig,
        store: {} as TStore,
        logger: {} as TLogger,
        jobs: {} as TJobs,
        telemetry: {} as TTelemetry,
        realtime: {} as TRealtime,
        plugins: {} as TPlugins,
        docs: {} as TDocs,
      }
    };
  }
}

/**
 * Factory function to create a new Zyntra builder instance.
 *
 * @template TContext - The type of the application context
 * @returns A new ZyntraBuilder instance
 *
 * @example
 * // Initialize with custom context
 * const zyntra = Zyntra
 *   .context<{ db: Database }>()
 *   .middleware([authMiddleware])
 *   .store(redisStore)
 *   .create();
 */
export const Zyntra = new ZyntraBuilder();

