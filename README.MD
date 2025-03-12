# 开发
```
npx electron-builder build
```

# 创建图标
```
./node_modules/.bin/electron-icon-maker --input=build/icon.png --output=build/
```

# 构建所有平台的包
```
npm run build
```

# 构建指定平台的包

```
npm run build:electron -- --win
npm run build:electron -- --mac --x64
npm run build:electron -- --mac --arm64
npm run build:electron -- --linux  --x64
npm run build:electron -- --linux  --arm64
```