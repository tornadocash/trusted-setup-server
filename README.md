
# Initialize ceremony:
1. `git clone https://github.com/tornadocash/phase2-bn254 && cd phase2-bn254`
1. `git checkout wasm`
1. go to `./powersoftau/src/bn256/mod.rs` and change `REQUIRED_POWER` to 15 (it going to fit 36k constaints snark)
1. `cd powersoftau`
1. run `./test.sh`. After this step you will get many `phase1radix*` files.
1. Download [withdraw.json](https://github.com/tornadocash/tornado-core/releases/download/v2.0/withdraw.json) for required circuit to `./phase2` folder
1. `cd ../phase2`
1. `cp ../powersoftau/phase1radix* .`
1. `cargo run --release --bin new withdraw.json current.params`
1. The `current.params` file is your initial challenge file.
1. copy `current.params` and `withdraw.json` to trusted-setup-server project.
1. `mv withdraw.json circuit.json`
 
# Run the server

```shell script
npm run start
```

After this open http://localhost:8000 in Chrome and look in console. 
It should automatically do a contribution on page open 

# Wasm module

If you want to recompile the wasm file run `npm run pkg` (check paths in package.json)