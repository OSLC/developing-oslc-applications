# Migrating Eclipse Lyo OSLC server adaptors from Jersey to Quarkus

This guide provides step-by-step instructions for migrating Eclipse Lyo-based OSLC server adaptors from Jersey/Jetty to Quarkus. The migration delivers significant performance improvements (startup time reduced from 5-10 seconds to under 1 second) and enables deployment to modern cloud platforms that require fast cold starts.

## Prerequisites

Before starting the migration, ensure you have:

- Java 21 or later
- Maven 3.6 or later
- Existing Eclipse Lyo OSLC server adaptor built with Lyo SDK 7.x
- Basic understanding of JAX-RS, CDI, and servlet concepts

## Overview of changes

The migration involves:

1. Replacing Jersey dependencies with Quarkus extensions
2. Removing HK2 dependency injection in favour of CDI
3. Migrating JSP pages to Qute templates
4. Updating servlet filter configuration
5. Replacing Jetty with Quarkus's embedded server (Undertow)
6. Modifying Docker configuration for Quarkus

## Step 1: Update Maven dependencies

### Remove legacy dependencies

In your `pom.xml`, remove these dependencies:

```xml
<!-- Remove Jersey dependencies -->
<dependency>
    <groupId>org.glassfish.jersey.core</groupId>
    <artifactId>jersey-server</artifactId>
</dependency>
<dependency>
    <groupId>org.glassfish.jersey.containers</groupId>
    <artifactId>jersey-container-servlet</artifactId>
</dependency>
<dependency>
    <groupId>org.glassfish.jersey.media</groupId>
    <artifactId>jersey-media-multipart</artifactId>
</dependency>
<dependency>
    <groupId>org.glassfish.jersey.inject</groupId>
    <artifactId>jersey-hk2</artifactId>
</dependency>

<!-- Remove Jetty/Servlet container dependencies -->
<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <scope>provided</scope>
</dependency>

<!-- Remove old logging implementations -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
</dependency>
```

### Add Quarkus dependencies

Add Quarkus BOM and required extensions:

```xml
<properties>
    <quarkus.platform.artifact-id>quarkus-bom</quarkus.platform.artifact-id>
    <quarkus.platform.group-id>io.quarkus.platform</quarkus.platform.group-id>
    <quarkus.platform.version>3.17.4</quarkus.platform.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>${quarkus.platform.group-id}</groupId>
            <artifactId>${quarkus.platform.artifact-id}</artifactId>
            <version>${quarkus.platform.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <!-- Core Quarkus extensions -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-resteasy</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-resteasy-jackson</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-undertow</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-arc</artifactId>
    </dependency>
    
    <!-- For HTML pages (replaces JSP) -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-resteasy-qute</artifactId>
    </dependency>
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-qute</artifactId>
    </dependency>
    
    <!-- For OpenAPI/Swagger UI -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-smallrye-openapi</artifactId>
    </dependency>
</dependencies>
```

### Exclude Jersey from Lyo dependencies

Update Eclipse Lyo dependencies to exclude Jersey:

```xml
<dependency>
    <groupId>org.eclipse.lyo.oslc4j.core</groupId>
    <artifactId>oslc4j-core</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.glassfish.jersey.core</groupId>
            <artifactId>jersey-server</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.glassfish.jersey.containers</groupId>
            <artifactId>jersey-container-servlet</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.glassfish.jersey.media</groupId>
            <artifactId>jersey-media-multipart</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.glassfish.jersey.inject</groupId>
            <artifactId>jersey-hk2</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### Update Maven plugins

Replace WAR packaging with Quarkus uber-jar:

```xml
<build>
    <finalName>${application.filename}</finalName>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <filtering>true</filtering>
        </resource>
    </resources>
    <plugins>
        <plugin>
            <groupId>${quarkus.platform.group-id}</groupId>
            <artifactId>quarkus-maven-plugin</artifactId>
            <version>${quarkus.platform.version}</version>
            <extensions>true</extensions>
            <executions>
                <execution>
                    <goals>
                        <goal>build</goal>
                        <goal>generate-code</goal>
                        <goal>generate-code-tests</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
        
        <plugin>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.13.0</version>
            <configuration>
                <compilerArgs>
                    <arg>-parameters</arg>
                </compilerArgs>
            </configuration>
        </plugin>
        
        <plugin>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.5.2</version>
            <configuration>
                <systemPropertyVariables>
                    <java.util.logging.manager>org.jboss.logmanager.LogManager</java.util.logging.manager>
                    <maven.home>${maven.home}</maven.home>
                </systemPropertyVariables>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## Step 2: Replace HK2 with CDI

### Remove HK2 binder class

Delete `ApplicationBinder.java` and its HK2-specific bindings.

### Create CDI producers

Create a new class for CDI producers (replace `ApplicationBinder`):

```java
package co.oslc.refimpl.rm.gen.servlet;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Singleton;
import org.eclipse.lyo.oslc4j.core.OSLC4JUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class RefImplProducers {

    @ConfigProperty(name = "co.oslc.refimpl.rm.gen.servlet.baseurl")
    String baseUrl;

    @ConfigProperty(name = "co.oslc.refimpl.rm.gen.servlet.cors.friends", defaultValue = "*")
    String corsFriends;

    @Produces
    @Singleton
    public LyoAppConfiguration produceConfiguration() {
        Set<String> friends;
        if (corsFriends == null || corsFriends.isEmpty()) {
            friends = Collections.emptySet();
        } else {
            friends = Arrays.stream(corsFriends.split(";"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());
        }
        return new LyoAppConfiguration(baseUrl, "", friends);
    }

    @Produces
    @Singleton
    public ResourcesFactory produceResourcesFactory() {
        return new ResourcesFactory(OSLC4JUtils.getServletURI());
    }
}
```

### Update Application class

Modify your JAX-RS `Application` class:

```java
@OpenAPIDefinition(info = @Info(title = "RM", version = "1.0.0"), servers = @Server(url = "/"))
public class Application extends jakarta.ws.rs.core.Application {

    private static final Set<Class<?>> RESOURCE_CLASSES = new HashSet<Class<?>>();

    @Override
    public Set<Object> getSingletons() {
        return Collections.emptySet();  // No HK2 binder
    }

    // Remove ServiceLocator injection from constructor
    public Application()
           throws OslcCoreApplicationException,
                  URISyntaxException
    {
        final String BASE_URI = "http://localhost/validatingResourceShapes";
        for (final Map.Entry<String, Class<?>> entry : RESOURCE_SHAPE_PATH_TO_RESOURCE_CLASS_MAP.entrySet()) {
            ResourceShapeFactory.createResourceShape(BASE_URI, OslcConstants.PATH_RESOURCE_SHAPES, entry.getKey(), entry.getValue());
        }
    }

    static {
        // Register resource classes
        RESOURCE_CLASSES.addAll(JenaProvidersRegistry.getProviders());
        RESOURCE_CLASSES.addAll(Json4JProvidersRegistry.getProviders());
        
        RESOURCE_CLASSES.add(RequirementsService.class);
        // ... other service classes
    }
}
```

### Add @ApplicationScoped to services

Add CDI scope annotation to delegate classes:

```java
@ApplicationScoped
public class RestDelegate {
    // Existing code
}
```

## Step 3: Replace ServletListener with Quarkus lifecycle

### Delete ServletListener

Remove `ServletListener.java` and `web.xml`.

### Create Quarkus lifecycle class

```java
package co.oslc.refimpl.rm.gen.servlet;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import org.eclipse.lyo.oslc4j.core.OSLC4JUtils;
import org.apache.jena.sys.JenaSystem;
import java.net.MalformedURLException;

@Singleton
public class QuarkusLifecycle {
    private static final Logger logger = LoggerFactory.getLogger(QuarkusLifecycle.class);

    @Inject
    LyoAppConfiguration config;

    void onStart(@Observes StartupEvent ev) {
        logger.info("Initializing QuarkusLifecycle...");

        JenaSystem.init();
        OSLC4JUtils.setLyoStorePagingPreciseLimit(false);

        String baseUrl = config.baseUrl();
        String servletUrlPattern = config.servletPath();

        try {
            logger.info("Setting public URI: " + baseUrl);
            OSLC4JUtils.setPublicURI(baseUrl);
            logger.info("Setting servlet path: " + servletUrlPattern);
            OSLC4JUtils.setServletPath(servletUrlPattern);
        } catch (MalformedURLException | IllegalArgumentException e) {
            logger.error("QuarkusLifecycle encountered exception.", e);
        }
    }
}
```

### Create application.properties

Create `src/main/resources/application.properties`:

```properties
# Server configuration
quarkus.http.port=8800
quarkus.http.root-path=/
quarkus.resteasy.path=/

# OSLC adaptor configuration
co.oslc.refimpl.rm.gen.servlet.baseurl=http://localhost:8800/
co.oslc.refimpl.rm.gen.servlet.cors.friends=*

# Swagger UI configuration
quarkus.swagger-ui.always-include=true
quarkus.swagger-ui.path=/swagger-ui

# Application version information (uses Maven resource filtering)
app.version=${project.version}
app.lyo.version=${version.lyo}
app.quarkus.version=${quarkus.platform.version}
```

## Step 4: Update servlet filter configuration

### Add WebFilter annotation

Update `CredentialsFilter.java`:

```java
@WebFilter(urlPatterns = "/*", filterName = "CredentialsFilter")
public class CredentialsFilter implements Filter {
    
    private boolean isProtectedResource(HttpServletRequest httpRequest) {
        if (ignoreResourceProtection) {
            return false;
        }

        String pathInfo = httpRequest.getPathInfo();
        String requestURI = httpRequest.getRequestURI();

        // Do not protect the home page or static resources
        if (pathInfo == null || "/".equals(requestURI) || requestURI.endsWith("/")) {
            return false;
        }
        
        boolean protectedResource = !pathInfo.startsWith("/rootservices") 
            && !pathInfo.startsWith("/oauth") 
            && !pathInfo.startsWith("/static");
        
        // Do not protect CORS preflight requests
        if (protectedResource && "OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            protectedResource = false;
        }

        return protectedResource;
    }
}
```

### Disable OAuth 1.0a (optional)

OAuth 1.0a support is incompatible with Undertow's request handling. If you need OAuth, consider implementing OAuth 2.0 instead. To disable OAuth 1.0a, comment out the OAuth validation logic in `CredentialsFilter.java` and focus on Basic Authentication:

```java
// OAuth 1.0a support is currently disabled in Quarkus migration
// This is not an OAuth request, so check for authentication in the session
String applicationConnector = authenticationApplication.getApplicationConnectorFromSession(request);
if (null != applicationConnector) {
    // Session authentication succeeded
} else {
    // Check for basic authentication
    Optional<SimpleEntry> basicAuthenticationFromRequest = 
        authenticationApplication.getBasicAuthenticationFromRequest(request);
    if (basicAuthenticationFromRequest.isEmpty()) {
        throw new AuthenticationException("No or invalid basic authentication header");
    }
}
```

### Add @Provider annotation to CORS filter

If you have a custom CORS filter:

```java
@Provider
public class CorsFilter implements ContainerResponseFilter {
    // Existing code
}
```

## Step 5: Migrate JSP pages to Qute templates

JSP is not supported in Quarkus. You must migrate to Qute, Quarkus's type-safe template engine.

### Understanding Qute vs JSP

Qute differs from JSP in several important ways:

| Aspect | JSP | Qute |
|--------|-----|------|
| **Execution** | Compiles to servlet, executes Java code | Type-safe expressions, no arbitrary code execution |
| **Security** | Can execute any Java code | Restricted to declared data model |
| **Location** | Typically in `src/main/webapp/` | In `src/main/resources/templates/` |
| **Forwarding** | Uses `RequestDispatcher.forward()` | Returns `TemplateInstance` from JAX-RS method |
| **Data binding** | Uses request attributes | Uses `.data()` method calls |
| **Expression syntax** | `<%= expression %>` and `${expression}` | `{expression}` |
| **Compilation** | Runtime (typically) | Build-time validation available |

**Key benefits of Qute:**
- Type-safe: compilation checks that data exists
- Secure: cannot execute arbitrary Java code
- Fast: no runtime compilation overhead
- Cloud-friendly: works in GraalVM native images

### Migration process overview

For each JSP file, you will:

1. Create a Qute template in `src/main/resources/templates/`
2. Convert JSP syntax to Qute syntax
3. Replace `RequestDispatcher.forward()` with template injection
4. Pass data using `.data()` instead of request attributes
5. Register the template-serving resource

### Pattern 1: Migrating simple pages (home page, about page)

**Before (JSP):**

File: `src/main/webapp/index.jsp`

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="org.eclipse.lyo.oslc4j.core.OSLC4JUtils" %>

<!DOCTYPE html>
<html>
<head>
    <title>OSLC Adaptor</title>
</head>
<body>
    <h1><%= application.getServletContextName() %></h1>
    <p>Base URI: <%= OSLC4JUtils.getServletURI() %></p>
    <a href="<c:url value='/catalog/singleton'/>">Service Provider Catalog</a>
</body>
</html>
```

Served via:

```java
// Old approach - forward to JSP
httpServletRequest.setAttribute("someData", value);
RequestDispatcher rd = httpServletRequest.getRequestDispatcher("/index.jsp");
rd.forward(httpServletRequest, httpServletResponse);
```

**After (Qute):**

File: `src/main/resources/templates/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>OSLC Adaptor</title>
</head>
<body>
    <h1>{contextName}</h1>
    <p>Base URI: {servletURI}</p>
    <a href="/catalog/singleton">Service Provider Catalog</a>
</body>
</html>
```

JAX-RS resource:

```java
@ApplicationScoped
@Path("/")
public class HomePageResource {

    @Inject
    Template index;  // Qute automatically finds templates/index.html

    @GET
    @Produces(MediaType.TEXT_HTML)
    public TemplateInstance get() {
        return index
            .data("contextName", "My OSLC Adaptor")
            .data("servletURI", OSLC4JUtils.getServletURI());
    }
}
```

**Key changes:**
- JSP expressions `<%= ... %>` become Qute expressions `{...}`
- JSTL tags like `<c:url>` become plain HTML (Qute does not execute Java code)
- Data passed via `.data(key, value)` instead of request attributes
- Method returns `TemplateInstance` instead of void
- Template automatically resolved by field name (`index` → `templates/index.html`)

### Pattern 2: Migrating OSLC selection dialogs

OSLC selection dialogs need to handle two scenarios:
1. Initial GET request: display the search UI (HTML)
2. Search request with `?terms=...`: return results (JSON)

**Before (JSP):**

```java
@GET
@Path("selector")
@Consumes({ MediaType.TEXT_HTML, MediaType.WILDCARD })
public Response RequirementSelector(
    @QueryParam("terms") final String terms
) throws ServletException, IOException {
    
    httpServletRequest.setAttribute("selectionUri", 
        uriInfo.getAbsolutePath().toString());
    
    if (terms != null) {
        // Handle search - return JSON
        httpServletRequest.setAttribute("terms", terms);
        List<Requirement> resources = delegate.search(terms);
        // ... build JSON response
    } else {
        // Show UI
        RequestDispatcher rd = httpServletRequest.getRequestDispatcher(
            "/co/oslc/refimpl/rm/gen/requirementselector.jsp");
        rd.forward(httpServletRequest, httpServletResponse);
        return null;
    }
}
```

JSP file: `src/main/webapp/co/oslc/refimpl/rm/gen/requirementselector.jsp`

```jsp
<html>
<head>
    <title>Requirement Selector</title>
    <script src="/static/js/delegated-ui.js"></script>
</head>
<body>
    <input type="search" id="searchTerms">
    <button onclick="search('${selectionUri}')">Search</button>
    <select id="results" multiple></select>
</body>
</html>
```

**After (Qute):**

```java
@GET
@Path("selector")
@Produces({ MediaType.TEXT_HTML, MediaType.APPLICATION_JSON })  // Note: both media types
@Consumes({ MediaType.TEXT_HTML, MediaType.WILDCARD })
public Object RequirementSelector(  // Note: return type is Object
    @QueryParam("terms") final String terms
) {
    String selectionUri = uriInfo.getAbsolutePath().toString();
    
    if (terms != null) {
        // Search request - return JSON
        List<Requirement> resources = delegate.search(terms);
        JSONArray results = new JSONArray();
        for (Requirement req : resources) {
            JSONObject obj = new JSONObject();
            obj.put("title", req.getTitle());
            obj.put("resource", req.getAbout().toString());
            results.put(obj);
        }
        return Response.ok(results.toString()).build();
    } else {
        // Initial dialog request - return Qute template
        return requirementSelector.data("selectionUri", selectionUri);
    }
}
```

Add template injection to the service class:

```java
@Path("serviceProviders/{serviceProviderId}/service1/requirements")
public class RequirementsService {
    
    @Inject
    Template requirementSelector;  // Qute finds templates/requirementSelector.html
    
    // ... rest of class
}
```

Qute template: `src/main/resources/templates/requirementSelector.html`

```html
<html>
<head>
    <title>Requirement Selector</title>
    <script src="/static/js/delegated-ui.js"></script>
</head>
<body>
    <input type="search" id="searchTerms">
    <button onclick="search('{selectionUri}')">Search</button>
    <select id="results" multiple></select>
</body>
</html>
```

**Key changes:**
- Method return type changes from `Response`/`void` to `Object` to support both returns
- Add `MediaType.APPLICATION_JSON` to `@Produces` annotation
- Return `TemplateInstance` for HTML, `Response` for JSON
- Inject template with `@Inject Template templateName`
- Template name matches file name without extension

### Pattern 3: Migrating resource detail pages

Resource detail pages show a single OSLC resource in HTML format.

**Before (JSP):**

```java
@GET
@Path("{resourceId}")
@Produces({ MediaType.TEXT_HTML })
public void getRequirementAsHtml(
    @PathParam("resourceId") final String resourceId
) throws ServletException, IOException {
    
    Requirement requirement = delegate.getRequirement(resourceId);
    if (requirement != null) {
        httpServletRequest.setAttribute("requirement", requirement);
        RequestDispatcher rd = httpServletRequest.getRequestDispatcher(
            "/co/oslc/refimpl/rm/gen/requirement.jsp");
        rd.forward(httpServletRequest, httpServletResponse);
        return;
    }
    throw new WebApplicationException(Status.NOT_FOUND);
}
```

JSP: `src/main/webapp/co/oslc/refimpl/rm/gen/requirement.jsp`

```jsp
<%@ page import="org.eclipse.lyo.oslc.domains.rm.Requirement" %>
<% Requirement req = (Requirement) request.getAttribute("requirement"); %>

<html>
<body>
    <h1><%= req.getTitle() %></h1>
    <p>Identifier: <%= req.getIdentifier() %></p>
    <p>Description: <%= req.getDescription() %></p>
</body>
</html>
```

**After (Qute):**

Option 1: Disable HTML representation (recommended initially):

```java
// NOTE: HTML representation disabled in Quarkus migration as JSP forwarding 
// is not supported. Quarkus uses Qute templates instead. 
// For now, only RDF representations are supported.
// @GET
// @Path("{resourceId}")
// @Produces({ MediaType.TEXT_HTML })
// public void getRequirementAsHtml(...) { ... }
```

Option 2: Migrate to Qute (when needed):

```java
@Inject
Template requirement;

@GET
@Path("{resourceId}")
@Produces({ MediaType.TEXT_HTML })
public TemplateInstance getRequirementAsHtml(
    @PathParam("resourceId") final String resourceId
) {
    Requirement req = delegate.getRequirement(resourceId);
    if (req != null) {
        return requirement
            .data("requirement", req)
            .data("title", req.getTitle())
            .data("identifier", req.getIdentifier())
            .data("description", req.getDescription());
    }
    throw new WebApplicationException(Status.NOT_FOUND);
}
```

Qute template: `src/main/resources/templates/requirement.html`

```html
<html>
<body>
    <h1>{title}</h1>
    <p>Identifier: {identifier}</p>
    <p>Description: {description}</p>
</body>
</html>
```

### Qute syntax reference for JSP developers

| JSP Syntax | Qute Equivalent | Notes |
|------------|-----------------|-------|
| `<%= expr %>` | `{expr}` | Expression output |
| `${expr}` | `{expr}` | Expression output |
| `<c:if test="${condition}">` | `{#if condition}...{/if}` | Conditional |
| `<c:forEach items="${list}" var="item">` | `{#for item in list}...{/for}` | Iteration |
| `<c:choose><c:when>` | `{#if}...{#else if}...{#else}...{/if}` | Multiple conditions |
| `<c:url value="/path"/>` | `/path` or `{basePath}/path` | Static or dynamic URL |
| `<c:out value="${text}"/>` | `{text}` | Escaped output (default) |
| `${text}` (unescaped) | `{text.raw}` | Unescaped output |
| `${obj.property}` | `{obj.property}` | Property access |
| `${map['key']}` | `{map.get('key')}` | Map access |
| `${list[0]}` | `{list.get(0)}` | List access |
| `${fn:length(list)}` | `{list.size}` | Collection size |

### Common Qute patterns

**Conditional rendering:**

```html
{#if user}
    <p>Welcome, {user.name}!</p>
{#else}
    <p>Please log in.</p>
{/if}
```

**Iteration:**

```html
<ul>
{#for item in items}
    <li>{item.name} - {item.price}</li>
{/for}
</ul>
```

**Null-safe access:**

```html
<p>{resource.title ?: 'Untitled'}</p>  <!-- Elvis operator -->
<p>{resource.description orEmpty}</p>   <!-- Empty string if null -->
```

**Calling methods:**

```html
<p>Total: {items.size}</p>
<p>First: {items.get(0).name}</p>
```

### Migration checklist

For each JSP file to migrate:

- [ ] Create new `.html` file in `src/main/resources/templates/`
- [ ] Convert JSP directives and imports (not needed in Qute)
- [ ] Convert `<%= %>` and `${}` to `{}`
- [ ] Convert JSTL tags to Qute sections (`{#if}`, `{#for}`, etc.)
- [ ] Identify data needed from request attributes
- [ ] Create or update JAX-RS resource class
- [ ] Add `@Inject Template templateName` field
- [ ] Change method return type to `TemplateInstance` (or `Object` for dual-mode)
- [ ] Replace `RequestDispatcher.forward()` with `return template.data(...)`
- [ ] Pass data using `.data(key, value)` calls
- [ ] Test the migrated page
- [ ] Delete the old JSP file

### Recommended migration order

1. **Start with simple pages**: Home page, about page, error pages
2. **Then OSLC dialogs**: Selection dialogs, creation dialogs
3. **Finally resource pages**: Individual resource detail views (or disable them)
4. **Leave query collection pages**: These are often complex; consider disabling HTML and keeping only RDF

### Testing migrated templates

After migration, verify:

```bash
# Test HTML rendering
curl -H "Accept: text/html" http://localhost:8800/

# Test selection dialog
curl --user admin:admin http://localhost:8800/.../selector

# Test with search parameter (should return JSON)
curl --user admin:admin http://localhost:8800/.../selector?terms=test
```

### When to skip HTML migration

Not all HTML endpoints need migration immediately. Consider disabling HTML representations for:

- Query collection pages (complex iteration and paging)
- Resource detail pages (if rarely used)
- Preview pages (small/large preview)

Keep these as RDF-only endpoints and focus on migrating essential UI:

```java
// Comment out HTML endpoints
// @GET
// @Path("query")
// @Produces({ MediaType.TEXT_HTML })
// public void queryResourcesAsHtml(...) {
//     // JSP forwarding code
// }
```

This allows you to complete the Quarkus migration without rewriting every HTML view immediately.

## Step 6: Update Dockerfile

Replace Jetty-based Dockerfile with Quarkus configuration:

```dockerfile
FROM docker.io/library/maven:3-eclipse-temurin-21 AS build

COPY . /src
WORKDIR /src

# Copy project files
COPY pom.xml pom.xml
COPY client-toolchain/pom.xml client-toolchain/pom.xml
COPY lib-common/ lib-common/
COPY server-rm/ server-rm/

# Build Quarkus uber-jar (single JAR with all dependencies)
RUN mvn -B --no-transfer-progress -DskipTests clean package \
    -pl server-rm -am -Dquarkus.package.jar.type=uber-jar

FROM registry.access.redhat.com/ubi8/openjdk-21-runtime:1.20

# Add metadata
LABEL org.opencontainers.image.title="OSLC RefImpl RM Server"
LABEL org.opencontainers.image.description="OSLC RM Reference Implementation"
LABEL org.opencontainers.image.source="https://github.com/oslc-op/refimpl"
LABEL org.opencontainers.image.vendor="OSLC Open Project"
LABEL org.opencontainers.image.licenses="EPL-2.0"

ENV LANGUAGE='en_US:en'

WORKDIR /deployments

# Copy the Quarkus uber-jar
COPY --from=build --chown=185 /src/server-rm/target/*-runner.jar \
     /deployments/quarkus-run.jar

EXPOSE 8800
USER 185

ENTRYPOINT ["java", "-jar", "/deployments/quarkus-run.jar"]
```

Update `docker-compose.yml`:

```yaml
services:
  server-rm:
    build:
      context: ./
      dockerfile: server-rm/Dockerfile
    ports:
      - "127.0.0.1:8800:8800"  # Note: Quarkus uses 8800, not 8080
```

## Step 7: Update integration tests

Update test wait conditions for Quarkus:

```java
@Container
public static ComposeContainer environment = new ComposeContainer(
        new File("src/test/resources/docker-compose.yml"))
    .withExposedService(RM_SVC, RM_PORT,
        Wait.forLogMessage(".*(Started oejs.Server@|Quarkus.*started in).*", 1)
            .withStartupTimeout(Duration.ofSeconds(STARTUP_TIMEOUT)))
```

Update Swagger UI URLs in tests:

```java
// Use /swagger-ui for Quarkus RM server
var swaggerUrl = RM_SVC.equals(svc) 
    ? "http://%s:%d/swagger-ui".formatted(serviceHost, servicePort)
    : "http://%s:%d/swagger-ui/index.jsp".formatted(serviceHost, servicePort);
```

## Step 8: Optional - Remove /services prefix

The traditional Lyo pattern uses `/services/` as a prefix for all OSLC resources. Quarkus allows you to remove this prefix for cleaner URLs.

Update `application.properties`:

```properties
# Remove /services prefix
quarkus.resteasy.path=/
```

Update `@OpenAPIDefinition`:

```java
@OpenAPIDefinition(info = @Info(title = "RM", version = "1.0.0"), 
                   servers = @Server(url = "/"))
```

Update all hardcoded `/services/` references in templates and code.

## Troubleshooting

### UT010023 - Undertow request wrapper error

**Problem**: `UT010023: Request already used for a different request`

**Solution**: Undertow validates that requests passed to `RequestDispatcher.forward()` are either the original request or properly wrapped. Create a utility method:

```java
public class ServletUtil {
    public static HttpServletRequest unwrapRequest(HttpServletRequest request) {
        ServletRequest current = request;
        while (current instanceof HttpServletRequestWrapper) {
            current = ((HttpServletRequestWrapper) current).getRequest();
        }
        return (HttpServletRequest) current;
    }
}
```

Use it before forwarding:

```java
HttpServletRequest originalRequest = ServletUtil.unwrapRequest(httpServletRequest);
RequestDispatcher rd = originalRequest.getRequestDispatcher("/path/to/jsp");
rd.forward(originalRequest, httpServletResponse);
```

### Home page returns 403 Forbidden

**Problem**: Home page accessible but returns 403.

**Solution**: Check that:
1. `HomePageResource` is registered in `Application.getClasses()`
2. `HomePageResource` has `@ApplicationScoped` annotation
3. `CredentialsFilter` excludes the root path

### Resources not discovered

**Problem**: JAX-RS resources not appearing in startup logs.

**Solution**: Either add `@ApplicationScoped` to resource classes, or explicitly register them in `Application`:

```java
static {
    RESOURCE_CLASSES.add(YourResourceClass.class);
}
```

### Swagger UI not found

**Problem**: Swagger UI returns 404.

**Solution**: Configure in `application.properties`:

```properties
quarkus.swagger-ui.always-include=true
quarkus.swagger-ui.path=/swagger-ui
```

## Performance comparison

### Before (Jersey/Jetty)

```
2025-12-20T18:02:29.000Z Started oejs.Server@3d4eac69{STARTING}
Startup time: 5-10 seconds
```

### After (Quarkus)

```
2025-12-20T18:02:34.235Z server-rm 0.3.0-SNAPSHOT on JVM 
    (powered by Quarkus 3.17.4) started in 0.787s.
Startup time: <1 second
```

## Additional resources

- [Quarkus Documentation](https://quarkus.io/guides/)
- [Eclipse Lyo Documentation](https://oslc.github.io/developing-oslc-applications/)
- [Qute Template Engine Guide](https://quarkus.io/guides/qute)
- [Quarkus CDI Reference](https://quarkus.io/guides/cdi-reference)
- [Example Migration PR](https://github.com/oslc-op/refimpl/pull/482)

## Summary

This migration delivers significant benefits:

- **10x faster startup**: Enables deployment to serverless and auto-scaling platforms
- **Reduced memory footprint**: More efficient resource usage
- **Modern stack**: CDI instead of HK2, Qute instead of JSP
- **Better security**: Template engines that do not execute arbitrary code
- **Cloud-ready**: Compatible with Google Cloud Run, Azure Container Apps, AWS App Runner

The main trade-offs are:

- JSP pages must be migrated to Qute templates
- OAuth 1.0a support requires additional work (consider OAuth 2.0 instead)
- Some HTML representations may need to be disabled temporarily

Overall, the migration effort is worthwhile for any OSLC server adaptor targeting modern deployment platforms.
