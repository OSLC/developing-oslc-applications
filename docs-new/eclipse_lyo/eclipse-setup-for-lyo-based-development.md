You first need to setup an Eclipse environment for general Lyo
development:

1.  Unless already installed, install JDK 21 to use Lyo 7.0 or newer. Earlier versions of Lyo may require JDK 17 (Lyo 6), JDK 11 (Lyo 5), or JDK 8 (Lyo 4).
    1. Maven version 3.8 or higher is required.
    1. **Pro tip:** use [SDKMAN!](https://sdkman.io/) to install multiple versions of JDK and Maven and switch between them depending on the project. We recommend `sdk install java 21-tem` provided by [Eclipse Temurin](https://adoptium.net/) as your default JDK.  
1.  Install [Eclipse IDE for Java EE
    Developers](https://www.eclipse.org/downloads/packages/release/2022-03/r/eclipse-ide-enterprise-java-and-web-developers)
    distribution. Alternatively, you need to install the plugins included in
    the JEE release, such as *Eclipse Java EE Developer Tools* and *Eclipse
    Java Web Developer Tools*.
1.  Once Eclipse is installed, you need to make sure the `JAVA_HOME`
    environment variable is set to the installed JDK (instead of the default
    JRE).
    1.  Select *Window➞Preferences*.
    1.  Select *Java➞Installed JREs*.
    1.  Click *Add...*
    1.  In the new window that appears,
        1.  Choose *Standard VM* as JRE Type.
        1.  Click *Next*.
        1.  As *JRE home* choose the installation dir of your JDK.
        1.  Click *Finish*.
    1.  Back to the preferences screen:
        1.  Select the old JRE.
        1.  Click *Remove*.
        1.  Check the newly added JDK, and
        1.  Click *OK*.

Eclipse M2E expects `JAVA_HOME` to be defined in the OS environment variables. This presents some challenges on macOS because Eclipse.app does not typically run from a user shell. To avoid having to start Eclipse.app from a Terminal, use `launchctl` set an environment variable to be set on all future processes launched by launchd in the caller's context. For example:

`launchctl setenv JAVA_HOME /Users/{userId}/.sdkman/candidates/java/current`

Substitute your user id for {userId}. If not using SDKMAN!, use the path to your Java 21 installation. After a reboot, `JAVA_HOME` will be set to your current [SDKMAN!](https://sdkman.io/) JDK.  

