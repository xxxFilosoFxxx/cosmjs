import {
  isJsonRpcErrorResponse,
  JsonRpcRequest,
  JsonRpcSuccessResponse,
  parseJsonRpcResponse,
} from "@filosof-copilot-cosmjs/json-rpc";

import { http } from "./http";
import { hasProtocol, RpcClient } from "./rpcclient";

export interface HttpEndpoint {
  /**
   * The URL of the HTTP endpoint.
   *
   * For POST APIs like Tendermint RPC in CosmJS,
   * this is without the method specific paths (e.g. https://cosmoshub-4--rpc--full.datahub.figment.io/)
   */
  readonly url: string;
  /**
   * HTTP headers that are sent with every request, such as authorization information.
   */
  readonly headers: Record<string, string>;
}

export interface HttpProxyEndpoint extends Pick<HttpEndpoint, "url"> {
  readonly proxy?: string;
}

export class HttpClient implements RpcClient {
  protected readonly url: string;
  protected readonly headers: Record<string, string> | undefined;
  protected readonly proxy: string | undefined;

  public constructor(endpoint: string | HttpEndpoint | HttpProxyEndpoint) {
    if (typeof endpoint === "string") {
      if (!hasProtocol(endpoint)) {
        throw new Error("Endpoint URL is missing a protocol. Expected 'https://' or 'http://'.");
      }
      this.url = endpoint;
    } else {
      this.url = endpoint.url;

      if ("proxy" in endpoint) {
        this.proxy = endpoint.proxy;
      }

      if ("headers" in endpoint) {
        this.headers = endpoint.headers;
      }
    }
  }

  public disconnect(): void {
    // nothing to be done
  }

  public async execute(request: JsonRpcRequest): Promise<JsonRpcSuccessResponse> {
    const response = parseJsonRpcResponse(await http("POST", this.url, this.headers, request, this.proxy));
    if (isJsonRpcErrorResponse(response)) {
      throw new Error(JSON.stringify(response.error));
    }
    return response;
  }
}
