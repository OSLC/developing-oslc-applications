# Lyo client

The Lyo Java client provides CRUD operations on OSLC resources and supports service discovery.
It is part of the [Lyo SDK repository](https://github.com/eclipse-lyo/lyo/tree/main/client).

## Configure the HTTP client

The current `OslcClient` accepts a Jakarta REST `ClientBuilder`.
Configure TLS, authentication and other HTTP behaviour through that builder before passing it to the client.
See the [constructor documentation and implementation](https://github.com/eclipse-lyo/lyo/blob/main/client/oslc-client/src/main/java/org/eclipse/lyo/client/OslcClient.java).

## Migrate older applications

Earlier versions used Apache Wink and Java EE packages.
The design discussion previously on this page described that historical implementation.
Use the [migration guides](migration-overview.md) for supported version transitions:

- [Lyo 2.x to 4.x](migration-2x-4x.md): migration from the older client stack.
- [Lyo 5.x to 6.x](migration-5x-6x.md): migration to Jakarta packages.
- [Lyo 6.x to 7.x](migration-6x-7x.md): current baseline and dependency changes.

## Resource serialisation errors

If a `WebApplicationException` occurs before sending a request, check resource serialisation.
Resources other than `LocalResource` need a URI.
For a new resource submitted to a creation factory, a generated UUID URN can identify the resource before the server assigns its URL.
