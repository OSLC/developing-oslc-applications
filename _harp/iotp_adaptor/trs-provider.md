# Implementing a TRS Provider

These are some notes I took implementing the iotp-adaptor TRS provider. These will evolve and get cleaned up over time, but I wanted to get something out as quickly as possible.

## TRS Resources


* The OSLC TRS specification is currently being migrated to OASIS.  Here are some useful resources:
* [TRS 2.0 Specification](http://open-services.net/wiki/core/TrackedResourceSet-2.0/) - this is being migrated to OASIS
* [Indexable Linked Data Provider 2.0](http://open-services.net/wiki/core/IndexableLinkedDataProvider-2.0/) - this was a proposed change to the TRS 2.0 specification to focus on LDP that was never completed. Its content is being incorporated into TRS 3.0
* [TRS 3.0 specification](https://tools.oasis-open.org/version-control/browse/wsvn/oslc-core/trunk/specs/trs/tracked-resource-set.html) (currently under development)
* eclipse/Lyo [TRS Reference Application](https://wiki.eclipse.org/Lyo/TRSReferenceApplication)
* [TRS Workshop](http://wiki.eclipse.org/Lyo/TRSWorkshop)
* [Building and running the TRS Adapter for Bugzilla sample](https://wiki.eclipse.org/Lyo/BuildTRS4JBugzilla)
* [TRS SDK Exploring the TRS ToolkitTRS Reference Application](https://wiki.eclipse.org/Lyo/TRSToolkit)
* [TRS reference application guided tour](https://wiki.eclipse.org/Lyo/TRSReferenceApplication) - describes the JAX-RS and generic servlet implementations
* [Bugzilla TRS Provider Example](https://wiki.eclipse.org/Lyo/BuildTRS4JBugzilla) - describes building and running the Bugzilla sample TRS provider
* [LQE Report Builder Integration for 3rd Party Applications](https://ibm.box.com/s/6j83j0948nalizq6y9puhlhynhe7t5kb) - describes the steps required configure a TRS provider to support access control, process filters and JRS Query Builder

# Configuring LQE to use iotp-adaptor TRS provider

See Setup Rational Engineering Lifecycle Manager, Lifecycle Query Engine, Jazz Team Server and Tracked Resource Set Provider for Bugzilla

Currently the TRS provider service is run in the credentials of the logged in user when the TRS URI: https://rlia4iot.raleigh.ibm.com:9443/iotp/services/trs. This is OK for testing, but is not sufficient for production. 

For production, we need functional IDs representing each TRS consumer. These should be provided in a config.properties file. Passwords will need to be encrypted. 

## Prerequisites Integrating with LQE

A TRS client that keeps the latest clone of a Tracked Resource Set is certainly implemented like a daemon and there is no chance to ask the user to submit credentials via login page. Consequently, OAuth communication code needs to be extended so that a Provider, and a Consumer (a TRS client), can communicate without user interaction (a.k.a. two-legged OAuth). 

### Create the rootservices document 

This is needed to bootstrap discovery for the jazz based apps.

/rootservices provides the roots services document required to create a friend relationship needed for LQE to be a Friend of the TRS provider. This document defines the TRS provider to the jazz-base apps.

Update the iotp-adaptor rootservices to provide additional TRS provider information:

    xmlns:trs2="http://open-services.net/ns/core/trs#"

    <trs2:TrackedResourceSet>
        <trs2:trackedResourceSet rdf:resource="https://ce4iot.rtp.raleigh.ibm.com:9443/iotp/services/trs" />
        <dc:title>TRS 2.0 for IoT Platform Resources</dc:title>
        <dc:description>TRS 2.0 feed for IoT Platform resources</dc:description>
        <dc:type     rdf:resource="http://open-services.net/ns/cm#" />
        <oslc:domain rdf:resource="http://open-services.net/ns/cm#" />
        <oslc:domain rdf:resource="http://open-services.net/ns/am#" />
    </trs2:TrackedResourceSet>

### Add a CredentialsFilter to handle OAuth Authentication

A CredentialsFilter class is used to manage the OAuth authentication between the consumer and friend applications, using the Lyo server oauth nested web app.

This is different than the CredentialsFilter I cloned from the BugzillaAdapter sample and the [TRS Workshop, 3 TRS Reference Application, TRS reference application guided tour](https://wiki.eclipse.org/Lyo/TRSSDK#TRS_Reference_Application) describes the code very nicely. The difference is this CredentialsFilter implements two-legged OAuth flow using validateTwoLeggedOAuthMessage(OAuthMessage) in the doFilter method. This allows LQE to authenticate with iotp-adaptor without provideing user credentials as long as a functional user id has been provided. This is an alternative approach that won't work for iotp-adapter because IoT Platform credentials are required to access the Watson IoT Platform. So the TRS provider can use the same CredentialsFilter that authenticates other OSLC requests. 

if the doFilter is  handling an two-legged OAuth request, it schecks to see if the token is blank to see if this is a two-legged oauth request. If it is, it validates the message:

```
// test if this is a valid two-legged oauth request
if ("".equals(message.getToken())) {
    validateTwoLeggedOAuthMessage(message);
    isTwoLeggedOAuthRequest = true;
}
```                                              

Assuming the message is valid, it proceeds as if it was not an oauth request and does a normal login with credentials provided by the user.

Use the same credentials you use to login to iotp-adaptor to approve provisional keys when creating the consumer/friend relationships.

There are other examples of AbstractAdapterCredentialsFilter in trs4j-bugzilla-sample, including one that supports multiple threads. These may be useful for iotp-adaptor


Two-legged OAuth

This is required so a TRS Provider (server), and a TRS Consumer (server), can communicate without user interaction.

A request by the “trusted” consumer is processed using a pre-defined user account (a.k.a. functional user). In the Bugzilla TRS adapter workshop, the user is admin user and is specified in bugz.properties file: root@localhost.here and passw0rd.
See CredentialsFilter.java in org.eclipse.lyo.oslc4j.bugzilla.servlet

The first authentication access is with a blank token which will be non-null, but will raise an OAuthProblemException because there will be no secret for that token. This is what the two-legged OAuth code needs to deal with.

Have to add this code to iotp-adaptor’s CredentialsFilter.

Two-headed authentication does not provide any credentials from the user’s session because the OAuth token is used for authentication, not credentials from the client.  This is why anything that uses OAuth must authenticate with some provided admin Id.

LQE authenticates with the iotp-adaptor (TRS) server using OAuth. However, this does not provide the admin credentials of the admin user who accepted the provisional key to iotp-adaptor. So when LQE makes a request for the base or change log resources, iotp-adaptor has no IoT Platform user credentials to use to login. So the request fails with 401.

Something has to provide IoT Platform credentials in order to access the iotp-adaptor TRS provider in order for LQE to read the TRS resources.

The trs4j-bugzilla-sample provides these credentials in the bugs.properties file. This would not be appropriate for iotp-adaptor. In CredentialsFilter.doFilter(), 

```
if (isTwoLeggedOAuthRequest) {
    connector = keyToConnectorCache.get("");
    if (connector == null) {
       credentials = BugzillaManager.getAdminCredentials();
       connector = getBugzillaConnector(credentials);
       keyToConnectorCache.put("", connector);
    }
} else {
   // ...
}
```

The credentials provided when accepting the provisional key are used to create the authenticated Bugzilla connector, and this is stored in the keyToConnectorCache for use by the TRS provider.

Hard-coding the id and password in the CredentialsFilter does allow the LQE connection to work and the TRS feed is recognized.

iotp-adaptor needs to access the credentials for establishing server-to-server connections using OAuth for the TRS provider from information stored in a config.properties file. This will require encrypting the password.

The RTC Java SDK has support for obfuscating passwords:

```
import com.ibm.team.repository.common.util.ObfuscationHelper;
ObfuscationHelper.encryptString(passwd) - in some main program.
   try {
      password = ObfuscationHelper.decryptString(("encodedPassword");
   } catch (UnsupportedEncodingException | GeneralSecurityException e) {
      // ignore decoding errors
   }
```

It would be unfortunate to have to depend on the RTC SDK though. Look for another solution. The encoder and decoder need to use the same key, and it must be hidden (in binary code).


## Integrating with JTS, LQE and RELM

LQE and RELM run in the JTS which requires a Friend authenticated with OAuth to the iotp-adaptor server. Then new Data Source can be configured in LQE to the iotp-adaptor TRS provider (described in the rootservices resource). LQE will now have the data form the IoT Platform as described by the provided resource shapes. RELM can also have a friend to iotp-adaptor so that resource preview can work on IoT Platform resources in the RELM views. RELM views can be created using the JTS query builder which also uses the provided IoT platform resource shapes.

### Add a Friend in JTS (for LQE and RELM) to the TRS provider server

LQE runs in the JTS and uses /jts/admin to add the friends. It is not a separate application like most of the other CE apps.

Goto the JTS server admin and add a Friend to the TRS provider server - same as any other friend. Provide the rootservices URI for the friend server, and authenticate and authorize the provisional key with JTS admin credentials. 

Server Admin: https://ce4iot.rtp.raleigh.ibm.com:9443/jts/admin
Root Services URI: https://ce4iot.rtp.raleigh.ibm.com:9443/iotp/rootservices

Make the friend Trusted to avoid any unnecessary dialogs.

## Configure an LQE data source from the TRS provider Friend

Open  https://ce4iot.rtp.raleigh.ibm.com:9443/lqe/web/admin/data-sources 
Click Manage Data Sources and then Add Data Source
Choose Root Services URL and enter the rootservices URL for the TRS provider:
https://ce4iot.rtp.raleigh.ibm.com:9443/iotp/rootservices

Select the desired TRS provider URL listed in the rootservices document.

Use the consumer key and secret for the Friend you added to to the JTS

Change any configuration that is necessary:

The test connection succeeds, as does updating the data source

Reindexing LQE data source succeeded, and the resources that couldn’t be read don’t exist and that’s fine. I have’t created them yet, especially in other organizations.

## Test the Integration

After the rebuild index is completed, use SPARQL to query LQE for the newly added data sources.
https://ce4iot.rtp.raleigh.ibm.com:9443/lqe/web/admin/home, click on the Query tab.
SPARQL Endpoint: https://ce4iot.rtp.raleigh.ibm.com:9443/lqe/sparql POST to this URL with a SPARQL query entity request body to get results.

https://ce4iot.rtp.raleigh.ibm.com:9443/lqe/web/query

Click the Query tab link.
Enter a query such as:

```
PREFIX dcterms: <http://purl.org/dc/terms/> 
PREFIX oslc_cm: <http://open-services.net/ns/cm#> 
SELECT ?resource ?title 

 WHERE { 
        ?resource 
                dcterms:identifier "TempCtrl" ; 
                dcterms:title ?title .
}
```
See [Steve Blog](https://clmpractice.org/2015/12/01/clm-6-x-improved-sparql-editor/) for lots of good information on RELM and LQE

## Integrating the TRS provider with RELM

If the TRS provider is also an OSLC resource preview provider, and iotp-adaptor is, you can add a Friend in RELM to the TRS provider so RELM can display resource preview of the resource properties it queries from LQE.

RELM and LQE both run inside the JTS, so the friend added to JTS to iotp-adaptor works for both.

https://ce4iot.rtp.raleigh.ibm.com:9443/relm/admin  

https://ce4iot.rtp.raleigh.ibm.com:9443/ccm/web/projects/Low%20Flow%20Washer%20(Change%20Management)#action=com.ibm.team.workitem.viewWorkItem&id=93

instanceShape set for IoT Platform resource has extra / after OSLC4JUtils.getServletURI():
        <oslc:instanceShape rdf:resource="https://localhost:9443/iotp/services//resourceShapes/iotDeviceType"/>


## Creating RELM Views for the TRS provider resources

RELM uses JRS query builder to build queries for views. So iotp-adaptor TRS Provider needs to implement LQE requirements for JRS providers in order for RELM views to work. We do not want users to have to use SPARQL or other low-level queries to create these views.

JRS requires two data sources:
process - project areas
the applications data sources

JRS doesn’t like instanceShapes. 
instanceShape is specific to that type in the process, not each individual resource.

# Implementing Support for JRS


See LQE Report Builder Integration for 3rd Party Applications for the specific requirements. 

TRS providers wishing to contribute data for JRS need to also publish "process resources" (such as project areas and service providers), artifact resources and resource shapes with their properties, and configurations.

LQE uses process resources with a separate TRS provider to manage the shapes. This separates shapes that usually don't change once they are read from other user resources that may be changing a lot. 

LQE uses the process TRS resources to identify the service providers, and to manage access control lists.

In general, you need to:

1. Publish your application’s data and metadata as tracked resource sets in tracked resource sets
    * Process resources, including project areas, service providers, and access context
    * Configurations, if you provide them
Resource shapes for each type, with all defined properties for that type
    * Data instance resources (which may be versioned)
2. For each kind of resource, provide the necessary metadata to include your resources and properties in Report Builder, including:
    * Access control, based on project area permissions
    * Merging of equivalent types and properties across projects, using resource shapes and external URIs
    * Localization into different languages, if needed
    * The ability to report on relationships in either direction

