# Overview #
- This repo will be used by devs to develop projects hosted on Matrix
- Work related to each project should happen on a separate branch with PROJECT-NAME as branch name. This branch will be release candidate

# Starting a new project #
A project boilerplate has been set up called `project-template`. When starting a new project, copy this folder and paste it into the `franchises` directory, renaming it to PROJECT-NAME. 

All configuration files to work with SWE have been included in this boilerplate.

- Create all feature/custom/bugfix branches planned for release from release candidate branch. If there is an associated JIRA ticket, add ticket number to the branch name and commits
- Merge all feature/custom/bugfix branches planned for release into release candidate branch. This must be peer reviewed by QOL team.
- Pre Go-live merge it to master branch
- On matrix, each project will have its own Git bridge pulling files from project's folder. This isolates releases on each projects.