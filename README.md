# express-retr

## Description

Naive approach to a API that actually handles requests over supper-spotty connections

General idea is based on converting every response to UINT8Array, and allowing clients to retry requests if they fail, from the point they failed.

## Installation
To install dependencies:

```bash
bun install
```

