// @unocss-include

import type { Preset } from '@unocss/core';
import type { Theme } from '@unocss/preset-uno';

const POSITION_ABBR = {
  t: 'top',
  r: 'right',
  b: 'bottom',
  l: 'left'
};

export function presetSoybeanAdmin(): Preset<Theme> {
  const preset: Preset<Theme> = {
    name: 'preset-soybean-admin',
    shortcuts: [
      {
        'flex-1-hidden': 'flex-1 overflow-hidden'
      },
      [/^(flex|inline-flex)-center$/, ([, c]) => `${c} justify-center items-center`],
      [/^(flex|inline-flex)-(x|y)-center$/, ([, c, d]) => `${c} ${d === 'x' ? 'justify-center' : 'items-center'}`],
      [/^(flex|inline-flex)-col-(stretch|center)$/, ([, c, d]) => `${c} flex-col justify-${d}`],
      [
        /^(absolute|fixed)-([t|r|b|l]{2,4})$/,
        ([, c, d]) => {
          let position = c;
          d.split('').forEach(it => {
            position += ` ${POSITION_ABBR[it as 't' | 'r' | 'b' | 'l']}-0`;
          });
          return position;
        }
      ],
      [/^(absolute|fixed)-center$/, ([, c]) => `${c} flex-center size-full`],
      {
        'nowrap-hidden': 'overflow-hidden whitespace-nowrap',
        'ellipsis-text': 'nowrap-hidden text-ellipsis'
      }
    ]
  };

  return preset;
}

export default presetSoybeanAdmin;
