# Additional Security Considerations

When deploying OSLC adapters in distributed environments, several security configurations are required to ensure proper operation while maintaining security standards.

!!! warning "Distributed Deployment Security"
    Modern web browsers implement multiple protection mechanisms that must be properly configured across all servers in a federated deployment.

## Security Protection Mechanisms

The following security mechanisms must be properly configured:

- **Session Management** with JSESSIONID
- **Mixed-mode guards** (HTTP/HTTPS)
- **Cross-Origin Resource Sharing** (CORS) guards
- **Content Security Policies** (CSP)
- **Cross-site Request Forgery** (CSRF) guards

## Session Management Cookie (JSESSIONID)

!!! important "Cookie Name Conflicts"
    If you install the Adapter web application and Collaborative Lifecycle Management (CLM) on the same WebSphere Application Server or behind the same reverse proxy, you must change the HTTP session management cookie name.

Both CLM and the adapter use the same JSESSIONID cookie in HTTP sessions. CLM sometimes resets the cookie during login, causing the adapter to lose its session in linking scenarios.

**Configuration steps:**
- [Changing the HTTP session management cookie name for Apache Tomcat](ChangingHTTPcookienameTomcat.md)
- [Changing the HTTP session management cookie name for WebSphere](ChangingHTTPcookienameWAS.md)

## HTTP/HTTPS Mixed-mode Blocking

"Mixed-mode" refers to requesting content from both insecure HTTP and secure HTTPS servers. Modern browsers block mixed-mode requests for security reasons.

!!! danger "Mixed-mode Prevention"
    To avoid mixed-mode denial of service, all servers in your organization must use either **only HTTP** or **only HTTPS**.

### HTTPS Requirements

When using HTTPS:

1. **Valid SSL Certificates**: All servers must use SSL certificates issued by trusted root Certificate Authorities
2. **No Self-signed Certificates**: Self-signed SSL certificates cannot be used
3. **Certificate Trust Chain**: Each JVM acting as a client must explicitly add SSL certificates to their "cacerts" key stores

### SSL Configuration Steps

!!! tip "SSL Setup Checklist"
    Follow these steps to ensure proper SSL configuration:

1. **Obtain SSL Tools**
   - Get a Java SSL connection utility (e.g., "portecle" or "SSLpoke")
   - Obtain root-CA-signed certificates (e.g., from "LetsEncrypt")

2. **Configure CLM Server**
   - Install root-CA-signed certificate into the server keystore
   - Update cacerts files on PLM and RLIA servers with CLM certificates

3. **Configure PLM Server**
   - Enable SSL service and disable HTTP
   - Install certificates and update cacerts on CLM and RLIA servers

4. **Configure RLIA Server**
   - Install SSL certificates
   - Update cacerts on CLM and PLM servers

!!! success "Final Result"
    When complete, you should have 3 root-signed certificates and 6 trust relationships configured.

## Cross-Origin Resource Sharing (CORS)

CORS allows controlled access to resources from different origins. Without proper CORS configuration, browsers will reject cross-origin requests.

!!! quote "CORS Definition"
    Cross-Origin Resource Sharing (CORS) uses additional HTTP headers to let a user agent gain permission to access selected resources from a server on a different origin than the site currently in use.

### CORS Configuration

Configure the following HTTP headers:

| Source | Header | Value | Purpose |
|--------|--------|-------|---------|
| Client | `Origin` | `https://windchill.acme.com` | Required for CORS requests |
| Server | `Access-Control-Allow-Origin` | `https://windchill.acme.com` | Allowed origins |
| Server | `Access-Control-Allow-Methods` | `OPTIONS, GET, DELETE, POST, PUT, PATCH` | Allowed HTTP methods |
| Server | `Access-Control-Allow-Headers` | `Origin, Authorization, DoorsRP-Request-Type` | Allowed request headers |
| Server | `Access-Control-Expose-Headers` | `WWW-Authenticate, X-jazz-web-oauth-url` | Exposed response headers |
| Server | `Access-Control-Allow-Credentials` | `"true"` | Enable credential sharing |

**Configuration guides:**
- [Configuring CORS for Apache Tomcat](ConfiguringCORSforApacheTomcat.md)
- [Configuring CORS for IBM WAS Liberty](ConfiguringCORSforIBMWASLiberty.md)

!!! warning "JavaScript Requirements"
    For browsers to honor CORS requests, XHR requests in client JavaScript must include the `withCredentials: true` parameter.

## Content Security Policies (CSP)

CSP helps prevent Cross-site Scripting (XSS) attacks by controlling which resources can be loaded and executed.

!!! info "CSP Purpose"
    CSP mitigates XSS attacks by specifying which domains the browser should consider valid sources of executable scripts.

### CSP Configuration for Jazz CLM

1. **Access JTS Admin Site**
   - Browse to each CLM realm (e.g., "rm", "cm", "gc")

2. **Configure Whitelist**
   - Select "Manage this Application" from Administration menu
   - Choose "Whitelist" from the panel
   - Add PLM server URL (e.g., `https://windchill.acme.com`)

!!! note "Modern Browser Requirements"
    Modern browsers require proper CSP headers and specific targetOrigin parameters in `window.postMessage` calls.

## Cross-Site Request Forgery (CSRF)

CSRF protection prevents unauthorized actions by ensuring requests come from legitimate sources.

!!! danger "CSRF Attacks"
    CSRF attacks force users to execute unwanted actions on applications where they're currently authenticated.

### CSRF Implementation

The adapter uses **OWASP CSRF Guard** as a Java Servlet Request Filter to inject session state and prevent CSRF attacks.

**Network requirements:**
- HTTP packet filters must not strip CSRF state
- Proxy servers must pass along CSRF state

---

## See Also

- [Technical Foundations](technical-foundations.md)
- [OSLC Security Best Practices](https://docs.oasis-open.org/oslc-core/oslc-core/v3.0/oslc-core-v3.0-part1-overview.html#security)
- [OWASP Security Guidelines](https://owasp.org/)
