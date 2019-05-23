# Providing a creation factory 

With OSLC you can [allow people to create bugs via Delegated UI](1_6_ui_creation/); however, like all UI approaches, an actual human user must be involved. What if you want to support automated bug creation; for example, enabling a build server to automatically create a bug whenever there is a test or a build failure? 

To allow clients to create new bugs automatically, you need to support an [OSLC Creation Factory](https://archive.open-services.net/bin/view/Main/OslcCoreSpecification.html#Creation_Factories) as described in the [OSLC Core specification](https://archive.open-services.net/bin/view/Main/OslcCoreSpecification.html). 



## Adding a method to the adapter to create BugzillaChangeRequests via HTTP POST

Recall that when we created a delegated UI for creating new bugs, we wrote code in the **BugzillaManager** class to use the **j2bugzilla** API for creation of bugs; we’ll re-use the `createBug()` method for automated bug creation via POST.

### Adding the Creation Factory to Service Provider documents

Open the file `BugzillaChangeRequestService.java` in the **org.eclipse.lyo.bugzilla.services** package.

First search for the `@OslcCreationFactory` annotation: 

    @OslcCreationFactory
    (
      title = "Change Request Creation Factory",
      label = "Change Request Creation",
      resourceShapes = {OslcConstants.PATH_RESOURCE_SHAPES + "/" + Constants.PATH_CHANGE_REQUEST},
      resourceTypes = {Constants.TYPE_CHANGE_REQUEST},
      usages = {OslcConstants.OSLC_USAGE_DEFAULT}
    )

Notice that we've specified a `resourceShapes` location; we'll cover that in more detail below.

As with our other services, OSLC4J uses this annotation and automatically adds the URI for the creation factory to our XML and JSON Service Provider documents. (You will have to manually add it to the `serviceprovider_html.jsp` template to add it to the HTML representation.)

Because we haven't set any different path, the creation factory will be available at the root path of our **BugzillaChangeRequestService** class which is `{productId}/changeRequests`. For example, if your adapter is running at `localhost:8080` and the product ID is `1`, the creation factory will be at the following URL:

    http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests

Our adapter recognizes that you are invoking the Creation Factory (instead of requesting a listing of bugs) if you request that URL using HTTP POST (instead of GET).  



### Handling BugzillaChangeRequests received via POST

In `BugzillaChangeRequestService.java`, search for the the `addChangeRequest()` method. Note the JAX-RS annotations:

    @POST
    @Consumes({OslcMediaType.APPLICATION_RDF_XML, OslcMediaType.APPLICATION_XML, OslcMediaType.APPLICATION_JSON})
    @Produces({OslcMediaType.APPLICATION_RDF_XML, OslcMediaType.APPLICATION_XML, OslcMediaType.APPLICATION_JSON})

The `@Consumes` annotation indicates that the method accepts a **BugzillaChangeRequest** in RDF/XML, XML, or JSON format; the `@Produces` annotation indicates that it will return the same.

The following code in the `addChangeRequest()` method creates a new Bugzilla bug from an OSLC **BugzillaChangeRequest** object (using the previously discussed `createBug()` method)::

    final String newBugId = BugzillaManager.createBug(httpServletRequest,
                            changeRequest, productId);     

Next, we convert the bug into a **BugzillaChangeRequest**:

    final Bug newBug = BugzillaManager.getBugById(httpServletRequest,
                       newBugId);
        
    BugzillaChangeRequest newChangeRequest;

    try {
      newChangeRequest = BugzillaChangeRequest.fromBug(newBug);
    } catch (Exception e) {
      throw new WebApplicationException(e);
    }

Then we return the new **BugzillaChangeRequest** as the body of a POST response:

    URI about = getAboutURI(productId + "/changeRequests/" + newChangeRequest.getIdentifier());
    newChangeRequest.setServiceProvider(
      ServiceProviderCatalogSingleton.getServiceProvider(httpServletRequest, productId).getAbout());
    newChangeRequest.setAbout(about);
    setETagHeader(getETagFromChangeRequest(newChangeRequest), httpServletResponse);

    return Response.created(about).entity(changeRequest).build();

Note that we set the `Location` header (via `Response.created()`) to the `about` URI for the new **BugzillaChangeRequest**; this is a SHOULD requirement of [the Core specification](http://open-services.net/bin/view/Main/OslcCoreSpecification#Creation_Factories).

### Try it out!

If you can create new bugs on your Bugzilla application, you should be able to create a bug via HTTP to our adapter.

1. In Firefox or Chrome, open the **Poster** plugin.
2. In the **URL** field, type the URL for the Creation Factory (replace {ProductID} with a valid ID for a Bugzilla product):
    
        http://oslc:8080/OSLC4JBugzilla/services/1/changeRequests
3. In the **User Auth** fields, type your Bugzilla username and password.
4. On the **Headers** tab, for the **Name** type `Content-Type` and for the **Value** type `application/rdf+xml`
5. In the **Body** field enter the following example RDF/XML content. Change `you@example.com` to reflect your Bugzilla login/email; you might have to change some values depending on how your Bugzilla product has been configured, specifically `bugz:operatingSystem` and `bugz:component`.
		 
		 <rdf:RDF
		   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
		   xmlns:oslc="http://open-services.net/ns/core#"
		   xmlns:bugz="http://www.bugzilla.org/rdf#"
		   xmlns:foaf="http://xmlns.com/foaf/0.1/"
		   xmlns:dcterms="http://purl.org/dc/terms/"
		   xmlns:oslc_cm="http://open-services.net/ns/cm#">

		   <oslc_cm:ChangeRequest>
			 <bugz:operatingSystem>Linux</bugz:operatingSystem>
			 <rdf:type rdf:resource="http://open-services.net/ns/cm#BugzillaChangeRequest"/>
			 <oslc_cm:status>NEW</oslc_cm:status>
			 <bugz:priority>---</bugz:priority>
			 <dcterms:title>New bug entered from OSLC Adapter</dcterms:title>
			 <bugz:version>unspecified</bugz:version>
			 <bugz:platform>PC</bugz:platform>
			 <dcterms:contributor>
			   <foaf:Person rdf:about="http://oslc:8080/OSLC4JBugzilla/person?mbox=you%40example.com">
				 <foaf:mbox>you@example.com</foaf:mbox>
			   </foaf:Person>
			 </dcterms:contributor>
			 <bugz:component>Server</bugz:component>
			 <oslc_cm:severity>Unclassified</oslc_cm:severity>
		   </oslc_cm:ChangeRequest>
		 </rdf:RDF>
6. Click **Post** to execute the HTTP POST method. You should receive a **201 Created** status header and the response body should contain the RDF/XML **BugzillaChangeRequest** representation of the new bug.



## Providing a ResourceShape document

To make it possible for client programs to automatically determine which BugzillaChangeRequest fields are required and the allowed values for those fields, we should provide a [Resource Shape](https://open-services.net/resources/oslc-primer/#resourceshapes) for every creation factory.

[Resource Shapes](http://archive.open-services.net/bin/view/Main/OslcCoreSpecification?sortcol=table;table=up#Overview) are descriptive documents that define the set of OSLC Properties expected in a resource for specific operations (i.e. creation, update or query) along with the value types, allowed values, cardinality and optionality of each OSLC property. A client can use this information when creating new resources.

Fortunately, OSLC4J automates the creation of Resource Shape documents from our existing description of a **BugzillaChangeRequest**. All we must do is declare the location in our `@OslcCreationFactory` annotation:

    resourceShapes = {OslcConstants.PATH_RESOURCE_SHAPES + "/" + Constants.PATH_CHANGE_REQUEST}

Which indicates the resource shape will be located at the URI `resourceShapes/changeRequest`. For example if your Bugzilla adapter is running at `localhost:8080`, the Resource Shape will be available at this URL:

    http://localhost:8080/OSLC4JBugzilla/services/resourceShapes/changeRequest

You can open <http://localhost:8080/OSLC4JBugzilla/services/resourceShapes/changeRequest> in a browser to view the Resource Shape as an RDF/XML document. (You can also use the Poster plugin with an `Accept` header of `application/json` to retrieve it in JSON format.)

Note that the document includes not only OSLC CM properties such as `relatedChangeRequest` or `inprogress`, but also Bugzilla-specific properties like `priority` and `version`; this indicates it was assembled from our **BugzillaChangeRequest** class.

Because these documents are not really meant to be human-readable, you don't have to build a HTML representation in a JSP template as we have for other resources.


## Wrapping up

Our Bugzilla adapter now allows Bugzilla to be a reasonably complete OSLC CM provider application. In the next section, we'll take a different application (NinaCRM) and extend it to be an OSLC consumer that can take advantage of all the work we've done here.

[Next: Part 2, Implementing Consumer](../integrating_with_an_oslc_provider/2_0_implementing_consumer)
