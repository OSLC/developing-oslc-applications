# Providing a delegated UI for creating bugs

Providing [a delegated user interface (UI) dialog](https://archive.open-services.net/resources/tutorials/oslc-primer/delegated-user-interface-dialogs/) for creating new resources is similar to the process for providing one for selecting existing resources: we must  create an HTML Form, the fields within that form, and then set up the server-side handling of the form submission.

Here's the plan:

1. Add the location of our delegated UI to our Service Provider representations
1. Create a utility method that accepts a **BugzillaChangeRequest** and creates a bug in Bugzilla
2. Create a service to handle requests to display a delegated UI to create bugs.
3. Create a service to accept a **BugzillaChangeRequest** via HTTP POST (sent from the delegated UI form) and create a new bug.


## Adding the location of the delegated UI for creation to Service Providers

As with our delegated UI for selection, it's relatively easy to add the location of our delegated UI for creation to the various representations of service providers.

Open `BugzillaChangeRequestService.java` in the **org.eclipse.lyo.oslc4j.bugzilla** package and search for `@OslcDialog` (_not_ plural). You’ll see two occurrences: one near the top for the Selection Dialog and Query Capability and one farther down the Creation Dialog:

    @OslcDialog
    (
    title = "Change Request Creation Dialog",
    label = "Change Request Creation Dialog",
    uri = "/{productId}/changeRequests/creator",
    hintWidth = "600px",
    hintHeight = "375px",
    resourceTypes = {Constants.TYPE_CHANGE_REQUEST},
    usages = {OslcConstants.OSLC_USAGE_DEFAULT}
    )

With these annotations, OSLC4J handles the conversion of this information to XML or JSON for you – no additional templating required.

You can explore `/src/main/webapp/cm/serviceprovider_html.jsp` to see how to add the links to the HTML representation of a Service Provider (under the **Resource Creator Dialog** heading).

With this enabled, we've defined that the dialog for creating new bugs will be at the following URL (assuming your adapter is running at `localhost` and port `8080`):

    http://localhost:8080/OSLC4JBugzilla/services/{productID}/changeRequests/creator


## Creating a bug from an OSLC BugzillaChangeRequest

Before we create the delegated dialog to create new bugs, we will need a server-side helper utility that can accept a **BugzillaChangeRequest** and use its information to create a new bug in Bugzilla.

Locate `BugzillaManager.java` in the `org.eclipse.lyo.oslc4j.bugzilla` package and explore the contents.

This class contains several static utility methods for interacting with Bugzilla using the **j2bugzilla** library. `BugzillaChangeRequestService.java` makes use extensive use of the methods in this class.

Locate the `createBug()` method. We first retrieve bug properties from the passed **BugzillaChangeRequest**:

    String summary = changeRequest.getTitle();
    String component = changeRequest.getComponent();
    String version = changeRequest.getVersion();
    String operatingSystem = changeRequest.getOperatingSystem();
    String platform = changeRequest.getPlatform();
    String description = changeRequest.getDescription();

Next, if there are missing fields we set some defaults:

    BugFactory factory = new BugFactory().newBug().setProduct(
            product.getName());

    if (summary != null) {
      factory.setSummary(summary);
    }
    if (version != null) {
      factory.setVersion(version);
    }
    if (component != null) {
      factory.setComponent(component);
    }
    if (platform != null) {
      factory.setPlatform(platform);
    } else
      factory.setPlatform("Other");

    if (operatingSystem != null) {
      factory.setOperatingSystem(operatingSystem);
    } else
      factory.setOperatingSystem("Other");

    if (description != null) {
      factory.setDescription(description);
    }

Finally, we call j2bugzilla's methods to create a bug:

    Bug bug = factory.createBug();
    ReportBug reportBug = new ReportBug(bug);
    bc.executeMethod(reportBug);
    newBugId = Integer.toString(reportBug.getID());

And return the ID of the new bug:

    return newBugId;

With that utility in place, we can now set up services for our application to serve up a delegated UI for a user to create a new bug.



## Displaying the delegated UI to create new bugs

### Retrieving valid field values from Bugzilla and dispatching a template

We will add another method to our **BugzillaChangeRequestService** class to create and display a delegated UI to create a new bug.

In our OSLC4J Bugzilla Adapter, open `BugzillaChangeRequestService.java` and search for the `changeRequestCreator()` method.

As with many of our other methods, we first establish which Bugzilla product we're working with from the URI:

	BugzillaConnector bc =
	  BugzillaManager.getBugzillaConnector(httpServletRequest);

	Product product = BugzillaManager.getProduct(httpServletRequest, productId);
	httpServletRequest.setAttribute("product", product);

Next, we use the j2bugzilla **GetLegalValues** API to retrieve the allowed values for the various bug fields. Here's the code for retrieving the legal values for the **Component** field:

	GetLegalValues getComponentValues = 
	  new GetLegalValues("component", product.getID());
	bc.executeMethod(getComponentValues);
	List<String> components = Arrays.asList(getComponentValues.getValues());
	httpServletRequest.setAttribute("components", components);

We have similar code for the **Operating System**, **Platform**, and **Version** fields.

Finally, we set a few more attributes and dispatch them all to a .jsp template (`/cm/changerequest_creator.jsp`):

	httpServletRequest.setAttribute("creatorUri", uriInfo.getAbsolutePath().toString());
	httpServletRequest.setAttribute("bugzillaUri", BugzillaManager.getBugzillaUri());

	RequestDispatcher rd = httpServletRequest.getRequestDispatcher("/cm/changerequest_creator.jsp");
	rd.forward(httpServletRequest, httpServletResponse);


### Building the delegated UI to create new bugs

Now, open `/src/main/webapp/cm/changerequest_creator.jsp` and explore the contents.

As with the delegated UI for selection, note the addition of `bugzilla.js` in the `<head>` that has a variety of script methods that we'll explore soon.

    <script type="text/javascript" src="../../../bugzilla.js"></script>

Next, explore the HTML table and form. We populate the various `<select>` elements with the legal values that were passed in from the Java service. For example, here's the input for the **Component** field:

    <select name="component">
	<%
	 for (String c : components) {
	%>
    <option value="<%=c%>"><%=c%></option>
	<%
      }
    %>
    </select>

You'll see simliar code for the other fields. We also provide a free-form text `<input>` for the **Summary**…

    <input name="summary" class="required text_input"
      type="text" style="width: 400px" id="summary" required autofocus>

… and a `<textarea>` for the __Description__:

    <textarea style="width: 400px; height: 150px;"
      id="description" name="description"></textarea>

Finally, when you click the **Submit Bug** button we call the JavaScript function `create()` (from the file `src/main/webapp/bugzilla.js`):

    <input type="button"
      value="Submit Bug"
      onclick="javascript: create( '<%= creatorUri %>' )">

We'll explore the `create()` JavaScript method in more detail below.


### Send the values for the new bug back to our adapter

Open `bugzilla.js` and explore the `create()` function:

	function create(baseUrl){
	  var form = document.getElementById("Create");
	  xmlhttp = new XMLHttpRequest();
	  xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && (xmlhttp.status==201)) {
		  txt = xmlhttp.responseText;
		  resp = eval('(' + txt + ')');
		  // Send response to listener
		  sendResponse(resp.title, resp.resource);
		}
	  };
	   var postData=""; 
	   if (form.component) {
		 postData += "&component="+encodeURIComponent(form.component.value);
	   }
	   if (form.summary) {
		 postData += "&summary="+encodeURIComponent(form.summary.value);
	   }
	   if (form.version) {
		 postData += "&version="+encodeURIComponent(form.version.value);
	   }
	   if (form.op_sys) {
		 postData += "&op_sys="+encodeURIComponent(form.op_sys.value);
	  } 
	  if (form.platform) {
		postData += "&platform="+encodeURIComponent(form.platform.value);  
	  }
	  if (form.description) {
		postData += "&description="+encodeURIComponent(form.description.value);  
	  }
	  xmlhttp.open("POST", baseUrl, true);
	  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	  xmlhttp.setRequestHeader("Content-length",postData.length);
	  xmlhttp.send(postData);
	}

This method takes the values from our form, converts them into URL query string parameters, and sends data via POST to the `createHtmlChangeRequest()` method in our **BugzillaChangeRequestService** class via `XMLHttpRequest()`. 

To see how our adapter handles that POST request, open `BugzillaChangeRequestService.java` and search for the `createHtmlChangeRequest()` method.

Note that this service expects an encoded URL via `POST` at the same URL path as our delegated UI (`"creator"`):

	@POST
	@Path("creator") 
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED})

Our `createHtmlChangeRequest()` first builds a **BugzillaChangeRequest** from the URL parameters:

	BugzillaChangeRequest changeRequest = new BugzillaChangeRequest();
	changeRequest.setComponent(component);
	changeRequest.setVersion(version);
	changeRequest.setTitle(summary);
	changeRequest.setOperatingSystem(op_sys);
	changeRequest.setPlatform(platform);
	changeRequest.setDescription(description);

Then we use the `createBug()` method from **BugzillaManager** (discussed above) to create a new bug in Bugzilla:

    final String newBugId = BugzillaManager.createBug(httpServletRequest, changeRequest, productId);

With the bug created, we gather some information about our new bug…

	final Bug newBug = BugzillaManager.getBugById(httpServletRequest, newBugId);
	final BugzillaChangeRequest newChangeRequest = BugzillaChangeRequest.fromBug(newBug);
	URI about = getAboutURI(productId + "/changeRequests/" + newBugId);
	newChangeRequest.setAbout(about);

	httpServletRequest.setAttribute("changeRequest", newChangeRequest);
	httpServletRequest.setAttribute("changeRequestUri", newChangeRequest.getAbout().toString());

… and build a small JSON response to return.

	httpServletResponse.setContentType("application/json");
	httpServletResponse.setStatus(Status.CREATED.getStatusCode());
	httpServletResponse.addHeader("Location", newChangeRequest.getAbout().toString());
	PrintWriter out = httpServletResponse.getWriter();
	out.print("{\"title\": \"" + getChangeRequestLinkLabel(newBug.getID(), summary) + "\"," +
			"\"resource\" : \"" + about + "\"}");
	out.close();

Back in `bugzilla.js` the `onreadystatechange` callback evaluates that JSON response and uses the `sendResponse()` method (discussed in more detail in the previous section) to send some information about the new bug back to the consumer application (re-copied from above):

	xmlhttp.onreadystatechange = function() {
	  if (xmlhttp.readyState==4 && (xmlhttp.status==201)) {
		txt = xmlhttp.responseText;
		resp = eval('(' + txt + ')');
		// Send response to listener
		sendResponse(resp.title, resp.resource);
	  }
	};

We'll [put this dialog to use in the NinaCRM application later on](/integrating_products_with_oslc/integrating_with_an_oslc_provider/2_3_delegatedUI/).

We now have the ability to use user interface delegation as a way to provide a simple way for consumer applications to both create and select bugs. We’ve also exposed this capability from our service provider resource definition. 

Next, we'll explore how to make it easier for other applications to create new bugs programmatically.

[Next: Part 1.7, Factory](1_7_factory)

