Prerequisites for Building Lyo Projects
-   [Eclipse 3.6 or higher IDE](http://eclipse.org/downloads)
-   [EGit](http://eclipse.org/egit/download/) team provider for Git or
    the [Git command line package](http://git-scm.com/download).
-   [m2eclipse](http://eclipse.org/m2e/) for Maven support in the
    Eclipse IDE
-   **Java 1.8**

Eclipse Mars.2 (4.5.4), installation package Eclipse IDE for Java EE
Developers includes EGit, m2eclipse and the JARs required for Dynamic
Web Modules, resulting in a single download that for OSLC4J development.

If you wish to use Java 1.6 or 1.7, you will need modify the Antlr
dependency. Eclipse/Lyo currently uses Antlr 3.5.1 which is incompatible
with versions of Java prior to 1.8. If you use Java 1.7 or earlier, you
will need to modify the pom.sml files to use Antlr version 3.2 instead
of 3.5.1.

> See <https://bugs.eclipse.org/bugs/show_bug.cgi?id=472637> if you are
> interested in the details

### Information for older Lyo installations

Prior to November 2015, Lyo required Java 1.6 or newer compiler and
runtime. The Eclipse project settings have been set appropriately. If
you are building outside of Eclipse, please use Java 1.6.

> **IBM JVM/JRE Users:** There is an issue with older m2eclipse versions
> and the the IBM JRE. If you have see the error
> **java.lang.NoClassDefFoundError: org.slf4j.impl.StaticLoggerBinder**
> when running a Maven install, you either need to upgrade m2eclipse or
> copy a newer slf4j api jar into your JRE directory to work around the
> issue until it is fixed:
>
> -   Download [slf4j-1.6.2.zip](http://slf4j.org/dist/slf4j-1.6.2.zip)
>     and extract the zip.
> -   Copy slf4j-api-1.6.2.jar from the slf4j distribution to the
>     JAVA\_HOME\\jre\\lib\\ext directory
>
> See <https://bugs.eclipse.org/bugs/show_bug.cgi?id=338252> if you are
> interested in the details
