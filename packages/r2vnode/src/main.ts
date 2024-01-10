import { isVNode } from '@vue/runtime-core';
import { normalizeStyle } from '@vue/shared';
import { camelCase } from 'scule';

import type { VNode } from '@vue/runtime-core';

export interface RNode {
  type: string;
  props: {
    style?: Record<string, any>;
    children?: string | RNode | RNode[];
    [prop: string]: any;
  };
}

export function resolveVNodeType(node: VNode): string {
  if (typeof node.type === 'string')
    return node.type;

  return resolveVNodeType(node.type as VNode);
}

type NestedArray<T> = Array<NestedArray<T> | T>;
export function deepFlat<T>(arr: NestedArray<T>): Array<T> {
  const flattend: T[] = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      flattend.concat(deepFlat(item))
    } else {
      flattend.push(item)
    }
  }

  return flattend;
}

export type SimpleValue = number | string | boolean
export function isSimpleValue(value: unknown): value is SimpleValue {
  return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number';
}

export function toRNode(node: VNode | SimpleValue | null | undefined | void): RNode | string {
  if (node == null || isSimpleValue(node)) {
    return node?.toString() || '';
  }

  const rnode: RNode = {
    type: resolveVNodeType(node),
    props: node.props || {},
  };

  for (const key in rnode.props) {
    rnode.props[key] = rnode.props[key].toString();
  }

  if (node.children) {
    if (Array.isArray(node.children)) {
      const children = deepFlat(node.children).map((value) => toRNode(value));

      // @ts-expect-error idk how to type this
      rnode.props.children = children.every(value => typeof value === 'string')
        ? children.join('')
        : children;
    } else if (isVNode(node.children)) {
      rnode.props.children = toRNode(node.children);
    } else if (isSimpleValue(node.children)) {
      rnode.props.children = node.children;
    } else {
      throw new Error('slots are not supported yet')
    }
  } else {
    rnode.props.children = [];
  }

  if (node.props?.style) {
    const normalizedStyles = normalizeStyle(node.props.style);

    if (typeof normalizedStyles === 'string') {
      rnode.props.style = normalizedStyles
        .split(';')
        .reduce((acc, str) => {
          const [key, value] = str.split(':') 

          acc[camelCase(key.trim())] = value.trim();

          return acc
        }, {});
    } else if (typeof normalizedStyles === 'object'){
      rnode.props.style = normalizedStyles;
    }
  }

  return rnode;
}

export function satoriVue(node: VNode): RNode {
  const children = toRNode(node)

  return {
    type: 'div',
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      },

      // @ts-expect-error idk how to type this + just to match the output of satori-html
      children: Array.isArray(children) ? children : [children],
    },
  }
}
