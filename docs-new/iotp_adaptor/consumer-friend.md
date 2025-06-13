Integration between jazz.net apps and iotp-adaptor requires an established, authenticated communication between the Jazz Team Server that hosts the lifecycle management applications and the iotp-adaptor OSLC server. This relationship between the two servers is called a friend relationship. It indicates that the requests coming from the servers can be trusted, and the two servers can communicate with each other. 

By creating this friend relationship and associating project areas, you can link tasks, defects, stories, or requirements from the lifecycle management applications with IoT Platform artifacts. To establish the friend relationship between Jazz Team Server and the connector, you must log in to Jazz Team Server with an account that has Jazz Project Administrator privileges.

## Adding A Friend

[The User Guide](./userGuide/administration) documents how to add a friend to the jazz.net consumer apps to the iotp-adaptor server. Adding a friend requires the URL to the iotp-adaptor rootservices document. This URL must be known to the user and is typically `https://server:port/rootservices`. 

An administrator opens the jazz.net server admin page, typically the Jazz Team Server (JTS), and adds a friend providing the iotp-adaptor server rootservices URL.  The JTS uses the OAuth1.0a URLs in the rootservices document to know what authentication scheme to use. The administrator specifies the OAuth secret and the server generates the consumer key. The authentication is completed by having an admin of the iotp-adaptor server accept the provisional key which completes the OAuth authentication sequence. 

The jazz.net apps and the iotp-adaptor can now communicate using OAuth tokens.

## OAuth Implementation

The OAuth implementation used by iotp-adaptor is provided by eclipse/Lyo. There are four Maven projects in [https://github.com/eclipse/lyo.server](https://github.com/eclipse/lyo.server) that implement the OAuth support. 

1. oauth-consumer-store - an implementation of an encrypted consumer store for OAuth tokens. This is where consumer keys created when the iotp-adaptor server is added as a friend to the jazz.net consumer apps
2. oauth-core - the OSLC4J implementation of OAuth1.0a
3. oauth-test - test cases for the OAuth implementation
4. oauth-webapp - a JEE web application that Lyo Designer uses to provide needed user interaction for OAuth authentication

Lyo Designer generates the Application.java OslcWinkApplication file, but does not by default include OAuth support. You have to add it in the user code inside the static initializer in Application class.

```
// Start of user code Custom Resource Classes
// OAuth service and Swagger.io service
try {
	RESOURCE_CLASSES.add(Class.forName("org.eclipse.lyo.server.oauth.webapp.services.ConsumersService"));
	RESOURCE_CLASSES.add(Class.forName("org.eclipse.lyo.server.oauth.webapp.services.OAuthService"));
	RESOURCE_CLASSES.add(io.swagger.jaxrs.listing.ApiListingResource.class);
	RESOURCE_CLASSES.add(io.swagger.jaxrs.listing.SwaggerSerializers.class);
	} catch (ClassNotFoundException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
// TRS service	
RESOURCE_CLASSES.add(TrackedResourceSetService.class);

 // trigger Jena init
 ModelFactory.createDefaultModel();
 // force plain XML writer
 RDFWriterFImpl.alternative(null);
// End of user code
```
This add additional services to your Web app in order to support OAuth1.0a. The OAuth classes need to be added using the Class.ForName method instead of through imports because they are defined in a separate, reusable Web application WAR file, not a Java JAR file.

This dependency in the iotp-adaptor pom.xml file causes the oauth-webapp to be merged with the iotp-adaptor app when the user does a maven install.
```
<dependency>
    <groupId>org.eclipse.lyo.server</groupId>
    <artifactId>oauth-webapp</artifactId>
    <version>${lyo.version}</version>
    <type>war</type>
</dependency>
```

