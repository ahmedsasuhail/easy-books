# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.205.2/containers/debian/.devcontainer/base.Dockerfile

# [Choice] Debian version (use bullseye or stretch on local arm64/Apple Silicon): bullseye, buster, stretch
ARG VARIANT="buster"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# Add Meilisearch repository to sources.
RUN echo "deb [trusted=yes] https://apt.fury.io/meilisearch/ /" > /etc/apt/sources.list.d/fury.list

# ** [Optional] Uncomment this section to install additional packages. **
RUN apt update && export DEBIAN_FRONTEND=noninteractive \
	&& apt -y install --no-install-recommends vim meilisearch-http neofetch

