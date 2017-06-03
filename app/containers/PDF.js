// this file was forked from https://github.com/erikras/react-pdfjs/blob/master/src/Pdf.js, Copyright (c) 2015 Erik Rasmussen (MIT license)

import React, { Component } from 'react';
import PDFJS from 'pdfjs-dist';
import { inject, observer } from 'mobx-react';
import Viewer from 'pdfjs-dist/web/pdf_viewer';

PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.entry.js';

class Pdf extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadPDFDocument(this.props);
    this.renderPdf();
  }

  componentWillReceiveProps(newProps) {
    const { pdf } = this.state;
    if (
      (newProps.file && newProps.file !== this.props.file) ||
      (newProps.content && newProps.content !== this.props.content)
    ) {
      var selection = window.getSelection
        ? window.getSelection()
        : document.selection ? document.selection : null;
      if (!!selection)
        selection.empty ? selection.empty() : selection.removeAllRanges();
      this.loadPDFDocument(newProps);
    }

    if (
      (pdf &&
        ((newProps.page && newProps.page !== this.props.page) ||
          (newProps.scale && newProps.scale !== this.props.scale))) ||
      (newProps.rotate && newProps.rotate !== this.props.rotate)
    ) {
      var selection = window.getSelection
        ? window.getSelection()
        : document.selection ? document.selection : null;
      if (!!selection)
        selection.empty ? selection.empty() : selection.removeAllRanges();
      this.setState({ page: null });
      pdf.getPage(newProps.page).then(this.onPageComplete);
    }
  }

  onDocumentComplete = pdf => {
    this.setState({ pdf: pdf });
    const { onDocumentComplete } = this.props;
    if (typeof onDocumentComplete === 'function') {
      onDocumentComplete(pdf.numPages);
    }
    pdf.getPage(this.props.page).then(this.onPageComplete);
  };

  onPageComplete = page => {
    this.setState({ page: page });
    this.renderPdf();
    const { onPageComplete } = this.props;
    if (typeof onPageComplete === 'function') {
      onPageComplete(page.pageIndex + 1);
    }
  };

  loadByteArray(byteArray) {
    PDFJS.getDocument(byteArray).then(this.onDocumentComplete);
  }

  loadPDFDocument(props) {
    if (!!props.file) {
      if (typeof props.file === 'string') {
        return PDFJS.getDocument(props.file).then(this.onDocumentComplete);
      }
      // Is a File object
      const reader = new FileReader();
      reader.onloadend = () =>
        this.loadByteArray(new Uint8Array(reader.result));
      reader.readAsArrayBuffer(props.file);
    } else if (!!props.content) {
      const bytes = window.atob(props.content);
      const byteLength = bytes.length;
      const byteArray = new Uint8Array(new ArrayBuffer(byteLength));
      for (let index = 0; index < byteLength; index++) {
        byteArray[index] = bytes.charCodeAt(index);
      }
      this.loadByteArray(byteArray);
    } else {
      throw new Error(
        'React-PDFjs works with a file(URL) or (base64)content. At least one needs to be provided!'
      );
    }
  }

  renderPdf() {
    const { page } = this.state;
    if (page) {
      let { canvas, divref } = this.props.store.refs;
      if (canvas.getDOMNode) {
        // compatible with react 0.13
        canvas = canvas.getDOMNode();
      }
      const canvasContext = canvas.getContext('2d');
      const { scale, rotate } = this.props;
      const viewport = page.getViewport(scale, rotate);
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      page
        .render({ canvasContext, viewport })
        .then(() => page.getTextContent())
        .then(textContent => {
          const textLayer = new Viewer.PDFJS.TextLayerBuilder({
            textLayerDiv: divref,
            pageIndex: this.props.page,
            viewport: viewport
          });

          // Set text-fragments
          textLayer.setTextContent(textContent);

          // Render text-fragments
          textLayer.render();
        });
    }
  }

  render() {
    const { loading, style } = this.props;
    const { page } = this.state;
    return page
      ? <div className="page" style={{ position: 'relative' }}>
          <div className="canvasWrapper">
            <canvas style={style} ref={e => this.props.store.setCanvasRef(e)} />
          </div>
          <div
            className="textLayer"
            ref={e => this.props.store.setTextRef(e)}
            style={{ position: 'absolute' }}
          />
        </div>
      : loading || <div>Loading PDF...</div>;
  }
}

Pdf.displayName = 'React-PDFjs';
export default inject('store')(observer(Pdf));
