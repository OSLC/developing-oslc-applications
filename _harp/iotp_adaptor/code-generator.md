# Code Generator

Generating the CE4IoTConnector Implementation

Select the IoTP Adapter toolchain and 

Next, add JAX-RS REST services for OAuth and the CE4IoTConnector TRS provider. Edit com.ibm.oslc.applicaiton.iotp.servlet/Application.java and add the following user code. Be sure any code you customize is inside Start of user code and End of user code comments:

```
        RESOURCE_CLASSES.add(ResourceShapeService.class);

        // Start of user code Custom Resource Classes
                // OAuth service
                try {
                        RESOURCE_CLASSES.add(Class.forName("org.eclipse.lyo.server.oauth.webapp.services.ConsumersService"));
                        RESOURCE_CLASSES.add(Class.forName("org.eclipse.lyo.server.oauth.webapp.services.OAuthService"));
                } catch (ClassNotFoundException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                }
                // TRS service
                RESOURCE_CLASSES.add(TrackedResourceSetService.class);
            // End of user code
```

The OAuth classes have to be added by name instead of through imports because they are defined in a Web application WAR file, not a Java JAR file.

You are now ready to implement each of the domain classes. 