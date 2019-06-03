# yarn-recursive

##### Recursively run yarn in a folder

Takes your tree and checks for package.json in every folder and runs `yarn` in every folder.

### Arguments

You can add arguments when running the command

```
$ yarn-recursive --cmd upgrade
yarn upgrade v1.1.0
success All of your dependencies are up to date.
Done in 0.22s.

Current yarn path: YOUR_PATH/yarn-recursive/package.json...
End of yarns

```

```
$ yarn-recursive --cmd upgrade --opt <package-name>
```

### Skip root

If you want to skip the root directory of your project, add the `--skipRoot` option:

```
$ yarn-recursive --skipRoot --cmd test
```

This is useful if, for example, you want to run yarn-recursive from a script in your root
package.json, which would otherwise cause infinite recursion.
