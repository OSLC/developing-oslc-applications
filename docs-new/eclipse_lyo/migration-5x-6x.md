---
search:
  boost: 3 
---
# Migrating from Lyo 5.x to 6.x

!!! note "Content generated with LLM assistance"
    This guide was produced based on the private migration notes, CHANGELOGs, git diffs of previous commits, among others. LLM was used to collate the information below. All output was reviewed by a human. However, proceed carefully. If in doubt, see _Additional resources_ links at the bottom of the page or propose changes to this page by hitting the _Edit this page_ button above on the right.

!!! warning "Jakarta EE Migration"
    This is a major migration involving the transition from Java EE (`javax.*`) to Jakarta EE (`jakarta.*`). Plan adequate time for testing and validation.

## Overview

Migration from Lyo 5.x to 6.x involves:

- **Jakarta EE Migration**: `javax.*` → `jakarta.*` namespace change
- **JDK Baseline**: JDK 17+ is now the minimum (JDK 17, 21, 23, 24-ea tested)
- **Jersey Upgrade**: 2.35 → 3.1.5 (Jakarta EE compatible)
- **Servlet API**: `javax.servlet` → `jakarta.servlet`
- **JAX-RS**: `javax.ws.rs` → `jakarta.ws.rs`
- **Kotlin**: Updated to 1.9.0 with `kotlin-stdlib` instead of `kotlin-stdlib-jdk8`

## Prerequisites

### Version Dependencies

| Component | Lyo 5.x | Lyo 6.x |
|-----------|---------|---------|
| **JDK** | 11+ | 17+ (17, 21, 23+ tested) |
| **Jakarta EE** | Java EE (javax) | Jakarta EE (jakarta) |
| **Jersey** | 2.35 | 3.1.5 |
| **Servlet API** | javax.servlet 3.1+ | jakarta.servlet 6.1+ |

### Breaking Changes Summary

- 🔄 **All `javax.*` → `jakarta.*` package changes**
- ❌ **JDK 11-16 support removed** (JDK 17+ required)
- ❌ **Java EE and Jakarta EE 8 support removed**
- 🔄 **Jersey 3.x requires significant configuration changes**
- 🔄 **Servlet containers need Jakarta EE 9+ support**

## Step-by-Step Migration

### Phase 1: Environment Preparation

#### 1.1 Update JDK
```bash
# JDK 17+ required
java -version  # Should show 17+
```

Update Maven compiler properties:
```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <maven.compiler.release>17</maven.compiler.release>
</properties>
```

#### 1.2 Check Application Server Compatibility
Ensure your application server supports Jakarta EE 9+:

| Server | Jakarta EE 9+ Version |
|--------|----------------------|
| **Apache Tomcat** | 10.0+ |
| **Eclipse Jetty** | 11.0+ |
| **WildFly** | 21+ |
| **Liberty** | 21.0.0.3+ |
| **GlassFish** | 6.0+ |

### Phase 2: Dependency Updates

#### 2.1 Update Lyo Version
```xml
<properties>
    <lyo.version>6.0.0</lyo.version>
    <jersey.version>3.1.5</jersey.version>
</properties>
```

#### 2.2 Update Jakarta EE Dependencies
Replace all Java EE dependencies with Jakarta EE equivalents:

```xml
<!-- OLD: Java EE dependencies -->
<!--
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <scope>provided</scope>
</dependency>

<dependency>
    <groupId>javax.ws.rs</groupId>
    <artifactId>javax.ws.rs-api</artifactId>
    <version>2.1.1</version>
</dependency>
-->

<!-- NEW: Jakarta EE dependencies -->
<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>6.1.0</version>
    <scope>provided</scope>
</dependency>

<dependency>
    <groupId>jakarta.ws.rs</groupId>
    <artifactId>jakarta.ws.rs-api</artifactId>
    <version>3.1.0</version>
</dependency>
```

#### 2.3 Update Jersey Dependencies
```xml
<!-- Jersey 3.x for Jakarta EE -->
<dependency>
    <groupId>org.glassfish.jersey.core</groupId>
    <artifactId>jersey-server</artifactId>
    <version>${jersey.version}</version>
</dependency>

<dependency>
    <groupId>org.glassfish.jersey.containers</groupId>
    <artifactId>jersey-container-servlet</artifactId>
    <version>${jersey.version}</version>
</dependency>

<dependency>
    <groupId>org.glassfish.jersey.inject</groupId>
    <artifactId>jersey-hk2</artifactId>
    <version>${jersey.version}</version>
</dependency>

<!-- Media type support -->
<dependency>
    <groupId>org.glassfish.jersey.media</groupId>
    <artifactId>jersey-media-json-jackson</artifactId>
    <version>${jersey.version}</version>
</dependency>
```

#### 2.4 JSTL Dependencies (if using JSP)
```xml
<!-- OLD: JSTL 1.2 -->
<!--
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
-->

<!-- NEW: Jakarta JSTL -->
<dependency>
    <groupId>jakarta.servlet.jsp.jstl</groupId>
    <artifactId>jakarta.servlet.jsp.jstl-api</artifactId>
    <version>3.0.0</version>
</dependency>

<dependency>
    <groupId>org.glassfish.web</groupId>
    <artifactId>jakarta.servlet.jsp.jstl</artifactId>
    <version>3.0.1</version>
</dependency>
```

#### 2.5 Swagger Dependencies (if using Swagger)

If the project integrates Swagger for OpenAPI documentation, the Swagger JAX-RS integration dependencies shall be updated to their Jakarta EE compatible counterparts (using the `-jakarta` artifact ID suffix):

```xml
<!-- OLD: Swagger dependencies (javax namespace) -->
<!--
<dependency>
    <groupId>io.swagger.core.v3</groupId>
    <artifactId>swagger-jaxrs2</artifactId>
    <version>${swagger.version}</version>
</dependency>
<dependency>
    <groupId>io.swagger.core.v3</groupId>
    <artifactId>swagger-jaxrs2-servlet-initializer-v2</artifactId>
    <version>${swagger.version}</version>
</dependency>
-->

<!-- NEW: Swagger dependencies (jakarta namespace) -->
<dependency>
    <groupId>io.swagger.core.v3</groupId>
    <artifactId>swagger-jaxrs2-jakarta</artifactId>
    <version>${swagger.version}</version>
</dependency>
<dependency>
    <groupId>io.swagger.core.v3</groupId>
    <artifactId>swagger-jaxrs2-servlet-initializer-v2-jakarta</artifactId>
    <version>${swagger.version}</version>
</dependency>
```

### Phase 3: Code Migration

#### 3.1 Package Name Changes
Update all `javax.*` imports to `jakarta.*`:

```java
// OLD: javax packages
// import javax.servlet.*;
// import javax.servlet.http.*;
// import javax.ws.rs.*;
// import javax.ws.rs.core.*;
// import javax.inject.*;

// NEW: jakarta packages
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import jakarta.inject.*;
```

**Complete Package Mapping:**
```
javax.servlet              → jakarta.servlet
javax.ws.rs                → jakarta.ws.rs
javax.inject               → jakarta.inject
javax.annotation           → jakarta.annotation
javax.validation           → jakarta.validation
javax.persistence          → jakarta.persistence
javax.transaction          → jakarta.transaction
```

#### 3.2 JAX-RS Application Class
```java
// Update imports
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/services")
public class MyOslcApplication extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        classes.add(MyOslcService.class);
        return classes;
    }
}
```

#### 3.3 Servlet Classes
```java
// Update servlet imports
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class MyServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, 
                        HttpServletResponse response) 
                        throws ServletException, IOException {
        // Implementation
    }
}
```

#### 3.4 JAX-RS Resource Classes
```java
// Update JAX-RS imports
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

@Path("/resources")
public class MyOslcService {
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getResources() {
        // Implementation
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createResource(String resourceData) {
        // Implementation
    }
}
```

### Phase 4: Configuration Updates

#### 4.1 Web.xml Updates
Update servlet API version and namespace:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- OLD: Java EE web.xml -->
<!--
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
         http://java.sun.com/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
-->

<!-- NEW: Jakarta EE web.xml -->
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">

    <display-name>My OSLC Application</display-name>
    
    <!-- Jersey servlet configuration -->
    <servlet>
        <servlet-name>Jersey</servlet-name>
        <servlet-class>org.glassfish.jersey.servlet.ServletContainer</servlet-class>
        <init-param>
            <param-name>jakarta.ws.rs.Application</param-name>
            <param-value>com.example.MyOslcApplication</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>Jersey</servlet-name>
        <url-pattern>/services/*</url-pattern>
    </servlet-mapping>
    
</web-app>
```

#### 4.2 JSP Page Updates (if using JSP)
Update JSP page directives:

```jsp
<!-- OLD: JSTL 1.2 -->
<%-- <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> --%>

<!-- NEW: Jakarta JSTL -->
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
```

### Phase 5: Testing and Validation

#### 5.1 Build and Test
```bash
# Build with Jakarta EE
mvn clean compile

# Run tests
mvn test

# Package application
mvn package
```

#### 5.2 Common Migration Issues

**Issue: NoClassDefFoundError for javax classes**

> java.lang.NoClassDefFoundError: javax/servlet/http/HttpServlet

**Solution:** Ensure all `javax.*` imports are changed to `jakarta.*` and dependencies are updated.

**Issue: NoClassDefFoundError for JAX-RS / javax classes during server startup (e.g. HttpHeaders)**

> java.lang.NoClassDefFoundError: javax/ws/rs/core/HttpHeaders
> at org.glassfish.jersey.server.model.IntrospectionModeller...

**Solution:** Ensure that the Swagger/OpenAPI dependencies are migrated to their Jakarta EE equivalents with the `-jakarta` suffix (e.g., `swagger-jaxrs2-jakarta` and `swagger-jaxrs2-servlet-initializer-v2-jakarta` instead of `swagger-jaxrs2` and `swagger-jaxrs2-servlet-initializer-v2`).

**Issue: Jersey injection problems**

> java.lang.IllegalStateException: ServiceLocator has been shut down

**Solution:** Update Jersey configuration and ensure HK2 dependency is included.

**Issue: JSTL tags not found**

> org.apache.jasper.JasperException: The absolute uri: http://java.sun.com/jsp/jstl/core cannot be resolved

**Solution:** Update JSTL taglib URI to `jakarta.tags.core`.

**Issue: Servlet container compatibility**

> java.lang.UnsupportedClassVersionError: jakarta/servlet/ServletException

**Solution:** Ensure application server supports Jakarta EE 9+ (check the versions on your server, in your Dockerfile, and the Jetty Maven plugin version in POM.xml).

**Problem:** Domain classes fail with URISyntaxException after Jakarta migration

> java.net.URISyntaxException: Illegal character in path at index X
> at java.net.URI$Parser.fail(URI.java:2848)
> at java.net.URI$Parser.checkChars(URI.java:3021)

**Solution Steps:**

Double-check the `@OslcService` annotations.

**Package Import Conflicts:**

> error: package javax.servlet does not exist
> import javax.servlet.http.HttpServletRequest;

**Solution:** Use IDE refactoring tools or Eclipse Transformer to update all imports systematically.

**Mixed Namespace ClassCastException:**

> java.lang.ClassCastException: jakarta.servlet.ServletContext cannot be cast to javax.servlet.ServletContext

**Solution:** Ensure all servlet-related code uses Jakarta packages consistently. Check for transitive dependencies still using javax.* packages.

**Jersey 3.x Provider Registration:**

> java.lang.IllegalStateException: Provider class X not recognized in Jakarta context

**Solution:** Update provider registration for Jakarta EE:
```java
@ApplicationPath("/services")
public class JakartaOslcApplication extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        // Use Jakarta-compatible providers
        classes.add(org.eclipse.lyo.oslc4j.provider.jena.JenaProvidersRegistry.class);
        return classes;
    }
}
```

**JSP/JSTL Migration Issues:**

> org.apache.jasper.JasperException: Unable to compile class for JSP

**Solution:** Update JSP page directives and JSTL imports:
```jsp
<%-- OLD: Java EE ---%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%-- NEW: Jakarta EE ---%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
```

**Authentication/Authorization Migration:**

> java.security.NoSuchProviderException: Jakarta security provider not found

**Solution:** Update security configuration to use Jakarta EE security APIs:
```java
// OLD: javax.servlet.http.HttpServletRequest
// NEW: jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletRequest;

@Context
private HttpServletRequest httpServletRequest;
```

Make sure to check transitive dependencies.

#### 5.3 Testing Checklist

- [ ] Application builds with JDK 17+
- [ ] All `javax.*` references updated to `jakarta.*`
- [ ] Jersey 3.x configuration works
- [ ] OSLC operations function correctly
- [ ] JSP pages render (if applicable)
- [ ] Authentication/authorization works
- [ ] Performance is acceptable

## RefImpl Migration Example

Based on the refimpl migration (commit 3ca27c7), key changes include:

### Maven Configuration
```xml
<!-- Update Java version -->
<maven.compiler.source>17</maven.compiler.source>
<maven.compiler.target>17</maven.compiler.target>

<!-- Update dependencies -->
<version.lyo>6.0.0.Final</version.lyo>
<jersey.version>3.1.5</jersey.version>
```

### Tomcat Profile for JSTL
```xml
<profile>
    <id>with-jstl-impl</id>
    <dependencies>
        <dependency>
            <groupId>jakarta.servlet.jsp.jstl</groupId>
            <artifactId>jakarta.servlet.jsp.jstl-api</artifactId>
            <version>3.0.0</version>
        </dependency>
        <dependency>
            <groupId>org.glassfish.web</groupId>
            <artifactId>jakarta.servlet.jsp.jstl</artifactId>
            <version>3.0.1</version>
        </dependency>
    </dependencies>
</profile>
```

## Docker and Container Considerations

If using Docker, update base images to support Jakarta EE:

```dockerfile
# Use Jakarta EE compatible base images
FROM tomcat:10.1-jdk17

# or for Jetty
FROM jetty:11-jdk17
```

## Next Steps

After successful migration to Lyo 6.x:

1. **Validate All Features**: Comprehensive testing of OSLC functionality
2. **Performance Testing**: Verify performance with Jakarta EE stack
3. **Security Review**: Validate authentication and authorization
4. **Plan for 7.x**: Monitor [Lyo 7.x development](migration-6x-7x.md) for future updates

## Additional Resources

- **[Lyo 6.0 Release Notes](https://github.com/eclipse/lyo/releases/tag/v6.0.0)**
- **[Jakarta EE Migration Guide](https://jakarta.ee/resources/)**
- **[Jakarta EE / JakartaEE support table for Eclipse Jetty](https://jetty.org/download.html#version-history)**
- **[Tomcat Version Support Matrix](https://tomcat.apache.org/whichversion.html)**
- **[Jersey 3.x Migration Guide](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest/migration.html)**
- **[RefImpl Jakarta Migration PR](https://github.com/oslc-op/refimpl/pull/198)**
- **[OSLC Community Forum](https://forum.open-services.net/c/sdks/lyo/9)**

---

!!! tip "Migration Tools"
    Consider using automated migration tools like the [Eclipse Transformer](https://projects.eclipse.org/projects/technology.transformer) to help with the `javax.*` to `jakarta.*` package renaming.
