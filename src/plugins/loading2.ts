import { html, render } from 'lit';

export function setupLoading() {
  const primaryColor = `--primary-color: hsv(240 5.9% 10%)`;

  const loadingClasses = [
    'left-0 top-0',
    'left-0 bottom-0 animate-delay-500',
    'right-0 top-0 animate-delay-1000',
    'right-0 bottom-0 animate-delay-1500'
  ];

  const dot = loadingClasses.map(item => {
    return html`
      <div class="absolute w-16px h-16px bg-primary rounded-8px animate-pulse ${item}"></div>
    `;
  });

  const loading = html`
    <div class="fixed-center flex-col bg-layout" style="${primaryColor}">
      <div class="w-56px h-56px my-36px">
        <div class="relative h-full animate-spin">${dot}</div>
      </div>
    </div>
  `;

  const app = document.getElementById('app');

  if (app) {
    render(
      html`
        ${loading}
      `,
      app
    );
    // app.innerHTML = loading;
  }
}
