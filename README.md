
# Initialize ceremony:

```shell script
cicrom # circuit.circom -> circuit.json
./new circuit.json old.params
```

# Run the server

```shell script
npm run start
```

After this open http://localhost:8000 in Chrome and look in console. 
It should automatically do a contribution on page open 

# Wasm module

If you want to recompile the wasm file run `npm run pkg` (check paths in package.json)