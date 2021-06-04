import React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './style.css'
import { log } from './util'
import json from './file.json'
let wasmExpports: WebAssembly.Exports | null = null

let wasmMemory = new WebAssembly.Memory({ initial: 256, maximum: 256 })

let wasmTable = new WebAssembly.Table({
  initial: 1,
  maximum: 1,
  element: 'anyfunc',
})

let asmLibraryArg = {
  __handle_stack_overflow: () => {},
  emscripten_resize_heap: () => {},
  __lock: () => {},
  __unlock: () => {},
  memory: wasmMemory,
  table: wasmTable,
}

let info = {
  env: asmLibraryArg,
  wasi_snapshot_preview1: asmLibraryArg,
}

async function loadWasm() {
  let response = await fetch('main.wasm')
  let bytes = await response.arrayBuffer()
  let wasmObj = await WebAssembly.instantiate(bytes, info)
  wasmExpports = wasmObj.instance.exports
}
(async () => {
  await loadWasm()
  const we = wasmExpports
  if (we) {
    //@ts-ignore
    console.log(we.add(1, 2))
  }
})()

const m: string = '0'
log(m + JSON.stringify(json))

ReactDOM.render(<App />, document.getElementById('root'))
