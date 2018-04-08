# JSON Resolver

## Development Setup Docker
```
docker-compose build
docker-compose run --rm app npm install
```

## Release Steps
1. git checkout master
2. npm version <update>
3. npm publish
4. git push --tags

## Roadmap
- Handle circular references
- Bundle into a single file with only internal references
- Resolve external URL references
- Resolve allOf, anyOf, oneOf
- Accept a JSON schema for validation
