# Use official OpenJDK image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY keep-notes/gradlew gradlew
COPY keep-notes/gradle gradle
COPY keep-notes/build.gradle settings.gradle ./

# Copy source code
COPY keep-notes/src src

# Make gradlew executable
RUN chmod +x gradlew

# Build jar
RUN ./gradlew bootJar -x test

# Expose port
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "build/libs/keepnotes.jar"]
