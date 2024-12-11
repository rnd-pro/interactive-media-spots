# IMS - Interactive Media Spots

A lightweight collection of web components for interactive media visualization.

## Features

- **Responsive Design**: All components automatically adapt to container size
- **Modern Web Standards**: Built using native web components
- **Lightweight**: Minimal dependencies and optimized performance
- **Easy Integration**: Simple HTML markup for implementation

## Components

### ims-diff
An image comparison widget with slider control. Perfect for before/after visualizations.

```html
<ims-diff src-data="./diff-data.json"></ims-diff>
```

Configuration example:
```json
{
  "imsType": "diff",
  "baseUrl": "https://your-cdn.com/",
  "variants": ["320", "640", "860", "1024"],
  "cdnIdList": ["image1-id", "image2-id"],
  "filters": ["grayscale(100%)", "none"]
}
```

### ims-gallery
An interactive image gallery with touch support and fullscreen capabilities.

```html
<ims-gallery src-data="./gallery-data.json"></ims-gallery>
```

### ims-pano
A 360° panorama viewer with touch/mouse controls and zoom functionality.

```html
<ims-pano src-data="./pano-data.json"></ims-pano>
```

Configuration example:
```json
{
  "imsType": "pano",
  "autoplay": false,
  "baseUrl": "https://your-cdn.com/",
  "variants": ["640", "1024", "2048"],
  "cdnIdList": ["panorama-image-id"]
}
```

### ims-spinner
A 360° object viewer that supports sequence animation and interactive rotation.

```html
<ims-spinner src-data="./spinner-data.json"></ims-spinner>
```

Configuration example:
```json
{
  "imsType": "spinner",
  "autoplay": true,
  "speed": 50,
  "showCover": true,
  "baseUrl": "https://your-cdn.com/",
  "variants": ["320", "640", "1024"],
  "cdnIdList": ["frame1-id", "frame2-id", "..."]
}
```

## Installation

1. Include the components via CDN or local files:
```html
<script type="importmap">
  {
    "imports": {
      "@symbiotejs/symbiote": "https://esm.run/@symbiotejs/symbiote"
    }
  }
</script>
```

2. Import the desired component:
```html
<script type="module" src="path/to/component.js"></script>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT