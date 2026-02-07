import type { ZyntraRouter } from "@zyntra-js/core";
import type { ServerCapabilities } from "@modelcontextprotocol/sdk/types.js";
import { createMcpAdapter } from "src/core/adapter";
import type { ArgsRawShape, McpAdapterOptions, McpAdapterSpecificOptions, McpCustomTool, McpEventsOptions, McpOAuthConfig, McpPrompt, McpResource, McpResponseOptions, McpServerInfo, McpToolTransform } from "src/types";

export class ZyntraMcpServer<
  TRouter extends ZyntraRouter<any, any, any, any, any>,
  TCustomTools extends readonly McpCustomTool<any, any>[],
  TCustomPrompts extends readonly McpPrompt<any, any>[],
  TCustomResources extends readonly McpResource<any>[]
> {
  private _options: McpAdapterOptions<TRouter, TRouter['$Infer']['$context']>;
  private _handler: {
    server: (request: Request) => Promise<Response>;
    auth: {
      resource: (request: Request) => Promise<Response> | Response;
      cors: (request: Request) => Promise<Response> | Response;
    };
  };

  constructor(options?: McpAdapterOptions<TRouter, TRouter['$Infer']['$context']>) {
    this._options = options || {} as McpAdapterOptions<TRouter, TRouter['$Infer']['$context']>
    this._handler = {
      server: async (request: Request) => new Response('Not implemented', { status: 501 }),
      auth: {
        resource: async (request: Request) => new Response('Not implemented', { status: 501 }),
        cors: async (request: Request) => new Response('Not implemented', { status: 501 }),
      }
    };
  }

  static create() {
    return new ZyntraMcpServer();
  }

  router<
    TNewRouter extends ZyntraRouter<any, any, any, any, any>,
  >(router: TNewRouter): ZyntraMcpServer<TNewRouter, [], [], []> {
    const { router: _, ...rest } = this._options;
    return new ZyntraMcpServer<TNewRouter, [], [], []>({
      ...rest,
      router,
    });
  }

  withLogger(logger: {
    log: (message: string) => void;
    error: (message: string) => void;
    warn: (message: string) => void;
    debug: (message: string) => void;
  }): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    this._options.logger = logger;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  withToolTransform(transform: McpToolTransform): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    if (!this._options.tools) {
      this._options.tools = { autoMap: true, custom: [] };
    }
    this._options.tools.transform = transform;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  withInstructions(instructions: string): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    this._options.instructions = instructions;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }
  
  withCapabilities(capatibilities: ServerCapabilities): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    this._options.capatibilities = capatibilities;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  withServerInfo(serverInfo: McpServerInfo): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    this._options.serverInfo = serverInfo;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  withOAuth(oauth: McpOAuthConfig): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    this._options.oauth = oauth;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  addPrompt<
    TArgs extends ArgsRawShape,
    TPrompt extends McpPrompt<TArgs, TRouter['$Infer']['$context']>
  >(prompt: TPrompt): ZyntraMcpServer<TRouter, TCustomTools, [...TCustomPrompts, TPrompt], TCustomResources> {
    if (!this._options.prompts) {
      this._options.prompts = { custom: [] };
    }
    if (!this._options.prompts.custom) {
      this._options.prompts.custom = [];
    }
    this._options.prompts.custom.push(prompt);
    return new ZyntraMcpServer<TRouter, TCustomTools, [...TCustomPrompts, TPrompt], TCustomResources>({
      ...this._options,
    });
  }

  addTool<
    TArgs extends ArgsRawShape,
    TTool extends McpCustomTool<TArgs, TRouter['$Infer']['$context']>
  >(tool: McpCustomTool<TArgs, TRouter['$Infer']['$context']>): ZyntraMcpServer<TRouter, [...TCustomTools, TTool], TCustomPrompts, TCustomResources> {
    if (!this._options.tools) {
      this._options.tools = { autoMap: true, custom: [] };
    }
    if (!this._options.tools.custom) {
      this._options.tools.custom = [];
    }
    this._options.tools.custom.push(tool);
    return new ZyntraMcpServer<TRouter, [...TCustomTools, TTool], TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  addResource<TResource extends McpResource<TRouter['$Infer']['$context']>>(resource: TResource): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, [...TCustomResources, TResource]> {
    if (!this._options.resources) {
      this._options.resources = { custom: [] };
    }
    if (!this._options.resources.custom) {
      this._options.resources.custom = [];
    }
    this._options.resources.custom.push(resource);
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, [...TCustomResources, TResource]>({
      ...this._options,
    });
  }

  withEvents(events: McpEventsOptions<TRouter['$Infer']['$context']>): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    this._options.events = events;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  withResponse(response: McpResponseOptions<TRouter['$Infer']['$context']>): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    this._options.response = response;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  withAdapter(adapter: McpAdapterSpecificOptions): ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources> {
    this._options.adapter = adapter;
    return new ZyntraMcpServer<TRouter, TCustomTools, TCustomPrompts, TCustomResources>({
      ...this._options,
    });
  }

  build() {
    if (!this._options.router) {
      throw new Error("Router is required to build the MCP server.");
    }

    this._handler = createMcpAdapter<TRouter>(this._options);

    return {
      handler: this._handler.server,
      auth: this._handler.auth,
      $Infer: {
        $context: {} as TRouter['$Infer']['$context'],
        $tools: {} as TCustomTools,
        $prompts: {} as TCustomPrompts,
        $resources: {} as TCustomResources,
      }
    };
  }
}