<template>
  <div class="ceremony">
    <h1 class="title is-size-1 is-size-2-mobile is-spaced">
      {{ $t('pages.instructions.instructions') }}
    </h1>
    <h2 class="subtitle">
      {{ $t('pages.instructions.pureRust') }}
    </h2>
    <figure class="highlight">
      <pre v-highlightjs><code class="bash">{{ $t('pages.instructions.installRust') }}
curl -sSf https://sh.rustup.rs | sh

{{ $t('pages.instructions.cloneRepo') }}
git clone https://github.com/tornadocash/phase2-bn254
cd phase2-bn254/phase2

{{ $t('pages.instructions.runCeremony') }}
cargo run --release --bin tornado
</code></pre>
    </figure>
    <div class="content afterwords p">
      <p>
        {{ $t('pages.instructions.afterContribution') }}
      </p>
    </div>

    <h2 class="subtitle">
      {{ $t('pages.instructions.usingDocker') }}
    </h2>

    <div class="content p">
      <p>
        {{ $t('pages.instructions.downloadRustContainer') }}
      </p>
      <p>
        {{ $t('pages.instructions.installDocker') }}
        <a
          href="https://download.docker.com/win/stable/Docker%20Desktop%20Installer.exe"
          target="_blank"
          >{{ $t('pages.instructions.windows') }}</a
        >
        <a href="https://download.docker.com/mac/stable/Docker.dmg" target="_blank">{{
          $t('pages.instructions.mac')
        }}</a>
        <a href="https://docs.docker.com/install/#supported-platforms" target="_blank">{{
          $t('pages.instructions.linux')
        }}</a>
      </p>
    </div>

    <figure class="highlight">
      <pre v-highlightjs><code class="bash">{{ $t('pages.instructions.downloadDockerfile') }}
wget https://raw.githubusercontent.com/tornadocash/phase2-bn254/master/Dockerfile

{{ $t('pages.instructions.buildDockerImage') }}
docker build . -t ceremony

{{ $t('pages.instructions.runCeremony') }}
docker run -ti ceremony</code></pre>
    </figure>
    <div class="content afterwords p">
      <p>
        {{ $t('pages.instructions.afterContribution') }}
      </p>
    </div>
  </div>
</template>
