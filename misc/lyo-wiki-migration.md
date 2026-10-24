# Lyo wiki migration follow-up

Source repository: `https://github.com/eclipse-lyo/lyo.wiki.git`  
Imported revision: `7bfdac6688a13f7965f8e1a3c4cb2ad8a8c4784f`

The import commit preserves each page body byte for byte. Only title frontmatter and navigation are added.
Corrections belong in a subsequent commit.

## After the documentation PR merges

Do not edit or push the source wiki before the documentation PR is merged.
Verify that every destination below is deployed. Then prepend this notice to each source page, preserving its remaining content:

```markdown
> [!NOTE]
> This page has moved to [<title>](<destination>). Use the maintained documentation there.
```

Record the merged documentation PR and completed wiki changes here when they happen.

| Source page | Destination | Top notice |
| --- | --- | --- |
| [ Home ](https://github.com/eclipse-lyo/lyo/wiki/Home) | [Contributor overview](https://oslc.github.io/developing-oslc-applications/eclipse_lyo/contributor-overview/) | Pending docs merge |
| [ Doing-CQs ](https://github.com/eclipse-lyo/lyo/wiki/Doing-CQs) | [Dependency review](https://oslc.github.io/developing-oslc-applications/eclipse_lyo/dependency-review/) | Pending docs merge |
| [ Lyo-5.0-migration-notes ](https://github.com/eclipse-lyo/lyo/wiki/Lyo-5.0-migration-notes) | [Lyo 5.0 migration notes](https://oslc.github.io/developing-oslc-applications/eclipse_lyo/lyo-5-migration-notes/) | Pending docs merge |
| [ Lyo-Client ](https://github.com/eclipse-lyo/lyo/wiki/Lyo-Client) | [Lyo client](https://oslc.github.io/developing-oslc-applications/eclipse_lyo/lyo-client/) | Pending docs merge |
| [ Lyo-Release-Process ](https://github.com/eclipse-lyo/lyo/wiki/Lyo-Release-Process) | [Release process](https://oslc.github.io/developing-oslc-applications/eclipse_lyo/release-process/) | Pending docs merge |
| [ OSLC-Documentation-Sites ](https://github.com/eclipse-lyo/lyo/wiki/OSLC-Documentation-Sites) | [Documentation sites](https://oslc.github.io/developing-oslc-applications/eclipse_lyo/documentation-sites/) | Pending docs merge |
