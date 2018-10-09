# JSON Resolver

Parse and resolve complex JSON Documents. Designed for Open API Specification.

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

### Example
```yaml
# Original
components:
  schemas:
    Pet:
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
    Pets:
      type: array
      items:
        $ref: "#/components/schemas/Pet"

# Dereferenced
components:
  schemas:
    Pet:
      required:
      - id
      - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
    Pets:
      type: array
      items:
        required:
        - id
        - name
        properties:
          id:
            type: integer
            format: int64
          name:
            type: string
          tag:
            type: string
```



## Unsupported Features
- References with scheme, authority, or query components according to https://tools.ietf.org/html/rfc3986#section-3
