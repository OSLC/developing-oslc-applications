Depending on the adapter interface model, Lyo Designer may generate default implementations of selection and creation dialogs and will generate default implementations of small and large preview dialogs. These will generally need to be updated for UI style, format and content in order to match the environment in which these dialogs will be used.

In the case of CE4IoTConnector, these dialogs might be updated to more closely align with the look and feel of the jazz.net application since its generally intended to be used to integrate with those applications.

This sample code makes some minor and typical changes to the dialogs to give some example so things other adapters might need to do.

Note that the entire body of the JSP pages that implement the Lyo Designer generated dialogs are in protected user code. This is because it is expected that these dialogs will need to be significantly customized. If you need to restore the generated default, simply delete the JSP page and regenerate the code.

## Selection Dialog

Before going into the details of the selection dialog format, it might be helpful to understand how the selection dialogs work.

### Selection Dialog Implementation

The lifecycle scenario of the Lyo Designer generated selection dialog starts with the [IoTPlatformService](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/java/com/ibm/oslc/adaptor/iotp/services/IoTPlatformService.java) class. This class defines all the JAX-RS services that are generated from the adapter interface model. The selection dialog service is implemented using the following generated selector method:

```
    @OslcDialog
    (
         title = "IotSelectionDialog",
         label = "IoT Platform Selection Dialog",
         uri = "iotp/{iotId}/resources/selector",
         hintWidth = "525px",
         hintHeight = "325px",
         resourceTypes = {Oslc_rmDomainConstants.REQUIREMENT_TYPE, Oslc_cmDomainConstants.CHANGEREQUEST_TYPE, Oslc_amDomainConstants.RESOURCE_TYPE},
         usages = {"http://open-services.net/ns/am#IoTPSelectionDialog"}
    )
    @GET
    @Path("selector")
    @Consumes({ MediaType.TEXT_HTML, MediaType.WILDCARD })
    public void RequirementAndChangeRequestAndResourceSelector(
        @QueryParam("terms") final String terms
        , @PathParam("iotId") final String iotId
        ) throws ServletException, IOException
```
The @OslcDialog annotation defines the selection dialog, and the selector method will be invoked when a client makes an HTTP GET request on the @Path URL. The iotId parameter in the path is the IoT Platform organization id, which corresponds to the service provider we are going to select resources from. The terms query parameter contains the Java regular expression that will be used to match against resource titles.

The GET on the selection dialog is actually done twice, once when the client requests the selection dialog and again when the the user presses the Search button. The first GET detects that the terms parameter is null and redirects the request to the [iotpselectiondialogselector.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/iotpselectiondialogselector.jsp) page. This page dynamically creates the selection dialog as describe in the next section. The client application embeds this selection dialog in an HTML iframe of its dialog and the selection dialog is displayed to the user.

Next the user selects a resource type to search on, enters a Java regular expression in the search field, and presses the Search button. This calls the JavaScript search method in the delegatedUItyped.js which does a GET on the selection dialog again, this time with a non-null terms query parameter.

This time the selector service sees the terms query parameter is not null, and uses the [CE4IoTConnectorManager](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/java/com/ibm/oslc/adaptor/iotp/CE4IoTConnectorManager.java) RequirementAndChangeRequestAndResourceSelector method to find the matching resources. It then dispatches the request to the [iotpselectiondialogselectorresults.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/iotpselectiondialogselectorresults.jsp) which formulates the selected resources into the oslc:results JSON object which is the entity request body of the GET done by the search JavaScript method. This result is then displayed in the results field in the selection dialog so the user can select the resources. 

The user can now select one or more resources and press the OK button. This formulates the window message and send it to the client dialog where the selection is processed.

You can se all this work in the [selectiondialogsampleclient.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/selectiondialogsampleclient.jsp) file. This JSP demonstrates what a typical client application would do to use a selection dialog provided by the server. It simply displays the titles of the selected resources.

### CE4IoTConnector Selection Dialog

CE4IoTConnector uses a single selection dialog for all resources. Separate selection dialogs for each resource type would result in a lot of redundant dialogs, and would not provide any means for users to choose what to select. This is because the jazz.net apps expect the server's selection dialog to deal with navigating, querying, searching, etc. for its resources inside its selection dialog. 

So generally a server will provide a single selection dialog for each service provider, and that selection dialog will provide some means for allowing users to choose what to select. 

This selection dialog is implemented in [iotpselectiondialogselector.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/iotpselectiondialogselector.jsp). It uses a simple HTML select element to provide a drop-down selection list of resource types. It then uses the generated search field to search for resources by title, using Java regular expressions for matching.

```
Type: <select id="selectType">
  	<option value="device">Device</option>
  	<option value="devicetype">DeviceType</option>
  	<option value="thing">Thing</option>
  	<option value="thingtype">ThingType</option>
  	<option value="logicalinterface">LogicalInterface</option>
  	<option value="physicalinterface">PhysicalInterface</option>
  	<option value="eventtype">EventType</option>
  	<option value="schema">Schema</option>
  	<option value="rule">Rule</option>  	
  </select>

```
A simple JavaScript script sets the type query parameter and adds it to the selection dialog URL so that it is available to the [CE4IoTConnectorManager](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/java/com/ibm/oslc/adaptor/iotp/CE4IoTConnectorManager.java) RequirementAndChangeRequestAndResourceSelector method.

```
  <script>
  var selectionUri = {}
  $(document).ready(function() {
	    var selectType = document.getElementById("selectType")
	    $('#selectType').on('click', function load() {
	    	var type = selectType.options[selectType.selectedIndex].value
	    	selectionUri = '<%= selectionUri %>?type='+type  // provide the selected type as a query parameter
	     })
	     selectType.selectedIndex = 1
	     selectType.click()
	  })
  </script>
```
Note that although this type parameter is not declared using an @QueryParam("type") parameter of the method that handles GET on the selection dialog, this parameter is available to CE4IoTConnectorManager:

```
    public static List<AbstractResource> RequirementAndChangeRequestAndResourceSelector(HttpServletRequest httpServletRequest, final String iotId, String terms)   
    {
        List<AbstractResource> resources = null;
        
        // Start of user code RequirementAndChangeRequestAndResourceSelector
		try {
            String resourceType = httpServletRequest.getParameter("type");
            if (resourceType == null) resourceType = "devicetype";
			IotpServiceProviderInfo info = IoTAPIImplementation.getIotpServiceProviderInfo(httpServletRequest, iotId);
			resources = new ArrayList<AbstractResource>();
			if (resourceType.equals("devicetype")) resources.addAll(queryDeviceTypes(httpServletRequest, iotId, terms, 1, 10000));
			if (resourceType.equals("device")) resources.addAll(queryDevices(httpServletRequest, info.iotId, terms, 1, 10000));				
			if (resourceType.equals("thingtype")) resources.addAll(queryThingTypes(httpServletRequest, info.iotId, terms, 1, 10000));
			if (resourceType.equals("rule")) resources.addAll(queryRules(httpServletRequest, info.iotId, terms, 1, 10000));
		} catch (Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(e, Status.INTERNAL_SERVER_ERROR);
		}
        // End of user code
        return resources;
    }
```
This second parameter did however require a small change in the generated delegateUI.js file. Since that file does not support protected user code sections, it was necessary to clone that file to delegetedUItyped.js and add the change there:

```
  xmlhttp.open("GET", baseUrl + "&terms=" + encodeURIComponent(terms), true);
```
The terms parameter now follows the type parameter, so it needs to start with & not ?. And [iotpselectiondialogselector.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/iotpselectiondialogselector.jsp) is updated to used delegatedUItyped.js instead of delegatedUI.js.

```
    <script type="text/javascript" src="<%=UriBuilder.fromUri(OSLC4JUtils.getPublicURI()).path("delegatedUItyped.js").build().toString()%>"></script>
```

## Creation Dialog

Before going into the details of the creation dialog format, it might be helpful to understand how the generated creation dialogs work.

### Creation Dialog Implementation

The lifecycle scenario of the Lyo Designer generated creation dialog, like all OSLC services, also starts with the [IoTPlatformService](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/java/com/ibm/oslc/adaptor/iotp/services/IoTPlatformService.java) class. The creation dialog service is implemented using the following generated creator method:

```
    @GET
    @Path("creator")
    @Consumes({MediaType.WILDCARD})
    public void ResourceAndChangeRequestAndRequirementCreator(
                @PathParam("iotId") final String iotId
        ) throws IOException, ServletException
```
This method simply sets some request attributes and delegates to the [iotpcreationdialogcreator.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/iotpcreationdialogcreator.jsp) JSP.

The user fills in the fields as needed and presses the OK button. This sends a POST message to the resource creation service using the JavaScript create method in [delegatedUI.js](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/delegatedUI.js). 

```
    @OslcDialog
    (
         title = "ResourceCreationDialog",
         label = "Resource Creation Dialog",
         uri = "iotp/{iotId}/resources/creator",
         hintWidth = "525px",
         hintHeight = "225px",
         resourceTypes = {Oslc_amDomainConstants.RESOURCE_TYPE, Oslc_cmDomainConstants.CHANGEREQUEST_TYPE, Oslc_rmDomainConstants.REQUIREMENT_TYPE},
         usages = {"http://open-services.net/ns/am#IoTPCreationDialog"}
    )
    @POST
    @Path("creator")
    @Consumes({ MediaType.APPLICATION_FORM_URLENCODED})
    public void createResourceAndChangeRequestAndRequirement(
            @PathParam("iotId") final String iotId)
```
This method has user code that examines the type query parameter, and use it to call the right creation method in the CE4IoTConnectorManager. This code has to be updated in order to support creation of additional resource types.

```
            // Start of user code createResourceAndChangeRequestAndRequirement
            // TODO Implement code to create the new resource. This method seems to be expected to handle more than a single type of resources.
            // Get the user selected resource type from the query parameter
            String[] paramValues;
            Resource aResource = new Resource();
            String resourceType = httpServletRequest.getParameter("type");
            if (resourceType.equals("devicetype")) {
            	aResource = new DeviceType();
            } else if  (resourceType.equals("device")) {
            	aResource = new Device();            	
            }
            // generic Resource Properties to set (and these are all that are needed for any IoT Platform resource:
            paramValues = httpServletRequest.getParameterValues("identifier");
            if (paramValues != null) {
                    if (paramValues.length == 1) {
                        if (paramValues[0].length() != 0) {
                            aResource.setIdentifier(paramValues[0]);
                    		aResource.setTitle(aResource.getIdentifier());
                    		aResource.setShortTitle(aResource.getIdentifier());
                    		// else, there is an empty value for that parameter, and hence ignore since the parameter is not actually set.
                        }
                    }
                    paramValues = httpServletRequest.getParameterValues("description");
                    if (paramValues != null) {
                            if (paramValues.length == 1) {
                                if (paramValues[0].length() != 0)
                                    aResource.setDescription(paramValues[0]);
                                // else, there is an empty value for that parameter, and hence ignore since the parameter is not actually set.
                            }

                    }
            }
            
            if (resourceType.equals("devicetype")) {
                newResource = CE4IoTConnectorManager.createDeviceType(httpServletRequest, (DeviceType)aResource, iotId);
            } else if  (resourceType.equals("device")) {
            	String typeId = httpServletRequest.getParameter("typeId");
            	((Device)aResource).setTypeId(typeId);
                newResource = CE4IoTConnectorManager.createDevice(httpServletRequest, (Device)aResource, iotId);
            }

            // End of user code
```

### CE4IoTConnector Creation Dialog

CE4IoTConnector also uses a single creation dialog for all resources. Separate creation dialogs for each resource type would result in a lot of redundant dialogs, and would not provide any means for users to choose what to create. This is because the jazz.net apps expect the server's creation dialog to deal with determining what resource to create inside its creation dialog. 

The creation dialog is implemented in [iotpcreationdialogcreator.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/iotpcreationdialogcreator.jsp). It uses a simple HTML select element to provide a drop-down selection list of resource types. 

```
  Type: <select id="selectType">
  	<option value="device">Device</option>
  	<option value="devicetype">DeviceType</option>
  	<option value="thing">Thing</option>
  	<option value="thingtype">ThingType</option>
  	<option value="logicalinterface">LogicalInterface</option>
  	<option value="physicalinterface">PhysicalInterface</option>
  	<option value="eventtype">EventType</option>
  	<option value="schema">Schema</option>
  	<option value="rule">Rule</option>  	
  </select>
```
A simple JavaScript script sets the type query parameter and adds it to the creation dialog URL so that it is available to the [CE4IoTConnectorManager](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/java/com/ibm/oslc/adaptor/iotp/CE4IoTConnectorManager.java) RequirementAndChangeRequestAndResourceSelector method.

```
  <script>
  var creatorUri = {}
  $(document).ready(function() {
	    var selectType = document.getElementById("selectType")
	    $('#selectType').on('click', function load() {
	    	var type = selectType.options[selectType.selectedIndex].value
	      	var parser = document.createElement('a')
	    	parser.href = document.URL
	    	var uri = parser.protocol+'//'+parser.host+'/iotp/creators/'+type+'.jsp'
		    creatorUri = '<%= creatorUri %>'+'?type='+type  // provide the selected type as a query parameter
	    	$('#Create #resourceProperties').load(uri)	  
	     })
	     selectType.selectedIndex = 1
	     selectType.click()
	  })
  </script>
```
This script sets the type query parameter which is use in the IoTPlatformService creator service to determine which resource type to create, and to call the proper CE4IoTConnectorManager creation method. It also loads the appropriate content from JSP pages in the [creators](https://github.com/OSLC/iotp-adaptor/tree/master/CE4IoTConnector/src/main/webapp/creators) folder. These dialogs contain the HTML fragments that are specific to each resource. The implementation of these dialogs is similar to what Lyo Designer would create for individual resource creation dialogs.

## Small Preview Dialog

Lyo Designer generates a JAX-RS service method for each resource small preview. GET on this URL returns the OSLC Compact resource with the client then uses to get the resource icon, title and small and large preview dialog URLs.

```
    @GET
    @Path("deviceTypes/{deviceTypeId}")
    @Produces({OslcMediaType.APPLICATION_X_OSLC_COMPACT_XML})
    public Compact getDeviceTypeCompact(
        @PathParam("iotId") final String iotId, @PathParam("deviceTypeId") final String deviceTypeId
        ) throws ServletException, IOException, URISyntaxException
```
Clients then do GETs on the individual dialog URLs. The dialogs are dynamic HTML pages implemented as JSPs, one for each resource. For example, Device small preview is implemented in [devicesmallpreview.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/devicesmallpreview.jsp).

The actual fields displayed will likely need to be adjusted for style, format, and to remove any fields that should not be shown. This is what was provided for [devicesmallpreview.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/devicesmallpreview.jsp):

```
<%
  Device aDevice = (Device) request.getAttribute("aDevice");
  JsonObject deviceData = aDevice.getDeviceData(request);
%>
...
          <dl class="row">
            <dt class="col-sm-3">typeId</dt>
            <dd class="col-sm-9"><%= aDevice.typeIdToHtml()%></dd>
            <dt class="col-sm-3">description</dt>
            <dd class="col-sm-9"><%= aDevice.descriptionToHtml()%></dd>
<% for (Map.Entry<String, JsonElement> e : deviceData.entrySet()) { %>  
			<dt class="col-sm-3"><%= e.getKey() %> </dt>
			<dt class="col-sm-9"><%= e.getValue().toString() %> <dd>
<% } %>         
          </dl>
```
Notice the change in attributes to control the description list. See [http://v4-alpha.getbootstrap.com/migration/](http://v4-alpha.getbootstrap.com/migration/) which says:
.dl-horizontal has been dropped. Instead, use .row on <dl> and use grid column classes (or mixins) on its <dt> and <dd> children as shown in [Description list alignment](https://getbootstrap.com/docs/4.0/content/typography/#description-list-alignment). 

Notice also that the Device small preview also includes additional fields to show the Device's current runtime values. This shows how preview dialogs can be extended to so additional data as needed.

## Large Preview Dialog

Large preview dialogs are similar to small preview dialogs. The only difference is in their content and layout. See [iotp/devicetypelargepreview.jsp](https://github.com/OSLC/iotp-adaptor/blob/master/CE4IoTConnector/src/main/webapp/com/ibm/oslc/adaptor/iotp/devicetypelargepreview.jsp) for a typical example.
