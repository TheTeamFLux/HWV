FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x gradlew
RUN ./gradlew build -x test

EXPOSE 8080

CMD ["java", "-Xms64m", "-Xmx192m", "-XX:MaxMetaspaceSize=96m", "-XX:+UseSerialGC", "-XX:+ExitOnOutOfMemoryError", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
