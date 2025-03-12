# Package
```
npx electron-builder build
```

# Create Icon
```
./node_modules/.bin/electron-icon-maker --input=build/icon.png --output=build/
```

# 构建所有平台的包
```
npm run build:electron -mwl
```


```
npm run build:electron -- --win
```

```
npm run build:electron -- --mac --x64
npm run build:electron -- --mac --arm64
```

```
npm run build:electron -- --linux  --x64
npm run build:electron -- --linux  --arm64
```