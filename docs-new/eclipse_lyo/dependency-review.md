# Dependency review

Create an inventory of Maven dependencies before reviewing a release.
Run the command from the SDK repository root:

```sh
mvn -B dependency:list -Dstyle.color=never > dependencies-current.txt
```

Compare inventories from the previous release and the proposed release:

```sh
diff -u dependencies-previous.txt dependencies-current.txt
```

The inventory helps identify dependency changes. It does not establish that dependencies have completed IP review.
Consult the [Eclipse Dash license tool](https://github.com/eclipse-dash/dash-licenses) for current review tooling and options.

The earlier instructions on this page called the inventory comparison a “CQ diff”.
Use the current Eclipse review process when acting on the results.
