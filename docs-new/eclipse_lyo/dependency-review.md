---
title: Dependency review
---

To make a dependency list:

    mvn dependency:list | grep :jar: | grep INFO | sort -u > FILE_A

To make a CQ diff between two dependency lists:

    diff FILE_A FILE_B | grep '>' > cq_diff-A_B.txt