# JSON Resolver

Parse and resolve complex JSON schemas

## Features
- Resolves external references to files and their sub-schemas
- Supports nested references and bidirectional references between files
- Detects circular references
- Reads both JSON and YAML files

## Getting Started

### Installation
1. Install with npm or yarn:

  ```shell
  # via npm
  npm install json-resolver
  # via yarn
  yarn add json-resolver
  ```
2. Then import in your code

  ```javascript
  // via ECMAScript
  import JsonResolver from 'json-resolver'
  // via commonJS
  var JsonResolver = require('swagger-parser');
  ```

### Usage
```javascript
JsonResolver.resolveRef(filePath, function(err, result) {
  if (err) {
    console.error(err.message)
  } else {
    console.log(JSON.stringify(result))
  }
})
```

## Unsupported Features
- References with scheme, authority, or query components according to https://tools.ietf.org/html/rfc3986#section-3
