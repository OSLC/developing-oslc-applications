---
search:
  boost: 1.1 
---
# Migrating from Lyo 6.x to 7.x

!!! note "Content generated with LLM assistance"
    This guide was produced based on the private migration notes, CHANGELOGs, git diffs of previous commits, among others. LLM was used to collate the information below. All output was reviewed by a human. However, proceed carefully. If in doubt, see _Additional resources_ links at the bottom of the page or propose changes to this page by hitting the _Edit this page_ button above on the right.

!!! danger "Work in progress"
    Lyo 7 has not been released as of 2025-06. Therefore, this migration guide is not final.

## Overview

Migration from Lyo 6.x to 7.x involves:

- **Apache Jena**: 4.8 → 4.10 (addresses CVE-2023-32200)
- **Deprecated Removal**: `oslc4j-json4j-provider` dependency removed
- **Bug Fixes**: OSLC Query ResponseInfo handling improvements
- **OGM Improvements**: Duplicate class registration fixes

## Prerequisites

### Version Dependencies

| Component | Lyo 6.x | Lyo 7.x |
|-----------|---------|---------|
| **JDK baseline** | 17 | 21 |
| **Apache Jena** | 4.8 | 4.10 (5.x planned) |
| **Jersey** | 3.1.5 | 3.1.5 (3.1.10 planned) |
| **Jakarta EE** | EE10 | EE10 |

### Breaking Changes Summary

- ❌ **JDK 17 support removed** (JDK 21+ required)
- ❌ **`oslc4j-json4j-provider` removed** (deprecated dependency)
- 🔄 **Apache Jena 4.10 API changes** (minor breaking changes)
- ✅ **Most applications should migrate seamlessly if compiled with Java 21**

## Step-by-Step Migration

### Phase 1: Dependency Assessment

#### 1.1 Check for Removed Dependencies
Verify if your project uses the removed dependency:

```bash
# Check for deprecated JSON4J provider
grep -r "oslc4j-json4j-provider" pom.xml
grep -r "json4j" src/
```

#### 1.2 Jena Usage Review
Check for direct Jena API usage that might be affected:

```bash
# Look for Jena imports and usage
grep -r "org.apache.jena" src/
```

### Phase 2: Dependency Updates

#### 2.1 Update Lyo Version
Update the Lyo version in your properties. Note that starting with version `7.0.0.Alpha4`, Eclipse Lyo introduced a **Bill of Materials (BOM)** to simplify dependency management and ensure version convergence across different Lyo artifacts:

```xml
<properties>
    <lyo.version>7.0.0-Alpha.10</lyo.version> <!-- Use the latest available version -->
    <!-- Other versions remain the same -->
    <jersey.version>3.1.5</jersey.version>
</properties>
```

You can optionally manage Lyo dependencies via the new BOM in `<dependencyManagement>`:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.eclipse.lyo</groupId>
            <artifactId>lyo-bom</artifactId>
            <version>${lyo.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

#### 2.2 Remove Deprecated Dependencies
If using the deprecated JSON4J provider:

```xml
<!-- REMOVE: Deprecated JSON4J provider -->
<!--
<dependency>
    <groupId>org.eclipse.lyo.oslc4j.core</groupId>
    <artifactId>oslc4j-json4j-provider</artifactId>
    <version>${lyo.version}</version>
</dependency>
-->
```

!!! note "Wink JSON4J Classes Usage"
    If the project code (such as generated selection/creation dialogue methods) still imports and uses classes from `org.apache.wink.json4j.*` (like `JSONObject`, `JSONArray`, or `JSONException`), a direct dependency on Apache Wink JSON4J shall be added to the `pom.xml` to avoid compilation errors:

    ```xml
    <dependency>
        <groupId>org.apache.wink</groupId>
        <artifactId>wink-json4j</artifactId>
        <version>1.4</version>
    </dependency>
    ```

    The `Json4JProvidersRegistry` and `JsonHelper` imports and registrations shall also be removed from the JAX-RS Application registration logic, as these specific helpers were part of the removed `oslc4j-json4j-provider` wrapper.

### Phase 3: Code Changes (Minimal Expected)

#### 3.1 JSON4J Provider Replacement
If you were using the JSON4J provider, replace with Jena provider with JSON-LD support:

```java
// OLD: JSON4J provider (removed)
// No specific imports needed - was auto-configured

// NEW: Use Jena provider (recommended since Lyo 4.x)
// Jena provider is the default and preferred JSON provider
// remove OslcMediaType.APPLICATION_JSON from @Produces/@Consumes and add OslcMediaType.APPLICATION_JSON_LD instead
@Consumes({OslcMediaType.APPLICATION_RDF_XML, OslcMediaType.APPLICATION_JSON_LD, OslcMediaType.TEXT_TURTLE, OslcMediaType.APPLICATION_XML })
@Produces({OslcMediaType.APPLICATION_RDF_XML, OslcMediaType.APPLICATION_JSON_LD, OslcMediaType.TEXT_TURTLE, OslcMediaType.APPLICATION_XML})

```

#### 3.2 Jena 4.10 API Changes
Most Jena usage should be compatible, but check for any breaking changes:

```java
// Review any direct Jena API usage
// Most code should work without changes
import org.apache.jena.rdf.model.*;
import org.apache.jena.query.*;

// If you encounter issues, check Jena 4.10 release notes
```

### Phase 4: Testing and Validation

#### 4.1 Build and Test
```bash
# Build with Lyo 7.x
mvn clean compile

# Run tests
mvn test

# Package application
mvn package
```

#### 4.2 Security Validation
Verify that CVE-2023-32200 is addressed:

```bash
# Check Jena version in dependency tree
mvn dependency:tree | grep jena

# Should show Jena 4.10.x
```

#### 4.3 OSLC Query Testing
Test OSLC Query functionality, especially with multiple ResponseInfo objects:

```java
// Test OSLC queries that might return multiple ResponseInfo objects
// The bug fix ensures the correct ResponseInfo is picked
OslcQuery query = new OslcQuery(client, queryCapability);
OslcQueryResult result = query.submit();

// Verify ResponseInfo is correctly handled
ResponseInfo responseInfo = result.getResponseInfo();
```

### Common Migration Issues

#### Issue: Missing JSON4J Provider

> java.lang.ClassNotFoundException: org.eclipse.lyo.oslc4j.json4j.provider.Json4JProvider

**Solution:** Remove the `oslc4j-json4j-provider` dependency. Use the default Jena provider instead.

#### Issue: JSON Serialization Changes
```
Different JSON output format after migration
```
**Solution:** The Jena provider produces JSON-LD. If you need different JSON format, implement a custom provider or use transformation.

#### Issue: Jena API Compatibility

> java.lang.NoSuchMethodError: org.apache.jena.xxx

**Solution:** Check Jena 4.10 release notes for any breaking API changes and update code accordingly.

**Jena RDF Serialization Changes:**

> org.apache.jena.riot.RiotException: Unexpected serialization format

**Solution:** Use RDFDataMgr for consistent serialization:
```java
// OLD: Direct model writing
model.write(outputStream, "RDF/XML");

// NEW: Use RDFDataMgr for Jena 4.10
RDFDataMgr.write(outputStream, model, Lang.RDFXML);
```

**Jena Model Loading:**

> org.apache.jena.shared.JenaException: Model loading failed with Jena 4.10

**Solution:** Ensure that all transitive deps were compiled while targeting Jena 4.10.

## Testing Checklist

- [ ] Application builds successfully with Lyo 7.x
- [ ] No usage of removed `oslc4j-json4j-provider`
- [ ] OSLC operations work correctly
- [ ] OSLC Query functionality works as expected
- [ ] JSON serialization produces expected output
- [ ] Security scanning shows Jena 4.10.x in use
- [ ] Performance is maintained or improved
- [ ] All tests pass

## Additional Resources

- **[Lyo 7.0 Release Notes](https://github.com/eclipse/lyo/releases/tag/v7.0.0)**
- **[CVE-2023-32200 Details](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-32200)**
- **[Apache Jena 4.10 Release Notes](https://jena.apache.org/documentation/notes/)**
- **[OSLC Community Forum](https://forum.open-services.net/c/sdks/lyo/9)**

---

!!! success "Recommended Migration"
    Lyo 7.x is recommended for all applications due to the security improvements. The migration should be straightforward for most projects.
