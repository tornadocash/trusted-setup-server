<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      Instructions
    </h1>
    <h2 class="subtitle">
      Using pure Rust implementation:
    </h2>
    <figure class="highlight">
      <pre v-highlightjs><code class="bash"># Install Rust
curl -sSf https://sh.rustup.rs | sh

# Clone the repository with the ceremony code
git clone https://github.com/tornadocash/phase2-bn254
cd phase2-bn254/phase2

# Run the ceremony
cargo run --release --bin tornado
</code></pre>
    </figure>
    <div class="content afterwords p">
      <p>
        After the contribution, we recommend you to reboot your machine to clear your RAM.
      </p>
    </div>

    <h2 class="subtitle">
      Using Docker container:
    </h2>

    <div class="content p">
      <p>
        Using this method, you will download and compile the ceremony source code from our git repo
        in a stock Rust container. This is not a prebuilt container distribution.
      </p>
      <p>
        Start by installing Docker on your system:
        <a
          href="https://download.docker.com/win/stable/Docker%20Desktop%20Installer.exe"
          target="_blank"
          >Windows</a
        >
        <a href="https://download.docker.com/mac/stable/Docker.dmg" target="_blank">Mac</a>
        <a href="https://docs.docker.com/install/#supported-platforms" target="_blank">Linux</a>
      </p>
    </div>

    <figure class="highlight">
      <pre v-highlightjs><code class="bash"># Download Dockerfile
wget https://raw.githubusercontent.com/tornadocash/phase2-bn254/master/Dockerfile

# Build docker image
docker build . -t ceremony

# Run the ceremony
docker run -ti ceremony</code></pre>
    </figure>
    <div class="content afterwords p">
      <p>
        After the contribution, we recommend you to reboot your machine to clear your RAM.
      </p>
    </div>
  </div>
</template>
