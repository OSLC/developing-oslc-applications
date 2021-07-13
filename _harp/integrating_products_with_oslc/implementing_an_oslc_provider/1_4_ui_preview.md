# Providing UI Previews

Once you establish relationships between resources using links, you can enable a very useful form of integration known as [UI Preview](https://open-services.net/resources/oslc-primer/#ui-preview). When a user is viewing a resource in a web browser, they might see a list of links to related resources that are in another application. UI Preview makes it easy for them to learn about those resources in context and without leaving the web page that they are looking at. When users “hover” over a link with their mouse or focus on it, they can see a brief preview of that resource in a tool-tip or a pop-up window. 

For all the details, see the [OSLC UI Preview specification](https://archive.open-services.net/bin/view/Main/OslcCoreUiPreview.html). (Don’t worry; this one is pretty short.)

In this section, we’ll explore how to make our Bugzilla Adapter into a provider of UI Previews. When a user sees a link to Change Requests, they can see a UI Preview as long as the application that is displaying that link is a UI Preview Consumer. Later in this tutorial, you’ll be able to see your UI Preview in the NinaCRM application, because NinaCRM will support UI Preview as a Consumer.


## Add UI Preview handling to the BugzillaChangeRequestService class

In the [previous section](1_3_intro_to_oslc4j) we explored how the **BugzillaChangeRequestService** class handles requests for collections of __BugzillaChangeRequests__ or individual __BugzillaChangeRequests__.

To add UI Preview support, we will add two methods to the service:

1. Provide an OSLC Compact Representation of a __BugzillaChangeRequest__. 
2. Provide what is known as a small HTML preview of a __BugzillaChangeRequest__.


### Provide the compact XML representation of a Bugzilla bug

Open the file `BugzillaChangeRequestService.java` in the **org.eclipse.lyo.oslc4j.bugzilla.servcies** package and find the `getCompact()` method.

Note the `@Produces` annotation:

    @Produces({OslcMediaType.APPLICATION_X_OSLC_COMPACT_XML})

As with other media types, OSLC4J will handle serialization to the correct media types.

The method first fetches the bug and converts it to a BugzillaChangeRequest:

    final Bug bug = BugzillaManager.getBugById(httpServletRequest, changeRequestId);
    
Then, it copies the "About" and "Title" attributes:

    compact.setAbout(getAboutURI(productId + "/changeRequests/" + changeRequest.getIdentifier()));
    compact.setTitle(changeRequest.getTitle());
    
Then to help identify the source of the bug, we add the Bugzilla icon (from the server) to our compact representation:

    String iconUri = BugzillaManager.getBugzillaUri() + "/images/favicon.ico";
    compact.setIcon(new URI(iconUri));
    
Now we’ll build two Preview objects, `smallPreview` and `largePreview`, and pointers to the `smallPreview()` and `largePreview()` services in **BugzillaChangeRequestService**:

	//Create and set attributes for OSLC preview resource
	final Preview smallPreview = new Preview();
	smallPreview.setHintHeight("11em");
	smallPreview.setHintWidth("45em");
	smallPreview.setDocument(new URI(compact.getAbout().toString() + "/smallPreview"));
	compact.setSmallPreview(smallPreview);

	//Use the HTML representation of a change request as the large preview as well
	final Preview largePreview = new Preview();
	largePreview.setHintHeight("20em");
	largePreview.setHintWidth("45em");
	largePreview.setDocument(new URI(compact.getAbout().toString() + "/largePreview"));
	compact.setLargePreview(largePreview);

And finally return the compact XML:

	return compact;

As with many other methods, we needed to create the Compact and Preview objects and then let OSLC4J take care of serializing them to RDF.

#### Viewing the compact XML representation of a bug.

The following assumes the Bugzilla adapter is running at `localhost:8080/OSLC4JBugzilla`

In Firefox or Chrome, open the Poster plugin.

for the __URL__ field, type the URL for a single bug:

    http://localhost:8080/OSLC4JBugzilla/services/{productId}/changeRequests/{bugId}

For example, with a product ID of **1** and a bug ID of **10**:

    http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests/10

For the __User Auth__ fields, type your Bugzilla username and password.

On the Headers tab, for the **Name** type `Accept` and for the **Value** type the following:

    application/x-oslc-compact+xml

Then, click **Add/Change** to add the `Accept` header.

Click **Get** to execute the HTTP GET method and you should receive OSLC compact XML representation of the bug. Examine the output to see how the `oslc:smallPreview` and `oslc:largePreview` resources are defined in the `oslc:Compact` resource.

If a consumer application wants to display a small or large preview of a **BugzillaChangeRequest**, the application can find the URLs to them using this `x-oslc-compact+xml` representation.

Now, let's set up the HTML for these previews.

### Creating a method and JSP template for UI Previews 

In the last section, the `getCompact()` method in the **BugzillaChangeRequestService** created preview resources pointing to `changeRequests/{id}/smallPreview` and `changeRequests/{id}/largePreview`.

Open the file `BugzillaChangeRequestService.java` in the **org.eclipse.lyo.oslc4j.bugzilla.servcies** package and find the `smallPreview()` method:

	@GET
	@Path("{changeRequestId}/smallPreview")
	@Produces({ MediaType.TEXT_HTML })
	public void smallPreview(@PathParam("productId")       final String productId,
							 @PathParam("changeRequestId") final String changeRequestId) throws ServletException, IOException, URISyntaxException
	{
		// Method code here
	}

The `smallPreview()` method first fetches the bug and converts it to a **BugzillaChangeRequest**:

    final Bug bug = BugzillaManager.getBugById(httpServletRequest, changeRequestId);

Then, it sets some attributes and dispatches a JSP:

    BugzillaChangeRequest changeRequest = BugzillaChangeRequest.fromBug(bug);

    changeRequest.setServiceProvider(
      ServiceProviderCatalogSingleton.getServiceProvider(
        httpServletRequest, 
        productId).getAbout());
	changeRequest.setAbout(getAboutURI(productId + "/changeRequests/" + changeRequest.getIdentifier()));

	final String bugzillaUri = BugzillaManager.getBugzillaUri().toString();
	httpServletRequest.setAttribute("changeRequest", changeRequest);
	httpServletRequest.setAttribute("bugzillaUri", bugzillaUri);

	RequestDispatcher rd = httpServletRequest.getRequestDispatcher("/cm/changerequest_preview_small.jsp");
	rd.forward(httpServletRequest,httpServletResponse);
	
Now, let's look at that JSP template. Open the file `/src/webapp/cm/changerequest_preview_small.jsp` in **org.eclipse.lyo.oslc4j.bugzilla** and browse the contents. The code near the top extracts the fields we want from the Change Request:

	<%
	BugzillaChangeRequest changeRequest = (BugzillaChangeRequest)request.getAttribute("changeRequest");
	String bugzillaUri = (String) request.getAttribute("bugzillaUri");

	Date createdDate = (Date) changeRequest.getCreated(); 
	SimpleDateFormat formatter = new SimpleDateFormat();
	String created = formatter.format(createdDate);
	Date modifiedDate = (Date) changeRequest.getModified();
	String modified = formatter.format(modifiedDate);

	Person assigneePerson = (Person) changeRequest.getContributors().get(0);
	String assignee = "Unknown";
	if (assigneePerson != null)
		assignee = assigneePerson.getMbox();
	%>
	
Then those fields are output in a small table:

	<table class="edit_form">
		<tr>
			<th>Status:</th>
			<td><%= changeRequest.getStatus() %></td>
			<th>Product:</th>
			<td><%= changeRequest.getProduct() %></td>
		</tr>
	
		<tr>
			<th>Assignee:</th>
			<td><%= assignee %></td>
			<th>Component:</th>
			<td><%= changeRequest.getComponent() %></td>
		</tr>
	
		<tr>
			<th>Priority:</th>
			<td><%= changeRequest.getPriority() %></td>
			<th>Version:</th>
			<td><%= changeRequest.getVersion() %></td>
		</tr>
	
		<tr>
			<th>Reported:</th>
			<td><%= created %></td>
			<th>Modified:</th>
			<td><%= modified %></td>
		</tr>
	</table>
	
The method `largePreview()` works in a similar manner and uses the JSP template `changerequest_preview_large.jsp`.

#### Viewing the UI preview

With the adapter running, in a web browser navigate to the following URL:

    http://localhost:8080/OSLC4JBugzilla/services/{productId}/changeRequests/{bugId}/smallPreview
    
For example, with a product ID of **1** and a bug ID of **10**:

    http://localhost:8080/OSLC4JBugzilla/services/1/changeRequests/10/smallPreview
    
You should see a small table with details about the bug, similar to this:

![A small table of information about a bug in the browser](http://open-services.net/uploads/resources/uipreview-html.png)

Now, given a URI link to a resource, we can provide some human-readable and usable presentations for that link, including a quick peak into the Bug using UI Preview. Later in this tutorial we'll explore how other applications can discover and display these previews.

[Next: Part 1.5, UI Selection](1_5_ui_selection)
