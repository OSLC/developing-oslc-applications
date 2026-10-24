# Release the Lyo Java SDK

The SDK release uses a version-change pull request, the Jenkins publication pipeline and a GitHub release.
These instructions apply to the SDK. Lyo Designer has a separate repository and build process.

## Choose the versions and approval mode

Check the [published releases](https://github.com/eclipse-lyo/lyo/releases), current POM version and changelog before choosing a version.
After `7.0.0.Beta3`, possible next versions include `7.0.0.Beta4`, `7.0.0.CR1` and `7.0.0.Final`.

Agree on the approval mode before starting:

- **Autopilot:** proceed through merge, publication and return to development after the required checks succeed.
- **Semi-auto:** obtain developer approval at each of those stages after preparing its changes and evidence.

Also agree on the next development version.
A preview normally returns to the same development version, such as `7.0.0-SNAPSHOT`.
A final release normally advances to the next patch, such as `7.0.1-SNAPSHOT` after `7.0.0.Final`.

## Prepare the release pull request

Start a branch from current `main` and use the JDK required by the POM and Jenkinsfile (currently JDK 21).
From the reactor root, set the chosen version:

```sh
mvn -B versions:set -DnewVersion=7.0.0.Beta4 -DprocessAllModules=true -DgenerateBackupPoms=false
```

Check all reactor POMs, internal dependencies and version properties.
In particular, check `version.lyo` in `domains/oslc-domains/pom.xml`.

Change the active changelog heading from:

```markdown
## [UNRELEASED] - YYYY-MM-DD
```

to the chosen version and release date, for example:

```markdown
## [7.0.0.Beta4] - 2026-10-24
```

Keep the cumulative changelog content and the template at the bottom.
Add the release’s named link using the actual preceding tag:

```markdown
[7.0.0.Beta4]: https://github.com/eclipse-lyo/lyo/compare/v7.0.0.Beta3...v7.0.0.Beta4
```

Run the project checks, push the branch and open a pull request against `main`.
Wait for all required checks and reviews on its current head.
In semi-auto mode, obtain approval before merging.
Record the merged release revision.

## Wait for Jenkins publication

Wait for the matching run of [Lyo multibranch: main](https://ci.eclipse.org/lyo/job/Lyo%20multibranch/job/main/).
Confirm that it built the merged release revision and completed successfully, including **Publish (OSSRH)**.
The [Jenkinsfile](https://github.com/eclipse-lyo/lyo/blob/main/Jenkinsfile) defines artifact signing, deployment and Javadoc publication.

If publication fails or its result is uncertain, investigate before proceeding.
Do not automatically repeat a non-SNAPSHOT deployment: some immutable artifacts may already have been published.
The former manual staging and promotion instructions are superseded by the current pipeline.

## Publish the GitHub release

Prepare the release notes:

- For `.Final`, copy the body of the corresponding changelog section.
- For previews, include only changes since the previous preview in the same release line.
  Compare the actual preceding preview tag with the release revision and exclude changes already released.

Resolve any named links so that the notes render independently.
In semi-auto mode, obtain approval for the prepared notes, tag and target revision before publication.

Create the GitHub release with a `v<version>` tag at the verified release revision on `main`.
GitHub can create the tag when creating the release.
Mark every version without the `.Final` suffix as a prerelease.
Verify the remote tag target, release notes and prerelease setting.

## Return to development

Restore development promptly after verifying the GitHub release and tag.
Further builds at the release version can attempt to republish immutable artifacts.
In semi-auto mode, obtain approval for the prepared restoration changes.

For a preview, revert only the release version and changelog-heading/link changes.
Restore the original same-line SNAPSHOT and UNRELEASED section.
Use the recorded release-change commit; do not blindly revert the latest commit.
Preserve any separate changelog-format correction and intervening changes.

For a final release, set the agreed next SNAPSHOT version.
Copy the bottom changelog template above the released entries and retain the released section.
Update the named links, for example:

```markdown
[UNRELEASED]: https://github.com/eclipse-lyo/lyo/compare/v7.0.0.Final...HEAD
[7.0.0.Final]: https://github.com/eclipse-lyo/lyo/compare/v7.0.0.Beta4...v7.0.0.Final
```

Commit and push the development changes, using a pull request when required.
Verify the resulting SNAPSHOT build.
