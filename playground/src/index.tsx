import { h, Fragment } from 'vue';

import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import satori from 'satori';
import { vue } from 'r2vnode';


async function main() {
  const fontName = 'e-UkraineHead-Regular.ttf';
  const fontBuffer = await readFile(
    join(dirname(fileURLToPath(import.meta.url)), fontName)
  );

  const message = "Hello from vue!";

  const svg = await satori(
    vue(
      <section>
        <h1>
          { message }
        </h1>

        <br/>

        <p>
          testing with
        </p>

        <span>
          vue <code>h</code> function
        </span>
      </section>
    ),
    {
      debug: true,
      width: 640,
      height: 480,
      fonts: [
        {
          name: 'UkraineHead',
          data: fontBuffer,
        }
      ]
    }
  )

  await writeFile('./image.svg', svg);
}

main()

