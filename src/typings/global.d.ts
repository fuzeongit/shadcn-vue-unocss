interface Window {
  $fp?: import('@fingerprintjs/fingerprintjs').Agent;
  $dialog?: ReturnType<typeof import('@/components/nameless/dialog').useDialog>;
  $toast?: import('@/components/ui/toast').Toast;
}

declare namespace Global {
  type StringKeys<T extends object> = keyof T & string;
}
