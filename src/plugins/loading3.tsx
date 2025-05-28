import { render } from 'solid-js/web';
import { Loading } from '../widgets/loading';

export async function setupLoading() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  render(() => <Loading />, document.getElementById('app')!);
}
