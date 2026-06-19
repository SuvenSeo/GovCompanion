#!/usr/bin/env node
/** One-off probe — reads NVIDIA_NIM_API_KEY from env. Do not commit keys. */
const key = process.env.NVIDIA_NIM_API_KEY ?? process.env.NVIDIA_API_KEY
if (!key) {
  console.error('Set NVIDIA_NIM_API_KEY')
  process.exit(1)
}

const models = [
  'meta/llama-3.3-70b-instruct',
  'nvidia/llama-3.3-nemotron-super-49b-v1.5',
  'nvidia/nemotron-3-nano-30b-a3b',
  'mistralai/mistral-7b-instruct-v0.3',
  'google/gemma-2-9b-it',
]

for (const model of models) {
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Say OK' }],
        max_tokens: 5,
        temperature: 0.2,
      }),
    })
    const text = await res.text()
    const ok = res.ok ? 'OK' : `FAIL ${res.status}`
    console.log(`${ok}\t${model}\t${text.slice(0, 80)}`)
  } catch (e) {
    console.log(`ERR\t${model}\t${e.message}`)
  }
}
