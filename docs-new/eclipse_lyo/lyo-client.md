---
title: Lyo client
---

> This is old content migrated from the old `lyo.client` wiki.

## Introduction

This is the new OSLC4J client API that decouples OSLC client applications from Wink. The goals of this new client are:

* Provide a simpler, more flexible, easier to use, and more reliable OSLC Java client API
* Reduce the OslcClient footprint
* Eliminate any dependency on the retired [Apache Wink](https://svn.apache.org/repos/infra/websites/production/wink/content/index.html) framework

## OSLC4J Client Architecture

OslcClient provides access to OSLC resources for Java client applications including CRUD methods (including support for request headers and media type), and methods to lookup discovery resources (creation factory, query capability, etc.) from a ServiceProviderCatalog and its ServiceProviders. 

## Migrating from OSLC4J Wink Client to Lyo JAX-RS Client

There are technical, security and maintainability benefits for migration OSLC4J from Wink to Jersey. I won't discuss the motivation here. Rather I want to explore possible design strategies and API and implementation implications. For lyo.client, this will be a significant API breaking change that may push responsibility for certain HTTP communication configuration up into the client applications. Although these changes will improve security, OSLC4J users may be challenged to migrate their existing client applications to 4.0.0, especially if other parts of their technical architecture have related/coupled technical debt that they are not prepared to address. So we should make this change carefully.

Ideally OSLC4J 4.0.0 lyo.client would support Wink or Jersey, allowing users to migrate as needed in their applications. This not explores how the current OslcClient, its subclasses, and client applications work, and how this might change when migrating to Jersey.

There are currently three OslcClient variants:

**OslcClient**: provides generic CRUD method for OSLC resource access supporting SSL with configurable trust managers, with a default trust manager that trusts all client/server interactions over https. This capability is often used during development and testing.

**JazzFormAuthClient**: Extends OslcClient to support Java EE Form based authentication as used by the jazz.net apps. OSLC client applications typically use JazzRootServicesHelper to read the jazz.net app rootservices document, and provide the URLs to the services' ServiceProviderCatalogs.

**OslcOAuthClient**: extends OslcClient to support OAuth authentication as used by the DOORS Web Client. 

This perhaps identifies our first design issue. A lot has changed in authorization since lyo.client was originally developed. The jazz.net apps now provide lots of ways to authentication including OpenIDConnect. Also other OSLC servers like the iotp-adaptor on the Watson IoT Platform use HTTP Basic authentication of SSL and this is not directly supported, requiring an interceptor in order to add the authentication header.

Ideally lyo.client would at least support the two authentication mechanisms recommended by OSLC Core 3.0: Basic and OpenIDConnect, neither of which are supported now.

But ignoring that, let's look at how these current OslcClient variants work and what would be required to migrate them to Jersey.

## Simple OSLC client applications

The simplest OSLC client applications that don't need SSL and don't require login. GenericRMSample is an example of such a client application.

These client applications can use the default OslcClient() constructor. This default constructor supports http and automatically trusts all client/server communications with all hosts over https.  Alternatively client applications can use the OslcClient(TrustManager[], X509HostnameVerifier) constructor to specify more specific and secure communications over SSL. 

OslcClient supports:

* create, get, update and delete resource
* Lookup the ServiceProvider URL given a ServiceProviderCatalog URL and ServiceProvider title
* Lookup the query capability URL given a ServiceProvider URL
* Lookup the creation factory URL given the ServiceProvider URL and possibly the OSLC domain, resource type and OSLC usage

Here's a brief summary of the  OslcClient(TrustManager[], X509HostnameVerifier) constructor:

1. Creates a TheadSaveClientConnManager DefaultHttpClient
1. Turns off redirects.
1. unregisters https from the SchemeRegistry of the httpClient
1. Creates a TrustManager[] that has an X509TrustManager that ignores checkClientTrusted and checkServerTrusted calls in order to trust all certificates - a security issue!!
1. uses this TrustManager[] if the one provided in the OslcClient constructor was null
1. uses SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER if the one provided by the OslcClient constructor is null. Also a security issue!!
1. Creates an sslContext from a list of secure socket protocols: TLSv1.2, TLS, SSL, SSL_TLS
1. initializes the sslContext with the trust managers
1. re-registers a new https Scheme in the SchemeRegistry with an SSLSocketFactory that uses the SSL context and host name verifier created above
1. Creates a javax.ws.rs.core.Application and adds the JenaProvidersRegistry and Json4JProvidersRegistry providers.
1. configures the clientConfig with the applications
uses this clientConfig to the Wink RestClient used to access all resources

There are a couple of additional methods in OslcClient that are only used by the OAuth clients. These will be discussed below.

## jazz.net OSLC client applications

In the early days, all the jazz.net applications used JEE Form based authentication. lyo.client provides JazzFormAuthClient as an extension to OslcClient to handle the Form based authentication. However, client applications generally don't use JazzFormAuthClient directly, they instead use it indirectly through  JazzRootServicesHelper. RTCFormSample is an example of such a client application.

JazzRootServicesHelper:

1. Constructor figures out the namespace and service providers property to use to identify the ServiceProviderCatalog URLs in the jazz.net app rootservices document
1. uses new OslcClient() to read the root services document when it is constructed with JazzRootServicesHelper (String url, String catalogDomain). Authentication isn't required to read this document. 
1. Then the client application calls helper.initFormClient(userid, password) which constructs a JazzFormAuthClient from the helper's baseUrl, and the userid, password. 
1. The client application then calls client.login() to actually login using Jazz Form based authentication.
the client application can now use the JazzFormAuthClient subclass methods to do OSLC CRUD operations on jazz.net app resources, and use the service discovery method of an OslcClient
 
This immediately raises the issue that the JazzRootServicesHelper, and JazzFormAuthClient do not provide any means for the OSLC client application to specify trust managers or host name validators, all SSL client/server interaction to any server is unchecked! SSL is essentially ignored. 

So I'm not sure this could be used in a potentially insecure production environment. 

## OAuth OSLC client applications

Since DOORS Web Access required OAuth, lyo.client needed to provide OslcOAuthClient to extend OslcClient to provide OAuth 1.0a authentication (which was in common use at the time). DoorsOauthSample is an example of such a client application.

OSLC client applications that use OAuth also use JazzRootServicesHelper to not only get the ServiceProviderCatalog URLs, but also the various OAuth URLs including:
```
<jfs:oauthDomain>https://ce4iot.rtp.raleigh.ibm.com:9443/iotp</jfs:oauthDomain>
   <jfs:oauthRequestConsumerKeyUrl rdf:resource="https://host:9443/iotp/services/oauth/requestKey" />
   <jfs:oauthApprovalModuleUrl rdf:resource="https://host:9443/iotp/services/oauth/approveKey" />
   <jfs:oauthRequestTokenUrl rdf:resource="https://host:9443/iotp/services/oauth/requestToken"/>
   <jfs:oauthUserAuthorizationUrl rdf:resource="https://host:9443/iotp/services/oauth/authorize" />
   <jfs:oauthAccessTokenUrl rdf:resource="https://host:9443/iotp/services/oauth/accessToken"/>
```
The OSLC client app then uses the helper.initOAuthClient with the consumer key and secret to construct an OslcOAuthClient instance that also has the OAuth URLs obtained from the rootservices document. 

The OSLC client application then attempts to get a protected resource, catches any OAuthRedirectException, and then calls its validateTokens method to do the OAuth 1.0a dance, given the user id and password (there is no browser popup involved to access the user's credentials). 

This raises the same issue as JazzFormAuthClient. All the OslcOAuthClient constructors also use the default OslcClient() constructor which again trusts all client/server communications from all hosts over SSL. In addition, a client application that uses parameters for user ids and passwords this way is achieving no additional security over HTTP Basic while incurring the additional complexity and overhead of OAuth and its variants. This is because there's no independent step between the client and the server where the user gets a chance to decide if they want to provide their credentials in response to an authentication challenge - the client app just does it.

## Potential conclusion

With this analysis, it appears lyo.client doesn't support the recommended OSLC Core 3.0 approaches to authentication, and interacts  apps requiring JEE Form based or OAuth authentication without any SSL protections. 

I'm inclined to see if there's a way to leave the current lyo.client Java client API on Wink and create a completely new client API and sample apps using Jersey that does support SSL, Basic and OpenIDConnect properly, while being sufficiently open with the client configuration to support whatever the client application needs.

1. client-core would depends only on JAX-RS 2.0 and oslc-core
2. client-wink would be what we have now, unchanged
3. OSLC client applications that use client-core would provide whatever implementation of JAX-RS 2.0 they want, and configure it how they want
4. we will have two versions of the sample client applications, one that is unchanged and uses client-wink, and another that uses client-core and provide examples on how to use Jersey to create runnable code.

Any wink/jersey based client can work with any wink/jersey based server.
No client or server would need to support both wink and jersey

## New OSLC Client Design

- [x] Create two new maven projects, oslc4j-client and oslc4j-client-samples, based on the existing oslc-java-client and oslc-java-samples projects, but implemented using JAX-RS 2.0 and not using Wink.

- [x] Revert the existing oslc-java-client and oslc-java-samples changes back to their 2.4.0 master, and leave these implemented on oslc4j-wink.

Both of these compile and run against oslc4j-cm-sample. So other than duplicate code, these two different implementations of an Lyo Java client for OSLC both work and accomplish our goals to:

1. keep the old oslc-java-client built on Wink untouched for existing Java client applications that don't want to migrate to JAX-RS 2.0
2. have a Java client that is simpler, based on JAX-RS 2.0, with no Wink dependencies, and provides more flexible client application configuration for secure access (SSL) and authentication (Basic, OpenIDConnect, JEE Form)
3. build both clients in OSLC4J 4.0.0 and beyond.


## FAQs

**Q: I get a WebApplicationException before the request is sent to the server.**

A: Most likely, Lyo failed to serialise your resources properly. Check that all non-LocalResource classes have a URI assigned. If you are creating a new resource by POSTing to the CreationFactory endpoint, you can generate a URN based on a random UUID.