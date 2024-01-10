# r2vnode

Transforms Vue VNode to simple React VNode. This gives us ability to generate svg's with satori with vue components/jsx.

## Usage


1. Install
    ```bash
    yarn add r2vnode
    ```

2. Write jsx and transform with `vue` function
```tsx
import satroi from 'satori'
import { vue } from 'r2vnode'

const message = 'Hello from Vue!'

const svg = await satori(
    vue(
        <section>
            <h1>{message}</h1>

            <p>something like this !</p>
        </section>
    ),
    satoriOptions
)
```
