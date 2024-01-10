import { expect, describe, it } from 'vitest';
import { h } from '@vue/runtime-core'
import { renderToString } from '@vue/server-renderer';
import { html as htmlToSatori } from 'satori-html';
import { vue as vueToSatori } from '../src/index';

describe('transform to match satori-html node output', () => {
  it('should transform basic nodes', async () => {
    const node = h('p', 'text');
    const html = await renderToString(node)

    const satoriNode = htmlToSatori(html) 
    const vnodeFromVue = vueToSatori(node);

    expect(vnodeFromVue).toMatchObject(
      expect.objectContaining(satoriNode)
    )
  })

  it('should transform multiple children', async () => {
    const node = h('div', { 'data-inner': true }, ['something', 'something'])
    const html = await renderToString(node);

    const satoriNode = htmlToSatori(html)
    const vnodeFromVue = vueToSatori(node);

    expect(vnodeFromVue).toMatchObject(
      expect.objectContaining(satoriNode)
    )
  })

  it('should transform multiple component children', async () => {
    const node = h('section', { 'aria-label': 'testing'}, [
      h('h2', 'heading'),
      h('p', 'text')
    ])
    const html = await renderToString(node);

    const satoriNode = htmlToSatori(html);
    const vnodeFromVue = vueToSatori(node);

    expect(vnodeFromVue).toMatchObject(
      expect.objectContaining(satoriNode)
    )
  })

  it('should transform component with styles', async () => {
    const node = h('p', { style: 'flex-direction: row;display: flex' });
    const html = await renderToString(node);

    const satoriNode = htmlToSatori(html);
    const vnodeFromVue = vueToSatori(node);

    expect(vnodeFromVue).toMatchObject(
      expect.objectContaining(satoriNode)
    )
  })

  it('should correcly render node with class', async () => {
    const node = h('p', { class: 'some tailwind class' });
    const html = await renderToString(node);

    const satoriNode = htmlToSatori(html);
    const vnodeFromVue = vueToSatori(node);

    expect(vnodeFromVue).toMatchObject(
      expect.objectContaining(satoriNode)
    )
  })
})
