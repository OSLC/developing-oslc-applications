This section provides an overview of https and Secure Sockets Layer (SSL) as a useful reference for dealing with secure connections with OSLC servers. 

You can configure Jetty, Tomcat, or any Web server to handle creation of self-assigned certificates that users can accepts then challenged by their browsers. 

This makes handling SSL relatively easy, and provides increased security at low development cost.

The details below are provided for reference in case they are needed.

## [Overview of SSL and digital certificates](https://www.ibm.com/support/knowledgecenter/en/SSRMWJ_6.0.0/com.ibm.itim_pim.doc/wadpwdsync/install_config/c_pwd_sslcfg_cert.htm?view=kc)

SSL uses public key encryption technology for authentication. In public key encryption, a public key and a private key are generated for an application. Data encrypted with the public key can only be decrypted using the corresponding private key. Similarly, the data encrypted with the private key can only be decrypted using the corresponding public key. The private key is password-protected in a key database file so that only the owner can access the private key to decrypt messages that are encrypted using the corresponding public key.

Here's a brief summary of the SSL protocol interaction sequence:

1. A browser or client app requests a secure page (usually https://).
2. The web server sends its public key with its certificate.
3. The browser checks that the certificate was issued by a trusted party (usually a trusted root Certificate Authority or CA), that the certificate is still valid, and that the certificate is related to the site contacted.
4. The browser then uses the public key, to encrypt a random symmetric encryption key and sends it to the server with the encrypted URL required as well as other encrypted http data.
    * Asymmetric encryption is used to establish the connection and a shared symmetric encryption key that can be used by the  client and server to encrypt and decrypt requests and responses. The client uses the public key to encrypt the random symmetric encryption key. Only the server with the private key can decrypt this message
    * But for the rest of the request/response, the symmetric encryption key is used to encrypt/decrypt on both ends. The client and server both know this key for the duration of the request/transaction 
5. The web server decrypts the symmetric encryption key using its private key and uses the symmetric key to decrypt the URL and http data. 
6. The web server sends back the requested resource and http data encrypted with the symmetric key. 
7. The browser decrypts the http data and html document using the symmetric key and displays the information.

## [Configuring Jetty for SSL](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#configuring-sslcontextfactory)

These are the overall steps:

1. [Generating Key Pairs and Certificates](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#generating-key-pairs-and-certificates)
2. [Requesting a Trusted Certificate](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#requesting-trusted-certificate)
3. [Loading Keys and Certificates](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#loading-keys-and-certificates)
4. [Configuring the Jetty SslContextFactory](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#configuring-sslcontextfactory)

### [Generating Key Pairs and Certificates](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#generating-key-pairs-and-certificates)

Use command [keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) bundled with the jdk to create a self-signed certificate instead of using a certificate authority. 

Store this in your truststore. When the connector starts, there may be a warning that this site is unsafe. Ignore it. server.xml is what enables https, and manages the certificate. Use keytool to store the the certificate into Tomcat or Liberty.

If you want the option of using the same certificate with Jetty or a web server such as Apache not written in Java, you might prefer to generate your private key and certificate with OpenSSL.

### [Keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html)

The keytool command is used for self-authentication or data integrity and authentication services using digital signatures. Use the keytool command to:

* Administers your public/private key pairs and associated certificates
* Administer secret keys and passphrases (i.e., long passwords) used in symmetric encryption and decryption (DES)
* Store the keys and certificates in a keystore
* Cache the public keys (in the form of certificates) of communicating peers

**Certificate** a digitally singed statement between parties that says the public key of some other entity has a particular value.

* signature - can be verified to check the data integrity and authenticity.
* Integrity - data has not been modified
* authenticity - data is from who claims to have created and signed it.

For example: 

```
cd ~/workspace/iotp-adaptor
keytool -keystore keystore -alias jetty -genkey -keyalg RSA -validity 360

Enter keystore password: passw0rd
Re-enter new password:
What is your first and last name?
  [Unknown]:  Fred Johnson
What is the name of your organizational unit?
  [Unknown]:  Acme
What is the name of your organization?
  [Unknown]:  Acme Development
What is the name of your City or Locality?
  [Unknown]:  Boston
What is the name of your State or Province?
  [Unknown]:  MA
What is the two-letter country code for this unit?
  [Unknown]:  US
Is CN=Fred Johnson, OU=Acme, O=Acme Development, L=Boston, ST=MA, C=US correct?
  [no]:  yes

Enter key password for <jetty>
	(RETURN if same as keystore password): passw0rd
Re-enter new password:
```

### [Requesting a Trusted Certificate ](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#requesting-trusted-certificate)

The above will generate a minimal certificate for SSL, but the browser will not trust this certificate and will prompt the user to that effect, asking them to trust you and add the self-assigned certificate. Some users may be unwilling to do so.

Optionally you can generate a Certificate Signing Request (CSR) to have the certificate signed by a third-party certificate authority (CA) that is already configured in the user’s browser. These signed certificates will be automatically added to the browser. This is usually not free, your company may have specific policies for CSR. CAs include: AddTrust, Entrust, GeoTrust, RSA Data Security, Thawte, VISA, ValiCert, Verisign, and beTRUSTed.

### [Loading Keys and Certificates](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#loading-keys-and-certificates)

Once a CA has sent you a certificate, or if you generated your own certificate without keytool, you need to load it into a JSSE keystore. This is not needed if you generated a self-assigned certificate with keytool as the keystore already contains the self-assigned certificate.

Use keytool to load a certificate in PEM form directly into a keystore. The PEM format is a text encoding of certificates.

```
keytool -keystore keystore -import -alias jetty -file jetty.crt -trustcacerts
```

### [Configuring the Jetty SslContextFactory](https://www.eclipse.org/jetty/documentation/current/configuring-ssl.html#configuring-sslcontextfactory)

For Tomcat, edit server.xml and configure a connector:

```
<Connector 
	port="443" maxHttpHeaderSize="8192" maxThreads="150"
	minSpareThreads="25" maxSpareThreads="75"
	enableLookups="false" disableUploadTimeout="true"
	acceptCount="100" scheme="https" secure="true"
	SSLEnabled="true" clientAuth="false"
	sslProtocol="TLS" keyAlias="server" 
	keystoreFile="/home/user_name/your_site_name.jks" 
	keystorePass="your_keystore_password" />
```

DN contains: CN is the website, OU is subdivision of the company, O is the company name, L is the city, S is the province/state and C is the country code.

There are two kinds of certificates, ones that contain the private key and ones that don’t. keytool never import/exports private keys.

For the Jetty Distribution, edit `<jetty-base>/start.d/ssl.ini` and set the following properties. Note: use the Eclipse Jetty Project with an installed Jetty runtime which automates much of the configuration. 

These instructions are applicable to an installed Jetty runtime, and are retained for completeness. 

Directory <jetty-dist>/start.d contains

* server.ini
* ssl.ini

Uncomment and configure the following properties in ssl.ini:

* jetty.ssl.host Configures which interfaces the SSL/TLS Connector should listen on.
* jetty.ssl.port Configures which port the SSL/TLS Connector should listen on.
* jetty.httpConfig.securePort If a webapp needs to redirect to a secure version of the same resource, then this is the port reported back on the response location line (having this be separate is useful if you have something sitting in front of Jetty, such as a Load Balancer or proxy).
* jetty.sslContext.keyStorePath Sets the location of the keystore that you configured with your certificates.
* jetty.sslContext.keyStorePassword Sets the Password for the keystore.

```
java -jar /path/to/jetty-dist/start.jar --add-to-start=ssl
```

In eclipse jetty, ${jetty.base}/start.d

### [Configuring the jetty maven plugin](https://www.eclipse.org/jetty/documentation/9.4.x/jetty-maven-plugin.html) for SSL/TLS support

Note: While the Jetty Maven Plugin can be very useful for development we do not recommend its use in a production capacity. In order for the plugin to work it needs to leverage many internal Maven apis and Maven itself it not a production deployment tool. We recommend either the traditional distribution deployment approach or using [embedded Jetty](https://www.eclipse.org/jetty/documentation/9.4.x/advanced-embedding.html).

```
mvn jetty:run # runs jetty on an unassembled webapp

mvn jetty:help -Ddetail=true -Dgoal=<goal name>
```

See the list of goals supported by maven Jetty plugin.

### [Configuring Jetty Connectors](https://www.eclipse.org/jetty/documentation/9.4.x/configuring-connectors.html)

Jetty 9 has a single selector-based non-blocking I/O connector, and a collection of [ConnectionFactories](http://www.eclipse.org/jetty/javadoc/9.4.6-SNAPSHOT/org/eclipse/jetty/server/ConnectionFactory.html) now configure the protocol on the connector.

See [How To Configure Jetty for SSL/HTTPS](http://whitehorseplanet.org/gate/topics/documentation/public/jetty_ssl_configuration.html)


## Using Eclipse Jetty Project

The Eclipse Jetty Project, accessed from the Eclipse Marketplace, provides a launch configuration for launching a Jetty server out of eclipse. It can work with the bundled Jetta or a manually installed Jetty.

√ Install jetty https://www.eclipse.org/jetty/download.html

√ edit .bash_profile and add:

`export JETTY_HOME=~/Applications/jetty-distribution-9.4.5.v20170502`

√ Create a JETTY_BASE - not needed, created by Eclipse Jetty

√ Install the Eclipse Jetty Integration plugin
From the eclipse marketplace.

√ Create a Jetty Webapp lunch configuration
This works with http and https exactly as expected.
