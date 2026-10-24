---
title: Release process
---

## Notes and explanations

We adopt the version qualifiers as suggested below ([Maven version sort reference](https://stackoverflow.com/a/31482463/464590)):

| Stage           |    SDK version   | Designer version  |
| --------        | ---------------- | ----------------- |
| devel           | `4.0.0-SNAPSHOT` | `4.0.0.qualifier` |
| alpha/beta      | `4.0.0.Alpha`    | `4.0.0.Alpha`     |
| candidate       | `4.0.0.CR`       | `4.0.0.CR`        |
| final (release) | `4.0.0.Final`    | `4.0.0.Final`     |
| devel-next      | `4.1.0-SNAPSHOT` | `4.1.0.qualifier` |


**NB!** 
* alpha/beta/candidate/final releases are exactly that - releases. Eclipse however only requires a formal review process on final releases. 
* major/minor/service releases are all final releases, and hence also require formal review process.
* Make sure to always **directly** do a Git revert after you make a release (or alpha/beta/candidate/final) release. This avoids double deploy of non-SNAPSHOT artifacts that can break the Jenkins build.

## Admin & overall release process

When to use Final, Candidate and Beta releases?
* When aiming for a final release, the plan is to first make one candidate release just before the final release, with little space in between for any significant changes. When aiming for a final release: 
  1. Initiate the Eclipse release process
  1. While being processed, create a Candidate release
  1. Once release is approved, create the Final release.
* In between final releases, at some milestones during development, it can be desired to make alpha/beta releases.  

The overall process to make a Final release (including its Candidate release)

1. Get familar with the review process in the [Eclipse Foundation Project Handbook](https://www.eclipse.org/projects/handbook/#release-review).

1. Create a release note from the "Create a new release" link on the [Eclipse Lyo project page](https://projects.eclipse.org/projects/technology.lyo) **(Final only)**
    1. Set the release name to be the Final release version you are aiming for.
    1. Paste the CHANGELOG of both Lyo and LyoDesigner into the Description under the Basic tab.
1. make a candidate CR1 release.
   1. Don't forget to revert git repo as soon as you make the release. 
   1. Test that the refimpl works with the CR.
   1. Email lyo-dev to invite people to test it.
1. Check for the date of the last Progress Review through this query https://gitlab.eclipse.org/eclipsefdn/emo-team/emo/-/issues/?sort=created_date&state=all&search=lyo&first_page_size=20. 
1. If more than 1 year passed since the last Progress Review, we are required to do a [Progress Review](#progress).
 1. IFF significant changes were made to the repo since CR1, make a new candidate CR2 release
 1. Edit and update the release note on https://projects.eclipse.org/projects/technology.lyo/ 
     1. This is only necessary, if - for example - you need to update the release date, or a change in the change log.
1. Make a final release
1. Announce on lyo-dev, oslc-op, and the OSLC Forum.


## Progress review

1. Request Progress Review through the "[Create a Progress Review](https://projects.eclipse.org/projects/technology.lyo/create-progress-review)" from https://projects.eclipse.org/projects/technology.lyo - unless Eclipse person (Maria?) created a ticket already.
     * This request will land at EMO and they will ultimately (after a few days) create a Gitlab ticket. You will receive an email with the ticket URL.
     * For reference, see this [ticket for Lyo 2024.09 review](https://gitlab.eclipse.org/eclipsefdn/emo-team/emo/-/issues/802) which shows what steps will be needed for approval. 

 1. You will need to wait for the Gitlab ticket before you can proceed. But, you can already do the following in the meantime
     1. Already ensure that **All distributed third-party content has been vetted by the IP Due Diligence process**
         1. As instructed under https://github.com/eclipse-dash/dash-licenses?tab=readme-ov-file#maven-plugin-options, run this command after obtaining the needed `token`
             ```
             mvn org.eclipse.dash:license-tool-plugin:license-check -Ddash.iplab.token=<token> -Ddash.projectId=technology.lyo
             ```
         1. keep a record of any tickets created to handle any necessary vetting.
         1. Monitor the progress of these tickets.

 1. Once you get the Gitlab link from the EMO mail, provide the following "Requisites" (but also some stuff is desired from the EMO), by adding the content as comments to the ticket itself.
     1. **3rd party dependencies provided (i.e. notice file, SBOM, etc. )** 
         1. Send the bom.xml/json files created under the `target` folder of the Lyo project.
     1. **PMC approval requested**
         1. Request a release approval from the PMC. You can do this from the "Send Email to the PMC" you can find under https://projects.eclipse.org/projects/technology.lyo. Send a simple email, with simple links to the release entry, & Gitlab ticket.
             ```
             Title: PMC approval for the Lyo progress review
             Body:
             Dear PMC,
             We request a PMC approval for the Lyo progress review.
             <Progress review gitlab ticket https://gitlab.eclipse.org/eclipsefdn/emo-team/emo/-/issues/xxx>
             <Lyo release note https://projects.eclipse.org/projects/technology.lyo/releases/xxx>
             regards
             Jad El-khoury, Lyo project lead
             ```
         2. Reference the PMC approval request in the Gitlab ticket 
             1. select "PMC Mailing list" from https://projects.eclipse.org/projects/technology.lyo
             1. navigate to the archive to find the email we just sent.
             1. Add the link to that email to the progress review gitlab  ticket.
     1. **All distributed third-party content has been vetted by the IP Due Diligence process (i.e., IP Log has been approved)** 
         1. Refer to any newly created ticket by the IP Due Diligence process

## Part 1: SDK libraries to Maven Central

### Phase 1a: New version, Git push, and Eclise Maven release deploy

1. Make sure you are on master and the repo is clean and pulled.
1. create a new branch 
1. `mvn versions:set -DnewVersion="4.1.0.xx"`
1. Edit the `CHANGELOG.md` and replace  `[Unreleased]` with the release version `[#.#.#]`.
1. Push that new branch and create a PR. 
1. If the release is `Final`, get at least one approval.
1. Once reviewed & approved, merge the PR to master.
1. Wait for the build to succeed on [Eclipse Lyo Jenkins](https://ci.eclipse.org/lyo/view/1Enabled/job/Lyo%20multibranch/job/master/).
1. Pull the latest master, and tag the release
	1. `git tag v4.1.0.xx` (the `v` letter + exact ident from `artifactId` in the POM)
	2. `git push --tags`
1. Draft a new release note under https://github.com/eclipse/lyo/releases. 
    1. For `Final` release, leave the "Set as a pre-release" checkbox empty. Otherwise, tick it. 
    1. Set the appropriate tag under "choose a tag"
    1. Duplicate the relevant content from the ChangeLog, but also add a statement that "This content is a duplicate of the [Change Log](https://github.com/eclipse/lyo/blob/v4.1.0.xx/CHANGELOG.md) (make sure to point to the tagged revision, not to master)
    1. Prepare a placeholder (a LyoDesigner subheading) for ChangeLog content for the LyoDesigner part (See part2 below)
    1. Once done, save by pressing “Save draft” (and not “publish release”)

![](https://i.imgur.com/kaBC5G0.png)


### Phase 1b: Testing on OSLC RefImpl

Steps:
1. Make sure you are on master and the repo is clean and pulled.
1. create a new branch
1. Edit the pom.xml files (needed in all 6 projects) of the refImpl to set the Lyo version to that of the release to test.
1. Push the branch to Github and create a PR
1. Go to the [Refimpl Actions](https://github.com/oslc-op/refimpl/actions/workflows/maven-acceptance-manual.yml)
    1. Select the "CI acceptance tests (MANUAL)" action.
    1. Click "Run workflow"
    1. Select the branch where we made the change
    1. Wait for success.
1. Merge branch to master if/when the workflow succeeds.

### Phase 1c:  Promote to Maven Central

1. Log in to https://oss.sonatype.org/#welcome (legacy host, Lyo is on the "legacy" host) 
1. go to **[Staging Repositories](https://oss.sonatype.org/#stagingRepositories)**.
3. Select the listed Lyo repository and click **Close**. This may take a few minutes. See [OSSRH docs](https://central.sonatype.org/publish/release/) for more info.
4. Click **Release** (you may need to refresh first (every few minutes)). In pop up window, leave *Automatically Drop* option ON unless you know what you are doing (the release action is irreversible anyway).
5. Publish the previously saved draft (pre)release note under https://github.com/eclipse/lyo/releases
     1. I am suggesting we move this from here, and add it to the end of the whole process. Since we want to capture LyoDesigner changes first.
6. Keep refreshing on sonatype from time to time (every few minutes). When the list becomes empty, the release is finished! 
7. Visit https://repo1.maven.org/maven2/org/eclipse/lyo/oslc4j/core/oslc4j-core/ to check if the artifacts were promoted to Maven Central from OSSRH already (this usually takes around 2hrs).
 
### Phase 1d: Bring the master branch back to the SNAPSHOT state

> Once you have confirmed that the release build has concluded, you can do these steps, no need to wait for the Maven Central promotion.

**If you released a non-`Final`**:
  1. build, revert the release comment to go back to the snapshot version 

        ```
        git checkout master
        git pull
        git revert --no-commit HEAD
        git commit -m "Continue the SNAPSHOT development"
        git push
        ```

**If you released a `Final` release**:
  1. use `versions:set` to set the next planned version with the `SNAPSHOT` modifier, e.g. for 4.1.0 release :
        ```
        git checkout master
        git pull
        mvn versions:set -DnewVersion="4.2.0-SNAPSHOT"
        ```

  1. Edit the `CHANGELOG.md` and add the `[Unreleased]` template from the bottom of the file to the top
  1. Commit and push the changes.
        ```
        git commit -m "Continue the SNAPSHOT development"
        git push
        ```


## Part 2: Lyo Designer

### Relevant Links
Links:

- [Product releases](https://download.eclipse.org/lyo/product/binaries/releases/ "https://download.eclipse.org/lyo/product/binaries/releases/")
- [Update site releases](https://download.eclipse.org/lyo/p2/releases/)
- [OSGi bundle releases](https://download.eclipse.org/lyo/bundle/p2/releases/)

Stable:

- [Update site releases](https://download.eclipse.org/lyo/p2/stable/)

### Notes

Notes relating to the dependencies between Lyo Designer and the Lyo SDK:
1. the OSGI bundles module (org.eclipse.lyo.oslc4j.plugins) depend on a specific version of the Lyo SDK. This is set with `<properties>...<lyo.version>...</lyo.version></properties>`
1. Lyo Designer (org.eclipse.lyo.tools.toolchain.design) proposes a default version of the Lyo SDK for newly created models. This can be see in the 4+ places in the file `description/ToolChainModel.odesign`, by searching for `featureName="lyoVersion" valueExpression=...`

### Preparations

Before starting the release process for Lyo Designer
1. Finalize the release process of the Lyo SDK (at least the CR).
1. Update the above modules, to refer to the corresponding version of the Lyo SDK.  
1. Push the changes to master for LyoDesigner
1. Start the release process for LyoDesigner


### Release steps

The steps below apply to release a candidate (eg. 4.0.0.CR), as well as to make a final release (4.0.0.Final). The same steps apply for both phases, except for the choice of version number. The final step has a variation, which is detailed below.

1. Switch to the master branch of LyoDesigner and do a `git pull`.
1. Create a new branch for the release.
1. Run on the command line (cd to lyo.designer folder first):  
    `mvn -f pom.xml org.eclipse.tycho:tycho-versions-plugin:set-version -DnewVersion='<versionNumner>' -DforceStdout -B`
    1.  Set <versionNumber> to, e.g., `4.0.0.CR` or `4.0.0.Final`
    1.  That is, make sure to add .Final to a final version. Otherwise update will not work.
1.  For the org.eclipse.lyo.oslc4j.plugins artifact, manually update the artifact version. (this is not updated via the Tycho plugin above)
1. Run the following commands in bash to verify a clean version update. Besides test plugins, there should be no artefact that refers to a qualifier nor SNAPSHOT version:
   1. `grep --exclude-dir=.git --exclude-dir=target --exclude-dir=bin -rE "qualifier" . 2>/dev/null`
   1. `grep --exclude-dir=.git --exclude-dir=target --exclude-dir=bin -rE "SNAPSHOT" . 2>/dev/null`
   1. Fix any remaining versions that are not as expected (e.g. updatesite.site.xml).
1. Edit the `CHANGELOG.md` and replace  `[Unreleased]` with `[#.#.#]`.
1.  Push the branch and make a pull request.  
1.  Merge. This will trigger the CI build to create artefacts on edge. (might want to go to [https://ci.eclipse.org/lyo/job/lyo-designer-master/](https://ci.eclipse.org/lyo/job/lyo-designer-master/) and manually start the build to make it faster)
1. Once edge is built, download/update and test LyoDesigner. 
   1. Does it work in general? 
   1. Does it generate code as expected?
   1. Does it have the correct plugin versions? Select `Help > About Lyo Designer > Installation Details` and then check the versions of `Installed Software`.
   1. In a generated OSLC Server, make sure that the generated `Application` class has the right version ID, e.g. *Generated by Lyo Designer 4.0.0.CR* and DOES NOT include a timestamp. Timestamp is a sign of a `.qualifier` version in OSGI manifests.

1. Pull the latest master, and tag the release.
	1. `git tag v4.1.0.xx`
	2. `git push --tags`
1. Draft a new release note under https://github.com/eclipse/lyo.designer/releases. 
    1. Since we are aiming for a single release note for Lyo SDK and Lyo Designer, the note under the lyo.designer repo should simply link to the Lyo SDK release note.
    1. Change the release note on the Lyo repository by adding the relevant content from the LyoDesigner ChangeLog. Also add a statement that "This content is a duplicate of the Change Log (make sure to point to the tagged revision, not to master)
    1. For `Final` release, leave the "Set as a pre-release" checkbox empty. Otherwise, tick it. 
    1. Set the appropriate tag under "choose a tag"
    1. Once done, save by pressing “Save draft” (and not “publish release”).
1. run the release job https://ci.eclipse.org/lyo/job/lyo-designer-release/build?delay=0sec to copy artefacts from edge to stable This will prompt you for the version id. (e.g., `4.0.0.CR` or `4.0.0.Final`).
1.  Once stable is built, run the promote job [https://ci.eclipse.org/lyo/job/lyo-designer-promote/](https://ci.eclipse.org/lyo/job/lyo-designer-promote/). THis will prompt you for the version id. (e.g., `4.0.0.CR` or `4.0.0.Final`)
1. Bring the `master` branch to a SNAPSHOT/qualifier state. This steps differs depending on whether you just made a `Candidate` (e.g., alpha1, beta1, CR) or `Final` release.

**If you made a Candidate release** 
  1. Do a Git revert and push this commit.
        ```
        git checkout master
        git pull
        git revert --no-commit HEAD
        git commit -m "Continue the SNAPSHOT development"
        git push
        ```
  1. Go to Step 1 above to do the final release
        
**If you made a `Final` release**, 
  1. push the changes below directly to master
        ```
        git checkout master
        git pull
        ```
  1. Bump the version number up a bit. Set the `<versionNumber>` to something such as `4.0.1-SNAPSHOT` or `4.1.0-SNAPSHOT`.
        ```
        `mvn -f pom.xml org.eclipse.tycho:tycho-versions-plugin:set-version -DnewVersion='<versionNumber>' -DforceStdout -B`
        ```

  1. For the org.eclipse.lyo.oslc4j.plugins artifact, manually update the artifact version. (this is not updated via the Tycho plugin above)
  1. For the org.eclipse.lyo.oslc4j.plugins artifact, manually change the Lyo version from which the plugins are to be made. (preferably, the same version as what was just been bumped to). `<lyo.version>4.1.0-SNAPSHOT</lyo.version>`
  1. **TODO** search for any traces of `.Final` modifier. Replace as necessary (most likely with `.qualifier`).
  1. Edit the `CHANGELOG.md` and copy the `[Unreleased]` template from the bottom and paste it at the top with the new snapshot vesion as heading.
  1. Commit and push the changes to master. (can have the message "Continue the SNAPSHOT development")
  1. The new snapshot will be built and released to "edge"
  1. You are done!
 
## Part 3: Publish and Announce the release
1. Publish the previously saved draft (pre)release note under https://github.com/eclipse/lyo/releases
1. Publish the previously saved draft (pre)release note under https://github.com/eclipse/lyo.designer/releases
1. Announce to the world (OSLC Forum and Lyo-dev mailing list) about the release (final or otherwise)