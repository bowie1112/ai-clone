/**
 * 全局类型定义
 * 为 next-intl 提供类型安全支持
 */

type Messages = typeof import('./messages/en.json');

declare interface IntlMessages extends Messages {}









