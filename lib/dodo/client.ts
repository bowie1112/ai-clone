/**
 * Dodo Payments API 客户端
 * 提供与 Dodo Payments API 交互的方法
 */

import { DODO_CONFIG, DODO_ENDPOINTS } from './config';

function cleanObject<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

export class DodoAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'DodoAPIError';
  }
}

/**
 * Dodo API 客户端类
 */
export class DodoClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || DODO_CONFIG.apiKey;
    this.baseUrl = baseUrl || DODO_CONFIG.baseUrl;

    if (!this.apiKey) {
      throw new Error('Dodo API key is required');
    }
  }

  /**
   * 发送 API 请求
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new DodoAPIError(
          data.message || 'API request failed',
          response.status,
          data.code
        );
      }

      return data;
    } catch (error) {
      if (error instanceof DodoAPIError) {
        throw error;
      }
      throw new DodoAPIError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * 创建支付链接
   */
  async createPaymentLink(params: {
    productId: string;
    customerId?: string;
    metadata?: Record<string, any>;
    successUrl: string;
    cancelUrl: string;
  }) {
    // 本地开发或测试模式下，如果无法访问外网，则返回模拟数据
    if (DODO_CONFIG.testMode) {
      return {
        id: `test_session_${Date.now()}`,
        url: params.successUrl.replace('{CHECKOUT_SESSION_ID}', 'test') + '&mock=1',
      } as { url: string; id: string };
    }

    return this.request<{ url: string; id: string }>(
      DODO_ENDPOINTS.createPaymentLink,
      {
        method: 'POST',
        body: JSON.stringify(cleanObject(params)),
      }
    );
  }

  /**
   * 创建客户
   */
  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, any>;
  }) {
    return this.request<{ id: string; email: string; name?: string }>(
      DODO_ENDPOINTS.createCustomer,
      {
        method: 'POST',
        body: JSON.stringify(cleanObject(params)),
      }
    );
  }

  /**
   * 获取客户信息
   */
  async getCustomer(customerId: string) {
    return this.request<{ id: string; email: string; name?: string; metadata?: Record<string, any> }>(
      DODO_ENDPOINTS.getCustomer(customerId)
    );
  }

  /**
   * 更新客户信息
   */
  async updateCustomer(
    customerId: string,
    params: {
      name?: string;
      email?: string;
      metadata?: Record<string, any>;
    }
  ) {
    return this.request(DODO_ENDPOINTS.updateCustomer(customerId), {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  }

  /**
   * 创建订阅
   */
  async createSubscription(params: {
    customerId: string;
    productId: string;
    metadata?: Record<string, any>;
  }) {
    return this.request(DODO_ENDPOINTS.createSubscription, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * 获取订阅信息
   */
  async getSubscription(subscriptionId: string) {
    return this.request(DODO_ENDPOINTS.getSubscription(subscriptionId));
  }

  /**
   * 更新订阅
   */
  async updateSubscription(
    subscriptionId: string,
    params: {
      productId?: string;
      metadata?: Record<string, any>;
    }
  ) {
    return this.request(DODO_ENDPOINTS.updateSubscription(subscriptionId), {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  }

  /**
   * 取消订阅
   */
  async cancelSubscription(
    subscriptionId: string,
    params?: {
      cancelAtPeriodEnd?: boolean;
    }
  ) {
    return this.request(DODO_ENDPOINTS.cancelSubscription(subscriptionId), {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  }

  /**
   * 发送使用事件（用于基于使用量的计费）
   */
  async ingestEvent(params: {
    eventId: string;
    customerId: string;
    eventName: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }) {
    return this.request(DODO_ENDPOINTS.ingestEvent, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * 创建退款
   */
  async createRefund(params: {
    paymentId: string;
    amount?: number;
    reason?: string;
  }) {
    return this.request(DODO_ENDPOINTS.createRefund, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * 获取退款信息
   */
  async getRefund(refundId: string) {
    return this.request(DODO_ENDPOINTS.getRefund(refundId));
  }
}

// 导出单例实例
export const dodoClient = new DodoClient();
