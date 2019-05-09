# Installation

The iopt-adaptor is sample code available at [OSLC/iotp-adaptor](https://github.com/OSLC/iotp-adaptor). The GitHub repo does not contain a build of the adaptor, so you will need to build one yourself. [Environment Setup](../environment-setup) describes in detail how to do this in an eclipse Maven project. But if you have maven installed on your machine, you can easily use the command line to build the WAR file.

```
git clone https://github.com/OSLC/iotp-adaptor.git
cd iotp-adaptor/iotp-adaptor
mvn install
```
This will result in creating target/iotp-0.0.1-SNAPSHOT.war. You can then install this WAR file in any compatible JEE container such as Tomcat, Jetty, WebSphere Liberty, etc.

For example, download [Tomcat 9](https://tomcat.apache.org/download-90.cgi) and unzip in a convenient folder. Follow the instructions in [How do Deploy a WAR File to Tomcat](http://www.baeldung.com/tomcat-deploy-war) to deploy target/iotp-0.0.1-SNAPSHOT.war to webapp/iotp.war. Then start the tomcat server and visit [http://localhost:8080/iotp](http://localhost:8080/iotp). Here's a brief summary of the instructions:

1. Download and unzip [Tomcat 9](https://tomcat.apache.org/download-90.cgi)
2. Set $CATALINA_BASE to where you unzipped Tomcat 9
3. Make sure $CATALINA_BASE/bin/startup.sh, shutdown.sh and catalina.sh are executable
4. Edit $CATALINA_BASE/conf/tomcat-users.xml as needed
5. Edit $CATALINA_BASE/conf/server.xml as needed (perhaps to change the port)
6. copy target/iotp-0.0.1-SNAPSHOT.war to $CATALINA_BASE/iotp.war
7. Start the Tomcat Server using $CATALINA_BASE/bin/startup.sh
8. Visit [http://localhost:8080/iotp](http://localhost/iotp/) to access the Watson IoT Platform resources using the iotp-adaptor.

Here's some minimal sample commands that work on MacOS. Adjust the paths below to where you cloned iotp-adaptor and installed Tomcat, and open the link on the browser any way that is convenient for you. This also assumes you're using the default base uri of http://localhost:8080, port 8080, and scheme http in the iotp/WEB-INF/web.xml file.

```
cd ~/bin
wget http://www.trieuvan.com/apache/tomcat/tomcat-9/v9.0.7/bin/apache-tomcat-9.0.7.zip
unzip apache-tomcat-9.0.7.zip
CATALINA_BASE=apache-tomcat-9.0.7
cd $CATALINA_BASE/bin
chmod +x startup.sh shutdown.sh catalina.sh
cp ~/GitHub/iotp-adaptor/iotp-adaptor/target/iotp-0.0.1-SNAPSHOT.war $CATALINA_BASE/webapp/iotp.war
$CATALINA_BASE/bin/startup.sh
open /Applications/Safari.app http://localhost:8081/iotp

```

# Configuration

iotp-adaptor doesn't require much configuration, but there are a few things you may want to set. After Tomcat runs, iotp.war will be uncompressed into folder iotp. The iotp-adapter configuration parameters are in the iotp/WEB-INF/web.xml file. The default values are:

* com.ibm.oslc.adaptor.iotp.servlet.scheme: http
* com.ibm.oslc.adaptor.iotp.servlet.baseurl: http://localhost:8080
* com.ibm.oslc.adaptor.iotp.servlet.port: 8080

These values correspond to the defaults for Tomcat, so no editing is required if Tomcat is running on localhost and port 8080.

If these values need to change, edit them in the web.xml file. For example, here's how to change the port to 8081:

```
	<context-param>
		<description>Scheme used for URI when registering ServiceProvider.  Can be overridden by System property of the same name.</description>
		<param-name>com.ibm.oslc.adaptor.iotp.servlet.scheme</param-name>
		<param-value>http</param-value>
	</context-param>
	<context-param>
		<description>Base URI for the adaptor.</description>
		<param-name>com.ibm.oslc.adaptor.iotp.servlet.baseurl</param-name>
		<param-value>http://localhost:8081</param-value>
	</context-param>
	<context-param>
		<description>Port used for URI when registering ServiceProvider.  Can be overridden by System property of the same name.</description>
		<param-name>com.ibm.oslc.adaptor.iotp.servlet.port</param-name>
		<param-value>8081</param-value>
	</context-param>

``` 
