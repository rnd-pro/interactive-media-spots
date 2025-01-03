import Symbiote, { css } from '@symbiotejs/symbiote';
import { loadSourceData } from '../../lib/loadSourceData.js';

export class ImsViewer extends Symbiote {

  init$ = {
    urlTpl: 'https://cdn.jsdelivr.net/npm/interactive-media-spots@{{version}}/wgt/{{imsType}}/+esm',
  }

  initCallback() {
    this.sub('srcData', async (srcDataUrl) => {
      this.innerHTML = '';
      if (!srcDataUrl) return;

      let srcData = await loadSourceData(srcDataUrl);
      let overrideVersion = this.getAttribute('version');
      let urlStr = this.$.urlTpl
        .replaceAll('{{version}}', overrideVersion || srcData.version || 'latest')
        .replaceAll('{{imsType}}', srcData.imsType);
      await import(urlStr);
      let imsTypeEl = document.createElement(`ims-${srcData.imsType}`);
      let elAttributes = [...this.attributes];
      let castAttr = elAttributes.find(attr => attr.name === 'cast-next');
      if (castAttr) {
        let castAttrIndex = elAttributes.indexOf(castAttr);
        elAttributes = elAttributes.slice(castAttrIndex + 1, elAttributes.length);
        elAttributes.forEach(attr => {
          imsTypeEl.setAttribute(attr.name, attr.value);
        });
      }
      let blob = new Blob([JSON.stringify(srcData)], {  
        type: 'application/json',
      });
      let url = URL.createObjectURL(blob);
      imsTypeEl.setAttribute('src-data', url);
      this.appendChild(imsTypeEl);
    });
  }

}

ImsViewer.bindAttributes({
  'src-data': 'srcData',
  'url-template': 'urlTpl',
});

ImsViewer.rootStyles = css`
ims-viewer {
  display: contents;
}
`;

ImsViewer.reg('ims-viewer');

export default ImsViewer;