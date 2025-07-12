# Overriding Lyo Designer output

Sometimes, Lyo Designer generates a code, which, in turn, produces REST responses that you would like to modify.

Initially, you may be tempted to edit the generated code directly. However, it is best not make manual changes to the generated code. This helps prevent you changes from being overwritten by Lyo Designer the next time you re-generate the code.

!!! tip "Reminder about code generation"

    You may be familiar with a few code generators, such as in Ruby on Rails. Those are _scaffolding_ generators, meant to help you get started. They generate code only once and let you modify it if needed. Some other generators, e.g. to generate OpenAPI clients, may be designed to be always regenerated from the definitions. Lyo Designer features an MBSE-style (model-based systems engineering) code generator that is designed to be used repeatedly and symbiotically when designing an OSLC Server.


Preferred options include (in the order of preference):

1. Adjust the model definition so that Lyo Designer generates the code that suits your needs.
1. Find a code segment separated by comments `Start of user code` and `End of user` and place your code there. Such code will be preserved upon re-generation.
1. [File a bug](https://github.com/eclipse-lyo/lyo.designer/issues/new?template=BLANK_ISSUE) on Lyo Designer and request a new user code block to be added where you need it.
1. Consider using an interceptor below.
1. Resort to making changes to the generated code.


## Defining an interceptor

A sample interceptor below adds an extra `jfs:oauthRealmName` property to all responses featuring an OSLC Service Provider Catalog.

```java
import javax.ws.rs.ext.WriterInterceptor;
import javax.ws.rs.ext.WriterInterceptorContext;
import javax.xml.namespace.QName;

@Provider
public class ExtendedPropWriteInterceptor implements WriterInterceptor {
    private static final QName OAUTH_REALM_NAME = new QName("http://jazz.net/xmlns/prod/jazz/jfs/1.0/", "oauthRealmName");
    private final Logger log = LoggerFactory.getLogger(ExtendedPropWriteInterceptor.class);

    @Override
    public void aroundWriteTo(WriterInterceptorContext context) throws IOException, WebApplicationException {
        log.info("Interceptor called");
        final Object entity = context.getEntity();
        if (entity instanceof ServiceProviderCatalog) {
            final ServiceProviderCatalog catalog = (ServiceProviderCatalog) entity;
            catalog.getExtendedProperties().put(OAUTH_REALM_NAME, AuthenticationApplication.OAUTH_REALM);
            context.setEntity(catalog);
        }
        context.proceed();
    }
}
```


!!! tip
    Do not forget to register the interceptor in the `Application.java`

    ```java
    RESOURCE_CLASSES.add(ExtendedPropWriteInterceptor.class);
    ```