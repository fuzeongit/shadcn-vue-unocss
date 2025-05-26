interface Window {
  $fp?: import('@fingerprintjs/fingerprintjs').Agent;
  $dialog?: ReturnType<typeof import('@/components/imanum/dialog').useDialog>;
  $toast?: import('@/components/ui/toast').Toast;
}
