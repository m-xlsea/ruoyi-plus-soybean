export {};

declare global {
  export interface Window {
    /** NProgress instance */
    NProgress?: import('nprogress').NProgress;
    /** Loading bar instance */
    $loadingBar?: import('naive-ui').LoadingBarProviderInst;
    /** Dialog instance */
    $dialog?: import('naive-ui').DialogProviderInst;
    /** Message instance */
    $message?: import('naive-ui').MessageProviderInst;
    /** Notification instance */
    $notification?: import('naive-ui').NotificationProviderInst;
    /** Content loading */
    $loading?: {
      loading: import('vue').Ref<boolean>;
      description: import('vue').Ref<string>;
      startLoading: (description?: string) => void;
      endLoading: () => void;
    };
  }

  /** Build time of the project */
  export const BUILD_TIME: string;
}
