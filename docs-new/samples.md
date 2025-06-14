# Sample Applications and Code

This section provides working examples and reference implementations using Eclipse Lyo.

## OSLC Reference Implementation

The primary reference implementation is the **[OSLC Open Project Reference Implementation](https://github.com/oslc-op/refimpl)**.

This repository contains complete OSLC servers for all major domains:

- **Requirements Management** (RM)
- **Change Management** (CM) 
- **Quality Management** (QM)
- **Architecture Management** (AM)

### Key Features

- ✅ **Production-ready code** with modern practices
- ✅ **Docker support** for easy deployment
- ✅ **Kubernetes configurations** for scalable deployment
- ✅ **Comprehensive test suites** including integration tests
- ✅ **OpenAPI/Swagger documentation** for all endpoints

## Lyo Client Samples

**[Lyo Client Sample Code](https://github.com/OSLC/lyo-samples)** - A GitHub repository that demonstrates how to use the Lyo SDK oslc4j-client to interact with OSLC Service Providers.

Covers common scenarios:
- Authentication (Form login, OAuth)
- Service discovery
- Resource querying
- Resource creation and updates

## Getting Started with the RefImpl

1. **Clone the repository**:
   ```bash
   git clone https://github.com/oslc-op/refimpl.git
   cd refimpl
   ```

2. **Build and run**:
   ```bash
   cd src/
   mvn clean install
   cd server-rm/
   mvn jetty:run-war
   ```

3. **Access the server**: http://localhost:8080/server-rm

## More Examples

- **[PROMCODE Lyo Server](https://github.com/OSLC/promcode-lyo-server)** - OSLC PROMCODE domain implementation
- **[IoT Platform Adapter](iotp-adaptor-sample.md)** - Sample OSLC adapter for IBM Watson IoT Platform

---

*Looking for more examples? Check the [OSLC community repositories](https://github.com/oslc-op) for additional implementations and tools.*
