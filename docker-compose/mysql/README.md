# MySQL with Docker Compose

This directory contains the Docker Compose configuration for the MySQL 5.7 instance used by this project.
Run the commands below from this folder.

## Start the container

Create and start the container:
```sh
docker compose up -d
```

This starts a MySQL container named `comp4111-mysql` and exposes the database on port `3306`.

## Verify that MySQL is running

Check that the container is active:
```sh
docker ps
```

You should see a container named `comp4111-mysql` in the output.

## Default database credentials

The application expects the following default values in `src/main/resources/mysql.properties`:

```properties
mysql.url=jdbc:mysql://localhost:3306
mysql.username=root
mysql.password=comp4111
mysql.database=comp4111
```

The default root password is therefore `comp4111`.

## Enter the container shell

To open a shell inside the running container:
```sh
docker exec -it comp4111-mysql bash
```

## Stop the container

```sh
docker compose stop
```

## Remove the container

```sh
docker compose down
```

## Customize the password

By default, the MySQL `root` password is set to `comp4111`.
To change it, edit the following line in `docker-compose.yml`:
```diff
     environment:
-      - MYSQL_ROOT_PASSWORD=comp4111
+      - MYSQL_ROOT_PASSWORD=mynewpassword
```

If you change the root password, update the matching values in `src/main/resources/mysql.properties` as well.
