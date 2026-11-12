# Library management application

This project is extended from an existing Software Engineering Practices course project ([link to the original repo](https://github.com/Derppening/comp4111-project)) for demo.
See the Java REST API requirements [here](./api-requirements.pdf).

## Prerequisites

- JDK 11
    - [Oracle JDK](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
    - [Oracle OpenJDK](https://jdk.java.net/java-se-ri/11)
    - [Microsoft OpenJDK](https://learn.microsoft.com/vi-vn/java/openjdk/download#openjdk-11)
- MySQL Server 5.7
    - A Docker container is available [here](./docker-compose/mysql/).

## Running the project

This project contains several applications which may be run for various purposes.

Before executing any of the following examples, ensure that the default Java installation is set to JDK 11.
See [FAQs](#faqs) for more information.

### Backend

Before starting the Java application, ensure that the MySQL server is running.
See the MySQL setup guide in [`./docker-compose/mysql/`](./docker-compose/mysql/) for the required Docker commands and default credentials.

For a first-time setup, initialize the database before running the app.
At the root of the project, run the following command:
```sh
./gradlew runFreshDb
```

Otherwise, compile and run the project with:
```sh
./gradlew run
```

The application is running when an output similar to the following is displayed on the console:
```txt
<=========----> 75% EXECUTING [5s]
> :run
```

You should wait for the message `Listening on ...:8082` before starting your testing.

#### Custom Gradle tasks

This project contains several additional Gradle tasks that may be useful.
You can run one with `./gradlew <task-name>`, for example `./gradlew runFreshDb`.

- `runFreshDb`: Drops the existing database, recreates it, and rebuilds the tables.
- `runFreshTables`: Drops and recreates all application tables in the existing database.
- `runDbDrop`: Drops the database without recreating it.
- `runDbInit`: Recreates the database only.
- `runTablesInit`: Recreates the tables only.

It is recommended to run `runFreshDb` or `runFreshTables` before testing, so the database is rebuilt from a clean state and no leftover data can interfere with the test cases.

#### Unit tests

Unit tests can be run using the following command:
```sh
./gradlew test
```

Note that unit tests **will recreate the database on every invocation**.
There is currently no way to change this.

#### Infer

Check [`./docker-compose/infer/`](./docker-compose/infer/) for instructions on running Infer to perform static analysis.

#### Clean build artifacts

To remove all generated build artifacts so that the project can be rebuilt from scratch, run the following command:
```sh
./gradlew clean
```

### Frontend

With the MySQL database and the backend Java application running, start the frontend with:
```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally <http://localhost:3000/>).

Run frontend lint checks with `npm run lint` from `frontend/`.

## Project structure

This project follows Gradle's directory layout convention.

- `./build/`: build files and generated output
- `./docker-compose/`: Docker Compose files for encapsulating required services
- `./src/main/java/`: the main Java application
- `./src/test/java/`: the testing source files

## External libraries

The following external libraries are used.

- [Apache HTTP Components 5.0](http://hc.apache.org/httpcomponents-core-ga/)
- [Apache Log4j 2.13](https://logging.apache.org/log4j/)
- [Jackson JSON](https://github.com/FasterXML/jackson)
- [JetBrains Annotations](https://github.com/JetBrains/java-annotations)
- [JUnit Jupiter](https://junit.org/junit5/)
- [SLF4J 1.7](http://www.slf4j.org/)

## FAQs

### Gradle Java version

If the following output appears when trying to build the application:
```txt
> Task :compileJava FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':compileJava'.
> Could not target platform: 'Java SE 11' using tool chain: 'JDK 8 (1.8)'.
```

That means your default Java version is older than JDK 11 as required by this project.
Ensure that JDK 11 is installed on your system, and do one of the following:
- Add `-Dorg.gradle.java.home=/path/to/jdk11` to the `gradlew` invocation command.
- Set the `JAVA_HOME` environment variable to the path of your JDK 11 installation.
  Search online for instructions specific to your operating system.

### Custom database info

You may change the database information in `./src/main/resources/mysql.properties`.

- `mysql.url`: URL to the MySQL server
- `mysql.username`: username to log in to the server
- `mysql.password`: password of the user
- `mysql.database`: database name to use/create
