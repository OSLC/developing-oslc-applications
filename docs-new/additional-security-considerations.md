# Configurations Necessary for Distributed Deployments
 
An adapter is often a web service that gathers and dispenses information from a federation of servers. Modern web browsers employ several protection mechanisms to prevent attackers from gaining access to unauthorized information and from forcing the user's browsers to perform forbidden behavior.
 
Such protections include:
 
* Session Management with JSESSIONID
* Mixed-mode guards
* Cross-Origin Resource Sharing guards
* Content Security Policies
* Cross-site Request Forgery guards
 
Successful operation of the integration adapter requires that each of these protection mechanisms is properly configured on the appropriate servers of the federated deployment.
 
## Session Management Cookie (JSESSIONID)
 
If you install the Adapter web application and Collaborative Lifecycle Management (CLM) on the same WebSphere Application Server or if the Adapter and CLM are behind the same reverse proxy, such as IBM HTTP Server (IHS), you must change the HTTP session management cookie name. CLM and the adapter both use the same JSESSIONID cookie in an HTTP session. CLM sometimes resets the cookie when you log in, which causes the adapter to lose its session in some linking scenarios. See [Changing the HTTP session management cookie name for Apache Tomcat](ChangingHTTPcookienameTomcat.html) or [Changing the HTTP session management cookie name for WebSphere](ChangingHTTPcookienameWAS.html) as required.
 
## HTTP / HTTPS Mixed-mode Blocking
 
"Mixed-mode" is the requesting of content from both insecure HTTP servers and secure HTTPS servers and the execution of browser scripts from a set of servers using both HTTP and HTTPS protocols.
 
In legacy browsers, the browser would allow script loaded from HTTPS servers to make "mixed-mode" requests to HTTP servers. Today, modern browsers block these requests.
 
To avoid mixed-mode denial of service, the organization's servers must all use only HTTP or must all use HTTPS. Furthermore, when using HTTPS, the servers must use SSL Certificate credentials which are issued by trusted root Certificate Authorities. An organization cannot use "self-signed" SSL certificates.
 
Not only must each server in the deployment present a valid, root-trusted SSL certificate, each of the other two JVMs which act as clients to the other server must explicitly add the SSL certificate to their "cacerts" key stores.
 
The "cacerts" file used by an application is often not the same as the one used by a user's browser or by the default "JAVA_HOME" JVM on the hosting server.
 
To assure that proper SSL keys are published and then are trusted:
 
1. Obtain a Java SSL connection utility such as "portecle" or "SSLpoke"
2. Obtain 3 root-CA-signed certifications from a service such as "LetsEncrypt"
3. On the CLM server
    * install the root-CA-signed certificate into the Tomcat, WAS, or WAS Liberty keystore used by the particular server (e.g. into the server.xml file)
    * Log into the PLM server
        * use "portecle" to open the cacerts file of the Windchill's Java distribution. Typically, this is located under /opt/Windchill/Java.
    * Examine the SSL connection to the HTTPS URL of the CLM server  
        * Save each of the discovered certificates (there are often three) as PEM format files
        * Import each of the PEM certificates into the PLM server's cacerts file
   * Log into the RLIA server
       * use "portecle" to open the cacerts file of the RLIA distribution. Typically, this is located under /opt/Java.
       * Examine the SSL connection to the HTTPS URL of the CLM server
       * Save each of the discovered certificates (there are often three) as PEM format files
       * Import each of the PEM certificates into the RLIA server's cacerts file
4. On the PLM server
   * re-configure Windchill for SSL service and disable it for HTTP service
   * install the root-CA-signed certificate into the Apache keystore used by Windchill
   * Log into the CLM server
       * use "portecle" to open the cacerts file of the CLM distribution. Typically, this is located under /opt/IBM/JazzServer.
       * Examine the SSL connection to the HTTPS URL of the PLM server
       * Save each of the discovered certificates (there are often three) as PEM format files
       * Import each of the PEM certificates into the CLM server's cacerts file
   * Log into the RLIA server
       * use "portecle" to open the cacerts file of the RLIA distribution. Typically, this is located under /opt/Java.
       * Examine the SSL connection to the HTTPS URL of the PLM server
       * Save each of the discovered certificates (there are often three) as PEM format files
       * Import each of the PEM certificates into the RLIA server's cacerts file
5. On the RLIA server
   * install the root-CA-signed certificate into the Tomcat, WAS, or WAS Liberty keystore used by the particular server (e.g. into the server.xml file)
   * Log into the CLM server
       * use "portecle" to open the cacerts file of the CLM distribution. Typically, this is located under /opt/IBM/JazzServer.
       * Examine the SSL connection to the HTTPS URL of the RLIA server
       * Save each of the discovered certificates (there are often three) as PEM format files
       * Import each of the PEM certificates into the CLM server's cacerts file
   * Log into the PLM server
       * use "portecle" to open the cacerts file of the Windchill's Java distribution. Typically, this is located under /opt/Windchill/Java.
       * Examine the SSL connection to the HTTPS URL of the RLIA server
       * Save each of the discovered certificates (there are often three) as PEM format files
       * Import each of the PEM certificates into the PLM server's cacerts file
 
When finished, you should have 3 root-signed certificates and 6 trust relationships. If one or more of these 9 configurations is incorrect, the Adapter integration will fail in one or more ways.
 
# Cross-Origin Resource Sharing (CORS)
 
Within the Adapter integration, the Windchill Javascript in the browser of a PLM user will attempt to make requests directly to the CLM server from script that was sourced either from the PLM server (in Windchill extensions) or from the RLIA server (in JSP-loaded scripts). Without CORS support on the CLM server, the user's browser will reject those cross-origin requests.
 
Note that CORS-blocking is particularly difficult to diagnose because the browsers are required by the CORS standards to return HTTP 200 (OK) for XHR requests that have, in fact, never been sent to the servers.
 
>Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to let a user agent gain permission to access selected resources from a server on a different origin (domain) than the site currently in use. A user agent makes a cross-origin HTTP request when it requests a resource from a different domain, protocol, or port than the one from which the current document originated.
 
>An example of a cross-origin request: A HTML page served from http://domain-a.com makes an &lt;img&gt; src request for http://domain-b.com/image.jpg. Many pages on the web today load resources like CSS stylesheets, images, and scripts from separate domains, such as content delivery networks (CDNs).
 
>For security reasons, browsers restrict cross-origin HTTP requests initiated from within scripts. For example, XMLHttpRequest and the Fetch API follow the same-origin policy. This means that a web application using those APIs can only request HTTP resources from the same domain the application was loaded from unless CORS headers are used.
<footer>"MDN CORS Site":https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS </footer>
 
Server-side CORS support can either be implemented directly within the servlet controllers of the target application (e.g. within the internal code of Jazz CLM itself) or by features of the execution environment hosting the CLM application (e.g. within IBM WAS Liberty).
 
See [Configuring CORS for Apache Tomcat](ConfiguringCORSforApacheTomcat.html) or [Configuring CORS for IBM WAS Liberty](ConfiguringCORSforIBMWASLiberty.html) as appropriate. If you deploy a different execution host, consult its documentation for how to enable CORS.
 
Regardless of which execution environment is in use, the configuration for CORS necessary for the adapter includes the following HTTP Headers with the values shown:
 
| Source| Header| Value| Note|
| ----- | ----- | ---- | ---- |
| Client | Origin | @https://windchill.acme.com@ | Predates CORS but must be included in requests from the client to the server
| Server | Access-Control-Allow-Origin | @https://windchill.acme.com@ | Replace this with the URL(s) for your PLM server(s) |
| Server | Access-Control-Allow-Methods | OPTIONS, GET, DELETE, POST, PUT, PATCH | OPTIONS is necessary for XHR pre-flight CORS requests |
| Server | Access-Control-Allow-Headers | Origin, Authorization, DoorsRP-Request-Type | Which headers can pass client-to-server across origins |
| Server | Access-Control-Expose-Headers | WWW-Authenticate, X-jazz-web-oauth-url | Which headers can flow back from server-to-client |
| Server | Access-Control-Allow-Credentials | "true" | Necessary for cookies to be exchanged across origins |
 
Integration developers should be aware that for the browser to honor CORS requests and responses, the XHR requests in the client Javascript have to include the "withCredentials: true" parameter.
 
## Content Security Policies (CSP)
 
In addition to performing client-to-server requests, the adapter within the Windchill Javascript in the browser of a PLM user will also attempt to make requests between the browser's execution contexts, that is between windows whose source was loaded either from the PLM server (in Windchill extensions) or from the RLIA server (in JSP-loaded scripts) or from the CLM server (in iframe content). Without the use of CSP headers on the servers, the user's browser will reject those cross-domain requests.
 

>A primary goal of Content Security Policy (CSP) is to mitigate and report Cross-site Scripting (XSS) attacks. XSS attacks exploit the browser's trust of the content received from the server. Malicious scripts are executed by the victim's browser because the browser trusts the source of the content, even when it's not coming from where it seems to be coming from.
 
>CSP makes it possible for server administrators to reduce or eliminate the vectors by which XSS can occur by specifying the domains that the browser should consider to be valid sources of executable scripts. A CSP compatible browser will then only execute scripts loaded in source files received from those whitelisted domains, ignoring all other script (including inline scripts and event-handling HTML attributes)."
<footer>"MDN CSP Site":https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP </footer>
 
In legacy versions of browsers and of Javascript, a programmer could set the targetOrigin argument in window.postMessage calls to be "&#10033;" to allow all sites to post messages between the browser's windows. In modern versions of the browsers, the use of "&#10033;" only disables the error warning that the browser would otherwise raise for cross-site messaging. Today, the servers must provide a suitable Content-Security-Policy header for their scripts and the programmer must supply a proper host URL for the targetOrigin parameter.
 
To configure CSP support in Jazz CLM for the PLM server:
 
1. Browse to the JTS admin site for each of the CLM realms with which the adapter has an association
   * for example to "rm", "cm", and "gc"
2. Select Manage this Application from the Administration menu
3. Select Whitelist from the panel of Consumers, Friends, and Whitelist
4. Add a new URL for the PLM server to the set of any Whitelisted URLs already present
   * for example, @https://windchill.acme.com@
 
## Cross-Site Request Forgery (CSRF)
 
The adapter server responds to requests that are external to it with information that is intended only for the authorized user making the originating request. To assure that responses from the server are not sent to unauthorized strangers, the adapter server exploits CSRF protections.
 
>Cross-Site Request Forgery (CSRF) is an attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated. CSRF attacks specifically target state-changing requests, not theft of data, since the attacker has no way to see the response to the forged request."
<footer>"OWASP CSRF Site":https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)/ </footer>
 
The adapter web application uses the OWASP CSRF Guard as a Java Servlet Request Filter on each request to inject session state to prevent CSRF attacks.
 
Your network should not employ HTTP packet filters that strip CSRF state from packets or use proxy servers that neglect to pass along CSRF state.
 