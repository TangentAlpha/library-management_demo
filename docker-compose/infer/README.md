# Infer with Docker Compose

This directory contains the Docker Compose configuration for starting the Infer analysis container.
Run the commands below from this folder.

## Start the container

Create and start the container:
```sh
docker compose up -d --build
```

This process may take a while to build the image and start the analysis environment.

## Verify that the container is running

Check that the container is active:
```sh
docker ps
```

You should see a container named `infer` in the output.

## Enter the container shell

To attach to the running container:
```sh
docker attach infer
```

When you attach to the container, files from the current project root are copied into the container.
This avoids Gradle in the container creating files as the `root` user in the host's project directory, which can lead to `Permission denied` errors when running Gradle as a normal user outside the container.

### Important paths inside the container

- `/mnt/`: read-only view of the project files in the host filesystem
- `/root/project/`: working directory for running Infer on the project

## Stop the container

```sh
docker compose stop
```

## Remove the container

```sh
docker compose down
```

## Customize the project root

By default, the root of the current project (`../../`) is used as the project root.
To use a different directory instead, edit the relevant line in `docker-compose.yml`:

```diff
     volumes:
       - type: bind
-        source: ../..
+        source: /path/to/dir
         target: /mnt
         read_only: true
```

This changes the directory that Infer sees inside the container at `/mnt/`.
