import fingerprintJS from '@fingerprintjs/fingerprintjs';

export async function setupFp() {
  const fp = await fingerprintJS.load();
  window.$fp = fp;
}
