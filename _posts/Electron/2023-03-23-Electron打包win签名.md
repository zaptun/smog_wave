---
layout: post
filename: 2023-03-23-Electron打包win签名
title: Electron打包win签名
date: 2023-03-23 11:25:55 +0800
categories: electron
tags: 签名 jsign
---

文件如下

1. `hardwareToken.cfg`

```
name = BossHi
library = /Library/Frameworks/eToken.framework/Versions/A/libeToken.dylib
slotListIndex = 0
```

2. `sign-win.ts`

```typescript
import { resolve } from "path";
import { exec, execSync } from "child_process";

const jarFile = resolve(__dirname, "jsign-4.2.jar");
const hardwareToken = resolve(__dirname, "hardwareToken.cfg");
console.log("jarFile ===>", jarFile);
/**
 * EV Code Sign, 针对windows应用活文件做代码签名
 * @param {string} filePath:string - 文件的绝对路径
 * @returns {any}
 */
export const signFile = (filePath: string): Promise<any> => {

    return new Promise(async (resolve, reject) => {

        console.log("signFile filePath ===>", filePath);

        //sign info
        const CERTIFICATE_NAME = "Beijing Huapin Borui Internet Technology Co.,Ltd.";

        //ev token password
        const tokenPassword = "FIb0@7!ZjSxY5k@O";

        if (/\.exe|\.dll/.test(filePath)) {
            execSync(
                `java \
                -jar ${jarFile} \
                --keystore ${hardwareToken} \
                --storepass "${tokenPassword}" \
                --storetype PKCS11 \
                --alias "${CERTIFICATE_NAME}" \
                --tsaurl http://timestamp.comodoca.com/rfc3161 \
                --tsmode RFC3161 \
                --alg SHA-256 \
                --replace \
                "${filePath}" 
                `, {
                stdio: "inherit",
                }
            );
            resolve("success");
        } else {
            reject("get wrong path or file type");
        }
    });
}
```