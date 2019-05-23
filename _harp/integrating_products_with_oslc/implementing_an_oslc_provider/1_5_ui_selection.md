# Providing a delegated UI for selection and search 

Now that we have the basic services and resources defined for BugzillaChangeRequests (our Bugzilla-specific extension of OSLC ChangeRequests), our next step is to implement [delegated user interface (UI) dialogs](https://open-services.net/resources/oslc-primer/#delegated-user-interface-dialogs) to allow the following actions from an OSLC Consumer:

+ Search for and select Bugzilla bugs
+ Create a new bug in Bugzilla

For example, a user of the NinaCRM product will be able to search for and add links to related bugs in Bugzilla without leaving the NinaCRM interface.

<div class="notice"><p>For more information on OSLC delegated UIs, see the <a href="http://open-services.net/bin/view/Main/OslcCoreSpecification#Delegated_User_Interface_Dialogs
">section about them in the OSLC core specification</a>.</p></div>

Because delegated UI dialogs must accept user input and interact with Bugzilla to select or create bugs, they are more complex than collecting and describing bugs. Here's how we'll approach the process:

2. See how OSLC4J helps provide delegated UI locations to the Service Provider document
1. Understand how to define a basic dialog with the J2Bugzilla API and generate the appropriate responses
3. Add methods to **BugzillaChangeRequestService** for the selection and creation of change requests
4. Add forms and JavaScript code to handle interacting with the consumer of the dialogs
5. Test the dialogs to ensure the appropriate response is given


## Adding the location of delegated UI dialogs to Service Providers

Because we're using OSLC4J, it's relatively trivial to add links to delegated UIs to our Service Provider documents.

Open `BugzillaChangeRequestService.java` in the **org.eclipse.lyo.oslc4j.bugzilla** package and search for `@OslcDialogs` (note the plural).

These use the imported annotations from OSLC4J: ` org.eclipse.lyo.oslc4j.core.annotation.OslcDialog`, `org.eclipse.lyo.oslc4j.core.annotation.OslcDialogs;`, and `org.eclipse.lyo.oslc4j.core.annotation.OslcQueryCapability;`

Here are the annotations for the selection dialog and the capability to query for bugs:

    @OslcDialogs(
    {
        @OslcDialog
        (
             title = "Change Request Selection Dialog",
             label = "Change Request Selection Dialog",
             uri = "/{productId}/changeRequests/selector",
             hintWidth = "525px",
             hintHeight = "325px",
             resourceTypes = {Constants.TYPE_CHANGE_REQUEST},
             usages = {OslcConstants.OSLC_USAGE_DEFAULT}
        )

    })

    @OslcQueryCapability
    (
        title = "Change Request Query Capability",
        label = "Change Request Catalog Query",
        resourceShape = OslcConstants.PATH_RESOURCE_SHAPES + "/" + Constants.PATH_CHANGE_REQUEST,
        resourceTypes = {Constants.TYPE_CHANGE_REQUEST},
        usages = {OslcConstants.OSLC_USAGE_DEFAULT}
    )
    
As with BugzillaChangeRequests, with the appropriate annotations OSLC4J handles the conversion of this information to XML or JSON for you – no additional templating required.

You can explore `/src/main/webapp/cm/serviceprovider_html.jsp` to see how we add the links to these to the HTML representation of a Service Provider (under the **Resource Selector Dialog** heading).

With this enabled, we've defined that the dialog for selecting or querying for bugs will be at the following URL (assuming your adapter is running at `localhost` and port `8080`):

    http://localhost:8080/OSLC4JBugzilla/services/{productID}/changeRequests/selector

Next, we must create the dialog.

## Adding the dialog to search for and select bugs

As with our methods for returning BugzillaChangeRequests, we add another method to our **BugzillaChangeRequestService** class to handle requests for a delegated UI to select bugs.

In our OSLC4J Bugzilla Adapter, open `BugzillaChangeRequestService.java` and search for the `changeRequestSelector()` method:

    @GET
    @Path("selector")
    @Consumes({ MediaType.TEXT_HTML, MediaType.WILDCARD })
    public void changeRequestSelector(
        @QueryParam("terms")     final String terms,
        @PathParam("productId")  final String productId
        ) throws ServletException, IOException
    {
        int productIdNum = Integer.parseInt(productId);
        httpServletRequest.setAttribute("productId", productIdNum);
        httpServletRequest.setAttribute("bugzillaUri", BugzillaManager.getBugzillaUri());
        httpServletRequest.setAttribute("selectionUri",uriInfo.getAbsolutePath().toString());

        if (terms != null ) {
            httpServletRequest.setAttribute("terms", terms);
            sendFilteredBugsReponse(httpServletRequest, productId, terms);

        } else {
            try {    
                RequestDispatcher rd = httpServletRequest.getRequestDispatcher("/cm/changerequest_selector.jsp"); 
                rd.forward(httpServletRequest, httpServletResponse);
            
            } catch (Exception e) {
                throw new ServletException(e);
            }
        }
            
    }

In short, this method defines two things that could happen if you make a request to a URL with `/changeRequests/selector`:

1. If the request URL _does not_ have a `terms` parameter, we dispatch a JSP template (`changerequest_selector.jsp`) to display a form for the user to fill in the search terms and select a bug.
2. If the request _does_ have a `terms` parameter, the request is an AJAX request coming from the delegated UI that is running in a user's web browser (code that we'll discuss below). We call the `sendFilteredBugsReponse()` method that performs a Bugzilla search (using the J2Bugzilla API) and returns the results in a compact JSON format.

Let's explore the delegated UI to fill in search terms and select bugs in the JSP template.


## Creating the delegated UI for selection

Open `/src/main/webapp/cm/changerequest_selector.jsp` and explore the contents.

The JSP page `changerequest_selector_dialog.jsp` provides the HTML and JavaScript for a Change Request Selector Dialog. There's a little bit of HTML, because the dialog is pretty simple.

Because a fair amount of JavaScript code is required to allow a user to enter search terms, display search results, allow the user to make a selection and then notify the delegated UI consumer that a selection has been made, we have stashed those methods in a `bugzilla.js` file that we load in the `<head>` of the returned HTML:

    <script type="text/javascript" src="../../../bugzilla.js"></script>

We'll explore the various JavaScript methods below.


### Allowing users to search for bugs

In `changerequest_selector.jsp`, here's the form for the user to enter search terms:

	<input type="search" 
		style="width: 335px" 
		id="searchTerms" 
		placeholder="Enter search terms" 
		autofocus>
	<button 
		type="button"
		onclick="search( '<%= selectionUri %>' )">Search</button>

Note that when you click the `<button>`, we call the JavaScript function `search()`, which we define in the file `src/main/webapp/bugzilla.js`.

Open `bugzilla.js`. Near the top, explore the `search()` function.

    function search(baseUrl){
        var ie = window.navigator.userAgent.indexOf("MSIE");
        list = document.getElementById("results");
        list.options.length = 0;
        var searchMessage = document.getElementById('searchMessage');
        var loadingMessage = document.getElementById('loadingMessage');
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                // populate results
                txt = xmlhttp.responseText;
                resp = eval('(' + txt + ')');
                for( var x=0; x<resp.results.length; x++ ) {
                    var item=document.createElement('option');
                    item.text = resp.results[x].title;
                    item.value = resp.results[x].resource;
                    if (ie > 0) {
                         list.add(item); 
                    } else {
                         list.add(item, null); 
                    }
                }
            
                searchMessage.style.display = 'block';
                loadingMessage.style.display = 'none';
            }
        };
        terms = document.getElementById("searchTerms").value;
        xmlhttp.open("GET", baseUrl + "?terms=" + encodeURIComponent(terms), true);    
        searchMessage.style.display = 'none';
        loadingMessage.style.display = 'block';
        xmlhttp.send();
    }

In short, this function does the following:

1. Removes any previous search results from the `<select id="results">` element
2. Creates an AJAX request 
4. Get the search query from the value of the `<input id="searchTerms">` element.
4. Sends an AJAX request to `/changeRequests/selector` with a `terms=` parameter. Recall that this type of request to our adapter will run a search in Bugzilla and return the results in a JSON format.
3. A callback evaluates the search results with the `eval()` method, loops through the results, and adds each result as an `<option>` element to the `#results` element.
5. Reveals a loading message while making the request; hides the message when finished.


Now in our delegated UI, users can search for bugs in Bugzilla, see a list of results, and select amongst them from a `<select>` element. Next, we will allow them to do something with their selection.



### Sending the selected bugs back to the OSLC consumer application

Go back to the file `changerequest_selector.jsp`. Just below the `<select id="results">` element that will hold search results, you'll see the form `<button>`s to submit the selected bug or bugs:

    <button style="float: right;" type="button"
      onclick="javascript: cancel()">Cancel</button>
    <button style="float: right;" type="button"
      onclick="javascript: select();">OK</button>

When you click the **OK** button, we call the JavaScript function `select()`, which is also defined in the `bugzilla.js` file.

Open `bugzilla.js` and search for the `select()` function:

    function select(){
      list = document.getElementById("results");
      if( list.length>0 && list.selectedIndex >= 0 ) {
        option = list.options[list.selectedIndex];
        sendResponse(option.text, option.value);
      }
    }

This method finds the bug that the user has selected (`list.options[list.selectedIndex]`) and sends the title (`option.text`) and URL (`option.value`) of the bug in a response to the original window (the `sendResponse()` method).

Because we're sending data from a delegated UI in one browser window back to another application with a different host and in a different window, we must use either the [`window.postMessage`](https://developer.mozilla.org/en-US/docs/DOM/window.postMessage) method (if supported) or via `window.name` variables otherwise.

Explore the `sendResponse()` method to see how we build the JSON response and determine which cross-window method to use to send it to the requesting application:

    function sendResponse(label, url) {
	  var oslcResponse = 'oslc-response:{ "oslc:results": [ ' +  
		' { "oslc:label" : "' + label + '", "rdf:resource" : "' + url + '"} ' + 
	  ' ] }';
  
	  if (window.location.hash == '#oslc-core-windowName-1.0') {       
		// Window Name protocol in use
		respondWithWindowName(oslcResponse);
	  } else if (window.location.hash == '#oslc-core-postMessage-1.0') {
		// Post Message protocol in use
		respondWithPostMessage(oslcResponse);
	  } 
    }

We determine whether or not we want to use Window Name or postMessage by looking at the `location.hash` value for the page: either `#oslc-core-windowName-1.0` or `#oslc-core-postMessage-1.0`. We do this because the _requesting client_ is the application that must indicate which cross-domain method _it_ supports; the client does so by requesting our delegated UI with the appropriate hash. We'll explore this later when we access this delegated UI in the NinaCRM application.

You can further explore the `respondWithPostMessage()` and `respondWithWindowName()` methods in `bugzilla.js` to see how we send the data to the requesting window – it's taken almost entirely from the examples in the OSLC Core specification.

<div class="notice tip">
<p>
Note that the selection dialog above will show all Change Requests available for one Bugzilla Product. Some additional work could be done to make this more useful by doing some filtering up-front. For example, it might be useful to show only Change Requests that are assigned to the current user, or to prioritize recently created Change Requests.
</p>
</div>

We'll put this delegated UI to use later when we [implement it in the NinaCRM sample application](../integrating_with_an_oslc_provider/2_2_links_and_previews/).

Next, we'll create a delegated UI that will allow users to create new bugs in Bugzilla.

[Next: Part 1.6, UI Creation](1_6_ui_creation)
