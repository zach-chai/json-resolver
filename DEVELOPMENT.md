# JSON Resolver

## Development Setup Docker
```
docker-compose build
docker-compose run --rm app npm install
```

## Debugging
```
docker-compose run --rm app node inspect ./index.js
```

## Release Steps
1. git checkout master
2. npm version <update>
3. npm publish
4. git push --tags
