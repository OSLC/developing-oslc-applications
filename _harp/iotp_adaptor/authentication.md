Authentication is used to allow a client to make requests of a server, or to enable servers to interact after approval by an administrator. The jazz.net CE applications establish client/server communication in 2 steps:

1. Creating a relationship at the application/server level ("friendship" or consumer-provider/client-server relationship), which enables the two applications to communicate, and 
1. Creating associations at the project area level, which specifies for an individual project which projects on other servers it can access. 

Project area associations are used to establish connections between service providers to enable access through OSLC. These associations are primarily used for creation and selection dialogs, and resource preview, providing the OSLC discovery information the clients need to get the creation and selection dialog URLs, the queryBase URL, etc. This important topic is covered in [Artifact Container Associations](./artifact-container-associations). 

This section deals with authentication in the context of integrating an OSLC server with the jazz.net apps.

Here are some useful links:
* [Jazz Server Authentication Explained](https://jazz.net/library/article/75)
* [Jazz Foundation Core Security](https://jazz.net/wiki/bin/view/Main/JFSCoreSecurity#User_Authentication)
* [Authentication of a native client with a Jazz-based application](https://jazz.net/wiki/bin/view/Main/NativeClientAuthentication)
* [Native Client Authentication](https://jazz.net/wiki/bin/view/Main/NativeClientAuthentication)
* [User Authentication for Applications Written with the JAF SDK](https://jazz.net/wiki/bin/view/Main/JAFSdkDelegatingAuth#OAuth)

# Authentication

OSLC servers that wish to integrate with the jazz.net apps should support connections with CE version 5.0.2 as well as 6.x. [5.0.2 is the release designated for longer-term support, don't think you need to support earlier ones.] Therefore you should consider support for OAuth 1.0a. CE clients will need to assume OAuth 1.0a, and establish the friend relationships using consumer keys provided by your OSLC adaptor/server.

A client or consumer (including OSLC servers acting as clients) - i.e. the application/server making requests like GET, PUT, POST, etc - requires a special consumer key and a "secret" to include with requests in order to authenticate with the server providing the request result.
 
In the CE applications, there are 2 alternatives to establish the friendship:

1) On the server/provider side, the admin creates a consumer key and associated secret.  On the client/consumer side, the admin adds the server/provider as a friend, specifying the key and secret.  A server might use a different consumer key for each unique client relationship, or it might use the same key for multiple clients. 

2) The client app adds the server/provider as a friend, which may create a provisional consumer key and secret. The server (admin) then accepts the provisional consumer key to complete the friendship and authenticate requests from that client. This simplifies the creation of the friend relationship and the required consumer key into more or less a single step.  

A friend is an application or a Jazz Team Server to which this application is allowed make outbound requests, in order to consume the services provided by the friend. That is, the friend is a server providing an accepted consumer key for which this application can be an authenticated client.

When a client app has a friend relationship to a server app, it can make requests of that server app, utilizing the agreed upon consumer key for request authentication. These requests are directional - the consumer is the client making the request, and the friend app that provided the consumer key is the server responding to the request. That means the friend/client can make OSLC creation/selection dialog request, can query resources or get resource previews of resources managed by the server with the consumer key.

## What about backlinks? 

if RDNG provides a consumer key for RTC, and RTC has a friend relationship to RDNG using that consumer key [i.e. RTC is an "incoming consumer/client" for DNG], you could create a link from an RTC WorkItem to an RDNG Requirement. But (in a non-config context) this would generally result in a backlink being created in the RDNG Requirement to the RTC WorkItem. 

If RDNG does not have a friend relationship with RTC (and RTC therefore provides no consumer key for RDNG), can this backlink still be created? The backlink is created by doing a POST or PUT from RTC to RDNG, which is fine because RTC has the friend relationship and can make the request with the proper consumer key.

But what can you do with that link in RDNG? Can it be navigated? Does it support resource preview? The link will show up in RDNG as a URL without resource preview, but you can click on the link and navigate to RTC as RTC will redirect the GET on the URL to its web application (if there is no Accept header). Authentication in this case is addressed by the user login, not consumer keys. 

Configuring OAuth consumers enables websites or applications (consumers) to access protected resources from a web server (provider) through an API that does not require users to disclose their their service provider credentials to the consumers. The server provides the consumer key which is used by clients to provide authentication tokens for their requests.

In the Web server, create a consumer (inbound) key that can be used to allow consumer applications to access this server.

Adding a friend relationship allows you to specify other OSLC servers with which you want to establish client-to-server communication. Enter the location information of another Jazz Team Server or CLM application and a code phrase to use as the OAuth secret. Then request access to that server to create an OAuth consumer key and store the information in the friends list. After the OAuth key is authorized by the other server, this server will be able to interact with the other Jazz Team Server or CLM application.

All communication between the CE apps and CE4IoTConnector server is one way. The links are all owned by the CE apps, and the CE4IoTConnector is a server providing target resources for those links. The CE4IoTConnector is never a client of any of the CE apps and cannot store any links to resources in those apps.
 
CE4IoTConnector needs to be able to provide consumer keys for the CE friend apps. This could be done with a single consumer key that is created by the administrator and used for all client/friend apps. Or the client apps could create provisional keys when creating the friend connection, and these could be automatically accepted and stored in the CE4IoTConnector server's keystore.

# CredentialsFilter and Session Management

# IoT Platform Login



# OAuth Authentication

OAuth authentication is used to allow a client (Oauth consumer) to make requests of a server (OAuth service provider) without exposing the user’s server credentials to the client. A server may also act as a client to other servers when linking across OSLC servers. The authentication is established by adding a Friend relationship to the consuming sever so that the consumer can utilize a consumer key and secret to establish an OAuth connection between the client and sever in order to communicate with the providing friend server. 

Project area associations are used to establish connections between OSLC service providers to enable access through OSLC. These associations are primarily used for creation and selection dialogs, and resource preview, providing the OSLC discovery information the clients need to get the creation and selection dialog URLs, the queryBase URL, etc.

OAuth Server-to-Server Authentication

An OSLC server may need to support connections with CE versions prior to 6.0. To do so they would need to support OAuth 1.0a. CE clients should assume OAuth 1.0a, and establish the friend relationships using consumer keys provided by the CE4IoTConnector server.

 Establishing the consumer/friend relationship requires access to a jazz.net root services document that provides the following URLs the friend server is expected to support for OAuth authentication:
    <jfs:oauthRealmName>Server Provider’s Realm</jfs:oauthRealmName>
    <jfs:oauthDomain>https://ce4iot.rtp.raleigh.ibm.com:9443/iotp</jfs:oauthDomain>
    <jfs:oauthRequestConsumerKeyUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/iotp/services/oauth/requestKey" />
    <jfs:oauthApprovalModuleUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/iotp/services/oauth/approveKey" />
    <jfs:oauthRequestTokenUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/iotp/services/oauth/requestToken"/>
    <jfs:oauthUserAuthorizationUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/iotp/services/oauth/authorize" />
    <jfs:oauthAccessTokenUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/iotp/services/oauth/accessToken"/>

This information provides the jazz-based consumer app with the information it needs to execute the OAuth authentication sequence, and provides the service provider consumer key and secret needed to start the sequence.

A server can create a consumer key that can be used by clients to make requests of that server. A server might use a different consumer key for each unique client connection, or it might allow the same key to be used by multiple clients.

Consumer keys can have an associated functional user id. If they do, client applications can access protected resources using an Authorization OAuth header containing the consumer key and secret. The functional user’s credentials and licenses are automatically used. This is not the recommended approach however because all client/server interaction would be based on a single functional user, not the user actually using the system. See OAuthClient.java for an example.

A client (including OSLC servers acting as clients) needs to create a friend relationship with a server it wants to access, and needs a consumer key that can be used to authenticate those requests.

CE apps provide a convenience for creating consumer/friend relationships. A client app can create a friend with a provisional consumer key. The server can then choose to accept the provisional consumer key as a consumer key for authenticating requests from that client. This simplifies the creation of the friend relationship and the required consumer key into more or less a single step.

When a client app has a friend relationship to a server app, it can make requests of that server app, utilizing the agreed upon consumer key and secret for request authentication. These requests are directional - the friend is the client making the request, and the app with the consumer key is the server responding to the request. That means the friend/client can make OSLC creation/selection dialog request, can query resources or get resource previews of resources managed by the server with the consumer key.

Configuring OAuth consumers enables websites or applications (consumers) to access protected resources from a web server (service provider) through an API that does not require users to disclose their their service provider credentials to the consumers. The server provides the consumer key which is used by clients to provide authentication tokens for their requests.

In the Web server, create a consumer (inbound) key that can be used to allow consumer applications to access this server.

Adding a friend relationship allows you to specify other Jazz-based servers with which you want to establish client-to-server communication. Enter the location information of another Jazz Team Server or CLM application and a code phrase to use as the OAuth secret. Then request access to that server to create an OAuth consumer key and store the information in the friends list. After the OAuth key is authorized by the other server, this server will be able to interact with the other Jazz Team Server or CLM application.

All communication between the CE apps and an OSLC server is one way. The links may be all owned by the CE apps, and the OSLC server is a server providing those links. The OSLC server may not be a client of any of the CE apps and need not store any links to resources in those apps.
 
An OSLC server will need to be able to provide consumer keys for the CE friend apps. This could be done with a single consumer key that is created by the administrator and used for all client/friend apps. Or the client apps could create provisional keys when creating the friend connection, and these could be automatically accepted and stored in the OSLC server, perhaps in encrypted in an OAuth keystore.

To determine how your OSLC server needs to interact with the CE apps, explore the connection between RDNG and RTC, and duplicate that.

RTC server provides a consumer key for client/friend RDNG - RNDG can create links to RTC work items. The consumer/friend relationship allows the servers to communicate but the ability to consume is directional.

See Oauth and OSLC in Apple notes.

IBM Add OAuth authentication support to HttpClient 
OAuth Core 1.0 Revision A
https://oauth.net/1/ 
https://javadocs.nightly.sakaiproject.org/net/oauth/client/OAuthClient.html 
https://phkrief.wordpress.com/2010/09/15/jazz-form-based-authentication/ 
https://jazz.net/wiki/bin/view/Main/NativeClientAuthentication 
https://oauth.net/core/1.0/ 

OAuth JavaDoc
net.oauth
net.oauth.client
net.oauth.http
net.oauth.server
net.oauth.signature
net.oauth.signature.pem

OAuth provides an authentication mechanism for a consumer to access a service without exposing the user’s service credentials to the consumer application.

Service Provider: A web application that allows access via OAuth.
User: An individual who has an account with the Service Provider.
Consumer: A website or application that uses OAuth to access the Service Provider on behalf of the User.
Protected Resource(s): Data controlled by the Service Provider, which the Consumer can access through authentication.
Consumer Developer: An individual or organization that implements a Consumer.
Consumer Key: A value used by the Consumer to identify itself to the Service Provider.
Consumer Secret: A secret used by the Consumer to establish ownership of the Consumer Key.
Request Token: A value used by the Consumer to obtain authorization from the User, and exchanged for an Access Token.
Access Token: A value used by the Consumer to gain access to the Protected Resources on behalf of the User, instead of using the User's Service Provider credentials.
Token Secret: A secret used by the Consumer to establish ownership of a given Token.
OAuth Protocol Parameters: Parameters with names beginning with oauth_.

Consumer uses a Consumer Key and Consumer Secret to authenticate the Consumer with the Service Provider in order to provide access the service, instead of using a User’s credentials directly. 

OAuth defines three request URLs:

Request Token URL: The URL used to obtain an unauthorized Request Token, described in Section 6.1.
User Authorization URL: The URL used to obtain User authorization for Consumer access, described in Section 6.2.
Access Token URL: The URL used to exchange the User-authorized Request Token for an Access Token, described in Section 6.3.

The three URLs MUST include scheme, authority (host), and path

Service Provider:
* enable Consumer Developers to establish Consumer Key and Consumer Secret - jazz.net apps provide an admin page where an administrator can create trusted consumer keys with a secret and functional user id.
* The URLs the Consumer will use when making OAuth requests, and the HTTP methods (i.e. GET, POST, etc.) used in the Request Token URL and Access Token URL. - specified in Jazz Root Services Specification
* Signature methods supported by the Service Provider.
* Any additional request parameters that the Service Provider requires in order to obtain a Token. Service Provider specific parameters MUST NOT begin with oauth_.
* Sends OAuth response parameters in entity response body as encoded name=value pairs separated by &

Consumer:
* Must have access to a Consumer Key and Secret
* Must encode all parameter names and values
* Sends OAuth Protocol Parameters to the Service Provider in one of three methods:
    1. HTTP Authorization Header as defined in OAuth HTTP Authorization Scheme
    2. POST entity request body with content-type: application/x-www-form-urlencoded
    3. URL query parameters

Authorization Header:
		Authorization: OAuth realm="http://sp.example.com/",
               oauth_consumer_key="0685bd9184jfhq22",
               oauth_token="ad180jjd733klru7",
               oauth_signature_method="HMAC-SHA1",
               oauth_signature="wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D",
               oauth_timestamp="137131200",
               oauth_nonce="4572616e48616d6d65724c61686176",
               oauth_version="1.0"

Authenticating with OAuth

￼
Request Token: Used by the Consumer to ask the User to authorize access to the Protected Resources. The User-authorized Request Token is exchanged for an Access Token, MUST only be used once, and MUST NOT be used for any other purpose. It is RECOMMENDED that Request Tokens have a limited lifetime.

Access Token: Used by the Consumer to access the Protected Resources on behalf of the User. Access Tokens MAY limit access to certain Protected Resources, and MAY have a limited lifetime. Service Providers SHOULD allow Users to revoke Access Tokens. Only the Access Token SHALL be used to access the Protect Resources.

OAuth Authentication is done in three steps:
1. The Consumer obtains an unauthorized Request Token (which can only be used to obtain an Access Token.
2. The User authorizes the Request Token.
3. The Consumer exchanges the Request Token for an Access Token.

1. The consumer requests a temporary token for the OAuth handshake. This token is used to maintain the handshake session.
2. After validating the consumer, the service provider issues a short-term request token.
3. The consumer sends an HTTP redirect response to the user's browser and leads the user to the service provider for authorization.
4. The user reviews the authorization request and grants access to the consumer on the service provider site if he trusts the consumer.
5. The service provider confirms the authorization and sends an HTTP redirect response to the user's browser.
6. The user's browser is redirected to the consumer's callback URL, where the consumer can complete the remaining part of the handshake.
7. The consumer requests the access token from the service provider with a verifier passed in the previous step.
8. Upon successful validation, the service provider issues the access token to access the protected resources.
9. After the OAuth handshake completes, the access token is issued and the consumer can use the access token to access the protected resources on behalf of the user.
10. The service provider validates each incoming OAuth request and returns the protected resources if the consumer is authorized.1: Obtaining the Unauthorized Request Token

POST {Request Token URL}
Authorization: oauth_consumer_key="8c0bed7b2ed84de59473318d41cabf70", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1519939527", oauth_nonce="1733594657695709", oauth_version="1.0", oauth_signature="RDSO7oANUkxetv%2Ftkybzy2dUURI%3D"

oauth_signature is the Consumer Secret, encoded according to the oauth_signature_method.

The OAuth Bible

Signature - Request method & URL & parameters encrypted against a key consisting of consumer_secret & token_secret

Consumer Key - identifier generated by server 


Jazz Root Services Specification

Defines the OAuth service provider properties as defined in OAuth Core 1.0, section 4.1

jfs:oauthRequestTokenUrl
(optional) - provides this application's Request Token URL used to obtain an unauthorized Request Token (OAuth Core 1.0, section 6.1). To obtain a Request Token, the Consumer sends an HTTP POST request to the application's Request Token URL, passing OAuth Protocol Parameters by any of the methods described in OAuth spec, section 5.4.

jfs:oauthUserAuthorizationUrl
(optional) - provides this application's User Authorization URL used to obtain User authorization for Consumer access (OAuth Core 1.0, section 6.2). To obtain approval from the User, a client constructs the URL of an HTTP GET request to the application's User Authorization URL with parameters passed in the query part, and then opens the constructed URL via the User's web browser.

jfs:oauthAccessTokenUrl
(optional) - provides this application's Access Token URL used to exchange the User-authorized Request Token for an Access Token (OAuth Core 1.0, section 6.3). To request an Access Token, the Consumer sends an HTTP POST request to the application's Access Token URL, passing OAuth Protocol Parameters by any of the methods described in OAuth spec, section 5.2.

jfs:oauthRealmName
(optional) - provides this application's OAuth realm name. This string is used in the realm parameter of WWW-Authenticate and Authorization headers and to identify the protection space (see OAuth spec, section 5.4).

jfs:oauthDomain
(optional) - a comma-separated list of absolute-URIs, as specified in RFC 3986 - Uniform Resource Identifier (URI): Generic Syntax, that define the protection space. URIs in this list may refer to different servers. The client SHOULD use this list to determine the set of URIs for which the same authentication information may be sent: any URI that has a URI in this list as a prefix (after both have been made absolute) MAY be assumed to be in the same protection space.

OAuth discovery parameters in a typical JTS:

    <jfs:oauthDomain>https://ce4iot.rtp.raleigh.ibm.com:9443/jts,https://ce4iot.rtp.raleigh.ibm.com:9443/rm</jfs:oauthDomain>
    <jfs:oauthRealmName>Jazz</jfs:oauthRealmName>
    <jfs:oauthAccessTokenUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/oauth-access-token" />
    <jfs:oauthApprovalModuleUrl	rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/_ajax-modules/com.ibm.team.repository.AuthorizeOAuth" />
    <jfs:oauthExpireTokenUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/oauth-expire-token" />
    <jfs:oauthRequestConsumerKeyUrl	rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/oauth-request-consumer" />
    <jfs:oauthRequestTokenUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/oauth-request-token" />
    <jfs:oauthUserAuthorizationUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/oauth-authorize" />
    <jfs:jauthCheckAuthUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/jauth-check-auth" />
    <jfs:jauthCheckTokenUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/jauth-check-token" />
    <jfs:jauthIssueTokenUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/jauth-issue-token" />
    <jfs:jauthProxyUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/jauth-proxy" />
    <jfs:jauthRevokeTokenUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/jauth-revoke-token" />
    <jfs:jauthSigninUrl rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/jts/jauth-signin" />



OSLC4J OAuth Client

Uses Package net.oauth

https://wiki.eclipse.org/Lyo/BuildClient - section "Two-legged OAuthSample" describes how to run the OAuthClient sample.

Sample code of an OAuth implementation that is used to log on to the RM server is in the “Open Services for Lifecycle Collaboration Workshop” article at https://jazz.net/library/article/635. For details, see Example04.java.

Two-legged OAuth does not require an access token or a user to type in a password. You simply need the consumer key and consumer secret to sign the requests. Performing two-legged OAuth is generally preferable to storing a username and password on the client, although you should treat the consumer secret like it's a password.

1. Visit https://ce4iot.rtp.raleigh.ibm.com:9443/ccm/admin and add a consumer key, note the key and remember the secret - Note: the authorized key must have a functional user id.
2. Add the key and secret to oauth.properties
3. Run Java Application OAuthClient with argument: https://ce4iot.rtp.raleigh.ibm.com:9443/ccm/oslc/workitems/catalog

cd git/org.eclipse.lyo.client/org.eclipse.lyo.client.java.oauth.sample
mvn install
mvn exec:java -Dexec.mainClass="org.eclipse.lyo.client.oauth.sample.OAuthClient" -Dexec.args="https://ce4iot.rtp.raleigh.ibm.com:9443/ccm/oslc/workitems/catalog"

This sample application will use the OAuth consumer key and secret to access the RTC service provider catalog, a protected resource.