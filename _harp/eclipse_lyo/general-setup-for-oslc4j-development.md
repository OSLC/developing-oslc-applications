You first need to setup an Eclipse environment for general OSLC4J
development:

1.  Unless already installed, you need to first install the JDK 8 (see
    the [prerequisites](.7prerequisites-for-building-lyo-projects)).
1.  Install your preferred Eclipse distribution. Which distribution to
    use?
    -   [Eclipse IDE for Java EE
        Developers](https://www.eclipse.org/downloads/packages/eclipse-ide-java-ee-developers/lunasr2)
        seems to cover the necessary [prerequisites for Building Lyo
        Projects](Lyo/prereqs "wikilink").
    -   [Eclipse IDE for Java
        Developers](https://www.eclipse.org/downloads/packages/eclipse-ide-java-developers/lunasr2)
        can be used, together with the following 2 additional plugins:
        -   *Eclipse Java EE Developer Tools*
        -   *Eclipse Java Web Developer Tools*
1.  Once Eclipse is installed, you need to make sure the **JAVA\_HOME**
    environment variable is set to the installed JDK (instead of the
    default JRE).
    1.  Select ***Window\--\>Preferences***
    1.  Select ***Java\--\>Installed JREs***
    1.  Click ***Add\...***
    1.  In the new window that appears,
        1.  choose ***Standard VM*** as JRE Type
        1.  click ***Next***.
        1.  As ***JRE home*** choose the installation dir of your JDK
        1.  click ***Finish***.
    1.  Back to the preferences screen
        1.  select the old JRE
        1.  click ***Remove***
        1.  check the newly added JDK and
        1.  click ***OK***.
