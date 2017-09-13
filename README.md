# deep-clone-merge
Performs a deep cloned merge on supplied objects.
Arrays are cloned and overwritten, not merged.

```
const deepCloneMerge = require('deep-clone-merge');

let newObject = deepCloneMerge(objectOne, objectTwo, objectThree);
```
